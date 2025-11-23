import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const RunRateTerm = () => {
  return (
    <GlossaryTermLayout
      term="Run-Rate"
      category="Marketing Operations"
      quickDefinition="Current period's revenue annualized, projecting yearly performance based on recent trajectory."
      fullDefinition={[
        "Run-Rate = Current Month's Revenue × 12 (or Current Quarter's Revenue × 4). Example: $100K MRR in March = $1.2M annual run-rate. Used for: investor updates (shows momentum), hiring decisions (revenue supports headcount), budget planning (projects runway). Run-rate assumes current trajectory continues—dangerous assumption for early-stage companies with high volatility.",
        "Run-rate limitations: ignores seasonality (Q4 ecommerce spike doesn't repeat in Q1), assumes linear growth (early wins don't guarantee scale), overlooks churn (new MRR today might churn in 6 months). Better metric: forward 12-month ARR (includes churn, expansion, known seasonality). Use run-rate for directional planning, not board commitments."
      ]}
      relatedTerms={[
        { slug: "arr", term: "ARR (Annual Recurring Revenue)", category: "B2B SaaS" },
        { slug: "mrr", term: "MRR (Monthly Recurring Revenue)", category: "B2B SaaS" },
        { slug: "commit-forecast", term: "Commit Forecast", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default RunRateTerm;
