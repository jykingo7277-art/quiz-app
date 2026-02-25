import asyncio
from pathlib import Path
import edge_tts

VOICE = "en-US-GuyNeural"

# ✅ 纯文字：不会读出任何标签
# 用句号制造停顿，三次
TEXT = "alter. alter. alter."

out_dir = Path("public/audio_word")
out_dir.mkdir(parents=True, exist_ok=True)

# ✅ 全新文件名，避开缓存/旧文件
out_path = out_dir / "onlyword_0000.mp3"

async def main():
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+0%")
    await communicate.save(str(out_path))

asyncio.run(main())
print("Wrote:", out_path)
