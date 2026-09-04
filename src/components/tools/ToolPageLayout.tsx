import Link from "next/link";
import { type Tool, categories, getToolBySlug } from "@/config/tools";
import ToolJsonLd from "./ToolJsonLd";
import ToolUseTracker from "./ToolUseTracker";
import BugReport from "./BugReport";
import WhatsNext from "./WhatsNext";
import { getToolContent } from "@/config/tool-content";
import { categoryStyles } from "@/config/categories";
import { getToolIcon as getPhosphorIcon } from "@/lib/tool-icons";
import { useCases } from "@/config/use-cases";
import { comparisons } from "@/config/comparisons";

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  /** Set to true if the tool renders WhatsNext inline (e.g. next to its Download button). Suppresses the bottom-of-page version. */
  hideWhatsNext?: boolean;
}

export default function ToolPageLayout({ tool, children, hideWhatsNext = false }: ToolPageLayoutProps) {
  const content = getToolContent(tool.slug);

  return (
    <div className="min-h-[80vh]">
      <ToolJsonLd tool={tool} />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <Link href={`/category/${tool.category}`} className="hover:text-slate-900 transition-colors">
              {categories[tool.category].label}
            </Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-slate-900 font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Tool Header */}
      <div className="mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <span
            className="tp-tile mx-auto"
            style={{ "--g1": categoryStyles[tool.category].from, "--g2": categoryStyles[tool.category].to } as React.CSSProperties}
          >
            <i className="tp-tile-b" aria-hidden="true" />
            <i className="tp-tile-f">
              {(() => {
                const Icon = getPhosphorIcon(tool.slug, tool.icon);
                return <Icon size={26} weight="bold" />;
              })()}
            </i>
          </span>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{tool.name}</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">{tool.description}</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Free
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              No signup
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Private
            </span>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8">
        {children}
        <ToolUseTracker />
        <BugReport toolName={tool.name} />
      </div>

      {/* Ad - between tool and content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
      </div>

      {/* Visual Banner */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-4">
        <div className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden" style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{tool.name} runs 100% in your browser</h2>
              <p className="mt-1 text-sm text-white/80">Your file is read straight off your own disk and processed here in the tab. Nothing is uploaded, nothing is stored, and no account is needed.</p>
            </div>

          </div>
        </div>
      </div>

      {/* Rich SEO Content */}
      {content && (
        <div className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

            {/* How To Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.howTo.title}</h2>
              <div className="space-y-4">
                {content.howTo.steps.map((step: { title: string; description: string }, i: number) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex-shrink-0">{i + 1}</div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {content.howTo.tips.length > 0 && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-sm font-bold text-amber-800 mb-3">Pro Tips</h3>
                  <ul className="space-y-2">
                    {content.howTo.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-amber-900">
                        <span className="text-amber-500 flex-shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Use Cases */}
            {content.useCases.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">When to Use {tool.name}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {content.useCases.map((uc: { title: string; description: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                      <h3 className="text-sm font-bold text-slate-900">{uc.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{uc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {content.faq.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {content.faq.map((item: { question: string; answer: string }, i: number) => (
                    <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                      <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900">
                        {item.question}
                        <svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </summary>
                      <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Ad - between FAQ and alternatives */}
            <div className="mb-12">
            </div>

            {/* Use-case landing pages for this tool */}
            {useCases.filter((uc) => uc.toolSlug === tool.slug).length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Common use cases for {tool.name}</h2>
                <p className="text-sm text-slate-600 mb-4">Tailored step-by-step guides for the most common ways people use {tool.name.toLowerCase()}.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {useCases.filter((uc) => uc.toolSlug === tool.slug).map((uc) => (
                    <Link
                      key={uc.slug}
                      href={`/use/${uc.slug}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">{uc.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{uc.hook}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison pages featuring this tool */}
            {comparisons.filter((c) => c.ctaToolSlug === tool.slug).length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Compare {tool.name} with alternatives</h2>
                <p className="text-sm text-slate-600 mb-4">Honest head-to-head comparisons against Smallpdf, iLovePDF, Adobe, and other popular tools.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {comparisons.filter((c) => c.ctaToolSlug === tool.slug).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/compare/${c.slug}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">{c.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{c.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ad - between FAQ and alternatives */}
            

            {/* Alternatives Section */}
            {content.alternatives.tools.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{tool.name} vs Alternatives</h2>
                <p className="text-sm text-slate-600 mb-4">{content.alternatives.intro}</p>
                <div className="space-y-3">
                  {content.alternatives.tools.map((alt: { name: string; description: string; differentiator: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="text-sm font-bold text-slate-900">{alt.name}</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{alt.description}</p>
                      <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <span className="font-medium text-slate-700">Key difference:</span> {alt.differentiator}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border-2 border-purple-200 bg-purple-50 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold text-white uppercase" style={{ backgroundImage: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}>Our advantage</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{content.alternatives.whyUs}</p>
                </div>
              </div>
            )}

            {/* Limitations - Transparency builds trust */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Good to know</h2>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                <ul className="space-y-2.5">
                  <li className="flex gap-2.5 text-sm text-amber-900">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span>All processing happens in your browser. Very large files may be slower on mobile devices or older computers.</span>
                  </li>
                  <li className="flex gap-2.5 text-sm text-amber-900">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span>Results depend on the quality and format of your input. For best results, use high-quality source files.</span>
                  </li>
                  <li className="flex gap-2.5 text-sm text-amber-900">
                    <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    <span>Once you close the browser tab, all data is gone. Make sure to download your results before closing.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Key Features</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-slate-900">100% Free</h3>
                  </div>
                  <p className="text-sm text-slate-600">No hidden fees, no premium tiers, no limits on how much you use it. Free today, free tomorrow, free forever.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-slate-900">Complete Privacy</h3>
                  </div>
                  <p className="text-sm text-slate-600">Your files never leave your device. Everything is processed locally in your browser — we physically cannot access your data.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-slate-900">No Registration</h3>
                  </div>
                  <p className="text-sm text-slate-600">Start using the tool immediately. No account, no email, no personal information required. Just open and use.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <h3 className="text-sm font-bold text-slate-900">Works Everywhere</h3>
                  </div>
                  <p className="text-sm text-slate-600">Compatible with Chrome, Firefox, Safari, and Edge on desktop and mobile. Works offline once the page has loaded.</p>
                </div>
              </div>
            </div>

            {/* Deep links to subpages */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href={`/tools/${tool.slug}/how-to`} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-4">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">Full Step-by-Step Guide</h4>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">Detailed walkthrough with pro tips and best practices for getting the best results every time.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:gap-2 transition-all">Read guide <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
              </Link>
              <Link href={`/tools/${tool.slug}/faq`} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">Frequently Asked Questions</h4>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">Every common question answered — file limits, privacy, supported formats, compatibility, and more.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:gap-2 transition-all">View FAQ <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
              </Link>
              <Link href={`/tools/${tool.slug}/alternatives`} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-4">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">Compare Alternatives</h4>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">See how {tool.name} stacks up against Adobe, Smallpdf, and other paid and free alternatives.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:gap-2 transition-all">Compare now <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></span>
              </Link>
            </div>

            {/* Workflow: What to do next */}
            {!hideWhatsNext && <WhatsNext currentTool={tool.slug} />}

            {/* Related Tools */}
            {tool.relatedTools && tool.relatedTools.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Related Tools You Might Need</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tool.relatedTools.map((slug) => {
                    const related = getToolBySlug(slug);
                    if (!related) return null;
                    return (
                      <Link key={slug} href={`/tools/${slug}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group">
                        <span
                          className="tp-tile flex-shrink-0"
                          style={{ "--g1": categoryStyles[related.category].from, "--g2": categoryStyles[related.category].to } as React.CSSProperties}
                        >
                          <i className="tp-tile-b" aria-hidden="true" />
                          <i className="tp-tile-f">
                            {(() => {
                              const Icon = getPhosphorIcon(related.slug, related.icon);
                              return <Icon size={22} weight="bold" />;
                            })()}
                          </i>
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">{related.name}</h3>
                          <p className="text-xs text-slate-500 truncate">{related.shortDescription}</p>
                        </div>
                        <svg className="h-4 w-4 text-slate-300 group-hover:text-purple-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
