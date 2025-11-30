import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsTolt = () => {
  return (
    <>
      <SEO 
        title="utm.one vs Tolt - Comparison"
        description="Tolt helps you track referrals. utm.one ensures every referral link is clean, governed, trusted, and accessible."
        canonical="https://utm.one/compare/tolt"
      />
      <ComparisonPage
        competitor="tolt"
        category="simple affiliate tracking"
        headline="utm.one vs tolt"
        subheadline="tolt helps you track referrals. utm.one ensures every referral link is clean, governed, trusted, and accessible."
        summary={{
          line1: "tolt is simple",
          line2: "utm.one is structured"
        }}
        features={[
          { capability: "clean links", utmOne: true, competitor: false },
          { capability: "qr attribution", utmOne: true, competitor: false },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "accessibility", utmOne: "AAA", competitor: "no" },
          { capability: "UTMs", utmOne: "enforced", competitor: "none" },
          { capability: "clean-track", utmOne: true, competitor: false },
          { capability: "link governance", utmOne: true, competitor: false },
          { capability: "preview cards", utmOne: true, competitor: false },
          { capability: "trust indicators", utmOne: true, competitor: false },
        ]}
        whitespace={{
          headline: "tolt helps you track referrals. utm.one helps you build trust",
          points: [
            "clean link structure",
            "trust previews",
            "qr code attribution",
            "metadata for AI",
            "enforced UTM rules",
            "governance layer"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who tolt is for",
          points: [
            "simple referral tracking",
            "basic affiliate management",
            "minimal setup needs"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "structured attribution",
            "clean governance",
            "trust-first teams",
            "enterprise clarity"
          ]
        }}
        ctaText="get early access"
      />
    </>
  );
};

export default UtmOneVsTolt;
