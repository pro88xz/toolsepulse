"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-header-footer")!;

type Slot = "tl" | "tc" | "tr" | "bl" | "bc" | "br";

const SLOT_LABELS: Record<Slot, string> = {
  tl: "Top Left",
  tc: "Top Center",
  tr: "Top Right",
  bl: "Bottom Left",
  bc: "Bottom Center",
  br: "Bottom Right",
};

function substitutePlaceholders(text: string, page: number, total: number): string {
  return text.replace(/\{page\}/g, String(page)).replace(/\{pages\}/g, String(total));
}

export default function PdfHeaderFooterPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<Slot, string>>({
    tl: "",
    tc: "",
    tr: "",
    bl: "",
    bc: "Page {page} of {pages}",
    br: "",
  });
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

  const updateSlot = (slot: Slot, value: string) => {
    setSlots((p) => ({ ...p, [slot]: value }));
  };

  const apply = async () => {
    if (!sourceFile) return;
    // Check at least one slot has content
    const hasAny = Object.values(slots).some((v) => v.trim());
    if (!hasAny) {
      setError("Enter text in at least one position");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const total = pages.length;
      const margin = 36;
      const textColor = rgb(0.2, 0.2, 0.2);

      pages.forEach((page, idx) => {
        const current = idx + 1;
        const { width, height } = page.getSize();

        (Object.entries(slots) as [Slot, string][]).forEach(([slot, raw]) => {
          if (!raw.trim()) return;
          const text = substitutePlaceholders(raw, current, total);
          const textWidth = font.widthOfTextAtSize(text, fontSize);

          let x: number, y: number;
          if (slot.startsWith("t")) {
            y = height - margin;
          } else {
            y = margin - fontSize / 2;
          }
          if (slot.endsWith("l")) {
            x = margin;
          } else if (slot.endsWith("c")) {
            x = (width - textWidth) / 2;
          } else {
            x = width - margin - textWidth;
          }

          page.drawText(text, { x, y, size: fontSize, font, color: textColor });
        });
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
    a.download = `${base}-header-footer.pdf`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setResultUrl(null);
    setPageCount(0);
    setError("");
  };

  // Live preview using current state on page 1
  const previewText = (slot: Slot) => substitutePlaceholders(slots[slot], 1, pageCount || 1);

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Any PDF · Headers and footers added in your browser</p>
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

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Layout preview</p>
                <div className="rounded-lg border border-gray-300 bg-white p-4 aspect-[8.5/11] max-w-md mx-auto grid grid-rows-[auto_1fr_auto] gap-2 text-[10px] font-medium text-gray-600">
                  <div className="flex justify-between items-center min-h-[18px]">
                    <span className="truncate flex-1 text-left">{previewText("tl") || <span className="text-gray-300">top-left</span>}</span>
                    <span className="truncate flex-1 text-center">{previewText("tc") || <span className="text-gray-300">top-center</span>}</span>
                    <span className="truncate flex-1 text-right">{previewText("tr") || <span className="text-gray-300">top-right</span>}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-300 text-xs italic">page content</div>
                  <div className="flex justify-between items-center min-h-[18px]">
                    <span className="truncate flex-1 text-left">{previewText("bl") || <span className="text-gray-300">bottom-left</span>}</span>
                    <span className="truncate flex-1 text-center text-violet-700 font-semibold">{previewText("bc") || <span className="text-gray-300 font-normal">bottom-center</span>}</span>
                    <span className="truncate flex-1 text-right">{previewText("br") || <span className="text-gray-300">bottom-right</span>}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 text-center">Use <code className="bg-violet-100 text-violet-700 px-1 rounded">{`{page}`}</code> for page number, <code className="bg-violet-100 text-violet-700 px-1 rounded">{`{pages}`}</code> for total.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["tl", "tc", "tr", "bl", "bc", "br"] as Slot[]).map((slot) => (
                  <div key={slot}>
                    <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">{SLOT_LABELS[slot]}</label>
                    <input
                      type="text"
                      value={slots[slot]}
                      onChange={(e) => updateSlot(slot, e.target.value)}
                      placeholder="Empty"
                      className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Font size</label>
                  <input
                    type="number"
                    min={6}
                    max={48}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <button onClick={apply} disabled={processing} className="btn-primary w-full py-3">
                {processing ? "Adding headers and footers..." : `Apply to ${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">Headers and footers applied successfully</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download PDF
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
