import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const SolutionMappingTerm = () => {
  return (
    <GlossaryTermLayout
      term="Solution Mapping"
      category="Marketing Operations"
      quickDefinition="Process aligning product capabilities to prospect's specific technical requirements and business use cases."
      fullDefinition={[
        "Solution Mapping documents: customer's technical requirements (integrations, security, compliance, performance), product capabilities matching requirements (feature matrix, use case examples, architecture diagrams), gap analysis (what's available now vs roadmap vs won't build), implementation approach (phased rollout, migration plan, training strategy). Deliverable is Solution Design Document used for technical validation and contracting.",
        "Typical for: enterprise deals over $100K ACV, complex technical environments (multi-system integrations), regulated industries (compliance requirements), custom implementation needs. Led by: sales engineer (pre-sales technical expert), solution architect (design implementation), product manager (roadmap alignment). Strong solution mapping reduces: late-stage objections (tech blockers identified early), implementation delays (requirements clear upfront), post-sale churn (expectations aligned)."
      ]}
      relatedTerms={[
        { slug: "technical-validation", term: "Technical Validation", category: "Marketing Operations" },
        { slug: "pilot-success-criteria", term: "Pilot Success Criteria", category: "Marketing Operations" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default SolutionMappingTerm;
