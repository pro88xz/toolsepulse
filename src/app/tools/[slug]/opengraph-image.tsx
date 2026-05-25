import { ImageResponse } from "next/og";
import { getToolBySlug, categories } from "@/config/tools";

export const runtime = "edge";
export const alt = "Free online tool from ToolsePulse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categoryColors: Record<string, { from: string; to: string }> = {
  pdf: { from: "#1D4ED8", to: "#6D28D9" },
  image: { from: "#DB2777", to: "#F97316" },
  converter: { from: "#0EA5E9", to: "#1D4ED8" },
  audio: { from: "#F59E0B", to: "#EF4444" },
  video: { from: "#DB2777", to: "#7C3AED" },
  text: { from: "#059669", to: "#0EA5E9" },
  developer: { from: "#7C3AED", to: "#DB2777" },
  generator: { from: "#1D4ED8", to: "#0EA5E9" },
  ai: { from: "#DB2777", to: "#6D28D9" },
};

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const toolName = tool?.name ?? "ToolsePulse Tool";
  const category = tool ? categories[tool.category].label : "Free Tool";
  const colors = tool ? categoryColors[tool.category] ?? { from: "#1D4ED8", to: "#6D28D9" } : { from: "#1D4ED8", to: "#6D28D9" };

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
        {/* Category-colored gradient wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(60% 50% at 15% 20%, ${colors.from}33, transparent 70%), radial-gradient(60% 50% at 85% 25%, ${colors.to}33, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
          }}
        />

        {/* Category label */}
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: colors.from,
            marginBottom: "24px",
            zIndex: 1,
          }}
        >
          {category}
        </div>

        {/* Tool name — the hero */}
        <div
          style={{
            display: "flex",
            fontSize: "84px",
            fontWeight: 800,
            color: "#0F172A",
            textAlign: "center",
            lineHeight: 1.05,
            maxWidth: "1000px",
            zIndex: 1,
            padding: "0 40px",
          }}
        >
          {toolName}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 500,
            color: "#475569",
            marginTop: "32px",
            zIndex: 1,
          }}
        >
          Free · No Signup · 100% Private
        </div>

        {/* Brand watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "48px",
            display: "flex",
            fontSize: "20px",
            fontWeight: 700,
            color: "#94a3b8",
            zIndex: 1,
          }}
        >
          toolsepulse.co
        </div>
      </div>
    ),
    { ...size }
  );
}
