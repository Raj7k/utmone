import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsPartnerstack = () => {
  return (
    <>
      <SEO 
        title="utm.one vs PartnerStack - Comparison"
        description="PartnerStack manages partner ecosystems. utm.one makes partner links clean, trusted, and trackable."
        canonical="https://utm.one/compare/partnerstack"
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
