"use client";

import React from "react";
import Widget from "./Widget";

const MOCK = [
  { repo: "dashboard", branch: "main", message: "Initial PiOS — Projects + School workspaces", time: "just now", sha: "f1d8e27" },
  { repo: "dashboard", branch: "main", message: "Add deploy script and cron job", time: "2h ago", sha: "a3c9b12" },
];

export default function GitHubActivity({ style }: { style?: React.CSSProperties }) {
  return (
    <Widget title="GitHub" badge="live" badgeColor="green" style={style}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {MOCK.map((e, i) => (
          <div
            key={i}
            className="interactive"
            style={{
              display: "flex",
              gap: 10,
              padding: "7px 6px",
              borderRadius: "var(--radius-sm)",
              borderBottom: i < MOCK.length - 1 ? "1px solid var(--border-subtle)" : "none",
            }}
            onMouseEnter={el => (el.currentTarget.style.background = "var(--surface-raised)")}
            onMouseLeave={el => (el.currentTarget.style.background = "transparent")}
          >
            <div style={{ paddingTop: 4, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {e.message}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-2)" }}>{e.repo}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "0 4px", background: "var(--green-bg)", color: "var(--green)", borderRadius: "var(--radius-sm)" }}>
                  {e.branch}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{e.sha}</span>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", flexShrink: 0, paddingTop: 1 }}>{e.time}</span>
          </div>
        ))}

        <div style={{ marginTop: 10, padding: "6px 6px" }}>
          <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
            → add GITHUB_TOKEN env var for live feed
          </p>
        </div>
      </div>
    </Widget>
  );
}
