"use client";

import React from "react";
import Widget from "./Widget";

interface Link {
  label: string;
  href: string;
  key: string;
}

const LINKS: Link[] = [
  { label: "GitHub",  href: "https://github.com",         key: "GH" },
  { label: "Gmail",   href: "https://mail.google.com",    key: "GM" },
  { label: "Linear",  href: "https://linear.app",         key: "LN" },
  { label: "Vercel",  href: "https://vercel.com",         key: "VR" },
  { label: "Figma",   href: "https://figma.com",          key: "FG" },
  { label: "Notion",  href: "https://notion.so",          key: "NT" },
];

export default function QuickActions({ style }: { style?: React.CSSProperties }) {
  return (
    <Widget title="Quick Access" style={style}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {LINKS.map(l => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "10px 6px",
              background: "var(--surface-raised)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius)",
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "oklch(0.18 0 0)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.background = "var(--surface-raised)";
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--ink-2)", letterSpacing: "0.05em" }}>
              {l.key}
            </span>
            <span style={{ fontSize: 10, color: "var(--ink-3)" }}>
              {l.label}
            </span>
          </a>
        ))}
      </div>
    </Widget>
  );
}
