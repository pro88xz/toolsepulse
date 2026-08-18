"use client";
import Link from "next/link";

export default function GamePlayer({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative w-full bg-black" style={{ height: "100dvh" }}>
      <iframe
        src={url}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; fullscreen; gamepad; microphone; accelerometer; gyroscope; focus-without-user-activation *"
        allowFullScreen
        loading="eager"
      />

      {/* Back button, bottom-left — clear of the game's own top toolbar. */}
      <Link
        href="/games"
        className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-2 text-xs font-semibold text-white/90 active:bg-black/70"
        aria-label="Back to all games"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Games
      </Link>
    </div>
  );
}
