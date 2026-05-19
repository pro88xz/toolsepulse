"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";

const tool = getToolBySlug("sharpen-image")!;

/**
 * Applies a 3x3 sharpening convolution kernel to image data.
 * Intensity controls the center weight: higher = sharper.
 *
 * Kernel structure (for intensity i):
 *   [  0  -1   0 ]
 *   [ -1  1+4i -1 ]
 *   [  0  -1   0 ]
 *
 * Sum of weights stays at 1 so brightness is preserved.
 */
function sharpenImageData(src: ImageData, intensity: number): ImageData {
  const w = src.width;
  const h = src.height;
  const dst = new ImageData(w, h);
  const s = src.data;
  const d = dst.data;
  const center = 1 + 4 * intensity;
  const side = -intensity;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // Edge pixels: pass through unchanged
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
        d[i] = s[i];
        d[i + 1] = s[i + 1];
        d[i + 2] = s[i + 2];
        d[i + 3] = s[i + 3];
        continue;
      }
      const up = i - w * 4;
      const dn = i + w * 4;
      const lf = i - 4;
      const rt = i + 4;
      for (let c = 0; c < 3; c++) {
        const v = s[i + c] * center + (s[up + c] + s[dn + c] + s[lf + c] + s[rt + c]) * side;
        d[i + c] = Math.max(0, Math.min(255, v));
      }
      d[i + 3] = s[i + 3];
    }
  }
  return dst;
}

export default function SharpenImagePage() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [intensity, setIntensity] = useState(1.5);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setError("");
    const img = new Image();
    img.onload = () => { setSourceImage(img); setSourceName(file.name); };
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

  // Re-render whenever source or intensity changes
  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;
    setProcessing(true);
    const canvas = canvasRef.current;
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) { setError("Canvas unavailable"); setProcessing(false); return; }

    ctx.drawImage(sourceImage, 0, 0);
    if (intensity > 0) {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const sharpened = sharpenImageData(imageData, intensity);
        ctx.putImageData(sharpened, 0, 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    canvas.toBlob((blob) => {
      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
      }
      setProcessing(false);
    }, "image/png");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceImage, intensity]);

  const download = () => {
    if (!resultUrl || !sourceName) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceName.replace(/\.[^.]+$/, "") || "image";
    a.download = `${base}-sharpened.png`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setSourceImage(null);
    setSourceName("");
    setIntensity(1.5);
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19 8.025 5l1.91-.19A2.25 2.25 0 0 1 12 2.25l2.065.56 1.91.19a2.25 2.25 0 0 1 1.91 1.91l.19 1.91.56 2.065-.56 2.065-.19 1.91a2.25 2.25 0 0 1-1.91 1.91l-1.91.19L12 15.75l-2.065-.56-1.91-.19a2.25 2.25 0 0 1-1.91-1.91L5.925 11.18 5.365 9.115l.56-2.065.19-1.86Z M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP · Sharpening runs in your browser</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="rounded-xl bg-gray-50 p-2 mb-4 flex items-center justify-center min-h-[200px]">
                {resultUrl ? (
                  <img src={resultUrl} alt="Sharpened preview" className="max-w-full max-h-[500px] rounded-lg shadow-sm" />
                ) : (
                  <div className="text-sm text-gray-400">Processing...</div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <p className="text-xs text-gray-500 text-center">{sourceImage.naturalWidth} × {sourceImage.naturalHeight} · {sourceName}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sharpening intensity</label>
                  <span className="text-sm font-bold text-violet-700">{intensity.toFixed(1)}</span>
                </div>
                <input type="range" min={0} max={5} step={0.1} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-violet-600" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>None</span>
                  <span>Mild</span>
                  <span>Strong</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setIntensity(0.5)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Subtle</button>
                <button onClick={() => setIntensity(1.5)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Default</button>
                <button onClick={() => setIntensity(3)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Strong (text/docs)</button>
                <button onClick={() => setIntensity(0)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Off</button>
              </div>

              <div className="flex gap-3">
                <button onClick={download} disabled={!resultUrl || processing} className="btn-primary flex-1 py-3">
                  {processing ? "Processing..." : "Download Sharpened Image"}
                </button>
                <button onClick={reset} className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Change image</button>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
      <WhatsNext currentTool="sharpen-image" />
    </ToolPageLayout>
  );
}
