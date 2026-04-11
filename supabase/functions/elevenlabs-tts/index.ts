import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EmotionType = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

/**
 * Voice settings calibrados para narração expressiva tipo dublagem profissional.
 * Cada emoção controla: estabilidade (consistência), estilo (expressividade),
 * velocidade e similaridade (fidelidade ao timbre original).
 * 
 * stability baixa = mais variação emocional (bom para drama)
 * style alto = mais expressividade (bom para momentos épicos)
 * speed < 1.0 = mais lento e solene
 */
const VOICE_SETTINGS: Record<EmotionType, {
  stability: number;
  similarity_boost: number;
  style: number;
  speed: number;
}> = {
  neutral: {
    stability: 0.50,
    similarity_boost: 0.75,
    style: 0.30,
    speed: 0.95,  // Ligeiramente mais lento que fala normal para clareza
  },
  dramatic: {
    stability: 0.25,   // Mais variação = mais emoção
    similarity_boost: 0.80,
    style: 0.70,        // Alta expressividade
    speed: 0.90,        // Pausado para impacto
  },
  solemn: {
    stability: 0.60,    // Mais estável = gravidade
    similarity_boost: 0.70,
    style: 0.40,
    speed: 0.80,        // Bem lento, reverente
  },
  urgent: {
    stability: 0.30,    // Variação para tensão
    similarity_boost: 0.75,
    style: 0.60,
    speed: 1.10,        // Acelerado, respiração curta
  },
  celestial: {
    stability: 0.55,
    similarity_boost: 0.80,
    style: 0.50,
    speed: 0.85,        // Lento, majestoso
  },
  villain: {
    stability: 0.20,    // Muito instável = ameaçador, imprevisível
    similarity_boost: 0.85,
    style: 0.80,        // Máxima expressividade
    speed: 0.88,        // Lento e sinistro
  },
};

// Daniel — voz masculina PT-BR, quente e narrativa
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

/**
 * Pré-processamento do texto para narração expressiva.
 * Adiciona pausas naturais, respira pontuação, cria ritmo de dublagem.
 */
function preprocessForExpressiveNarration(text: string, emotion: EmotionType): string {
  let processed = text;

  // ═══ 1. Respeitar pontuação com pausas naturais ═══
  // Reticências = pausa dramática longa (ElevenLabs respeita "..." nativamente)
  // Já funciona bem, manter.

  // ═══ 2. Travessões = pausa de respiração ═══
  processed = processed.replace(/\s*—\s*/g, '... ');
  processed = processed.replace(/\s*–\s*/g, '... ');

  // ═══ 3. Exclamações duplas/triplas = ênfase ═══
  processed = processed.replace(/!{2,}/g, '!');

  // ═══ 4. Aspas de diálogo = pausa antes e depois para separar narrador de personagem ═══
  processed = processed.replace(/"([^"]+)"/g, '... "$1" ...');
  processed = processed.replace(/"([^"]+)"/g, '... "$1" ...');

  // ═══ 5. Palavras em CAPS = o ElevenLabs já enfatiza naturalmente ═══
  // Não precisa mudar.

  // ═══ 6. Ajustes por emoção ═══
  if (emotion === 'solemn' || emotion === 'celestial') {
    // Adicionar micro-pausas em vírgulas para gravidade
    processed = processed.replace(/,\s/g, ', ... ');
  }

  if (emotion === 'villain') {
    // Sussurro sinistro — palavras-chave ganham ênfase
    processed = processed.replace(/\b(destruição|morte|trevas|maldade|condenação|inferno)\b/gi, 
      (match) => `... ${match.toUpperCase()} ...`);
  }

  if (emotion === 'urgent') {
    // Menos pausas, mais corrido para tensão
    processed = processed.replace(/\.\.\.\s\.\.\./g, '...');
  }

  // ═══ 7. Limpar pausas excessivas ═══
  processed = processed.replace(/(\.\.\.\s*){3,}/g, '... ');
  processed = processed.replace(/\s{2,}/g, ' ');

  return processed.trim();
}

/**
 * Rotação inteligente de chaves — usa 1 por vez,
 * troca só quando a atual falhar (429/401).
 */
let currentKeyIndex = 0;

function getApiKeys(): string[] {
  return [
    Deno.env.get('ELEVENLABS_API_KEY_1'),
    Deno.env.get('ELEVENLABS_API_KEY_2'),
    Deno.env.get('ELEVENLABS_API_KEY_3'),
    Deno.env.get('ELEVENLABS_API_KEY_4'),
    Deno.env.get('ELEVENLABS_API_KEY_5'),
    Deno.env.get('ELEVENLABS_API_KEY_6'),
  ].filter((k): k is string => typeof k === 'string' && k.length > 0);
}

function getCurrentKey(keys: string[]): string {
  if (keys.length === 0) throw new Error('No keys configured');
  return keys[currentKeyIndex % keys.length];
}

function rotateToNextKey(keys: string[]): string | null {
  const startIndex = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  // Se voltou ao mesmo, todas falharam
  if (currentKeyIndex === startIndex) return null;
  return keys[currentKeyIndex];
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateWithKey(
  apiKey: string,
  text: string,
  settings: typeof VOICE_SETTINGS.neutral,
): Promise<Response> {
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
    },
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
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 5000 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
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

    // ═══ STEP 2: Pre-process text for expressive narration ═══
    const emotionType = (emotion as EmotionType) || 'neutral';
    const expressiveText = preprocessForExpressiveNarration(text, emotionType);
    const settings = VOICE_SETTINGS[emotionType] || VOICE_SETTINGS.neutral;

    console.log(`[TTS] Emotion: ${emotionType}, Speed: ${settings.speed}, Style: ${settings.style}`);

    // ═══ STEP 3: Generate with smart key rotation ═══
    const allKeys = getApiKeys();

    if (allKeys.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No ElevenLabs API keys configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let attempts = 0;
    const maxAttempts = Math.min(allKeys.length, 6); // No máximo tenta todas as chaves

    while (attempts < maxAttempts) {
      const apiKey = getCurrentKey(allKeys);
      attempts++;

      try {
        const response = await generateWithKey(apiKey, expressiveText, settings);

        if (response.status === 429 || response.status === 401) {
          const errText = await response.text();
          console.log(`[TTS] Key ${currentKeyIndex} limited (${response.status}): ${errText.slice(0, 80)}`);
          const nextKey = rotateToNextKey(allKeys);
          if (!nextKey) break; // Todas tentadas
          // Pequeno delay entre rotações para não parecer bot
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.log(`[TTS] ElevenLabs error [${response.status}]: ${errorText.slice(0, 200)}`);
          return new Response(
            JSON.stringify({ error: `ElevenLabs error: ${response.status}` }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }

        const audioBuffer = await response.arrayBuffer();

        // ═══ STEP 4: Save to global cache ═══
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
          },
        });
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        console.log(`[TTS] Key ${currentKeyIndex} error: ${errMsg}`);
        rotateToNextKey(allKeys);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ error: 'All API keys rate-limited. Try again in a few minutes.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
