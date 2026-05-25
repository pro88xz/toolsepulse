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
  // Updated 2026-05-25 — Phase 2C, informed by Google Search Console data export.
  // Each override leads with the highest-impression query for that tool.

  "mp3-converter": {
    title: "MP3 Converter Online — Free, No Signup, Convert Any Audio to MP3 | ToolsePulse",
    description: "MP3 converter online free — convert WAV, OGG, FLAC, AAC, M4A to MP3 instantly. Free MP3 converter, no signup, no watermark, no uploads. Works on phone and desktop.",
  },
  "invoice-generator": {
    title: "Invoice Generator — Free Online Invoice Maker, Download PDF Instantly | ToolsePulse",
    description: "Free invoice generator online — create professional invoices in 30 seconds. Online invoice generator with logo, tax, payment terms. Download as PDF. No signup needed.",
  },
  "paragraph-generator": {
    title: "Paragraph Generator — Free AI Paragraph Generator, No Signup | ToolsePulse",
    description: "Paragraph generator free — AI paragraph generator writes paragraphs on any topic. Free paragraph generator, no signup, unlimited use. Informative, descriptive, narrative styles.",
  },
  "ai-text-rewriter": {
    title: "AI Text Rewriter — Free Online Paraphraser, No Signup | ToolsePulse",
    description: "AI text rewriter free online — paraphrase and rephrase any text using AI. Free AI rewriter, no signup, unlimited use. Change tone, simplify, sound professional.",
  },
  "wav-converter": {
    title: "WAV Converter — Free Online WAV Converter, Convert to WAV Free | ToolsePulse",
    description: "WAV converter free online — convert MP3, OGG, FLAC, AAC to WAV. Free WAV converter, no signup, no quality loss, no file uploads. Runs entirely in your browser.",
  },
  "audio-trimmer": {
    title: "Audio Trimmer — Free Online Audio Cutter, Trim Audio Free | ToolsePulse",
    description: "Free audio trimmer online — cut audio files, trim MP3, WAV, M4A in your browser. Online audio cutter free, no signup, no upload, no watermark. Fast and private.",
  },
  "essay-writer": {
    title: "Essay Generator — Free AI Essay Writer Online, No Signup | ToolsePulse",
    description: "Free essay generator — AI essay writer creates essays on any topic. Free online essay writer, no signup, unlimited generations. Argumentative, narrative, expository styles.",
  },
  "image-metadata-viewer": {
    title: "Image Metadata Viewer — Free EXIF Viewer, Check Photo Metadata | ToolsePulse",
    description: "Free image metadata viewer online — check photo metadata, view EXIF data, find image GPS coordinates. View image metadata free, no signup, runs in your browser.",
  },
  "grammar-checker": {
    title: "Grammar Checker Online — Free Grammar Check, No Signup | ToolsePulse",
    description: "Grammar checker online free — fix grammar, spelling, and punctuation errors instantly. Free online grammar checker, no signup, no word limits, no uploads.",
  },
  "uuid-generator": {
    title: "UUID Generator — Free UUID v4 Generator Online, Bulk Generation | ToolsePulse",
    description: "Free UUID generator online — generate UUID v4 in bulk, copy with one click. Online UUID generator, no signup, generate up to 1000 UUIDs at once. Free and instant.",
  },
  "pdf-crop": {
    title: "Crop PDF Online — Free PDF Crop Tool, No Signup, No Watermark | ToolsePulse",
    description: "Crop PDF online free — trim margins, crop pages, resize PDF dimensions. Free PDF crop tool, no signup, no watermark, no file uploads. Runs in your browser.",
  },
  "image-rotator": {
    title: "Rotate Image Online Free — Free Image Rotator, No Signup | ToolsePulse",
    description: "Rotate image online free — rotate photos 90°, 180°, custom angles. Free image rotator, no signup, no watermark, no uploads. Works on JPG, PNG, WebP, HEIC.",
  },
  "pdf-password-protector": {
    title: "Password Protect PDF Free — Add PDF Password Online, No Signup | ToolsePulse",
    description: "Password protect PDF free online — encrypt PDF with password instantly. Free PDF password protector, no signup, no upload. Strong AES encryption, all in your browser.",
  },
  "pdf-annotator": {
    title: "PDF Annotator Free — Annotate PDF Online, Highlight, Comment | ToolsePulse",
    description: "Free PDF annotator online — annotate PDF, highlight text, add comments and notes. Free online PDF annotator, no signup, no watermark, no file uploads.",
  },
  "fake-data-generator": {
    title: "Fake Data Generator — Generate Mock Test Data Online Free | ToolsePulse",
    description: "Free fake data generator online — generate mock test data, fake names, emails, addresses, phone numbers. Online fake data generation, no signup, JSON/CSV export.",
  },
  "text-diff-checker": {
    title: "Text Diff Checker — Compare Text Online Free, No Signup | ToolsePulse",
    description: "Free text diff checker online — compare two texts side by side, find differences instantly. Online text comparison tool, no signup, no upload. Highlights additions and deletions.",
  },
  "audio-joiner": {
    title: "Audio Joiner — Free Online Audio Merger, Join MP3 Files | ToolsePulse",
    description: "Free audio joiner online — merge MP3, WAV, M4A audio files instantly. Online audio merger, no signup, no quality loss, no upload. Combine unlimited tracks.",
  },
  "lorem-ipsum-generator": {
    title: "Lorem Ipsum Generator — Free Lorem Ipsum Text Generator Online | ToolsePulse",
    description: "Free lorem ipsum generator — generate lorem ipsum placeholder text by words, paragraphs, or characters. Online lorem ipsum text generator, no signup, instant copy.",
  },
  "meme-generator": {
    title: "Meme Generator — Free Online Meme Maker, No Signup, No Watermark | ToolsePulse",
    description: "Free meme generator online — create memes with custom text, upload your own template. Online meme maker, no signup, no watermark, no upload. Caption images instantly.",
  },
  "password-generator": {
    title: "Password Generator — Free Strong Password Generator Online | ToolsePulse",
    description: "Free password generator online — generate strong, random passwords with custom length and rules. Online password generator, no signup, cryptographically secure, fully private.",
  },
  "pdf-header-footer": {
    title: "Add Header & Footer to PDF — Free Online PDF Header Footer Tool | ToolsePulse",
    description: "Free online tool to add header and footer to PDF — add page numbers, dates, custom text. No signup, no watermark, no file upload. Runs entirely in your browser.",
  },
  "pdf-reorder-pages": {
    title: "Reorder PDF Pages Online — Free PDF Page Reorder Tool, No Signup | ToolsePulse",
    description: "Reorder PDF pages online free — drag and drop to rearrange PDF page order. Free PDF reorder tool, no signup, no watermark, no upload. Works in your browser.",
  },
  "pdf-watermark": {
    title: "Watermark PDF Online — Add Text or Image Watermark to PDF Free | ToolsePulse",
    description: "Free PDF watermark tool — add text or image watermark to PDF online. Free watermark PDF tool, no signup, no upload, no quality loss. Works on any PDF file.",
  },
  "video-to-gif": {
    title: "Video to GIF — Free Online Video to GIF Converter, No Signup | ToolsePulse",
    description: "Free video to GIF converter online — convert MP4, MOV, WebM videos to animated GIF. Online video to GIF tool, no signup, no watermark, no upload.",
  },
  "watermark-image": {
    title: "Watermark Image — Free Online Watermark Photos, No Signup | ToolsePulse",
    description: "Free watermark image online — add text or logo watermark to photos. Online watermark photo tool, no signup, no upload, no quality loss. Protect product photos and art.",
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
