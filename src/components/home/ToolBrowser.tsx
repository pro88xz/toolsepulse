"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";
import type { ToolCategory } from "@/config/tools";
import { categoryOrder, categoryStyles } from "@/config/categories";
import { getNamedIcon } from "@/lib/tool-icons";

type Filter = ToolCategory | "all";

interface Props {
  total: number;
  counts: Record<ToolCategory, number>;
  /** Headline, lede and trust chips — rendered on the server, passed through. */
  hero: ReactNode;
  /** Hero illustration, also server-rendered. */
  heroArt: ReactNode;
  /** The 82 ToolCard elements, server-rendered. */
  children: ReactNode;
}

/**
 * Owns the only interactive state on the homepage: the search box and the
 * category rail. The cards themselves arrive as server-rendered `children`,
 * so filtering toggles `hidden` on existing DOM rather than re-rendering
 * 82 components on the client.
 */
export default function ToolBrowser({ total, counts, hero, heroArt, children }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(total);
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const q = query.trim().toLowerCase();
    let shown = 0;

    root.querySelectorAll<HTMLElement>(".tp-card").forEach((el) => {
      const matchesCategory = filter === "all" || el.dataset.cat === filter;
      const matchesQuery = !q || (el.dataset.s ?? "").includes(q);
      const ok = matchesCategory && matchesQuery;
      el.hidden = !ok;
      if (ok) shown += 1;
    });

    setVisible(shown);
  }, [query, filter]);

  // Typing while a category is selected would otherwise strand the user on an
  // empty grid, so a search always widens back out to every tool.
  function onQueryChange(value: string) {
    setQuery(value);
    if (value.trim() && filter !== "all") setFilter("all");
  }

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  const AllIcon = getNamedIcon("GridFour");

  return (
    <>
      <section className="tp-hero">
        <div>
          {hero}
          <div className="tp-search">
            <label className="tp-vh" htmlFor={searchId}>
              Search tools
            </label>
            <MagnifyingGlass size={19} weight="bold" />
            <input
              id={searchId}
              ref={inputRef}
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={`Search ${total} tools`}
            />
            {query && (
              <button type="button" className="tp-clear" onClick={clear} aria-label="Clear search">
                <X size={17} weight="bold" />
              </button>
            )}
          </div>
        </div>
        <div className="tp-hero-art">{heroArt}</div>
      </section>

      <div className="tp-body">
        <aside className="tp-rail" aria-label="Filter tools by category">
          <div className="tp-rail-h">Browse</div>
          <button
            type="button"
            className={`tp-rl${filter === "all" ? " is-on" : ""}`}
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            <i className="tp-rl-i tp-rl-all">
              <AllIcon size={17} weight="bold" />
            </i>
            <span>All tools</span>
            <b>{total}</b>
          </button>

          {categoryOrder.map((key) => {
            const style = categoryStyles[key];
            const Icon = getNamedIcon(style.icon);
            return (
              <button
                key={key}
                type="button"
                className={`tp-rl${filter === key ? " is-on" : ""}`}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                style={{ "--g1": style.from, "--g2": style.to } as CSSProperties}
              >
                <i className="tp-rl-i">
                  <Icon size={17} weight="bold" />
                </i>
                <span>{style.label}</span>
                <b>{counts[key]}</b>
              </button>
            );
          })}
        </aside>

        <div>
          <div className="tp-grid" id="all-tools" ref={gridRef}>
            {children}
          </div>
          {visible === 0 && (
            <p className="tp-empty">
              Nothing matches that. Try a format instead — “png”, “mp3”, “pdf”.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
