import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsShortIo = () => {
  const faqs = [
    { question: "What's the main difference between utm.one and Short.io?", answer: "Short.io handles basic link shortening. utm.one handles trust, clarity, metadata, accessibility, and governance for enterprise teams." },
    { question: "Does utm.one offer semantic slugs?", answer: "Yes, utm.one provides semantic slugs for meaningful, readable links. Short.io offers only partial semantic slug support." },
    { question: "Is utm.one accessible?", answer: "Yes, utm.one is built with AAA accessibility compliance. Short.io does not prioritize accessibility standards." },
    { question: "Can I use utm.one for UTM governance?", answer: "Yes, utm.one auto-rules UTM parameters ensuring consistency. Short.io has no UTM governance features." },
    { question: "How does utm.one handle QR attribution?", answer: "utm.one provides full QR code attribution. Short.io does not offer QR attribution features." }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs Short.io", url: "https://utm.one/compare/short-io" }
  ];

  return (
    <>
      <SEO 
        title="utm.one vs Short.io - Comparison"
        description="Short.io handles short links. utm.one handles trust, clarity, metadata, accessibility, and governance."
        canonical="https://utm.one/compare/short-io"
      />
      <ArticleSchema
        headline="utm.one vs Short.io - Link Management Comparison"
        description="Short.io handles short links. utm.one handles trust, clarity, metadata, accessibility, and governance."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise link management platform with trust, clarity, metadata, accessibility, and governance"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="short.io"
        category="link shortening + basic features"
        headline="utm.one vs short.io"
        subheadline="short.io handles short links. utm.one handles trust, clarity, metadata, accessibility, and governance."
        summary={{
          line1: "short.io is functional",
          line2: "utm.one is foundational"
        }}
        features={[
          { capability: "previews", utmOne: true, competitor: "limited" },
          { capability: "semantic slugs", utmOne: true, competitor: "partial" },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "link permanence", utmOne: true, competitor: false },
          { capability: "UTMs auto-ruled", utmOne: true, competitor: false },
          { capability: "qr attribution", utmOne: true, competitor: false },
          { capability: "partner links", utmOne: true, competitor: false },
          { capability: "unlimited users", utmOne: true, competitor: false },
          { capability: "pricing fairness", utmOne: true, competitor: "mixed" },
        ]}
        whitespace={{
          headline: "one is for shortening. one is for GTM clarity",
          points: [
            "trust indicators built-in",
            "semantic link structure",
            "metadata for AI systems",
            "accessibility compliance",
            "clean governance rules",
            "qr code attribution"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who short.io is for",
          points: [
            "basic shortening needs",
            "simple campaigns",
            "limited tracking"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "go-to-market teams",
            "enterprise operations",
            "structured attribution",
            "governance-first orgs"
          ]
        }}
        ctaText="explore utm.one"
      />
    </>
  );
};

export default UtmOneVsShortIo;
