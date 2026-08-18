"use client";
import Link from "next/link";
import { useRef } from "react";

export default function GamePlayer({ url, title }: { url: string; title: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full bg-black"
      style={{ height: "100dvh" }}
    >
      <iframe
        src={url}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; fullscreen; gamepad; microphone; accelerometer; gyroscope; focus-without-user-activation *"
        allowFullScreen
        loading="eager"
      />

      {/* Floating back button */}
      <Link
        href="/games"
        className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-3.5 py-2 text-sm font-semibold text-white active:bg-black/70"
        aria-label="Back to all games"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Games
      </Link>

      {/* Floating fullscreen button */}
      <button
        onClick={goFullscreen}
        className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full bg-black/55 backdrop-blur p-2.5 text-white active:bg-black/70"
        aria-label="Fullscreen"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  );
}
