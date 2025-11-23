import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const PipelineCoverageRatioTerm = () => {
  return (
    <GlossaryTermLayout
      term="Pipeline Coverage Ratio"
      category="Marketing Operations"
      quickDefinition="Total pipeline value divided by quota, indicating sufficient opportunity to hit revenue targets."
      fullDefinition={[
        "Pipeline Coverage = Total Pipeline Value ÷ Quota. Example: $5M pipeline ÷ $1M quota = 5× coverage. Rule of thumb: need 3-5× coverage depending on win rates. At 25% win rate, 4× coverage required ($4M pipeline to hit $1M quota). At 50% win rate, 2× coverage sufficient.",
        "Coverage analysis: under 2× = pipeline crisis (urgent lead gen needed), 2-3× = risky (one deal slip misses quota), 3-5× = healthy (buffer absorbs losses), 5-8× = strong (expansion opportunities), 8×+ = sandbagging or unrealistic pipeline. Track coverage by: rep (identify struggling sellers), segment (enterprise vs SMB requirements differ), time period (Q1 vs Q4 seasonality)."
      ]}
      relatedTerms={[
        { slug: "commit-forecast", term: "Commit Forecast", category: "Marketing Operations" },
        { slug: "pipeline", term: "Pipeline", category: "Sales & RevOps" },
        { slug: "funnel-math", term: "Funnel Math", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default PipelineCoverageRatioTerm;
