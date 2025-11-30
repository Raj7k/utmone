import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsBlInk = () => {
  return (
    <>
      <SEO 
        title="utm.one vs Bl.ink - Comparison"
        description="Bl.ink is enterprise-heavy. utm.one is enterprise-clear."
        canonical="https://utm.one/compare/bl-ink"
      />
      <ComparisonPage
        competitor="bl.ink"
        category="enterprise link management"
        headline="utm.one vs bl.ink"
        subheadline="bl.ink is enterprise-heavy. utm.one is enterprise-clear."
        summary={{
          line1: "bl.ink solves scale",
          line2: "utm.one solves clarity"
        }}
        features={[
          { capability: "lightweight UI", utmOne: true, competitor: false },
          { capability: "semantic slugs", utmOne: true, competitor: false },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "governance", utmOne: "simple", competitor: "complex" },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "link permanence", utmOne: true, competitor: false },
          { capability: "previews", utmOne: true, competitor: "partial" },
          { capability: "partner links", utmOne: true, competitor: false },
          { capability: "qr attribution", utmOne: true, competitor: false },
          { capability: "fair pricing", utmOne: true, competitor: false },
        ]}
        whitespace={{
          headline: "no clutter. no overwhelm. no hidden pricing",
          points: [
            "simple interface",
            "clear governance",
            "transparent pricing",
            "accessible design",
            "metadata built-in",
            "trust indicators"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who bl.ink is for",
          points: [
            "large enterprises",
            "complex workflows",
            "heavy customization needs"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "teams seeking clarity",
            "simple governance",
            "transparent operations",
            "modern GTM teams"
          ]
        }}
        ctaText="see why teams switch"
      />
    </>
  );
};

export default UtmOneVsBlInk;
