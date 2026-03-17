import { useState } from "react";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="#c7d2fe" stroke="#818cf8" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ── 1. Classic sliding toggle ─────────────────────────────────────────────────
export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: 72,
        height: 38,
        borderRadius: 19,
        border: `0.5px solid ${isDark ? "#555" : "#bfbdb5"}`,
        background: isDark ? "#3a3a3c" : "#e0ddd5",
        cursor: "pointer",
        transition: "background 0.4s, border-color 0.4s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: isDark ? "#636366" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isDark ? "translateX(34px)" : "translateX(0px)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s",
          boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.12)",
        }}
      >
        {/* Sun */}
        <span style={{
          position: "absolute",
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(30deg) scale(0.7)" : "rotate(0deg) scale(1)",
          transition: "opacity 0.3s, transform 0.4s",
          display: "flex",
        }}>
          <SunIcon />
        </span>
        {/* Moon */}
        <span style={{
          position: "absolute",
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-30deg) scale(0.7)",
          transition: "opacity 0.3s, transform 0.4s",
          display: "flex",
        }}>
          <MoonIcon />
        </span>
      </span>
    </button>
  );
}

// ── 2. Pill / segmented variant ───────────────────────────────────────────────
export function ThemeTogglePill({ isDark, onToggle }) {
  const pillBase = {
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
    border: "none",
    transition: "background 0.25s, color 0.25s",
  };
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      borderRadius: 8,
      padding: 4,
      gap: 2,
      border: "0.5px solid #ccc",
      background: "#f5f5f5",
    }}>
      <button
        onClick={() => isDark && onToggle()}
        style={{
          ...pillBase,
          background: !isDark ? "#fff" : "transparent",
          color: !isDark ? "#1a1a1a" : "#888",
          boxShadow: !isDark ? "0 0 0 0.5px #ddd" : "none",
        }}
      >
        Light
      </button>
      <button
        onClick={() => !isDark && onToggle()}
        style={{
          ...pillBase,
          background: isDark ? "#fff" : "transparent",
          color: isDark ? "#1a1a1a" : "#888",
          boxShadow: isDark ? "0 0 0 0.5px #ddd" : "none",
        }}
      >
        Dark
      </button>
    </div>
  );
}

// ── 3. Icon button variant ─────────────────────────────────────────────────
export function ThemeToggleIcon({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        width: 40, height: 40, borderRadius: 10,
        border: "0.5px solid #ccc",
        background: "#f5f5f5",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative",
        transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute", display: "flex",
        transform: isDark ? "translateY(-120%)" : "translateY(0)",
        opacity: isDark ? 0 : 1,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s",
      }}>
        <SunIcon />
      </span>
      <span style={{
        position: "absolute", display: "flex",
        transform: isDark ? "translateY(0)" : "translateY(120%)",
        opacity: isDark ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s",
      }}>
        <MoonIcon size={16} />
      </span>
    </button>
  );
}

// ── Usage example ─────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark(d => !d);

  return (
    <div style={{
      minHeight: "100vh",
      background: isDark ? "#1c1c1e" : "#f5f4f0",
      color: isDark ? "#f2f2f7" : "#1a1a1a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 24, transition: "background 0.4s, color 0.4s",
      fontFamily: "system-ui, sans-serif",
    }}>
      <ThemeToggle      isDark={isDark} onToggle={toggle} />
      <ThemeTogglePill  isDark={isDark} onToggle={toggle} />
      <ThemeToggleIcon  isDark={isDark} onToggle={toggle} />
    </div>
  );
}