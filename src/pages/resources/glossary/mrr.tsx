import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const MRRTerm = () => {
  return (
    <GlossaryTermLayout
      term="MRR (Monthly Recurring Revenue)"
      category="B2B SaaS"
      quickDefinition="Predictable monthly subscription revenue normalized from all active customers, excluding one-time payments and variable usage."
      fullDefinition={[
        "Monthly Recurring Revenue (MRR) is the monthly value of all active subscriptions. For annual contracts, MRR is annual contract value ÷ 12. For monthly subscriptions, it's the sum of all monthly fees. MRR only counts recurring revenue—not setup fees, consulting, or one-time charges. It's the foundational SaaS metric for tracking growth momentum.",
        "MRR movement breaks down into: New MRR (new customers), Expansion MRR (upgrades/upsells), Contraction MRR (downgrades), Churned MRR (cancellations). Net New MRR = New + Expansion - Contraction - Churn. Strong SaaS companies achieve negative net churn (expansion > contraction + churn), meaning existing customers generate growth even without new customers."
      ]}
      relatedTerms={[
        { slug: "arr", term: "ARR (Annual Recurring Revenue)", category: "B2B SaaS" },
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default MRRTerm;
