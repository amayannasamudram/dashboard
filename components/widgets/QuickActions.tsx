"use client";

import Widget from "./Widget";

interface Action {
  label: string;
  href: string;
  icon: string;
  color: string;
}

const ACTIONS: Action[] = [
  { label: "GitHub", href: "https://github.com", icon: "⬡", color: "#e0e0e0" },
  { label: "Gmail", href: "https://mail.google.com", icon: "◉", color: "#ea4335" },
  { label: "Linear", href: "https://linear.app", icon: "◈", color: "#5e6ad2" },
  { label: "Vercel", href: "https://vercel.com", icon: "▲", color: "#e0e0e0" },
  { label: "Figma", href: "https://figma.com", icon: "◎", color: "#a855f7" },
  { label: "Notion", href: "https://notion.so", icon: "▣", color: "#e0e0e0" },
];

export default function QuickActions() {
  return (
    <Widget title="Quick Access">
      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map(a => (
          <a
            key={a.label}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-md transition-all"
            style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", textDecoration: "none" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.background = "#141414"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.background = "#0d0d0d"; }}
          >
            <span style={{ color: a.color, fontSize: 16 }}>{a.icon}</span>
            <span className="text-xs" style={{ color: "#555" }}>{a.label}</span>
          </a>
        ))}
      </div>
    </Widget>
  );
}
