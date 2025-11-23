import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const RenewalMotionTerm = () => {
  return (
    <GlossaryTermLayout
      term="Renewal Motion"
      category="Customer Success"
      quickDefinition="Structured process and timeline for managing subscription renewals, preventing churn through proactive engagement."
      fullDefinition={[
        "Renewal Motion is the systematic approach to securing contract renewals starting 90-180 days before expiration. Process includes: T-90 health check (usage audit, stakeholder mapping, risk assessment), T-60 value review (ROI documentation, case study creation, expansion identification), T-30 renewal proposal (pricing confirmation, paperwork initiation, executive alignment), T-0 close (signature collection, auto-renewal setup, renewal celebration).",
        "Strong renewal motions achieve 95%+ gross retention by addressing concerns early. Key components: health score monitoring (catch at-risk accounts 90 days out), exec business reviews (reinforce strategic value quarterly), renewal forecasting (predict at-risk renewals via usage/engagement drops), expansion bundling (upsell during renewal discussions). Companies with formal renewal motions retain 20-30% more customers than those relying on passive auto-renewal."
      ]}
      relatedTerms={[
        { slug: "health-score", term: "Health Score", category: "Customer Success" },
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "qbr", term: "QBR (Quarterly Business Review)", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default RenewalMotionTerm;
