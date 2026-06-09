"use client";

import { useState } from "react";

const OCCASIONS = ["日常通勤", "约会", "逛街购物", "朋友聚会", "正式场合", "运动健身", "旅行出游"];
const SEASONS = ["春季", "夏季", "秋季", "冬季"];

const EXAMPLE_ITEMS = [
  "白色衬衫",
  "牛仔裤",
  "黑色皮裤",
  "碎花连衣裙",
  "驼色大衣",
  "格纹西装外套",
  "米白色毛衣",
  "军绿色工装裤"
];

export default function OutfitStyleTool() {
  const [clothing, setClothing] = useState("");
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ clothing: string; result: string }[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clothing.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clothing, occasion, season })
      });

      if (!res.ok) throw new Error("请求失败");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;
        setResult(fullText);
      }

      setHistory(prev => [{ clothing, result: fullText }, ...prev.slice(0, 4)]);
    } catch {
      setResult("抱歉，获取搭配建议失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.avatar}>👗</div>
          <div>
            <h1 style={styles.title}>AI 穿搭助手</h1>
            <p style={styles.subtitle}>专属 168cm / 120斤 女生的智能搭配顾问</p>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Input Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>✨ 输入你的单品</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>服装单品 *</label>
              <input
                type="text"
                value={clothing}
                onChange={e => setClothing(e.target.value)}
                placeholder="例如：白色衬衫、黑色皮裤、碎花连衣裙…"
                style={styles.input}
                required
              />
              {/* Example tags */}
              <div style={styles.tagRow}>
                {EXAMPLE_ITEMS.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setClothing(item)}
                    style={{
                      ...styles.tag,
                      ...(clothing === item ? styles.tagActive : {})
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>场合（可选）</label>
                <select
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  style={styles.select}
                >
                  <option value="">不限场合</option>
                  {OCCASIONS.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>季节（可选）</label>
                <select
                  value={season}
                  onChange={e => setSeason(e.target.value)}
                  style={styles.select}
                >
                  <option value="">当前季节</option>
                  {SEASONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading || !clothing.trim()} style={styles.button}>
              {loading ? (
                <span style={styles.buttonInner}>
                  <span style={styles.spinner} />
                  正在为你搭配中…
                </span>
              ) : (
                "获取穿搭建议 →"
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {(result || loading) && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💄 穿搭方案</h2>
            {loading && !result && (
              <div style={styles.skeleton}>
                <div style={styles.skeletonLine} />
                <div style={{ ...styles.skeletonLine, width: "80%" }} />
                <div style={{ ...styles.skeletonLine, width: "90%" }} />
              </div>
            )}
            {result && (
              <div style={styles.resultText}>
                {result.split("\n").map((line, i) => (
                  <p key={i} style={line.startsWith("#") ? styles.resultHeading : styles.resultPara}>
                    {line.replace(/^#+\s*/, "")}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🕒 历史搭配</h2>
            <div style={styles.historyList}>
              {history.slice(1).map((h, i) => (
                <button
                  key={i}
                  onClick={() => { setClothing(h.clothing); setResult(h.result); }}
                  style={styles.historyItem}
                >
                  <span style={styles.historyIcon}>👗</span>
                  <span>{h.clothing}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)",
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
  },
  header: {
    background: "linear-gradient(135deg, #ec4899, #a855f7)",
    padding: "32px 24px",
    color: "#fff"
  },
  headerInner: {
    maxWidth: 720,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: 20
  },
  avatar: {
    fontSize: 52,
    lineHeight: 1
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 14,
    opacity: 0.85
  },
  content: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "24px 16px 48px"
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    boxShadow: "0 4px 24px rgba(236,72,153,0.08)"
  },
  cardTitle: {
    margin: "0 0 20px",
    fontSize: 18,
    fontWeight: 600,
    color: "#1f2937"
  },
  field: {
    marginBottom: 16,
    flex: 1
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: 8
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #f3e8ff",
    borderRadius: 10,
    fontSize: 16,
    color: "#1f2937",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #f3e8ff",
    borderRadius: 10,
    fontSize: 15,
    color: "#1f2937",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box"
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  tag: {
    padding: "5px 12px",
    borderRadius: 20,
    border: "1.5px solid #e9d5ff",
    background: "#faf5ff",
    color: "#7c3aed",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s"
  },
  tagActive: {
    background: "#a855f7",
    color: "#fff",
    borderColor: "#a855f7"
  },
  row: {
    display: "flex",
    gap: 16
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #a855f7)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
    transition: "opacity 0.2s",
    letterSpacing: 0.5
  },
  buttonInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block"
  },
  resultText: {
    lineHeight: 2,
    color: "#374151"
  },
  resultHeading: {
    fontWeight: 600,
    fontSize: 16,
    color: "#7c3aed",
    margin: "12px 0 4px"
  },
  resultPara: {
    margin: "4px 0",
    fontSize: 15
  },
  skeleton: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "8px 0"
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
    background: "linear-gradient(90deg, #f3e8ff 25%, #e9d5ff 50%, #f3e8ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    background: "#faf5ff",
    border: "1.5px solid #e9d5ff",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    color: "#4b5563",
    textAlign: "left"
  },
  historyIcon: {
    fontSize: 18
  }
};
