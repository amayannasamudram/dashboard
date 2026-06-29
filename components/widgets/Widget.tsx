import { ReactNode, CSSProperties } from "react";

interface WidgetProps {
  title: string;
  badge?: string | number;
  badgeColor?: "primary" | "green" | "yellow" | "red" | "purple";
  action?: { label: string; onClick: () => void };
  children: ReactNode;
  style?: CSSProperties;
}

const BADGE: Record<string, { color: string; bg: string }> = {
  primary: { color: "var(--primary)", bg: "var(--primary-bg)" },
  green:   { color: "var(--green)",   bg: "var(--green-bg)"   },
  yellow:  { color: "var(--yellow)",  bg: "var(--yellow-bg)"  },
  red:     { color: "var(--red)",     bg: "var(--red-bg)"     },
  purple:  { color: "var(--purple)",  bg: "var(--purple-bg)"  },
};

export default function Widget({ title, badge, badgeColor = "primary", action, children, style }: WidgetProps) {
  const badge_style = BADGE[badgeColor];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      ...style,
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 32,
        padding: "0 12px",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}>
            {title}
          </span>
          {badge !== undefined && (
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "1px 5px",
              borderRadius: "var(--radius-sm)",
              color: badge_style.color,
              background: badge_style.bg,
              fontWeight: 500,
            }}>
              {badge}
            </span>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="interactive"
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: "var(--radius-sm)",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink-2)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {children}
      </div>
    </div>
  );
}
