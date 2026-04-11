import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

const VOICE_SETTINGS: Record<EmotionType, { stability: number; similarity_boost: number; style: number; speed: number }> = {
  neutral:   { stability: 0.5, similarity_boost: 0.75, style: 0.3, speed: 1.0 },
  dramatic:  { stability: 0.25, similarity_boost: 0.8, style: 0.7, speed: 0.95 },
  solemn:    { stability: 0.6, similarity_boost: 0.7, style: 0.4, speed: 0.85 },
  urgent:    { stability: 0.3, similarity_boost: 0.75, style: 0.6, speed: 1.15 },
  celestial: { stability: 0.55, similarity_boost: 0.8, style: 0.5, speed: 0.9 },
  villain:   { stability: 0.2, similarity_boost: 0.85, style: 0.8, speed: 0.9 },
};

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

/**
 * Rotação inteligente de chaves:
 * Usa apenas 1 chave por vez, troca só quando a atual falhar (429/401).
 * Evita disparar múltiplas chaves em sequência rápida (causa bloqueio anti-fraude).
 */
let currentKeyIndex = 0;

function getApiKeys(): string[] {
  return [
    Deno.env.get('ELEVENLABS_API_KEY_1'),
    Deno.env.get('ELEVENLABS_API_KEY_2'),
    Deno.env.get('ELEVENLABS_API_KEY_3'),
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);
}

function getCurrentKey(keys: string[]): string {
  if (keys.length === 0) throw new Error('No keys configured');
  return keys[currentKeyIndex % keys.length];
}

function rotateToNextKey(keys: string[]): string {
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return keys[currentKeyIndex];
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateWithKey(apiKey: string, text: string, settings: typeof VOICE_SETTINGS.neutral): Promise<Response> {
  return await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_22050_32`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: true,
          speed: settings.speed,
        },
      }),
    }
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion = 'neutral' } = await req.json();

    if (!text || typeof text !== 'string' || text.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 5000 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ═══ STEP 1: Check Supabase Storage cache ═══
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const cacheKey = await hashKey(text, emotion);
    const cachePath = `${emotion}/${cacheKey}.mp3`;

    const { data: cachedFile } = await supabase.storage
      .from('tts-cache')
      .download(cachePath);

    if (cachedFile && cachedFile.size > 0) {
      console.log(`[TTS Cache HIT] ${cachePath}`);
      const buffer = await cachedFile.arrayBuffer();
      return new Response(buffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=604800',
          'X-TTS-Cache': 'hit',
        },
      });
    }

    console.log(`[TTS Cache MISS] ${cachePath} — generating...`);

    // ═══ STEP 2: Generate with current key (single key, no rapid rotation) ═══
    const settings = VOICE_SETTINGS[emotion as EmotionType] || VOICE_SETTINGS.neutral;
    const allKeys = getApiKeys();
    
    if (allKeys.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No ElevenLabs API keys configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try current key first
    let apiKey = getCurrentKey(allKeys);
    let response = await generateWithKey(apiKey, text, settings);

    // If rate-limited, rotate to next key (only ONE rotation attempt)
    if (response.status === 429 || response.status === 401) {
      const errText = await response.text();
      console.log(`[TTS] Key ${currentKeyIndex} limited: ${errText.slice(0, 100)}`);
      
      if (allKeys.length > 1) {
        apiKey = rotateToNextKey(allKeys);
        console.log(`[TTS] Rotated to key ${currentKeyIndex}`);
        response = await generateWithKey(apiKey, text, settings);
        
        if (response.status === 429 || response.status === 401) {
          const errText2 = await response.text();
          console.log(`[TTS] Key ${currentKeyIndex} also limited: ${errText2.slice(0, 100)}`);
          return new Response(
            JSON.stringify({ error: 'API keys temporarily rate-limited. Try again in a few minutes.' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: 'API key rate-limited. Try again later.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[TTS] ElevenLabs error [${response.status}]: ${errorText.slice(0, 200)}`);
      return new Response(
        JSON.stringify({ error: `ElevenLabs error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // ═══ STEP 3: Save to cache ═══
    try {
      const { error: uploadError } = await supabase.storage
        .from('tts-cache')
        .upload(cachePath, audioBuffer, {
          contentType: 'audio/mpeg',
          cacheControl: '604800',
          upsert: true,
        });
      if (uploadError) {
        console.error(`[TTS Cache] Upload failed: ${uploadError.message}`);
      } else {
        console.log(`[TTS Cache STORED] ${cachePath}`);
      }
    } catch (e) {
      console.error(`[TTS Cache] Storage error: ${e}`);
    }

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800',
        'X-TTS-Cache': 'miss',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
