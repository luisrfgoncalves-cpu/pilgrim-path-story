/**
 * Social sharing utilities — generates share text and uses Web Share API.
 * Works on mobile (WhatsApp, Instagram, Telegram, etc.)
 */

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

/** Share game result */
export function shareResult(attrs: { fe: number; perseveranca: number; discernimento: number; coragem: number }, choicesMade: number, phase: number): Promise<boolean> {
  const total = attrs.fe + attrs.perseveranca + attrs.discernimento + attrs.coragem;
  const dominant = Object.entries(attrs).sort(([, a], [, b]) => b - a)[0];
  const dominantLabels: Record<string, string> = {
    fe: 'Fé 🔥',
    perseveranca: 'Perseverança ⛰️',
    discernimento: 'Discernimento 👁️',
    coragem: 'Coragem 🛡️',
  };

  const text = `⛪ Estou na Fase ${phase} d'O Peregrino!\n\n` +
    `📊 Meus atributos:\n` +
    `🔥 Fé: ${attrs.fe} | ⛰️ Perseverança: ${attrs.perseveranca}\n` +
    `👁️ Discernimento: ${attrs.discernimento} | 🛡️ Coragem: ${attrs.coragem}\n\n` +
    `💪 Atributo dominante: ${dominantLabels[dominant[0]] || dominant[0]}\n` +
    `🎯 Decisões tomadas: ${choicesMade}\n` +
    `📖 Total de poder: ${total}\n\n` +
    `Viva essa jornada interativa! 🚶‍♂️✨`;

  return shareNative({
    title: 'O Peregrino — Jornada Interativa',
    text,
    url: window.location.origin,
  });
}

/** Share generic content via Web Share API */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (e) {
      // User cancelled or share failed
      if ((e as Error).name !== 'AbortError') {
        fallbackCopy(data.text + (data.url ? `\n${data.url}` : ''));
      }
      return false;
    }
  }
  // Fallback: copy to clipboard
  return fallbackCopy(data.text + (data.url ? `\n${data.url}` : ''));
}

async function fallbackCopy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Last resort: textarea trick
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}
