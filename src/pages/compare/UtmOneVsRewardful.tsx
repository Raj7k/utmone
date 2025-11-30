import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";

const UtmOneVsRewardful = () => {
  return (
    <>
      <SEO 
        title="utm.one vs Rewardful - Comparison"
        description="Rewardful manages referrals. utm.one manages clean partner attribution."
        canonical="https://utm.one/compare/rewardful"
      />
      <ComparisonPage
        competitor="rewardful"
        category="affiliate + referral programs"
        headline="utm.one vs rewardful"
        subheadline="rewardful manages referrals. utm.one manages clean partner attribution."
        summary={{
          line1: "rewardful = referral logic",
          line2: "utm.one = trusted partner attribution"
        }}
        features={[
          { capability: "partner links", utmOne: true, competitor: true },
          { capability: "qr codes", utmOne: true, competitor: false },
          { capability: "link trust preview", utmOne: true, competitor: false },
          { capability: "metadata", utmOne: true, competitor: false },
          { capability: "UTMs enforced", utmOne: true, competitor: false },
          { capability: "clean-track", utmOne: true, competitor: false },
          { capability: "link governance", utmOne: true, competitor: false },
          { capability: "unlimited users", utmOne: true, competitor: false },
          { capability: "accessible slugs", utmOne: true, competitor: false },
          { capability: "pricing fairness", utmOne: true, competitor: "mixed" },
        ]}
        whitespace={{
          headline: "rewardful handles payouts. utm.one handles meaning, tracking, clarity",
          points: [
            "clean partner links",
            "qr code attribution",
            "trust previews",
            "metadata for discovery",
            "enforced UTM structure",
            "governance built-in"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who rewardful is for",
          points: [
            "payout management",
            "commission tracking",
            "basic referral programs"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "partner attribution",
            "clean tracking",
            "structured links",
            "governance-first teams"
          ]
        }}
        ctaText="try utm.one partner module"
      />
    </>
  );
};

export default UtmOneVsRewardful;
