"use client";

import { useState } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("uuid-generator")!;

type Format = "standard" | "no-hyphens" | "uppercase" | "braces";

function generateOne(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function format(uuid: string, fmt: Format): string {
  let result = uuid;
  if (fmt === "no-hyphens") result = uuid.replace(/-/g, "");
  if (fmt === "uppercase") result = uuid.toUpperCase();
  if (fmt === "braces") result = `{${uuid}}`;
  return result;
}

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(1);
  const [fmt, setFmt] = useState<Format>("standard");
  const [uuids, setUuids] = useState<string[]>([generateOne()]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regenerate = () => {
    const n = Math.max(1, Math.min(1000, count));
    const arr: string[] = [];
    for (let i = 0; i < n; i++) arr.push(generateOne());
    setUuids(arr);
  };

  const copyOne = async (i: number) => {
    await navigator.clipboard.writeText(format(uuids[i], fmt));
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.map((u) => format(u, fmt)).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">How many</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Format</label>
              <select
                value={fmt}
                onChange={(e) => setFmt(e.target.value as Format)}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="standard">Standard (lowercase, hyphenated)</option>
                <option value="uppercase">Uppercase</option>
                <option value="no-hyphens">No hyphens</option>
                <option value="braces">{"Braced { ... }"}</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={regenerate}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Generate
            </button>
            <button
              onClick={copyAll}
              disabled={uuids.length === 0}
              className="rounded-lg border border-gray-200 hover:bg-gray-50 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {copiedAll ? "Copied all!" : `Copy all (${uuids.length})`}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Generated UUIDs (v4)</p>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {uuids.map((u, i) => (
              <button
                key={i}
                onClick={() => copyOne(i)}
                className="w-full text-left rounded-lg px-3 py-2 font-mono text-xs sm:text-sm text-gray-800 hover:bg-blue-50 transition-colors flex items-center justify-between gap-3"
              >
                <span className="truncate">{format(u, fmt)}</span>
                <span className={`text-xs flex-shrink-0 ${copiedIdx === i ? "text-emerald-600" : "text-gray-300"}`}>
                  {copiedIdx === i ? "✓ Copied" : "Copy"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
