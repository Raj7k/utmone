import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LinearTerm = () => {
  return (
    <GlossaryTermLayout
      term="Linear Attribution"
      category="Analytics"
      quickDefinition="Multi-touch attribution model that assigns equal credit to every marketing touchpoint in the customer journey."
      fullDefinition={[
        "Linear Attribution is the simplest form of multi-touch attribution. It distributes conversion credit equally across all touchpoints in the customer journey. If someone interacts with 5 marketing channels before converting, each channel receives 20% credit regardless of timing, order, or channel type.",
        "This model treats all touchpoints as equally valuable: the first blog post read 90 days ago gets the same credit as the retargeting ad clicked yesterday. While this seems fair and democratic, it doesn't reflect the reality that different touchpoints play different roles—some create awareness, others drive urgency, and others close the deal.",
        "Linear attribution works best for teams transitioning from single-touch models (first or last touch) who want to start recognizing the full customer journey without making assumptions about which touchpoints matter most. It's a good starting point for multi-touch thinking before graduating to more sophisticated weighted models.",
        "The main advantage is simplicity and objectivity—no one can argue with equal credit distribution. The main disadvantage is lack of nuance—a casual blog visit from 6 months ago probably shouldn't receive the same credit as a demo request from yesterday that directly led to conversion."
      ]}
      whenToUse="Use linear attribution when transitioning from single-touch to multi-touch thinking, you want a simple objective approach without weighted assumptions, testing multi-touch before implementing complex models, or you have short sales cycles where all touches are relatively close in time."
      whenNotToUse="Don't use linear if you have very long sales cycles (6+ months) where early touches are far less relevant than recent ones, need to optimize for specific funnel stages, want to prioritize conversion tactics over awareness, or have sufficient data for more sophisticated time-decay or position-based models."
      commonMistakes={[
        "Using linear attribution for 12-month B2B sales cycles and giving equal credit to year-old interactions",
        "Not graduating from linear to time-decay or position-based once you understand multi-touch",
        "Treating all touchpoints equally when some are clearly more valuable (demo vs casual site visit)",
        "Applying linear attribution to customer journeys with 20+ touchpoints (dilutes all credit)",
        "Using linear as excuse to avoid making strategic decisions about channel value"
      ]}
      goodExamples={[
        "Marketing team new to multi-touch using linear as first step beyond last-touch attribution",
        "30-day sales cycle where most touchpoints happen within short window making equal weighting reasonable",
        "Analysis comparing linear vs time-decay vs position-based to understand which model fits your business",
        "Quarterly reporting showing linear attribution alongside first-touch and last-touch for complete view"
      ]}
      badExamples={[
        "Enterprise B2B with 9-month sales cycle giving equal credit to initial content download and final demo request",
        "E-commerce giving 10% credit to each of 10 touchpoints including casual homepage visits months ago",
        "Using linear attribution permanently without ever testing time-decay or weighted alternatives",
        "Applying linear to customer journeys with 50+ touchpoints (each gets 2% credit, nothing is meaningful)"
      ]}
      relatedTerms={[
        { slug: "multi-touch", term: "Multi-Touch Attribution", category: "Analytics" },
        { slug: "time-decay", term: "Time-Decay Attribution", category: "Analytics" },
        { slug: "first-touch", term: "First-Touch Attribution", category: "Analytics" },
        { slug: "last-touch", term: "Last-Touch Attribution", category: "Analytics" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Model", url: "/resources/frameworks/attribution-clarity-model", type: "framework" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Dashboard Examples", url: "/resources/examples/dashboard-examples", type: "examples" },
        { title: "Simple Analytics Guide", url: "/resources/guides/simple-analytics", type: "guide" }
      ]}
    />
  );
};

export default LinearTerm;
