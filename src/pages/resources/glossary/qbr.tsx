import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const QBRTerm = () => {
  return (
    <GlossaryTermLayout
      term="QBR (Quarterly Business Review)"
      category="Customer Success"
      quickDefinition="Strategic check-in meeting reviewing customer goals, product usage, ROI metrics, and expansion opportunities."
      fullDefinition={[
        "Quarterly Business Review (QBR) is a structured customer meeting (typically 60-90 minutes) where CS teams present: usage analytics (adoption trends, feature utilization, user engagement), business impact (ROI calculations, KPI improvements, goal achievement), strategic roadmap (upcoming features, best practices, optimization recommendations), and expansion opportunities (additional seats, modules, integrations). QBRs reinforce value and identify upsell paths.",
        "Effective QBRs require: executive attendance (decision-makers present, not just end users), data-driven storytelling (charts showing ROI, not feature lists), forward-looking discussion (next 90-day goals, not just retrospectives), action items with ownership (clear next steps, not just information sharing). QBRs typically happen with customers spending $50K+ annually; smaller accounts get lighter quarterly touchpoints. Companies running structured QBRs achieve 15-25% higher net retention than those without."
      ]}
      relatedTerms={[
        { slug: "health-score", term: "Health Score", category: "Customer Success" },
        { slug: "renewal-motion", term: "Renewal Motion", category: "Customer Success" },
        { slug: "value-moments", term: "Value Moments", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default QBRTerm;
