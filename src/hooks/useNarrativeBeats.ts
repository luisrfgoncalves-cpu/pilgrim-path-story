/**
 * useNarrativeBeats — groups narrative lines into readable beats of up to 3 lines.
 * Only very short, high-impact dramatic lines become solo beats.
 */

const MARKUP_TAGS = /\{\{(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}/;
const STRONG_MARKUP_TAGS = /^\s*\{\{(shout|divine|villain|heart)\}\}/;
const MARKUP_STRIP = /\{\{\/?(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}/g;
const FULLY_WRAPPED_MARKUP = /^\s*\{\{(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}[\s\S]*\{\{\/(shout|whisper|divine|emphasis|dialog|villain|heart|tremor|fade)\}\}\s*$/;

/** Check if a line is a brief dramatic punchline that deserves solo display */
function isDramaticLine(line: string): boolean {
  if (!MARKUP_TAGS.test(line) || !FULLY_WRAPPED_MARKUP.test(line) || !STRONG_MARKUP_TAGS.test(line)) {
    return false;
  }

  const stripped = line.replace(MARKUP_STRIP, '').replace(/\s+/g, ' ').trim();
  const wordCount = stripped ? stripped.split(' ').length : 0;
  const punctuationCount = (stripped.match(/[.!?…]+/g) || []).length;

  return stripped.length <= 72 && wordCount <= 10 && punctuationCount <= 2;
}

export interface NarrativeBeat {
  lines: string[];
  /** Index of first line in the original narrative array */
  startIndex: number;
}

/**
 * Groups narrative lines into beats.
 * - Only short dramatic punchlines become solo beats
 * - Regular lines are grouped in readable blocks of up to 3
 */
export function groupIntoBeats(narrative: string[], linesPerBeat = 3): NarrativeBeat[] {
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
