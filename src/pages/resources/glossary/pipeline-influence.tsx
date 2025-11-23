import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const PipelineInfluenceTerm = () => {
  return (
    <GlossaryTermLayout
      term="Pipeline Influence"
      category="Marketing Operations"
      quickDefinition="Percentage of closed deals where marketing touchpoint occurred anywhere in customer journey."
      fullDefinition={[
        "Pipeline Influence = (Deals with ANY Marketing Touchpoint ÷ Total Deals Closed) × 100. Example: 80 of 100 closed deals had marketing touchpoint (webinar, event, content download, email open) = 80% influenced. More generous than 'sourced' (first touch) but shows marketing's true impact across buyer journey.",
        "Influenced vs Sourced: Sourced (15-30% of deals, marketing created first touch), Influenced (70-85% of deals, marketing contributed somewhere), No Touch (15-30% of deals, pure outbound/referral). Track influence to: justify marketing budget (shows broader impact than sourced alone), identify high-influence channels (events might influence 60% of enterprise deals), optimize multi-touch journeys (understand content consumption patterns before purchase)."
      ]}
      relatedTerms={[
        { slug: "multi-touch", term: "Multi-Touch Attribution", category: "Analytics" },
        { slug: "pipeline", term: "Pipeline", category: "Sales & RevOps" },
        { slug: "event-roi-model", term: "Event ROI Model", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Model", url: "/resources/frameworks/attribution-clarity", type: "framework" }
      ]}
    />
  );
};

export default PipelineInfluenceTerm;
