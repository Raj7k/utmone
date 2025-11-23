import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const UsageThresholdTerm = () => {
  return (
    <GlossaryTermLayout
      term="Usage Threshold"
      category="PLG & Product-Led"
      quickDefinition="Predefined usage limit triggering upgrade prompts, paywalls, or sales outreach when user reaches boundary."
      fullDefinition={[
        "Usage Threshold is a strategic limit built into freemium/trial tiers that forces conversion decisions. Examples: 100 API calls/month, 5 team members, 10 projects, 1GB storage. When hit, users face: hard paywall (feature stops working), soft paywall (annoying prompts but still functional), or sales outreach (high-value accounts flagged for human follow-up).",
        "Effective thresholds balance: low enough that power users hit them (creating upgrade urgency) but high enough that casual users find value (avoiding premature churn). Best practice: set threshold at 60-70% of typical paid user's usage—forces upgrade before frustration sets in. PLG companies A/B test threshold levels: Slack tested 10K vs 5K message limits, Dropbox tested 2GB vs 5GB storage caps, Calendly tested 1 vs 2 event types."
      ]}
      relatedTerms={[
        { slug: "pql", term: "PQL (Product Qualified Lead)", category: "PLG & Product-Led" },
        { slug: "self-serve-conversion", term: "Self-Serve Conversion", category: "PLG & Product-Led" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default UsageThresholdTerm;
