"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { tools, categories, type ToolCategory, getToolBySlug } from "@/config/tools";
import { siteConfig } from "@/config/site";
import NewsletterSignup from "@/components/NewsletterSignup";

const categoryVisuals: Record<
  ToolCategory,
  {
    cardBg: string;
    borderColor: string;
    iconBg: string;
    iconColor: string;
    tagline: string;
    icon: React.ReactNode;
  }
> = {
  pdf: {
    cardBg: "bg-gradient-to-br from-[#dc2626] to-[#9f1239] hover:from-[#b91c1c] hover:to-[#881337]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Merge, compress & convert",
    icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-5 9h8m-8 4h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />,
  },
  image: {
    cardBg: "bg-gradient-to-br from-[#059669] to-[#134e4a] hover:from-[#047857] hover:to-[#115e59]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Resize, compress & edit",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  converter: {
    cardBg: "bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] hover:from-[#1e40af] hover:to-[#172554]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Any format, instantly",
    icon: <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  audio: {
    cardBg: "bg-gradient-to-br from-[#ea580c] to-[#9a3412] hover:from-[#c2410c] hover:to-[#7c2d12]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Convert, trim & transform",
    icon: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  },
  text: {
    cardBg: "bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] hover:from-[#6d28d9] hover:to-[#4c1d95]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Extract, count & process",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  generator: {
    cardBg: "bg-gradient-to-br from-[#7e22ce] to-[#c026d3] hover:from-[#6b21a8] hover:to-[#a21caf]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "QR codes, invoices & more",
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  },
  developer: {
    cardBg: "bg-gradient-to-br from-[#334155] to-[#0f172a] hover:from-[#1e293b] hover:to-[#020617]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "JSON, colors & utilities",
    icon: <path d="M8 10l-3 2 3 2m8-4l3 2-3 2m-5-8l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  video: {
    cardBg: "bg-gradient-to-br from-[#db2777] to-[#9d174d] hover:from-[#be185d] hover:to-[#831843]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Compress, convert & edit",
    icon: <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" fill="none" />,
  },
  ai: {
    cardBg: "bg-gradient-to-br from-[#1d4ed8] to-[#db2777] hover:from-[#1e40af] hover:to-[#be185d]",
    borderColor: "border-transparent",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    tagline: "Smart, AI-powered tools",
    icon: <path d="M9.5 15L9 18.75l-.5-3.75a4.5 4.5 0 00-3-3L2.25 12l3.25-.5a4.5 4.5 0 003-3L9 5.25l.5 3.25a4.5 4.5 0 003 3l3.25.5-3.25.5a4.5 4.5 0 00-3 3zM18 8.5l-.25 1-.25-1a3 3 0 00-2-2l-1-.25 1-.25a3 3 0 002-2L18 3l.25 1a3 3 0 002 2l1 .25-1 .25a3 3 0 00-2 2z" stroke="currentColor" strokeWidth="1.2" fill="none" />,
  },
};

const searchIconStyle: Record<ToolCategory, { bg: string; text: string }> = {
  pdf: { bg: "bg-red-100", text: "text-[#dc2626]" },
  image: { bg: "bg-emerald-100", text: "text-[#059669]" },
  converter: { bg: "bg-blue-100", text: "text-[#1d4ed8]" },
  audio: { bg: "bg-orange-100", text: "text-[#ea580c]" },
  text: { bg: "bg-violet-100", text: "text-[#7c3aed]" },
  generator: { bg: "bg-fuchsia-100", text: "text-[#a21caf]" },
  developer: { bg: "bg-slate-200", text: "text-[#334155]" },
  video: { bg: "bg-pink-100", text: "text-[#db2777]" },
  ai: { bg: "bg-violet-100", text: "text-[#6D28D9]" },
};


const rotatingWords = [
  "right in your browser.",
  "without uploading files.",
  "with total privacy.",
  "free, forever.",
  "no signup needed.",
  "instantly.",
];

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % rotatingWords.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={"inline-block transition-opacity duration-300 " + (fade ? "opacity-100" : "opacity-0")}>
      {rotatingWords[index]}
    </span>
  );
}

const searchPrompts = [
  "Compress a PDF...",
  "Convert image to PNG...",
  "Remove background...",
  "Merge PDF files...",
  "Generate QR code...",
  "Convert MP4 to MP3...",
  "Resize an image...",
  "Extract text from image...",
  "Create an invoice...",
  "Format JSON...",
  "Build a resume...",
  "Generate password...",
  "Convert HEIC to JPG...",
  "Split PDF pages...",
  "Trim audio file...",
  "Create barcode...",
  "Compare two texts...",
  "Convert CSV to JSON...",
];

function AnimatedPlaceholder() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const currentPrompt = searchPrompts[index];
    let charIndex = 0;
    let timer: ReturnType<typeof setTimeout>;

    if (typing) {
      timer = setInterval(() => {
        if (charIndex <= currentPrompt.length) {
          setText(currentPrompt.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(timer);
          setTimeout(() => setTyping(false), 1500);
        }
      }, 60);
    } else {
      timer = setInterval(() => {
        if (charIndex > 0) {
          charIndex--;
          setText(currentPrompt.slice(0, charIndex));
        } else {
          clearInterval(timer);
          setIndex((i) => (i + 1) % searchPrompts.length);
          setTyping(true);
        }
      }, 30);
      charIndex = currentPrompt.length;
    }

    return () => clearInterval(timer);
  }, [index, typing]);

  return (
    <span className="text-sm text-slate-400 pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden">
      {text}<span className="animate-pulse">|</span>
    </span>
  );
}

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  return <span>{target.toLocaleString()}{suffix}</span>;
}

