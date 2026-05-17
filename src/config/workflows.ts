/**
 * Workflow graph — defines natural "what's next" follow-ups for each tool.
 *
 * Curated based on real user journeys, not category similarity.
 * Each tool maps to an ordered list of recommended next steps (best match first).
 * Reasons are kept to 4-8 words for clean UI display.
 *
 * Terminal tools (no useful next-step) are intentionally absent.
 */

export type WorkflowStep = {
  tool: string;   // tool slug
  reason: string; // why this is a good next step
};

export const workflowGraph: Record<string, WorkflowStep[]> = {
  // === PRIVACY CHAIN ===
  "exif-remover": [
    { tool: "image-compressor", reason: "Compress before sharing online" },
    { tool: "watermark-image", reason: "Add a watermark to protect it" },
  ],
  "image-metadata-viewer": [
    { tool: "exif-remover", reason: "Strip the data you just saw" },
    { tool: "image-blur", reason: "Hide sensitive details visually" },
  ],

  // === IMAGE EDITING CHAIN ===
  "image-cropper": [
    { tool: "image-resizer", reason: "Resize to exact dimensions" },
    { tool: "image-compressor", reason: "Shrink the file size" },
    { tool: "watermark-image", reason: "Brand it before sharing" },
  ],
  "image-resizer": [
    { tool: "image-compressor", reason: "Reduce file size further" },
    { tool: "watermark-image", reason: "Add a watermark" },
    { tool: "image-cropper", reason: "Crop to the right shape" },
  ],
  "image-compressor": [
    { tool: "watermark-image", reason: "Add your watermark next" },
    { tool: "image-resizer", reason: "Resize before final upload" },
    { tool: "exif-remover", reason: "Strip hidden metadata" },
  ],
  "image-rotator": [
    { tool: "image-cropper", reason: "Crop the rotated result" },
    { tool: "image-compressor", reason: "Optimize file size" },
  ],
  "background-remover": [
    { tool: "image-compressor", reason: "Shrink the transparent PNG" },
    { tool: "watermark-image", reason: "Add a watermark" },
    { tool: "image-resizer", reason: "Resize for product photos" },
  ],
  "image-blur": [
    { tool: "image-compressor", reason: "Shrink before sharing" },
    { tool: "watermark-image", reason: "Add identifying info" },
  ],
  "watermark-image": [
    { tool: "image-compressor", reason: "Compress the watermarked file" },
    { tool: "image-resizer", reason: "Resize for web upload" },
  ],
  "image-to-pdf": [
    { tool: "pdf-compressor", reason: "Compress the generated PDF" },
    { tool: "merge-pdf", reason: "Combine with other PDFs" },
  ],
  "ai-image-upscaler": [
    { tool: "image-compressor", reason: "Compress the upscaled result" },
    { tool: "watermark-image", reason: "Watermark before publishing" },
  ],

  // === FORMAT CONVERSION ===
  "jpg-to-png": [
    { tool: "background-remover", reason: "Make the background transparent" },
    { tool: "image-compressor", reason: "Optimize the new PNG" },
  ],
  "png-to-jpg": [
    { tool: "image-compressor", reason: "Shrink the JPG further" },
    { tool: "watermark-image", reason: "Watermark before sharing" },
  ],
  "webp-to-png": [
    { tool: "image-compressor", reason: "Optimize file size" },
    { tool: "background-remover", reason: "Remove the background" },
  ],
  "svg-to-png": [
    { tool: "image-resizer", reason: "Resize to exact pixel size" },
    { tool: "image-compressor", reason: "Optimize file size" },
  ],
  "heic-to-jpg": [
    { tool: "exif-remover", reason: "Strip iPhone GPS metadata" },
    { tool: "image-compressor", reason: "Reduce file size" },
  ],
  "pdf-to-jpg": [
    { tool: "image-compressor", reason: "Compress the extracted images" },
    { tool: "image-resizer", reason: "Resize for emailing" },
  ],
  "jpg-to-pdf": [
    { tool: "pdf-compressor", reason: "Shrink the PDF for sharing" },
    { tool: "merge-pdf", reason: "Combine with other PDFs" },
  ],

  // === PDF CHAIN ===
  "pdf-compressor": [
    { tool: "merge-pdf", reason: "Combine multiple PDFs" },
    { tool: "pdf-splitter", reason: "Split into individual pages" },
  ],
  "merge-pdf": [
    { tool: "pdf-compressor", reason: "Compress the merged file" },
    { tool: "pdf-signer", reason: "Add a digital signature" },
  ],
  "pdf-splitter": [
    { tool: "pdf-compressor", reason: "Compress the split pages" },
    { tool: "pdf-page-rotator", reason: "Fix orientation issues" },
  ],
  "pdf-page-rotator": [
    { tool: "pdf-compressor", reason: "Compress before sharing" },
    { tool: "merge-pdf", reason: "Merge with other documents" },
  ],
  "pdf-to-word": [
    { tool: "grammar-checker", reason: "Polish the extracted text" },
    { tool: "word-counter", reason: "Check word count" },
  ],
  "word-to-pdf": [
    { tool: "pdf-compressor", reason: "Shrink for emailing" },
    { tool: "pdf-signer", reason: "Sign the document" },
  ],
  "pdf-editor": [
    { tool: "pdf-compressor", reason: "Compress your edited PDF" },
    { tool: "pdf-signer", reason: "Add a signature" },
  ],
  "pdf-signer": [
    { tool: "pdf-compressor", reason: "Compress before sending" },
    { tool: "merge-pdf", reason: "Combine signed documents" },
  ],
  "pdf-unlocker": [
    { tool: "pdf-compressor", reason: "Compress the unlocked file" },
    { tool: "pdf-editor", reason: "Edit the contents" },
  ],

  // === TEXT / CONTENT CHAIN ===
  "screenshot-to-text": [
    { tool: "grammar-checker", reason: "Fix OCR text errors" },
    { tool: "word-counter", reason: "Count the extracted words" },
    { tool: "ai-text-rewriter", reason: "Rewrite or improve it" },
  ],
  "image-to-text": [
    { tool: "grammar-checker", reason: "Polish the extracted text" },
    { tool: "word-counter", reason: "Count words in the text" },
  ],
  "grammar-checker": [
    { tool: "ai-text-rewriter", reason: "Rewrite for clarity" },
    { tool: "word-counter", reason: "Check final word count" },
  ],
  "ai-text-rewriter": [
    { tool: "grammar-checker", reason: "Verify the rewrite" },
    { tool: "word-counter", reason: "Confirm word count" },
  ],
  "word-counter": [
    { tool: "character-counter", reason: "Check character limits too" },
    { tool: "grammar-checker", reason: "Polish your writing" },
  ],
  "character-counter": [
    { tool: "word-counter", reason: "Switch to word count" },
    { tool: "slug-generator", reason: "Make a URL-safe version" },
  ],
  "essay-writer": [
    { tool: "grammar-checker", reason: "Polish the draft" },
    { tool: "word-counter", reason: "Check the word count" },
  ],
  "paragraph-generator": [
    { tool: "grammar-checker", reason: "Verify the paragraphs" },
    { tool: "word-counter", reason: "Check the length" },
  ],

  // === AUDIO / VIDEO CHAIN ===
  "mp4-to-mp3": [
    { tool: "audio-trimmer", reason: "Trim the audio length" },
    { tool: "mp3-converter", reason: "Adjust bitrate/quality" },
  ],
  "video-trimmer": [
    { tool: "video-compressor", reason: "Compress the trimmed clip" },
    { tool: "mp4-to-mp3", reason: "Extract just the audio" },
  ],
  "video-compressor": [
    { tool: "video-trimmer", reason: "Cut to a shorter clip" },
    { tool: "video-to-gif", reason: "Convert to an animated GIF" },
  ],
  "screen-recorder": [
    { tool: "video-trimmer", reason: "Trim the recording" },
    { tool: "video-compressor", reason: "Shrink before sharing" },
  ],
  "voice-recorder": [
    { tool: "audio-trimmer", reason: "Trim the recording" },
    { tool: "mp3-converter", reason: "Convert to MP3 format" },
  ],
  "audio-trimmer": [
    { tool: "audio-joiner", reason: "Combine multiple clips" },
    { tool: "mp3-converter", reason: "Convert to MP3" },
  ],
  "audio-joiner": [
    { tool: "audio-trimmer", reason: "Trim the joined audio" },
    { tool: "mp3-converter", reason: "Convert to MP3" },
  ],
  "mp3-converter": [
    { tool: "audio-trimmer", reason: "Trim to size" },
    { tool: "audio-joiner", reason: "Join with other clips" },
  ],
  "wav-converter": [
    { tool: "audio-trimmer", reason: "Trim the converted audio" },
    { tool: "mp3-converter", reason: "Also convert to MP3" },
  ],
  "video-to-gif": [
    { tool: "gif-maker", reason: "Make a custom GIF from images" },
    { tool: "image-compressor", reason: "Optimize the GIF size" },
  ],
  "gif-maker": [
    { tool: "video-to-gif", reason: "Convert a video instead" },
    { tool: "image-compressor", reason: "Reduce the GIF size" },
  ],

  // === DOCUMENT CREATION ===
  "invoice-generator": [
    { tool: "pdf-compressor", reason: "Shrink for emailing" },
    { tool: "pdf-signer", reason: "Add your signature" },
  ],
  "resume-builder": [
    { tool: "pdf-compressor", reason: "Compress for emailing" },
    { tool: "grammar-checker", reason: "Polish the writing" },
  ],

  // === CREATIVE / MEME ===
  "meme-generator": [
    { tool: "watermark-image", reason: "Add your handle to it" },
    { tool: "image-compressor", reason: "Shrink for social sharing" },
  ],

  // === DEVELOPER TOOLS ===
  "json-formatter": [
    { tool: "json-to-csv", reason: "Convert to CSV" },
    { tool: "csv-to-json", reason: "Or import CSV data" },
  ],
  "csv-to-json": [
    { tool: "json-formatter", reason: "Format and validate" },
    { tool: "fake-data-generator", reason: "Generate more sample data" },
  ],
  "json-to-csv": [
    { tool: "json-formatter", reason: "Format the source JSON" },
    { tool: "csv-to-json", reason: "Convert back if needed" },
  ],
  "color-picker": [
    { tool: "color-converter", reason: "Convert color formats" },
    { tool: "favicon-generator", reason: "Use it in a favicon" },
  ],
  "color-converter": [
    { tool: "color-picker", reason: "Pick another color" },
    { tool: "favicon-generator", reason: "Use in a favicon" },
  ],
  "hash-generator": [
    { tool: "base64-encoder", reason: "Also encode in Base64" },
    { tool: "uuid-generator", reason: "Generate unique IDs" },
  ],
  "base64-encoder": [
    { tool: "hash-generator", reason: "Hash the content instead" },
    { tool: "url-encoder", reason: "URL-encode strings" },
  ],
  "jwt-decoder": [
    { tool: "base64-encoder", reason: "Decode Base64 strings" },
    { tool: "hash-generator", reason: "Verify hashes" },
  ],
  "url-encoder": [
    { tool: "base64-encoder", reason: "Also encode in Base64" },
    { tool: "slug-generator", reason: "Make URL-safe slugs" },
  ],
  "case-converter": [
    { tool: "slug-generator", reason: "Turn into a URL slug" },
    { tool: "character-counter", reason: "Check new length" },
  ],
  "slug-generator": [
    { tool: "case-converter", reason: "Try other case formats" },
    { tool: "character-counter", reason: "Check the slug length" },
  ],
  "lorem-ipsum-generator": [
    { tool: "fake-data-generator", reason: "Generate sample data too" },
    { tool: "word-counter", reason: "Count the generated text" },
  ],
  "fake-data-generator": [
    { tool: "json-formatter", reason: "Format the JSON output" },
    { tool: "uuid-generator", reason: "Generate matching IDs" },
  ],
  "password-generator": [
    { tool: "hash-generator", reason: "Hash for storage" },
    { tool: "uuid-generator", reason: "Generate session IDs" },
  ],

  // === GENERATORS (mostly terminal) ===
  "qr-code-generator": [
    { tool: "barcode-generator", reason: "Generate a barcode too" },
    { tool: "favicon-generator", reason: "Make a brand favicon" },
  ],
  "barcode-generator": [
    { tool: "qr-code-generator", reason: "Generate a QR code instead" },
  ],
  "favicon-generator": [
    { tool: "image-resizer", reason: "Resize for other use" },
    { tool: "color-picker", reason: "Pick a brand color" },
  ],
};

/**
 * Tools where users typically don't need a next step.
 * Used to suppress the WhatsNext widget on these pages.
 */
export const TERMINAL_TOOLS = new Set([
  "uuid-generator",
  "text-diff-checker",
  "youtube-thumbnail-downloader",
]);
