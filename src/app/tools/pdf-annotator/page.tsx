"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("pdf-annotator")!;

type ToolMode = "highlight" | "text" | "draw" | "select";

type HighlightAnnotation = {
  id: string;
  type: "highlight";
  page: number;
  x: number; y: number; w: number; h: number; // in PDF points
};
type TextAnnotation = {
  id: string;
  type: "text";
  page: number;
  x: number; y: number; // in PDF points
  text: string;
};
type DrawStroke = {
  id: string;
  type: "draw";
  page: number;
  points: { x: number; y: number }[]; // in PDF points
  width: number;
};
type Annotation = HighlightAnnotation | TextAnnotation | DrawStroke;

export default function PdfAnnotatorPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [inboxSource, setInboxSource] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<{ width: number; height: number; dataUrl: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [mode, setMode] = useState<ToolMode>("highlight");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [savingFinal, setSavingFinal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Drag state for highlight tool
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);

  // Draw state — accumulating points
  const [drawing, setDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSourceFile(file);
    setAnnotations([]);
    setCurrentPage(0);
    setProcessing(true);
    setProgressText("Loading PDF renderer...");

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const buf = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const images: { width: number; height: number; dataUrl: string }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgressText(`Rendering page ${i} of ${pdf.numPages}`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        images.push({
          width: page.getViewport({ scale: 1 }).width,  // PDF points
          height: page.getViewport({ scale: 1 }).height,
          dataUrl: canvas.toDataURL("image/png"),
        });
      }

      setPageImages(images);
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

  // Coordinate translation: screen -> PDF points
  // PDF origin is bottom-left, screen origin is top-left
  const screenToPdf = (e: React.MouseEvent<HTMLDivElement>): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const page = pageImages[currentPage];
    if (!page) return null;
    const scaleX = page.width / rect.width;
    const scaleY = page.height / rect.height;
    const sx = (e.clientX - rect.left) * scaleX;
    const sy = (e.clientY - rect.top) * scaleY;
    // Convert to PDF coordinates (y inverted)
    return { x: sx, y: page.height - sy };
  };

  const onCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = screenToPdf(e);
    if (!pt) return;

    if (mode === "highlight") {
      setDragStart(pt);
      setDragCurrent(pt);
    } else if (mode === "text") {
      const text = window.prompt("Enter note text:");
      if (text && text.trim()) {
        setAnnotations((p) => [...p, {
          id: `t${Date.now()}`,
          type: "text",
          page: currentPage,
          x: pt.x,
          y: pt.y,
          text: text.trim(),
        }]);
      }
    } else if (mode === "draw") {
      setDrawing(true);
      setCurrentStroke([pt]);
    }
  };

  const onCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = screenToPdf(e);
    if (!pt) return;

    if (mode === "highlight" && dragStart) {
      setDragCurrent(pt);
    } else if (mode === "draw" && drawing) {
      setCurrentStroke((p) => [...p, pt]);
    }
  };

  const onCanvasMouseUp = () => {
    if (mode === "highlight" && dragStart && dragCurrent) {
      const x = Math.min(dragStart.x, dragCurrent.x);
      const y = Math.min(dragStart.y, dragCurrent.y);
      const w = Math.abs(dragCurrent.x - dragStart.x);
      const h = Math.abs(dragCurrent.y - dragStart.y);
      if (w > 5 && h > 5) {
        setAnnotations((p) => [...p, {
          id: `h${Date.now()}`,
          type: "highlight",
          page: currentPage,
          x, y, w, h,
        }]);
      }
      setDragStart(null);
      setDragCurrent(null);
    } else if (mode === "draw" && drawing) {
      if (currentStroke.length > 1) {
        setAnnotations((p) => [...p, {
          id: `d${Date.now()}`,
          type: "draw",
          page: currentPage,
          points: currentStroke,
          width: 2,
        }]);
      }
      setDrawing(false);
      setCurrentStroke([]);
    }
  };

  const undo = () => {
    setAnnotations((p) => p.slice(0, -1));
  };

  const saveToPdf = async () => {
    if (!sourceFile) return;
    setSavingFinal(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      for (const ann of annotations) {
        const page = pages[ann.page];
        if (!page) continue;

        if (ann.type === "highlight") {
          page.drawRectangle({
            x: ann.x,
            y: ann.y,
            width: ann.w,
            height: ann.h,
            color: rgb(1, 0.92, 0.23), // yellow
            opacity: 0.4,
          });
        } else if (ann.type === "text") {
          // Sticky note look: colored rect background + text
          const padding = 4;
          const textWidth = font.widthOfTextAtSize(ann.text, 10);
          const boxW = textWidth + padding * 2;
          const boxH = 16;
          page.drawRectangle({
            x: ann.x,
            y: ann.y - boxH,
            width: boxW,
            height: boxH,
            color: rgb(1, 0.95, 0.6),
            borderColor: rgb(0.85, 0.7, 0.2),
            borderWidth: 1,
            opacity: 0.95,
          });
          page.drawText(ann.text, {
            x: ann.x + padding,
            y: ann.y - boxH + 4,
            size: 10,
            font,
            color: rgb(0.15, 0.15, 0.15),
          });
        } else if (ann.type === "draw") {
          // Draw each segment as a line
          for (let i = 1; i < ann.points.length; i++) {
            const a = ann.points[i - 1];
            const b = ann.points[i];
            page.drawLine({
              start: { x: a.x, y: a.y },
              end: { x: b.x, y: b.y },
              thickness: ann.width,
              color: rgb(0.85, 0.1, 0.1),
            });
          }
        }
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
      a.download = `${base}-annotated.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingFinal(false);
    }
  };

  const reset = () => {
    setSourceFile(null);
    setPageImages([]);
    setAnnotations([]);
    setCurrentPage(0);
    setError("");
  };

  const currentPageData = pageImages[currentPage];
  const currentAnnotations = annotations.filter((a) => a.page === currentPage);

  // Render preview overlay (annotations + active drag/draw)
  const renderOverlay = () => {
    if (!currentPageData || !canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = rect.width / currentPageData.width;
    const scaleY = rect.height / currentPageData.height;

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox={`0 0 ${currentPageData.width} ${currentPageData.height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Existing annotations for current page */}
        {currentAnnotations.map((ann) => {
          if (ann.type === "highlight") {
            return (
              <rect
                key={ann.id}
                x={ann.x}
                y={currentPageData.height - ann.y - ann.h}
                width={ann.w}
                height={ann.h}
                fill="yellow"
                fillOpacity={0.4}
              />
            );
          } else if (ann.type === "text") {
            return (
              <g key={ann.id}>
                <rect
                  x={ann.x}
                  y={currentPageData.height - ann.y}
                  width={Math.max(80, ann.text.length * 6)}
                  height={16}
                  fill="rgb(255, 242, 153)"
                  stroke="rgb(217, 178, 51)"
                  strokeWidth={1}
                />
                <text
                  x={ann.x + 4}
                  y={currentPageData.height - ann.y + 12}
                  fontSize={10}
                  fill="rgb(38, 38, 38)"
                >
                  {ann.text}
                </text>
              </g>
            );
          } else if (ann.type === "draw") {
            const path = ann.points
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${currentPageData.height - p.y}`)
              .join(" ");
            return (
              <path
                key={ann.id}
                d={path}
                stroke="rgb(217, 26, 26)"
                strokeWidth={ann.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          }
          return null;
        })}

        {/* Live drag rectangle for highlight tool */}
        {mode === "highlight" && dragStart && dragCurrent && (
          <rect
            x={Math.min(dragStart.x, dragCurrent.x)}
            y={currentPageData.height - Math.max(dragStart.y, dragCurrent.y)}
            width={Math.abs(dragCurrent.x - dragStart.x)}
            height={Math.abs(dragCurrent.y - dragStart.y)}
            fill="yellow"
            fillOpacity={0.4}
            stroke="rgb(202, 165, 0)"
            strokeWidth={1}
          />
        )}

        {/* Live drawing stroke */}
        {mode === "draw" && drawing && currentStroke.length > 1 && (
          <path
            d={currentStroke
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${currentPageData.height - p.y}`)
              .join(" ")}
            stroke="rgb(217, 26, 26)"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    );
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
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Highlight, note, and draw · Annotations baked into final PDF</p>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  <button onClick={() => setMode("highlight")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "highlight" ? "bg-yellow-100 text-yellow-800 shadow-sm" : "text-gray-600"}`}>Highlight</button>
                  <button onClick={() => setMode("text")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "text" ? "bg-violet-100 text-violet-800 shadow-sm" : "text-gray-600"}`}>Text Note</button>
                  <button onClick={() => setMode("draw")} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "draw" ? "bg-rose-100 text-rose-800 shadow-sm" : "text-gray-600"}`}>Draw</button>
                </div>
                <button onClick={undo} disabled={annotations.length === 0} className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30">Undo</button>
                <button onClick={() => setAnnotations([])} disabled={annotations.length === 0} className="text-xs font-medium text-gray-500 hover:text-rose-600 disabled:opacity-30">Clear all</button>
                <span className="text-xs text-gray-400 ml-auto">{annotations.length} annotation{annotations.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-30">← Prev</button>
                <span className="text-sm font-semibold text-gray-700">Page {currentPage + 1} of {pageImages.length}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(pageImages.length - 1, p + 1))} disabled={currentPage >= pageImages.length - 1} className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-30">Next →</button>
              </div>

              <div
                ref={canvasRef}
                onMouseDown={onCanvasMouseDown}
                onMouseMove={onCanvasMouseMove}
                onMouseUp={onCanvasMouseUp}
                onMouseLeave={onCanvasMouseUp}
                className="relative mx-auto bg-gray-50 border border-gray-300 cursor-crosshair select-none"
                style={{ maxWidth: "100%", width: currentPageData ? `${currentPageData.width * 1.2}px` : "auto" }}
              >
                {currentPageData && (
                  <>
                    <img src={currentPageData.dataUrl} alt={`Page ${currentPage + 1}`} className="block w-full pointer-events-none" />
                    {renderOverlay()}
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={saveToPdf} disabled={savingFinal || annotations.length === 0} className="btn-primary flex-1 py-3">
                {savingFinal ? "Saving..." : annotations.length === 0 ? "Add an annotation to save" : `Save annotated PDF (${annotations.length} annotation${annotations.length !== 1 ? "s" : ""})`}
              </button>
              <button onClick={reset} className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Change PDF</button>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
      <WhatsNext currentTool="pdf-annotator" />
    </ToolPageLayout>
  );
}
