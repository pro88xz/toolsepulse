"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("image-blur")!;

export default function ImageBlurPage() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const [blurAmount, setBlurAmount] = useState(10);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WebP)");
      return;
    }
    setError("");
    const img = new Image();
    img.onload = () => {
      setSourceImage(img);
      setSourceName(file.name);
    };
    img.onerror = () => setError("Failed to load image. The file may be corrupted.");
    img.src = URL.createObjectURL(file);
  }, []);

  // Re-render canvas whenever source or blur changes
  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(sourceImage, 0, 0);
    ctx.filter = "none";

    setProcessing(true);
    canvas.toBlob((blob) => {
      if (blob) {
        setResultUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      }
      setProcessing(false);
    }, "image/png");
  }, [sourceImage, blurAmount]);

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
    a.download = `${base}-blurred.png`;
    a.click();
  };

  const reset = () => {
    setSourceImage(null);
    setSourceName("");
    setResultUrl(null);
    setBlurAmount(10);
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
            className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
              dragActive ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
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
              <div className="rounded-xl bg-gray-50 p-3 flex items-center justify-center">
                {resultUrl ? (
                  <img src={resultUrl} alt="Blurred preview" className="max-w-full max-h-[60vh] rounded-lg shadow-sm" />
                ) : (
                  <div className="h-72 flex items-center justify-center text-sm text-gray-400">Processing...</div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">Blur intensity</label>
                <span className="text-sm font-mono text-violet-600">{blurAmount}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>None</span>
                <span>Light</span>
                <span>Medium</span>
                <span>Heavy</span>
                <span>Censor</span>
              </div>

              <button
                onClick={download}
                disabled={processing || !resultUrl}
                className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:scale-[1.01] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
              >
                {processing ? "Processing..." : "Download Blurred Image"}
              </button>
            </div>
          </>
        )}

        <WhatsNext
          currentTool="image-blur"
          getCurrentResult={async () => {
            if (!resultUrl || !sourceName) return null;
            const res = await fetch(resultUrl);
            const blob = await res.blob();
            const base = sourceName.replace(/\.[^.]+$/, "") || "image";
            return { blob, fileName: `${base}-blurred.png` };
          }}
        />

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
