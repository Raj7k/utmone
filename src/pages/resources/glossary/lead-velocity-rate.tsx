import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LeadVelocityRateTerm = () => {
  return (
    <GlossaryTermLayout
      term="Lead Velocity Rate"
      category="Marketing Operations"
      quickDefinition="Month-over-month percentage growth in qualified leads, predicting future revenue momentum."
      fullDefinition={[
        "Lead Velocity Rate (LVR) = ((This Month's Qualified Leads - Last Month's Qualified Leads) ÷ Last Month's Qualified Leads) × 100. Example: 120 SQLs this month vs 100 last month = 20% LVR. This leading indicator forecasts revenue growth 6-12 months ahead since leads convert to revenue with lag time.",
        "Why LVR matters more than closed revenue: revenue is lagging (reflects deals closed 3-6 months ago), LVR is leading (shows pipeline being built today). Consistent 10%+ monthly LVR typically translates to 3× revenue growth annually. Negative LVR = future revenue problems even if current revenue looks healthy."
      ]}
      relatedTerms={[
        { slug: "funnel-math", term: "Funnel Math", category: "Marketing Operations" },
        { slug: "pipeline-coverage-ratio", term: "Pipeline Coverage Ratio", category: "Marketing Operations" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default LeadVelocityRateTerm;
