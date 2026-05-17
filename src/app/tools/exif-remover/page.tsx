"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("exif-remover")!;

type ExifField = { label: string; value: string; sensitive?: boolean };

// Tiny inline EXIF reader — reads the most useful tags without external deps.
// We parse the JPEG APP1 segment containing EXIF.
async function readExif(file: File): Promise<ExifField[]> {
  const buf = await file.arrayBuffer();
  const view = new DataView(buf);
  const result: ExifField[] = [];

  // Non-JPEG: just show file info
  if (view.getUint16(0) !== 0xFFD8) {
    result.push({ label: "Format", value: file.type || "Unknown (non-JPEG)" });
    result.push({ label: "Size", value: `${(file.size / 1024).toFixed(1)} KB` });
    return result;
  }

  // Find the APP1 (EXIF) segment
  let offset = 2;
  let exifStart = -1;
  while (offset < view.byteLength) {
    if (view.getUint16(offset) === 0xFFE1) {
      exifStart = offset + 4;
      break;
    }
    if (view.getUint8(offset) !== 0xFF) break;
    offset += 2 + view.getUint16(offset + 2);
  }

  if (exifStart === -1) {
    result.push({ label: "EXIF data", value: "None found ✓" });
    result.push({ label: "Size", value: `${(file.size / 1024).toFixed(1)} KB` });
    return result;
  }

  // Skip "Exif\0\0" marker
  if (view.getUint32(exifStart) !== 0x45786966) {
    result.push({ label: "EXIF data", value: "None found ✓" });
    return result;
  }
  const tiffStart = exifStart + 6;

  // Endian check
  const little = view.getUint16(tiffStart) === 0x4949;
  const getU16 = (off: number) => view.getUint16(off, little);
  const getU32 = (off: number) => view.getUint32(off, little);

  const firstIFD = tiffStart + getU32(tiffStart + 4);
  const entries = getU16(firstIFD);

  const tagMap: Record<number, { name: string; sensitive?: boolean }> = {
    0x010F: { name: "Camera Make" },
    0x0110: { name: "Camera Model" },
    0x0112: { name: "Orientation" },
    0x0131: { name: "Software" },
    0x0132: { name: "Date/Time", sensitive: true },
    0x013B: { name: "Artist", sensitive: true },
    0x8298: { name: "Copyright" },
    0x8825: { name: "GPS Data Block", sensitive: true },
  };

  for (let i = 0; i < entries; i++) {
    const entryOffset = firstIFD + 2 + i * 12;
    const tag = getU16(entryOffset);
    const info = tagMap[tag];
    if (!info) continue;

    if (tag === 0x8825) {
      result.push({ label: "GPS coordinates", value: "⚠ Present — your location is exposed", sensitive: true });
      continue;
    }

    const type = getU16(entryOffset + 2);
    const count = getU32(entryOffset + 4);

    if (type === 2) {
      // ASCII string
      const valOffset = count > 4 ? tiffStart + getU32(entryOffset + 8) : entryOffset + 8;
      const bytes = new Uint8Array(buf, valOffset, count - 1);
      const str = new TextDecoder().decode(bytes).trim();
      if (str) result.push({ label: info.name, value: str, sensitive: info.sensitive });
    } else if (type === 3 && tag === 0x0112) {
      const orientationVal = getU16(entryOffset + 8);
      const labels: Record<number, string> = { 1: "Normal", 3: "Upside down", 6: "Rotated CW", 8: "Rotated CCW" };
      result.push({ label: "Orientation", value: labels[orientationVal] || String(orientationVal) });
    }
  }

  if (result.length === 0) {
    result.push({ label: "EXIF data", value: "None found ✓" });
  }
  return result;
}

export default function ExifRemoverPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<ExifField[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WebP)");
      return;
    }
    setError("");
    setSourceFile(file);
    setProcessing(true);

    try {
      // Read EXIF
      const exif = await readExif(file);
      setExifData(exif);

      // Strip via canvas re-encode (Canvas output strips ALL metadata)
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("image load failed"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas unavailable");
      ctx.drawImage(img, 0, 0);

      const isPng = file.type === "image/png";
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, isPng ? "image/png" : "image/jpeg", 0.92));
      if (!blob) throw new Error("export failed");

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessing(false);
    }
  }, [resultUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const download = () => {
    if (!resultUrl || !sourceFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceFile.name.replace(/\.[^.]+$/, "") || "image";
    const ext = sourceFile.type === "image/png" ? "png" : "jpg";
    a.download = `${base}-clean.${ext}`;
    a.click();
  };

  const reset = () => {
    setSourceFile(null);
    setExifData([]);
    setResultUrl(null);
    setError("");
  };

  const hasSensitive = exifData.some((f) => f.sensitive);

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
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP · Strips metadata in your browser</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Inspected: {sourceFile.name}</p>
                  <p className={`mt-1 text-sm font-semibold ${hasSensitive ? "text-rose-600" : "text-emerald-600"}`}>
                    {hasSensitive ? "⚠ Sensitive metadata found in original" : "Original metadata"}
                  </p>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change image</button>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                {exifData.length > 0 ? (
                  exifData.map((field, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="font-medium text-gray-600 w-36 flex-shrink-0">{field.label}</span>
                      <span className={field.sensitive ? "text-rose-600 font-medium" : "text-gray-800"}>{field.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Reading metadata...</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <span className="text-sm font-semibold">Clean version ready</span>
              </div>
              <p className="text-xs text-emerald-600 mb-4">
                All metadata stripped via canvas re-encoding. Output is identical visually but contains zero EXIF, XMP, or hidden tags.
                {resultSize > 0 && ` Size: ${(resultSize / 1024).toFixed(1)} KB.`}
              </p>
              <button onClick={download} disabled={processing || !resultUrl} className="btn-primary w-full py-3">
                {processing ? "Processing..." : "Download Clean Image"}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
