import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const HealthScoreTerm = () => {
  return (
    <GlossaryTermLayout
      term="Health Score"
      category="Customer Success"
      quickDefinition="Composite metric predicting customer retention likelihood based on product usage, engagement signals, and satisfaction indicators."
      fullDefinition={[
        "Health Score quantifies customer relationship strength via weighted formula combining: product usage frequency (daily active users, feature adoption depth), engagement signals (support tickets, NPS responses, QBR attendance), business outcomes (ROI achieved, goals met), and relationship health (executive sponsor identified, champion responsiveness). Scores typically range 0-100 with color coding: green (80+), yellow (50-79), red (below 50).",
        "CSMs use health scores to prioritize intervention: green = expansion opportunities, yellow = re-engagement campaigns, red = save plays. Effective scoring requires: leading indicators (usage drops before cancellation), weighted factors (login frequency matters more than total users), segment-specific thresholds (SMB vs enterprise scoring differs). Example formula: 40% usage + 30% engagement + 20% business outcomes + 10% relationship strength. Recalculated weekly or monthly to catch early churn signals."
      ]}
      relatedTerms={[
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "renewal-motion", term: "Renewal Motion", category: "Customer Success" },
        { slug: "early-churn-signals", term: "Early Churn Signals", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default HealthScoreTerm;
