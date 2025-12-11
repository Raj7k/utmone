import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsPartnerstack = () => {
  const faqs = [
    { question: "What's the main difference between utm.one and PartnerStack?", answer: "PartnerStack manages complex partner ecosystems. utm.one makes partner links clean, trusted, and trackable with simple governance." },
    { question: "Does utm.one support clean links?", answer: "Yes, utm.one provides clean, semantic links with trust previews. PartnerStack offers limited clean link features." },
    { question: "Is utm.one accessible?", answer: "Yes, utm.one is built with AAA accessibility compliance. PartnerStack does not prioritize accessibility standards." },
    { question: "Can I use utm.one for QR attribution?", answer: "Yes, utm.one provides branded QR codes with full attribution. PartnerStack does not offer QR features." },
    { question: "How does utm.one compare on pricing?", answer: "utm.one offers simple, transparent pricing. PartnerStack has enterprise-level pricing that can be complex." }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs PartnerStack", url: "https://utm.one/compare/partnerstack" }
  ];

  return (
    <>
      <SEO 
        title="utm.one vs PartnerStack - Comparison"
        description="PartnerStack manages partner ecosystems. utm.one makes partner links clean, trusted, and trackable."
        canonical="https://utm.one/compare/partnerstack"
      />
      <ArticleSchema
        headline="utm.one vs PartnerStack - Partner Ecosystem Comparison"
        description="PartnerStack manages partner ecosystems. utm.one makes partner links clean, trusted, and trackable."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise partner attribution platform with clean links, simple UX, and transparent pricing"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="partnerstack"
        category="full partner ecosystem tools"
        headline="utm.one vs partnerstack"
        subheadline="partnerstack manages partner ecosystems. utm.one makes partner links clean, trusted, and trackable."
        summary={{
          line1: "partnerstack is complex & powerful",
          line2: "utm.one is simple & predictable"
        }}
        features={[
          { capability: "clean links", utmOne: true, competitor: "limited" },
          { capability: "qr attribution", utmOne: true, competitor: false },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "UTMs enforced", utmOne: true, competitor: false },
          { capability: "clean-track", utmOne: true, competitor: false },
          { capability: "simple UX", utmOne: true, competitor: false },
          { capability: "partner onboarding", utmOne: "simple", competitor: "heavy" },
          { capability: "pricing", utmOne: "simple", competitor: "enterprise" },
        ]}
        whitespace={{
          headline: "perfect for teams that want clarity, not overhead",
          points: [
            "simple interface",
            "clean partner links",
            "qr attribution",
            "metadata built-in",
            "accessible design",
            "transparent pricing"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who partnerstack is for",
          points: [
            "large partner ecosystems",
            "complex workflows",
            "enterprise budgets"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "clarity-first teams",
            "simple partner programs",
            "clean attribution",
            "transparent operations"
          ]
        }}
        ctaText="see utm.one partner program"
      />
    </>
  );
};

export default UtmOneVsPartnerstack;
