import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsBitly = () => {
  const faqs = [
    { question: "What's the main difference between utm.one and Bitly?", answer: "Bitly focuses on link shortening. utm.one focuses on trust, governance, metadata, accessibility, and structured attribution for enterprise teams." },
    { question: "Does utm.one offer QR code attribution?", answer: "Yes, utm.one provides full QR code attribution with branded codes, while Bitly offers only basic QR functionality." },
    { question: "Is utm.one accessible?", answer: "Yes, utm.one is built with AAA accessibility compliance. Bitly does not prioritize accessibility standards." },
    { question: "Can I use utm.one for partner links?", answer: "Yes, utm.one includes partner link management with clean tracking and governance. Bitly does not offer this feature." },
    { question: "How does utm.one handle UTM governance?", answer: "utm.one enforces clean-track rules ensuring consistent UTM parameters across all campaigns. Bitly has no UTM governance features." }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs Bitly", url: "https://utm.one/compare/bitly" }
  ];

  return (
    <>
      <SEO 
        title="utm.one vs Bitly - Comparison"
        description="Bitly shortens links. utm.one builds trust, structure, metadata, accessibility, and attribution around them."
        canonical="https://utm.one/compare/bitly"
      />
      <ArticleSchema
        headline="utm.one vs Bitly - Enterprise Link Management Comparison"
        description="Bitly shortens links. utm.one builds trust, structure, metadata, accessibility, and attribution around them."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise link management platform with trust, governance, metadata, accessibility, and attribution"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="bitly"
        category="short links + analytics"
        headline="utm.one vs bitly"
        subheadline="bitly shortens links. utm.one builds trust, structure, metadata, accessibility, and attribution around them."
        summary={{
          line1: "bitly is for shortening.",
          line2: "utm.one is for teams who need clean, governed, trustworthy links."
        }}
        features={[
          { capability: "trust preview", utmOne: true, competitor: false },
          { capability: "safety scan", utmOne: true, competitor: false },
          { capability: "semantic slugs", utmOne: true, competitor: false },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "link permanence", utmOne: true, competitor: false },
          { capability: "clean-track rules", utmOne: true, competitor: false },
          { capability: "qr attribution", utmOne: true, competitor: "basic" },
          { capability: "partner links", utmOne: true, competitor: false },
          { capability: "metadata for LLMs", utmOne: true, competitor: false },
          { capability: "unlimited users", utmOne: true, competitor: false },
          { capability: "pricing fairness", utmOne: true, competitor: false },
        ]}
        whitespace={{
          headline: "bitly solves speed. utm.one solves trust",
          points: [
            "transparent previews",
            "safer clicks",
            "semantic links",
            "metadata built-in",
            "consistent UTMs",
            "qr + attribution",
            "clean governance",
          ]
        }}
        whoCompetitorIsFor={{
          title: "who bitly is for",
          points: [
            "one-off links",
            "personal use",
            "light tracking"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "marketing",
            "sales",
            "marketing ops",
            "developers",
            "partners",
            "agencies"
          ]
        }}
        ctaText="see utm.one in action"
      />
    </>
  );
};

export default UtmOneVsBitly;
