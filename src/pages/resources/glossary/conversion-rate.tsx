import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ConversionRateTerm = () => {
  return (
    <GlossaryTermLayout
      term="Conversion Rate"
      category="Sales & RevOps"
      quickDefinition="Percentage of visitors, leads, or prospects who complete a desired action (form fill, trial signup, purchase) out of total visitors in a given period."
      fullDefinition={[
        "Conversion Rate measures the percentage of users who complete a target action. Formula: (Conversions ÷ Total Visitors) × 100. For example, if landing page receives 1,000 visitors and 50 sign up for trial, conversion rate is 5%. Conversion rates vary dramatically by action type: email signup (5-15%), trial signup (2-5%), demo request (1-3%), purchase (0.5-2%).",
        "Conversion rates exist at every funnel stage: website visitor→lead, lead→MQL, MQL→SQL, SQL→opportunity, opportunity→customer. Each stage measures how effectively you move prospects forward. Low conversion at specific stage indicates bottleneck requiring optimization: weak value prop, friction in form, poor follow-up timing, or audience mismatch.",
        "Conversion rate must be analyzed with absolute volume context. 10% conversion on 100 visitors (10 conversions) is worse than 3% conversion on 10,000 visitors (300 conversions). Optimize for total conversions, not just rate—small volume plus high rate might indicate sampling bias or unsustainable traffic source.",
        "Tracking conversion rates by UTM source/medium/campaign reveals which marketing activities drive not just traffic, but qualified conversions. Paid search might deliver 1% conversion while organic social delivers 5%—but if paid search brings 10,000 visitors and organic brings 200, paid search generates more total conversions despite lower rate."
      ]}
      whenToUse="Use conversion rate analysis when optimizing landing pages or funnels, comparing channel effectiveness, A/B testing variations, identifying friction points in user journey, measuring campaign ROI, or diagnosing where prospects drop off."
      whenNotToUse="Don't optimize conversion rate in isolation without considering volume (10% of 100 < 2% of 10,000), user quality (high conversion doesn't mean high LTV), or downstream metrics (trials that don't activate are useless), or compare rates across drastically different actions (email signup vs purchase)."
      commonMistakes={[
        "Not tracking conversion rates by UTM source/campaign (can't identify which marketing drives conversions)",
        "Celebrating high conversion rate without checking if traffic volume is sustainable",
        "Optimizing for email signup conversions when business goal is paying customers",
        "Comparing conversion rates across different actions (blog subscription ≠ demo request)",
        "Not segmenting conversion rates by traffic source (paid vs organic have different benchmarks)"
      ]}
      goodExamples={[
        "Dashboard showing visitor→trial conversion rate by UTM campaign to optimize marketing spend",
        "A/B test comparing landing page variations with statistical significance testing",
        "Funnel analysis showing MQL→SQL→Opp→Customer conversion rates by lead source",
        "Identifying paid search has 2% conversion while webinars have 12%, shifting budget accordingly"
      ]}
      badExamples={[
        "Declaring success with 15% email signup rate without tracking how many become customers",
        "Not tracking which UTM sources drive highest conversion rates (optimizing in the dark)",
        "Comparing email signup conversion (10%) to purchase conversion (1%) as if equivalent",
        "Cutting high-volume low-conversion channel for low-volume high-conversion (fewer total conversions)"
      ]}
      relatedTerms={[
        { slug: "mql", term: "MQL (Marketing Qualified Lead)", category: "Sales & RevOps" },
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "cohort", term: "Cohort Analysis", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Sales & Marketing Alignment Playbook", url: "/resources/playbooks/sales-marketing-alignment", type: "playbook" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Dashboard Examples", url: "/resources/examples/dashboard-examples", type: "examples" },
        { title: "UTM Examples", url: "/resources/examples/utm-examples", type: "examples" },
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics-playbook", type: "playbook" }
      ]}
    />
  );
};

export default ConversionRateTerm;
