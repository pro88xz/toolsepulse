"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-page-numbering")!;

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type Format = "plain" | "page-x" | "page-x-of-y";

function formatLabel(p: Position): string {
  const map: Record<Position, string> = {
    "top-left": "Top Left",
    "top-center": "Top Center",
    "top-right": "Top Right",
    "bottom-left": "Bottom Left",
    "bottom-center": "Bottom Center",
    "bottom-right": "Bottom Right",
  };
  return map[p];
}

function buildNumberText(format: Format, current: number, total: number): string {
  if (format === "plain") return String(current);
  if (format === "page-x") return `Page ${current}`;
  return `${current} of ${total}`;
}

export default function PdfPageNumberingPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<Format>("plain");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSourceFile(file);
    setResultUrl(null);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: false });
      setPageCount(pdf.getPageCount());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read PDF");
      setSourceFile(null);
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

  const apply = async () => {
    if (!sourceFile) return;
    setProcessing(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const current = startNumber + idx;
        const text = buildNumberText(format, current, total);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const margin = 36;

        let x: number, y: number;
        if (position.startsWith("top")) {
          y = height - margin;
        } else {
          y = margin - fontSize / 2;
        }
        if (position.endsWith("left")) {
          x = margin;
        } else if (position.endsWith("center")) {
          x = (width - textWidth) / 2;
        } else {
          x = width - margin - textWidth;
        }

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
      });

      const bytes = await pdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !sourceFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
    a.download = `${base}-numbered.pdf`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setResultUrl(null);
    setPageCount(0);
    setError("");
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Any PDF · Page numbers added in your browser</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Source</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{sourceFile.name}</p>
                  <p className="text-xs text-gray-400">{pageCount} page{pageCount !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change PDF</button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as Position[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all ${
                        position === p ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {formatLabel(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value as Format)} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400">
                    <option value="plain">1, 2, 3...</option>
                    <option value="page-x">Page 1, Page 2...</option>
                    <option value="page-x-of-y">1 of N</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Start at</label>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    value={startNumber}
                    onChange={(e) => setStartNumber(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Font size</label>
                  <input
                    type="number"
                    min={6}
                    max={48}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Preview</p>
                <p className="text-sm font-semibold text-gray-800">
                  Page 1 displays: <span className="text-violet-700">{buildNumberText(format, startNumber, pageCount)}</span>
                </p>
              </div>

              <button onClick={apply} disabled={processing} className="btn-primary w-full py-3">
                {processing ? "Adding page numbers..." : `Add page numbers to ${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">PDF numbered successfully</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Numbered PDF
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
