import { Tool, categories } from "@/config/tools";
import { siteConfig } from "@/config/site";
import { getToolContent } from "@/config/tool-content";

export default function ToolJsonLd({ tool }: { tool: Tool }) {
  const content = getToolContent(tool.slug);
  const toolUrl = `${siteConfig.url}/tools/${tool.slug}`;
  const categoryLabel = categories[tool.category].label;

  // 1. WebApplication schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: toolUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/android-chrome-512x512.png`,
    },
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    softwareVersion: "1.0",
    featureList: [
      "Free to use",
      "No signup required",
      "No file uploads to server",
      "Works in browser",
      "Mobile friendly",
    ],
  };

  // 2. BreadcrumbList schema (Home > Category > Tool)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `${siteConfig.url}/category/${tool.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  // 3. FAQPage schema (only if FAQ content exists)
  const faqSchema = content && content.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  // 4. HowTo schema (only if how-to content exists)
  const howToSchema = content && content.howTo.steps.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: content.howTo.title,
        description: `Step-by-step guide to ${tool.shortDescription.toLowerCase()}.`,
        totalTime: "PT2M",
        supply: [],
        tool: [
          {
            "@type": "HowToTool",
            name: tool.name,
          },
        ],
        step: content.howTo.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.description,
          url: `${toolUrl}#step-${i + 1}`,
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  );
}
