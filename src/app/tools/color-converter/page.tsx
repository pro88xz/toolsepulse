"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("color-converter")!;

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };
type HSV = { h: number; s: number; v: number };

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace("#", "").trim();
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(m)) return null;
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: Math.round(h * 60), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max === min) return { h: 0, s: 0, v: Math.round(v * 100) };
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: Math.round(h * 60), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function parseInput(input: string): RGB | null {
  const v = input.trim();
  if (!v) return null;
  // HEX
  if (v.startsWith("#") || /^[0-9a-f]{3,6}$/i.test(v)) return hexToRgb(v);
  // RGB
  const rgbMatch = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
  // HSL
  const hslMatch = v.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i);
  if (hslMatch) return hslToRgb({ h: +hslMatch[1], s: +hslMatch[2], l: +hslMatch[3] });
  return null;
}

export default function ColorConverterPage() {
  const [input, setInput] = useState("#3b82f6");
  const [copied, setCopied] = useState("");

  const result = useMemo(() => {
    const rgb = parseInput(input);
    if (!rgb) return null;
    return { rgb, hex: rgbToHex(rgb), hsl: rgbToHsl(rgb), hsv: rgbToHsv(rgb) };
  }, [input]);

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const formats = result ? [
    { label: "HEX", value: result.hex },
    { label: "RGB", value: `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})` },
    { label: "HSL", value: `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)` },
    { label: "HSV", value: `hsv(${result.hsv.h}, ${result.hsv.s}%, ${result.hsv.v}%)` },
  ] : [];

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Enter any color</label>
          <div className="flex gap-3 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#3b82f6 or rgb(59, 130, 246) or hsl(217, 91%, 60%)"
              className="flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-gray-800 outline-none focus:border-blue-400 transition-colors"
              autoFocus
            />
            <input
              type="color"
              value={result?.hex || "#3b82f6"}
              onChange={(e) => setInput(e.target.value)}
              className="h-12 w-12 rounded-lg border border-gray-200 cursor-pointer"
              title="Pick a color"
            />
          </div>
          {!result && input && (
            <p className="mt-2 text-xs text-rose-600">Could not parse — try #3b82f6, rgb(59, 130, 246), or hsl(217, 91%, 60%)</p>
          )}
        </div>

        {result && (
          <>
            <div
              className="rounded-2xl shadow-sm h-32 flex items-end p-4"
              style={{ backgroundColor: result.hex }}
            >
              <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-mono text-gray-800">{result.hex}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {formats.map((f) => (
                <div key={f.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{f.label}</p>
                    <button
                      onClick={() => copy(f.label, f.value)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      {copied === f.label ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-gray-800 break-all">{f.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
