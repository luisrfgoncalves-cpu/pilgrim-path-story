import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';
type ProviderName = 'elevenlabs' | 'freetts' | 'eidosspeech';

const VOICE_SETTINGS: Record<EmotionType, {
  stability: number;
  similarity_boost: number;
  style: number;
  speed: number;
}> = {
  neutral:   { stability: 0.50, similarity_boost: 0.75, style: 0.30, speed: 0.95 },
  dramatic:  { stability: 0.25, similarity_boost: 0.80, style: 0.70, speed: 0.90 },
  solemn:    { stability: 0.60, similarity_boost: 0.70, style: 0.40, speed: 0.80 },
  urgent:    { stability: 0.30, similarity_boost: 0.75, style: 0.60, speed: 1.10 },
  celestial: { stability: 0.55, similarity_boost: 0.80, style: 0.50, speed: 0.85 },
  villain:   { stability: 0.20, similarity_boost: 0.85, style: 0.80, speed: 0.88 },
};

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

const FREETTS_VOICES: Record<EmotionType, string> = {
  neutral:   'pt-BR-FranciscaNeural',
  dramatic:  'pt-BR-AntonioNeural',
  solemn:    'pt-BR-FranciscaNeural',
  urgent:    'pt-BR-AntonioNeural',
  celestial: 'pt-BR-FranciscaNeural',
  villain:   'pt-BR-AntonioNeural',
};

// FreeTTS now uses rate as percentage offset string (e.g., "-5%", "+10%")
const FREETTS_RATES: Record<EmotionType, string> = {
  neutral: '-5%',
  dramatic: '-10%',
  solemn: '-20%',
  urgent: '+10%',
  celestial: '-15%',
  villain: '-12%',
};

function preprocessForExpressiveNarration(text: string, emotion: EmotionType): string {
  let processed = text;
  processed = processed.replace(/\s*—\s*/g, '... ');
  processed = processed.replace(/\s*–\s*/g, '... ');
  processed = processed.replace(/!{2,}/g, '!');
  processed = processed.replace(/"([^"]+)"/g, '... "$1" ...');
  processed = processed.replace(/"([^"]+)"/g, '... "$1" ...');
  if (emotion === 'solemn' || emotion === 'celestial') {
    processed = processed.replace(/,\s/g, ', ... ');
  }
  if (emotion === 'villain') {
    processed = processed.replace(/\b(destruição|morte|trevas|maldade|condenação|inferno)\b/gi,
      (match) => `... ${match.toUpperCase()} ...`);
  }
  if (emotion === 'urgent') {
    processed = processed.replace(/\.\.\.\s\.\.\./g, '...');
  }
  processed = processed.replace(/(\.\.\.\s*){3,}/g, '... ');
  processed = processed.replace(/\s{2,}/g, ' ');
  return processed.trim();
}

let currentKeyIndex = 0;

function getApiKeys(): string[] {
  return [
    Deno.env.get('ELEVENLABS_API_KEY_1'),
    Deno.env.get('ELEVENLABS_API_KEY_2'),
    Deno.env.get('ELEVENLABS_API_KEY_3'),
    Deno.env.get('ELEVENLABS_API_KEY_4'),
    Deno.env.get('ELEVENLABS_API_KEY_5'),
    Deno.env.get('ELEVENLABS_API_KEY_6'),
    Deno.env.get('ELEVENLABS_API_KEY_7'),
    Deno.env.get('ELEVENLABS_API_KEY_8'),
    Deno.env.get('ELEVENLABS_API_KEY_9'),
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);
}

function getCurrentKey(keys: string[]): string {
  return keys[currentKeyIndex % keys.length];
}

