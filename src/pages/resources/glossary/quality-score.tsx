import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const QualityScoreTerm = () => {
  return (
    <GlossaryTermLayout
      term="Quality Score"
      category="Marketing Operations"
      quickDefinition="Platform-assigned metric rating ad relevance, landing page experience, and expected CTR."
      fullDefinition={[
        "Quality Score (Google Ads 1-10 scale) evaluates: keyword-ad relevance (does ad copy match search query?), landing page experience (page load speed, mobile-friendliness, content relevance), expected click-through rate (historical CTR vs benchmark). Higher scores = lower CPCs and better ad positions.",
        "Improving Quality Score: match ad copy to keyword intent exactly (avoid generic ads), create dedicated landing pages per ad group (not homepage), optimize page speed under 2 seconds, include keyword in headline + first paragraph, add clear CTA matching ad promise. Moving from QS 5 to QS 8 can reduce CPC by 30-50% while improving average position from 3rd to 1st page."
      ]}
      relatedTerms={[
        { slug: "paid-search", term: "Paid Search", category: "Marketing Channels" },
        { slug: "bid-strategy", term: "Bid Strategy", category: "Marketing Operations" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default QualityScoreTerm;
