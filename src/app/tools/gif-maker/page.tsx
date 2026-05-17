"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("gif-maker")!;

type Frame = { id: string; file: File; url: string; width: number; height: number };

// gif.js types are weak; cast to any in usage
async function loadGifJs(): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.GIF) return w.GIF;
  // Load from CDN — gif.js worker needs a network-resolvable URL anyway
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load gif.js"));
    document.head.appendChild(s);
  });
  return w.GIF;
}

export default function GifMakerPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [delay, setDelay] = useState(120); // ms per frame
  const [quality, setQuality] = useState(5); // 1=best, 30=smallest
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) {
      setError("Please select image files (JPG, PNG, WebP)");
      return;
    }
    const newFrames: Frame[] = [];
    for (const file of arr) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          newFrames.push({
            id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            file, url, width: img.naturalWidth, height: img.naturalHeight,
          });
          resolve();
        };
        img.onerror = () => resolve();
        img.src = url;
      });
    }
    setFrames((prev) => [...prev, ...newFrames]);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeFrame = (id: string) => {
    setFrames((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const moveFrame = (id: string, dir: -1 | 1) => {
    setFrames((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  const generate = async () => {
    if (frames.length < 2) {
      setError("Need at least 2 frames to make a GIF");
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError("");
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const GIF = (await loadGifJs()) as any;
      // Use first frame's dimensions as canvas size; others get scaled to match
      const W = frames[0].width;
      const H = frames[0].height;

      const gif = new GIF({
        workers: 2,
        quality,
        width: W,
        height: H,
        workerScript: "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js",
        dither: "FloydSteinberg",
      });

      for (const frame of frames) {
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        const img = new Image();
        img.src = frame.url;
        await new Promise<void>((res) => { img.onload = () => res(); });
        // Center-fit each frame to match first frame's dimensions
        const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const x = (W - drawW) / 2;
        const y = (H - drawH) / 2;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, x, y, drawW, drawH);
        gif.addFrame(canvas, { delay, copy: true });
      }

      gif.on("progress", (p: number) => setProgress(Math.round(p * 100)));
      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        setResultSize(blob.size);
        setProcessing(false);
      });
      gif.on("abort", () => {
        setProcessing(false);
        setError("Encoding aborted");
      });

      gif.render();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `animated-${Date.now()}.gif`;
    a.click();
  };

  const reset = () => {
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFrames([]);
    setResultUrl(null);
    setProgress(0);
    setError("");
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {frames.length === 0 ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${dragActive ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
          >
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop multiple images or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP · Order them in the next step · Processed in your browser</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">{frames.length} frame{frames.length !== 1 ? "s" : ""}</p>
                <div className="flex gap-2">
                  <button onClick={() => inputRef.current?.click()} className="text-xs font-medium text-violet-600 hover:text-violet-700">+ Add more</button>
                  <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>
                </div>
              </div>
              <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFile} className="hidden" />

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {frames.map((frame, i) => (
                  <div key={frame.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                    <img src={frame.url} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">{i + 1}</div>
                    <button onClick={() => removeFrame(frame.id)} aria-label="Remove frame" className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-600 text-white text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveFrame(frame.id, -1)} disabled={i === 0} className="h-5 w-5 rounded bg-black/70 text-white text-xs disabled:opacity-30">‹</button>
                      <button onClick={() => moveFrame(frame.id, 1)} disabled={i === frames.length - 1} className="h-5 w-5 rounded bg-black/70 text-white text-xs disabled:opacity-30">›</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Frame delay: <span className="text-violet-600 font-mono">{delay}ms</span></label>
                  <input type="range" min={40} max={500} step={10} value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="w-full accent-violet-600" />
                  <p className="text-xs text-gray-500 mt-1">Lower = faster animation. 100ms is common for smooth motion.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Quality: <span className="text-violet-600 font-mono">{quality}</span></label>
                  <input type="range" min={1} max={20} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-violet-600" />
                  <p className="text-xs text-gray-500 mt-1">1 = best quality, larger file. 20 = smaller, more dithering.</p>
                </div>
              </div>

              {processing && (
                <div>
                  <div className="flex items-center justify-between text-sm text-violet-600 mb-2">
                    <span className="font-medium">Encoding GIF...</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-pink-600 transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <button onClick={generate} disabled={processing || frames.length < 2} className="btn-primary w-full py-3">
                {processing ? "Encoding..." : `Create GIF (${frames.length} frames)`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">GIF ready · {(resultSize / 1024).toFixed(1)} KB</span>
                </div>
                <div className="rounded-xl bg-white p-3 flex justify-center mb-4">
                  <img src={resultUrl} alt="Generated GIF" className="max-w-full max-h-[50vh] rounded shadow-sm" />
                </div>
                <button onClick={download} className="btn-primary w-full py-3">Download GIF</button>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
