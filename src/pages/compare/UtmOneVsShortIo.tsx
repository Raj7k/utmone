import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsShortIo = () => {
  return (
    <>
      <SEO 
        title="utm.one vs Short.io - Comparison"
        description="Short.io handles short links. utm.one handles trust, clarity, metadata, accessibility, and governance."
        canonical="https://utm.one/compare/short-io"
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
