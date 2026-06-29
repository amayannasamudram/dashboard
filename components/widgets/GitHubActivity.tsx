"use client";

import React, { useEffect, useState } from "react";
import Widget from "./Widget";

interface Push {
  repo: string;
  repoFull: string;
  branch: string;
  message: string;
  sha: string;
  time: string;
}

interface PR {
  title: string;
  repo: string;
  url: string;
  number: number;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function GitHubActivity({ style }: { style?: React.CSSProperties }) {
  const [pushes, setPushes] = useState<Push[]>([]);
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/github");
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setPushes(d.pushes ?? []);
      setPRs(d.openPRs ?? []);
    } catch { setError("fetch failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);

  return (
    <Widget title="GitHub" badge={loading ? "…" : prs.length > 0 ? `${prs.length} PR` : "live"} badgeColor="green" style={style}
      action={{ label: "↻", onClick: load }}>
      <div style={{ display: "flex", flexDirection: "column" }}>

        {error && <p style={{ fontSize: 11, color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>{error}</p>}

        {/* Open PRs */}
        {prs.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {prs.map((pr) => (
              <a key={pr.number} href={pr.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: "var(--radius-sm)", textDecoration: "none", borderBottom: "1px solid var(--border-subtle)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontSize: 10, color: "var(--primary)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>PR#{pr.number}</span>
                <span style={{ fontSize: 12, color: "var(--ink)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pr.title}</span>
                <span style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{pr.repo}</span>
              </a>
            ))}
          </div>
        )}

        {/* Recent pushes */}
        {pushes.map((p, i) => (
          <div key={i} className="interactive"
            style={{ display: "flex", gap: 10, padding: "6px 6px", borderRadius: "var(--radius-sm)", borderBottom: "1px solid var(--border-subtle)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div style={{ paddingTop: 4, flexShrink: 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.message || "(no message)"}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)" }}>{p.repo}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "0 4px", background: "var(--green-bg)", color: "var(--green)", borderRadius: "var(--radius-sm)" }}>{p.branch}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{p.sha}</span>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", flexShrink: 0, paddingTop: 1 }}>{timeAgo(p.time)}</span>
          </div>
        ))}

        {loading && <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)", padding: "8px 0" }}>loading…</p>}
      </div>
    </Widget>
  );
}
