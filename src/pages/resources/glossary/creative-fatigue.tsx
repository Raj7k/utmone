import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CreativeFatigueTerm = () => {
  return (
    <GlossaryTermLayout
      term="Creative Fatigue"
      category="Marketing Operations"
      quickDefinition="Performance decline when target audience repeatedly sees same ad creative, reducing engagement over time."
      fullDefinition={[
        "Creative Fatigue occurs when: CTR drops 30%+ from peak, CPC increases despite stable Quality Score, frequency reaches 5-7× (same user sees ad 5-7 times), engagement rate plateaus then declines. Paid social fatigues faster (7-14 days) than paid search (30-60 days) because social users scroll passively while search users have active intent.",
        "Combating fatigue: rotate 3-5 creative variants every 2 weeks, refresh ad copy while keeping winning hooks, test new formats (static → video → carousel), expand audience targeting (reduce frequency), pause underperforming ads before CPC spirals. Facebook recommends refreshing creatives every 14 days; LinkedIn every 30 days. Set frequency cap at 3× per week to prevent overexposure."
      ]}
      relatedTerms={[
        { slug: "paid-social", term: "Paid Social", category: "Marketing Channels" },
        { slug: "bid-strategy", term: "Bid Strategy", category: "Marketing Operations" },
        { slug: "quality-score", term: "Quality Score", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default CreativeFatigueTerm;
