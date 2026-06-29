"use client";

import React, { useEffect, useState } from "react";
import Widget from "./Widget";

interface WeatherData {
  city: string;
  temp: number;
  feels: number;
  desc: string;
  humidity: number;
  wind: number;
}

export default function Weather({ style }: { style?: React.CSSProperties }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/weather");
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setData(d);
    } catch { setError("fetch failed"); }
  };

  useEffect(() => { load(); const t = setInterval(load, 900000); return () => clearInterval(t); }, []);

  return (
    <Widget title="Weather" style={style}>
      {error ? (
        <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
          {error.includes("not set") ? "Add OPENWEATHER_API_KEY to .env.local" : error}
        </p>
      ) : !data ? (
        <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 36, fontWeight: 300, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}>{data.temp}°</span>
              <span style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: 4 }}>F</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 12, color: "var(--ink-2)", textTransform: "capitalize" }}>{data.desc}</p>
              <p style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{data.city}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--border-subtle)", paddingTop: 8 }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Feels</p>
              <p style={{ fontSize: 13, color: "var(--ink-2)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{data.feels}°</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Humidity</p>
              <p style={{ fontSize: 13, color: "var(--ink-2)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{data.humidity}%</p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Wind</p>
              <p style={{ fontSize: 13, color: "var(--ink-2)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{data.wind} mph</p>
            </div>
          </div>
        </div>
      )}
    </Widget>
  );
}
