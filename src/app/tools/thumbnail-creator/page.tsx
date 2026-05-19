"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";

const tool = getToolBySlug("thumbnail-creator")!;

type Size = { w: number; h: number; label: string };
type ResizeMode = "fit" | "crop";

const PRESETS: Record<string, Size[]> = {
  "App icons (iOS + Android)": [
    { w: 1024, h: 1024, label: "App Store" },
    { w: 512, h: 512, label: "Play Store" },
    { w: 192, h: 192, label: "Android xxxhdpi" },
    { w: 180, h: 180, label: "iOS @3x" },
    { w: 167, h: 167, label: "iPad Pro" },
    { w: 152, h: 152, label: "iPad" },
    { w: 120, h: 120, label: "iPhone @2x" },
    { w: 87, h: 87, label: "iPhone setting" },
    { w: 60, h: 60, label: "iPhone @1x" },
    { w: 48, h: 48, label: "Android mdpi" },
  ],
  "Video thumbnails": [
    { w: 1280, h: 720, label: "YouTube" },
    { w: 1920, h: 1080, label: "Vimeo HD" },
    { w: 1080, h: 1920, label: "TikTok / Reels" },
    { w: 640, h: 360, label: "Standard 360p" },
    { w: 320, h: 180, label: "Small preview" },
  ],
  "Social media": [
    { w: 1200, h: 630, label: "Open Graph" },
    { w: 1200, h: 675, label: "Twitter Card" },
    { w: 1080, h: 1080, label: "Instagram square" },
    { w: 1080, h: 1920, label: "Instagram Story" },
    { w: 1200, h: 627, label: "LinkedIn share" },
  ],
  "Responsive web": [
    { w: 1920, h: 1080, label: "Desktop" },
    { w: 1280, h: 720, label: "Laptop" },
    { w: 1024, h: 768, label: "Tablet" },
    { w: 768, h: 576, label: "Tablet small" },
    { w: 480, h: 360, label: "Mobile large" },
    { w: 320, h: 240, label: "Mobile small" },
  ],
};

async function generateThumb(img: HTMLImageElement, w: number, h: number, mode: ResizeMode, format: "png" | "jpeg" | "webp"): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  if (format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingQuality = "high";

  if (mode === "fit") {
    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    // crop: scale image to cover the target, center it
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, `image/${format}`, 0.92));
  if (!blob) throw new Error(`${format.toUpperCase()} encoding failed`);
  return blob;
}

