"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("watermark-image")!;

type Position = "tl" | "tc" | "tr" | "ml" | "mc" | "mr" | "bl" | "bc" | "br";
const POSITIONS: { key: Position; label: string }[] = [
  { key: "tl", label: "↖" }, { key: "tc", label: "↑" }, { key: "tr", label: "↗" },
  { key: "ml", label: "←" }, { key: "mc", label: "•" }, { key: "mr", label: "→" },
  { key: "bl", label: "↙" }, { key: "bc", label: "↓" }, { key: "br", label: "↘" },
];

const FONTS = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New", "Impact"];

export default function WatermarkImagePage() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const [text, setText] = useState("© Your Name");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(60);
  const [position, setPosition] = useState<Position>("br");
  const [font, setFont] = useState("Arial");
  const [diagonal, setDiagonal] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WebP)");
      return;
    }
    setError("");
    const img = new Image();
    img.onload = () => { setSourceImage(img); setSourceName(file.name); };
    img.onerror = () => setError("Failed to load image.");
    img.src = URL.createObjectURL(file);
  }, []);

  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px ${font}`;
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = Math.max(2, fontSize / 16);
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const padding = Math.max(20, fontSize / 3);
    const metrics = ctx.measureText(text);
    const textW = metrics.width;
    const textH = fontSize;

    if (diagonal) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.atan2(canvas.height, canvas.width));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 0);
    } else {
      let x = 0, y = 0;
      if (position[0] === "t") { y = padding + textH; ctx.textBaseline = "alphabetic"; }
      if (position[0] === "m") { y = canvas.height / 2 + textH / 3; ctx.textBaseline = "alphabetic"; }
      if (position[0] === "b") { y = canvas.height - padding; ctx.textBaseline = "alphabetic"; }
      if (position[1] === "l") { x = padding; ctx.textAlign = "left"; }
      if (position[1] === "c") { x = canvas.width / 2; ctx.textAlign = "center"; }
      if (position[1] === "r") { x = canvas.width - padding; ctx.textAlign = "right"; }
      ctx.fillText(text, x, y);
    }
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        setResultUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      }
    }, "image/png");
  }, [sourceImage, text, fontSize, color, opacity, position, font, diagonal]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadImage(file);
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceName.replace(/\.[^.]+$/, "") || "image";
    a.download = `${base}-watermarked.png`;
    a.click();
  };

  const reset = () => {
    setSourceImage(null);
    setSourceName("");
    setResultUrl(null);
    setError("");
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!sourceImage ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${dragActive ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
          >
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP · Processed in your browser</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 truncate">{sourceName}</p>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change image</button>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 flex items-center justify-center min-h-[200px]">
                {resultUrl ? (
                  <img src={resultUrl} alt="Watermarked preview" className="max-w-full max-h-[60vh] rounded-lg shadow-sm" />
                ) : (
                  <div className="text-sm text-gray-400">Rendering...</div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Watermark text</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Font</label>
                  <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
                    {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Size: {fontSize}px</label>
                  <input type="range" min={12} max={200} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Opacity: {opacity}%</label>
                  <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-16 rounded cursor-pointer border border-gray-200" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-5">
                  <input type="checkbox" checked={diagonal} onChange={(e) => setDiagonal(e.target.checked)} className="rounded" />
                  Diagonal across image (best for protection)
                </label>
              </div>

              {!diagonal && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Position</label>
                  <div className="inline-grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-gray-50">
                    {POSITIONS.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setPosition(p.key)}
                        className={`h-9 w-9 rounded-lg text-base font-bold transition-colors ${position === p.key ? "bg-violet-600 text-white" : "bg-white text-gray-500 hover:text-gray-900"}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={download}
                disabled={!resultUrl}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:scale-[1.01] active:scale-100 disabled:opacity-50 transition-all"
                style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
              >
                Download Watermarked Image
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