function LiveCounter() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const base = 1247;
    const stored = parseInt(localStorage.getItem("tp_tool_uses") || "0");
    setCount(base + stored);

    const handler = () => {
      const val = parseInt(localStorage.getItem("tp_tool_uses") || "0") + 1;
      localStorage.setItem("tp_tool_uses", String(val));
      setCount(base + val);
    };

    window.addEventListener("tp_tool_used", handler);
    return () => window.removeEventListener("tp_tool_used", handler);
  }, []);

  return (
    <>
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-white sm:text-4xl"><AnimatedNumber target={tools.length} suffix="+" /></p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Free Tools</p>
      </div>
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-emerald-400 sm:text-4xl"><AnimatedNumber target={count} /></p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Files Processed</p>
      </div>
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-white sm:text-4xl">24/7</p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Always Available</p>
      </div>
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 mb-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
        </div>
        <p className="text-3xl font-extrabold text-blue-400 sm:text-4xl"><AnimatedNumber target={100} suffix="%" /></p>
        <p className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">Private & Secure</p>
      </div>
    </>
  );
}


function RecentlyUsed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("tp_recent_tools") || "[]");
      setRecentSlugs(recent.slice(0, 6));
    } catch {}
  }, []);

  const recentTools = recentSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
  if (recentTools.length === 0) return null;

  return (
    <section className="bg-white py-4 border-b border-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Recently used</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {recentTools.map((tool) => {
            if (!tool) return null;
            const s = searchIconStyle[tool.category];
            return (
              <a key={tool.slug} href={"/tools/" + tool.slug} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 hover:shadow-sm hover:border-slate-300 transition-all whitespace-nowrap flex-shrink-0">
                <div className={"flex h-5 w-5 items-center justify-center rounded " + s.bg + " " + s.text}>
                  <svg width="11" height="11" viewBox="0 0 24 24">{categoryVisuals[tool.category]?.icon}</svg>
                </div>
                <span className="text-[11px] font-medium text-slate-700">{tool.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}



export default function HomePage() {
  const [search, setSearch] = useState("");

  const searchResults = search.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 15%, rgba(29, 78, 216, 0.18), transparent 70%), radial-gradient(50% 50% at 85% 20%, rgba(109, 40, 217, 0.18), transparent 70%), radial-gradient(70% 60% at 50% 100%, rgba(219, 39, 119, 0.14), transparent 70%)",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-8 sm:pt-12 sm:pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.08]">
              The tools you need,
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}>
                <RotatingText />
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 leading-relaxed sm:text-lg sm:mt-4 font-medium">
              {tools.length} free tools. <span className="text-slate-900 font-semibold">Zero uploads.</span> All work in your browser.
            </p>

            {/* Animated Search */}
            <div className="mx-auto mt-6 max-w-xl">
              <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white pl-5 pr-1.5 py-1.5 shadow-md focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none py-2"
                />
                {!search && <AnimatedPlaceholder />}
                {search && (
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 mr-2" aria-label="Clear search">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("all-tools");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all"
                  style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
                  aria-label="Search tools"
                >
                  Search
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stat bar — trust & scale */}
            <div className="mt-5 grid grid-cols-4 gap-2 max-w-xl mx-auto">
              {[
                { num: String(tools.length), label: "tools" },
                { num: "0", label: "uploads" },
                { num: "∞", label: "file size" },
                { num: "100%", label: "free" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #1D4ED8, #6D28D9, #DB2777)" }}>{s.num}</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Brand tagline divider */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300" />
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-slate-600">All Tools. One Pulse.</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300" />
            </div>

            {/* Category cards — the discovery layer */}
            <div className="mx-auto mt-5 max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  href: "/category/pdf",
                  label: "PDF Tools",
                  count: tools.filter((t) => t.category === "pdf").length,
                  featured: getToolBySlug("pdf-compressor")?.name ?? "PDF Compressor",
                  gradient: "linear-gradient(135deg, #1D4ED8 0%, #6D28D9 100%)",
                  iconBg: "bg-violet-100",
                  iconColor: "text-violet-700",
                  icon: (<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />),
                },
                {
                  href: "/category/image",
                  label: "Image Tools",
                  count: tools.filter((t) => t.category === "image" || t.category === "converter").length,
                  featured: getToolBySlug("background-remover")?.name ?? "Background Remover",
                  gradient: "linear-gradient(135deg, #DB2777 0%, #F97316 100%)",
                  iconBg: "bg-rose-100",
                  iconColor: "text-rose-700",
                  icon: (<path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />),
                },
                {
                  href: "/category/audio",
                  label: "Audio & Video",
                  count: tools.filter((t) => t.category === "audio" || t.category === "video").length,
                  featured: getToolBySlug("mp4-to-mp3")?.name ?? "MP4 to MP3",
                  gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-700",
                  icon: (<path strokeLinecap="round" strokeLinejoin="round" d="m15.91 11.672 a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />),
                },
                {
                  href: "/category/text",
                  label: "Text & Dev",
                  count: tools.filter((t) => t.category === "text" || t.category === "developer" || t.category === "generator" || t.category === "ai").length,
                  featured: getToolBySlug("json-formatter")?.name ?? "JSON Formatter",
                  gradient: "linear-gradient(135deg, #059669 0%, #0EA5E9 100%)",
                  iconBg: "bg-emerald-100",
                  iconColor: "text-emerald-700",
                  icon: (<path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />),
                },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative rounded-2xl bg-white border-2 border-slate-200 p-4 pt-5 text-left hover:border-transparent hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  {/* Top accent strip — gives card identity at rest */}
                  <div className="absolute top-0 inset-x-0 h-1" style={{ background: cat.gradient }} />
                  {/* Hover gradient fill */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: cat.gradient }} />
                  <div className="relative flex flex-col h-full">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${cat.iconBg} group-hover:bg-white/20 transition-colors`}>
                      <svg className={`h-6 w-6 ${cat.iconColor} group-hover:text-white transition-colors`} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                        {cat.icon}
                      </svg>
                    </div>
                    <div className="mt-3 text-base font-bold text-slate-900 group-hover:text-white transition-colors">{cat.label}</div>
                    <div className="text-xs font-semibold text-slate-500 group-hover:text-white/80 transition-colors">{cat.count} tools</div>
                    <div className="mt-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 group-hover:text-white/70 transition-colors">Featured</div>
                    <div className="text-[12px] font-semibold text-slate-700 group-hover:text-white transition-colors truncate">{cat.featured}</div>
                  </div>
                </Link>
              ))}
            </div>




          </div>
        </div>
      </section>

      {/* ===== RECENTLY USED ===== */}
      {!search.trim() && <RecentlyUsed />}

      {/* ===== SEARCH RESULTS ===== */}
      {search.trim() && (
        <section className="bg-white pb-10">
          <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
            <p className="text-sm text-slate-500 mb-4"><span className="font-semibold text-slate-800">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for "{search}"</p>
            {searchResults.length === 0 ? (
              <div className="text-center py-12"><p className="text-slate-400">No tools found. Try a different search.</p></div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((tool) => {
                  const s = searchIconStyle[tool.category];
                  const vis = categoryVisuals[tool.category];
                  return (
                    <Link key={tool.id} href={"/tools/" + tool.slug} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:shadow-md hover:border-slate-300 transition-all">
                      <div className={"flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 " + s.bg + " " + s.text}>
                        <svg width="18" height="18" viewBox="0 0 24 24">{vis.icon}</svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{tool.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{tool.shortDescription}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== CATEGORIES ===== */}
      {!search.trim() && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Everything you need, organized</h2>
              <p className="mt-2 text-sm text-slate-500">{Object.keys(categories).length} categories, {tools.length} tools, zero compromise on privacy</p>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
              {Object.entries(categories).map(([key, cat], idx, arr) => {
                const vis = categoryVisuals[key as ToolCategory];
                const catTools = tools.filter((t) => t.category === key);
                if (catTools.length === 0) return null;
                const isLast = idx === arr.length - 1;
                const spanClass = isLast ? "col-span-2 sm:col-span-1 lg:col-span-2" : "";

                return (
                  <Link
                    key={key}
                    href={"/category/" + key}
                    className={"group relative rounded-xl border p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl shadow-md overflow-hidden " + spanClass + " " + vis.cardBg + " " + vis.borderColor}
                  >
                    <div className={"flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg mb-2.5 sm:mb-3 " + vis.iconBg + " " + vis.iconColor}>
                      <svg width="18" height="18" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <h3 className="text-[13px] sm:text-sm font-bold text-white leading-tight">{cat.label}</h3>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-white/70 leading-snug">{vis.tagline}</p>
                    <div className="mt-2 sm:mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white">{catTools.length} tools</span>
                      <svg className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== POPULAR TOOLS ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-gradient-to-b from-white via-slate-50/30 to-slate-50/50 py-8 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #1D4ED8, #6D28D9, #DB2777)" }}>
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Most Popular Tools</h2>
                <p className="text-xs text-slate-500">Used most by our community</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tools.filter(t => t.isPopular).slice(0, 6).map((tool) => {
                const s = searchIconStyle[tool.category];
                const vis = categoryVisuals[tool.category];
                const stripGradient: Record<string, string> = {
                  pdf: "linear-gradient(90deg, #1D4ED8, #6D28D9)",
                  image: "linear-gradient(90deg, #DB2777, #F97316)",
                  converter: "linear-gradient(90deg, #DB2777, #F97316)",
                  audio: "linear-gradient(90deg, #F59E0B, #EF4444)",
                  video: "linear-gradient(90deg, #F59E0B, #EF4444)",
                  text: "linear-gradient(90deg, #059669, #0EA5E9)",
                  developer: "linear-gradient(90deg, #059669, #0EA5E9)",
                  generator: "linear-gradient(90deg, #059669, #0EA5E9)",
                  ai: "linear-gradient(90deg, #6D28D9, #DB2777)",
                };
                return (
                  <Link key={tool.id} href={"/tools/" + tool.slug} className="group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 pt-6 hover:shadow-[0_20px_50px_-12px_rgba(109,40,217,0.28)] hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-300 min-w-0 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1" style={{ background: stripGradient[tool.category] || "linear-gradient(90deg, #1D4ED8, #DB2777)" }} />
                    <div className={"flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 " + s.bg + " " + s.text + " group-hover:scale-110 transition-transform duration-300"}>
                      <svg width="22" height="22" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#6D28D9] transition-colors truncate">{tool.name}</h3>
                        <span className="flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white uppercase whitespace-nowrap flex-shrink-0 shadow-sm"><svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>Hot</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{tool.shortDescription}</p>
                    </div>
                    <svg className="h-4 w-4 text-slate-300 group-hover:text-[#6D28D9] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Ad - between popular and how it works */}
      {!search.trim() && (
        <section className="py-4">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      {!search.trim() && (
        <section className="py-10 sm:py-14 border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3" style={{ background: "linear-gradient(90deg, rgba(29,78,216,0.08), rgba(109,40,217,0.08), rgba(219,39,119,0.08))" }}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="url(#bg)"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1D4ED8" /><stop offset="50%" stopColor="#6D28D9" /><stop offset="100%" stopColor="#DB2777" /></linearGradient></defs><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8, #6D28D9, #DB2777)" }}>Simple as 1-2-3</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">How it works</h2>
              <p className="mt-2 text-sm text-slate-500">Three steps. No signup. No uploads. Just results.</p>
            </div>
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden sm:block absolute top-12 left-[20%] right-[20%] h-0.5" style={{ background: "linear-gradient(to right, rgba(29,78,216,0.25), rgba(109,40,217,0.25), rgba(219,39,119,0.25))" }} />
              <div className="grid gap-5 sm:gap-8 sm:grid-cols-3 relative">
                {[
                  { step: "1", title: "Pick a tool", desc: "Browse by category or search. Every tool is free with no limits.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", bg: "linear-gradient(135deg, #1D4ED8, #2563EB)" },
                  { step: "2", title: "Use it instantly", desc: "Upload your file or enter your data. Processing happens entirely in your browser.", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", bg: "linear-gradient(135deg, #6D28D9, #7C3AED)" },
                  { step: "3", title: "Download results", desc: "Get your output immediately. Nothing was uploaded. Your data stayed completely private.", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3", bg: "linear-gradient(135deg, #DB2777, #EC4899)" },
                ].map((s, i) => (
                  <div key={s.step} className="relative text-center group">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: s.bg }}>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                    </div>
                    {/* Arrow between steps */}
                    {i < 2 && (
                      <div className="hidden sm:flex absolute top-10 -right-4 z-10">
                        <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                      </div>
                    )}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold mb-3" style={{ background: s.bg }}>{s.step}</div>
                      <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== PRIVACY PROMISE ===== */}
      <section className="border-t border-slate-100 bg-slate-900 text-white py-14 sm:py-20">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 mb-5">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
              <span className="text-xs font-semibold text-slate-300">Privacy by design</span>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Your files never leave your device.</h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
              Every tool runs in your browser using JavaScript and WebAssembly. We have no servers that process your files. We store nothing. We see nothing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <LiveCounter />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z", title: "Zero server uploads", desc: "Files are processed locally using browser APIs. Check your network tab." },
              { icon: "M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88", title: "No tracking or analytics on files", desc: "We track page visits for improvement, never your files or data." },
              { icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", title: "Nothing stored, ever", desc: "When you close the tab, everything is gone. No cookies, no cache, no trace." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-slate-800 border border-slate-700 p-5">
                <svg className="h-5 w-5 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL TOOLS ===== */}
      {!search.trim() && (
        <section id="all-tools" className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">All {tools.length} tools</h2>
            <div className="grid gap-px bg-slate-200 rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3 border border-slate-200">
              {tools.sort((a, b) => a.name.localeCompare(b.name)).map((tool) => {
                const s = searchIconStyle[tool.category];
                const vis = categoryVisuals[tool.category];
                return (
                  <Link key={tool.id} href={"/tools/" + tool.slug} className="flex items-center gap-3 bg-white p-3.5 hover:bg-slate-50 transition-colors group">
                    <div className={"flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 " + s.bg + " " + s.text}>
                      <svg width="15" height="15" viewBox="0 0 24 24">{vis.icon}</svg>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 group-hover:text-[#6D28D9] transition-colors truncate flex-1">{tool.name}</h3>
                    {tool.isNew && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 uppercase">New</span>}
                    {tool.isPopular && !tool.isNew && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 uppercase">Hot</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== NEWSLETTER ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 mb-4">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              <span className="text-xs font-semibold text-slate-600">Stay Updated</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Get notified when we add new tools</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">No spam, ever. Just a quick email when we launch something useful.</p>
            <div className="mt-6">
              <NewsletterSignup variant="banner" />
            </div>
          </div>
        </section>
      )}

      {/* Ad - before FAQ */}
      
      
      {/* Ad - before FAQ */}
      {!search.trim() && (
        <section className="py-4 border-t border-slate-100">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 flex justify-center">
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {!search.trim() && (
        <section className="border-t border-slate-100 bg-slate-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">Frequently asked questions</h2>
            <div className="space-y-2">
              {[
                { q: "Is it really free?", a: "Yes. No hidden fees, no premium tier, no paywalls. Every tool is free to use without limits." },
                { q: "Are my files private?", a: "Completely. All processing happens in your browser. Your files never leave your device. We have no servers that receive, process, or store your data." },
                { q: "Do I need an account?", a: "No. Every tool works instantly without signup, login, or any personal information." },
                { q: "How is this possible for free?", a: "Modern browsers are powerful enough to handle PDF processing, image editing, audio conversion, and more. We use JavaScript, WebAssembly, and browser APIs to do everything locally." },
                { q: "Does it work on mobile?", a: "Yes. All tools are fully responsive and work across phones, tablets, and desktops in any modern browser." },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900">{faq.q}<svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg></summary>
                  <p className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}