"use client";

import React, { useEffect, useState } from "react";
import Widget from "./Widget";

interface Deploy {
  name: string;
  state: string;
  url: string | null;
  branch: string;
  message: string;
  createdAt: number;
}

const STATE_STYLE: Record<string, { color: string; label: string }> = {
  READY:    { color: "var(--green)",   label: "ready"    },
  ERROR:    { color: "var(--red)",     label: "error"    },
  BUILDING: { color: "var(--yellow)",  label: "building" },
  CANCELED: { color: "var(--ink-3)",   label: "canceled" },
};

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function VercelDeploys({ style }: { style?: React.CSSProperties }) {
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/vercel");
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setDeploys(d.deploys ?? []);
    } catch { setError("fetch failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);

  const failing = deploys.filter(d => d.state === "ERROR").length;

  return (
    <Widget title="Vercel" badge={failing > 0 ? `${failing} err` : "live"} badgeColor={failing > 0 ? "red" : "green"} style={style}
      action={{ label: "↻", onClick: load }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {error && <p style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{error}</p>}

        {deploys.slice(0, 6).map((d, i) => {
          const st = STATE_STYLE[d.state] ?? { color: "var(--ink-3)", label: d.state.toLowerCase() };
          return (
            <div key={i} className="interactive"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 6px", borderRadius: "var(--radius-sm)", borderBottom: "1px solid var(--border-subtle)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "1px 6px", borderRadius: "var(--radius-sm)", color: st.color, background: `${st.color}18`, flexShrink: 0 }}>
                {st.label}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: "var(--ink)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.name}
                </span>
                {d.message && (
                  <span style={{ fontSize: 10, color: "var(--ink-3)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {d.message}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{timeAgo(d.createdAt)}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--primary)" }}>{d.branch}</span>
              </div>
            </div>
          );
        })}

        {loading && <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)", padding: "8px 0" }}>loading…</p>}
      </div>
    </Widget>
  );
}
