import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Affiliate Disclosure",
  alternates: {
    canonical: `${siteConfig.url}/affiliate-disclosure`,
  },
  description: `Affiliate Disclosure for ${siteConfig.name}. How we work with affiliate partners and how this affects you.`,
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Affiliate Disclosure</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">The Short Version</h2>
          <p>
            Some of the links on {siteConfig.name} are affiliate links. If you click one and sign up for or purchase a product, we may earn a commission — at no additional cost to you. We only recommend products we genuinely believe add value beyond what our free tools already provide.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">What Is an Affiliate Link?</h2>
          <p>
            An affiliate link is a special tracking URL that tells a partner company we referred you. When you click it and complete an action — such as signing up for a free trial, creating an account, or purchasing a subscription — the company may pay us a small commission. The price you pay is exactly the same as if you visited the company directly without using our link.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Why We Use Affiliate Links</h2>
          <p>
            {siteConfig.name} is free to use, with no signup required and no file size limits. We do not charge users for any of our tools and we never will. Affiliate commissions help us keep the site running, pay for hosting, and continue building new tools — without forcing paywalls or aggressive advertising on our users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">How We Choose Partners</h2>
          <p>
            We only recommend products and services that meet three criteria:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>The product is from a reputable, established company with a real track record.</li>
            <li>The product genuinely solves a problem our users may have — typically when they need more advanced features than our free in-browser tools provide (bulk processing, offline use, professional workflows, or enterprise features).</li>
            <li>The recommendation is relevant to the tool or content the user is currently viewing.</li>
          </ul>
          <p className="mt-3">
            We will never recommend a product just because it pays a higher commission. If a free alternative is better for your specific use case, we will tell you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Where You'll See Affiliate Links</h2>
          <p>
            Affiliate links may appear in the following places on our site:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Within blog posts and guides, when recommending a related paid product.</li>
            <li>On tool pages, in clearly labeled "Recommended" or "Premium Alternative" sections.</li>
            <li>On the "Alternatives" sub-page for each tool, alongside other tool comparisons.</li>
          </ul>
          <p className="mt-3">
            Affiliate links are always clearly distinguishable from internal links to our own tools. Where appropriate, individual affiliate placements may carry their own short disclosure (such as "affiliate link" or "we may earn a commission").
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Partner Networks We Work With</h2>
          <p>
            We participate in affiliate programs through reputable affiliate networks, which may include (but are not limited to): Impact, Partnerize, CJ Affiliate (Commission Junction), ShareASale, Awin, Rakuten Advertising, and direct partner programs operated by the brands themselves. Each network and brand has its own privacy practices, which are governed by their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Editorial Independence</h2>
          <p>
            Our affiliate relationships do not influence our editorial content, the tools we build, or the recommendations we make in our workflow suggestions ("What's Next"). Every tool we host is and will remain free. Our tool rankings, comparisons, and how-to guides are written based on what we believe is genuinely most useful to our users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Your Choice</h2>
          <p>
            You are never required to use any affiliate link on our site. All of our tools work fully without you clicking any outbound link. If you prefer not to support {siteConfig.name} through affiliate commissions, simply navigate to the recommended company's website directly rather than through our link.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">FTC Compliance</h2>
          <p>
            This disclosure is made in accordance with the U.S. Federal Trade Commission's 16 CFR Part 255: "Guides Concerning the Use of Endorsements and Testimonials in Advertising," as well as comparable consumer protection guidelines in other jurisdictions, including the UK CAP Code and the EU Unfair Commercial Practices Directive.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Changes to This Disclosure</h2>
          <p>
            We may update this Affiliate Disclosure from time to time as we add new partners or change how we present affiliate content. Any changes will be reflected on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Affiliate Disclosure or about a specific affiliate placement on our site, please visit our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
