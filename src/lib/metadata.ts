import { Metadata } from "next";
import { getToolBySlug, categories } from "@/config/tools";
import { siteConfig } from "@/config/site";

/**
 * Build the SEO title for a tool page.
 * Format: "{Tool Name} — Free, No Signup, Private | ToolsePulse"
 * Keeps under Google's ~60 char display limit for most tools.
 */
function buildTitle(toolName: string): string {
  const base = `${toolName} — Free, No Signup, Private`;
  return `${base} | ${siteConfig.name}`;
}

/**
 * Build a description that front-loads value props and primary long-tail intent.
 * Pulls the first keyword from the tool config as natural intent signal.
 */
function buildDescription(toolName: string, shortDesc: string, keywords: string[]): string {
  const intent = keywords[0] || `use ${toolName.toLowerCase()} online`;
  return `${shortDesc}. Free online ${toolName.toLowerCase()} — no signup, no watermark, no file uploads. Everything runs privately in your browser. Perfect for ${intent}.`;
}

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = buildTitle(tool.name);
  const description = buildDescription(tool.name, tool.shortDescription, tool.keywords);
  const url = `${siteConfig.url}/tools/${tool.slug}`;
  const categoryLabel = categories[tool.category].label;

  return {
    title,
    description,
    keywords: tool.keywords,
    category: categoryLabel,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${tool.name} — Free online tool from ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}
