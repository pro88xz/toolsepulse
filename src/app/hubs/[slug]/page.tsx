import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { intentHubs, getIntentHub } from "@/config/intent-hubs";
import { getToolBySlug, categories } from "@/config/tools";
import { getUseCase } from "@/config/use-cases";
import { getComparison } from "@/config/comparisons";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return intentHubs.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getIntentHub(slug);
  if (!hub) return {};

  const url = `${siteConfig.url}/hubs/${slug}`;
  const title = `${hub.title} | ${siteConfig.name}`;

  return {
    title,
    description: hub.description,
    keywords: [hub.primaryQuery, ...hub.relatedQueries],
    openGraph: {
      title,
      description: hub.description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: hub.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: hub.description,
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

export default async function HubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getIntentHub(slug);
  if (!hub) notFound();

  const url = `${siteConfig.url}/hubs/${slug}`;
  const tools = hub.toolSlugs.map((s) => getToolBySlug(s)).filter(Boolean);
  const useCases = hub.useCaseSlugs.map((s) => getUseCase(s)).filter(Boolean);
  const comparisons = (hub.comparisonSlugs ?? []).map((s) => getComparison(s)).filter(Boolean);

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Hubs", item: `${siteConfig.url}/hubs` },
      { "@type": "ListItem", position: 3, name: hub.title, item: url },
    ],
  };

  // ItemList schema — perfect for hub pages
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: hub.title,
    description: hub.description,
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/tools/${t!.slug}`,
      name: t!.name,
    })),
  };

  return (
    <div className="min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Hub</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
          {hub.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed font-medium">{hub.hook}</p>

        {/* Intro card */}
        <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5 sm:p-6">
          <p className="text-sm text-slate-700 leading-relaxed">{hub.intro}</p>
        </div>

        {/* Tools grid */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Tools in this collection</h2>
          <p className="mt-1 text-sm text-slate-500">{tools.length} tools, free, no signup, runs in your browser.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => {
              const tool = t!;
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {categories[tool.category].label}
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">{tool.shortDescription}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Why this hub */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Why this collection</h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">{hub.whyThisHub}</p>
        </section>

        {/* Related use cases */}
        {useCases.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">Step-by-step guides</h2>
            <p className="mt-1 text-sm text-slate-500">Tailored walkthroughs for the most common ways people use these tools.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {useCases.map((u) => {
                const uc = u!;
                return (
                  <Link
                    key={uc.slug}
                    href={`/use/${uc.slug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{uc.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{uc.hook}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related comparisons */}
        {comparisons.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">Compare with alternatives</h2>
            <p className="mt-1 text-sm text-slate-500">Honest comparisons against the paid options.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {comparisons.map((cc) => {
                const c = cc!;
                return (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{c.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related hubs */}
        {hub.related && hub.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">Related hubs</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {hub.related.map((relatedSlug) => {
                const r = getIntentHub(relatedSlug);
                if (!r) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={`/hubs/${relatedSlug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{r.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.hook}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA — back to all tools */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 p-6 sm:p-8 text-white">
          <h2 className="text-xl font-bold">Explore all 83 tools</h2>
          <p className="mt-1 text-sm text-white/80">Every tool free. No signup. Files never leave your device.</p>
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
      </article>
    </div>
  );
}
