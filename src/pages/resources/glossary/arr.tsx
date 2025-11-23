import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ARRTerm = () => {
  return (
    <GlossaryTermLayout
      term="ARR (Annual Recurring Revenue)"
      category="B2B SaaS"
      quickDefinition="Total value of recurring subscription revenue normalized to a one-year period, excluding one-time fees and variable usage charges."
      fullDefinition={[
        "Annual Recurring Revenue (ARR) is the yearly value of active subscription contracts, calculated by taking Monthly Recurring Revenue (MRR) and multiplying by 12, or summing all annual contract values. ARR only includes predictable recurring revenue—subscriptions—not one-time setup fees, consulting, or variable usage charges. It's the primary growth metric for SaaS businesses.",
        "ARR growth comes from four sources: New ARR (new customer subscriptions), Expansion ARR (existing customers upgrading), Contraction ARR (downgrades, lost), and Churned ARR (cancelled subscriptions). Net New ARR = New + Expansion - Contraction - Churn. Healthy SaaS targets 20-30%+ net ARR growth annually, with expansion offsetting churn.",
        "ARR enables apples-to-apples comparison across different billing cycles (monthly vs annual customers both contribute to ARR). It's used for SaaS valuation (typically 5-15× ARR multiple), growth rate benchmarking, and sales team quota setting. However, ARR is forward-looking (assumes renewals) and can be misleading if churn accelerates."
      ]}
      relatedTerms={[
        { slug: "mrr", term: "MRR (Monthly Recurring Revenue)", category: "B2B SaaS" },
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" },
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "cac", term: "CAC (Customer Acquisition Cost)", category: "B2B SaaS" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" }
      ]}
    />
  );
};

export default ARRTerm;
