import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsBitly = () => {
  return (
    <>
      <SEO 
        title="utm.one vs Bitly - Comparison"
        description="Bitly shortens links. utm.one builds trust, structure, metadata, accessibility, and attribution around them."
        canonical="https://utm.one/compare/bitly"
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
