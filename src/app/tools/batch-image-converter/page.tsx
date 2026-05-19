"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("batch-image-converter")!;

type OutputFormat = "jpeg" | "png" | "webp" | "avif";

type FileItem = {
  id: string;
  file: File;
  status: "pending" | "converting" | "done" | "error";
  outputUrl?: string;
  outputBlob?: Blob;
  outputSize?: number;
  errorMsg?: string;
};

const formatLabels: Record<OutputFormat, string> = {
  jpeg: "JPG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function convertFile(file: File, format: OutputFormat, quality: number): Promise<Blob> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("Could not decode image"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  // White background for JPG (no alpha support)
  if (format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0);

  const mime = `image/${format}`;
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, mime, format === "png" ? undefined : quality / 100));
  if (!blob) throw new Error(`${formatLabels[format]} encoding not supported in this browser`);
  return blob;
}

export default function BatchImageConverterPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [format, setFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState(92);
  const [processing, setProcessing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [inboxSource, setInboxSource] = useState<string | null>(null);

  // On mount: check if a file was passed from another tool via inbox
  useEffect(() => {
    const fromTool = new URLSearchParams(window.location.search).get("from");
    if (!fromTool) return;
    (async () => {
      const item = await takeFromInbox();
      if (!item) return;
      const file = inboxItemToFile(item);
      setInboxSource(item.sourceTool);
      addFiles([file]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    setError("");
    const arr = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) {
      setError("Please select image files (JPG, PNG, WebP, etc.)");
      return;
    }
    const items: FileItem[] = arr.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...items]);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.outputUrl) URL.revokeObjectURL(f.outputUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const convertAll = async () => {
    setProcessing(true);
    setError("");
    const pending = files.filter((f) => f.status === "pending" || f.status === "error");
    for (const item of pending) {
      setFiles((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "converting" } : x)));
      try {
        const blob = await convertFile(item.file, format, quality);
        const url = URL.createObjectURL(blob);
        setFiles((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "done", outputUrl: url, outputBlob: blob, outputSize: blob.size } : x)));
      } catch (err) {
        setFiles((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "error", errorMsg: err instanceof Error ? err.message : String(err) } : x)));
      }
    }
    setProcessing(false);
  };

  const downloadOne = (item: FileItem) => {
    if (!item.outputUrl) return;
    const a = document.createElement("a");
    a.href = item.outputUrl;
    const base = item.file.name.replace(/\.[^.]+$/, "");
    const ext = format === "jpeg" ? "jpg" : format;
    a.download = `${base}.${ext}`;
    a.click();
  };

  const downloadZip = async () => {
    const done = files.filter((f) => f.status === "done" && f.outputBlob);
    if (done.length === 0) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const ext = format === "jpeg" ? "jpg" : format;
      for (const item of done) {
        const base = item.file.name.replace(/\.[^.]+$/, "");
        zip.file(`${base}.${ext}`, item.outputBlob!);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-${format}-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("ZIP creation failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setZipping(false);
    }
  };

  const reset = () => {
    files.forEach((f) => f.outputUrl && URL.revokeObjectURL(f.outputUrl));
    setFiles([]);
    setError("");
  };

  const doneCount = files.filter((f) => f.status === "done").length;
  const allDone = files.length > 0 && doneCount === files.length;

  return (
    <ToolPageLayout tool={tool} hideWhatsNext>
      <div className="space-y-6">
        {files.length === 0 ? (
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop multiple images or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, AVIF, GIF, BMP · All processed in your browser</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Convert all to</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)} className="rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400">
                    <option value="webp">WebP — best modern format</option>
                    <option value="jpeg">JPG — universal</option>
                    <option value="png">PNG — lossless, supports transparency</option>
                    <option value="avif">AVIF — newest, smallest files</option>
                  </select>
                </div>
                {(format === "jpeg" || format === "webp" || format === "avif") && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Quality: {quality}</label>
                    <input type="range" min={40} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-violet-600" />
                  </div>
                )}
                <button onClick={() => inputRef.current?.click()} className="text-xs font-medium text-violet-600 hover:text-violet-700">+ Add more</button>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>
              </div>
              <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFile} className="hidden" />

              <div className="flex gap-3">
                <button onClick={convertAll} disabled={processing || files.every((f) => f.status === "done")} className="btn-primary flex-1 py-3">
                  {processing ? `Converting (${doneCount}/${files.length})...` : `Convert All to ${formatLabels[format]}`}
                </button>
                {allDone && (
                  <button onClick={downloadZip} disabled={zipping} className="rounded-xl border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50">
                    {zipping ? "Zipping..." : "Download ZIP"}
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">{files.length} file{files.length !== 1 ? "s" : ""}</p>
              <div className="divide-y divide-gray-100">
                {files.map((item) => (
                  <div key={item.id} className="py-2 flex items-center gap-3 text-sm">
                    <span className="flex-1 truncate text-gray-700">{item.file.name}</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">{formatSize(item.file.size)}{item.outputSize ? ` → ${formatSize(item.outputSize)}` : ""}</span>
                    {item.status === "pending" && <span className="text-xs text-gray-400">Pending</span>}
                    {item.status === "converting" && <span className="text-xs text-violet-600">Converting...</span>}
                    {item.status === "done" && (
                      <button onClick={() => downloadOne(item)} className="text-xs font-medium text-violet-600 hover:text-violet-700">Download</button>
                    )}
                    {item.status === "error" && (
                      <span className="text-xs text-rose-600 truncate max-w-[160px]" title={item.errorMsg}>Failed</span>
                    )}
                    <button onClick={() => removeFile(item.id)} aria-label="Remove" className="text-gray-300 hover:text-rose-500 text-lg leading-none">×</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
      <WhatsNext currentTool="batch-image-converter" />
    </ToolPageLayout>
  );
}
