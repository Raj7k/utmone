import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsFirstpromoter = () => {
  return (
    <>
      <SEO 
        title="utm.one vs FirstPromoter - Comparison"
        description="FirstPromoter tracks affiliates. utm.one creates clean, trustworthy partner links."
        canonical="https://utm.one/compare/firstpromoter"
      />
      <ComparisonPage
        competitor="firstpromoter"
        category="affiliate program tools"
        headline="utm.one vs firstpromoter"
        subheadline="firstpromoter tracks affiliates. utm.one creates clean, trustworthy partner links."
        summary={{
          line1: "firstpromoter is payout-first",
          line2: "utm.one is attribution-first"
        }}
        features={[
          { capability: "partner links", utmOne: true, competitor: true },
          { capability: "qr codes", utmOne: true, competitor: false },
          { capability: "trust previews", utmOne: true, competitor: false },
          { capability: "safety scan", utmOne: true, competitor: false },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "UTMs auto", utmOne: true, competitor: false },
          { capability: "link governance", utmOne: true, competitor: false },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "unlimited users", utmOne: true, competitor: false },
        ]}
        whitespace={{
          headline: "your strongest differentiation is clarity",
          points: [
            "clean partner links",
            "trust indicators",
            "qr attribution",
            "semantic slugs",
            "metadata for AI",
            "governance built-in"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who firstpromoter is for",
          points: [
            "affiliate payouts",
            "commission tracking",
            "basic referral management"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "clean attribution",
            "structured tracking",
            "partner clarity",
            "governance-first teams"
          ]
        }}
        ctaText="explore utm.one for partner teams"
      />
    </>
  );
};

export default UtmOneVsFirstpromoter;
