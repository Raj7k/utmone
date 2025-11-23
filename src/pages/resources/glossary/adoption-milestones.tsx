import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const AdoptionMilestonesTerm = () => {
  return (
    <GlossaryTermLayout
      term="Adoption Milestones"
      category="Customer Success"
      quickDefinition="Predefined usage benchmarks indicating successful product integration and value realization stages."
      fullDefinition={[
        "Adoption Milestones are sequential checkpoints measuring product penetration: Milestone 1 (admin setup complete: integrations connected, users invited, permissions configured), Milestone 2 (first value achieved: first project/deal/campaign completed), Milestone 3 (regular usage established: 70%+ invited users active weekly), Milestone 4 (advanced features adopted: using 3+ modules, automation enabled, reporting configured), Milestone 5 (deep integration: product embedded in daily workflow, multiple teams using, executive dashboards live).",
        "Customers hitting all 5 milestones within 90 days have 5-10× lower churn than those stalling at Milestone 2. CSMs track milestone progression via: automated dashboards (flag accounts behind schedule), outreach triggers (email campaigns for stuck accounts), success plays (tailored tactics per stalled milestone). Example milestones for CRM: M1 = 10 contacts added, M2 = first deal won, M3 = pipeline forecast accurate, M4 = mobile app usage 50%+, M5 = sales methodology customized."
      ]}
      relatedTerms={[
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "time-to-value", term: "Time-to-Value", category: "Customer Success" },
        { slug: "health-score", term: "Health Score", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default AdoptionMilestonesTerm;
