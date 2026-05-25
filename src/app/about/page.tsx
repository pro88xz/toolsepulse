import { siteConfig } from "@/config/site";
import { tools, categories } from "@/config/tools";
import Link from "next/link";

export const metadata = {
  title: `About ${siteConfig.name} — Built in Sierra Leone, Privacy-First Online Tools`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  description: `Meet the builder behind ${siteConfig.name} — Mohamed, a solo developer in Sierra Leone making free, browser-based tools that respect your privacy. ${tools.length}+ tools, zero uploads, no signup.`,
};

export default function AboutPage() {
  const pdfCount = tools.filter((t) => t.category === "pdf").length;
  const imageCount = tools.filter((t) => t.category === "image" || t.category === "converter").length;
  const audioVideoCount = tools.filter((t) => t.category === "audio" || t.category === "video").length;
  const textDevCount = tools.filter((t) => t.category === "text" || t.category === "developer" || t.category === "generator" || t.category === "ai").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        About {siteConfig.name}
      </h1>
      <p className="mt-3 text-base text-slate-500">
        A solo-built collection of {tools.length} free online tools, built with one philosophy: your files belong to you, not to a server.
      </p>

      <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The story</h2>
          <p>
            {siteConfig.name} is built and maintained by <strong className="text-slate-900">Mohamed</strong>, a solo developer based in <strong className="text-slate-900">Freetown, Sierra Leone</strong>. The site launched in 2026 after years of being frustrated by what online tools had become.
          </p>
          <p className="mt-4">
            Every free PDF compressor, image resizer, or QR generator on the internet seemed to follow the same playbook: ask you to upload a file you care about to a server you know nothing about, force you to create an account, slap a watermark on your output, then offer a paid plan to remove the limits they invented in the first place. For one-off tasks &mdash; compressing a PDF for an email attachment, resizing a photo for a job application, generating a QR code for a restaurant menu &mdash; that whole flow felt absurd.
          </p>
          <p className="mt-4">
            Modern browsers can do almost all of this work locally. Chrome, Firefox, Safari, and Edge ship with APIs powerful enough to compress images, convert PDFs, generate barcodes, and even run AI background removal &mdash; entirely on your device. No server required. No upload required. No account required.
          </p>
          <p className="mt-4">
            {siteConfig.name} is the result of building tools that work this way from day one. It started as a personal frustration project and grew into the {tools.length}-tool collection it is today.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The philosophy</h2>
          <p>Three principles guide every tool on the site:</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900">1. Your files never leave your device</h3>
              <p className="mt-1 text-sm text-slate-600">
                Every tool processes files using JavaScript and WebAssembly running in your browser tab. There is no server to upload to. There is no log of your files. There is no way for us to see what you converted, compressed, or generated &mdash; because we physically cannot.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900">2. No signup, no account, no email collection</h3>
              <p className="mt-1 text-sm text-slate-600">
                You will never be asked to create an account to use a tool. You will never be asked for your email to download your result. The site has no &ldquo;Pro&rdquo; tier, no &ldquo;Premium&rdquo; features hidden behind a paywall, no usage caps that vanish when you sign up.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900">3. No watermarks, no quality degradation</h3>
              <p className="mt-1 text-sm text-slate-600">
                Free tools elsewhere often add watermarks or downsample your output to push you toward a paid upgrade. We don&apos;t. The PDF you get back is the same quality as the result of any paid tool. The image you compress is the same. There is no trick.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How it works technically</h2>
          <p>
            Every tool uses a combination of modern browser APIs and JavaScript libraries that run client-side. There is no Node.js server doing the work, no Python service in the background. The processing happens between you, your browser, and your CPU.
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside pl-2">
            <li><strong>PDF tools</strong> &mdash; built on the <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">pdf-lib</code> library, which manipulates PDF documents in JavaScript. Compression, merging, splitting, signing, and editing all happen in memory in your browser tab.</li>
            <li><strong>Image tools</strong> &mdash; use the Canvas API and the browser&apos;s native image decoders. Resizing, cropping, watermarking, format conversion: all rendered on a canvas element that lives in your browser, then exported as a download.</li>
            <li><strong>Audio and video tools</strong> &mdash; use the Web Audio API and FFmpeg.wasm, a WebAssembly port of the popular FFmpeg library. Conversion, trimming, and compression run in your browser at near-native speed.</li>
            <li><strong>AI tools</strong> &mdash; like the background remover and image upscaler use Transformers.js, a JavaScript port of HuggingFace&apos;s transformers library. The AI model downloads to your browser the first time you use the tool and runs locally afterward.</li>
            <li><strong>Developer tools</strong> &mdash; JSON formatting, CSV-to-JSON conversion, UUID generation, hash generation &mdash; these are tiny pure-JavaScript implementations that run instantly with no dependencies.</li>
          </ul>
          <p className="mt-4">
            The downside of this approach: very large files (multi-gigabyte videos, hundreds-of-pages PDFs) may slow down or hit your device&apos;s memory limits. The upside: total privacy, no upload time, no server costs to pass on to you in the form of paid tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What&apos;s on the site</h2>
          <p>
            As of today, {siteConfig.name} hosts {tools.length} tools across {Object.keys(categories).length} categories:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">PDF Tools</div>
              <div className="text-lg font-bold text-slate-900">{pdfCount} tools</div>
              <p className="text-xs text-slate-500 mt-1">Compress, merge, split, edit, sign, convert, password-protect, watermark, OCR, and more.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Image &amp; Converters</div>
              <div className="text-lg font-bold text-slate-900">{imageCount} tools</div>
              <p className="text-xs text-slate-500 mt-1">Resize, crop, compress, watermark, remove background, convert formats (HEIC, WebP, PNG, JPG, SVG).</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Audio &amp; Video</div>
              <div className="text-lg font-bold text-slate-900">{audioVideoCount} tools</div>
              <p className="text-xs text-slate-500 mt-1">Convert audio formats, trim, join, extract audio from video, compress video, make GIFs.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Text, Developer &amp; AI</div>
              <div className="text-lg font-bold text-slate-900">{textDevCount} tools</div>
              <p className="text-xs text-slate-500 mt-1">JSON, CSV, UUID, password, hash, QR, barcode, grammar check, essay writer, paraphraser, and more.</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Browse the full catalog at the <Link href="/" className="text-blue-600 hover:underline font-medium">home page</Link>, or jump straight into a category from the <Link href="/category/pdf" className="text-blue-600 hover:underline">PDF</Link>, <Link href="/category/image" className="text-blue-600 hover:underline">Image</Link>, <Link href="/category/audio" className="text-blue-600 hover:underline">Audio</Link>, or <Link href="/category/text" className="text-blue-600 hover:underline">Text</Link> sections.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who uses {siteConfig.name}</h2>
          <p>Looking at the queries that bring people to the site, the audience splits into four rough groups:</p>
          <ul className="mt-4 space-y-2 list-disc list-inside pl-2">
            <li><strong>Students</strong> compressing assignments to fit portal upload limits, converting PDF resumes to Word for edits, and using grammar checks and paraphrasers on essays.</li>
            <li><strong>Freelancers and small business owners</strong> generating invoices, merging contract documents, watermarking product photos, and creating QR codes for menus, business cards, and event RSVPs.</li>
            <li><strong>Job seekers</strong> merging cover letters with resumes, converting PDF resumes back to Word for tweaks, and compressing files to fit applicant tracking systems&apos; size limits.</li>
            <li><strong>Privacy-conscious users</strong> who specifically don&apos;t want their files going to a third-party server &mdash; tax documents, medical records, legal contracts, family photos.</li>
          </ul>
          <p className="mt-4">
            None of these use cases require an account. They&apos;re tasks you do once, finish, and move on. That&apos;s exactly what {siteConfig.name} optimizes for: zero friction between &ldquo;I need to do X&rdquo; and &ldquo;X is done.&rdquo;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">Is the site really free? What&apos;s the catch?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Yes, genuinely free. The site costs almost nothing to run because the tools process files in your browser, not on a server. Hosting costs cover the static HTML pages and that&apos;s it. The site supports itself through occasional unobtrusive ads &mdash; never on tool widgets themselves.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">Do you really not upload my files?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Correct. The processing happens entirely in your browser using JavaScript and WebAssembly. You can verify this yourself by opening your browser&apos;s developer tools (F12 in Chrome/Firefox), going to the Network tab, and running a tool &mdash; you&apos;ll see no upload requests for your file. The only network traffic is loading the tool code itself.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">Why is everything so fast then?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Because there&apos;s no upload step. Traditional online tools spend 80% of their processing time uploading your file to a server and downloading the result back. When all the work happens locally, you skip both legs of that journey.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">What are the limits?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Your device&apos;s memory and CPU. For most files (PDFs under 100MB, images under 50MB, videos under 1GB), there&apos;s no practical limit. Very large files may slow your browser or run out of memory &mdash; the same as any other browser-based operation would.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">Why are some tool websites so insistent on signups?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Because their business model depends on it. They process files on their servers, which costs them money. They monetize by getting you to upgrade to a paid plan. The signup builds their email list and creates a relationship. We don&apos;t have that cost structure, so we don&apos;t need that funnel.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">Can I suggest a tool you don&apos;t have yet?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Yes &mdash; use the <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link> and describe the tool you wish existed. I read every suggestion. The site grew organically from user requests.</p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-slate-900">Is the code open source?</summary>
              <p className="px-4 pb-4 text-sm text-slate-600">Parts of it, eventually. The tool implementations rely on excellent open-source libraries (pdf-lib, FFmpeg.wasm, Transformers.js, and many others). The site itself is a Next.js application that may be open-sourced in the future.</p>
            </details>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About the builder</h2>
          <p>
            I&apos;m Mohamed, a developer based in Freetown, Sierra Leone. I build mobile apps, games, and web platforms across a wide range of projects &mdash; most of them solo. {siteConfig.name} is the side project that turned into a real product because the problem it solves kept showing up in my own workflow.
          </p>
          <p className="mt-4">
            Working from West Africa shapes the product in subtle ways. Internet connections here aren&apos;t always fast or stable, which makes &ldquo;upload your file to our servers&rdquo; tools genuinely painful to use. Devices are often older or shared, which makes lightweight, browser-based tools more accessible than heavy native software. Privacy matters here too &mdash; for the same reasons it matters everywhere else: nobody should have to upload tax documents, medical records, or contracts to an unknown server just to perform a basic file conversion.
          </p>
          <p className="mt-4">
            If you want to get in touch &mdash; questions, suggestions, bug reports, or business inquiries &mdash; the <Link href="/contact" className="text-blue-600 hover:underline font-medium">contact page</Link> is the best route. I read every message.
          </p>
        </section>

        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Policies and legal</h2>
          <p className="text-sm">For full details on data handling, terms, and disclosures, see:</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>&rarr; <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link></li>
            <li>&rarr; <Link href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link></li>
            <li>&rarr; <Link href="/affiliate-disclosure" className="text-blue-600 hover:underline font-medium">Affiliate Disclosure</Link></li>
            <li>&rarr; <Link href="/security" className="text-blue-600 hover:underline font-medium">Security Policy</Link></li>
          </ul>
        </section>
      </div>

      <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 p-6 sm:p-8 text-white">
        <h2 className="text-xl font-bold">Try {siteConfig.name}</h2>
        <p className="mt-1 text-sm text-white/80">{tools.length}+ tools. 100% free. No signup. Your files never leave your device.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-lg transition-all"
        >
          See all tools
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
