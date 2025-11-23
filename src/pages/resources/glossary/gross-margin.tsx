import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const GrossMarginTerm = () => {
  return (
    <GlossaryTermLayout
      term="Gross Margin"
      category="Marketing Operations"
      quickDefinition="Revenue minus cost of goods sold, expressed as percentage, measuring core product profitability before operating expenses."
      fullDefinition={[
        "Gross Margin = (Revenue - COGS) ÷ Revenue × 100. COGS for SaaS includes: hosting/infrastructure (AWS, Azure, GCP), payment processing fees (Stripe 2.9% + $0.30), customer support (success team salaries), professional services (implementation, training). Example: $1M ARR - $200K COGS = $800K gross profit = 80% gross margin.",
        "SaaS benchmarks: 70-80% gross margin = healthy (sustainable unit economics), 80-85% = excellent (efficient scaling), 85-90% = world-class (Salesforce, Zoom, Atlassian territory), under 70% = concerning (may indicate inefficient architecture, high support costs, or services revenue dragging down margin). Gross margin funds sales/marketing/R&D; companies under 70% struggle to fund growth at scale."
      ]}
      relatedTerms={[
        { slug: "cac", term: "CAC (Customer Acquisition Cost)", category: "B2B SaaS" },
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" },
        { slug: "cac-payback-period", term: "CAC Payback Period", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default GrossMarginTerm;
