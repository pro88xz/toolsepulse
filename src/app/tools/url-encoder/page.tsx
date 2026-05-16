"use client";

import { useState } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("url-encoder")!;

type Mode = "encode" | "decode";
type Scope = "component" | "full";

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [scope, setScope] = useState<Scope>("component");
  const [copied, setCopied] = useState(false);

  let error = "";
  let result = "";
  if (input) {
    try {
      if (mode === "encode") {
        result = scope === "component" ? encodeURIComponent(input) : encodeURI(input);
      } else {
        result = scope === "component" ? decodeURIComponent(input) : decodeURI(input);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid input for decoding";
    }
  }

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    if (!result) return;
    setInput(result);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setMode("encode")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "encode" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode("decode")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "decode" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
              >
                Decode
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <label>Scope:</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as Scope)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
              >
                <option value="component">Component (param value)</option>
                <option value="full">Full URL</option>
              </select>
            </div>
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            {mode === "encode" ? "Plain text" : "Encoded URL or string"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"}
            className="w-full h-32 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none"
            autoFocus
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {mode === "encode" ? "Encoded output" : "Decoded output"}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={swap}
                disabled={!result}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:text-gray-300"
              >
                Swap ↔
              </button>
              <button
                onClick={copy}
                disabled={!result}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          {error ? (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : (
            <div className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-sm text-gray-800 break-all min-h-[3rem]">
              {result || <span className="text-gray-300 font-sans">Output will appear here</span>}
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
