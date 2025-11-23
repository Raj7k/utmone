import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const PilotSuccessCriteriaTerm = () => {
  return (
    <GlossaryTermLayout
      term="Pilot Success Criteria"
      category="Marketing Operations"
      quickDefinition="Predefined metrics and outcomes determining whether trial/proof-of-concept justifies full purchase."
      fullDefinition={[
        "Pilot Success Criteria define binary pass/fail conditions: technical criteria (system integrates successfully, meets performance SLAs, passes security review), business criteria (achieves 20% time savings, reduces error rate by 30%, improves conversion by 15%), adoption criteria (80% of pilot users active weekly, 5+ use cases validated, executive sponsor endorses). Document in mutual success plan signed by both parties before pilot starts.",
        "Common mistakes: vague criteria ('must work well'), moving goalposts mid-pilot ('now we need feature X too'), no exec buy-in (IT validates but business stakeholder wasn't involved). Best practice: 3-5 quantifiable success criteria, validated by both technical and business stakeholders, with clear measurement methodology. Pilots meeting all criteria should have 90%+ close rate; if lower, criteria aren't selective enough or sales qualification is weak."
      ]}
      relatedTerms={[
        { slug: "technical-validation", term: "Technical Validation", category: "Marketing Operations" },
        { slug: "solution-mapping", term: "Solution Mapping", category: "Marketing Operations" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default PilotSuccessCriteriaTerm;
