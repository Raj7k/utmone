import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const BidStrategyTerm = () => {
  return (
    <GlossaryTermLayout
      term="Bid Strategy"
      category="Marketing Operations"
      quickDefinition="Automated or manual approach determining how much to pay per click/impression to optimize campaign goals."
      fullDefinition={[
        "Bid Strategies include: Manual CPC (you set max bid per click, full control but labor-intensive), Maximize Clicks (automated bid to get most clicks within budget, good for awareness), Target CPA (automated bid to hit cost-per-acquisition goal, requires conversion tracking), Target ROAS (automated bid to hit return-on-ad-spend target, advanced optimization), Maximize Conversions (automated bid for most conversions regardless of cost, use with caution).",
        "Choosing strategy: early campaigns use Manual CPC (learn baseline costs), established campaigns use Target CPA (optimize efficiency), mature campaigns use Target ROAS (optimize profit). Automated strategies require 30+ conversions/month minimum for algorithm training. Common mistake: switching strategies too frequently (resets learning, tanks performance for 2-4 weeks)."
      ]}
      relatedTerms={[
        { slug: "quality-score", term: "Quality Score", category: "Marketing Operations" },
        { slug: "paid-search", term: "Paid Search", category: "Marketing Channels" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default BidStrategyTerm;
