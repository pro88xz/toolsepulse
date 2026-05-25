import { ImageResponse } from "next/og";
import { getComparison } from "@/config/comparisons";

export const runtime = "edge";
export const alt = "Comparison from ToolsePulse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  const serviceA = c?.services[0]?.name ?? "A";
  const serviceB = c?.services[1]?.name ?? "B";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", position: "relative", background: "#FAFAFC" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 15% 20%, rgba(29, 78, 216, 0.25), transparent 70%), radial-gradient(60% 50% at 85% 25%, rgba(219, 39, 119, 0.22), transparent 70%)", display: "flex" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px", display: "flex" }} />
        <div style={{ display: "flex", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1D4ED8", marginBottom: "32px", zIndex: 1 }}>
          Head-to-Head Comparison
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "40px", zIndex: 1, padding: "0 40px" }}>
          <div style={{ display: "flex", fontSize: "64px", fontWeight: 800, color: "#1D4ED8", textAlign: "right", maxWidth: "440px" }}>{serviceA}</div>
          <div style={{ display: "flex", fontSize: "48px", fontWeight: 800, color: "#94a3b8" }}>vs</div>
          <div style={{ display: "flex", fontSize: "64px", fontWeight: 800, color: "#DB2777", maxWidth: "440px" }}>{serviceB}</div>
        </div>
        <div style={{ display: "flex", fontSize: "26px", fontWeight: 500, color: "#475569", marginTop: "48px", zIndex: 1 }}>
          Honest comparison · Updated 2026
        </div>
        <div style={{ position: "absolute", bottom: "40px", right: "48px", display: "flex", fontSize: "20px", fontWeight: 700, color: "#94a3b8", zIndex: 1 }}>
          toolsepulse.co
        </div>
      </div>
    ),
    { ...size }
  );
}
