import json
import asyncio
import edge_tts
import os

VOICE = "en-US-JennyNeural"
RATE = "-25%"
PITCH = "+0Hz"
VOLUME = "+0%"

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
VOCAB_PATH = os.path.join(BASE_DIR, "public", "vocab.json")
WORD_DIR = os.path.join(BASE_DIR, "public", "audio_word")
EXAMPLE_DIR = os.path.join(BASE_DIR, "public", "audio_example")

os.makedirs(WORD_DIR, exist_ok=True)
os.makedirs(EXAMPLE_DIR, exist_ok=True)

async def generate():
    with open(VOCAB_PATH, "r", encoding="utf-8") as f:
        vocab = json.load(f)

    total = len(vocab)
    print(f"共 {total} 条，开始生成音频...")

    for idx, item in enumerate(vocab):
        word_id = item["id"]
        word = item["word"]
        example = item["example"]

        word_path = os.path.join(WORD_DIR, f"{word_id}.mp3")
        example_path = os.path.join(EXAMPLE_DIR, f"{word_id}.mp3")

        if not os.path.exists(word_path):
            communicate = edge_tts.Communicate(
                text=word,
                voice=VOICE,
                rate=RATE,
                pitch=PITCH,
                volume=VOLUME
            )
            await communicate.save(word_path)

        if not os.path.exists(example_path):
            communicate = edge_tts.Communicate(
                text=example,
                voice=VOICE,
                rate=RATE,
                pitch=PITCH,
                volume=VOLUME
            )
            await communicate.save(example_path)

        print(f"{idx+1}/{total} 完成：{word_id}")

    print("✅ 全部生成完成！")

asyncio.run(generate())