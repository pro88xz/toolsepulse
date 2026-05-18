"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("image-rotator")!;

export default function ImageRotatorPage() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const [angle, setAngle] = useState(0);
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
    img.onload = () => { setSourceImage(img); setSourceName(file.name); setAngle(0); };
    img.onerror = () => setError("Failed to load image.");
    img.src = URL.createObjectURL(file);
  }, []);

  // On mount: check if a file was passed from another tool via inbox
  useEffect(() => {
    const fromTool = new URLSearchParams(window.location.search).get("from");
    if (!fromTool) return;
    (async () => {
      const item = await takeFromInbox();
      if (!item) return;
      const file = inboxItemToFile(item);
      setInboxSource(item.sourceTool);
      loadImage(file);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = sourceImage.naturalWidth;
    const h = sourceImage.naturalHeight;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    // New canvas size needs to fit the rotated bounding box
    const newW = Math.round(w * cos + h * sin);
    const newH = Math.round(w * sin + h * cos);

    canvas.width = newW;
    canvas.height = newH;
    ctx.clearRect(0, 0, newW, newH);

    // Move to center, rotate, draw centered
    ctx.translate(newW / 2, newH / 2);
    ctx.rotate(rad);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(sourceImage, -w / 2, -h / 2);
    // Reset transform for next render
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setResultUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      }
    }, "image/png");
  }, [sourceImage, angle]);

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

  const setPreset = (deg: number) => setAngle(((deg % 360) + 360) % 360);
  const rotateRight = () => setAngle((a) => (a + 90) % 360);
  const rotateLeft = () => setAngle((a) => ((a - 90) % 360 + 360) % 360);

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceName.replace(/\.[^.]+$/, "") || "image";
    a.download = `${base}-rotated.png`;
    a.click();
  };

  const reset = () => {
    setSourceImage(null);
    setSourceName("");
    setResultUrl(null);
    setAngle(0);
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP · Processed in your browser</p>
          </div>
        ) : (
          <>
            {inboxSource && (
              <InboxBanner
                sourceToolSlug={inboxSource}
                fileName={sourceName}
                onStartFresh={() => { reset(); setInboxSource(null); }}
              />
            )}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 truncate">{sourceName}</p>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change image</button>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 flex items-center justify-center min-h-[300px]">
                {resultUrl ? (
                  <img src={resultUrl} alt="Rotated preview" className="max-w-full max-h-[60vh] rounded-lg shadow-sm" />
                ) : (
                  <div className="text-sm text-gray-400">Rendering...</div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <button onClick={rotateLeft} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                  −90°
                </button>
                <button onClick={rotateRight} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  +90°
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
                </button>
                <button onClick={() => setPreset(180)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  180° flip
                </button>
                <button onClick={() => setPreset(0)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Reset
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-900">Custom angle</label>
                  <span className="text-sm font-mono text-violet-600">{angle}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              <button
                onClick={download}
                disabled={!resultUrl}
                className="btn-primary w-full py-3"
              >
                Download Rotated Image
              </button>
            </div>
          </>
        )}

        <WhatsNext
          currentTool="image-rotator"
          getCurrentResult={async () => {
            if (!resultUrl || !sourceName) return null;
            const res = await fetch(resultUrl);
            const blob = await res.blob();
            const base = sourceName.replace(/\.[^.]+$/, "") || "image";
            return { blob, fileName: `${base}-rotated.png` };
          }}
        />

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
