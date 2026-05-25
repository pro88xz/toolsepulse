/**
 * Use-case landing pages.
 *
 * Each entry is a high-intent, long-tail SEO landing page that targets a specific
 * user query (e.g. "compress pdf under 100kb") and funnels traffic to an existing
 * tool with tailored context, instructions, and FAQ.
 *
 * These pages exist to capture long-tail queries that giants (Smallpdf, iLovePDF,
 * Adobe) don't bother building dedicated pages for. Pure incremental traffic.
 */

export interface UseCase {
  /** URL slug at /use/{slug} */
  slug: string;
  /** Primary tool this use case sends traffic to */
  toolSlug: string;
  /** H1 + <title> base */
  title: string;
  /** SEO description (155-160 chars) */
  description: string;
  /** The exact long-tail query this page targets */
  primaryQuery: string;
  /** Additional related queries to embed naturally */
  relatedQueries: string[];
  /** Punchy 1-2 sentence hook for the top of the page */
  hook: string;
  /** Why this specific use case matters — 2-4 sentence intro */
  intro: string;
  /** Tailored step-by-step for THIS use case (not generic tool steps) */
  steps: { title: string; description: string }[];
  /** Use-case-specific FAQ (different from the tool's generic FAQ) */
  faq: { question: string; answer: string }[];
  /** Related use cases to internally link to */
  related?: string[];
}

