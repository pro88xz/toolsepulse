import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { useCases, getUseCase } from "@/config/use-cases";
import { getToolBySlug, categories } from "@/config/tools";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};

  const url = `${siteConfig.url}/use/${slug}`;
  const title = `${uc.title} | ${siteConfig.name}`;

  return {
    title,
    description: uc.description,
    keywords: [uc.primaryQuery, ...uc.relatedQueries],
    openGraph: {
      title,
      description: uc.description,
      url,
      siteName: siteConfig.name,
      type: "article",
      locale: "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: uc.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: uc.description,
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

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) notFound();

  const tool = getToolBySlug(uc.toolSlug);
  if (!tool) notFound();

  const url = `${siteConfig.url}/use/${slug}`;
  const categoryLabel = categories[tool.category].label;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: `${siteConfig.url}/category/${tool.category}` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${siteConfig.url}/tools/${tool.slug}` },
      { "@type": "ListItem", position: 4, name: uc.title, item: url },
    ],
  };

  // HowTo schema (use-case-specific steps, not the tool's generic steps)
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: uc.title,
    description: uc.description,
    totalTime: "PT2M",
    tool: [{ "@type": "HowToTool", name: tool.name }],
    step: uc.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
      url: `${url}#step-${i + 1}`,
    })),
  };

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: uc.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href={`/category/${tool.category}`} className="hover:text-slate-900">{categoryLabel}</Link>
            <span>/</span>
            <Link href={`/tools/${tool.slug}`} className="hover:text-slate-900">{tool.name}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">Use case</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* H1 + hook */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
          {uc.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed font-medium">{uc.hook}</p>

        {/* Primary CTA — above the fold */}
        <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5 sm:p-6">
          <p className="text-sm text-slate-700 leading-relaxed">{uc.intro}</p>
          <Link
            href={`/tools/${tool.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all"
            style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
          >
            Open {tool.name}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Steps */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Step-by-step</h2>
          <div className="mt-6 space-y-5">
            {uc.steps.map((step, i) => (
              <div key={i} id={`step-${i + 1}`} className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex-shrink-0">{i + 1}</div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mid-page CTA */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Ready to try it?</h2>
          <p className="mt-1 text-sm text-slate-600">{tool.shortDescription}. Free, no signup, runs in your browser.</p>
          <Link
            href={`/tools/${tool.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-lg transition-all"
            style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
          >
            Open {tool.name}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-2">
            {uc.faq.map((item, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900">
                  {item.question}
                  <svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related use cases */}
        {uc.related && uc.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">Related use cases</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {uc.related.map((relatedSlug) => {
                const r = getUseCase(relatedSlug);
                if (!r) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={`/use/${relatedSlug}`}
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

        {/* Bottom CTA — final push */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 p-6 sm:p-8 text-white">
          <h2 className="text-xl font-bold">Try {tool.name} now</h2>
          <p className="mt-1 text-sm text-white/80">100% free. No signup. Your files never leave your device.</p>
          <Link
            href={`/tools/${tool.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-lg transition-all"
          >
            Open {tool.name}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}
