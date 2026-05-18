"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getNextSteps, recordVisit, type Recommendation } from "@/lib/recommendations";
import { placeInInbox } from "@/lib/toolInbox";

type Props = {
  currentTool: string;
  getCurrentResult?: () => Promise<{ blob: Blob; fileName: string } | null>;
};

export default function WhatsNext({ currentTool, getCurrentResult }: Props) {
  const router = useRouter();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [mounted, setMounted] = useState(false);
  const [handingOff, setHandingOff] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setRecs(getNextSteps(currentTool, 2));
    recordVisit(currentTool);
  }, [currentTool]);

  if (!mounted || recs.length === 0) return null;

  const handleClick = async (e: React.MouseEvent, targetSlug: string) => {
    if (!getCurrentResult) return;
    e.preventDefault();
    setHandingOff(targetSlug);
    try {
      const result = await getCurrentResult();
      if (result) {
        await placeInInbox(result.blob, result.fileName, currentTool);
      }
    } catch {
      // Inbox failure is non-fatal — just navigate without hand-off
    }
    router.push(`/tools/${targetSlug}?from=${encodeURIComponent(currentTool)}`);
  };

  const canHandOff = Boolean(getCurrentResult);

  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="inline-flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, #1D4ED8, #6D28D9, #DB2777)" }}
          >
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900">
            Continue your workflow
          </h2>
          {canHandOff && (
            <span
              className="text-[9px] uppercase tracking-[0.18em] font-semibold ml-1 px-1.5 py-0.5 rounded"
              style={{
                background: "linear-gradient(90deg, rgba(29,78,216,0.12), rgba(109,40,217,0.12), rgba(219,39,119,0.12))",
                color: "#6D28D9",
              }}
            >
              File ready to pass
            </span>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {recs.map((rec) => {
            const isHandingOff = handingOff === rec.tool.slug;
            return (
              <a
                key={rec.tool.slug}
                href={`/tools/${rec.tool.slug}${canHandOff ? `?from=${encodeURIComponent(currentTool)}` : ""}`}
                onClick={(e) => handleClick(e, rec.tool.slug)}
                className="group relative flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-violet-200 hover:shadow-[0_10px_25px_-12px_rgba(109,40,217,0.25)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
                >
                  {isHandingOff ? (
                    <svg className="h-4 w-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-violet-600 mb-0.5">{rec.reason}</div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-[#6D28D9] transition-colors truncate">
                    {rec.tool.name}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {isHandingOff ? "Passing your file…" : rec.tool.shortDescription}
                  </p>
                </div>
                <svg
                  className="h-4 w-4 text-slate-300 group-hover:text-[#6D28D9] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
