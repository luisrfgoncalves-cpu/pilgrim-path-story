import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

/**
 * tts-pregenerate — Edge Function para pré-gerar áudios da narrativa.
 * 
 * Suporta forceProvider para gerar com um provedor específico.
 * Gera 1 frase por vez com delay entre cada para evitar rate-limit.
 * 
 * POST /tts-pregenerate
 * Body: { phrases: [{text, emotion}], batchSize?, delayMs?, startFrom?, forceProvider? }
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NarrativeEntry {
  text: string;
  emotion: string;
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      batchSize = 5,
      delayMs = 6000,
      startFrom = 0,
      phrases = [],
      forceProvider,
    } = await req.json();

    if (!Array.isArray(phrases) || phrases.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Provide "phrases" array with { text, emotion } objects',
          example: { phrases: [{ text: 'Cristão caminhou...', emotion: 'solemn' }], batchSize: 5, forceProvider: 'freetts' },
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const batch = phrases.slice(startFrom, startFrom + batchSize);
    const providerToCheck = forceProvider || 'freetts';
    
    const results = {
      generated: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
      total: phrases.length,
      processed: startFrom + batch.length,
      nextStartFrom: startFrom + batch.length,
      done: startFrom + batch.length >= phrases.length,
      provider: providerToCheck,
    };

    for (let i = 0; i < batch.length; i++) {
      const entry = batch[i] as NarrativeEntry;
      if (!entry.text || !entry.emotion) {
        results.failed++;
        results.errors.push(`Invalid entry at index ${startFrom + i}`);
        continue;
      }

      const hash = await hashKey(entry.text, entry.emotion);
      const cachePath = `${providerToCheck}/${entry.emotion}/${hash}.mp3`;

      // Check if already cached for this provider
      const { data: existing } = await supabase.storage
        .from('tts-cache')
        .download(cachePath);

      if (existing && existing.size > 0) {
        console.log(`[PreGen] SKIP (cached): ${entry.text.slice(0, 50)}...`);
        results.skipped++;
        continue;
      }

      // Generate via the main TTS function with forceProvider
      try {
        const ttsUrl = `${supabaseUrl}/functions/v1/elevenlabs-tts`;
        const response = await fetch(ttsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({
            text: entry.text,
            emotion: entry.emotion,
            forceProvider: providerToCheck,
          }),
        });

        if (response.ok) {
          await response.arrayBuffer();
          console.log(`[PreGen ${providerToCheck}] GENERATED: ${entry.text.slice(0, 50)}...`);
          results.generated++;
        } else {
          const err = await response.text();
          console.log(`[PreGen] FAILED (${response.status}): ${err.slice(0, 100)}`);
          results.failed++;
          results.errors.push(`${entry.text.slice(0, 30)}... → ${response.status}`);
          
          if (response.status === 503) {
            console.log(`[PreGen] Rate-limited — stopping batch. Resume from ${startFrom + i}`);
            results.nextStartFrom = startFrom + i;
            results.processed = startFrom + i;
            break;
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`[PreGen] ERROR: ${msg}`);
        results.failed++;
        results.errors.push(msg.slice(0, 100));
      }

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
