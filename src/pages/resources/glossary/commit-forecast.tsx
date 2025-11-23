import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CommitForecastTerm = () => {
  return (
    <GlossaryTermLayout
      term="Commit Forecast"
      category="Marketing Operations"
      quickDefinition="High-confidence revenue prediction sales commits to delivering, typically 90%+ probability deals."
      fullDefinition={[
        "Commit Forecast represents deals sales leadership stakes their reputation on closing. Includes: contracts in legal review, verbal commitments from decision-makers, renewals with signed LOIs, expansion deals with approved budgets. Excludes: early-stage opportunities, deals without confirmed budget, prospects ghosting outreach. Commit typically equals 70-90% of quota.",
        "Commit vs Best-Case vs Pipeline: Commit (90%+ confidence, will definitely close), Best-Case (70-90% confidence, likely to close if no obstacles), Pipeline (all open opportunities, most won't close). CFOs rely on Commit for financial planning. Missing Commit forecast damages credibility; sandbagging (under-committing) creates revenue surprises but erodes trust in forecasting process."
      ]}
      relatedTerms={[
        { slug: "pipeline-coverage-ratio", term: "Pipeline Coverage Ratio", category: "Marketing Operations" },
        { slug: "pipeline", term: "Pipeline", category: "Sales & RevOps" },
        { slug: "run-rate", term: "Run-Rate", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default CommitForecastTerm;