function rotateToNextKey(keys: string[]): boolean {
  const startIndex = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return currentKeyIndex !== startIndex;
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ═══ FreeTTS.org — Microsoft Neural voices (FREE, 2-step API) ═══
async function generateWithFreeTTS(text: string, emotion: EmotionType): Promise<ArrayBuffer | null> {
  try {
    const voice = FREETTS_VOICES[emotion] || 'pt-BR-FranciscaNeural';
    const rate = FREETTS_RATES[emotion] || '+0%';
    console.log(`[TTS FreeTTS] Trying voice: ${voice}, rate: ${rate}`);

    // Step 1: POST to generate — returns { file_id }
    const genResponse = await fetch('https://freetts.org/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, rate, pitch: '+0Hz' }),
    });
    if (!genResponse.ok) {
      console.log(`[TTS FreeTTS] Generate failed: ${genResponse.status}`);
      return null;
    }
    const genData = await genResponse.json();
    const fileId = genData?.file_id;
    if (!fileId) {
      console.log(`[TTS FreeTTS] No file_id in response`);
      return null;
    }

    // Step 2: GET audio file by file_id
    const audioResponse = await fetch(`https://freetts.org/api/audio/${fileId}`);
    if (!audioResponse.ok) {
      console.log(`[TTS FreeTTS] Audio download failed: ${audioResponse.status}`);
      return null;
    }
    const buffer = await audioResponse.arrayBuffer();
    if (buffer.byteLength < 100) {
      console.log(`[TTS FreeTTS] Response too small (${buffer.byteLength}B)`);
      return null;
    }
    console.log(`[TTS FreeTTS] Success (${(buffer.byteLength / 1024).toFixed(1)}KB)`);
    return buffer;
  } catch (e) {
    console.log(`[TTS FreeTTS] Error: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

// ═══ eidosSpeech — offline since April 2026, kept as stub for cache compatibility ═══
async function generateWithEidos(_text: string, _emotion: EmotionType): Promise<ArrayBuffer | null> {
  return null;
}

// ═══ ElevenLabs generation ═══
async function generateWithElevenLabs(
  text: string,
  settings: typeof VOICE_SETTINGS.neutral,
  allKeys: string[],
): Promise<ArrayBuffer | null> {
  if (allKeys.length === 0) return null;
  let attempts = 0;
  const maxAttempts = Math.min(allKeys.length, 6);
  while (attempts < maxAttempts) {
    const apiKey = getCurrentKey(allKeys);
    attempts++;
    try {
      const response = await fetch(
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
        },
      );
      if (response.status === 429 || response.status === 401) {
        const errText = await response.text();
        console.log(`[TTS EL] Key ${currentKeyIndex} limited: ${errText.slice(0, 80)}`);
        if (!rotateToNextKey(allKeys)) break;
        await new Promise(r => setTimeout(r, 500));
        continue;
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`[TTS EL] Error [${response.status}]: ${errorText.slice(0, 100)}`);
        return null;
      }
      const buffer = await response.arrayBuffer();
      console.log(`[TTS EL] Success (${(buffer.byteLength / 1024).toFixed(1)}KB)`);
      return buffer;
    } catch (e) {
      console.log(`[TTS EL] Key ${currentKeyIndex} error: ${e instanceof Error ? e.message : e}`);
      rotateToNextKey(allKeys);
      continue;
    }
  }
  return null;
}

// ═══ Provider priority for playback ═══
const PROVIDER_PRIORITY: ProviderName[] = ['elevenlabs', 'freetts', 'eidosspeech'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion = 'neutral', forceProvider } = await req.json();

    if (!text || typeof text !== 'string' || text.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 5000 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const cacheKey = await hashKey(text, emotion);
    const emotionType = (emotion as EmotionType) || 'neutral';

    // ═══ STEP 1: Check cache — try best provider first ═══
    // If forceProvider is set (pre-generation), skip cache check
    if (!forceProvider) {
      for (const provider of PROVIDER_PRIORITY) {
        const cachePath = `${provider}/${emotionType}/${cacheKey}.mp3`;
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
              'X-TTS-Source': provider,
            },
          });
        }
      }
      console.log(`[TTS Cache MISS] ${emotionType}/${cacheKey}`);
    }

    const expressiveText = preprocessForExpressiveNarration(text, emotionType);
    const settings = VOICE_SETTINGS[emotionType] || VOICE_SETTINGS.neutral;

    // ═══ STEP 2: Generate audio ═══
    let audioBuffer: ArrayBuffer | null = null;
    let source: ProviderName = 'elevenlabs';

    if (forceProvider) {
      // Pre-generation mode: use specific provider
      if (forceProvider === 'elevenlabs') {
        audioBuffer = await generateWithElevenLabs(expressiveText, settings, getApiKeys());
        source = 'elevenlabs';
      } else if (forceProvider === 'freetts') {
        audioBuffer = await generateWithFreeTTS(text, emotionType);
        source = 'freetts';
      } else if (forceProvider === 'eidosspeech') {
        audioBuffer = await generateWithEidos(text, emotionType);
        source = 'eidosspeech';
      }
    } else {
      // Normal mode: cascade
      audioBuffer = await generateWithElevenLabs(expressiveText, settings, getApiKeys());
      source = 'elevenlabs';

      if (!audioBuffer) {
        console.log(`[TTS] ElevenLabs unavailable, trying FreeTTS...`);
        audioBuffer = await generateWithFreeTTS(text, emotionType);
        source = 'freetts';
      }

      if (!audioBuffer) {
        console.log(`[TTS] FreeTTS unavailable, trying eidosSpeech...`);
        audioBuffer = await generateWithEidos(text, emotionType);
        source = 'eidosspeech';
      }
    }

    if (!audioBuffer) {
      return new Response(
        JSON.stringify({ error: 'All TTS providers unavailable. Try again later.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ═══ STEP 3: Save to provider-specific path ═══
    const cachePath = `${source}/${emotionType}/${cacheKey}.mp3`;
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
        console.log(`[TTS Cache STORED] ${cachePath} (${(audioBuffer.byteLength / 1024).toFixed(1)}KB)`);
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
        'X-TTS-Source': source,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
