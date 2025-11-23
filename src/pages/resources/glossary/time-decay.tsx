import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const TimeDecayTerm = () => {
  return (
    <GlossaryTermLayout
      term="Time-Decay Attribution"
      category="Analytics"
      quickDefinition="Multi-touch attribution model that assigns more credit to marketing touchpoints closer in time to the conversion, with older interactions receiving progressively less credit."
      fullDefinition={[
        "Time-Decay Attribution recognizes that touchpoints closer to conversion typically have more influence on the final decision than interactions from weeks or months ago. Credit increases exponentially as you approach the conversion event—a touchpoint from yesterday might receive 40% credit while a touchpoint from 30 days ago receives only 5%.",
        "The decay rate (how quickly credit diminishes over time) is configurable based on your sales cycle. Common approaches use 7-day half-life for short cycles (each touchpoint gets half the credit of the one 7 days later) or 30-day half-life for longer B2B sales. Google Analytics uses a default 7-day half-life in its time-decay model.",
        "This model makes intuitive sense for most businesses: recent marketing interactions are fresher in customer's mind and more directly influence purchase timing. However, it can undervalue important early-stage awareness touchpoints that planted the seed months ago, even if those touches were critical for eventual conversion.",
        "Time-decay works particularly well for businesses with clear consideration phases where customers actively research for weeks before deciding. It balances the extremes of first-touch (credits ancient interactions) and last-touch (ignores nurture journey) while still emphasizing recency and conversion pressure."
      ]}
      whenToUse="Use time-decay when you have medium-length sales cycles (14-90 days), customers actively research before buying, want to emphasize recent marketing effectiveness, need to balance awareness and conversion credit, or are optimizing nurture sequences and retargeting timing."
      whenNotToUse="Don't use time-decay for instant purchase decisions (same-session conversions where time decay is irrelevant), very long enterprise sales (6+ months) where early touchpoints are systematically devalued despite importance, or when first interaction was the true conversion driver (brand campaigns)."
      commonMistakes={[
        "Using 7-day half-life for 6-month B2B sales cycle (over-penalizes early awareness)",
        "Not adjusting decay rate to match actual customer consideration timeline",
        "Applying time-decay to single-session purchases where all touches happen in minutes",
        "Under-investing in brand awareness because it shows weak time-decay attribution",
        "Treating time-decay as perfect truth rather than one perspective on customer journey"
      ]}
      goodExamples={[
        "SaaS with 45-day trial using 14-day half-life to credit recent activation emails and product touches",
        "B2B with 90-day sales cycle using 30-day half-life to emphasize recent demos while crediting early content",
        "E-commerce with 21-day consideration period using time-decay to optimize retargeting frequency and timing",
        "Marketing ops team comparing time-decay vs linear to decide which channels deserve more recent-stage budget"
      ]}
      badExamples={[
        "Enterprise software with 12-month sales cycle using default 7-day half-life (original awareness gets 0.01% credit)",
        "Cutting brand campaigns because they show low time-decay attribution despite driving all downstream activity",
        "E-commerce with same-day purchase decisions using time-decay (all touches happen in same session anyway)",
        "Not testing different decay rates to find one that matches actual customer behavior timeline"
      ]}
      relatedTerms={[
        { slug: "multi-touch", term: "Multi-Touch Attribution", category: "Analytics" },
        { slug: "linear", term: "Linear Attribution", category: "Analytics" },
        { slug: "last-touch", term: "Last-Touch Attribution", category: "Analytics" },
        { slug: "first-touch", term: "First-Touch Attribution", category: "Analytics" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Framework", url: "/resources/frameworks/attribution-clarity", type: "framework" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance", type: "playbook" }
      ]}
    />
  );
};

export default TimeDecayTerm;
