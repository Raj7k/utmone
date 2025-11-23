import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ChurnTerm = () => {
  return (
    <GlossaryTermLayout
      term="Churn Rate"
      category="B2B SaaS"
      quickDefinition="Percentage of customers or revenue lost in a period due to cancellations, measuring customer retention and product stickiness."
      fullDefinition={[
        "Churn Rate measures customer attrition. Customer Churn = (Customers Lost ÷ Starting Customers) × 100. Revenue Churn = (MRR Lost ÷ Starting MRR) × 100. If you started January with 100 customers, lost 5, customer churn = 5%. Best-in-class SaaS targets under 5% annual churn for SMB, under 10% for enterprise.",
        "Analyzing churn by acquisition source (via UTM tracking) reveals which marketing channels attract customers who stick versus churn quickly. High-volume paid social might show 30% higher churn than lower-volume organic search—making organic the better long-term channel despite slower growth."
      ]}
      relatedTerms={[
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "cohort", term: "Cohort Analysis", category: "Sales & RevOps" },
        { slug: "mrr", term: "MRR (Monthly Recurring Revenue)", category: "B2B SaaS" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default ChurnTerm;
