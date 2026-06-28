"use client";

import Widget from "./Widget";

const MOCK = [
  { repo: "amayannasamudram/dashboard", event: "push", branch: "main", message: "Initial PiOS setup", time: "just now" },
  { repo: "amayannasamudram/dashboard", event: "push", branch: "main", message: "Add deploy script", time: "2h ago" },
];

export default function GitHubActivity() {
  return (
    <Widget title="GitHub" badge="live" badgeColor="#22c55e">
      <div className="flex flex-col gap-2">
        {MOCK.map((e, i) => (
          <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid #161616" }}>
            <div className="shrink-0 mt-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium truncate" style={{ color: "#e0e0e0", fontFamily: "monospace" }}>
                  {e.repo.split("/")[1]}
                </span>
                <span className="text-xs px-1 rounded shrink-0" style={{ background: "#1a2a1a", color: "#22c55e", fontSize: 10 }}>
                  {e.branch}
                </span>
              </div>
              <p className="text-xs mt-0.5 truncate" style={{ color: "#555" }}>{e.message}</p>
            </div>
            <span className="text-xs shrink-0" style={{ color: "#333", fontFamily: "monospace" }}>{e.time}</span>
          </div>
        ))}
        <p className="text-xs mt-1" style={{ color: "#333" }}>
          Connect GitHub token in settings to see live activity
        </p>
      </div>
    </Widget>
  );
}
