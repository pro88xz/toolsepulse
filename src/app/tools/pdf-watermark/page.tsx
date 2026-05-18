"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("pdf-watermark")!;

function hexToRgbObj(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return { r, g, b };
}

const COLOR_PRESETS = [
  { label: "Red", hex: "#DC2626" },
  { label: "Gray", hex: "#6B7280" },
  { label: "Navy", hex: "#1E3A8A" },
  { label: "Black", hex: "#000000" },
];

const TEXT_PRESETS = ["CONFIDENTIAL", "DRAFT", "DO NOT COPY", "SAMPLE", "PREVIEW", "FOR REVIEW"];

export default function PdfWatermarkPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(25);
  const [fontSize, setFontSize] = useState(80);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState("#DC2626");
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
    if (!sourceFile || !watermarkText.trim()) {
      setError("Enter watermark text first");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const { r, g, b } = hexToRgbObj(color);
      const alpha = opacity / 100;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        // For rotated text, position it centered on the page
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        // Approximate center placement — pdf-lib rotates around the lower-left corner of the text
        // so we offset to center the rotated text on the page center
        const cx = width / 2;
        const cy = height / 2;
        const angle = (rotation * Math.PI) / 180;
        // Offset to make rotation appear around the text's center
        const offsetX = -textWidth / 2;
        const offsetY = -fontSize / 2;
        const rotatedOffsetX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
        const rotatedOffsetY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);

        page.drawText(watermarkText, {
          x: cx + rotatedOffsetX,
          y: cy + rotatedOffsetY,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: alpha,
          rotate: degrees(rotation),
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
    a.download = `${base}-watermarked.pdf`;
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Any PDF · Watermark added in your browser</p>
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
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Watermark text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  placeholder="CONFIDENTIAL"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {TEXT_PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setWatermarkText(p)}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Opacity</label>
                    <span className="text-xs font-bold text-violet-700">{opacity}%</span>
                  </div>
                  <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Font size</label>
                    <span className="text-xs font-bold text-violet-700">{fontSize}pt</span>
                  </div>
                  <input type="range" min={24} max={200} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Rotation</label>
                    <span className="text-xs font-bold text-violet-700">{rotation}°</span>
                  </div>
                  <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Color</label>
                <div className="flex gap-2 items-center">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      onClick={() => setColor(p.hex)}
                      className={`h-9 w-9 rounded-lg border-2 transition-all ${color === p.hex ? "border-violet-500 scale-110" : "border-gray-200"}`}
                      style={{ backgroundColor: p.hex }}
                      title={p.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 w-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 font-mono">{color}</span>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 flex items-center justify-center min-h-[100px]">
                <span
                  style={{
                    color,
                    opacity: opacity / 100,
                    fontSize: `${Math.min(fontSize / 2, 56)}px`,
                    transform: `rotate(${rotation}deg)`,
                    fontWeight: 700,
                    fontFamily: "Helvetica, Arial, sans-serif",
                    display: "inline-block",
                    lineHeight: 1,
                  }}
                >
                  {watermarkText || "Preview"}
                </span>
              </div>

              <button onClick={apply} disabled={processing} className="btn-primary w-full py-3">
                {processing ? "Adding watermark..." : `Apply watermark to ${pageCount} page${pageCount !== 1 ? "s" : ""}`}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">Watermark applied successfully</span>
                </div>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Watermarked PDF
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
        currentTool="pdf-watermark"
        getCurrentResult={async () => {
          if (!resultUrl || !sourceFile) return null;
          const res = await fetch(resultUrl);
          const blob = await res.blob();
          const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
          return { blob, fileName: `${base}-watermarked.pdf` };
        }}
      />
    </ToolPageLayout>
  );
}
