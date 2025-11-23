import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const PQLTerm = () => {
  return (
    <GlossaryTermLayout
      term="PQL (Product Qualified Lead)"
      category="PLG & Product-Led"
      quickDefinition="User demonstrating product value through usage behavior, indicating sales-readiness via product engagement rather than marketing signals."
      fullDefinition={[
        "Product Qualified Lead (PQL) is a user who has experienced meaningful product value through actual usage, signaling higher conversion likelihood than traditional marketing-qualified leads. Unlike MQLs (engagement with content), PQLs prove interest through action: completing activation milestones, hitting usage thresholds, or demonstrating purchase intent within the product itself.",
        "PQLs typically convert 5-10× better than MQLs because they've already validated product-market fit for themselves. Common PQL triggers: user invited 5+ teammates, created 10+ projects, used paid-tier-only feature multiple times, reached freemium limit 3 times in 7 days. PLG companies prioritize PQL scoring over traditional lead scoring, routing high-PQL users to sales while keeping low-PQL users in self-serve funnels."
      ]}
      relatedTerms={[
        { slug: "mql", term: "MQL (Marketing Qualified Lead)", category: "Sales & RevOps" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "self-serve-conversion", term: "Self-Serve Conversion", category: "PLG & Product-Led" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default PQLTerm;
