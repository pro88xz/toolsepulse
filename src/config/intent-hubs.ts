/**
 * Intent hub landing pages.
 *
 * Each hub aggregates existing tools and use-cases under a unifying user intent.
 * Intents map to high-volume long-tail queries that no single tool page captures
 * on its own — "best free pdf tools no signup", "tools for students", etc.
 */

export interface IntentHub {
  /** URL slug at /hubs/{slug} */
  slug: string;
  /** SEO title — H1 reuses this stripped of suffix */
  title: string;
  /** SEO description (~155 chars) */
  description: string;
  /** Punchy 1-2 sentence value prop at top of page */
  hook: string;
  /** Lead paragraph below the hook */
  intro: string;
  /** Primary search query this targets */
  primaryQuery: string;
  /** Additional queries to embed naturally */
  relatedQueries: string[];
  /** Tool slugs to feature in the hub (cards) */
  toolSlugs: string[];
  /** Use-case slugs to feature (cards) */
  useCaseSlugs: string[];
  /** Optional: comparison slugs that fit the intent */
  comparisonSlugs?: string[];
  /** Why this collection beats individual searches — 2-3 sentences */
  whyThisHub: string;
  /** Related hubs for internal linking */
  related?: string[];
}

export const intentHubs: IntentHub[] = [
  {
    slug: "free-no-signup",
    title: "Free Online Tools — No Signup, No Login, No Email Required",
    description: "100% free online tools that work without signup or registration. Every tool runs in your browser, no email collected, no account needed.",
    hook: "Tired of \"sign up to download\" walls? Every tool here works without an account — no email, no login, no nag screens.",
    intro: "Most free online tools aren't really free — they give you 2 actions, then demand an email. The 23 tools below have no signup, no registration, no email gate, and no usage caps. Each one runs entirely in your browser, so your files stay private too. Bookmark this page; it's the no-friction toolbox.",
    primaryQuery: "free online tools no signup",
    relatedQueries: ["free tools without registration", "free pdf tools no email", "no signup required tools", "free tools no login"],
    toolSlugs: [
      "pdf-compressor", "pdf-to-word", "merge-pdf", "pdf-splitter", "pdf-editor",
      "image-compressor", "image-resizer", "background-remover", "image-cropper",
      "qr-code-generator", "password-generator", "json-formatter", "uuid-generator",
      "word-counter", "color-picker", "barcode-generator",
    ],
    useCaseSlugs: [
      "compress-pdf-for-email-attachment",
      "remove-background-from-product-photo",
      "qr-code-for-wifi-password",
    ],
    comparisonSlugs: ["toolsepulse-vs-smallpdf", "toolsepulse-vs-ilovepdf"],
    whyThisHub: "Smallpdf, iLovePDF, and Sejda all gate features behind signup walls or daily limits. Adobe Acrobat costs $20+/month. These 16 tools have neither — they're free because they run on your device, not on expensive servers we'd need to recoup costs for.",
    related: ["privacy-tools", "mobile-friendly-tools", "student-tools"],
  },

  {
    slug: "whatsapp-tools",
    title: "WhatsApp Tools: Compress, Resize, and Share Without Quality Loss",
    description: "Tools to make files send-ready for WhatsApp — compress PDFs under 100MB, shrink videos under 16MB, send sharp photos without WhatsApp's quality crush.",
    hook: "WhatsApp's hidden limits send your files to the rejection pile or murder their quality. These tools fix it before you hit send.",
    intro: "WhatsApp caps documents at 100MB, videos at 16MB, and re-compresses every photo to save bandwidth — destroying detail in the process. The 5 tools and 3 use-case guides below are everything you need to send files that actually arrive, at the quality you intended.",
    primaryQuery: "tools for whatsapp",
    relatedQueries: ["whatsapp file size limit", "compress for whatsapp", "send hd photo whatsapp", "whatsapp document limit"],
    toolSlugs: [
      "pdf-compressor", "image-compressor", "video-compressor",
      "qr-code-generator", "pdf-splitter",
    ],
    useCaseSlugs: [
      "compress-pdf-for-whatsapp",
      "compress-image-for-whatsapp",
      "compress-video-for-whatsapp",
    ],
    whyThisHub: "Every WhatsApp file rejection comes from one of three limits: 100MB for documents, 16MB for chat-tab videos, or aggressive photo re-compression. These tools and guides hit each limit cleanly — no uploads to random sites, no signup, no quality loss.",
    related: ["privacy-tools", "mobile-friendly-tools", "instagram-tools"],
  },

  {
    slug: "student-tools",
    title: "Free Tools for Students: PDF, Essay, Citation, and Study Help",
    description: "Free online tools every student needs — convert PDFs, compress assignments, rewrite essays, count words, generate references. No signup, no payment.",
    hook: "Submitting an assignment in 30 minutes? These free tools handle the file-format chaos so you can focus on the actual work.",
    intro: "Students hit the same file problems on every assignment: PDF too big for the portal, professor wants Word but you wrote it in Google Docs, citation format off, word count over. The tools below solve each one for free, without account creation that costs you 5 of those precious 30 minutes.",
    primaryQuery: "free tools for students",
    relatedQueries: ["free study tools online", "student pdf tools", "essay writing tools free", "free tools for university"],
    toolSlugs: [
      "pdf-to-word", "word-to-pdf", "pdf-compressor", "merge-pdf",
      "essay-writer", "ai-text-rewriter", "grammar-checker", "word-counter",
      "character-counter", "paragraph-generator", "image-to-text",
    ],
    useCaseSlugs: [
      "compress-pdf-under-100kb",
      "merge-pdf-for-resume-portfolio",
      "convert-pdf-to-word-for-resume",
    ],
    whyThisHub: "Smallpdf and similar tools cap free students at 2 daily uses — then push a $9/month Pro plan. You don't have $9/month. These tools have zero caps and zero accounts because they run in your browser. The professor doesn't need to know which tool you used; the file just works.",
    related: ["job-application-tools", "free-no-signup", "privacy-tools"],
  },

  {
    slug: "freelancer-tools",
    title: "Free Tools for Freelancers: Invoicing, PDFs, Branding, Productivity",
    description: "Free tools freelancers actually need — generate invoices, sign PDFs, compress portfolios, watermark photos, build resumes. All free, no signup.",
    hook: "Freelance work means doing your own admin. These tools handle the boring file work so you can bill more hours on actual client work.",
    intro: "Freelancers spend 4-8 hours a week on admin — invoicing, contracts, portfolio PDFs, image edits for client decks. Paid suites cost $20-50/month per service. The free tools below cover the same ground at zero cost, and process everything in your browser so client materials never touch third-party servers.",
    primaryQuery: "free tools for freelancers",
    relatedQueries: ["freelance invoice generator", "freelance tools free", "tools for independent contractors", "self employed tools"],
    toolSlugs: [
      "invoice-generator", "resume-builder", "pdf-signer", "pdf-editor",
      "pdf-compressor", "merge-pdf", "watermark-image", "background-remover",
      "image-compressor", "image-resizer", "qr-code-generator",
    ],
    useCaseSlugs: [
      "watermark-image-for-shop",
      "merge-pdf-for-resume-portfolio",
      "remove-background-from-product-photo",
      "qr-code-for-business-card",
    ],
    comparisonSlugs: ["toolsepulse-vs-canva", "toolsepulse-vs-adobe-acrobat"],
    whyThisHub: "Subscriptions stack fast: Adobe ($23), Canva Pro ($15), Smallpdf ($12), an invoice tool ($10) — easily $60/month before any client work. These tools cover the same use cases at zero cost. Your accountant will appreciate the simpler expense ledger too.",
    related: ["job-application-tools", "privacy-tools", "free-no-signup"],
  },

  {
    slug: "instagram-tools",
    title: "Instagram Tools: Resize, Compress, and Prep Photos for Posts and Stories",
    description: "Free tools to size, compress, and optimize photos for Instagram. 1080x1080 for posts, 1080x1920 for Stories, sharp uploads that survive IG's compression.",
    hook: "Instagram crushes your image quality on upload. The fix: hit Instagram's preferred dimensions and quality, and the algorithm leaves your photo nearly untouched.",
    intro: "Pro creators get sharper Instagram uploads by feeding the algorithm exactly what it wants: 1080px wide, JPG at 70-85% quality, the right aspect ratio for the format (1:1 feed, 4:5 portrait, 9:16 Story/Reel). The tools and use-cases below get you there in seconds.",
    primaryQuery: "instagram tools free",
    relatedQueries: ["instagram image tools", "resize for instagram", "instagram photo size", "instagram tools online"],
    toolSlugs: [
      "image-resizer", "image-compressor", "background-remover",
      "image-cropper", "watermark-image", "image-blur", "exif-remover",
      "thumbnail-creator", "favicon-generator",
    ],
    useCaseSlugs: [
      "resize-image-for-instagram",
      "compress-image-for-instagram",
      "remove-background-from-product-photo",
    ],
    whyThisHub: "Every social media management suite charges $15+/month for the same resize, compress, and basic edit features. For Instagram specifically you don't need a suite — you need precise pixel control. These browser tools deliver that for free, with no upload of your draft posts to a third party.",
    related: ["whatsapp-tools", "freelancer-tools", "privacy-tools"],
  },

  {
    slug: "job-application-tools",
    title: "Free Tools for Job Applications: Resume, PDF, Cover Letter Prep",
    description: "Free tools for job seekers — build resumes, merge with cover letter, convert PDF to Word, compress for portal upload limits. No signup required.",
    hook: "Job portals enforce strict file size limits and weird format requirements. These tools handle the file chaos so you focus on the actual application.",
    intro: "Every job portal has a different submission gotcha: one wants a single PDF, another rejects files over 5MB, a third demands Word format. Recruiters care about the content, not which tool you used to fit the form. The tools below quietly handle each requirement in seconds, with zero account creation, so you stay focused on what you'll actually write.",
    primaryQuery: "free tools for job applications",
    relatedQueries: ["resume tools free", "job application file tools", "pdf for job application", "resume builder free no signup"],
    toolSlugs: [
      "resume-builder", "pdf-compressor", "pdf-to-word", "merge-pdf",
      "word-to-pdf", "grammar-checker", "ai-text-rewriter", "essay-writer",
    ],
    useCaseSlugs: [
      "merge-pdf-for-resume-portfolio",
      "convert-pdf-to-word-for-resume",
      "compress-pdf-under-100kb",
      "compress-pdf-for-email-attachment",
    ],
    whyThisHub: "Job hunting is stressful enough without paying for tools or signing up for accounts that spam your job-search email. Every tool here gets you from blank form to submitted application without leaving a single account behind to delete later.",
    related: ["student-tools", "freelancer-tools", "free-no-signup"],
  },

  {
    slug: "privacy-tools",
    title: "Privacy-First Tools: Process Files Without Uploading Anywhere",
    description: "Free tools that process your files entirely in your browser — never uploaded to a server. PDFs, images, documents stay on your device. Privacy by design.",
    hook: "Most \"free online tools\" upload your files to their servers. These don't. Everything runs in your browser; your files never leave your device.",
    intro: "When you upload a PDF or photo to a free online tool, you're trusting a stranger's server with your file. For sensitive documents — tax forms, contracts, medical records, family photos — that's a real risk. Every tool below processes files using JavaScript in your browser, so no server ever sees your data. Even if our entire site disappeared tomorrow, the tools that already loaded in your browser would still work.",
    primaryQuery: "private file tools online",
    relatedQueries: ["tools that don't upload files", "browser-only pdf tools", "private pdf compressor", "no upload online tools"],
    toolSlugs: [
      "pdf-compressor", "pdf-editor", "pdf-signer", "pdf-unlocker", "pdf-password-protector",
      "image-compressor", "background-remover", "exif-remover", "image-blur",
      "password-generator", "hash-generator", "json-formatter",
    ],
    useCaseSlugs: [
      "remove-exif-data-before-posting",
      "blur-faces-in-photo",
      "compress-pdf-for-email-attachment",
      "generate-strong-password-for-banking",
    ],
    comparisonSlugs: ["toolsepulse-vs-smallpdf", "toolsepulse-vs-ilovepdf", "toolsepulse-vs-adobe-acrobat"],
    whyThisHub: "Smallpdf, iLovePDF, Sejda — they all upload your files to their servers, where the company's privacy policy and any future data breach decide what happens next. Local browser processing eliminates this risk entirely. There's no server log to leak because there's no server doing the work.",
    related: ["free-no-signup", "mobile-friendly-tools", "freelancer-tools"],
  },

  {
    slug: "mobile-friendly-tools",
    title: "Mobile-Friendly Tools That Actually Work on Phone Browsers",
    description: "Free tools designed for phones — compress, edit, and convert files directly in your phone browser. No app install, no upload, no signup.",
    hook: "Most online tools break on phones — tiny buttons, broken upload flows, popups everywhere. These work on phones because they were designed to.",
    intro: "You're on the bus and need to compress a PDF before emailing it. Or your friend just sent a giant image and you want to resize it for your story. Phone browsers can handle this in seconds — if the tool was built for them. The tools below have proper mobile UI, touch-friendly controls, and don't require uploading files (which is brutal on mobile data).",
    primaryQuery: "mobile pdf tools online",
    relatedQueries: ["pdf tools on phone", "mobile browser tools", "tools that work on iphone", "android pdf tools free"],
    toolSlugs: [
      "pdf-compressor", "pdf-to-word", "merge-pdf", "pdf-splitter",
      "image-compressor", "image-resizer", "image-cropper", "background-remover",
      "qr-code-generator", "video-compressor",
    ],
    useCaseSlugs: [
      "compress-pdf-for-whatsapp",
      "compress-image-for-whatsapp",
      "qr-code-for-wifi-password",
      "resize-image-for-instagram",
    ],
    whyThisHub: "Adobe wants you to install a 200MB native app. Smallpdf wants you in their app for \"the best experience\". For one-off tasks, that's overkill. A well-built browser tool runs identically on iPhone, Android, iPad, and desktop — no install, no permissions, no app store rating reminders.",
    related: ["whatsapp-tools", "instagram-tools", "privacy-tools"],
  },
];

export const intentHubMap: Record<string, IntentHub> = Object.fromEntries(
  intentHubs.map((h) => [h.slug, h])
);

export function getIntentHub(slug: string): IntentHub | undefined {
  return intentHubMap[slug];
}
