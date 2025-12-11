import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsRebrandly = () => {
  const faqs = [
    { question: "What's the main difference between utm.one and Rebrandly?", answer: "Rebrandly focuses on branded URLs. utm.one focuses on clarity, trust, accessibility, and structured attribution for GTM teams." },
    { question: "Does utm.one support branded links?", answer: "Yes, utm.one supports branded links plus semantic slugs, trust previews, and metadata that Rebrandly doesn't offer." },
    { question: "Is utm.one accessible?", answer: "Yes, utm.one is built with AAA accessibility compliance. Rebrandly does not prioritize accessibility standards." },
    { question: "Can I use utm.one for partner programs?", answer: "Yes, utm.one includes partner link management with clean tracking. Rebrandly does not offer partner link features." },
    { question: "How does utm.one handle QR code attribution?", answer: "utm.one provides full QR attribution with tracking. Rebrandly offers only partial QR functionality." }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs Rebrandly", url: "https://utm.one/compare/rebrandly" }
  ];

  return (
    <>
      <SEO 
        title="utm.one vs Rebrandly - Comparison"
        description="Rebrandly focuses on branded URLs. utm.one focuses on clarity, trust, accessibility, and structured attribution."
        canonical="https://utm.one/compare/rebrandly"
      />
      <ArticleSchema
        headline="utm.one vs Rebrandly - Branded Link Management Comparison"
        description="Rebrandly focuses on branded URLs. utm.one focuses on clarity, trust, accessibility, and structured attribution."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise link management platform with clarity, trust, accessibility, and structured attribution"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="rebrandly"
        category="branded links"
        headline="utm.one vs rebrandly"
        subheadline="rebrandly focuses on branded URLs. utm.one focuses on clarity, trust, accessibility, and structured attribution."
        summary={{
          line1: "rebrandly makes branded links",
          line2: "utm.one makes meaningful links"
        }}
        features={[
          { capability: "branded links", utmOne: true, competitor: true },
          { capability: "semantic slugs", utmOne: true, competitor: "partial" },
          { capability: "trust preview", utmOne: true, competitor: false },
          { capability: "safety scan", utmOne: true, competitor: false },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "qr attribution", utmOne: true, competitor: "partial" },
          { capability: "partner links", utmOne: true, competitor: false },
          { capability: "clean-track rules", utmOne: true, competitor: false },
          { capability: "unlimited users", utmOne: true, competitor: false },
          { capability: "pricing fairness", utmOne: true, competitor: false },
        ]}
        whitespace={{
          headline: "branding ≠ clarity",
          points: [
            "utm.one focuses on the click experience, not just the slug",
            "trust previews before clicks",
            "semantic meaning in every link",
            "accessibility built-in",
            "metadata for AI discovery",
            "governance without complexity"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who rebrandly is for",
          points: [
            "small teams",
            "basic branding",
            "simple redirects"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "GTM teams",
            "enterprise ops",
            "partner programs",
            "metadata-driven orgs"
          ]
        }}
        ctaText="see utm.one"
      />
    </>
  );
};

export default UtmOneVsRebrandly;