export default function ThumbnailCreatorPage() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [presetKey, setPresetKey] = useState<string>("App icons (iOS + Android)");
  const [customSizes, setCustomSizes] = useState<Size[]>([]);
  const [newW, setNewW] = useState(128);
  const [newH, setNewH] = useState(128);
  const [mode, setMode] = useState<ResizeMode>("crop");
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [results, setResults] = useState<{ size: Size; url: string; blob: Blob }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setError("");
    const img = new Image();
    img.onload = () => { setSourceImage(img); setSourceName(file.name); setResults([]); };
    img.onerror = () => setError("Could not load image");
    img.src = URL.createObjectURL(file);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadImage(f);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadImage(f);
  };

  const addCustom = () => {
    if (newW > 0 && newH > 0 && newW <= 4096 && newH <= 4096) {
      setCustomSizes((p) => [...p, { w: newW, h: newH, label: `${newW}×${newH}` }]);
    }
  };
  const removeCustom = (idx: number) => setCustomSizes((p) => p.filter((_, i) => i !== idx));

  const sizesToGenerate = (): Size[] => [...PRESETS[presetKey], ...customSizes];

  const generate = async () => {
    if (!sourceImage) return;
    setProcessing(true);
    setError("");
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    try {
      const out: { size: Size; url: string; blob: Blob }[] = [];
      for (const size of sizesToGenerate()) {
        const blob = await generateThumb(sourceImage, size.w, size.h, mode, format);
        out.push({ size, url: URL.createObjectURL(blob), blob });
      }
      setResults(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessing(false);
    }
  };

  const downloadOne = (r: { size: Size; url: string }) => {
    const a = document.createElement("a");
    a.href = r.url;
    const base = sourceName.replace(/\.[^.]+$/, "") || "thumb";
    const ext = format === "jpeg" ? "jpg" : format;
    a.download = `${base}-${r.size.w}x${r.size.h}.${ext}`;
    a.click();
  };

  const downloadZip = async () => {
    if (results.length === 0) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const ext = format === "jpeg" ? "jpg" : format;
      const base = sourceName.replace(/\.[^.]+$/, "") || "thumb";
      for (const r of results) {
        zip.file(`${base}-${r.size.w}x${r.size.h}.${ext}`, r.blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thumbnails-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("ZIP failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setZipping(false);
    }
  };

  const reset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    setSourceImage(null);
    setSourceName("");
    setCustomSizes([]);
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z M3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25Z M13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Z M13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP · Higher resolution = sharper thumbnails</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Source</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{sourceName}</p>
                  <p className="text-xs text-gray-400">{sourceImage.naturalWidth} × {sourceImage.naturalHeight}</p>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change image</button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Preset</label>
                <select value={presetKey} onChange={(e) => setPresetKey(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400">
                  {Object.keys(PRESETS).map((k) => <option key={k} value={k}>{k} ({PRESETS[k].length} sizes)</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Custom sizes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {customSizes.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-violet-50 border border-violet-200 px-2 py-1 text-xs text-violet-700">
                      {s.w}×{s.h}
                      <button onClick={() => removeCustom(i)} className="text-violet-400 hover:text-violet-700 ml-1">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="number" min={1} max={4096} value={newW} onChange={(e) => setNewW(Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm" placeholder="W" />
                  <span className="text-gray-400">×</span>
                  <input type="number" min={1} max={4096} value={newH} onChange={(e) => setNewH(Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm" placeholder="H" />
                  <button onClick={addCustom} className="text-xs font-medium text-violet-600 hover:text-violet-700">+ Add</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Resize mode</label>
                  <div className="flex gap-2">
                    <button onClick={() => setMode("crop")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === "crop" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>Crop (exact)</button>
                    <button onClick={() => setMode("fit")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === "fit" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>Fit (letterbox)</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Output format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value as "png" | "jpeg" | "webp")} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-2 text-sm outline-none focus:border-violet-400">
                    <option value="png">PNG (transparency)</option>
                    <option value="jpeg">JPG (smaller)</option>
                    <option value="webp">WebP (modern)</option>
                  </select>
                </div>
              </div>

              <button onClick={generate} disabled={processing || sizesToGenerate().length === 0} className="btn-primary w-full py-3">
                {processing ? "Generating..." : `Generate ${sizesToGenerate().length} thumbnail${sizesToGenerate().length !== 1 ? "s" : ""}`}
              </button>
            </div>

            {results.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <span className="text-sm font-semibold">{results.length} thumbnail{results.length !== 1 ? "s" : ""} ready</span>
                  </div>
                  <button onClick={downloadZip} disabled={zipping} className="rounded-lg border-2 border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50">
                    {zipping ? "Zipping..." : "Download ZIP"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {results.map((r, i) => (
                    <div key={i} className="rounded-xl bg-white border border-emerald-100 p-2 text-center">
                      <div className="rounded bg-gray-50 flex items-center justify-center mb-2" style={{ aspectRatio: `${r.size.w} / ${r.size.h}` }}>
                        <img src={r.url} alt={r.size.label} className="max-w-full max-h-full" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700 truncate">{r.size.label}</p>
                      <p className="text-[10px] text-gray-400">{r.size.w}×{r.size.h}</p>
                      <button onClick={() => downloadOne(r)} className="mt-1 text-[10px] font-medium text-violet-600 hover:text-violet-700">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
      <WhatsNext currentTool="thumbnail-creator" />
    </ToolPageLayout>
  );
}
