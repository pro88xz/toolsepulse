"use client";

import Link from "next/link";
import { getToolBySlug } from "@/config/tools";

type Props = {
  sourceToolSlug: string;
  fileName: string;
  onStartFresh: () => void;
};

export default function InboxBanner({ sourceToolSlug, fileName, onStartFresh }: Props) {
  const sourceTool = getToolBySlug(sourceToolSlug);
  if (!sourceTool) return null;

  return (
    <div
      className="rounded-2xl border border-violet-200 p-4 sm:p-5 mb-6 shadow-sm"
      style={{
        background: "linear-gradient(90deg, rgba(29,78,216,0.06) 0%, rgba(109,40,217,0.08) 50%, rgba(219,39,119,0.06) 100%)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #6D28D9, #DB2777)" }}
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
            Continuing your workflow
          </p>
          <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">
            Loaded from{" "}
            <Link href={`/tools/${sourceTool.slug}`} className="underline decoration-violet-400 decoration-2 underline-offset-2 hover:text-violet-700">
              {sourceTool.name}
            </Link>
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{fileName}</p>
        </div>
        <button
          onClick={onStartFresh}
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0"
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}
