"use client";

import { getToolBySlug } from "@/config/tools";

type Props = {
  sourceToolSlug: string;
  chars?: number;
  onStartFresh?: () => void;
};

export default function StringInboxBanner({ sourceToolSlug, chars, onStartFresh }: Props) {
  const source = getToolBySlug(sourceToolSlug);
  return (
    <div
      className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 flex items-center gap-3 shadow-sm"
      role="status"
    >
      <div
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-sm"
        style={{ background: "linear-gradient(135deg, #1D4ED8, #6D28D9, #DB2777)" }}
        aria-hidden
      >
        ↪
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-violet-600 uppercase tracking-wide">Continuing your workflow</p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          From {source ? source.name : sourceToolSlug}
          {typeof chars === "number" && chars > 0 ? ` · ${chars.toLocaleString()} characters` : ""}
        </p>
      </div>
      {onStartFresh && (
        <button
          onClick={onStartFresh}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
        >
          Start fresh
        </button>
      )}
    </div>
  );
}
