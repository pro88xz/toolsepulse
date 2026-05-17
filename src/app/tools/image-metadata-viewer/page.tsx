"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("image-metadata-viewer")!;

type MetaSection = {
  title: string;
  items: { label: string; value: string; sensitive?: boolean }[];
};

// Parses EXIF + basic file info from any uploaded image
async function readMetadata(file: File, imgDims: { width: number; height: number }): Promise<MetaSection[]> {
  const buf = await file.arrayBuffer();
  const view = new DataView(buf);
  const sections: MetaSection[] = [];

  // File section
  sections.push({
    title: "File",
    items: [
      { label: "Filename", value: file.name },
      { label: "Format", value: file.type || "Unknown" },
      { label: "Size", value: `${(file.size / 1024).toFixed(1)} KB (${file.size.toLocaleString()} bytes)` },
      { label: "Dimensions", value: `${imgDims.width} × ${imgDims.height}` },
      { label: "Aspect ratio", value: simplifyRatio(imgDims.width, imgDims.height) },
      { label: "Last modified", value: new Date(file.lastModified).toLocaleString() },
    ],
  });

  // Non-JPEG: stop here
  if (view.getUint16(0) !== 0xFFD8) {
    sections.push({
      title: "EXIF Data",
      items: [{ label: "Status", value: "Not a JPEG — EXIF only embedded in JPEG/TIFF" }],
    });
    return sections;
  }

  // Find APP1 (EXIF) segment
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

  if (exifStart === -1 || view.getUint32(exifStart) !== 0x45786966) {
    sections.push({
      title: "EXIF Data",
      items: [{ label: "Status", value: "No EXIF data found ✓ (may have been stripped)" }],
    });
    return sections;
  }

  const tiffStart = exifStart + 6;
  const little = view.getUint16(tiffStart) === 0x4949;
  const getU16 = (off: number) => view.getUint16(off, little);
  const getU32 = (off: number) => view.getUint32(off, little);

  const exifItems: { label: string; value: string; sensitive?: boolean }[] = [];
  const gpsItems: { label: string; value: string; sensitive?: boolean }[] = [];

  const exifTagMap: Record<number, string> = {
    0x010F: "Camera Make",
    0x0110: "Camera Model",
    0x0112: "Orientation",
    0x011A: "X Resolution",
    0x011B: "Y Resolution",
    0x0128: "Resolution Unit",
    0x0131: "Software",
    0x0132: "Date/Time",
    0x013B: "Artist",
    0x8298: "Copyright",
  };

  const parseIFD = (ifdOffset: number, isGps: boolean) => {
    const entries = getU16(ifdOffset);
    let gpsIFDOffset = -1;
    let exifIFDOffset = -1;

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      const tag = getU16(entryOffset);
      const type = getU16(entryOffset + 2);
      const count = getU32(entryOffset + 4);

      if (tag === 0x8825) { // GPS IFD pointer
        gpsIFDOffset = tiffStart + getU32(entryOffset + 8);
        continue;
      }
      if (tag === 0x8769) { // Exif IFD pointer
        exifIFDOffset = tiffStart + getU32(entryOffset + 8);
        continue;
      }

      if (isGps) {
        parseGpsTag(tag, type, count, entryOffset);
      } else {
        parseExifTag(tag, type, count, entryOffset);
      }
    }
    return { gpsIFDOffset, exifIFDOffset };
  };

  const parseExifTag = (tag: number, type: number, count: number, entryOffset: number) => {
    const name = exifTagMap[tag];
    if (!name) return;
    if (type === 2) {
      const valOffset = count > 4 ? tiffStart + getU32(entryOffset + 8) : entryOffset + 8;
      const bytes = new Uint8Array(buf, valOffset, count - 1);
      const str = new TextDecoder().decode(bytes).trim();
      if (str) exifItems.push({ label: name, value: str, sensitive: name === "Date/Time" || name === "Artist" });
    } else if (type === 3 && tag === 0x0112) {
      const v = getU16(entryOffset + 8);
      const labels: Record<number, string> = { 1: "Normal", 3: "Upside down (180°)", 6: "Rotated 90° CW", 8: "Rotated 90° CCW" };
      exifItems.push({ label: "Orientation", value: labels[v] || `Code ${v}` });
    } else if (type === 5) {
      const valOffset = tiffStart + getU32(entryOffset + 8);
      const num = getU32(valOffset);
      const den = getU32(valOffset + 4);
      exifItems.push({ label: name, value: `${(num / den).toFixed(2)}` });
    } else if (type === 3) {
      const v = getU16(entryOffset + 8);
      exifItems.push({ label: name, value: String(v) });
    }
  };

  // GPS coordinates are stored as ratio triplets (degrees, minutes, seconds)
  const readGpsCoord = (entryOffset: number, type: number): number | null => {
    if (type !== 5) return null;
    const valOffset = tiffStart + getU32(entryOffset + 8);
    const d = getU32(valOffset) / getU32(valOffset + 4);
    const m = getU32(valOffset + 8) / getU32(valOffset + 12);
    const s = getU32(valOffset + 16) / getU32(valOffset + 20);
    return d + m / 60 + s / 3600;
  };

  let gpsLat: number | null = null;
  let gpsLon: number | null = null;
  let gpsLatRef = "N";
  let gpsLonRef = "E";

  const parseGpsTag = (tag: number, type: number, count: number, entryOffset: number) => {
    if (tag === 0x0001) gpsLatRef = String.fromCharCode(view.getUint8(entryOffset + 8));
    else if (tag === 0x0002) gpsLat = readGpsCoord(entryOffset, type);
    else if (tag === 0x0003) gpsLonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
    else if (tag === 0x0004) gpsLon = readGpsCoord(entryOffset, type);
    else if (tag === 0x0006 && type === 5) {
      const valOffset = tiffStart + getU32(entryOffset + 8);
      const num = getU32(valOffset);
      const den = getU32(valOffset + 4);
      gpsItems.push({ label: "Altitude", value: `${(num / den).toFixed(1)} m` });
    }
  };

  const firstIFD = tiffStart + getU32(tiffStart + 4);
  const { gpsIFDOffset, exifIFDOffset } = parseIFD(firstIFD, false);
  if (exifIFDOffset > 0) parseIFD(exifIFDOffset, false);
  if (gpsIFDOffset > 0) parseIFD(gpsIFDOffset, true);

  if (gpsLat !== null && gpsLon !== null) {
    const latSigned = gpsLatRef === "S" ? -gpsLat : gpsLat;
    const lonSigned = gpsLonRef === "W" ? -gpsLon : gpsLon;
    gpsItems.unshift({
      label: "Coordinates",
      value: `${latSigned.toFixed(6)}, ${lonSigned.toFixed(6)}`,
      sensitive: true,
    });
    gpsItems.push({
      label: "Open in Maps",
      value: `https://www.google.com/maps?q=${latSigned},${lonSigned}`,
      sensitive: true,
    });
  }

  if (exifItems.length > 0) {
    sections.push({ title: "EXIF Data", items: exifItems });
  }
  if (gpsItems.length > 0) {
    sections.push({ title: "⚠ GPS Location Data", items: gpsItems });
  }
  if (exifItems.length === 0 && gpsItems.length === 0) {
    sections.push({
      title: "EXIF Data",
      items: [{ label: "Status", value: "EXIF segment found but empty — likely stripped ✓" }],
    });
  }

  return sections;
}

function simplifyRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

export default function ImageMetadataViewerPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sections, setSections] = useState<MetaSection[]>([]);
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

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("image load failed"));
      });
      const meta = await readMetadata(file, { width: img.naturalWidth, height: img.naturalHeight });
      setSections(meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessing(false);
    }
  }, [previewUrl]);

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

  const reset = () => {
    setSourceFile(null);
    setSections([]);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
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
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop image here or click to inspect</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP · Reads everything embedded in your browser</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                {previewUrl && (
                  <div className="rounded-xl bg-gray-50 p-2 mb-3">
                    <img src={previewUrl} alt="Inspected" className="w-full rounded-lg" />
                  </div>
                )}
                <p className="text-xs font-medium text-gray-500 truncate">{sourceFile.name}</p>
                <button onClick={reset} className="mt-3 text-xs text-gray-400 hover:text-gray-600">Inspect another image</button>
              </div>

              <div className="md:col-span-2 space-y-3">
                {processing ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Reading metadata...</div>
                ) : (
                  sections.map((section, i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${section.title.startsWith("⚠") ? "border-rose-200 bg-rose-50" : "border-gray-200 bg-white"} shadow-sm`}>
                      <h3 className={`text-sm font-semibold mb-3 ${section.title.startsWith("⚠") ? "text-rose-700" : "text-gray-900"}`}>{section.title}</h3>
                      <dl className="space-y-1.5">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-3 text-sm">
                            <dt className="font-medium text-gray-600 w-32 sm:w-40 flex-shrink-0">{item.label}</dt>
                            <dd className={item.sensitive ? "text-rose-700 font-medium break-all" : "text-gray-800 break-all"}>
                              {item.value.startsWith("http") ? (
                                <a href={item.value} target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-900">{item.value}</a>
                              ) : (
                                item.value
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))
                )}
              </div>
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
