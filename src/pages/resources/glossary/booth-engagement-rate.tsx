import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const BoothEngagementRateTerm = () => {
  return (
    <GlossaryTermLayout
      term="Booth Engagement Rate"
      category="Marketing Operations"
      quickDefinition="Percentage of event attendees meaningfully interacting with trade show booth versus total foot traffic."
      fullDefinition={[
        "Booth Engagement = (Meaningful Conversations + Demo Requests + Lead Scans) ÷ Total Booth Visitors × 100. Example: 200 booth visitors, 50 conversations, 30 demos, 80 badge scans = 80% engagement rate (160 engaged ÷ 200 visitors). Separates drive-by traffic from genuine interest.",
        "Improving engagement: interactive elements (games, AR demos, live product showcases), clear value prop signage (avoid 'we're hiring' booths), trained staff (proactive engagement vs standing around), foot traffic optimization (corner booths get 40% more traffic), pre-event outreach (book booth meetings in advance). Top-performing booths achieve 60-80% engagement vs average 20-30%."
      ]}
      relatedTerms={[
        { slug: "event-roi-model", term: "Event ROI Model", category: "Marketing Operations" },
        { slug: "pipeline-influence", term: "Pipeline Influence", category: "Marketing Operations" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Event-Led Growth Playbook", url: "/resources/playbooks/event-led-growth", type: "playbook" }
      ]}
    />
  );
};

export default BoothEngagementRateTerm;
