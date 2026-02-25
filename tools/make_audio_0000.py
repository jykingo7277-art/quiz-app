import asyncio
from pathlib import Path
import edge_tts

VOICE = "en-US-JennyNeural"
RATE = "-25%"
PITCH = "+0Hz"
VOLUME = "+0%"

WORD = "alter"
EXAMPLE = "He decided to alter his plan."

async def gen(text: str, out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tts = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate=RATE,
        pitch=PITCH,
        volume=VOLUME
    )
    await tts.save(str(out_path))

async def main():
    # ✅ 加长停顿：每次单词后用更多点号
    word_text = f"{WORD}....... {WORD}....... {WORD}......."
    await gen(word_text, Path("public/audio_word/0000.mp3"))

    # 例句仍然一次（保持你觉得刚刚好）
    await gen(EXAMPLE, Path("public/audio_example/0000.mp3"))

    print("Wrote: public/audio_word/0000.mp3")
    print("Wrote: public/audio_example/0000.mp3")

asyncio.run(main())
