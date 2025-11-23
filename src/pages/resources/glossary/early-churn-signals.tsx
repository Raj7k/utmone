import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const EarlyChurnSignalsTerm = () => {
  return (
    <GlossaryTermLayout
      term="Early Churn Signals"
      category="Customer Success"
      quickDefinition="Leading behavioral indicators predicting increased cancellation risk 30-90 days before formal churn occurs."
      fullDefinition={[
        {
          type: 'paragraph',
          content: "Early Churn Signals are usage/engagement patterns forecasting cancellation risk before renewal discussions. Common signals:"
        },
        {
          type: 'list',
          items: [
            "Login frequency drops 40%+ from baseline",
            "Admin user hasn't logged in 14+ days",
            "Support ticket volume spikes (frustration signals)",
            "Feature adoption plateaus (stopped exploring product)",
            "Team size shrinks (users deprovisioned, not replaced)",
            "NPS score drops below 6 or survey ignored",
            "QBR declined or rescheduled twice"
          ]
        },
        {
          type: 'paragraph',
          content: "CSMs monitor signals via automated dashboards flagging at-risk accounts. Response plays: executive outreach (CEO/VP email for high-value accounts), product training (refresher sessions addressing confusion), value audit (ROI recalculation showing forgotten wins), roadmap preview (upcoming features solving pain points). Catching signals 60 days pre-renewal allows sufficient save-play time vs. last-minute scrambles."
        }
      ]}
      relatedTerms={[
        { slug: "health-score", term: "Health Score", category: "Customer Success" },
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "renewal-motion", term: "Renewal Motion", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default EarlyChurnSignalsTerm;
