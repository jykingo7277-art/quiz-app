"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import TopNav from "../components/TopNav";

type VocabItem = {
  id: string; // "0000"
  word: string;
  cn: string;
  example: string;
};

type Plan = {
  remainingIds: string[];
};

type Phase = "idle" | "word" | "input" | "done";

const LS_DAILY_COUNT = "dictation_daily_count";
const LS_PLAN_PREFIX = "dictation_plan_"; // + YYYY-MM-DD

// ✅ upgraded progression
const LS_SEEN_IDS = "dictation_seen_ids_v1"; // string[]
const LS_CYCLE = "dictation_cycle_v1"; // number
const LS_DONE_PREFIX = "dictation_done_"; // + YYYY-MM-DD => timestamp

const DEFAULT_DAILY_COUNT = 15;
const MIN_COUNT = 10;
const MAX_COUNT = 20;

function todayKeyLocal(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// 例句挖空（不再提示“找不到挖空”）：
// 1) 尝试整词匹配（word boundary，大小写不敏感）
// 2) 若失败，尝试更宽松的“子串匹配”（大小写不敏感）
// 3) 若仍失败，返回 null（直接显示原句，不提示）
function buildBlankedExample(example: string, word: string): null | { before: string; match: string; after: string } {
  const w = word.trim();
  if (!w) return null;

  // ① 整词匹配
  const boundaryRe = new RegExp(`\\b${escapeRegExp(w)}\\b`, "i");
  let m = boundaryRe.exec(example);
  if (m && m.index != null) {
    const idx = m.index;
    const match = m[0];
    return { before: example.slice(0, idx), match, after: example.slice(idx + match.length) };
  }

  // ② 宽松子串匹配（不考虑时态/复数等，你要求不处理这些）
  const looseRe = new RegExp(escapeRegExp(w), "i");
  m = looseRe.exec(example);
  if (m && m.index != null) {
    const idx = m.index;
    const match = m[0];
    return { before: example.slice(0, idx), match, after: example.slice(idx + match.length) };
  }

  // ③ 仍找不到就不挖空（但不提示）
  return null;
}

// 逐字母反馈（只做提示，不做时态/复数等推断）
function compareLetters(input: string, target: string): { chars: string[]; ok: boolean[] } {
  const a = input.split("");
  const b = target.split("");
  const len = Math.max(a.length, b.length);
  const chars: string[] = [];
  const ok: boolean[] = [];
  for (let i = 0; i < len; i++) {
    const ch = a[i] ?? "";
    chars.push(ch);
    ok.push(ch.length > 0 && ch.toLowerCase() === (b[i] ?? "").toLowerCase());
  }
  return { chars, ok };
}

export default function DictationPage() {
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [vocabById, setVocabById] = useState<Map<string, VocabItem>>(new Map());

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [dailyCount, setDailyCount] = useState<number>(DEFAULT_DAILY_COUNT);
  const [phase, setPhase] = useState<Phase>("idle");

  const [todayKey, setTodayKey] = useState<string>("");
  const [remainingIds, setRemainingIds] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // 状态消息：仅用于加载/音频缺失等（拼写错不再写 statusMsg）
  const [statusMsg, setStatusMsg] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 用 token 控制“取消正在播放/正在等待的流程”
  const playTokenRef = useRef(0);

  // 防 StrictMode / 重渲染导致同一词自动播放多次
  const lastAutoPlayKeyRef = useRef<string | null>(null);

  const currentItem = useMemo(() => {
    if (!currentId) return null;
    return vocabById.get(currentId) ?? null;
  }, [currentId, vocabById]);

  const blanked = useMemo(() => {
    if (!currentItem) return null;
    return buildBlankedExample(currentItem.example, currentItem.word);
  }, [currentItem]);

  const remainingCount = remainingIds.length;

  // ====== 音频控制（关键修复：stop 不再改变 token） ======
  const stopCurrentAudioOnly = () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.pause();
      a.currentTime = 0;
    } catch {}
  };

  const cancelPlaybackFlow = () => {
    // 取消后续 loop / sleep / 自动跳转
    playTokenRef.current += 1;
    stopCurrentAudioOnly();
  };

  const playSrcOnce = (src: string, token: number) =>
    new Promise<void>((resolve, reject) => {
      if (playTokenRef.current !== token) return resolve();

      try {
        // 新播放必须停止旧播放（不叠加），但不能改 token（否则会把自身循环打断）
        stopCurrentAudioOnly();

        const a = new Audio(`${src}?v=${Date.now()}`);
        audioRef.current = a;

        a.onended = () => resolve();
        a.onerror = () => reject(new Error(`音频加载失败：${src}`));

        a.play().catch((err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });

  const playWordTimesWithPause = async (item: VocabItem, times: number, pauseMs: number) => {
    const token = ++playTokenRef.current;
    const src = `/audio_word/${item.id}.mp3`;

    try {
      for (let i = 0; i < times; i++) {
        if (playTokenRef.current !== token) return;
        await playSrcOnce(src, token);

        if (i < times - 1) {
          await sleep(pauseMs); // 你要求：停两秒
        }
      }
    } catch {
      // 音频缺失容错
      setStatusMsg(`⚠️ 单词音频缺失或无法播放：/audio_word/${item.id}.mp3`);
    }
  };

  const playExampleOnce = async (item: VocabItem) => {
    const token = ++playTokenRef.current;
    const src = `/audio_example/${item.id}.mp3`;
    try {
      await playSrcOnce(src, token);
    } catch {
      setStatusMsg(`⚠️ 例句音频缺失或无法播放：/audio_example/${item.id}.mp3`);
    }
  };

  // ====== localStorage ======
  const persistPlan = (ids: string[]) => {
    const tk = todayKey || todayKeyLocal();
    try {
      const plan: Plan = { remainingIds: ids };
      localStorage.setItem(LS_PLAN_PREFIX + tk, JSON.stringify(plan));
    } catch {}
  };

  const markDoneToday = () => {
    const tk = todayKey || todayKeyLocal();
    try {
      localStorage.setItem(LS_DONE_PREFIX + tk, String(Date.now()));
    } catch {}
  };

  // ====== 初始加载 ======
  useEffect(() => {
    setTodayKey(todayKeyLocal());

    // dailyCount
    try {
      const raw = localStorage.getItem(LS_DAILY_COUNT);
      if (raw) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n)) setDailyCount(clamp(n, MIN_COUNT, MAX_COUNT));
      }
    } catch {}

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch(`/vocab.json?v=${Date.now()}`);
        if (!res.ok) throw new Error(`无法读取 /vocab.json (HTTP ${res.status})`);
        const data = (await res.json()) as VocabItem[];

        const map = new Map<string, VocabItem>();
        for (const it of data) {
          if (!it || typeof it.id !== "string") continue;
          map.set(it.id, it);
        }

        setVocab(data);
        setVocabById(map);
        setLoading(false);

        // 恢复今日计划
        const tk = todayKeyLocal();
        try {
          const rawPlan = localStorage.getItem(LS_PLAN_PREFIX + tk);
          if (rawPlan) {
            const plan = JSON.parse(rawPlan) as Plan;
            if (plan?.remainingIds?.length) {
              setRemainingIds(plan.remainingIds);
              setCurrentId(plan.remainingIds[0]);
              // ✅ 修复“单词重复出现时不自动播放”：恢复时先清空 autoplay key
              lastAutoPlayKeyRef.current = null;
              setPhase("word");
              setStatusMsg("已恢复今日任务。");
              return;
            }
          }
        } catch {
          try {
            localStorage.removeItem(LS_PLAN_PREFIX + tk);
          } catch {}
          setStatusMsg("检测到本地计划损坏，已重置。请重新开始今日任务。");
        }

        setPhase("idle");
      } catch (e: any) {
        setLoading(false);
        setLoadError(e?.message ?? "加载失败");
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_DAILY_COUNT, String(clamp(dailyCount, MIN_COUNT, MAX_COUNT)));
    } catch {}
  }, [dailyCount]);

  // ====== 开始今日任务（seen_ids + cycle，不重复直到全部出完） ======
  const startToday = () => {
    if (!vocab.length) return;

    const tk = todayKey || todayKeyLocal();

    // 已有计划则恢复
    try {
      const raw = localStorage.getItem(LS_PLAN_PREFIX + tk);
      if (raw) {
        const plan = JSON.parse(raw) as Plan;
        if (plan?.remainingIds?.length) {
          setRemainingIds(plan.remainingIds);
          setCurrentId(plan.remainingIds[0]);
          lastAutoPlayKeyRef.current = null;
          setPhase("word");
          setInput("");
          setSubmitted(false);
          setWasCorrect(null);
          setStatusMsg("已恢复今日任务。");
          return;
        }
      }
    } catch {}

    const n = clamp(dailyCount, MIN_COUNT, MAX_COUNT);

    let cycle = 1;
    try {
      const rawCycle = localStorage.getItem(LS_CYCLE);
      if (rawCycle) {
        const c = parseInt(rawCycle, 10);
        if (!Number.isNaN(c) && c >= 1) cycle = c;
      }
    } catch {}

    let seen = loadJson<string[]>(LS_SEEN_IDS, []);
    const seenSet = new Set(seen);

    const allIds = vocab.map((it) => it.id).filter(Boolean);
    const unseen = allIds.filter((id) => !seenSet.has(id));

    let ids: string[] = [];

    if (unseen.length >= n) {
      ids = unseen.slice(0, n);
      seen = [...seen, ...ids];
    } else {
      // 本轮剩余先用完，再开启新一轮
      ids = [...unseen];
      cycle += 1;
      seen = []; // reset for new cycle

      const need = n - ids.length;
      const extra = allIds.slice(0, need);
      ids = [...ids, ...extra];
      seen = [...extra];
    }

    saveJson(LS_SEEN_IDS, seen);
    try {
      localStorage.setItem(LS_CYCLE, String(cycle));
    } catch {}

    setRemainingIds(ids);
    setCurrentId(ids[0] ?? null);
    lastAutoPlayKeyRef.current = null;
    setPhase(ids.length ? "word" : "done");
    setInput("");
    setSubmitted(false);
    setWasCorrect(null);
    persistPlan(ids);
    setStatusMsg("已生成今日任务。");
  };

  // ====== 自动播放：word 阶段自动播放×3，间隔2秒，播完进入 input ======
  useEffect(() => {
    if (phase !== "word") return;
    if (!currentItem) return;

    const key = `${todayKey || todayKeyLocal()}-${currentItem.id}-auto`;
    if (lastAutoPlayKeyRef.current === key) return;
    lastAutoPlayKeyRef.current = key;

    const token = ++playTokenRef.current;

    (async () => {
      setStatusMsg(""); // 清掉非必要提示

      // 播单词 3 次，间隔 2 秒
      const src = `/audio_word/${currentItem.id}.mp3`;
      try {
        for (let i = 0; i < 3; i++) {
          if (playTokenRef.current !== token) return;
          await playSrcOnce(src, token);
          if (i < 2) await sleep(2000);
        }
      } catch {
        setStatusMsg(`⚠️ 单词音频缺失或无法播放：/audio_word/${currentItem.id}.mp3`);
      }

      // 进入输入阶段（若期间未被取消/切换）
      if (playTokenRef.current !== token) return;
      setPhase((p) => (p === "word" ? "input" : p));
      setInput("");
      setSubmitted(false);
      setWasCorrect(null);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentId]);

  // ====== 队列推进工具 ======
  const goToNextWord = (newQueue: string[]) => {
    setRemainingIds(newQueue);
    persistPlan(newQueue);

    if (newQueue.length === 0) {
      setCurrentId(null);
      setPhase("done");
      setStatusMsg("🎉 今日完成！");
      markDoneToday();
      return;
    }

    setCurrentId(newQueue[0]);
    // ✅ 关键：每次去下一词（包括只有一个词时重复出现），都要允许自动播
    lastAutoPlayKeyRef.current = null;

    setPhase("word");
    setInput("");
    setSubmitted(false);
    setWasCorrect(null);
  };

  // 错 / 跳过：把当前词放到队尾，不减少剩余
  const rotateCurrentToTail = () => {
    if (!currentItem) return;
    if (!remainingIds.length) return;

    const curId = currentItem.id;
    const rest = remainingIds.slice(1);
    const nextQueue = [...rest, curId];
    goToNextWord(nextQueue);
  };

  // ====== 提交（正确：移除；错误：停5秒自动进入下一词且当前词队尾） ======
  const submit = async () => {
    if (!currentItem) return;
    if (phase !== "input") return;

    // 停掉可能残留的播放
    cancelPlaybackFlow();

    const raw = input.trim();
    const target = currentItem.word.trim();

    const ok = raw.length > 0 && raw.toLowerCase() === target.toLowerCase();

    setSubmitted(true);
    setWasCorrect(ok);

    if (ok) {
      // 正确：播放例句×1 → 移除该词 → 下一词自动播放
      await playExampleOnce(currentItem);

      const nextQueue = remainingIds.filter((id) => id !== currentItem.id);
      goToNextWord(nextQueue);
      return;
    }

    // 错误：不弹任何“错误提示对话框”，停留 5 秒后自动进入下一词（该词队尾）
    const token = ++playTokenRef.current;
    await sleep(5000);
    if (playTokenRef.current !== token) return;

    rotateCurrentToTail();
  };

  // ====== 手动按钮：播放单词×3（含2秒间隔） ======
  const replayWord = async () => {
    if (!currentItem) return;
    setStatusMsg("");
    await playWordTimesWithPause(currentItem, 3, 2000);
  };

  // ====== 跳过此词：同“错误逻辑”一样（不减少剩余，放队尾，立刻下一词） ======
  const skipThisWord = () => {
    cancelPlaybackFlow();
    rotateCurrentToTail();
  };

  const letterFeedback = useMemo(() => {
    if (!currentItem) return null;
    if (!submitted) return null;
    return compareLetters(input.trim(), currentItem.word.trim());
  }, [currentItem, submitted, input]);

  // ====== styles ======
  const selectStyle: React.CSSProperties = {
    background: "#111827",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
  };

  const buttonStyle: React.CSSProperties = {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const ghostButtonStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.08)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 600,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1220", color: "#fff" }}>
        <TopNav title="学习系统" />
        <div style={{ padding: 20 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>听写 Dictation</h1>
          <p style={{ opacity: 0.85 }}>正在加载 vocab.json…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1220", color: "#fff" }}>
        <TopNav title="学习系统" />
        <div style={{ padding: 20 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>听写 Dictation</h1>
          <div style={{ ...cardStyle, marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>加载失败</div>
            <div style={{ opacity: 0.9, whiteSpace: "pre-wrap" }}>{loadError}</div>
            <div style={{ marginTop: 12, opacity: 0.85 }}>
              请确认 <code>/public/vocab.json</code> 存在，并可通过 <code>/vocab.json</code> 访问。
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#fff" }}>
      <TopNav title="学习系统" />

      <div style={{ padding: 20 }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>听写 Dictation</h1>
          <div style={{ opacity: 0.75, marginTop: 6 }}>
            今日剩余：<b>{remainingCount}</b>
            {todayKey ? <>　|　日期：{todayKey}</> : null}
          </div>

          {/* 设置区 */}
          <div style={{ ...cardStyle, marginTop: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontWeight: 700 }}>每日学习数量</div>
                <select
                  style={selectStyle}
                  value={dailyCount}
                  onChange={(e) => setDailyCount(clamp(parseInt(e.target.value, 10), MIN_COUNT, MAX_COUNT))}
                  disabled={phase !== "idle" && phase !== "done"}
                >
                  {Array.from({ length: MAX_COUNT - MIN_COUNT + 1 }, (_, i) => MIN_COUNT + i).map((n) => (
                    <option key={n} value={n} style={{ background: "#111827", color: "#fff" }}>
                      {n}
                    </option>
                  ))}
                </select>
                <div style={{ opacity: 0.7, fontSize: 12 }}>当日任务开始后修改不影响今日，只影响下一次开始。</div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button style={buttonStyle} onClick={startToday}>
                  开始今日任务
                </button>
                <button
                  style={ghostButtonStyle}
                  onClick={() => {
                    cancelPlaybackFlow();
                    setStatusMsg("已停止播放。");
                  }}
                >
                  停止播放
                </button>
              </div>

              <div style={{ marginLeft: "auto", opacity: 0.8, fontSize: 13 }}>词库条数：{vocab.length}</div>
            </div>
          </div>

          {/* 仅用于系统提示（非拼写错误提示） */}
          {statusMsg ? (
            <div style={{ marginTop: 12, ...cardStyle }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{statusMsg}</div>
            </div>
          ) : null}

          {/* 训练区 */}
          <div style={{ ...cardStyle, marginTop: 14 }}>
            {phase === "idle" ? (
              <div style={{ opacity: 0.85 }}>点击「开始今日任务」开始听写。系统会在本地保存今日进度，刷新不丢失。</div>
            ) : null}

            {phase === "done" ? (
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>🎉 今日完成！</div>
                <div style={{ opacity: 0.8, marginTop: 6 }}>你可以明天再来，或现在点「开始今日任务」生成新任务。</div>
              </div>
            ) : null}

            {(phase === "word" || phase === "input") && currentItem ? (
              <div style={{ display: "grid", gap: 14 }}>
                {/* 单词提示区 */}
                <div>
                  {phase === "word" ? (
                    <>
                      <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 0.3 }}>{currentItem.word}</div>
                      <div style={{ opacity: 0.85, marginTop: 6 }}>
                        {currentItem.cn || <span style={{ opacity: 0.6 }}>（无中文解释）</span>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 16, fontWeight: 800, opacity: 0.9 }}>中文提示：</div>
                      <div style={{ opacity: 0.85, marginTop: 6 }}>
                        {currentItem.cn || <span style={{ opacity: 0.6 }}>（无中文解释）</span>}
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                    <button style={ghostButtonStyle} onClick={replayWord}>
                      播放单词 ×3（间隔2秒）
                    </button>

                    <button
                      style={ghostButtonStyle}
                      onClick={async () => {
                        setStatusMsg("");
                        await playExampleOnce(currentItem);
                      }}
                    >
                      播放例句 ×1
                    </button>

                    <button style={ghostButtonStyle} onClick={skipThisWord}>
                      跳过此词
                    </button>
                  </div>
                </div>

                {/* 例句挖空 + 输入 */}
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>例句</div>

                  {blanked ? (
                    <div style={{ fontSize: 18, lineHeight: 1.6 }}>
                      <span style={{ opacity: 0.95 }}>{blanked.before}</span>
                      <span
                        style={{
                          display: "inline-block",
                          minWidth: 120,
                          padding: "2px 10px",
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.10)",
                          border: "1px dashed rgba(255,255,255,0.25)",
                          textAlign: "center",
                          margin: "0 6px",
                          fontWeight: 800,
                          letterSpacing: 1,
                        }}
                        aria-label="blank"
                      >
                        ______
                      </span>
                      <span style={{ opacity: 0.95 }}>{blanked.after}</span>
                    </div>
                  ) : (
                    // 不再提示“无法挖空”，直接显示原句
                    <div style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.95 }}>{currentItem.example}</div>
                  )}

                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          setSubmitted(false);
                          setWasCorrect(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submit();
                        }}
                        autoFocus
                        placeholder="输入单词后按 Enter"
                        style={{
                          flex: "1 1 320px",
                          background: "#0f172a",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.18)",
                          borderRadius: 10,
                          padding: "12px 12px",
                          outline: "none",
                          fontSize: 16,
                        }}
                      />

                      <button style={buttonStyle} onClick={submit}>
                        提交（Enter）
                      </button>
                    </div>

                    {/* 逐字母反馈（错误时会停留5秒后自动切下一词） */}
                    {submitted && currentItem ? (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 6 }}>逐字母反馈：</div>
                        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.5 }}>
                          {(letterFeedback?.chars ?? []).map((ch, idx) => {
                            const ok = letterFeedback?.ok[idx];
                            const show = ch === "" ? "·" : ch;
                            return (
                              <span
                                key={idx}
                                style={{
                                  color: ok ? "#22c55e" : "#ef4444",
                                  marginRight: 2,
                                }}
                              >
                                {show}
                              </span>
                            );
                          })}
                        </div>
                        <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
                          目标：<b>{currentItem.word}</b>
                          {wasCorrect ? <span style={{ marginLeft: 10, color: "#22c55e" }}>✅ 全对</span> : null}
                          {wasCorrect === false ? (
                            <span style={{ marginLeft: 10, color: "#ef4444" }}>❌ 有错（5秒后自动下一题）</span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {(phase === "word" || phase === "input") && !currentItem ? (
              <div style={{ opacity: 0.85 }}>
                当前词条不存在或已损坏。你可以点击「开始今日任务」重新生成，或清空本地计划后重试。
                <div style={{ marginTop: 10 }}>
                  <button
                    style={ghostButtonStyle}
                    onClick={() => {
                      const tk = todayKey || todayKeyLocal();
                      try {
                        localStorage.removeItem(LS_PLAN_PREFIX + tk);
                      } catch {}
                      setRemainingIds([]);
                      setCurrentId(null);
                      setPhase("idle");
                      setStatusMsg("已清空今日计划。请重新开始今日任务。");
                    }}
                  >
                    清空今日计划
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 14, opacity: 0.65, fontSize: 12 }}>
            音频路径：<code>/audio_word/{"{id}"}.mp3</code>（单词）｜<code>/audio_example/{"{id}"}.mp3</code>（例句）
          </div>
        </div>
      </div>
    </div>
  );
}