export const useCases: UseCase[] = [
  // ============ PDF COMPRESSION USE CASES ============
  {
    slug: "compress-pdf-for-email-attachment",
    toolSlug: "pdf-compressor",
    title: "Compress PDF for Email Attachment (Under 25MB)",
    description: "Shrink any PDF to fit Gmail, Outlook, and Yahoo email limits. Free, no signup, runs in your browser. Compress PDFs to under 25MB in seconds.",
    primaryQuery: "compress pdf for email attachment",
    relatedQueries: ["pdf too big for email", "reduce pdf size for gmail", "compress pdf under 25mb", "email attachment size limit"],
    hook: "Email won't send your PDF? Most providers cap attachments at 25MB. Here's the fastest fix.",
    intro: "Email attachment limits are the single biggest reason PDFs get bounced back. Gmail and Outlook block files over 25MB. Yahoo caps at 25MB. Some corporate Exchange servers stop you at 10MB. The fix is browser-based compression — no upload, no waiting, no account.",
    steps: [
      { title: "Open the PDF Compressor", description: "Click the button below to launch the tool. Nothing to install or sign up for." },
      { title: "Drop your PDF in", description: "Drag your file onto the upload zone. Everything processes locally — your document never touches a server." },
      { title: "Choose 'High Compression' for email", description: "For email attachments, pick the highest compression setting. Image quality drops slightly, but text stays crisp and file size drops by 60-80%." },
      { title: "Download and attach", description: "Save the compressed PDF and attach it to your email. It will now fit under the 25MB limit." },
    ],
    faq: [
      { question: "Why is my PDF too big for email in the first place?", answer: "Usually because it contains high-resolution images, scanned pages, or embedded fonts. A 50-page report with photos can easily be 40-100MB. Compression removes unnecessary image data while keeping text sharp." },
      { question: "Will the recipient be able to open it normally?", answer: "Yes. A compressed PDF is still a standard PDF file — it opens in every PDF viewer, browser, and mobile app the same as the original." },
      { question: "What if my PDF is still too big after compression?", answer: "Use our PDF Splitter to break it into two parts and send them in separate emails. Or upload to a cloud share like Google Drive and email the link instead." },
      { question: "Is there a Gmail-specific size limit?", answer: "Gmail allows attachments up to 25MB. Files larger than that auto-upload to Google Drive and Gmail sends a share link. Most recipients prefer a direct attachment, so compression is the better path." },
    ],
    related: ["compress-pdf-under-100kb", "compress-pdf-for-whatsapp", "split-large-pdf-into-parts"],
  },
  {
    slug: "compress-pdf-under-100kb",
    toolSlug: "pdf-compressor",
    title: "Compress PDF Under 100KB for Online Forms",
    description: "Reduce PDF file size to under 100KB for government forms, job applications, and online uploads. Free browser-based compression, no signup needed.",
    primaryQuery: "compress pdf under 100kb",
    relatedQueries: ["reduce pdf size to 100kb", "pdf under 100kb online", "compress pdf for upload", "shrink pdf to 100kb free"],
    hook: "Government forms, visa applications, and job portals often demand PDFs under 100KB. Here's how to hit that limit.",
    intro: "Online forms — especially government, visa, and university portals — often enforce strict file size caps. The most common cap is 100KB, which is brutal for documents containing scans or photos. Browser-based compression with aggressive image downsampling is the only reliable way to hit it.",
    steps: [
      { title: "Open the PDF Compressor", description: "Launch the tool below. No signup, no installation, runs entirely in your browser." },
      { title: "Upload your PDF", description: "Drop in the file you need to shrink. The tool will show you the current file size in KB." },
      { title: "Pick the maximum compression preset", description: "Choose the most aggressive compression. For 100KB targets, you almost always need maximum compression. Images may look slightly softer, but text remains readable." },
      { title: "Check the output and download", description: "The tool displays the final file size. If you're still over 100KB, re-run with the same settings or try our PDF to JPG tool to reduce to a single optimized image." },
    ],
    faq: [
      { question: "Why do forms require PDFs under 100KB?", answer: "Older government and university systems have storage and bandwidth limits set when 100KB was a reasonable document size. They never raised the limit even as documents got larger." },
      { question: "What if my PDF still won't compress below 100KB?", answer: "If it's a multi-page scan, convert it to a single image with PDF to JPG, compress the JPG, then convert back with our Image to PDF tool. For text-only PDFs, removing embedded fonts via re-export usually does it." },
      { question: "Will text stay readable at this compression level?", answer: "Yes. The tool compresses embedded images, not text. Text remains crisp regardless of compression level. Image clarity is what takes the hit." },
      { question: "Is 100KB enough for a typical 1-page document?", answer: "For a text-only document, easily. For a scanned page or one with photos, you may need to convert to grayscale first or reduce image resolution before compression." },
    ],
    related: ["compress-pdf-for-email-attachment", "compress-image-for-online-form", "scan-document-to-small-pdf"],
  },
  {
    slug: "compress-pdf-for-whatsapp",
    toolSlug: "pdf-compressor",
    title: "Compress PDF for WhatsApp (Under 100MB)",
    description: "Shrink PDFs to send on WhatsApp without errors. Free compression that gets your file under the 100MB WhatsApp document limit in seconds.",
    primaryQuery: "compress pdf for whatsapp",
    relatedQueries: ["whatsapp pdf size limit", "send big pdf on whatsapp", "reduce pdf for whatsapp", "whatsapp document too large"],
    hook: "WhatsApp document limit is 100MB. Anything over and your PDF won't send. Here's the 30-second fix.",
    intro: "WhatsApp lets you share PDFs up to 100MB as documents. Larger files get rejected with no useful error message. Compression in your browser solves it without uploading sensitive documents to random websites.",
    steps: [
      { title: "Check your file size first", description: "Right-click the PDF on your device and check properties. If it's over 100MB, you need compression. Under 100MB, the issue is something else (try resending or checking your connection)." },
      { title: "Open the PDF Compressor", description: "Launch the tool. Works on phone, tablet, or desktop browsers." },
      { title: "Choose 'Medium' compression", description: "For WhatsApp, medium compression usually gets you well under 100MB while keeping the document readable. Try high compression only if medium isn't enough." },
      { title: "Download and share", description: "Save the compressed file, open WhatsApp, attach as document. It will send normally." },
    ],
    faq: [
      { question: "What is WhatsApp's PDF size limit?", answer: "WhatsApp allows documents up to 100MB. This applies to PDFs, Word files, Excel files, and other document types. Media (photos, videos) have separate, smaller limits." },
      { question: "Will the recipient see the same document?", answer: "Yes. A compressed PDF retains all text, layout, and pages — just with slightly smaller embedded images. It looks and reads the same when opened." },
      { question: "Can I send compressed PDFs in WhatsApp Business?", answer: "Yes. WhatsApp Business uses the same 100MB document limit. Compressed files send identically." },
      { question: "Why is WhatsApp showing 'file too large' even after compression?", answer: "Some older Android versions cap shared attachments lower. Update WhatsApp or try sharing from a different device. If the file is under 100MB and still fails, your data connection may be timing out — try Wi-Fi." },
    ],
    related: ["compress-pdf-for-email-attachment", "compress-image-for-whatsapp", "compress-video-for-whatsapp"],
  },

  // ============ IMAGE COMPRESSION USE CASES ============
  {
    slug: "compress-image-for-whatsapp",
    toolSlug: "image-compressor",
    title: "Compress Image for WhatsApp Without Losing Quality",
    description: "Shrink photos for WhatsApp without the auto-compression quality loss. Send sharp images that keep their detail. Free browser-based compression.",
    primaryQuery: "compress image for whatsapp",
    relatedQueries: ["whatsapp image quality loss", "send hd photo whatsapp", "reduce image size for whatsapp", "whatsapp photo compression"],
    hook: "WhatsApp auto-compresses every photo you send — and the quality loss is brutal. Compress first, send as document, problem solved.",
    intro: "WhatsApp aggressively compresses photos sent as 'photos' — they end up blurry, pixelated, and small. The workaround is to compress the image yourself to a manageable size, then send as a 'document' instead. The recipient gets the full quality you intended.",
    steps: [
      { title: "Open the Image Compressor", description: "Launch the tool. Works in any browser, no signup needed." },
      { title: "Drop in your photo", description: "Upload the original high-quality image. The tool shows the current file size." },
      { title: "Compress to 1-2MB", description: "Aim for 1-2MB — small enough to send fast, large enough to keep crisp detail. The tool's slider lets you preview quality vs. size in real time." },
      { title: "Send via WhatsApp as a Document", description: "Open WhatsApp, tap the attach icon, choose 'Document' (not 'Gallery' or 'Photos'), select your compressed image. The recipient gets the file without WhatsApp re-compressing it." },
    ],
    faq: [
      { question: "Why does WhatsApp compress my photos so badly?", answer: "WhatsApp re-compresses every image sent as a 'photo' to save bandwidth. The compression is aggressive and destroys fine detail. Sending the same image as a 'document' bypasses this." },
      { question: "What size should I compress to?", answer: "1-2MB is the sweet spot. Smaller files send instantly. Larger files (up to WhatsApp's 100MB document limit) work too but take longer to send/receive." },
      { question: "Will the recipient see the photo or need to open a file?", answer: "When sent as a document, the recipient sees a file thumbnail. Tapping it opens the image in their gallery. Slight extra step but full quality is preserved." },
      { question: "Does this work on iPhone and Android?", answer: "Yes, identical on both. The 'Document' attachment option is available on both platforms — on iPhone it's under 'Files', on Android under 'Document'." },
    ],
    related: ["compress-image-for-instagram", "resize-image-for-whatsapp-dp", "compress-pdf-for-whatsapp"],
  },
  {
    slug: "compress-image-for-online-form",
    toolSlug: "image-compressor",
    title: "Compress Image Under 200KB for Online Forms",
    description: "Hit the strict file size limits on government, visa, and university forms. Compress photos to under 50KB, 100KB, or 200KB without quality loss.",
    primaryQuery: "compress image under 200kb",
    relatedQueries: ["compress photo for online form", "image under 50kb", "passport photo size kb", "visa application photo size"],
    hook: "Government forms and visa applications often demand photos under 200KB, sometimes under 50KB. Here's the exact way to hit those numbers.",
    intro: "Visa portals, university applications, government IDs — they all set strict size caps measured in KB. Most casual photo apps can't hit these targets. A browser-based compressor with precise quality control is the only reliable way.",
    steps: [
      { title: "Check the exact target size", description: "Read the form's requirements carefully. Some want under 50KB, others 100KB, 200KB, or 500KB. Aim slightly below the cap to be safe." },
      { title: "Open the Image Compressor", description: "Launch the tool. It accepts JPG, PNG, and WebP." },
      { title: "Use the size slider", description: "Adjust quality downward until the live preview shows your target size. The tool displays the projected file size as you slide." },
      { title: "Download and upload", description: "Save the compressed image and upload to the form. Double-check the form accepts it — some have additional dimension requirements." },
    ],
    faq: [
      { question: "How do I get a photo under 50KB?", answer: "Lower the quality slider to around 40-50%, and if needed, reduce dimensions to 600x600 pixels or smaller. For passport-style photos, 600x600 at 40% quality typically lands around 40-50KB." },
      { question: "What if the form rejects my compressed image?", answer: "Check the form's exact requirements — many specify dimensions (e.g. 200x300 pixels) and format (e.g. JPG only). Use our Image Resizer first to hit the dimensions, then compress." },
      { question: "Will compression hurt the quality for ID photos?", answer: "Slightly, but ID and passport photos are intentionally low-resolution. At 600x600 and 60% quality, a face photo still looks clear and meets every ID standard." },
      { question: "Why are visa/government forms so strict about size?", answer: "Their legacy systems were built when storage was expensive. Each application gets a small storage allocation, and oversized photos break the upload. The limits haven't been updated even though storage is now cheap." },
    ],
    related: ["resize-passport-photo", "compress-pdf-under-100kb", "resize-image-for-instagram"],
  },
  {
    slug: "compress-image-for-instagram",
    toolSlug: "image-compressor",
    title: "Compress Image for Instagram Without Losing Quality",
    description: "Get your photos under Instagram's compression algorithm. Upload sharp, crisp images that stay sharp even after Instagram re-encodes them.",
    primaryQuery: "compress image for instagram",
    relatedQueries: ["instagram quality loss", "best image size for instagram", "instagram compression algorithm", "sharp photos on instagram"],
    hook: "Instagram murders your image quality on upload. The trick: pre-compress smart, hit Instagram's preferred dimensions, and they leave it alone.",
    intro: "Instagram's algorithm re-compresses every image you upload. If you give it an oversized file, it crushes it. If you give it an image at the platform's preferred dimensions and quality, it leaves the file nearly untouched. This is how pro creators get crisp uploads.",
    steps: [
      { title: "Resize to Instagram's preferred dimensions first", description: "1080x1080 for square posts, 1080x1350 for portrait posts, 1080x1920 for Stories/Reels. Use our Image Resizer if you need to hit these exactly." },
      { title: "Open the Image Compressor", description: "Launch the tool to compress at the right quality level." },
      { title: "Compress to 70-85% quality, target ~1MB", description: "Around 1MB at 70-85% JPG quality is Instagram's sweet spot. Below this and detail suffers. Above and Instagram crushes it harder." },
      { title: "Upload to Instagram", description: "Post normally. The image will retain detail and stay sharper than the same photo uploaded raw from your camera." },
    ],
    faq: [
      { question: "What's the best image size for Instagram?", answer: "1080 pixels on the longest side. Square posts: 1080x1080. Portrait: 1080x1350. Stories/Reels: 1080x1920. These are Instagram's native dimensions and uploading at these sizes triggers minimal re-compression." },
      { question: "Should I use JPG or PNG for Instagram?", answer: "JPG. Instagram converts PNGs to JPG anyway, so starting as JPG avoids a double compression step. Use PNG only for graphics with text or sharp edges that need transparency." },
      { question: "Why do my photos look blurry on Instagram even after compression?", answer: "Either the image was uploaded at the wrong dimensions (forcing Instagram to resize, which adds compression) or quality was set too low (under 60%). Aim for 1080px wide and 70-85% quality." },
      { question: "Does the same approach work for Instagram Stories and Reels?", answer: "Yes — but use 1080x1920 dimensions instead of 1080x1080. Stories and Reels are vertical, so the resize matters more than for feed posts." },
    ],
    related: ["resize-image-for-instagram", "compress-image-for-whatsapp", "compress-image-for-online-form"],
  },

  // ============ IMAGE RESIZE USE CASES ============
  {
    slug: "resize-image-for-instagram",
    toolSlug: "image-resizer",
    title: "Resize Image for Instagram Posts, Stories, and Reels",
    description: "Resize any photo to Instagram's exact dimensions: 1080x1080 for posts, 1080x1350 for portrait, 1080x1920 for Stories. Free, instant, in your browser.",
    primaryQuery: "resize image for instagram",
    relatedQueries: ["instagram post size", "instagram story dimensions", "1080x1080 resize", "instagram reel size"],
    hook: "Instagram's algorithm rewards correct dimensions. Upload at the wrong size and it gets compressed twice. Hit the exact pixel target and your photos stay sharp.",
    intro: "Instagram has four standard sizes: 1080x1080 (square feed posts), 1080x1350 (4:5 portrait posts — the most engagement-friendly format), 1080x566 (landscape posts), and 1080x1920 (Stories/Reels). Hitting these exact dimensions means Instagram does less processing on upload.",
    steps: [
      { title: "Decide your post type", description: "Square post: 1080x1080. Portrait (recommended for engagement): 1080x1350. Landscape: 1080x566. Story or Reel: 1080x1920." },
      { title: "Open the Image Resizer", description: "Launch the tool below." },
      { title: "Set custom dimensions", description: "Enter the width and height for your chosen Instagram format. Lock the aspect ratio if you want to avoid stretching, or unlock it to crop." },
      { title: "Download and post", description: "Save the resized image. Upload to Instagram directly without further editing. The image will display crisp and Instagram won't re-crop it." },
    ],
    faq: [
      { question: "What is the best size for Instagram in 2026?", answer: "1080x1350 (4:5 portrait) is the highest-engagement format because it takes up the most vertical screen space in the feed without being cropped. For Stories and Reels, 1080x1920 is the standard." },
      { question: "Why does Instagram crop my photos?", answer: "If your image's aspect ratio doesn't match one of Instagram's supported ratios (1:1, 4:5, 1.91:1 for posts; 9:16 for Stories), Instagram crops to fit. Resizing to a supported ratio first prevents unwanted crops." },
      { question: "Can I upload images larger than 1080 pixels?", answer: "Yes, up to 1440 pixels wide for posts. Instagram will downsize anyway, but starting at 1080 means less compression on upload. Going larger doesn't improve final quality." },
      { question: "What about Instagram carousel posts?", answer: "All images in a carousel must be the same aspect ratio. Pick one (1:1, 4:5, or 1.91:1) and resize every image in the carousel to match before uploading." },
    ],
    related: ["compress-image-for-instagram", "resize-image-for-facebook", "resize-passport-photo"],
  },
  {
    slug: "resize-image-for-facebook",
    toolSlug: "image-resizer",
    title: "Resize Image for Facebook Posts, Cover, and Profile",
    description: "Get the exact dimensions for Facebook: 1200x630 for posts, 820x312 for cover photos, 170x170 for profile pictures. Free browser-based resizing.",
    primaryQuery: "resize image for facebook",
    relatedQueries: ["facebook post size", "facebook cover photo size", "facebook profile picture size", "1200x630 image"],
    hook: "Facebook has six different image size requirements. Upload at the wrong size and you get blurry, cropped, or shrunken results.",
    intro: "Facebook displays images at specific sizes depending on where they appear: feed posts, cover photos, profile pictures, event covers, group covers, and ad images. Each has its own dimension. Resize to the exact target and your image displays crisp on every device.",
    steps: [
      { title: "Pick the right dimension for your use", description: "Feed post: 1200x630. Cover photo: 820x312 (desktop) or 640x360 (mobile-safe). Profile picture: 170x170. Event cover: 1920x1005. Group cover: 1640x856." },
      { title: "Open the Image Resizer", description: "Launch the tool. Drag in your source image." },
      { title: "Enter custom dimensions", description: "Type the target width and height. For cover photos, design with the mobile-safe area in mind so nothing important gets cropped on phones." },
      { title: "Save and upload", description: "Download the resized file and upload directly to Facebook. The image will display at full sharpness without being auto-cropped." },
    ],
    faq: [
      { question: "What size is a Facebook cover photo in 2026?", answer: "820x312 pixels for desktop display. On mobile, only the center 640x360 area shows, so keep critical content (text, faces) in that center zone." },
      { question: "Does Facebook compress images on upload?", answer: "Yes — Facebook re-compresses all images. Uploading at the exact target dimensions and JPG format minimizes the compression damage. Avoid PNG for photos; Facebook converts it to JPG and double-compresses." },
      { question: "What about Facebook Stories?", answer: "1080x1920 pixels, same as Instagram Stories. Vertical 9:16 ratio. Anything else gets letterboxed or cropped." },
      { question: "Can I use the same image for Facebook and Instagram?", answer: "Only if it's a square (1080x1080), which fits both Facebook feed and Instagram. Other formats need separate sizing. Twitter and LinkedIn have their own preferred sizes too." },
    ],
    related: ["resize-image-for-instagram", "resize-image-for-linkedin", "compress-image-for-online-form"],
  },
  {
    slug: "resize-image-for-linkedin",
    toolSlug: "image-resizer",
    title: "Resize Image for LinkedIn Posts, Banner, and Profile",
    description: "Hit LinkedIn's exact image sizes: 1200x627 for posts, 1584x396 for banner, 400x400 for profile. Free resize tool — no signup, runs in browser.",
    primaryQuery: "resize image for linkedin",
    relatedQueries: ["linkedin banner size", "linkedin post image size", "linkedin profile picture size", "1584x396 image"],
    hook: "LinkedIn cares about image quality more than any other social platform — and the wrong dimensions get cropped or blurred. Here are the exact targets.",
    intro: "LinkedIn's algorithm prioritizes high-quality, native-format images. Get the dimensions right and your post stands out in the feed. Get them wrong and LinkedIn auto-crops, often cutting off faces, logos, or text.",
    steps: [
      { title: "Pick the right LinkedIn dimension", description: "Feed post: 1200x627. Banner/cover: 1584x396 (very wide and short — design carefully). Profile picture: 400x400. Company logo: 300x300." },
      { title: "Open the Image Resizer", description: "Launch the tool." },
      { title: "Resize to the target", description: "Enter the exact pixel dimensions. For banners, remember the profile photo overlays the bottom-left — keep that area visually clean." },
      { title: "Upload to LinkedIn", description: "Save and post. LinkedIn will display the image without cropping or quality loss." },
    ],
    faq: [
      { question: "What is the best image size for LinkedIn posts in 2026?", answer: "1200x627 pixels (1.91:1 ratio). This matches LinkedIn's preview card for shared links and looks best in the feed. Square images (1200x1200) work too but display smaller." },
      { question: "What are LinkedIn banner dimensions?", answer: "1584x396 pixels. This is unusually wide and short — design with that in mind. Keep important visual elements in the right two-thirds since your profile photo covers the bottom-left." },
      { question: "Does LinkedIn compress images heavily?", answer: "Less than Facebook or Instagram. LinkedIn preserves quality fairly well, but uploading at the exact target dimension and 80%+ JPG quality is still optimal." },
      { question: "How big should a LinkedIn profile photo be?", answer: "400x400 pixels at minimum, up to 800x800. LinkedIn displays profile photos as small circles, so detail is less important than clear face visibility." },
    ],
    related: ["resize-image-for-facebook", "resize-image-for-instagram", "compress-image-for-online-form"],
  },
  {
    slug: "resize-passport-photo",
    toolSlug: "image-resizer",
    title: "Resize Photo to Passport Size (35x45mm, 2x2 inches)",
    description: "Resize any photo to passport, visa, or ID dimensions — 35x45mm (most countries), 2x2 inches (US), or custom mm/inch sizes. Free, instant, private.",
    primaryQuery: "resize photo to passport size",
    relatedQueries: ["passport photo size mm", "2x2 inch photo", "35x45 photo size", "visa photo dimensions"],
    hook: "Passport offices reject 40% of submitted photos for wrong size. Hit the exact dimensions in your browser before you print or upload.",
    intro: "Passport, visa, and ID photo requirements vary by country: 35x45mm in most of Europe and Asia, 2x2 inches in the US, 50x70mm for some visas. Use the wrong size and your application gets rejected — costing time and re-application fees.",
    steps: [
      { title: "Look up your exact requirement", description: "US passport: 2x2 inches (51x51mm). Most other countries: 35x45mm. Schengen visa: 35x45mm. Indian passport: 35x35mm. Check your specific authority's site before resizing." },
      { title: "Open the Image Resizer", description: "Launch the tool. Switch the unit to mm or inches as needed." },
      { title: "Enter the target dimensions", description: "Type the exact required size. Lock the aspect ratio if your source photo is already cropped tight. Otherwise crop first using our Image Cropper for face centering." },
      { title: "Download and print or upload", description: "Save the resized file. Print on photo paper or upload directly to the online application portal." },
    ],
    faq: [
      { question: "What is the standard passport photo size?", answer: "35x45mm (3.5x4.5cm) is the standard for most countries: UK, EU, Australia, India, and most of Asia. The US uses 2x2 inches (51x51mm). Always confirm with your specific authority." },
      { question: "What DPI should my passport photo be?", answer: "Minimum 300 DPI for printed photos. For digital uploads, 600x600 pixels for 2x2 inch photos, or 413x531 pixels for 35x45mm at 300 DPI." },
      { question: "Why are passport photos so often rejected?", answer: "Common reasons: wrong dimensions, face not centered or wrong size within the frame, background not plain white, shadows on face, glasses or hat visible. Resizing fixes the dimension issue — composition and lighting are separate." },
      { question: "Can I make a passport photo from a regular selfie?", answer: "Sometimes — if the selfie has a plain background, face is straight-on, no shadows, and good lighting. Crop tight to head/shoulders first, then resize to the target dimension. Many applications now accept smartphone photos that meet these criteria." },
    ],
    related: ["compress-image-for-online-form", "resize-image-for-instagram", "remove-background-from-product-photo"],
  },

  // ============ BACKGROUND REMOVAL USE CASES ============
  {
    slug: "remove-background-from-product-photo",
    toolSlug: "background-remover",
    title: "Remove Background From Product Photo for Shopify and Amazon",
    description: "Get clean white-background product photos required by Amazon, Shopify, and eBay. Free AI background remover, processes locally — your photos stay private.",
    primaryQuery: "remove background from product photo",
    relatedQueries: ["white background for amazon", "shopify product photo", "ebay product image", "product photo background remover"],
    hook: "Amazon requires pure white backgrounds (RGB 255,255,255). Shopify and eBay strongly prefer them. Here's how to get there in 30 seconds.",
    intro: "Marketplaces are strict: Amazon will reject listings without pure white product backgrounds (#FFFFFF). Shopify and eBay don't enforce as hard, but white-background photos convert dramatically better. AI background removal in your browser is now indistinguishable from manual masking — and free.",
    steps: [
      { title: "Take or upload a clean product shot", description: "The cleaner the source — good lighting, sharp focus, contrasting background — the better the AI removal." },
      { title: "Open the Background Remover", description: "Launch the tool. It uses an AI model that runs entirely in your browser." },
      { title: "Drop your photo in", description: "The AI processes the image locally and outputs a transparent PNG. Takes 5-15 seconds depending on image size." },
      { title: "Convert to white background", description: "For Amazon, you need pure white, not transparent. Use our Image to PDF or any image editor to fill the transparent layer with white, or save the PNG over a white canvas." },
    ],
    faq: [
      { question: "Does Amazon really require pure white backgrounds?", answer: "Yes — RGB 255,255,255 — for the main product image on listings. This is non-negotiable for compliant listings. Secondary/lifestyle images can have any background." },
      { question: "Will AI background removal look as good as Photoshop?", answer: "For 90% of product photos with clear edges and good lighting, yes — indistinguishable. AI struggles with fine details like hair, transparent objects, and very busy backgrounds. For those, manual masking is still better." },
      { question: "Is the AI background remover safe to use for confidential products?", answer: "Yes. The tool runs entirely in your browser using a local AI model. Your photos never upload to a server. Even for unreleased product prototypes, this is safe." },
      { question: "How do I get pure white instead of transparent?", answer: "Save the transparent PNG, then either: open it in any image editor over a white canvas and flatten, or use our Image to PDF tool which will place the photo over a white background by default." },
    ],
    related: ["resize-image-for-instagram", "compress-image-for-online-form", "watermark-image-for-shop"],
  },

  // ============ QR CODE USE CASES ============
  {
    slug: "qr-code-for-wifi-password",
    toolSlug: "qr-code-generator",
    title: "Generate WiFi QR Code So Guests Connect Instantly",
    description: "Make a WiFi QR code your guests can scan to auto-connect — no typing passwords. Free, instant, works on iPhone and Android cameras.",
    primaryQuery: "qr code for wifi password",
    relatedQueries: ["wifi qr code generator", "share wifi with qr code", "guest wifi qr code", "scan wifi password"],
    hook: "Stop reading out your WiFi password. Stick a QR code on the fridge — guests scan with their phone camera and auto-connect.",
    intro: "iPhones (iOS 11+) and Android phones (most modern versions) can connect to WiFi by scanning a QR code with the camera app. No app required, no password typing, no spelling 'X-er-zero-one-zero-zero' over the phone. The QR code encodes the network name, password, and security type — and it's safe to print because anyone in WiFi range could connect anyway.",
    steps: [
      { title: "Open the QR Code Generator", description: "Launch the tool below." },
      { title: "Switch to WiFi mode", description: "Pick the WiFi QR code type from the tool's options." },
      { title: "Enter your network details", description: "Type the network name (SSID) exactly as it appears on your router. Type the password. Pick WPA/WPA2 (almost always correct for modern routers)." },
      { title: "Download and print or share", description: "Save the QR as a PNG. Print and stick on the fridge, framed in the guest room, or include in your party invite. Anyone in range can scan and connect." },
    ],
    faq: [
      { question: "Is sharing my WiFi as a QR code safe?", answer: "About as safe as telling someone your password verbally. Anyone in WiFi range already has the same access. The QR code doesn't give remote access — they still need to be physically near your router. Don't print the QR code on the public internet, though." },
      { question: "Do I need an app to scan the WiFi QR code?", answer: "No. iPhone (iOS 11+) and modern Android phones detect WiFi QR codes natively through the camera app. Just open the camera, point at the QR, tap the popup." },
      { question: "Can I make a QR code for a hidden network?", answer: "Yes. In the tool, mark the network as 'hidden'. The QR code will include the hidden flag so phones know to manually add the network." },
      { question: "What if my password has special characters?", answer: "Special characters work fine. Just type them exactly. The QR encoding handles UTF-8 properly. Avoid leading/trailing spaces — those are easy to miss." },
    ],
    related: ["qr-code-for-restaurant-menu", "qr-code-for-business-card", "qr-code-for-event-rsvp"],
  },
  {
    slug: "qr-code-for-restaurant-menu",
    toolSlug: "qr-code-generator",
    title: "Generate QR Code for Restaurant Menu (PDF or Website)",
    description: "Create scannable QR codes that link to your menu PDF or online ordering page. Free, no signup, perfect for restaurants, bars, and cafes.",
    primaryQuery: "qr code for restaurant menu",
    relatedQueries: ["menu qr code", "digital menu qr code", "qr code for cafe menu", "scan menu qr code"],
    hook: "Print menus are expensive and dated the moment a price changes. A QR code to a digital menu costs nothing and updates instantly.",
    intro: "Since 2020, QR menus have become standard in restaurants worldwide. Customers scan with their camera, the menu opens in their browser — no app, no signup. Update prices or items on your menu PDF or website and the change is instant for every diner.",
    steps: [
      { title: "Host your menu somewhere", description: "Easiest: upload a PDF menu to Google Drive (set sharing to 'anyone with the link can view') and copy the share link. Or use a free menu site. Or your existing restaurant website." },
      { title: "Open the QR Code Generator", description: "Launch the tool." },
      { title: "Paste your menu link", description: "Drop the URL into the URL field. The tool generates a scannable QR instantly." },
      { title: "Download, print, and place", description: "Save as PNG or SVG. Print on table tents, stickers, or laminated cards. Test it with your phone before distributing." },
    ],
    faq: [
      { question: "Do customers need an app to scan the menu QR code?", answer: "No. iPhones and modern Android phones scan QR codes natively through the camera app. Customer points camera at QR, taps the link popup, menu opens. Zero friction." },
      { question: "Can I update the menu without reprinting the QR code?", answer: "Yes — if the QR code points to a URL (your website or a hosted PDF), update the content at that URL and every printed QR keeps working with the new content. This is the main advantage over printed menus." },
      { question: "How big should the printed QR code be?", answer: "Minimum 2x2 cm (about 1 inch) for reliable scanning from arm's length. For table tents, 3-4 cm is safer. Make sure there's white space around the code — busy backgrounds reduce scan reliability." },
      { question: "Should I use a PDF menu or a website?", answer: "A website loads faster on mobile and is easier to update. A PDF works on any device but downloads first, which adds friction. For most restaurants, a simple one-page website or even a Notion page outperforms PDF." },
    ],
    related: ["qr-code-for-wifi-password", "qr-code-for-business-card", "qr-code-for-event-rsvp"],
  },
  {
    slug: "qr-code-for-business-card",
    toolSlug: "qr-code-generator",
    title: "Generate QR Code for Business Card (vCard or Profile)",
    description: "Add a QR code to your business card that saves your contact info to anyone's phone instantly. Free vCard QR code generator — no signup.",
    primaryQuery: "qr code for business card",
    relatedQueries: ["vcard qr code", "contact info qr code", "business card qr code generator", "digital business card"],
    hook: "Paper business cards get lost. A QR on your card saves your full contact info to their phone in two taps.",
    intro: "A QR code on your business card encodes your name, phone, email, company, website, and address. The recipient scans, taps 'Add to contacts', and you're saved permanently in their phone. Way better than them typing a hand-written number that probably gets thrown out tomorrow.",
    steps: [
      { title: "Open the QR Code Generator", description: "Launch the tool below." },
      { title: "Switch to vCard mode", description: "Pick the vCard or contact QR type from the available options." },
      { title: "Fill in your details", description: "Name, phone, email, company, title, website. The more you include, the more useful the contact card." },
      { title: "Download and print", description: "Save as SVG for sharp printing at any size. Add to your business card design, ideally in a corner where it doesn't compete with your logo." },
    ],
    faq: [
      { question: "Will the QR code work on iPhone and Android?", answer: "Yes. Both platforms recognize vCard QR codes through their camera apps. The recipient sees a popup with your name and 'Add to Contacts' button." },
      { question: "What size should the QR code be on my business card?", answer: "Minimum 1.5x1.5 cm. Standard business cards are 8.5x5.5 cm, so a 2x2 cm QR fits comfortably without dominating. Always include white margin around the code." },
      { question: "Can I update my contact info after printing?", answer: "No — vCard QR codes encode the data directly into the QR pattern. If your info changes, you need a new QR (and ideally new cards). Alternative: encode a URL pointing to your contact page instead, then update the page when info changes." },
      { question: "Is vCard or LinkedIn URL better for a business card?", answer: "vCard saves directly to contacts (great for sales/networking). LinkedIn URL drives connection requests (great for personal branding). Some cards include both side-by-side." },
    ],
    related: ["qr-code-for-wifi-password", "qr-code-for-restaurant-menu", "qr-code-for-event-rsvp"],
  },
  {
    slug: "qr-code-for-event-rsvp",
    toolSlug: "qr-code-generator",
    title: "Generate QR Code for Event RSVP, Tickets, and Invitations",
    description: "Add scannable QR codes to wedding invites, party invitations, and event tickets. Link to RSVP forms, event details, or digital tickets. Free.",
    primaryQuery: "qr code for event rsvp",
    relatedQueries: ["wedding invite qr code", "event ticket qr code", "rsvp qr code generator", "invitation qr code"],
    hook: "Stop chasing RSVPs by phone. Stick a QR on the invitation linking to your RSVP form — guests scan, fill out, done.",
    intro: "Wedding planners, event organizers, and party hosts use QR codes to streamline RSVPs. The QR on the invite links to a Google Form, Typeform, or your event website. Guests tap, fill out, you get a spreadsheet. No 'did Aunt Sue confirm yet?' calls.",
    steps: [
      { title: "Set up your RSVP page or form", description: "Quickest: create a Google Form with the questions you need (name, attending yes/no, dietary requirements, plus-one). Or use Typeform, Partiful, or your event website." },
      { title: "Copy the form's public link", description: "Make sure it's set to 'anyone with the link can respond' — no login required, otherwise guests bail." },
      { title: "Open the QR Code Generator", description: "Launch the tool, paste the link." },
      { title: "Download and add to your invitation design", description: "Save as SVG for crisp printing at any size. Place on the invitation, ideally with text saying 'Scan to RSVP'. Test before printing the full batch." },
    ],
    faq: [
      { question: "What's the best RSVP form to link to?", answer: "For free: Google Forms is the most universal. Almost everyone has Google, the form is mobile-friendly, and you get an instant spreadsheet of responses. For polish: Typeform or Partiful look nicer but may require a paid tier for advanced features." },
      { question: "Will older guests be able to scan QR codes?", answer: "Most can — iPhones and Androids both handle it natively. For traditional invitations to mixed-age audiences, include both the QR and a printed URL as fallback." },
      { question: "Can I track who has RSVPed?", answer: "Yes — through your form's response dashboard. Google Forms gives a spreadsheet, Typeform a dashboard. You can't track via the QR code itself unless you use a tracked URL service." },
      { question: "How big should the QR code be on a wedding invitation?", answer: "Minimum 2x2 cm. For elegant invitations, place it on the back or a separate insert card so it doesn't disrupt the front design. Always add a small 'Scan to RSVP' label below it." },
    ],
    related: ["qr-code-for-business-card", "qr-code-for-restaurant-menu", "qr-code-for-wifi-password"],
  },

  // ============ PDF SPECIAL USE CASES ============
  {
    slug: "merge-pdf-for-resume-portfolio",
    toolSlug: "merge-pdf",
    title: "Merge PDF Resume and Cover Letter for Job Applications",
    description: "Combine your resume, cover letter, and portfolio into a single PDF for job applications. Free, fast, browser-only — applications stay private.",
    primaryQuery: "merge resume and cover letter pdf",
    relatedQueries: ["combine resume cover letter pdf", "merge pdf for job application", "single pdf for application", "join resume portfolio"],
    hook: "Most job portals only accept one PDF upload. Merge your resume, cover letter, and portfolio into a single file in under 30 seconds.",
    intro: "Applicant Tracking Systems (ATS) and job portals often allow only one document upload per application. Submitting three separate emails or files looks unprofessional and sometimes the cover letter just gets lost. Merging into a clean single PDF — cover letter first, resume second, portfolio third — is the professional standard.",
    steps: [
      { title: "Make sure each component is a clean PDF", description: "Cover letter, resume, and any portfolio pieces should each already be PDFs. If they're in Word, use our Word to PDF tool first." },
      { title: "Open the Merge PDF tool", description: "Launch the tool. Drag in all your files." },
      { title: "Order them correctly", description: "Drag the files into the right order: Cover Letter → Resume → Portfolio/References. Recruiters read top-down, so leading with the cover letter is standard." },
      { title: "Merge and download", description: "Click merge, save the combined PDF. Name it 'FirstName-LastName-Application.pdf' so recruiters can find it on their desk easily." },
    ],
    faq: [
      { question: "Should the cover letter come before or after the resume?", answer: "Cover letter first. The cover letter introduces you and motivates the recruiter to read the resume. Some applicants do resume-first; this is a minority preference and not recommended." },
      { question: "Will the merged PDF look the same as the originals?", answer: "Yes. Merging is just concatenation — no re-encoding or quality loss. Each page looks identical to its source PDF. Page numbers, formatting, fonts all preserved." },
      { question: "What if my files are different page sizes?", answer: "They stay different sizes in the merged PDF. Most applications don't care, but for a polished look, ensure all your documents are A4 (international) or Letter (US) before merging. Use our PDF Editor to standardize if needed." },
      { question: "Is there a file count limit for merging?", answer: "No hard limit — the tool runs in your browser, so the practical limit is your device's memory. 10-20 files merge easily even on phones. Hundreds work fine on desktops." },
    ],
    related: ["convert-pdf-to-word-for-resume", "compress-pdf-for-email-attachment", "split-large-pdf-into-parts"],
  },
  {
    slug: "convert-pdf-to-word-for-resume",
    toolSlug: "pdf-to-word",
    title: "Convert PDF Resume to Word for Editing and Updates",
    description: "Got your resume as a PDF but need to update it? Convert PDF to editable Word document instantly. Free, runs in browser, fonts and formatting preserved.",
    primaryQuery: "convert pdf resume to word",
    relatedQueries: ["edit pdf resume", "pdf resume to docx", "make pdf resume editable", "update resume in pdf"],
    hook: "Job changed, need to update your resume, but only have the PDF version? Convert back to Word in 10 seconds and keep your formatting.",
    intro: "It's common to lose your editable Word resume and only have the PDF copy you sent out years ago. Converting back to Word lets you update job titles, skills, and dates without rebuilding from scratch. Browser-based conversion keeps your resume private — no upload to anyone's server.",
    steps: [
      { title: "Open the PDF to Word tool", description: "Launch the converter below. No signup or installation." },
      { title: "Upload your PDF resume", description: "Drop the PDF in. Everything processes locally in your browser." },
      { title: "Download the .docx file", description: "Save the converted Word document. Open in Microsoft Word, Google Docs, or LibreOffice." },
      { title: "Edit and re-export to PDF", description: "Make your updates, then save as PDF again using our Word to PDF tool. You'll have a clean updated PDF ready to send." },
    ],
    faq: [
      { question: "Will the converted Word file look exactly like my PDF?", answer: "Text, fonts, and basic formatting transfer accurately. Complex layouts with multiple columns or custom graphics may shift slightly. For most resumes (single column, standard fonts), the result is near-perfect." },
      { question: "Will my custom fonts be preserved?", answer: "Standard fonts (Arial, Calibri, Times New Roman, Georgia) preserve perfectly. Designer fonts may fall back to similar system fonts. Verify after conversion and re-apply your preferred font if needed." },
      { question: "Is this safe for sensitive resume content?", answer: "Yes — the conversion runs entirely in your browser. Your resume content (which often includes phone, email, address, employer details) never leaves your device." },
      { question: "What if my PDF was scanned, not text-based?", answer: "Use our Image to Text tool first to OCR the scan into selectable text. Then convert that to Word. For most modern PDFs (exported from Word or Google Docs originally), this isn't needed — text is already selectable." },
    ],
    related: ["merge-pdf-for-resume-portfolio", "compress-pdf-for-email-attachment", "build-ats-friendly-resume"],
  },
  {
    slug: "split-large-pdf-into-parts",
    toolSlug: "pdf-splitter",
    title: "Split Large PDF Into Smaller Parts for Email or Upload",
    description: "Break a huge PDF into smaller pieces — by page count, by file size, or one page each. Free, runs in browser, your document stays private.",
    primaryQuery: "split pdf into smaller parts",
    relatedQueries: ["split large pdf", "break pdf into pages", "divide pdf file", "split pdf for email"],
    hook: "Got a 200MB PDF that won't email? Split it into 5 manageable files in seconds.",
    intro: "Email caps, upload limits, and printing logistics all push you to split large PDFs. Maybe you need to email a 200-page document in three parts. Maybe a portal only accepts one page per upload. Maybe you're printing and want to test page 1 first. Browser-based splitting handles all these.",
    steps: [
      { title: "Open the PDF Splitter", description: "Launch the tool. Drop in your large PDF." },
      { title: "Pick a split mode", description: "Common options: every N pages (e.g. every 50), specific page ranges (e.g. 1-25, 26-50), or one file per page." },
      { title: "Generate the split files", description: "The tool creates multiple PDFs based on your settings. Each one is a fully valid standalone PDF." },
      { title: "Download all parts", description: "Save each split file. Name them clearly — 'Document-Part1', 'Document-Part2' — so the recipient knows the order." },
    ],
    faq: [
      { question: "Will splitting reduce quality or strip content?", answer: "No. Splitting is just extracting page ranges into separate PDFs. Each split PDF retains identical quality, fonts, embedded images, and metadata from the original. No re-encoding happens." },
      { question: "What's the best split size for emailing?", answer: "Aim for parts under 25MB each — that fits Gmail and Outlook limits. If each split is still too big, combine splitting with our PDF Compressor on each part." },
      { question: "Can I split a password-protected PDF?", answer: "Use our PDF Unlocker first to remove the password, then split. Most splitters (including this one) can't read encrypted PDFs directly." },
      { question: "Will the recipient see them as one document or separate?", answer: "Separate. Each split is a standalone PDF. If they need them as one document on their end, send the parts in order and they can use our Merge PDF tool to recombine — or you can re-merge before sending if size allows." },
    ],
    related: ["merge-pdf-for-resume-portfolio", "compress-pdf-for-email-attachment", "compress-pdf-for-whatsapp"],
  },

  // ============ VIDEO/AUDIO USE CASES ============
  {
    slug: "compress-video-for-whatsapp",
    toolSlug: "video-compressor",
    title: "Compress Video for WhatsApp (Under 16MB or 100MB)",
    description: "Shrink videos to send on WhatsApp without errors. Free browser-based compression for the 16MB photo-tab limit or 100MB document limit.",
    primaryQuery: "compress video for whatsapp",
    relatedQueries: ["whatsapp video size limit", "send big video whatsapp", "reduce video size for whatsapp", "whatsapp video too large"],
    hook: "WhatsApp blocks videos over 16MB in the chat tab. Compress first, send seconds later.",
    intro: "WhatsApp caps video sharing at 16MB when sent as a regular video and 100MB when sent as a document. Most modern phone videos blow past 16MB in 30 seconds. Browser compression solves it without uploading personal video to random websites.",
    steps: [
      { title: "Decide your target", description: "For sending in the chat tab: under 16MB. For sending as a document: under 100MB. Documents preserve quality better but are less convenient to open." },
      { title: "Open the Video Compressor", description: "Launch the tool. Drop in your video file." },
      { title: "Pick a compression preset", description: "For 16MB target: high compression, lower resolution (720p). For 100MB target: medium compression, 1080p stays viable." },
      { title: "Download and share", description: "Save the compressed file. Send via WhatsApp — chat tab for 16MB version, document for the larger version." },
    ],
    faq: [
      { question: "Why is WhatsApp's video limit so small?", answer: "WhatsApp prioritizes bandwidth efficiency for users on slow connections. Smaller videos load faster on weak networks. The 16MB chat limit hasn't changed in years despite phones recording much higher-quality video now." },
      { question: "What's the difference between sending as video vs. document?", answer: "Video: shows inline in the chat, plays with one tap, capped at 16MB, quality re-compressed. Document: shows as a file attachment, downloads first, capped at 100MB, original quality preserved." },
      { question: "Will compression destroy the video quality?", answer: "Some quality is lost — that's the trade-off. For casual chat videos, 720p at medium compression is usually invisible loss. For HD videos with fast motion, you'll see softness. Match preset to importance." },
      { question: "How long can a WhatsApp video be?", answer: "Time-wise: no hard duration limit, only size. A 30-second video might be 50MB; a 2-minute video might be 200MB. Duration depends entirely on resolution and bitrate, which compression controls." },
    ],
    related: ["compress-image-for-whatsapp", "compress-pdf-for-whatsapp", "convert-video-to-gif"],
  },

  // ============ TEXT/PRODUCTIVITY USE CASES ============
  {
    slug: "watermark-image-for-shop",
    toolSlug: "watermark-image",
    title: "Watermark Images for Etsy, eBay, and Online Shops",
    description: "Protect your product photos from being stolen. Add subtle watermarks to images before listing on Etsy, eBay, or your own store. Free, in browser.",
    primaryQuery: "watermark image for online shop",
    relatedQueries: ["watermark product photos", "protect images from theft", "watermark for etsy", "stop image stealing"],
    hook: "Your competitors will steal your product photos. A subtle watermark makes them think twice and helps customers trace stolen listings back to you.",
    intro: "Etsy, eBay, and Amazon sellers face constant image theft — competitors copy product photos and use them in their own listings. A subtle watermark in a corner of each image deters most thieves and provides clear evidence when theft happens. Watermarking should be visible but not distracting from the product.",
    steps: [
      { title: "Choose your watermark text", description: "Your shop name, brand handle, or domain. Keep it short (8-15 characters). 'Yourshop.etsy.com' or '@yourbrand' works well." },
      { title: "Open the Watermark Image tool", description: "Launch the tool." },
      { title: "Position and style the watermark", description: "Bottom-right or center-bottom is standard. Use white text with 40-60% opacity over photos, or dark text on light backgrounds. Smaller font (12-18px) looks subtle and pro." },
      { title: "Apply and download", description: "Save the watermarked image. Repeat for each product photo before uploading to your shop." },
    ],
    faq: [
      { question: "Will a watermark hurt my conversion rate?", answer: "Subtle watermarks have negligible impact on conversion. Heavy watermarks across the product image hurt — keep it small, in a corner, at moderate opacity. Customers expect to see them on premium product photography." },
      { question: "Can a determined thief still steal a watermarked photo?", answer: "Yes — with effort. AI tools can sometimes erase watermarks. But for the casual 'right-click save' thieves, even a basic watermark stops 90% of theft. It's like a bike lock: keeps honest people honest." },
      { question: "Should I watermark with my full URL or just brand name?", answer: "Brand name only for visual appeal. Save the URL/handle for the actual marketplace description. The watermark's job is brand recognition and theft deterrence, not driving traffic." },
      { question: "What format works best for watermarked images?", answer: "JPG for product photos. PNG only if you need transparency in the image itself. Saving watermarked PNGs as JPGs reduces file size significantly without quality loss for typical product photography." },
    ],
    related: ["remove-background-from-product-photo", "resize-image-for-instagram", "compress-image-for-instagram"],
  },
  {
    slug: "remove-exif-data-before-posting",
    toolSlug: "exif-remover",
    title: "Remove EXIF Data Before Posting Photos Online",
    description: "Strip GPS location, camera details, and timestamps from photos before sharing. Free, runs in browser — your photos and metadata stay private.",
    primaryQuery: "remove exif data from photo",
    relatedQueries: ["strip metadata from image", "remove gps from photo", "photo location data privacy", "exif remover online"],
    hook: "Every photo from your phone contains GPS coordinates of where you took it. Strip that before posting anywhere public.",
    intro: "EXIF metadata is hidden data embedded in every photo: GPS coordinates, exact time taken, camera model, settings, sometimes even the device serial number. Most social platforms strip this automatically, but blogs, forums, marketplaces, and direct file uploads don't. Stripping EXIF before sharing protects your privacy.",
    steps: [
      { title: "Open the EXIF Remover", description: "Launch the tool. It handles JPG, PNG, and HEIC photos." },
      { title: "Drop in your photo", description: "The tool reads the EXIF data and shows you what's currently embedded — GPS, timestamp, camera info." },
      { title: "Strip the metadata", description: "One click removes everything. The photo content stays identical, but all metadata is wiped." },
      { title: "Download the clean version", description: "Save the stripped photo. Now safe to post anywhere — no one can geo-locate where it was taken." },
    ],
    faq: [
      { question: "What does EXIF data actually reveal?", answer: "Most importantly: exact GPS coordinates (latitude, longitude, altitude). Also: timestamp to the second, camera/phone model, lens, ISO/aperture/shutter, software used to edit, sometimes Apple/Google device identifier." },
      { question: "Don't social media platforms strip EXIF automatically?", answer: "Facebook, Instagram, Twitter, LinkedIn all strip EXIF on upload. But blogs (WordPress, Medium), marketplaces (Craigslist, Facebook Marketplace direct messages), email attachments, and forum uploads usually preserve it. Strip before sending anywhere." },
      { question: "Will removing EXIF change how my photo looks?", answer: "No. EXIF is invisible metadata — the visible photo content is untouched. The file size drops slightly because the metadata is gone, but pixels remain identical." },
      { question: "How can I see what EXIF a photo has?", answer: "Use our Image Metadata Viewer to inspect any photo's EXIF before stripping. Useful to see exactly what you're about to remove — sometimes there's surprising information embedded." },
    ],
    related: ["compress-image-for-online-form", "watermark-image-for-shop", "blur-faces-in-photo"],
  },
  {
    slug: "blur-faces-in-photo",
    toolSlug: "image-blur",
    title: "Blur Faces in Photos Before Posting on Social Media",
    description: "Hide faces, license plates, and sensitive details in photos before sharing online. Free, browser-based blur — your originals stay private.",
    primaryQuery: "blur faces in photo",
    relatedQueries: ["hide face in photo", "blur license plate", "anonymize photo", "censor photo online"],
    hook: "Posting a group photo but want to protect privacy? Blur faces selectively in your browser, no software install.",
    intro: "Blurring sensitive areas — faces of minors, license plates, address numbers, document content — is essential before posting photos publicly. Many situations need partial blurring rather than the whole photo: photographers' portfolios, real estate listings, news posts, social media etiquette.",
    steps: [
      { title: "Open the Image Blur tool", description: "Launch the tool." },
      { title: "Upload your photo", description: "Drop the photo in. The tool loads it for editing." },
      { title: "Select the area to blur", description: "Drag a rectangle or use the brush over the face, plate, address, or sensitive area. Adjust blur intensity — heavier for privacy, lighter for artistic effect." },
      { title: "Save the modified photo", description: "Download. The original stays untouched on your device; you get a new file with the blurred areas." },
    ],
    faq: [
      { question: "Is blurring enough to protect identity?", answer: "Heavy blur (more than 20 pixel radius) is effectively irreversible. Light blur or pixelation can sometimes be reversed by AI tools — use heavy Gaussian blur or solid black boxes for serious privacy needs." },
      { question: "Can someone un-blur the photo later?", answer: "If the blur was light, AI tools might recover some detail. If the blur was heavy (full Gaussian, large radius), the original pixel data is destroyed and unrecoverable. For maximum certainty, use solid black boxes over sensitive areas." },
      { question: "Should I blur kids' faces in public photos?", answer: "It's standard practice for anything posted publicly without explicit parental consent. Many parents prefer their children's faces not appear on the public internet — blurring is the polite default." },
      { question: "What about license plates in driveway photos?", answer: "Blur them, especially for real estate listings or any post that shows the home address. License plates plus address makes the property identifiable to anyone with database access." },
    ],
    related: ["remove-exif-data-before-posting", "watermark-image-for-shop", "compress-image-for-online-form"],
  },

  // ============ DEVELOPER USE CASES ============
  {
    slug: "format-minified-json-for-debugging",
    toolSlug: "json-formatter",
    title: "Format Minified JSON for Reading and Debugging API Responses",
    description: "Paste any minified or messy JSON and get clean, indented, syntax-highlighted output. Free, in-browser, perfect for debugging API responses.",
    primaryQuery: "format minified json",
    relatedQueries: ["beautify json", "json pretty print", "fix unreadable json", "json formatter for api"],
    hook: "Server returned a 50-line JSON blob on one line? Paste it in, get clean indented output you can actually read.",
    intro: "Minified JSON saves bytes in production but is unreadable when debugging. API responses, log entries, webhook payloads — they all come back as one giant line. A browser-based formatter parses, validates, and indents so you can find the bug.",
    steps: [
      { title: "Copy the minified JSON", description: "From your terminal, log file, browser DevTools network tab, or API response — copy the whole JSON string." },
      { title: "Open the JSON Formatter", description: "Launch the tool below." },
      { title: "Paste and format", description: "Drop the JSON in. The tool indents, color-codes, and validates. If there's a syntax error, the tool highlights the exact location." },
      { title: "Copy the formatted output", description: "Click to copy the cleaned version. Paste back into your code, docs, or wherever you need it readable." },
    ],
    faq: [
      { question: "Will the formatter fix invalid JSON?", answer: "It identifies the exact location of syntax errors but doesn't auto-fix them — that's intentional. Auto-fixing would mask real bugs in your data. Use the error message to find and fix the source." },
      { question: "Is my JSON data sent to a server?", answer: "No. The formatter runs entirely in your browser using native JavaScript JSON parsing. Even sensitive API responses (auth tokens, user data) never leave your device." },
      { question: "How do I format JSON in command line vs. browser?", answer: "Command line: python -m json.tool or jq. Browser is faster for one-off debugging — paste, see result, move on. CLI better for automation and pipelines." },
      { question: "What's the largest JSON file the formatter handles?", answer: "Limited by your browser's memory. In practice, anything under 50MB formats instantly. Very large files (100MB+) may freeze the tab — for those, use a command-line tool like jq." },
    ],
    related: ["convert-csv-to-json", "format-jwt-token", "decode-base64-string"],
  },
  {
    slug: "convert-csv-to-json",
    toolSlug: "csv-to-json",
    title: "Convert CSV to JSON for API Integration",
    description: "Transform CSV files into clean JSON arrays for APIs, MongoDB, or JavaScript apps. Free, runs in browser — your data stays private.",
    primaryQuery: "convert csv to json",
    relatedQueries: ["csv to json online", "csv to json array", "spreadsheet to json", "excel to json api"],
    hook: "Got CSV exported from Excel but your app needs JSON? Convert in seconds, no signup, no upload.",
    intro: "CSV is the universal spreadsheet format, but modern APIs and databases want JSON. Converting between them is a daily task for developers, data analysts, and anyone moving data between systems. Browser-based conversion keeps your data (often sensitive customer lists or business records) off third-party servers.",
    steps: [
      { title: "Open the CSV to JSON tool", description: "Launch the converter." },
      { title: "Upload your CSV or paste the data", description: "The tool reads CSV with headers automatically. It detects delimiters (comma, semicolon, tab) and quoted strings." },
      { title: "Pick your output format", description: "Array of objects (standard for most APIs) or array of arrays (more compact). Most APIs want objects keyed by your CSV's header row." },
      { title: "Copy or download the JSON", description: "Paste into your code, your API request body, or your database import tool. The output is ready for production." },
    ],
    faq: [
      { question: "What if my CSV has weird delimiters or escapes?", answer: "The tool auto-detects common delimiters (comma, semicolon, tab, pipe) and handles standard CSV escaping (quotes around strings, doubled quotes for embedded quotes). For very non-standard files, you may need to clean them first." },
      { question: "Will it preserve data types like numbers and booleans?", answer: "By default, all values are strings (matching CSV's nature). The tool offers an option to auto-detect numbers and booleans and convert them. Use that for cleaner JSON, skip it if your data has values like 0123 (zip codes) that should stay strings." },
      { question: "Can I convert JSON back to CSV later?", answer: "Yes — use our JSON to CSV tool. Round-trip conversion (CSV to JSON to CSV) preserves data accurately for well-structured inputs." },
      { question: "Is this safe for customer data lists?", answer: "Yes. The conversion runs entirely in your browser — no upload, no server processing. CSVs containing PII (emails, phone numbers, addresses) stay local. For very sensitive data, also clear browser cache after." },
    ],
    related: ["format-minified-json-for-debugging", "format-jwt-token", "generate-strong-password-for-banking"],
  },
  {
    slug: "generate-strong-password-for-banking",
    toolSlug: "password-generator",
    title: "Generate Strong Password for Banking and Sensitive Accounts",
    description: "Create unguessable passwords for banking, email, and crypto accounts. Free generator that runs in browser — passwords never sent anywhere.",
    primaryQuery: "strong password for banking",
    relatedQueries: ["secure password generator", "bank password generator", "uncrackable password", "long password generator"],
    hook: "Bank accounts and email are your weakest link. A 20+ character random password with mixed types is the fix — and you should not generate it on a site that logs.",
    intro: "Reused or weak passwords on banking, primary email, and crypto accounts are the most common path to identity theft. A unique, long, random password per account — stored in a password manager — solves it. The generation must happen in your browser, not on a server, so the password is never logged or transmitted before you save it.",
    steps: [
      { title: "Open the Password Generator", description: "Launch the tool below." },
      { title: "Set length to 20 characters minimum", description: "For banking and primary email: 20-30 characters. For everything else: 16+ is fine. Longer is exponentially harder to crack." },
      { title: "Enable all character types", description: "Uppercase, lowercase, numbers, and special characters. Disable any that the site doesn't accept (some old banks reject special characters)." },
      { title: "Generate and save to password manager", description: "Generate, copy, paste directly into your password manager (Bitwarden, 1Password, etc.) or the new password field on the site. Never store in plain text or screenshots." },
    ],
    faq: [
      { question: "How long should a banking password be?", answer: "20+ characters minimum. With mixed case, numbers, and symbols, this is computationally infeasible to crack even with massive resources. Going to 30+ adds redundant security with no real-world benefit." },
      { question: "Is this generator safe to use?", answer: "Yes. The generator runs entirely in your browser using cryptographic randomness. The password is generated client-side and never sent anywhere. Even refreshing the page deletes the password from memory." },
      { question: "Should I memorize a strong password?", answer: "No. Use a password manager. Memorizing one 20-character random password is hard; memorizing 50 of them across all your accounts is impossible. Password managers eliminate the trade-off." },
      { question: "Can I use the same strong password for multiple accounts?", answer: "Never. If any single site is breached and stores passwords poorly, attackers will try the same password on every major service. Unique passwords per account is the only safe practice." },
    ],
    related: ["convert-csv-to-json", "format-minified-json-for-debugging", "remove-exif-data-before-posting"],
  },
  // ============ AUDIO USE CASES (Phase 2B — data-driven from Search Console) ============
  {
    slug: "convert-audio-to-mp3-online",
    toolSlug: "mp3-converter",
    title: "Convert Audio to MP3 Online — Free, Any Format, No Signup",
    description: "Convert WAV, OGG, FLAC, AAC, M4A, or any audio format to MP3 online. Free, no signup, no quality loss. Adjust bitrate. Works on phone and desktop.",
    primaryQuery: "audio to mp3 converter online free",
    relatedQueries: ["convert audio to mp3", "audio file to mp3", "any audio to mp3", "audio converter mp3 free", "mp3 converter online free no signup"],
    hook: "Got a voice memo, recording, or audio file in the wrong format? Convert anything to MP3 in your browser — no uploads, no signup, no quality loss.",
    intro: "MP3 is still the universal audio format — works on every device, plays in every app, fits in every email. The problem: most online converters force signup, watermark your audio, or upload your files to mystery servers. Browser-based conversion solves all three: no account, no marketing, no upload. The conversion happens locally on your device.",
    steps: [
      { title: "Open the MP3 Converter", description: "Click the button below. No installation, no signup, no nag screens." },
      { title: "Drop your audio file in", description: "Drag and drop, or click to select. Supports WAV, OGG, FLAC, AAC, M4A, WebM, and most other audio formats. Files stay on your device." },
      { title: "Pick your quality (bitrate)", description: "192kbps is the standard for most use cases — small file, near-CD quality. 128kbps for voice/podcasts (smaller file). 320kbps for music if you need the absolute best quality." },
      { title: "Download the MP3", description: "Conversion takes 5-30 seconds depending on file size. Click download. Your MP3 is ready to share, upload, or play anywhere." },
    ],
    faq: [
      { question: "Is this MP3 converter actually free?", answer: "Yes — completely. No signup, no daily limits, no watermarks, no Pro tier. The reason most other converters charge is they pay for server processing. This one converts in your browser, so there's no server cost to recoup." },
      { question: "Which audio formats can I convert to MP3?", answer: "Most common formats work: WAV, OGG, FLAC, AAC, M4A, WebM, AIFF, and others. The tool auto-detects the input format. If you have something exotic, try it — modern browsers handle more than you'd think." },
      { question: "What bitrate should I choose?", answer: "For music: 192 or 256 kbps strikes the best size/quality balance. 320 kbps is overkill for most ears. For voice (podcast, audiobook, voice memo): 96 or 128 kbps is enough — keeps the file small without losing intelligibility." },
      { question: "Will my audio quality drop?", answer: "Some yes — MP3 is a lossy format, so any conversion from a higher-quality source (like WAV or FLAC) will lose a small amount of fidelity. At 192kbps+, most listeners cannot tell the difference. At 320kbps, even audio professionals usually can't on consumer speakers." },
    ],
    related: ["convert-mp3-to-wav", "extract-audio-from-video-to-mp3", "compress-audio-for-podcast"],
  },
  {
    slug: "convert-wav-to-mp3",
    toolSlug: "mp3-converter",
    title: "Convert WAV to MP3 Online — Reduce File Size 90% Without Quality Loss",
    description: "WAV files are huge — convert to MP3 and shrink to a tenth the size. Free online WAV to MP3 converter, no signup, no watermark, runs in your browser.",
    primaryQuery: "convert wav to mp3",
    relatedQueries: ["wav to mp3 converter", "wav to mp3 free", "change wav to mp3", "convert wav file to mp3 online", "wav to mp3 no signup"],
    hook: "WAV files are 10× larger than the same audio in MP3. Convert and shrink dramatically — without any audible quality loss at 192kbps+.",
    intro: "WAV is uncompressed audio — perfect for editing, terrible for sharing. A 5-minute song in WAV is around 50MB. The same song in MP3 at high quality is 5-7MB. For sharing, emailing, uploading, or storing music libraries, MP3 wins by an order of magnitude. Browser-based conversion is the fastest way to make the switch.",
    steps: [
      { title: "Open the MP3 Converter", description: "Launch the tool. It accepts WAV input and outputs MP3." },
      { title: "Drop your WAV file in", description: "Drag and drop. The tool reads the WAV file locally — nothing uploads anywhere." },
      { title: "Choose MP3 quality (192-320 kbps recommended)", description: "192kbps is virtually indistinguishable from WAV for most listeners and produces ~1MB per minute of audio. 320kbps is the maximum MP3 quality — use this for anything that needs to sound pristine." },
      { title: "Download the MP3", description: "Conversion is quick — usually under 10 seconds even for long files. Your new MP3 is up to 90% smaller than the original WAV." },
    ],
    faq: [
      { question: "How much smaller will my MP3 be?", answer: "Typically 85-95% smaller. A 50MB WAV becomes a 5-7MB MP3 at 192kbps. A 100MB WAV becomes about 10-14MB. The exact ratio depends on the audio content — silence and simple tones compress more than complex music." },
      { question: "Will the conversion damage the audio?", answer: "At 192kbps or higher, the difference is inaudible to most listeners on most equipment. At 128kbps and below, you may notice slight compression artifacts in high-frequency sounds (cymbals, sibilance). For voice/podcasts, even 96kbps sounds fine." },
      { question: "Should I keep the WAV original?", answer: "If you'll edit it later — yes, keep the WAV. WAV is lossless, so you can re-encode to any other format without quality loss. MP3-to-anything always sounds worse than WAV-to-anything. For archival, keep WAV; for sharing, use MP3." },
      { question: "Can I batch convert multiple WAVs?", answer: "Drop multiple files at once if your browser supports it. Conversion happens sequentially — for 10+ files you'll see noticeable processing time, but everything stays local on your device with no upload bandwidth used." },
    ],
    related: ["convert-audio-to-mp3-online", "convert-mp3-to-wav", "extract-audio-from-video-to-mp3"],
  },
  {
    slug: "convert-mp3-to-wav",
    toolSlug: "wav-converter",
    title: "Convert MP3 to WAV Online — Free, Higher Quality, No Signup",
    description: "Convert MP3 to WAV for editing, mastering, or audio production. Free online MP3 to WAV converter — no signup, no watermark, no file upload.",
    primaryQuery: "convert mp3 to wav",
    relatedQueries: ["mp3 to wav converter", "mp3 to wav free", "change mp3 to wav", "wav converter online free", "convert to wav file"],
    hook: "Need WAV for audio editing, mastering, or pro software? Convert MP3 to WAV in your browser — no upload, no signup, no watermark.",
    intro: "Audio software like Audacity, Pro Tools, FL Studio, and Logic Pro work best with uncompressed WAV files. Converting your MP3 source files to WAV before editing means cleaner edits, accurate waveform visualization, and no re-encoding artifacts when you export. The conversion can't restore quality MP3 already lost, but it gives editing software the format it expects.",
    steps: [
      { title: "Open the WAV Converter", description: "Click below to launch the tool. No signup needed." },
      { title: "Drop your MP3 file in", description: "Drag and drop, or click to browse. The tool reads the MP3 locally in your browser." },
      { title: "Convert to WAV", description: "WAV is uncompressed, so settings are minimal — just sample rate (44.1 kHz is standard for music, 48 kHz for video work) and bit depth (16-bit standard, 24-bit for pro audio)." },
      { title: "Download the WAV file", description: "The output file will be ~10× larger than the MP3 source — that's normal. WAV stores audio uncompressed for editing-ready quality." },
    ],
    faq: [
      { question: "Will converting MP3 to WAV improve the audio quality?", answer: "No — and this is the most common misconception. MP3 already removed audio data during its original compression; converting to WAV just stores that already-degraded audio uncompressed. The WAV file will be bigger but the quality is unchanged from the source MP3." },
      { question: "Why convert MP3 to WAV at all then?", answer: "For audio software compatibility. DAWs (digital audio workstations) like Pro Tools and Logic prefer WAV for editing. CD burners need WAV or AIFF. Some podcast platforms require WAV uploads. The format conversion is about workflow, not quality improvement." },
      { question: "What sample rate and bit depth should I pick?", answer: "44.1 kHz / 16-bit matches CD quality — the standard for music. 48 kHz / 16-bit is the standard for video and broadcast. 96 kHz / 24-bit is overkill unless you're doing high-end mastering. Match the project you're importing into." },
      { question: "Is the conversion lossless?", answer: "From MP3 to WAV: yes, the conversion preserves all the audio data the MP3 contains. But remember — the MP3 was already lossy. So the final WAV is lossless relative to the MP3, but not relative to the original recording before MP3 encoding." },
    ],
    related: ["convert-audio-to-mp3-online", "convert-wav-to-mp3", "extract-audio-from-video-to-mp3"],
  },
  {
    slug: "extract-audio-from-video-to-mp3",
    toolSlug: "mp4-to-mp3",
    title: "Extract Audio From Video to MP3 — Free, Fast, No Signup",
    description: "Extract audio from MP4, MOV, WebM, or any video to MP3. Save lecture audio, podcast audio, music from videos. Free online extractor — no signup, no watermark.",
    primaryQuery: "extract audio from video to mp3",
    relatedQueries: ["video to mp3", "mp4 to mp3", "save audio from video", "rip audio from video online", "video audio extractor free"],
    hook: "Got a lecture recording, podcast, or music video but want just the audio? Extract to MP3 in your browser — no upload, no signup, no watermark.",
    intro: "Audio extraction is one of the most-searched conversion tasks. Reasons vary: saving lecture recordings to listen on commute, ripping podcast audio from YouTube interviews, pulling music from concert footage, archiving voice notes from video calls. Browser-based extraction keeps your videos (which often contain private content) entirely on your device.",
    steps: [
      { title: "Open the MP4 to MP3 tool", description: "Click below to launch. Works with MP4, MOV, WebM, AVI, and most other video formats." },
      { title: "Drop your video in", description: "Drag and drop, or click to browse. The tool reads the video locally — your file never uploads anywhere. Bigger videos may take a few seconds to load." },
      { title: "Choose audio quality", description: "192kbps is a great balance — clean audio without a huge file. 128kbps is fine for spoken content (lectures, podcasts). 320kbps for music if you want maximum quality." },
      { title: "Download the MP3", description: "Extraction usually takes 10-30 seconds depending on video length. You get a clean MP3 file with just the audio — no video, no metadata you didn't ask for." },
    ],
    faq: [
      { question: "Can I extract audio from any video format?", answer: "Most common formats yes — MP4, MOV, WebM, AVI, MKV, FLV. The tool auto-detects the format. If a specific file doesn't work, it's usually because it uses an exotic codec; converting it to MP4 first with a video converter will fix this." },
      { question: "Will the extraction lose audio quality?", answer: "Minimal loss. The audio inside videos is already compressed (usually AAC or MP3). Extracting and re-encoding to MP3 at 192kbps+ preserves the audio quality as well as possible. Pick a higher bitrate for music, lower for voice." },
      { question: "Is this legal?", answer: "Depends on the source. Your own recordings, public domain content, and Creative Commons content — fully legal. Copyrighted videos (e.g. ripping a song from someone else's YouTube video for commercial use) — that's copyright infringement. Personal use is a gray area; consult your local laws." },
      { question: "How long can the video be?", answer: "Limited by your device's memory. Most modern phones and laptops can handle videos up to several hours. For very long videos (3+ hours), you may want to split the video first to avoid running out of memory." },
    ],
    related: ["convert-audio-to-mp3-online", "convert-wav-to-mp3", "compress-video-for-whatsapp"],
  },
  {
    slug: "compress-audio-for-podcast",
    toolSlug: "mp3-converter",
    title: "Compress Audio for Podcast Upload — Hit Spotify, Apple Podcasts Limits",
    description: "Compress podcast audio for upload to Spotify, Apple Podcasts, or RSS feeds. Right bitrate for spoken content. Free online MP3 compressor — no signup needed.",
    primaryQuery: "compress audio for podcast",
    relatedQueries: ["podcast audio compression", "best bitrate for podcast", "compress mp3 for upload", "audio file size for podcast"],
    hook: "Podcast platforms have specific bitrate sweet spots. Hit them and your show sounds clean and uploads fast. Miss them and you waste listener bandwidth or sound muddy.",
    intro: "Spotify, Apple Podcasts, and most RSS-based podcast distributors recommend 96-128 kbps mono or 128-160 kbps stereo for spoken-word content. Going higher wastes listener bandwidth (especially on mobile) and increases upload size. Going lower introduces audible compression artifacts in voice. This guide hits the sweet spot.",
    steps: [
      { title: "Decide mono or stereo", description: "Pure spoken-word: mono is plenty (smaller file, no quality difference). Music + voice or stereo sound design: stereo. Most solo and interview podcasts work great in mono." },
      { title: "Open the MP3 Converter", description: "Launch the tool. Drop your master audio file in (usually a WAV or AIFF from your editing software)." },
      { title: "Pick 96-128 kbps mono OR 128-160 kbps stereo", description: "These are the platform sweet spots. 96kbps mono is roughly 700KB per minute — a 30-minute episode is ~21MB. Plenty for the audio quality podcast listeners expect." },
      { title: "Export and upload", description: "Save the compressed MP3. Upload to your podcast host (Buzzsprout, Anchor, Libsyn, etc.). The host re-encodes anyway, so optimizing your upload helps them and saves your upload time." },
    ],
    faq: [
      { question: "What bitrate does Spotify recommend for podcasts?", answer: "Spotify accepts MP3 files between 96 and 320 kbps. They recommend 96-128 kbps mono or 128-160 kbps stereo for spoken-word content. Higher bitrates don't improve the listening experience for podcasts noticeably." },
      { question: "Should I record in MP3 or convert later?", answer: "Always record and edit in WAV (lossless). Convert to MP3 only as the final step. Editing MP3 directly causes generation loss — every edit and re-export degrades quality slightly." },
      { question: "Why mono for podcasts?", answer: "Voice doesn't have left/right separation — a single human speaker is essentially a mono source. Storing it as stereo doubles the file size with zero quality benefit. Most podcast players still play mono correctly through both ears." },
      { question: "Will lower bitrate make me sound bad?", answer: "At 96 kbps mono, voice sounds clean to virtually everyone. Below 64 kbps you start hearing audible artifacts. Above 192 kbps you're storing data nobody can hear and wasting listener bandwidth. Stay in the 96-160 range for podcasts." },
    ],
    related: ["convert-audio-to-mp3-online", "convert-wav-to-mp3", "extract-audio-from-video-to-mp3"],
  },

];

/** Lookup map for fast retrieval by slug. */
export const useCaseMap: Record<string, UseCase> = Object.fromEntries(
  useCases.map((uc) => [uc.slug, uc])
);

export function getUseCase(slug: string): UseCase | undefined {
  return useCaseMap[slug];
}
