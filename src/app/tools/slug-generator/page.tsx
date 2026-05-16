"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("slug-generator")!;

function slugify(input: string, separator: string, lowercase: boolean): string {
  let s = input;
  // Normalize accented characters (é → e, ñ → n, etc.)
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Replace ampersands with "and"
  s = s.replace(/&/g, " and ");
  // Strip everything that isn't alphanumeric, whitespace, or hyphen
  s = s.replace(/[^a-zA-Z0-9\s-]/g, "");
  // Collapse whitespace and dashes into the chosen separator
  s = s.trim().replace(/[\s-]+/g, separator);
  if (lowercase) s = s.toLowerCase();
  return s;
}

export default function SlugGeneratorPage() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => slugify(text, separator, lowercase), [text, separator, lowercase]);

  const copy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title or heading</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. The 10 Best Strategies for SEO in 2026!"
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors"
            autoFocus
          />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Separator:</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Dot (.)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="rounded"
              />
              Lowercase
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Generated slug</p>
            <button
              onClick={copy}
              disabled={!slug}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-sm text-gray-800 break-all min-h-[2.5rem]">
            {slug || <span className="text-gray-300 font-sans">Your URL slug will appear here</span>}
          </div>
          {slug && (
            <p className="mt-3 text-xs text-gray-500">
              Preview: <span className="font-mono">yoursite.com/blog/{slug}</span>
            </p>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
