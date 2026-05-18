"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("pdf-text-extractor")!;

type PageText = { pageNumber: number; text: string };

export default function PdfTextExtractorPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const [pageTexts, setPageTexts] = useState<PageText[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "by-page">("all");
  const [copyFeedback, setCopyFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSourceFile(file);
    setPageTexts([]);
    setProcessing(true);
    setProgressText("Loading PDF parser...");

    try {
      // Dynamic import to keep bundle small
      const pdfjs = await import("pdfjs-dist");
      // Worker is required. Use CDN worker matched to library version.
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const buf = await file.arrayBuffer();
      setProgressText("Parsing PDF...");
      const pdf = await pdfjs.getDocument({ data: buf }).promise;

      const results: PageText[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgressText(`Extracting text · page ${i} of ${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Concatenate text items, joining with space, with line breaks between items separated by significant y-difference
        let lastY: number | null = null;
        let pageText = "";
        for (const item of textContent.items as Array<{ str: string; transform: number[] }>) {
          const y = item.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 5) {
            pageText += "\n";
          } else if (pageText && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
            pageText += " ";
          }
          pageText += item.str;
          lastY = y;
        }
        results.push({ pageNumber: i, text: pageText.trim() });
      }

      setPageTexts(results);
      setProgressText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessing(false);
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

  const allText = pageTexts.map((p) => p.text).join("\n\n");
  const allTextWithMarkers = pageTexts
    .map((p) => `--- Page ${p.pageNumber} ---\n${p.text}`)
    .join("\n\n");
  const totalChars = allText.length;
  const totalWords = allText.trim() ? allText.trim().split(/\s+/).length : 0;

  const copyAll = async () => {
    const text = viewMode === "by-page" ? allTextWithMarkers : allText;
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 1500);
    } catch {
      setCopyFeedback("Copy failed");
      setTimeout(() => setCopyFeedback(""), 1500);
    }
  };

  const downloadTxt = () => {
    const text = viewMode === "by-page" ? allTextWithMarkers : allText;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const base = sourceFile?.name.replace(/\.pdf$/i, "") || "extracted";
    a.download = `${base}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSourceFile(null);
    setPageTexts([]);
    setError("");
    setProgressText("");
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Text-based PDFs · For scanned PDFs, use PDF OCR first</p>
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
            <p className="text-xs text-gray-500 mt-1 truncate">{sourceFile.name}</p>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Extracted from</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{sourceFile.name}</p>
                  <p className="text-xs text-gray-400">{pageTexts.length} page{pageTexts.length !== 1 ? "s" : ""} · {totalWords.toLocaleString()} words · {totalChars.toLocaleString()} characters</p>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change PDF</button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === "all" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
                  >
                    All text
                  </button>
                  <button
                    onClick={() => setViewMode("by-page")}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === "by-page" ? "bg-white shadow-sm text-gray-900" : "text-gray-600"}`}
                  >
                    By page
                  </button>
                </div>
                <button onClick={copyAll} className="rounded-lg border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 px-3 py-1.5 text-xs font-semibold transition-colors">
                  {copyFeedback || "Copy all"}
                </button>
                <button onClick={downloadTxt} className="btn-primary py-1.5 px-4 text-xs">
                  Download .txt
                </button>
              </div>

              <textarea
                readOnly
                value={viewMode === "by-page" ? allTextWithMarkers : allText}
                className="w-full h-96 rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono outline-none resize-y"
              />
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
      <WhatsNext
        currentTool="pdf-text-extractor"
        getCurrentResult={async () => {
          if (!sourceFile) return null;
          return { blob: sourceFile, fileName: sourceFile.name };
        }}
      />
    </ToolPageLayout>
  );
}
