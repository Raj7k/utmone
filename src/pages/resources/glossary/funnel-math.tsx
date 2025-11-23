import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const FunnelMathTerm = () => {
  return (
    <GlossaryTermLayout
      term="Funnel Math"
      category="Marketing Operations"
      quickDefinition="Quantitative framework calculating required top-of-funnel volume to hit revenue targets given conversion rates."
      fullDefinition={[
        "Funnel Math works backward from revenue goal: $1M revenue target ÷ $50K average deal = 20 deals needed. At 25% win rate, need 80 qualified opportunities. At 10% MQL→SQL rate, need 800 MQLs. At 2% visitor→MQL rate, need 40K website visitors. This reverse-engineering reveals whether marketing capacity matches revenue ambitions.",
        "Critical for: budget planning (if math requires 100K visitors but budget only generates 20K, miss targets), hiring decisions (need more SDRs if SQL→Opp bottleneck exists), channel strategy (if paid search converts 5% vs organic 2%, prioritize paid). Most startups fail because they never do funnel math—they generate activity without understanding required volume."
      ]}
      relatedTerms={[
        { slug: "conversion-waterfall", term: "Conversion Waterfall", category: "Marketing Operations" },
        { slug: "pipeline-coverage-ratio", term: "Pipeline Coverage Ratio", category: "Marketing Operations" },
        { slug: "lead-velocity-rate", term: "Lead Velocity Rate", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default FunnelMathTerm;
