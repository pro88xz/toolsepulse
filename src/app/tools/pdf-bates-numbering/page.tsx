"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-bates-numbering")!;

type Position = "tl" | "tr" | "bl" | "br";

const POS_LABELS: Record<Position, string> = {
  tl: "Top Left",
  tr: "Top Right",
  bl: "Bottom Left",
  br: "Bottom Right",
};

function buildBatesLabel(prefix: string, number: number, padding: number, suffix: string): string {
  const num = String(number).padStart(padding, "0");
  return `${prefix}${num}${suffix}`;
}

export default function PdfBatesNumberingPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("SMITH-");
  const [suffix, setSuffix] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [padding, setPadding] = useState(6);
  const [position, setPosition] = useState<Position>("br");
  const [fontSize, setFontSize] = useState(10);
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
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const margin = 24;
      const textColor = rgb(0.15, 0.15, 0.15);

      pages.forEach((page, idx) => {
        const label = buildBatesLabel(prefix, startNumber + idx, padding, suffix);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        let x: number, y: number;
        if (position.startsWith("t")) {
          y = height - margin;
        } else {
          y = margin - fontSize / 2;
        }
        if (position.endsWith("l")) {
          x = margin;
        } else {
          x = width - margin - textWidth;
        }

        page.drawText(label, { x, y, size: fontSize, font, color: textColor });
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
    a.download = `${base}-bates.pdf`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setResultUrl(null);
    setPageCount(0);
    setError("");
  };

  // Preview values
  const firstLabel = buildBatesLabel(prefix, startNumber, padding, suffix);
  const lastLabel = pageCount > 0 ? buildBatesLabel(prefix, startNumber + pageCount - 1, padding, suffix) : "";

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97ZM5.25 4.97c-1.01.143-2.01.317-3 .52L4.872 16.215c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202l-2.62-10.726Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Legal-grade Bates stamping · Private, in your browser</p>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Prefix</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="SMITH-"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Suffix (optional)</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="-CONF"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Start #</label>
                  <input
                    type="number"
                    min={0}
                    value={startNumber}
                    onChange={(e) => setStartNumber(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Padding</label>
                  <select value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400">
                    <option value={4}>4 digits</option>
                    <option value={5}>5 digits</option>
                    <option value={6}>6 digits (standard)</option>
                    <option value={7}>7 digits</option>
                    <option value={8}>8 digits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Position</label>
                  <select value={position} onChange={(e) => setPosition(e.target.value as Position)} className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400">
                    {(["tl", "tr", "bl", "br"] as Position[]).map((p) => (
                      <option key={p} value={p}>{POS_LABELS[p]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Font size</label>
                  <input
                    type="number"
                    min={6}
                    max={24}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-violet-50 border-2 border-violet-200 p-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 mb-2">Preview range</p>
                <p className="text-sm font-mono font-bold text-violet-700">
                  {firstLabel}
                  {pageCount > 1 && (
                    <>
                      <span className="text-violet-400 mx-2">→</span>
                      {lastLabel}
                    </>
                  )}
                </p>
                <p className="text-[11px] text-violet-500 mt-1">{pageCount} unique Bates label{pageCount !== 1 ? "s" : ""} will be applied</p>
              </div>

              <button onClick={apply} disabled={processing} className="btn-primary w-full py-3">
                {processing ? "Applying Bates numbers..." : `Apply Bates to ${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">Bates numbers applied successfully</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Bates-Stamped PDF
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
