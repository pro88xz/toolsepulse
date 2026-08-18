import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameByNamespace, getRelatedGames } from "@/lib/gamepix";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ namespace: string }>;
}): Promise<Metadata> {
  const { namespace } = await params;
  const game = await getGameByNamespace(namespace);
  if (!game) return { title: "Game not found | ToolsePulse" };
  return {
    title: `Play ${game.title} — Free Online Game | ToolsePulse`,
    description: game.description?.slice(0, 155) || `Play ${game.title} free online.`,
    alternates: { canonical: `https://toolsepulse.co/games/${namespace}` },
  };
}

export default async function GamePlayPage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  const game = await getGameByNamespace(namespace);
  if (!game) notFound();

  const related = await getRelatedGames(game.category, namespace);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <Link href="/games" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          ← All games
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">{game.title}</h1>

      {/* The game itself — embedded on our domain so plays credit our sid. */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-lg">
        <div className="relative w-full" style={{ height: "min(78vh, 820px)" }}>
          <iframe
            src={game.url}
            title={game.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; gamepad; microphone; focus-without-user-activation *"
            allowFullScreen
            loading="eager"
          />
        </div>
      </div>

      {game.description && (
        <p className="mt-5 text-slate-600 leading-relaxed">{game.description}</p>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">More games like this</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {related.map((g) => (
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
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{g.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
