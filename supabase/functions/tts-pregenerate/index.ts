import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

/**
 * tts-pregenerate — Gera áudios diretamente (sem chamar outra edge function).
 * 
 * POST /tts-pregenerate
 * Body: { phrases: [{text, emotion}], batchSize?, delayMs?, startFrom?, forceProvider? }
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

const VOICE_SETTINGS: Record<EmotionType, {
  stability: number; similarity_boost: number; style: number; speed: number;
}> = {
  neutral:   { stability: 0.50, similarity_boost: 0.75, style: 0.30, speed: 0.95 },
  dramatic:  { stability: 0.25, similarity_boost: 0.80, style: 0.70, speed: 0.90 },
  solemn:    { stability: 0.60, similarity_boost: 0.70, style: 0.40, speed: 0.80 },
  urgent:    { stability: 0.30, similarity_boost: 0.75, style: 0.60, speed: 1.10 },
  celestial: { stability: 0.55, similarity_boost: 0.80, style: 0.50, speed: 0.85 },
  villain:   { stability: 0.20, similarity_boost: 0.85, style: 0.80, speed: 0.88 },
};

function preprocessText(text: string, emotion: EmotionType): string {
  let p = text;
  p = p.replace(/\s*—\s*/g, '... ');
  p = p.replace(/\s*–\s*/g, '... ');
  p = p.replace(/!{2,}/g, '!');
  p = p.replace(/"([^"]+)"/g, '... "$1" ...');
  p = p.replace(/"([^"]+)"/g, '... "$1" ...');
  if (emotion === 'solemn' || emotion === 'celestial') p = p.replace(/,\s/g, ', ... ');
  if (emotion === 'villain') p = p.replace(/\b(destruição|morte|trevas|maldade|condenação|inferno)\b/gi, (m) => `... ${m.toUpperCase()} ...`);
  p = p.replace(/(\.\.\.\s*){3,}/g, '... ').replace(/\s{2,}/g, ' ');
  return p.trim();
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

let keyIndex = 0;

function getKeys(): string[] {
  return [
    Deno.env.get('ELEVENLABS_API_KEY_1'),
    Deno.env.get('ELEVENLABS_API_KEY_2'),
    Deno.env.get('ELEVENLABS_API_KEY_3'),
    Deno.env.get('ELEVENLABS_API_KEY_4'),
    Deno.env.get('ELEVENLABS_API_KEY_5'),
    Deno.env.get('ELEVENLABS_API_KEY_6'),
  ].filter((k): k is string => !!k && k.length > 0);
}

async function generateElevenLabs(text: string, emotion: EmotionType, singleKeyIdx: number): Promise<ArrayBuffer | null> {
  const keys = getKeys();
  if (keys.length === 0) return null;
  const key = keys[singleKeyIdx % keys.length];
  const settings = VOICE_SETTINGS[emotion] || VOICE_SETTINGS.neutral;
  const processed = preprocessText(text, emotion);

  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_22050_32`,
      {
        method: 'POST',
        headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: processed,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: settings.stability,
            similarity_boost: settings.similarity_boost,
            style: settings.style,
            use_speaker_boost: true,
            speed: settings.speed,
          },
        }),
      },
    );

    if (resp.status === 429 || resp.status === 401) {
      const err = await resp.text();
      console.log(`[PreGen] Key ${singleKeyIdx} limited: ${err.slice(0, 80)}`);
      return null;
    }

    if (!resp.ok) {
      const err = await resp.text();
      console.log(`[PreGen] EL error ${resp.status}: ${err.slice(0, 100)}`);
      return null;
    }

    const buf = await resp.arrayBuffer();
    console.log(`[PreGen] EL key${singleKeyIdx} OK (${(buf.byteLength/1024).toFixed(1)}KB)`);
    return buf;
  } catch (e) {
    console.log(`[PreGen] EL error: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      batchSize = 3,
      delayMs = 15000,
      startFrom = 0,
      phrases = [],
      keyIdx = 0,
    } = await req.json();

    if (!Array.isArray(phrases) || phrases.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Provide "phrases" array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const batch = phrases.slice(startFrom, startFrom + batchSize);
    const results = {
      generated: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
      total: phrases.length,
      processed: startFrom + batch.length,
      nextStartFrom: startFrom + batch.length,
      done: startFrom + batch.length >= phrases.length,
      keyUsed: keyIdx,
    };

    for (let i = 0; i < batch.length; i++) {
      const entry = batch[i];
      if (!entry.text || !entry.emotion) {
        results.failed++;
        continue;
      }

      const hash = await hashKey(entry.text, entry.emotion);
      const cachePath = `elevenlabs/${entry.emotion}/${hash}.mp3`;

      // Check cache
      const { data: existing } = await supabase.storage
        .from('tts-cache')
        .download(cachePath);

      if (existing && existing.size > 0) {
        console.log(`[PreGen] SKIP: ${entry.text.slice(0, 40)}...`);
        results.skipped++;
        continue;
      }

      // Generate directly
      const audio = await generateElevenLabs(entry.text, entry.emotion as EmotionType, keyIdx);

      if (audio && audio.byteLength > 100) {
        const { error: upErr } = await supabase.storage
          .from('tts-cache')
          .upload(cachePath, audio, { contentType: 'audio/mpeg', cacheControl: '604800', upsert: true });

        if (upErr) {
          console.log(`[PreGen] Upload error: ${upErr.message}`);
          results.failed++;
        } else {
          console.log(`[PreGen] STORED: ${cachePath}`);
          results.generated++;
        }
      } else {
        results.failed++;
        results.errors.push(`Key${keyIdx} failed for: ${entry.text.slice(0, 30)}...`);
        // Stop batch on failure - likely rate limited
        results.nextStartFrom = startFrom + i;
        results.processed = startFrom + i;
        break;
      }

      // Delay between generations
      if (i < batch.length - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
