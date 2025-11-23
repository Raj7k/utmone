import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const SALTerm = () => {
  return (
    <GlossaryTermLayout
      term="SAL (Sales Accepted Lead)"
      category="Sales & RevOps"
      quickDefinition="A marketing qualified lead (MQL) that sales team has accepted for follow-up, representing the formal handoff from marketing to sales development."
      fullDefinition={[
        "A Sales Accepted Lead (SAL) is a marketing qualified lead that sales team agrees to pursue. The SAL stage exists to prevent leads from getting lost in the marketing→sales handoff and to measure how many marketing-generated MQLs sales actually accepts versus rejects. SAL sits between MQL (marketing says ready) and SQL (sales confirms qualified).",
        "Many organizations don't use explicit SAL stage, jumping directly from MQL to SQL. However, SAL becomes valuable when there's friction between marketing and sales—if sales frequently rejects or ignores MQLs, tracking SAL acceptance rates reveals the problem. Low MQL→SAL rates (below 70%) indicate marketing-sales misalignment on lead quality definition.",
        "SAL tracking also prevents leads from falling through cracks in handoff process. Without SAL, an MQL might sit uncontacted for days because no one 'owned' it yet. SAL stage forces explicit acceptance: SDR reviews MQL, decides to accept or reject, and system tracks response time, acceptance rate, and rejection reasons.",
        "Common rejection reasons tracked at SAL stage include: wrong company size/industry, insufficient contact information, duplicate lead, competitor researching, student/job seeker, geographic mismatch, or engagement threshold too low. Analyzing SAL rejection patterns helps marketing refine MQL criteria to pass better leads."
      ]}
      whenToUse="Use SAL classification when experiencing marketing-sales friction over lead quality, leads getting lost in handoff process, need accountability for sales follow-up, want to measure SDR responsiveness, or optimizing the MQL→SQL funnel with intermediate checkpoint."
      whenNotToUse="Don't use SAL if marketing-sales lead quality alignment is strong (extra stage adds friction), have automated lead routing working well, small sales team where handoff is seamless, or self-serve product without sales involvement."
      commonMistakes={[
        "Not tracking SAL acceptance rate by UTM source (can't optimize marketing for sales-acceptable leads)",
        "Sales team auto-accepting all MQLs without review (SAL stage becomes meaningless)",
        "Not requiring rejection reason when SDR declines MQL (can't improve lead quality)",
        "Marketing ignoring SAL rejection patterns and continuing to send similar low-quality leads",
        "Measuring SAL conversion without tracking time-to-acceptance (leads going stale)"
      ]}
      goodExamples={[
        "Dashboard showing MQL→SAL acceptance rate by UTM campaign (identifies which marketing sources sales trusts)",
        "Weekly marketing-sales meeting reviewing SAL rejection reasons and refining MQL criteria",
        "SLA requiring SDR to accept or reject MQL within 24 hours (prevents leads going stale)",
        "Automated rejection taxonomy capturing why SDRs decline MQLs for marketing optimization"
      ]}
      badExamples={[
        "Treating SAL as checkbox exercise without analyzing acceptance patterns",
        "SDRs accepting MQLs but never following up (acceptance doesn't mean action)",
        "Not connecting SAL acceptance rates back to UTM source data",
        "Marketing hitting MQL targets but SAL acceptance is only 40% (quality problem)"
      ]}
      relatedTerms={[
        { slug: "mql", term: "MQL (Marketing Qualified Lead)", category: "Sales & RevOps" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" },
        { slug: "lead-scoring", term: "Lead Scoring", category: "Sales & RevOps" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track", type: "guide" }
      ]}
    />
  );
};

export default SALTerm;
