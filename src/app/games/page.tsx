import Link from "next/link";
import type { Metadata } from "next";
import { getGames } from "@/lib/gamepix";

export const metadata: Metadata = {
  title: "Free Online Games — Play Instantly | ToolsePulse",
  description:
    "Play hundreds of free online games instantly in your browser — no downloads, no sign-up. Puzzle, arcade, action, and more.",
  alternates: { canonical: "https://toolsepulse.co/games" },
};

export const revalidate = 3600;

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const { games, hasNext } = await getGames({ page, pagination: 24 });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Free Online Games</h1>
        <p className="mt-2 text-slate-500">
          Play instantly in your browser — no downloads, no sign-up. Pick a game and go.
        </p>
      </div>

      {games.length === 0 ? (
        <p className="text-slate-500">Games are taking a moment to load. Please refresh.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games.map((g) => (
            <Link
              key={g.id}
              href={`/games/${g.namespace}`}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt={g.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2.5">
                <h2 className="text-sm font-semibold text-slate-900 truncate">{g.title}</h2>
                <p className="text-xs text-slate-400 capitalize truncate">{g.category?.replace(/-/g, " ")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        {page > 1 ? (
          <Link
            href={`/games?page=${page - 1}`}
            className="rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        <span className="text-sm text-slate-400">Page {page}</span>
        {hasNext ? (
          <Link
            href={`/games?page=${page + 1}`}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
