"use client";

import { useState, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("hash-generator")!;

const ALGOS = [
  { name: "SHA-1", api: "SHA-1", note: "Legacy — fine for non-security checksums, not for crypto." },
  { name: "SHA-256", api: "SHA-256", note: "Modern default — TLS, Bitcoin, JWT signing." },
  { name: "SHA-384", api: "SHA-384", note: "Truncated SHA-512, used in some TLS cipher suites." },
  { name: "SHA-512", api: "SHA-512", note: "Strongest in the SHA-2 family." },
] as const;

async function hashString(text: string, algo: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorPage() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!text) {
      setHashes({});
      return;
    }
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const a of ALGOS) {
        next[a.api] = await hashString(text, a.api);
      }
      if (!cancelled) setHashes(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  const copy = async (algo: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(algo);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Input text</label>
            <button onClick={() => setText("")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste anything — a password, an API key, a file's contents..."
            className="w-full h-40 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
            autoFocus
          />
        </div>

        <div className="space-y-3">
          {ALGOS.map((a) => (
            <div key={a.api} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.note}</p>
                </div>
                <button
                  onClick={() => copy(a.api, hashes[a.api] || "")}
                  disabled={!hashes[a.api]}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  {copied === a.api ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-800 break-all min-h-[2.5rem]">
                {hashes[a.api] || <span className="text-gray-300 font-sans">Hash will appear here</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
}
