"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-reorder-pages")!;

type Page = {
  originalIndex: number; // 0-based original position
  thumbnail: string;     // data URL
};

export default function PdfReorderPagesPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [savingFinal, setSavingFinal] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSourceFile(file);
    setPages([]);
    setResultUrl(null);
    setProcessing(true);
    setProgressText("Loading PDF renderer...");

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const buf = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;

      const newPages: Page[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgressText(`Rendering thumbnail ${i} of ${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        newPages.push({
          originalIndex: i - 1,
          thumbnail: canvas.toDataURL("image/png"),
        });
      }

      setPages(newPages);
      setProgressText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSourceFile(null);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };

  // Drag-and-drop reorder handlers
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", String(idx));
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIdx !== null && idx !== draggedIdx) {
      setDropTargetIdx(idx);
    }
  };
  const onDragLeave = () => {
    setDropTargetIdx(null);
  };
  const onDropOnPage = (e: React.DragEvent<HTMLDivElement>, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      setDropTargetIdx(null);
      return;
    }
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIdx, 1);
      next.splice(dropIdx, 0, moved);
      return next;
    });
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };
  const onDragEnd = () => {
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };

  // Quick move buttons for accessibility / mobile fallback
  const moveLeft = (idx: number) => {
    if (idx === 0) return;
    setPages((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };
  const moveRight = (idx: number) => {
    setPages((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const apply = async () => {
    if (!sourceFile) return;
    setSavingFinal(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buf);
      const newPdf = await PDFDocument.create();
      const indices = pages.map((p) => p.originalIndex);
      const copied = await newPdf.copyPages(sourcePdf, indices);
      copied.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingFinal(false);
    }
  };

  const download = () => {
    if (!resultUrl || !sourceFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
    a.download = `${base}-reordered.pdf`;
    a.click();
  };

  const resetOrder = () => {
    setPages((prev) => [...prev].sort((a, b) => a.originalIndex - b.originalIndex));
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setPages([]);
    setResultUrl(null);
    setError("");
  };

  // Has the order changed from original?
  const hasReordered = pages.some((p, i) => p.originalIndex !== i);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!sourceFile ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${dragActive ? "border-violet-400 bg-violet-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
          >
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Visual page thumbnails · Drag to reorder · Browser-only</p>
          </div>
        ) : processing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-5 w-5 text-violet-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">{progressText || "Working..."}</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Source</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{sourceFile.name}</p>
                  <p className="text-xs text-gray-400">{pages.length} pages{hasReordered ? " · reordered" : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {hasReordered && (
                    <button onClick={resetOrder} className="text-xs font-medium text-gray-500 hover:text-gray-700">Reset order</button>
                  )}
                  <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change PDF</button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">Drag pages to reorder, or use the arrows below each thumbnail.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {pages.map((page, idx) => (
                  <div
                    key={`${page.originalIndex}-${idx}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragOver={(e) => onDragOver(e, idx)}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDropOnPage(e, idx)}
                    onDragEnd={onDragEnd}
                    className={`relative rounded-xl border-2 bg-white p-2 transition-all cursor-move ${
                      draggedIdx === idx ? "opacity-40 scale-95" : ""
                    } ${
                      dropTargetIdx === idx ? "border-violet-500 shadow-lg scale-105" : "border-gray-200"
                    }`}
                  >
                    <img src={page.thumbnail} alt={`Page ${page.originalIndex + 1}`} className="w-full rounded-md pointer-events-none" />
                    <div className="absolute top-1 left-1 rounded-md bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5">
                      #{idx + 1}
                    </div>
                    <div className="absolute top-1 right-1 rounded-md bg-white/90 text-gray-500 text-[9px] font-medium px-1.5 py-0.5 border border-gray-200">
                      orig {page.originalIndex + 1}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <button
                        onClick={() => moveLeft(idx)}
                        disabled={idx === 0}
                        aria-label="Move left"
                        className="rounded p-1 text-gray-400 hover:text-violet-600 disabled:opacity-30"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveRight(idx)}
                        disabled={idx === pages.length - 1}
                        aria-label="Move right"
                        className="rounded p-1 text-gray-400 hover:text-violet-600 disabled:opacity-30"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={apply} disabled={savingFinal || !hasReordered} className="btn-primary flex-1 py-3">
                {savingFinal ? "Saving..." : !hasReordered ? "Reorder a page to enable save" : "Apply new order"}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">Pages reordered successfully</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Reordered PDF
                </button>
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
