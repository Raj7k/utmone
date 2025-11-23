import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LTVTerm = () => {
  return (
    <GlossaryTermLayout
      term="LTV (Lifetime Value)"
      category="B2B SaaS"
      quickDefinition="Total revenue expected from a customer over entire relationship, critical for determining sustainable customer acquisition costs."
      fullDefinition={[
        "Lifetime Value (LTV) estimates total revenue a customer will generate before churning. Formula: Average Revenue Per User (ARPU) ÷ Churn Rate. If customers pay $100/month and churn rate is 5%/month, LTV = $100 ÷ 0.05 = $2,000. LTV must exceed CAC by 3× minimum for healthy unit economics (LTV:CAC ratio ≥ 3:1).",
        "Tracking LTV by acquisition source (via UTM) reveals which marketing channels generate most valuable long-term customers. Organic search might have higher CAC but 2× LTV versus paid social with lower CAC but higher churn—making organic the better investment despite higher upfront cost."
      ]}
      relatedTerms={[
        { slug: "cac", term: "CAC (Customer Acquisition Cost)", category: "B2B SaaS" },
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "arr", term: "ARR (Annual Recurring Revenue)", category: "B2B SaaS" },
        { slug: "cohort", term: "Cohort Analysis", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" },
        { title: "Attribution Clarity Framework", url: "/resources/frameworks/attribution-clarity", type: "framework" }
      ]}
    />
  );
};

export default LTVTerm;
