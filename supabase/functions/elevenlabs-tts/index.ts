import { corsHeaders } from '@supabase/supabase-js/cors';

type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

// Voice settings per emotion — stability baixa = mais expressividade
const VOICE_SETTINGS: Record<EmotionType, { stability: number; similarity_boost: number; style: number; speed: number }> = {
  neutral:   { stability: 0.5, similarity_boost: 0.75, style: 0.3, speed: 1.0 },
  dramatic:  { stability: 0.25, similarity_boost: 0.8, style: 0.7, speed: 0.95 },
  solemn:    { stability: 0.6, similarity_boost: 0.7, style: 0.4, speed: 0.85 },
  urgent:    { stability: 0.3, similarity_boost: 0.75, style: 0.6, speed: 1.15 },
  celestial: { stability: 0.55, similarity_boost: 0.8, style: 0.5, speed: 0.9 },
  villain:   { stability: 0.2, similarity_boost: 0.85, style: 0.8, speed: 0.9 },
};

// Daniel voice — deep, dramatic, works well for PT-BR narration
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

// Rotate between 3 API keys to maximize free tier (30k chars/month total)
let keyIndex = 0;

function getNextApiKey(): string {
  const keys = [
    Deno.env.get('ELEVENLABS_API_KEY_1'),
    Deno.env.get('ELEVENLABS_API_KEY_2'),
    Deno.env.get('ELEVENLABS_API_KEY_3'),
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error('No ElevenLabs API keys configured');
  }

  const key = keys[keyIndex % keys.length];
  keyIndex++;
  return key;
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

    const settings = VOICE_SETTINGS[emotion as EmotionType] || VOICE_SETTINGS.neutral;
    
    // Try each key until one works
    const keys = [getNextApiKey()];
    // If first fails, try remaining keys
    const allKeys = [
      Deno.env.get('ELEVENLABS_API_KEY_1'),
      Deno.env.get('ELEVENLABS_API_KEY_2'),
      Deno.env.get('ELEVENLABS_API_KEY_3'),
    ].filter(Boolean) as string[];

    let lastError: Error | null = null;

    for (const apiKey of allKeys) {
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
          }
        );

        if (response.status === 429 || response.status === 401) {
          // Rate limited or quota exceeded — try next key
          await response.text();
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`ElevenLabs API error [${response.status}]: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();

        return new Response(audioBuffer, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        continue;
      }
    }

    return new Response(
      JSON.stringify({ error: `All API keys exhausted: ${lastError?.message}` }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
