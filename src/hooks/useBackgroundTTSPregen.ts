import { useEffect, useRef } from 'react';
import { ALL_NARRATIVE_PHRASES } from '@/data/ttsPhrasesManifest';

/**
 * useBackgroundTTSPregen — Silently pre-generates TTS audio in background.
 * 
 * When the app loads, this hook:
 * 1. Checks which phrases are already cached in Supabase Storage
 * 2. Generates missing ones via the tts-pregenerate edge function
 * 3. Sends 1 phrase at a time, rotating keys, with 45s delay between each
 * 4. Stops when all phrases are cached or on error
 * 
 * All work is invisible to the user. No UI, no blocking.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const PREGEN_INTERVAL = 45_000; // 45 seconds between each generation
const STORAGE_KEY = 'tts-pregen-progress';

interface PregenProgress {
  completedHashes: string[];
  lastKeyIdx: number;
  lastRunAt: number;
}

function getProgress(): PregenProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { completedHashes: [], lastKeyIdx: 0, lastRunAt: 0 };
}

function saveProgress(progress: PregenProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* ignore */ }
}

async function hashKey(text: string, emotion: string): Promise<string> {
  const data = new TextEncoder().encode(`${emotion}:${text}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkCached(emotion: string, hash: string): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/storage/v1/object/public/tts-cache/elevenlabs/${emotion}/${hash}.mp3`;
    const resp = await fetch(url, { method: 'HEAD' });
    return resp.ok;
  } catch {
    return false;
  }
}

export function useBackgroundTTSPregen() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);
  const abortRef = useRef(false);

  useEffect(() => {
    // Don't run in dev hot-reload scenarios
    if (runningRef.current) return;
    runningRef.current = true;
    abortRef.current = false;

    const run = async () => {
      const progress = getProgress();

      // Don't run more than once every 30 seconds
      if (Date.now() - progress.lastRunAt < 30_000) {
        scheduleNext();
        return;
      }

      // Find next uncached phrase
      for (let i = 0; i < ALL_NARRATIVE_PHRASES.length; i++) {
        if (abortRef.current) break;

        const phrase = ALL_NARRATIVE_PHRASES[i];
        const hash = await hashKey(phrase.text, phrase.emotion);

        // Skip if already completed locally
        if (progress.completedHashes.includes(hash)) continue;

        // Check if cached in Supabase
        const cached = await checkCached(phrase.emotion, hash);
        if (cached) {
          progress.completedHashes.push(hash);
          saveProgress(progress);
          continue;
        }

        // Found one to generate!
        const keyIdx = (progress.lastKeyIdx + 1) % 6;

        try {
          console.log(`[BG-PreGen] Generating phrase ${i + 1}/${ALL_NARRATIVE_PHRASES.length} with key${keyIdx}...`);

          const resp = await fetch(`${SUPABASE_URL}/functions/v1/tts-pregenerate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify({
              phrases: [phrase],
              batchSize: 1,
              delayMs: 0,
              startFrom: 0,
              keyIdx,
            }),
          });

          if (resp.ok) {
            const result = await resp.json();
            if (result.generated > 0 || result.skipped > 0) {
              progress.completedHashes.push(hash);
              progress.lastKeyIdx = keyIdx;
              progress.lastRunAt = Date.now();
              saveProgress(progress);
              console.log(`[BG-PreGen] ✅ Done (${progress.completedHashes.length}/${ALL_NARRATIVE_PHRASES.length})`);
            } else {
              // Key might be rate-limited, try next key next time
              progress.lastKeyIdx = keyIdx;
              progress.lastRunAt = Date.now();
              saveProgress(progress);
              console.log(`[BG-PreGen] ⏳ Key${keyIdx} limited, will try key${(keyIdx + 1) % 6} next`);
            }
          }
        } catch (e) {
          console.log(`[BG-PreGen] Error:`, e);
        }

        // Only generate 1 per cycle, then wait
        break;
      }

      // Check if all done
      if (progress.completedHashes.length >= ALL_NARRATIVE_PHRASES.length) {
        console.log(`[BG-PreGen] 🎉 All ${ALL_NARRATIVE_PHRASES.length} phrases cached!`);
        runningRef.current = false;
        return;
      }

      scheduleNext();
    };

    const scheduleNext = () => {
      if (abortRef.current) return;
      timerRef.current = setTimeout(run, PREGEN_INTERVAL);
    };

    // Start after 10 seconds (let app load first)
    timerRef.current = setTimeout(run, 10_000);

    return () => {
      abortRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      runningRef.current = false;
    };
  }, []);
}
