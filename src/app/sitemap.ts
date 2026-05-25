import { tools, categories, type ToolCategory } from "@/config/tools";
import { useCases } from "@/config/use-cases";
import { comparisons } from "@/config/comparisons";
import { intentHubs } from "@/config/intent-hubs";

/**
 * Get the last modified time of a file via git history.
 * Falls back to current time if git lookup fails (e.g. on first deploy).
 * Cached per-build, so this is fast even for hundreds of files.
 */
const lastModCache = new Map<string, Date>();
function getFileLastModified(filePath: string): Date {
  if (lastModCache.has(filePath)) return lastModCache.get(filePath)!;
  try {
    const { execSync } = require("child_process");
    const ts = execSync(`git log -1 --format=%cI -- "${filePath}" 2>/dev/null`, { encoding: "utf8" }).trim();
    const d = ts ? new Date(ts) : new Date();
    lastModCache.set(filePath, d);
    return d;
  } catch {
    const d = new Date();
    lastModCache.set(filePath, d);
    return d;
  }
}

/** Pinned site-wide release date for the SEO v2 launch. Bump when a major release ships. */
const RELEASE_DATE = new Date("2026-05-25");


import { getBlogPosts } from "@/config/blog";
import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.flatMap((tool) => [
    {
      url: `${siteConfig.url}/tools/${tool.slug}`,
      lastModified: RELEASE_DATE,
      changeFrequency: "weekly" as const,
      priority: tool.tier === 1 ? 0.9 : tool.tier === 2 ? 0.8 : 0.7,
    },
    {
      url: `${siteConfig.url}/tools/${tool.slug}/how-to`,
      lastModified: RELEASE_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/tools/${tool.slug}/faq`,
      lastModified: RELEASE_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/tools/${tool.slug}/alternatives`,
      lastModified: RELEASE_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  const categoryPages = (Object.keys(categories) as ToolCategory[]).map((key) => ({
    url: `${siteConfig.url}/category/${key}`,
    lastModified: RELEASE_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = getBlogPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticPages = ["about", "contact", "privacy", "terms", "affiliate-disclosure", "security", "blog", "how-to-use"].map((page) => ({
    url: `${siteConfig.url}/${page}`,
    lastModified: RELEASE_DATE,
    changeFrequency: "monthly" as const,
    priority: page === "blog" ? 0.7 : 0.4,
  }));

  const hubPages = intentHubs.map((h) => ({
    url: `${siteConfig.url}/hubs/${h.slug}`,
    lastModified: RELEASE_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const comparisonPages = comparisons.map((c) => ({
    url: `${siteConfig.url}/compare/${c.slug}`,
    lastModified: RELEASE_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const useCasePages = useCases.map((uc) => ({
    url: `${siteConfig.url}/use/${uc.slug}`,
    lastModified: RELEASE_DATE,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: RELEASE_DATE,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryPages,
    ...toolPages,
    ...useCasePages,
    ...comparisonPages,
    ...hubPages,
    ...blogPages,
    ...staticPages,
  ];
}
