"use client";

import { useState, useRef, useCallback } from "react";
import mammoth from "mammoth";
import { getToolBySlug } from "@/config/tools";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("word-to-pdf")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function WordToPDFPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [htmlContent, setHtmlContent] = useState("");
  const [processing, setProcessing] = useState(false);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const convertFile = useCallback(async (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const isDocx = file.name.endsWith(".docx") || file.name.endsWith(".doc") || validTypes.includes(file.type);

    if (!isDocx) {
      setError("Please upload a Word document (.docx or .doc)");
      return;
    }

    setProcessing(true);
    setError("");
    setConverted(false);
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
      setConverted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to read the Word document. It may be corrupted or in an unsupported format.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (file) convertFile(file);
    },
    [convertFile]
  );

  const downloadPDF = async () => {
    if (!htmlContent) return;
    setProcessing(true);
    setError("");

    // Tailwind 4 outputs oklch() and lab() colors which html2canvas cannot parse.
    // Strip Tailwind from the capture subtree with `all: revert`, then layer back our own plain CSS.
    const captureDiv = document.createElement("div");
    captureDiv.style.cssText = "position:absolute;left:-9999px;top:0;width:794px";
    const styleBlock = '<style>'
      + '.tp-pdf-root, .tp-pdf-root * { all: revert; }'
      + '.tp-pdf-root { font-family: \'Segoe UI\', Calibri, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #111; background: #fff; padding: 40px; width: 794px; box-sizing: border-box; }'
      + '.tp-pdf-root h1 { font-size: 22pt; margin: 0 0 12pt 0; font-weight: 700; color: #111; }'
      + '.tp-pdf-root h2 { font-size: 18pt; margin: 16pt 0 8pt 0; font-weight: 700; color: #222; }'
      + '.tp-pdf-root h3 { font-size: 14pt; margin: 12pt 0 6pt 0; font-weight: 600; color: #333; }'
      + '.tp-pdf-root p { margin: 0 0 8pt 0; }'
      + '.tp-pdf-root strong, .tp-pdf-root b { font-weight: 700; }'
      + '.tp-pdf-root em, .tp-pdf-root i { font-style: italic; }'
      + '.tp-pdf-root table { border-collapse: collapse; width: 100%; margin: 10pt 0; }'
      + '.tp-pdf-root td, .tp-pdf-root th { border: 1px solid #999; padding: 4pt 6pt; text-align: left; vertical-align: top; }'
      + '.tp-pdf-root th { background: #f0f0f0; font-weight: 600; }'
      + '.tp-pdf-root ul, .tp-pdf-root ol { margin: 0 0 8pt 0; padding-left: 24pt; }'
      + '.tp-pdf-root li { margin-bottom: 2pt; }'
      + '.tp-pdf-root img { max-width: 100%; height: auto; }'
      + '.tp-pdf-root a { color: #1e40af; text-decoration: underline; }'
      + '</style>';
    captureDiv.innerHTML = styleBlock + '<div class="tp-pdf-root">' + htmlContent + '</div>';
    document.body.appendChild(captureDiv);

    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;
      const baseName = fileName.replace(/\.(docx|doc)$/i, "");
      const opt = {
        margin: 0.75,
        filename: `${baseName}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, backgroundColor: "#ffffff" },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      const captureTarget = captureDiv.querySelector(".tp-pdf-root") as HTMLElement;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (html2pdf() as any).set(opt).from(captureTarget).save();
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      document.body.removeChild(captureDiv);
      setProcessing(false);
    }
  };

  const reset = () => {
    setFileName("");
    setFileSize(0);
    setHtmlContent("");
    setConverted(false);
    setError("");
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload */}
        {!converted && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => !processing && inputRef.current?.click()}
              className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".docx,.doc"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              {processing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  <p className="text-sm text-gray-600">Converting Word to PDF...</p>
                </div>
              ) : (
                <>
                  <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">Drop a Word document here or click to upload</p>
                  <p className="text-sm text-gray-400 mt-1">Supports .docx and .doc files</p>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
        )}

        {/* Result */}
        {converted && (
          <>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Ready to Download</h2>
                    <p className="text-sm text-green-700">
                      {fileName} &middot; {formatSize(fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadPDF} className="btn-primary py-2.5 px-6">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Save as PDF
                  </button>
                  <button onClick={reset} className="btn-secondary py-2.5 px-5">
                    Convert Another
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Preview</h3>
              <div
                ref={previewRef}
                className="rounded-xl border border-gray-200 bg-white p-8 max-h-[600px] overflow-y-auto prose prose-sm max-w-none"
                style={{
                  fontFamily: "'Segoe UI', Calibri, Arial, sans-serif",
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
