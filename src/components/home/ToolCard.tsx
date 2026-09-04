import Link from "next/link";
import type { CSSProperties } from "react";
import type { Tool } from "@/config/tools";
import { categoryStyles } from "@/config/categories";
import { getToolIcon } from "@/lib/tool-icons";

/**
 * Server component. The `data-cat` / `data-s` attributes are what `ToolBrowser`
 * filters on, which lets all 82 cards render on the server (and stay in the
 * HTML for crawlers) while only the filter shell ships as client JS.
 */
export default function ToolCard({ tool }: { tool: Tool }) {
  const style = categoryStyles[tool.category];
  const Icon = getToolIcon(tool.slug, tool.icon);
  const haystack = [tool.name, tool.shortDescription, ...tool.keywords]
    .join(" ")
    .toLowerCase();

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tp-card"
      data-cat={tool.category}
      data-s={haystack}
      style={{ "--g1": style.from, "--g2": style.to } as CSSProperties}
    >
      <span className="tp-tile">
        <i className="tp-tile-b" aria-hidden="true" />
        <i className="tp-tile-f">
          <Icon size={25} weight="bold" />
        </i>
      </span>
      <h3 className="tp-card-h">{tool.name}</h3>
      <p className="tp-card-p">{tool.shortDescription}</p>
    </Link>
  );
}
