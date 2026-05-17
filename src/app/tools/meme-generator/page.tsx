"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";

const tool = getToolBySlug("meme-generator")!;

export default function MemeGeneratorPage() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [fontSize, setFontSize] = useState(48);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [textColor, setTextColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
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

  // Wrap long lines to multiple lines if width exceeds canvas
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    maxWidth: number,
    yStart: number,
    lineHeight: number,
    fromBottom = false
  ) => {
    if (!text) return;
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);

    lines.forEach((line, i) => {
      const y = fromBottom
        ? yStart - (lines.length - 1 - i) * lineHeight
        : yStart + i * lineHeight;
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
    });
  };

  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = sourceImage.naturalWidth;
    const H = sourceImage.naturalHeight;
    canvas.width = W;
    canvas.height = H;
    ctx.drawImage(sourceImage, 0, 0);

    // Scale font size with image dimensions (so it looks right on small + large images)
    const scaledSize = Math.round((fontSize * W) / 800);
    const scaledStroke = Math.max(1, Math.round((strokeWidth * W) / 800));
    ctx.font = `bold ${scaledSize}px Impact, "Arial Black", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = scaledStroke;
    ctx.lineJoin = "round";

    const padding = scaledSize * 0.4;
    const lineHeight = scaledSize * 1.05;
    const maxWidth = W * 0.92;

    // Top text
    ctx.textBaseline = "top";
    drawWrappedText(ctx, topText.toUpperCase(), W / 2, maxWidth, padding, lineHeight, false);

    // Bottom text — anchored from bottom
    ctx.textBaseline = "alphabetic";
    drawWrappedText(ctx, bottomText.toUpperCase(), W / 2, maxWidth, H - padding, lineHeight, true);

    canvas.toBlob((blob) => {
      if (blob) {
        setResultUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      }
    }, "image/png");
  }, [sourceImage, topText, bottomText, fontSize, strokeWidth, textColor, strokeColor]);

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
    const base = sourceName.replace(/\.[^.]+$/, "") || "meme";
    a.download = `${base}-meme.png`;
    a.click();
  };

  const reset = () => {
    setSourceImage(null);
    setSourceName("");
    setResultUrl(null);
    setError("");
  };

  return (
    <ToolPageLayout tool={tool} hideWhatsNext>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Any JPG, PNG, or WebP · Processed in your browser</p>
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
                  <img src={resultUrl} alt="Meme preview" className="max-w-full max-h-[60vh] rounded-lg shadow-sm" />
                ) : (
                  <div className="text-sm text-gray-400">Rendering...</div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Top text</label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="TOP TEXT"
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Bottom text</label>
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="BOTTOM TEXT"
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Size: {fontSize}px</label>
                  <input type="range" min={24} max={96} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stroke: {strokeWidth}px</label>
                  <input type="range" min={0} max={12} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Text</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-full rounded cursor-pointer border border-gray-200" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stroke</label>
                  <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-9 w-full rounded cursor-pointer border border-gray-200" />
                </div>
              </div>

              <button onClick={download} disabled={!resultUrl} className="btn-primary w-full py-3">
                Download Meme
              </button>
            </div>
          </>
        )}

        <WhatsNext currentTool="meme-generator" />

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
