"use client";

import React, { useEffect, useMemo, useState } from "react";
import TopNav from "./components/TopNav";
import { QUESTIONS, TOPIC_TREE, SKILLS_BY_TOPIC, PASSAGE_BY_TOPIC, type Question } from "./questionBank";

const LS_WRONG = "quiz_wrong_v2";
const LS_SEEN = "quiz_seen_ids_v2";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Panel = "tips" | "reading" | null;

function flattenTopics(tree: typeof TOPIC_TREE) {
  const out: { id: string; label: string }[] = [];
  for (const n of tree) {
    out.push({ id: n.id, label: n.label });
    if (n.children?.length) {
      for (const c of n.children) out.push({ id: c.id, label: "  " + c.label });
    }
  }
  return out;
}

function isBigTopic(id: string) {
  return /^\d$/.test(id);
}
function isSubTopic(id: string) {
  return /^\d+\.\d+$/.test(id);
}

export default function Page() {
  const [loading, setLoading] = useState(true);

  const [topic, setTopic] = useState<string>("全部");
  const [count, setCount] = useState<number>(10);

  const [session, setSession] = useState<Question[]>([]);
  const [idx, setIdx] = useState<number>(0);

  const [chosen, setChosen] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [wrongSet, setWrongSet] = useState<Record<string, { wrongCount: number; lastWrongAt: number }>>({});
  const [seenIds, setSeenIds] = useState<string[]>([]);

  const [panel, setPanel] = useState<Panel>(null);

  const TOP_BG = "#0b1220";

  const all = useMemo(() => QUESTIONS, []);

  useEffect(() => {
    try {
      const rawWrong = localStorage.getItem(LS_WRONG);
      if (rawWrong) setWrongSet(JSON.parse(rawWrong));
    } catch {}

    try {
      const rawSeen = localStorage.getItem(LS_SEEN);
      if (rawSeen) setSeenIds(JSON.parse(rawSeen));
    } catch {}

    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_WRONG, JSON.stringify(wrongSet));
    } catch {}
  }, [wrongSet]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_SEEN, JSON.stringify(seenIds));
    } catch {}
  }, [seenIds]);

  const topicOptions = useMemo(() => [{ id: "全部", label: "全部" }, ...flattenTopics(TOPIC_TREE)], []);

  const filtered = useMemo(() => {
    if (topic === "全部") return all;

    // 大类：包含本大类下全部子类（例如选 4 -> 4.1/4.2/4.3）
    if (isBigTopic(topic)) {
      return all.filter((q) => q.bigId === topic);
    }

    // 子类：精确匹配
    if (isSubTopic(topic)) {
      return all.filter((q) => q.topicId === topic);
    }

    return all;
  }, [all, topic]);

  const wrongCount = Object.keys(wrongSet).length;

  // ✅ 总题量循环：all.length 出完前不重复；出完后重置
  function pickNoRepeat(pool: Question[], n: number) {
    if (!pool.length) return { picked: [] as Question[], nextSeen: seenIds };

    let nextSeen = [...seenIds];
    if (all.length > 0 && nextSeen.length >= all.length) nextSeen = [];

    const seenSet = new Set(nextSeen);
    let candidates = pool.filter((q) => !seenSet.has(q.id));

    if (candidates.length < n) {
      nextSeen = [];
      candidates = pool;
    }

    const picked = shuffle(candidates).slice(0, n);
    const pickedIds = picked.map((q) => q.id);
    const merged = [...nextSeen, ...pickedIds];
    const capped = all.length > 0 ? merged.slice(-Math.max(all.length, 1)) : merged;
    return { picked, nextSeen: capped };
  }

  function startSession(mode: "topic" | "wrong") {
    setPanel(null);

    if (mode === "wrong") {
      const ids = new Set(Object.keys(wrongSet));
      const pool = all.filter((q) => ids.has(q.id));
      const n = Math.max(1, Math.min(count || 10, pool.length || 1));
      const picked = shuffle(pool).slice(0, n);
      setSession(picked);
      setIdx(0);
      setChosen("");
      setSubmitted(false);
      return;
    }

    const pool = filtered;
    const n = Math.max(1, Math.min(count || 10, pool.length || 1));
    const { picked, nextSeen } = pickNoRepeat(pool, n);
    setSeenIds(nextSeen);

    setSession(picked);
    setIdx(0);
    setChosen("");
    setSubmitted(false);
  }

  const cur = session[idx];

  const curTips = useMemo(() => {
    if (!cur) return "";
    // 优先子类技巧；没有就回退到大类技巧
    return SKILLS_BY_TOPIC[cur.topicId] || SKILLS_BY_TOPIC[cur.bigId] || "";
  }, [cur]);

  const curReading = useMemo(() => {
    if (!cur) return "";
    return PASSAGE_BY_TOPIC[cur.topicId] || "";
  }, [cur]);

  const hasReading = !!curReading;

  function submit() {
    if (!cur || !chosen) return;
    const correct = (cur.answer || "") === chosen;
    setSubmitted(true);

    if (!correct) {
      setWrongSet((prev) => {
        const old = prev[cur.id];
        return {
          ...prev,
          [cur.id]: {
            wrongCount: (old?.wrongCount || 0) + 1,
            lastWrongAt: Date.now(),
          },
        };
      });
    } else {
      setWrongSet((prev) => {
        if (!prev[cur.id]) return prev;
        const copy = { ...prev };
        delete copy[cur.id];
        return copy;
      });
    }
  }

  function next() {
    setPanel(null);
    if (!session.length) return;
    if (idx >= session.length - 1) {
      setIdx(session.length);
      return;
    }
    setIdx((v) => v + 1);
    setChosen("");
    setSubmitted(false);
  }

  function clearWrongBook() {
    if (!confirm("确认清空错题本？")) return;
    setWrongSet({});
  }

  function removeFromWrong(id: string) {
    setWrongSet((prev) => {
      if (!prev[id]) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: TOP_BG }}>
        <TopNav title="学习系统" />
        <div style={{ padding: 16, color: "rgba(255,255,255,0.92)" }}>加载题库中…</div>
      </div>
    );
  }

  const pageWrap: React.CSSProperties = {
    maxWidth: 900,
    margin: "0 auto",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  };

  const card: React.CSSProperties = {
    padding: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
  };

  const btnPrimary: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.95)",
    fontWeight: 800,
  };

  const btnDanger: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,0.55)",
    background: "rgba(239,68,68,0.22)",
    color: "rgba(255,255,255,0.97)",
    fontWeight: 900,
  };

  const btnGhost: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 800,
  };

  const btnDisabled: React.CSSProperties = {
    ...btnGhost,
    opacity: 0.45,
    cursor: "not-allowed",
  };

  const selectStyle: React.CSSProperties = {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontWeight: 800,
    maxWidth: 420,
  };

  const inputStyle: React.CSSProperties = {
    marginLeft: 8,
    width: 90,
    padding: 6,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 800,
  };

  const finished = session.length > 0 && idx >= session.length;
  const submitBtnStyle = chosen && !submitted ? btnDanger : btnPrimary;

  const showPanel = (p: Panel) => {
    if (!cur) return;
    if (p === "reading" && !hasReading) return;
    setPanel((prev) => (prev === p ? null : p));
  };

  return (
    <div style={{ minHeight: "100vh", background: TOP_BG }}>
      <TopNav title="学习系统" />

      <div style={pageWrap}>
        <h1 style={{ fontSize: 22, marginBottom: 8, color: "rgba(255,255,255,0.92)" }}>本地刷题 App（MVP）</h1>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <div style={{ ...card, minWidth: 240 }}>
            <div style={{ fontSize: 13, opacity: 0.85, color: "rgba(255,255,255,0.90)" }}>本机错题本</div>
            <div style={{ marginTop: 6, color: "rgba(255,255,255,0.95)" }}>
              错题数量：<b>{wrongCount}</b>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => startSession("wrong")} disabled={wrongCount === 0} style={wrongCount === 0 ? btnDisabled : btnGhost}>
                刷错题
              </button>
              <button onClick={clearWrongBook} disabled={wrongCount === 0} style={wrongCount === 0 ? btnDisabled : btnGhost}>
                清空错题本
              </button>
            </div>
          </div>

          <div style={{ ...card, flex: 1, minWidth: 280 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.95)" }}>
                语法点：
                <select value={topic} onChange={(e) => setTopic(e.target.value)} style={selectStyle}>
                  {topicOptions.map((t) => (
                    <option key={t.id} value={t.id} style={{ background: TOP_BG, color: "#fff" }}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.95)" }}>
                题数：
                <input
                  type="number"
                  value={count}
                  min={1}
                  max={50}
                  onChange={(e) => setCount(Number(e.target.value || 10))}
                  style={inputStyle}
                />
              </label>

              <button onClick={() => startSession("topic")} style={btnPrimary}>
                开始刷题
              </button>

              <button
                onClick={() => {
                  if (!confirm("确认重置“不重复记录”？重置后会从第一轮重新开始随机。")) return;
                  setSeenIds([]);
                }}
                style={btnGhost}
                title="重置不重复循环"
              >
                重置记录
              </button>

              {/* ✅ 新增：答题技巧 / 阅读资料 */}
              <button
                onClick={() => showPanel("tips")}
                disabled={!cur || !curTips}
                style={!cur || !curTips ? btnDisabled : btnGhost}
                title={!cur ? "先开始刷题" : !curTips ? "没有技巧资料" : "查看本题所属分类答题技巧"}
              >
                答题技巧
              </button>

              <button
                onClick={() => showPanel("reading")}
                disabled={!cur || !hasReading}
                style={!cur || !hasReading ? btnDisabled : btnGhost}
                title={!cur ? "先开始刷题" : !hasReading ? "没有阅读资料" : "查看本题阅读/完形原文"}
              >
                阅读资料
              </button>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85, color: "rgba(255,255,255,0.90)" }}>
              当前分类题量：<b>{filtered.length}</b>（总题量：<b>{all.length}</b>）
              <span style={{ marginLeft: 10 }}>
                本轮“不重复”已出：<b>{Math.min(seenIds.length, all.length || 0)}</b> / <b>{all.length}</b>
              </span>
            </div>
          </div>
        </div>

        {/* ✅ 面板区（答题技巧 / 阅读资料） */}
        {panel ? (
          <div style={{ ...card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ color: "rgba(255,255,255,0.95)", fontWeight: 900 }}>
                {panel === "tips" ? "答题技巧" : "阅读资料"}
                {cur ? (
                  <span style={{ opacity: 0.8, fontWeight: 700, marginLeft: 10 }}>
                    （分类：{cur.topicId} / 大类：{cur.bigId}）
                  </span>
                ) : null}
              </div>
              <button onClick={() => setPanel(null)} style={btnGhost}>
                关闭
              </button>
            </div>

            <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.65, color: "rgba(255,255,255,0.92)" }}>
              {panel === "tips" ? (curTips || "没有技巧资料。") : (curReading || "没有阅读资料。")}
            </div>
          </div>
        ) : null}

        {/* 主内容 */}
        <div style={{ ...card }}>
          {session.length === 0 ? (
            <div style={{ opacity: 0.9, color: "rgba(255,255,255,0.95)" }}>还没开始刷题。先选语法点，然后点「开始刷题」。</div>
          ) : finished ? (
            <div style={{ color: "rgba(255,255,255,0.95)" }}>
              ✅ 本轮完成（共 <b>{session.length}</b> 题）
            </div>
          ) : !cur ? (
            <div style={{ opacity: 0.9, color: "rgba(255,255,255,0.95)" }}>未找到当前题目。</div>
          ) : (
            <div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8, color: "rgba(255,255,255,0.95)" }}>
                进度：{idx + 1} / {session.length}（ID: {cur.id}）
              </div>

              <div style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 12, color: "rgba(255,255,255,0.97)" }}>{cur.stem}</div>

              <div style={{ display: "grid", gap: 8 }}>
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const text = (cur as any)[opt] as string;
                  if (!text) return null;

                  const isChosen = chosen === opt;
                  const isCorrect = submitted && cur.answer === opt;
                  const isWrongChosen = submitted && isChosen && cur.answer !== opt;

                  const bg = isCorrect
                    ? "rgba(34,197,94,0.18)"
                    : isWrongChosen
                    ? "rgba(239,68,68,0.18)"
                    : isChosen
                    ? "rgba(255,255,255,0.08)"
                    : "transparent";

                  const bd = isCorrect
                    ? "1px solid rgba(34,197,94,0.45)"
                    : isWrongChosen
                    ? "1px solid rgba(239,68,68,0.45)"
                    : isChosen
                    ? "1px solid rgba(255,255,255,0.30)"
                    : "1px solid rgba(255,255,255,0.16)";

                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (submitted) return;
                        setChosen(opt);
                      }}
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: bd,
                        background: bg,
                        color: "rgba(255,255,255,0.97)",
                        cursor: submitted ? "default" : "pointer",
                        fontWeight: isChosen ? 900 : 650,
                      }}
                    >
                      <span style={{ opacity: 0.88, marginRight: 8 }}>{opt}.</span>
                      {text}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={submit} disabled={!chosen || submitted} style={!chosen || submitted ? btnDisabled : submitBtnStyle}>
                  提交
                </button>

                <button onClick={next} style={btnGhost}>
                  下一题
                </button>

                {submitted ? (
                  <div style={{ marginLeft: 8, fontSize: 13, color: "rgba(255,255,255,0.95)" }}>
                    正确答案：<b>{cur.answer || "（无）"}</b>
                    {wrongSet[cur.id] ? (
                      <button onClick={() => removeFromWrong(cur.id)} style={{ marginLeft: 10, ...btnGhost, padding: "6px 10px" }}>
                        从错题本移除
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, color: "rgba(255,255,255,0.85)" }}>
          题库来源：分类练习题.docx（当前共 {all.length} 题）
        </div>
      </div>
    </div>
  );
}
