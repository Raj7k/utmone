import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ReactivationCampaignTerm = () => {
  return (
    <GlossaryTermLayout
      term="Reactivation Campaign"
      category="Customer Success"
      quickDefinition="Targeted outreach re-engaging churned or inactive customers to restore product usage and subscription."
      fullDefinition={[
        "Reactivation Campaign targets: churned customers (cancelled within 12 months, retention easier than new acquisition), inactive users (paying but not using product, likely to churn at renewal), dormant accounts (free/trial users who never converted). Campaigns use: email sequences (3-5 touch campaign highlighting new features, offering discounts), retargeting ads (product updates, case studies, win-back offers), direct outreach (CSM/sales calls for high-value accounts).",
        "Win-back tactics: 'What did we miss?' survey (understand churn reasons, show you care), feature highlight (new capabilities addressing original pain points), special pricing (20-30% discount, waived setup fees, extended trial), case study proof (show how similar customers now succeed), executive outreach (CEO/founder personal email for strategic accounts). Win-back rates: 5-15% for voluntary churn, 40-60% for involuntary churn (failed payment), 20-30% for inactive-but-paying. Cost to reactivate = 30-50% of new acquisition cost."
      ]}
      relatedTerms={[
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "early-churn-signals", term: "Early Churn Signals", category: "Customer Success" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default ReactivationCampaignTerm;
