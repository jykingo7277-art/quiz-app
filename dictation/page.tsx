"use client";

import { useRef, useState } from "react";

export default function Page() {
  const audioRef = useRef(null);
  const [status, setStatus] = useState("");

  // ⭐ 可调：只播单词部分（秒）。如果听到例句，调小；如果单词未播完，调大一点。
  const WORD_ONLY_SECONDS = 2.2;

  async function playWordOnly3x() {
    const audio = audioRef.current;
    if (!audio) return;

    setStatus("Playing word-only ×3...");

    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "/audio_tmp/0000.mp3";

        audio.onloadedmetadata = () => {
          audio.play().catch(() => resolve());

          const t = setTimeout(() => {
            audio.pause();
            resolve();
          }, Math.max(200, WORD_ONLY_SECONDS * 1000));

          audio.onended = () => {
            clearTimeout(t);
            resolve();
          };
          audio.onerror = () => {
            clearTimeout(t);
            resolve();
          };
        };

        audio.onerror = () => resolve();
      });
    }

    setStatus("Done ✅");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Dictation（测试）</h1>

      <button
        onClick={playWordOnly3x}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #444" }}
      >
        🔊 播放单词（截断前段）×3
      </button>

      <div style={{ marginTop: 10, opacity: 0.8 }}>{status}</div>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        截断秒数 WORD_ONLY_SECONDS = {WORD_ONLY_SECONDS}s（听到例句就调小）
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
| Set-Content -Encoding UTF8 app\dictation\page.tsx