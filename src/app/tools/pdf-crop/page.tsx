"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("pdf-crop")!;

export default function PdfCropPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [top, setTop] = useState(36);
  const [bottom, setBottom] = useState(36);
  const [left, setLeft] = useState(36);
  const [right, setRight] = useState(36);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
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
      const first = pdf.getPages()[0];
      if (first) {
        const { width, height } = first.getSize();
        setPageSize({ width, height });
      }
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

  const apply = async () => {
    if (!sourceFile || !pageSize) return;
    if (left + right >= pageSize.width || top + bottom >= pageSize.height) {
      setError("Crop margins are larger than the page — would leave nothing visible");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        // Set crop box: x, y, width, height (relative to page origin at bottom-left)
        // We want to remove top, bottom, left, right amounts
        const newX = left;
        const newY = bottom;
        const newWidth = width - left - right;
        const newHeight = height - top - bottom;
        if (newWidth > 0 && newHeight > 0) {
          page.setCropBox(newX, newY, newWidth, newHeight);
        }
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
    a.download = `${base}-cropped.pdf`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setResultUrl(null);
    setPageCount(0);
    setPageSize(null);
    setError("");
  };

  // Computed preview values
  const newW = pageSize ? Math.max(0, pageSize.width - left - right) : 0;
  const newH = pageSize ? Math.max(0, pageSize.height - top - bottom) : 0;
  const previewScale = pageSize ? Math.min(200 / pageSize.width, 260 / pageSize.height) : 0;

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25 1.5 1.5m4.572 6.572a4.5 4.5 0 0 1 6.476-.443m.443 6.476a4.5 4.5 0 0 1-6.443-.443M22.5 22.5l-6.348-6.348m-6.476-.443 6.476.443m-6.476-.443a4.5 4.5 0 0 0 6.476.443" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Any PDF · Margins cropped in your browser</p>
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
                  <p className="text-xs text-gray-400">
                    {pageCount} page{pageCount !== 1 ? "s" : ""}
                    {pageSize && ` · ${Math.round(pageSize.width)}×${Math.round(pageSize.height)} pt`}
                  </p>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change PDF</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Top (pt)</label>
                      <input type="number" min={0} value={top} onChange={(e) => setTop(Math.max(0, Number(e.target.value)))} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Bottom (pt)</label>
                      <input type="number" min={0} value={bottom} onChange={(e) => setBottom(Math.max(0, Number(e.target.value)))} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Left (pt)</label>
                      <input type="number" min={0} value={left} onChange={(e) => setLeft(Math.max(0, Number(e.target.value)))} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Right (pt)</label>
                      <input type="number" min={0} value={right} onChange={(e) => setRight(Math.max(0, Number(e.target.value)))} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => { setTop(0); setBottom(0); setLeft(0); setRight(0); }} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">No crop</button>
                    <button onClick={() => { setTop(18); setBottom(18); setLeft(18); setRight(18); }} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">0.25"</button>
                    <button onClick={() => { setTop(36); setBottom(36); setLeft(36); setRight(36); }} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">0.5"</button>
                    <button onClick={() => { setTop(72); setBottom(72); setLeft(72); setRight(72); }} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">1"</button>
                  </div>
                  <p className="text-xs text-gray-500">Result: <span className="font-semibold text-violet-700">{Math.round(newW)}×{Math.round(newH)} pt</span> (1 inch = 72 pt)</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 text-center mb-2">Preview</p>
                    {pageSize && (
                      <div
                        className="relative bg-white border border-gray-300 mx-auto"
                        style={{ width: pageSize.width * previewScale, height: pageSize.height * previewScale }}
                      >
                        <div
                          className="absolute bg-violet-100 border-2 border-violet-500"
                          style={{
                            left: left * previewScale,
                            top: top * previewScale,
                            width: Math.max(0, (pageSize.width - left - right) * previewScale),
                            height: Math.max(0, (pageSize.height - top - bottom) * previewScale),
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={apply} disabled={processing} className="btn-primary w-full py-3">
                {processing ? "Cropping..." : `Crop ${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">PDF cropped successfully</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Cropped PDF
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
        currentTool="pdf-crop"
        getCurrentResult={async () => {
          if (!resultUrl || !sourceFile) return null;
          const res = await fetch(resultUrl);
          const blob = await res.blob();
          const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
          return { blob, fileName: `${base}-cropped.pdf` };
        }}
      />
    </ToolPageLayout>
  );
}
