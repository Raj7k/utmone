import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CACTerm = () => {
  return (
    <GlossaryTermLayout
      term="CAC (Customer Acquisition Cost)"
      category="B2B SaaS"
      quickDefinition="Total sales and marketing spend divided by number of new customers acquired in a period."
      fullDefinition={[
        "Customer Acquisition Cost (CAC) measures how much you spend to acquire one customer. Formula: (Sales + Marketing Expenses) ÷ New Customers Acquired. If you spent $100K on marketing and sales last month and acquired 50 customers, CAC = $2,000. CAC must be significantly lower than Lifetime Value (LTV) for sustainable business model.",
        "CAC payback period measures how long it takes to recover acquisition cost from subscription revenue. If CAC is $2,000 and customer pays $200/month, payback is 10 months. Best-in-class SaaS targets under 12-month payback. CAC by channel (via UTM tracking) reveals which marketing sources deliver most efficient customer acquisition."
      ]}
      relatedTerms={[
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" },
        { slug: "arr", term: "ARR (Annual Recurring Revenue)", category: "B2B SaaS" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Framework", url: "/resources/frameworks/attribution-clarity", type: "framework" },
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default CACTerm;
