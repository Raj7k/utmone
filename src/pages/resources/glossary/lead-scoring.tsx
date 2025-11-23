import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LeadScoringTerm = () => {
  return (
    <GlossaryTermLayout
      term="Lead Scoring"
      category="Sales & RevOps"
      quickDefinition="Numerical ranking system that assigns point values to leads based on demographic fit, behavioral engagement, and intent signals to prioritize sales follow-up."
      fullDefinition={[
        "Lead Scoring is a methodology for ranking prospects based on their likelihood to convert into customers. Points are awarded for positive attributes (job title match, company size fit, demo request) and deducted for negative signals (personal email, competitor employee, wrong geography). Scores typically range 0-100, with threshold values triggering MQL status or sales alerts.",
        "Scoring models typically combine two dimensions: Demographic/Firmographic Fit (job title, company size, industry, revenue, technology stack) and Behavioral Engagement (pages visited, content downloaded, email clicks, event attendance, product usage). Advanced models add intent signals (pricing page visits, competitor comparisons, demo requests) weighted heavily as high-intent actions.",
        "Example scoring model: +20 points for VP+ title, +15 for 100-1000 employee company, +10 for SaaS industry, +5 per content download, +10 for webinar attendance, +25 for demo request, +15 for pricing page visit, -50 for personal email domain. Lead reaching 75+ points becomes MQL and routed to sales.",
        "Predictive lead scoring uses machine learning to identify patterns in which attributes predict conversion, automatically adjusting weights based on historical data. However, simple rule-based models are easier to explain to sales teams and often perform comparably with proper testing and calibration."
      ]}
      whenToUse="Use lead scoring when you have high lead volume requiring prioritization, sales team can't follow up on every lead, want to automate MQL classification, need to optimize SDR time on high-potential leads, or operate B2B with clear ideal customer profile."
      whenNotToUse="Don't use lead scoring for low-volume enterprise sales (every lead goes to sales anyway), self-serve products without sales involvement, when you lack data to calibrate model, or if sales and marketing haven't aligned on scoring criteria."
      commonMistakes={[
        "Over-weighting single behaviors (one pricing page visit = MQL is too simple)",
        "Not tracking lead scores by UTM source to understand which campaigns drive high-scoring leads",
        "Creating complex 50-variable scoring model without testing simpler approaches first",
        "Never recalibrating scoring model based on actual MQL→SQL→Customer conversion data",
        "Sales team not trusting lead scores because scoring criteria doesn't match their experience"
      ]}
      goodExamples={[
        "Tracking average lead score by UTM campaign to optimize marketing for quality over volume",
        "A/B testing score thresholds (75 vs 85 MQL cutoff) to balance lead volume and quality",
        "Quarterly review of which scoring attributes best predict SQL conversion and closed deals",
        "Giving negative points for personal email domains, competitor employees, or wrong geography"
      ]}
      badExamples={[
        "Setting MQL threshold at 10 points (too easy to qualify, overwhelms sales with junk)",
        "Not connecting lead scores to original UTM source (can't optimize marketing spend)",
        "Scoring model unchanged for 2 years despite product and ICP evolution",
        "Complex predictive model that sales doesn't understand or trust (they ignore scores)"
      ]}
      relatedTerms={[
        { slug: "mql", term: "MQL (Marketing Qualified Lead)", category: "Sales & RevOps" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" },
        { slug: "sal", term: "SAL (Sales Accepted Lead)", category: "Sales & RevOps" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Sales & Marketing Alignment Playbook", url: "/resources/playbooks/sales-marketing-alignment", type: "playbook" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics-playbook", type: "playbook" },
        { title: "Dashboard Examples", url: "/resources/examples/dashboard-examples", type: "examples" }
      ]}
    />
  );
};

export default LeadScoringTerm;
