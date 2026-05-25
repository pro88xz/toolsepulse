import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { comparisons, getComparison } from "@/config/comparisons";
import { getToolBySlug } from "@/config/tools";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};

  const url = `${siteConfig.url}/compare/${slug}`;
  const title = `${c.title} | ${siteConfig.name}`;

  return {
    title,
    description: c.description,
    keywords: [c.primaryQuery, ...c.relatedQueries],
    openGraph: {
      title,
      description: c.description,
      url,
      siteName: siteConfig.name,
      type: "article",
      locale: "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: c.description,
      images: ["/opengraph-image"],
    },
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const url = `${siteConfig.url}/compare/${slug}`;
  const ctaTool = c.ctaToolSlug ? getToolBySlug(c.ctaToolSlug) : undefined;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${siteConfig.url}/compare` },
      { "@type": "ListItem", position: 3, name: c.title, item: url },
    ],
  };

  // Article schema for richer SERP display
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.description,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/android-chrome-512x512.png` },
    },
    datePublished: "2026-05-25",
    dateModified: "2026-05-25",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Compare</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
          {c.title}
        </h1>

        {/* Services snapshot */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {c.services.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{i === 0 ? "Option A" : "Option B"}</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{s.name}</div>
              <div className="mt-1 text-sm text-slate-500">{s.tagline}</div>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline">
                  Visit website →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Intro */}
        <p className="mt-8 text-base text-slate-700 leading-relaxed">{c.intro}</p>

        {/* Comparison table */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Feature-by-feature comparison</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Feature</th>
                  {c.services.map((s, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-slate-700">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.feature}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-4 py-3 text-slate-700">
                        <div className="flex items-start gap-2">
                          {row.winner === j && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold flex-shrink-0 mt-0.5">WIN</span>
                          )}
                          <span>{val}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verdict */}
        <section className="mt-10 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">The verdict</h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">{c.verdict}</p>
        </section>

        {/* CTA */}
        {ctaTool && (
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold">Try {ctaTool.name} free</h2>
            <p className="mt-1 text-sm text-white/80">100% free. No signup. Your files never leave your device.</p>
            <Link
              href={`/tools/${ctaTool.slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-lg transition-all"
            >
              Open {ctaTool.name}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* Related comparisons */}
        {c.related && c.related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">Related comparisons</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {c.related.map((relatedSlug) => {
                const r = getComparison(relatedSlug);
                if (!r) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={`/compare/${relatedSlug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{r.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
