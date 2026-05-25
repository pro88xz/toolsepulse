import { ImageResponse } from "next/og";
import { getUseCase } from "@/config/use-cases";

export const runtime = "edge";
export const alt = "Use-case guide from ToolsePulse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  const title = uc?.title ?? "Use case guide";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", position: "relative", background: "#FAFAFC" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 15% 20%, rgba(29, 78, 216, 0.22), transparent 70%), radial-gradient(60% 50% at 85% 25%, rgba(109, 40, 217, 0.22), transparent 70%)", display: "flex" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px", display: "flex" }} />
        <div style={{ display: "flex", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#6D28D9", marginBottom: "24px", zIndex: 1 }}>
          Use Case Guide
        </div>
        <div style={{ display: "flex", fontSize: "64px", fontWeight: 800, color: "#0F172A", textAlign: "center", lineHeight: 1.1, maxWidth: "1000px", zIndex: 1, padding: "0 40px" }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: "26px", fontWeight: 500, color: "#475569", marginTop: "32px", zIndex: 1 }}>
          Free · No Signup · 100% Private
        </div>
        <div style={{ position: "absolute", bottom: "40px", right: "48px", display: "flex", fontSize: "20px", fontWeight: 700, color: "#94a3b8", zIndex: 1 }}>
          toolsepulse.co
        </div>
      </div>
    ),
    { ...size }
  );
}
