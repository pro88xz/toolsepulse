// GamePix JSON feed integration.
// Feed docs: https://feeds.gamepix.com  — sid keeps revenue/stats attributed.

export const GAMEPIX_SID = "7R771";

export interface GamePixGame {
  id: string;
  title: string;
  namespace: string;
  description: string;
  category: string;
  orientation: string;
  quality_score: number;
  width: number;
  height: number;
  date_modified: string;
  date_published: string;
  banner_image: string;
  image: string;
  url: string;
}

interface GamePixFeed {
  title: string;
  home_page_url: string;
  feed_url: string;
  next_url: string | null;
  previous_url: string | null;
  first_page_url: string;
  last_page_url: string;
  modified: string;
  items: GamePixGame[];
}

const BASE = "https://feeds.gamepix.com/v2/json";

function feedUrl(opts: { page?: number; pagination?: number; category?: string; order?: string }): string {
  const params = new URLSearchParams({
    sid: GAMEPIX_SID,
    pagination: String(opts.pagination ?? 24),
    page: String(opts.page ?? 1),
    order: opts.order ?? "quality",
  });
  if (opts.category && opts.category !== "all") params.set("category", opts.category);
  return BASE + "?" + params.toString();
}

export async function getGames(opts: { page?: number; pagination?: number; category?: string } = {}): Promise<{
  games: GamePixGame[];
  hasNext: boolean;
  page: number;
}> {
  const page = opts.page ?? 1;
  try {
    const res = await fetch(feedUrl({ ...opts, page }), { next: { revalidate: 3600 } });
    if (!res.ok) return { games: [], hasNext: false, page };
    const data: GamePixFeed = await res.json();
    return { games: data.items ?? [], hasNext: Boolean(data.next_url), page };
  } catch {
    return { games: [], hasNext: false, page };
  }
}

export async function getGameByNamespace(namespace: string): Promise<GamePixGame | null> {
  for (let page = 1; page <= 6; page++) {
    const { games, hasNext } = await getGames({ page, pagination: 48 });
    const found = games.find((g) => g.namespace === namespace);
    if (found) return found;
    if (!hasNext) break;
  }
  return null;
}

export async function getRelatedGames(category: string, excludeNamespace: string): Promise<GamePixGame[]> {
  const { games } = await getGames({ category, pagination: 12 });
  return games.filter((g) => g.namespace !== excludeNamespace).slice(0, 6);
}
