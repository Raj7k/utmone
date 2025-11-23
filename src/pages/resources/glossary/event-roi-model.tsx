import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const EventROIModelTerm = () => {
  return (
    <GlossaryTermLayout
      term="Event ROI Model"
      category="Marketing Operations"
      quickDefinition="Framework calculating event profitability by comparing total costs against pipeline and revenue generated."
      fullDefinition={[
        "Event ROI = (Pipeline Generated × Win Rate × Average Deal Size - Total Event Cost) ÷ Total Event Cost × 100. Example: $500K pipeline × 25% win rate × $50K ACV = $625K revenue vs $100K event cost = 525% ROI. Costs include: booth fees, travel, staff time, swag, pre-event marketing, post-event follow-up.",
        "ROI tracking challenges: attribution (event influenced but didn't source deal?), time lag (pipeline takes 6-12 months to close), multi-touch (event + webinar + demo all contributed). Best practice: track pipeline influenced (any deal with event touchpoint) not just sourced (first touch was event). Strong event ROI = 3-5× total cost in closed revenue within 12 months."
      ]}
      relatedTerms={[
        { slug: "booth-engagement-rate", term: "Booth Engagement Rate", category: "Marketing Operations" },
        { slug: "pipeline-influence", term: "Pipeline Influence", category: "Marketing Operations" },
        { slug: "pipeline", term: "Pipeline", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Event-Led Growth Playbook", url: "/resources/playbooks/event-led-growth", type: "playbook" }
      ]}
    />
  );
};

export default EventROIModelTerm;
