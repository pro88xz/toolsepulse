import type { ToolCategory } from "./tools";

/**
 * Presentation layer for tool categories.
 *
 * Kept separate from `tools.ts` so the data file stays about the tools
 * themselves. `icon` is a Phosphor icon name — see `src/lib/tool-icons.tsx`.
 * `from`/`to` are the gradient stops used by the icon tiles and rail chips;
 * all nine pairs sit at the same saturation so the grid reads as one system.
 */
export interface CategoryStyle {
  /** Short label for the sidebar rail — not the long label in `categories`. */
  label: string;
  icon: string;
  from: string;
  to: string;
}

export const categoryStyles: Record<ToolCategory, CategoryStyle> = {
  pdf: { label: "PDF", icon: "FilePdf", from: "#F0554B", to: "#B91C1C" },
  image: { label: "Image", icon: "ImageSquare", from: "#12B981", to: "#047857" },
  developer: { label: "Developer", icon: "Code", from: "#06B6D4", to: "#0E7490" },
  converter: { label: "Convert", icon: "ArrowsLeftRight", from: "#3B82F6", to: "#1D4ED8" },
  text: { label: "Text", icon: "TextAa", from: "#8B5CF6", to: "#6D28D9" },
  generator: { label: "Generators", icon: "MagicWand", from: "#D946EF", to: "#A21CAF" },
  video: { label: "Video", icon: "VideoCamera", from: "#EC4899", to: "#BE185D" },
  audio: { label: "Audio", icon: "MusicNotes", from: "#FB8B24", to: "#C2410C" },
  ai: { label: "AI", icon: "Sparkle", from: "#6366F1", to: "#4338CA" },
};

/** Display order for the rail and for the default grid sort. */
export const categoryOrder: ToolCategory[] = [
  "pdf",
  "image",
  "developer",
  "converter",
  "text",
  "generator",
  "video",
  "audio",
  "ai",
];
