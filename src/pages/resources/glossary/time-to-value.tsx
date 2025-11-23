import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const TimeToValueTerm = () => {
  return (
    <GlossaryTermLayout
      term="Time-to-Value"
      category="Customer Success"
      quickDefinition="Duration from signup to first meaningful outcome, measuring onboarding efficiency and product stickiness."
      fullDefinition={[
        "Time-to-Value (TTV) measures how quickly new users achieve their first 'aha moment'—the point where they experience tangible benefit. Examples: project management tool = first project created + task completed, CRM = first deal added + pipeline report generated, analytics tool = first dashboard built + insight discovered. Shorter TTV correlates with higher activation and lower churn.",
        "Industry benchmarks: PLG products target TTV under 5 minutes (Slack, Notion), mid-market SaaS targets 7-14 days (HubSpot, Salesforce), enterprise products target 30-60 days (complex implementations). Reducing TTV requires: streamlined onboarding (no unnecessary form fields), guided setup wizards (progressive disclosure of features), quick-win templates (pre-built dashboards, sample data), proactive support (chatbots, tooltips, videos). Companies reducing TTV by 50% often see 30-40% higher trial-to-paid conversion."
      ]}
      relatedTerms={[
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "implementation-plan", term: "Implementation Plan", category: "Customer Success" },
        { slug: "adoption-milestones", term: "Adoption Milestones", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default TimeToValueTerm;
