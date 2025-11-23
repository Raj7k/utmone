import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const MultiTouchTerm = () => {
  return (
    <GlossaryTermLayout
      term="Multi-Touch Attribution"
      category="Analytics"
      quickDefinition="Attribution model that distributes conversion credit across multiple marketing touchpoints in the customer journey rather than assigning 100% to a single interaction."
      fullDefinition={[
        "Multi-Touch Attribution (MTA) recognizes that most conversions result from multiple marketing interactions over time, not a single touchpoint. Instead of crediting only the first interaction or only the last click, MTA distributes credit across all touchpoints that influenced the conversion decision.",
        "Common multi-touch models include: Linear (equal credit to all touches), Time-Decay (more credit to recent touches), U-Shaped/Position-Based (40% first touch, 40% last touch, 20% to middle touches), W-Shaped (credit to first, middle milestone, last), and Algorithmic (machine learning determines credit distribution).",
        "MTA provides a more complete view of customer journey than single-touch models, helping marketing teams understand how awareness, consideration, and conversion channels work together. It's particularly valuable for businesses with long sales cycles, multiple touchpoints, and complex customer journeys where no single channel drives conversions alone.",
        "However, MTA requires sophisticated tracking infrastructure (full-funnel UTM coverage, CRM integration, identity resolution across devices), significant data volume for statistical validity, and cross-functional alignment on methodology. Most companies start with simpler models (first-touch + last-touch comparison) before investing in full MTA implementation."
      ]}
      whenToUse="Use multi-touch when you have complex customer journeys with 5+ average touchpoints, long sales cycles (30+ days), need to optimize full-funnel marketing mix, have proper tracking infrastructure in place, or want to fairly evaluate awareness and nurture channels."
      whenNotToUse="Don't implement multi-touch if you have simple one-touch purchase journeys, insufficient data volume (less than 1,000 conversions/month), poor UTM hygiene or tracking gaps, short sales cycles (less than 7 days), or lack resources to maintain attribution infrastructure."
      commonMistakes={[
        "Implementing multi-touch without fixing fundamental UTM tracking gaps first",
        "Choosing complex algorithmic models without understanding simpler rule-based approaches",
        "Not establishing cross-functional agreement on attribution methodology before implementation",
        "Treating multi-touch attribution as absolute truth rather than directional insight",
        "Over-optimizing on attribution data without considering brand lift, customer satisfaction, LTV"
      ]}
      goodExamples={[
        "B2B SaaS with 90-day sales cycle using U-shaped attribution to balance awareness and conversion channel investment",
        "E-commerce brand with 12 average touchpoints using time-decay to understand nurture email impact",
        "Enterprise software using W-shaped attribution to credit demo requests as middle milestone conversion event",
        "Marketing ops team running quarterly attribution analysis comparing linear, time-decay, and position-based models for budget planning"
      ]}
      badExamples={[
        "Startup with 100 conversions/month implementing machine learning attribution (insufficient data)",
        "Company with broken UTM tracking launching multi-touch attribution (garbage in, garbage out)",
        "Team spending 6 months building custom MTA model before fixing basic reporting issues",
        "Using multi-touch for single-session e-commerce purchases (over-engineering simple journey)"
      ]}
      relatedTerms={[
        { slug: "first-touch", term: "First-Touch Attribution", category: "Analytics" },
        { slug: "last-touch", term: "Last-Touch Attribution", category: "Analytics" },
        { slug: "linear", term: "Linear Attribution", category: "Analytics" },
        { slug: "time-decay", term: "Time-Decay Attribution", category: "Analytics" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Model", url: "/resources/frameworks/attribution-clarity-model", type: "framework" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Dashboard Examples", url: "/resources/examples/dashboard-examples", type: "examples" },
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" },
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default MultiTouchTerm;
