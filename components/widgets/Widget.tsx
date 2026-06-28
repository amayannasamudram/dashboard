import { ReactNode } from "react";

interface WidgetProps {
  title: string;
  badge?: string | number;
  badgeColor?: string;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function Widget({ title, badge, badgeColor = "#3b82f6", children, action, className = "" }: WidgetProps) {
  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden ${className}`}
      style={{ background: "#111111", border: "1px solid #1e1e1e" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 36, borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "#888", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {title}
          </span>
          {badge !== undefined && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: `${badgeColor}22`, color: badgeColor, fontFamily: "monospace", fontSize: 10 }}
            >
              {badge}
            </span>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs transition-colors"
            style={{ color: "#444" }}
            onMouseOver={e => (e.currentTarget.style.color = "#888")}
            onMouseOut={e => (e.currentTarget.style.color = "#444")}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}
