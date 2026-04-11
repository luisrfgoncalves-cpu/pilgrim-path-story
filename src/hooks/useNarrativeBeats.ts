/**
 * useNarrativeBeats — groups narrative lines into "beats" of 2-3 sentences.
 * Special markup lines ({{shout}}, {{divine}}, etc.) get their own solo beat.
 */

const MARKUP_TAGS = /\{\{(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}/;

/** Check if a line contains dramatic markup that deserves solo display */
function isDramaticLine(line: string): boolean {
  return MARKUP_TAGS.test(line);
}

export interface NarrativeBeat {
  lines: string[];
  /** Index of first line in the original narrative array */
  startIndex: number;
}

/**
 * Groups narrative lines into beats.
 * - Dramatic lines (with markup) become solo beats
 * - Regular lines are grouped in pairs of 2-3
 */
export function groupIntoBeats(narrative: string[], linesPerBeat = 5): NarrativeBeat[] {
  if (narrative.length === 0) return [];

  const beats: NarrativeBeat[] = [];
  let buffer: string[] = [];
  let bufferStart = 0;

  for (let i = 0; i < narrative.length; i++) {
    const line = narrative[i];

    if (isDramaticLine(line)) {
      // Flush buffer first
      if (buffer.length > 0) {
        beats.push({ lines: [...buffer], startIndex: bufferStart });
        buffer = [];
      }
      // Solo beat for dramatic line
      beats.push({ lines: [line], startIndex: i });
      bufferStart = i + 1;
    } else {
      if (buffer.length === 0) bufferStart = i;
      buffer.push(line);

      if (buffer.length >= linesPerBeat) {
        beats.push({ lines: [...buffer], startIndex: bufferStart });
        buffer = [];
        bufferStart = i + 1;
      }
    }
  }

  // Flush remaining
  if (buffer.length > 0) {
    beats.push({ lines: [...buffer], startIndex: bufferStart });
  }

  return beats;
}
