import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ImplementationPlanTerm = () => {
  return (
    <GlossaryTermLayout
      term="Implementation Plan"
      category="Customer Success"
      quickDefinition="Structured roadmap guiding customer from purchase through full product deployment and team adoption."
      fullDefinition={[
        "Implementation Plan is a phased project plan (typically 30-90 days) outlining: discovery phase (requirements gathering, stakeholder interviews, success criteria definition), configuration phase (account setup, integrations, customizations, data migration), training phase (admin training, end-user workshops, documentation delivery), go-live phase (rollout plan, support coverage, performance monitoring). Enterprise deals require formal implementation plans; SMB uses lighter 'quick-start guides.'",
        "Strong implementation plans prevent: buyer's remorse (customers see value quickly, reducing early churn), scope creep (clear deliverables and timelines set expectations), support overload (proactive training reduces reactive tickets), slow adoption (phased rollouts with milestones keep momentum). Implementation typically led by: onboarding specialist (SMB/mid-market), dedicated implementation manager (enterprise), or professional services team (complex deployments requiring custom work)."
      ]}
      relatedTerms={[
        { slug: "time-to-value", term: "Time-to-Value", category: "Customer Success" },
        { slug: "adoption-milestones", term: "Adoption Milestones", category: "Customer Success" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default ImplementationPlanTerm;
