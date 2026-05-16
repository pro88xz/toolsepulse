"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("jwt-decoder")!;

function base64UrlDecode(s: string): string {
  let str = s.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

function formatRelative(diffSec: number): string {
  const abs = Math.abs(diffSec);
  let unit = "s", val = abs;
  if (abs >= 86400) { unit = "d"; val = Math.floor(abs / 86400); }
  else if (abs >= 3600) { unit = "h"; val = Math.floor(abs / 3600); }
  else if (abs >= 60) { unit = "m"; val = Math.floor(abs / 60); }
  return diffSec > 0 ? `in ${val}${unit}` : `${val}${unit} ago`;
}

function formatTimestamp(ts: number): string {
  if (!ts || typeof ts !== "number") return "";
  const d = new Date(ts * 1000);
  const diffSec = Math.floor((d.getTime() - Date.now()) / 1000);
  return `${d.toLocaleString()} (${formatRelative(diffSec)})`;
}

const TIMESTAMP_CLAIMS = new Set(["exp", "iat", "nbf", "auth_time"]);

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState("");

  const decoded = useMemo(() => {
    const cleaned = token.replace(/^Bearer\s+/i, "").trim();
    if (!cleaned) return null;
    const parts = cleaned.split(".");
    if (parts.length !== 3) {
      return { error: `Expected 3 parts (header.payload.signature), got ${parts.length}` };
    }
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const expired = typeof payload.exp === "number" && payload.exp < now;
      return { header, payload, signature: parts[2], expired };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid JWT format" };
    }
  }, [token]);

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Paste your JWT</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            className="w-full h-32 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-xs font-mono text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none break-all"
            autoFocus
          />
        </div>

        {decoded?.error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{decoded.error}</div>
        )}

        {decoded && !decoded.error && (
          <>
            {decoded.expired && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                ⚠ This token is <strong>expired</strong>.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Header</p>
                  <button onClick={() => copy("header", JSON.stringify(decoded.header, null, 2))} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    {copied === "header" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-800 overflow-x-auto whitespace-pre">{JSON.stringify(decoded.header, null, 2)}</pre>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Payload</p>
                  <button onClick={() => copy("payload", JSON.stringify(decoded.payload, null, 2))} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    {copied === "payload" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-800 overflow-x-auto whitespace-pre">{JSON.stringify(decoded.payload, null, 2)}</pre>
              </div>
            </div>

            {decoded.payload && Object.keys(decoded.payload).some((k) => TIMESTAMP_CLAIMS.has(k)) && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Decoded timestamps</p>
                <div className="space-y-2 text-sm">
                  {Object.entries(decoded.payload)
                    .filter(([k, v]) => TIMESTAMP_CLAIMS.has(k) && typeof v === "number")
                    .map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="font-mono text-xs text-gray-500">{k}</span>
                        <span className="text-gray-800 text-right">{formatTimestamp(v as number)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Signature (raw)</p>
                <button onClick={() => copy("sig", decoded.signature || "")} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  {copied === "sig" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-800 break-all">{decoded.signature}</p>
              <p className="mt-3 text-xs text-gray-500">Signature verification requires the signing key. Always verify server-side with the real key.</p>
            </div>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
