import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ConversionWaterfallTerm = () => {
  return (
    <GlossaryTermLayout
      term="Conversion Waterfall"
      category="Marketing Operations"
      quickDefinition="Sequential visualization showing drop-off rates at each funnel stage from awareness to purchase."
      fullDefinition={[
        "Conversion Waterfall displays: 10,000 visitors → 200 MQLs (2%) → 50 SQLs (25%) → 15 Opportunities (30%) → 5 Customers (33%). Each stage shows absolute count + conversion rate to next stage. Visual format (descending bars) makes bottlenecks obvious at a glance.",
        "Use waterfall analysis to: identify weakest funnel stage (lowest conversion rate = improvement priority), calculate compound conversion (2% × 25% × 30% × 33% = 0.05% visitor-to-customer), model impact of improvements (doubling MQL→SQL from 25% to 50% increases customers by 100%). Most funnels have one primary bottleneck—fix that first before optimizing other stages."
      ]}
      relatedTerms={[
        { slug: "funnel-math", term: "Funnel Math", category: "Marketing Operations" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "pipeline", term: "Pipeline", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default ConversionWaterfallTerm;
