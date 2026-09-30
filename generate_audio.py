"""
Generate Edge TTS narration audio for all story chapters.
Part 1 → AntonioNeural (Brazilian Portuguese male)
Part 2 → FranciscaNeural (Brazilian Portuguese female)

Output: public/audio/{antonio,francisca}/{chapterId}.mp3
"""
import asyncio
import os
import json
import re
import edge_tts

VOICE_ANTONIO = "pt-BR-AntonioNeural"
VOICE_FRANCISCA = "pt-BR-FranciscaNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")

def extract_chapters(content, is_part2=False):
    """Extract chapter IDs and their narrative text from story.ts or storyPart2.ts"""
    if is_part2:
        start_marker = 'export const part2Chapters: Record<string, StoryChapter> = {'
    else:
        start_marker = 'export const storyChapters: Record<string, StoryChapter> = {'

    try:
        start_idx = content.index(start_marker)
    except ValueError:
        return {}

    # Find the opening brace AFTER the start_marker
    # We need to find the first '{' that belongs to this object, not nested ones
    brace_start = content.index('{', start_idx)
    brace_count = 0
    i = brace_start
    end_idx = -1
    while i < len(content):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i + 1
                break
        i += 1

    if end_idx == -1:
        return {}

    chapters_obj = content[brace_start:end_idx]

    # Find each chapter in the chapters object
    chapter_pattern = r'"([^"]+)"\s*:\s*\{'
    matches = list(re.finditer(chapter_pattern, chapters_obj))

    result = {}
    for match in matches:
        chapter_id = match.group(1)
        chapter_start = match.end()

        # Find matching closing brace
        count = 1
        j = chapter_start
        chapter_end = -1
        while j < len(chapters_obj):
            if chapters_obj[j] == '{':
                count += 1
            elif chapters_obj[j] == '}':
                count -= 1
                if count == 0:
                    chapter_end = j + 1
                    break
            j += 1

        if chapter_end == -1:
            continue

        chapter_content = chapters_obj[chapter_start:chapter_end - 1]

        # Extract narrative field
        narrative_start = chapter_content.find('"narrative":')
        if narrative_start == -1:
            continue

        bracket_start = chapter_content.index('[', narrative_start)
        bracket_count = 0
        k = bracket_start
        while k < len(chapter_content):
            if chapter_content[k] == '[':
                bracket_count += 1
            elif chapter_content[k] == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    break
            k += 1

        narrative_array_str = chapter_content[bracket_start:k + 1]

        # Extract strings from the array
        lines = re.findall(r'"([^"]+)"', narrative_array_str)
        if not lines:
            lines = re.findall(r"'([^']+)'", narrative_array_str)

        # Clean {{...}} markers
        clean_lines = []
        for line in lines:
            cleaned = re.sub(r'\{\{/?[^}]+\}\}', '', line).strip()
            if cleaned:
                clean_lines.append(cleaned)

        if clean_lines:
            result[chapter_id] = clean_lines

    return result

async def generate_audio(chapter_id, lines, voice, output_dir):
    """Generate a single MP3 file for a chapter's narrative."""
    text = " ".join(lines)
    output_path = os.path.join(output_dir, f"{chapter_id}.mp3")

    if os.path.exists(output_path):
        print(f"  [skip] {chapter_id} (already exists)")
        return

    try:
        communicate = edge_tts.Communicate(text, voice, rate="-5%")
        await communicate.save(output_path)
        print(f"  [ok]   {chapter_id}")
    except Exception as e:
        print(f"  [err]  {chapter_id}: {e}")

async def main():
    base_dir = os.path.dirname(__file__)

    # Read story files
    story1_path = os.path.join(base_dir, "src", "data", "story.ts")
    story2_path = os.path.join(base_dir, "src", "data", "storyPart2.ts")

    with open(story1_path, "r", encoding="utf-8") as f:
        content1 = f.read()
    with open(story2_path, "r", encoding="utf-8") as f:
        content2 = f.read()

    chapters1 = extract_chapters(content1, False)
    chapters2 = extract_chapters(content2, True)

    print(f"Part 1: {len(chapters1)} chapters")
    print(f"Part 2: {len(chapters2)} chapters")

    # Create output directories
    antonio_dir = os.path.join(OUTPUT_DIR, "antonio")
    francisca_dir = os.path.join(OUTPUT_DIR, "francisca")
    os.makedirs(antonio_dir, exist_ok=True)
    os.makedirs(francisca_dir, exist_ok=True)

    # Generate Part 1 (Antonio)
    print("\nGenerating Part 1 (Antonio)...")
    tasks1 = [
        generate_audio(cid, lines, VOICE_ANTONIO, antonio_dir)
        for cid, lines in chapters1.items()
    ]
    await asyncio.gather(*tasks1)

    # Generate Part 2 (Francisca)
    print("\nGenerating Part 2 (Francisca)...")
    tasks2 = [
        generate_audio(cid, lines, VOICE_FRANCISCA, francisca_dir)
        for cid, lines in chapters2.items()
    ]
    await asyncio.gather(*tasks2)

    print(f"\nDone! Audio files in {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
