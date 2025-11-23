import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const RevenueRecognitionTerm = () => {
  return (
    <GlossaryTermLayout
      term="Revenue Recognition"
      category="Marketing Operations"
      quickDefinition="Rules for recording subscription revenue over contract term, matching revenue to delivery period not payment date."
      fullDefinition={[
        {
          type: 'paragraph',
          content: "Revenue Recognition defines when and how subscription revenue is recorded in financial statements. For SaaS companies, revenue is recognized ratably over the contract term—not when payment is received. Example: $12K annual contract paid upfront = $1K/month revenue recognition × 12 months. This matching principle ensures revenue reflects actual service delivery, not cash timing."
        },
        {
          type: 'paragraph',
          content: "Proper revenue recognition affects: ARR/MRR calculations (only count recognized revenue), deferred revenue liability (cash received but not yet earned), bookings vs revenue timing (signed contracts ≠ immediate revenue), expansion/contraction tracking (mid-contract changes spread over remaining term). Misaligned recognition creates misleading growth metrics and audit issues."
        }
      ]}
      relatedTerms={[
        { slug: "arr", term: "ARR (Annual Recurring Revenue)", category: "B2B SaaS" },
        { slug: "mrr", term: "MRR (Monthly Recurring Revenue)", category: "B2B SaaS" },
        { slug: "gross-margin", term: "Gross Margin", category: "Marketing Operations" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default RevenueRecognitionTerm;
