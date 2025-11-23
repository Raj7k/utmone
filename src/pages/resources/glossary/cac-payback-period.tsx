import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CACPaybackPeriodTerm = () => {
  return (
    <GlossaryTermLayout
      term="CAC Payback Period"
      category="Marketing Operations"
      quickDefinition="Time required to recover customer acquisition costs through gross margin, measuring sales/marketing efficiency."
      fullDefinition={[
        "CAC Payback = CAC ÷ (Monthly Recurring Revenue × Gross Margin %). Example: $5,000 CAC ÷ ($500 MRR × 80% margin) = $5,000 ÷ $400 = 12.5 months to break even. After 12.5 months, all revenue is profit. Shorter payback = faster cash recovery = ability to reinvest in growth.",
        "Benchmarks: under 12 months = excellent (can scale aggressively), 12-18 months = healthy (sustainable growth), 18-24 months = acceptable (slower scaling), 24+ months = problematic (cash-intensive, risky if churn high). Enterprise SaaS tolerates longer payback (18-24 months) due to higher LTV and stickiness. SMB must hit under 12 months or cash burn becomes unsustainable. Reduce payback by: lowering CAC (more efficient marketing), increasing MRR (upselling), improving gross margin (reducing COGS)."
      ]}
      relatedTerms={[
        { slug: "cac", term: "CAC (Customer Acquisition Cost)", category: "B2B SaaS" },
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" },
        { slug: "gross-margin", term: "Gross Margin", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default CACPaybackPeriodTerm;
