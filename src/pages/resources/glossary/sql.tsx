import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const SQLTerm = () => {
  return (
    <GlossaryTermLayout
      term="SQL (Sales Qualified Lead)"
      category="Sales & RevOps"
      quickDefinition="A prospect who has been vetted and qualified by sales team as ready for direct sales engagement based on budget, authority, need, and timeline (BANT criteria)."
      fullDefinition={[
        "A Sales Qualified Lead (SQL) is a prospect that sales team has validated as having genuine purchase intent, budget, authority, and timeline to buy. SQL status typically follows marketing qualified lead (MQL) stage—after sales development rep (SDR) conducts discovery call to assess fit using BANT framework: Budget (can they afford it?), Authority (decision-maker?), Need (real pain point?), Timeline (when buying?).",
        "SQL conversion is the critical handoff between SDRs (who qualify leads) and Account Executives (who close deals). Healthy MQL→SQL conversion rates range 15-30%, while SQL→Opportunity rates should exceed 50%, and SQL→Customer rates vary widely by industry (10-25% for B2B SaaS). These metrics measure lead quality and sales effectiveness.",
        "Common SQL disqualification reasons include: insufficient budget, not a decision-maker (needs approval from multiple stakeholders), no clear use case or pain point, unrealistic timeline (researching for future, not buying soon), or competitor evaluation with no real intent to switch. Good qualification saves wasted sales cycles.",
        "SQL tracking via UTM parameters enables marketing to understand which campaigns, sources, and content types generate sales-ready leads versus vanity traffic. Example: paid search might generate 100 MQLs but only 5 SQLs (5% conversion), while webinars generate 20 MQLs but 8 SQLs (40% conversion)—webinar is better lead quality despite lower volume."
      ]}
      whenToUse="Use SQL classification when you have two-stage sales process (SDRs qualify, AEs close), need to measure SDR effectiveness, want to optimize marketing for sales-ready leads, have complex B2B sales requiring qualification, or need to focus AE time on highest-potential deals."
      whenNotToUse="Don't use SQL framework for self-serve products without sales involvement, consumer purchases (no qualification call), single-touch transactional sales, or when you lack SDR resources to properly qualify inbound leads."
      commonMistakes={[
        "SDRs marking leads as SQL too quickly to hit quotas (lowers SQL→Customer conversion)",
        "Not tracking SQL conversions by UTM source/campaign (can't optimize marketing for quality)",
        "AEs cherry-picking SQLs and letting others languish (creates false SQL→Opp metrics)",
        "Marketing celebrating MQL volume without monitoring MQL→SQL conversion quality",
        "Not establishing clear BANT criteria for SQL classification (inconsistent qualification)"
      ]}
      goodExamples={[
        "Tracking SQL conversion rate by UTM campaign to identify which marketing drives sales-ready leads",
        "Weekly SDR-marketing sync reviewing why certain MQLs aren't converting to SQL",
        "Dashboard showing MQL→SQL→Opp→Customer funnel by source with conversion rates",
        "Using SQL velocity (days from MQL to SQL) to measure marketing lead quality by channel"
      ]}
      badExamples={[
        "Not connecting SQL records to original UTM source (can't optimize marketing spend)",
        "SDR team declaring 80% of MQLs as SQL without proper qualification (inflates pipeline)",
        "Marketing optimizing for MQL volume when MQL→SQL rate is only 5% (quality problem)",
        "Not tracking which content offers (ebook vs demo vs webinar) drive highest SQL rates"
      ]}
      relatedTerms={[
        { slug: "mql", term: "MQL (Marketing Qualified Lead)", category: "Sales & RevOps" },
        { slug: "sal", term: "SAL (Sales Accepted Lead)", category: "Sales & RevOps" },
        { slug: "pipeline", term: "Pipeline", category: "Sales & RevOps" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Attribution Clarity Framework", url: "/resources/frameworks/attribution-clarity", type: "framework" },
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default SQLTerm;
