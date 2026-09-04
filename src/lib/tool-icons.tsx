import {
  Aperture,
  ArrowClockwise,
  ArrowsDownUp,
  ArrowsInSimple,
  ArrowsLeftRight,
  ArrowsMerge,
  ArrowsOutSimple,
  Barcode,
  Binary,
  BracketsCurly,
  Code,
  Crop,
  Database,
  Drop,
  Eraser,
  FileArrowDown,
  FileArrowUp,
  FileCode,
  FileCsv,
  FileDoc,
  FileImage,
  FileMagnifyingGlass,
  FileMinus,
  FilePdf,
  FilePlus,
  FileText,
  FilmStrip,
  Fingerprint,
  GitDiff,
  Globe,
  GridFour,
  Hash,
  Highlighter,
  ImageSquare,
  Info,
  Key,
  LinkSimple,
  LinkSimpleHorizontal,
  ListNumbers,
  Lock,
  LockKey,
  LockOpen,
  MagicWand,
  Microphone,
  Monitor,
  MusicNotes,
  NotePencil,
  Palette,
  Password,
  PenNib,
  QrCode,
  ReadCvLogo,
  Receipt,
  Scales,
  Scan,
  Scissors,
  ShieldCheck,
  Signature,
  Smiley,
  Sparkle,
  Stack,
  Stamp,
  TextAa,
  TextAlignLeft,
  TextT,
  Textbox,
  VideoCamera,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

/**
 * Minimal structural type for a Phosphor icon component. Declared locally so
 * this module does not depend on Phosphor's own exported types.
 */
export type PhosphorIcon = React.ComponentType<{
  size?: number | string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  color?: string;
  className?: string;
  mirrored?: boolean;
}>;

/**
 * `tools.ts` stores Lucide icon names ("FileDown", "PenLine"). Rather than
 * rewrite 82 tool entries, this maps those names onto Phosphor equivalents.
 * Add the Lucide name here when a new tool is added.
 */
const LUCIDE_TO_PHOSPHOR: Record<string, PhosphorIcon> = {
  AlignLeft: TextAlignLeft,
  Aperture: Aperture,
  ArrowsUpDown: ArrowsDownUp,
  Binary: Binary,
  Braces: BracketsCurly,
  CaseSensitive: TextAa,
  Combine: ArrowsMerge,
  Crop: Crop,
  Database: Database,
  Droplet: Drop,
  Eraser: Eraser,
  FileDown: FileArrowDown,
  FileEdit: NotePencil,
  FileImage: FileImage,
  FileJson: FileCode,
  FileMinus: FileMinus,
  FileOutput: FileArrowUp,
  FilePlus: FilePlus,
  FileSearch: FileMagnifyingGlass,
  FileSpreadsheet: FileCsv,
  FileText: FileText,
  Film: FilmStrip,
  Fingerprint: Fingerprint,
  GitCompare: GitDiff,
  Globe: Globe,
  Hash: Hash,
  Highlighter: Highlighter,
  ImageDown: ImageSquare,
  Info: Info,
  KeyRound: Key,
  Layers: Stack,
  LayoutGrid: GridFour,
  Link: LinkSimple,
  Link2: LinkSimpleHorizontal,
  Lock: Lock,
  Maximize: ArrowsOutSimple,
  Mic: Microphone,
  Minimize2: ArrowsInSimple,
  Monitor: Monitor,
  Music: MusicNotes,
  Palette: Palette,
  PenLine: PenNib,
  QrCode: QrCode,
  Receipt: Receipt,
  RotateCw: ArrowClockwise,
  Scale: Scales,
  ScanLine: Barcode,
  ScanText: Scan,
  Scissors: Scissors,
  ShieldCheck: ShieldCheck,
  Smile: Smiley,
  Sparkles: Sparkle,
  Stamp: Stamp,
  Type: TextT,
  Unlock: LockOpen,
  UserCheck: ReadCvLogo,
  Wand: MagicWand,
  Youtube: YoutubeLogo,
};

/**
 * Per-tool overrides, keyed by slug, where several tools shared one Lucide
 * name and the shared glyph was misleading (three different tools all showed
 * the same padlock, for instance).
 */
const SLUG_OVERRIDES: Record<string, PhosphorIcon> = {
  "pdf-signer": Signature,
  "password-generator": Password,
  "pdf-password-protector": LockKey,
  "word-counter": ListNumbers,
  "image-to-text": Scan,
  // The PDF set otherwise collapses onto one document glyph. Let the action
  // carry the icon rather than the file type — they are all PDFs anyway.
  "merge-pdf": ArrowsMerge,
  "pdf-splitter": Scissors,
  "pdf-compressor": ArrowsInSimple,
  "pdf-page-extractor": Stack,
  "pdf-text-extractor": TextT,
  "pdf-to-word": FileDoc,
  "word-to-pdf": FileDoc,
  "jpg-to-pdf": FileImage,
  "image-to-pdf": FileImage,
  "pdf-to-jpg": ImageSquare,
  "pdf-crop": Crop,
  "pdf-page-rotator": ArrowClockwise,
  "pdf-reorder-pages": ArrowsDownUp,
  "pdf-page-numbering": ListNumbers,
  "pdf-bates-numbering": Hash,
  "pdf-watermark": Drop,
  "pdf-header-footer": Textbox,
  "pdf-annotator": Highlighter,
  "pdf-editor": NotePencil,
  "pdf-unlocker": LockOpen,
};

/** Icons referenced by name from the category config and page chrome. */
const NAMED: Record<string, PhosphorIcon> = {
  FilePdf,
  ImageSquare,
  Code,
  ArrowsLeftRight,
  TextAa,
  MagicWand,
  VideoCamera,
  MusicNotes,
  Sparkle,
  GridFour,
  ShieldCheck,
  Password,
  ArrowsOutSimple,
};

/** Resolve a Phosphor component for a tool, falling back to a generic file. */
export function getToolIcon(slug: string, lucideName: string): PhosphorIcon {
  return SLUG_OVERRIDES[slug] ?? LUCIDE_TO_PHOSPHOR[lucideName] ?? FileText;
}

/** Resolve a Phosphor component by name, for categories and page chrome. */
export function getNamedIcon(name: string): PhosphorIcon {
  return NAMED[name] ?? LUCIDE_TO_PHOSPHOR[name] ?? FileText;
}
