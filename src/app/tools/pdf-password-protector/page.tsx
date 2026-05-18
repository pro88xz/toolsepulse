"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "@cantoo/pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-password-protector")!;

function passwordStrength(pw: string): { label: string; tone: string; score: number } {
  if (!pw) return { label: "", tone: "", score: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak — too short or too simple", tone: "rose", score };
  if (score === 2) return { label: "Fair — add length or symbols", tone: "amber", score };
  if (score === 3) return { label: "Good", tone: "emerald", score };
  return { label: "Strong", tone: "emerald", score };
}

export default function PdfPasswordProtectorPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSourceFile(file);
    setResultUrl(null);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: false });
      setPageCount(pdf.getPageCount());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read PDF — may already be password-protected");
      setSourceFile(null);
    }
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };

  const apply = async () => {
    if (!sourceFile) return;
    if (!password) { setError("Set a password first"); return; }
    if (password !== confirm) { setError("Passwords don\u2019t match"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }

    setProcessing(true);
    setError("");
    try {
      const buf = await sourceFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);

      await pdf.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: allowPrinting ? "highResolution" : false,
          copying: allowCopying,
          modifying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });

      const bytes = await pdf.save();

      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl || !sourceFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
    a.download = `${base}-protected.pdf`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(null);
    setResultUrl(null);
    setPassword("");
    setConfirm("");
    setPageCount(0);
    setError("");
  };

  const strength = passwordStrength(password);
  const passwordsMatch = password && confirm && password === confirm;
  const passwordsDiffer = password && confirm && password !== confirm;

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
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={handleFile} className="hidden" />
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mb-3">
              <svg className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Encryption happens in your browser · Password never leaves your device</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Source</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{sourceFile.name}</p>
                  <p className="text-xs text-gray-400">{pageCount} page{pageCount !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">Change PDF</button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono outline-none focus:border-violet-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-violet-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {password && (
                  <p className={`text-xs font-medium mt-1.5 ${strength.tone === "rose" ? "text-rose-600" : strength.tone === "amber" ? "text-amber-600" : "text-emerald-600"}`}>
                    {strength.label}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Confirm password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  className={`w-full rounded-lg border-2 px-3 py-2 text-sm font-mono outline-none ${passwordsDiffer ? "border-rose-300 bg-rose-50" : passwordsMatch ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-gray-50"} focus:border-violet-400`}
                />
                {passwordsDiffer && <p className="text-xs text-rose-600 font-medium mt-1.5">Passwords don&rsquo;t match</p>}
                {passwordsMatch && <p className="text-xs text-emerald-600 font-medium mt-1.5">Passwords match</p>}
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Permissions for recipients</p>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={allowPrinting} onChange={(e) => setAllowPrinting(e.target.checked)} className="accent-violet-600" />
                  Allow printing
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={allowCopying} onChange={(e) => setAllowCopying(e.target.checked)} className="accent-violet-600" />
                  Allow text copying
                </label>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <p className="font-semibold mb-1">⚠ Important</p>
                <p>Lost passwords cannot be recovered. Save your password in a secure place (1Password, Bitwarden, etc.) before sharing the PDF.</p>
              </div>

              <button onClick={apply} disabled={processing || !passwordsMatch} className="btn-primary w-full py-3">
                {processing ? "Encrypting..." : "Encrypt PDF"}
              </button>
            </div>

            {resultUrl && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  <span className="text-sm font-semibold">PDF encrypted successfully</span>
                </div>
                <p className="text-xs text-emerald-700 mb-3">The downloaded file will require your password to open in Adobe Reader, Preview, Chrome, or any PDF viewer.</p>
                <button onClick={download} className="btn-primary w-full py-3">
                  Download Protected PDF
                </button>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div>
        )}
      </div>
    </ToolPageLayout>
  );
}
