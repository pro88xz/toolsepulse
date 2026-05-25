import { Metadata } from "next";
import { getToolBySlug, categories } from "@/config/tools";
import { siteConfig } from "@/config/site";

/**
 * Build the SEO title for a tool page.
 * Format: "{Tool Name} — Free, No Signup, Private | ToolsePulse"
 * Keeps under Google's ~60 char display limit for most tools.
 */
/**
 * Per-tool SEO overrides based on real Search Console data.
 * Each entry leads with the exact long-tail query users type, then differentiators.
 * Last updated: 2026-05-25 (Phase 2A — CTR optimization)
 */
const seoOverrides: Record<string, { title: string; description: string }> = {
  "mp3-converter": {
    title: "MP3 Converter Online Free — No Signup, No Watermark | ToolsePulse",
    description: "Convert any audio to MP3 online — WAV, OGG, FLAC, AAC, M4A. Free, no signup, no watermark, no file uploads. Adjust bitrate. Works on phone and desktop.",
  },
  "invoice-generator": {
    title: "Free Invoice Generator Online — No Signup, Download PDF Instantly | ToolsePulse",
    description: "Create professional invoices in 30 seconds. Add logo, tax, payment terms. Download as PDF instantly. Free for freelancers — no signup, no watermark, no limits.",
  },
  "paragraph-generator": {
    title: "Paragraph Generator Free — AI Writes Paragraphs on Any Topic | ToolsePulse",
    description: "Generate paragraphs on any topic instantly. Pick informative, descriptive, narrative, or argumentative style. Free AI paragraph writer — no signup, unlimited generations.",
  },
  "ai-text-rewriter": {
    title: "AI Text Rewriter Free — Paraphrase & Rephrase Without Signup | ToolsePulse",
    description: "Rewrite, paraphrase, and rephrase any text using AI. Change tone, simplify, or sound professional. Free AI rewriter — no signup, unlimited use, results in seconds.",
  },
  "wav-converter": {
    title: "WAV Converter Online Free — Convert to WAV, MP3 to WAV, No Signup | ToolsePulse",
    description: "Convert audio files to WAV format online. Supports MP3, OGG, FLAC, AAC, M4A input. Free WAV converter — no signup, no quality loss, no file uploads.",
  },
};

function buildTitle(toolName: string, slug: string): string {
  if (seoOverrides[slug]) return seoOverrides[slug].title;
  const base = `${toolName} — Free, No Signup, Private`;
  return `${base} | ${siteConfig.name}`;
}

/**
 * Build a description that front-loads value props and primary long-tail intent.
 * Pulls the first keyword from the tool config as natural intent signal.
 */
function buildDescription(toolName: string, shortDesc: string, keywords: string[], slug: string): string {
  if (seoOverrides[slug]) return seoOverrides[slug].description;
  const intent = keywords[0] || `use ${toolName.toLowerCase()} online`;
  return `${shortDesc}. Free online ${toolName.toLowerCase()} — no signup, no watermark, no file uploads. Everything runs privately in your browser. Perfect for ${intent}.`;
}

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = buildTitle(tool.name, tool.slug);
  const description = buildDescription(tool.name, tool.shortDescription, tool.keywords, tool.slug);
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
