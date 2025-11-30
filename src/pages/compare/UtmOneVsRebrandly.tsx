import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsRebrandly = () => {
  return (
    <>
      <SEO 
        title="utm.one vs Rebrandly - Comparison"
        description="Rebrandly focuses on branded URLs. utm.one focuses on clarity, trust, accessibility, and structured attribution."
        canonical="https://utm.one/compare/rebrandly"
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
