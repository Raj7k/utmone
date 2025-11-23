import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ValueMomentsTerm = () => {
  return (
    <GlossaryTermLayout
      term="Value Moments"
      category="Customer Success"
      quickDefinition="Critical product interactions where users experience tangible benefits, driving retention and expansion."
      fullDefinition={[
        "Value Moments are specific product interactions delivering immediate, memorable benefits that reinforce purchase decisions. Examples: marketing automation tool = first campaign sends, opens tracked live; project management = team collaborates in real-time, deadline met; CRM = deal closed using pipeline forecast. These moments create 'product love' that reduces churn and increases word-of-mouth.",
        "Optimizing value moments: identify top 3-5 moments via user interviews and churn analysis, instrument tracking (measure time-to-first-value-moment), optimize onboarding to reach moments faster (templates, guided tours, sample data), celebrate moments when they happen (confetti animations, milestone emails, unlock badges). Users experiencing 3+ value moments in first 30 days retain at 80%+ rates vs. 40% for those hitting 0-1 moments."
      ]}
      relatedTerms={[
        { slug: "time-to-value", term: "Time-to-Value", category: "Customer Success" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "adoption-milestones", term: "Adoption Milestones", category: "Customer Success" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default ValueMomentsTerm;
