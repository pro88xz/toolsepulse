"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("pdf-page-extractor")!;

/**
 * Parses "1-3, 5, 8-10" into [1, 2, 3, 5, 8, 9, 10].
 * Returns the parsed list, or throws an Error with a friendly message.
 */
function parsePageRange(input: string, totalPages: number): number[] {
  const cleaned = input.replace(/\s/g, "");
  if (!cleaned) throw new Error("Enter at least one page or range");

  const result: number[] = [];
  const seen = new Set<number>();

  for (const part of cleaned.split(",")) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) throw new Error(`Invalid range: ${part}`);
      if (start < 1 || end < 1) throw new Error(`Pages start at 1`);
      if (start > totalPages || end > totalPages) throw new Error(`Page ${Math.max(start, end)} is beyond the PDF (${totalPages} pages)`);
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let i = lo; i <= hi; i++) {
        if (!seen.has(i)) { result.push(i); seen.add(i); }
      }
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n)) throw new Error(`Invalid number: ${part}`);
      if (n < 1 || n > totalPages) throw new Error(`Page ${n} is out of range (1-${totalPages})`);
      if (!seen.has(n)) { result.push(n); seen.add(n); }
    }
  }

  if (result.length === 0) throw new Error("No valid pages specified");
  return result;
}

export default function PdfPageExtractorPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState("1-3");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSourceFile(file);
    setResultUrl(null);
    setExtractedCount(0);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: false });
      const count = pdf.getPageCount();
      setPageCount(count);
      // Default to first 3 pages or all if fewer
      setPageRange(count <= 3 ? `1-${count}` : "1-3");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read PDF");
      setSourceFile(null);
    }
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
      loadFile(file);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const extract = async () => {
    if (!sourceFile) return;
    setProcessing(true);
    setError("");
    try {
      const pages = parsePageRange(pageRange, pageCount);
      const buf = await sourceFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buf);

      const newPdf = await PDFDocument.create();
      // pdf-lib uses 0-indexed pages, our UI is 1-indexed
      const indices = pages.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, indices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setExtractedCount(pages.length);
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
    a.download = `${base}-extracted.pdf`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setResultUrl(null);
    setPageCount(0);
    setExtractedCount(0);
    setError("");
  };

  // Try parsing as the user types to give live feedback (without throwing)
  let previewCount = 0;
  let previewError = "";
  if (sourceFile && pageRange.trim()) {
    try {
      previewCount = parsePageRange(pageRange, pageCount).length;
    } catch (e) {
      previewError = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <ToolPageLayout tool={tool} hideWhatsNext>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Any PDF · Page extraction in your browser</p>
          </div>
        ) : (
          <>
            {inboxSource && sourceFile && (
              <InboxBanner
                sourceToolSlug={inboxSource}
                fileName={sourceFile.name}
                onStartFresh={() => { reset(); setInboxSource(null); }}
              />
            )}
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
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Pages to extract <span className="text-gray-400 font-normal normal-case">(e.g. 1-3, 5, 8-10)</span>
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono outline-none focus:border-violet-400"
                  placeholder={`1-${pageCount}`}
                />
                {previewError ? (
                  <p className="text-xs text-rose-600 mt-2">{previewError}</p>
                ) : previewCount > 0 ? (
                  <p className="text-xs text-violet-600 mt-2 font-medium">{previewCount} page{previewCount !== 1 ? "s" : ""} will be extracted</p>
                ) : null}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  <button onClick={() => setPageRange(`1-${pageCount}`)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">All pages</button>
                  <button onClick={() => setPageRange("1")} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">First page only</button>
                  <button onClick={() => setPageRange(`${pageCount}`)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">Last page only</button>
                  {pageCount > 1 && (
                    <button onClick={() => setPageRange(`2-${pageCount}`)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">Skip cover</button>
                  )}
                </div>
              </div>

              <button onClick={extract} disabled={processing || !!previewError || previewCount === 0} className="btn-primary w-full py-3">
                {processing ? "Extracting..." : `Extract ${previewCount} page${previewCount !== 1 ? "s" : ""}`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">{extractedCount} page{extractedCount !== 1 ? "s" : ""} extracted</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Extracted PDF
                </button>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
      <WhatsNext
        currentTool="pdf-page-extractor"
        getCurrentResult={async () => {
          if (!resultUrl || !sourceFile) return null;
          const res = await fetch(resultUrl);
          const blob = await res.blob();
          const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
          return { blob, fileName: `${base}-extracted.pdf` };
        }}
      />
    </ToolPageLayout>
  );
}
