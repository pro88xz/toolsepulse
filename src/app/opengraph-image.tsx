import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ToolsePulse — All tools. One pulse.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          background: "#FAFAFC",
        }}
      >
        {/* Brand radial gradient wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 50% at 15% 20%, rgba(29, 78, 216, 0.22), transparent 70%), radial-gradient(50% 50% at 85% 25%, rgba(109, 40, 217, 0.22), transparent 70%), radial-gradient(70% 60% at 50% 100%, rgba(219, 39, 119, 0.18), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Subtle dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* Logo + wordmark row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
            zIndex: 1,
          }}
        >
          <svg width="84" height="84" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="og-tp" x1="36" y1="36" x2="220" y2="220" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1D4ED8" />
                <stop offset="0.5" stopColor="#6D28D9" />
                <stop offset="1" stopColor="#DB2777" />
              </linearGradient>
            </defs>
            <g fill="url(#og-tp)">
              <rect x="28" y="48" width="172" height="38" rx="19" />
              <rect x="86" y="58" width="38" height="154" rx="19" />
              <path d="M124 66 L124 158 L172 158 A46 46 0 0 0 172 66 Z" />
            </g>
          </svg>
          <div style={{ display: "flex", fontSize: "68px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#0f172a" }}>Toolse</span>
            <span
              style={{
                background: "linear-gradient(90deg, #1D4ED8, #6D28D9, #DB2777)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Pulse
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
            zIndex: 1,
          }}
        >
          <div style={{ width: "48px", height: "1px", background: "#cbd5e1", display: "flex" }} />
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#475569", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            All Tools. One Pulse.
          </span>
          <div style={{ width: "48px", height: "1px", background: "#cbd5e1", display: "flex" }} />
        </div>

        {/* Big descriptor headline */}
        <div
          style={{
            fontSize: "44px",
            fontWeight: 700,
            color: "#0f172a",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: "900px",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>63 professional tools that run</span>
          <span
            style={{
              background: "linear-gradient(90deg, #1D4ED8, #6D28D9, #DB2777)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            in your browser.
          </span>
        </div>

        {/* Trust strip */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            fontSize: "18px",
            fontWeight: 600,
            color: "#475569",
            zIndex: 1,
          }}
        >
          <span style={{ display: "flex" }}>No file uploads</span>
          <span style={{ color: "#cbd5e1", display: "flex" }}>·</span>
          <span style={{ display: "flex" }}>No signup</span>
          <span style={{ color: "#cbd5e1", display: "flex" }}>·</span>
          <span style={{ display: "flex" }}>100% free</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
