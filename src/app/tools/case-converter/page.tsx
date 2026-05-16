"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("case-converter")!;

function toTitleCase(s: string) {
  return s.toLowerCase().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

function toSentenceCase(s: string) {
  return s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function toCamelCase(s: string) {
  const words = s.trim().toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return words.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join("");
}

function toPascalCase(s: string) {
  return s.trim().toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function toSnakeCase(s: string) {
  return s.trim().toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean).join("_");
}

function toKebabCase(s: string) {
  return s.trim().toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean).join("-");
}

function toConstantCase(s: string) {
  return s.trim().toUpperCase().split(/[^a-zA-Z0-9]+/).filter(Boolean).join("_");
}

function toAlternatingCase(s: string) {
  return s.split("").map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join("");
}

function toInverseCase(s: string) {
  return s.split("").map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("");
}

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState("");

  const variants = useMemo(() => [
    { name: "UPPERCASE", value: text.toUpperCase() },
    { name: "lowercase", value: text.toLowerCase() },
    { name: "Title Case", value: toTitleCase(text) },
    { name: "Sentence case", value: toSentenceCase(text) },
    { name: "camelCase", value: toCamelCase(text) },
    { name: "PascalCase", value: toPascalCase(text) },
    { name: "snake_case", value: toSnakeCase(text) },
    { name: "kebab-case", value: toKebabCase(text) },
    { name: "CONSTANT_CASE", value: toConstantCase(text) },
    { name: "aLtErNaTiNg", value: toAlternatingCase(text) },
    { name: "InVeRsE", value: toInverseCase(text) },
  ], [text]);

  const copy = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Enter your text</label>
            <button onClick={() => setText("")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any text to convert it into different cases..."
            className="w-full h-40 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
            autoFocus
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {variants.map((v) => (
            <div key={v.name} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{v.name}</p>
                <button
                  onClick={() => copy(v.name, v.value)}
                  disabled={!v.value}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  {copied === v.name ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-gray-800 break-words min-h-[1.5rem]">{v.value || <span className="text-gray-300">—</span>}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
}
