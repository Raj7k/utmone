import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const FirstTouchTerm = () => {
  return (
    <GlossaryTermLayout
      term="First-Touch Attribution"
      category="Analytics"
      quickDefinition="Attribution model that assigns 100% credit to the first marketing touchpoint a customer interacted with before converting."
      fullDefinition={[
        "First-Touch Attribution is an attribution model that credits the initial touchpoint in the customer journey with full responsibility for the conversion. If a customer first discovered your product through a paid social ad, then later clicked an email, searched organically, and finally converted via a retargeting ad—first-touch would give all credit to that original paid social ad.",
        "This model is valuable for understanding top-of-funnel performance and brand awareness campaigns. It helps answer: 'What channels are best at introducing new prospects to our product?' However, it completely ignores all nurturing touchpoints that happened between discovery and conversion.",
        "First-touch is most useful for businesses with short sales cycles or companies focused on awareness metrics. It's less useful for complex B2B sales with long consideration periods where multiple touchpoints are critical to the final decision.",
        "In practice, first-touch attribution tends to over-credit brand awareness channels (paid social, display, content marketing) and under-credit conversion-focused channels (paid search, retargeting, email nurture). Most modern marketing teams use it as one view among several attribution models rather than the single source of truth."
      ]}
      whenToUse="Use first-touch when you want to measure top-of-funnel performance, understand which channels are best at generating new prospects, evaluate brand awareness campaigns, or analyze customer acquisition sources in short-cycle businesses."
      whenNotToUse="Don't rely solely on first-touch for complex B2B sales cycles, businesses with long consideration periods (60+ days), or when you need to understand the full customer journey. It will systematically undervalue nurture and conversion touchpoints."
      commonMistakes={[
        "Using first-touch as the only attribution model and ignoring mid-funnel nurture",
        "Applying first-touch to long sales cycles where first interaction happened months ago",
        "Over-investing in awareness channels because they show high first-touch attribution",
        "Not tracking anonymous first-touch interactions before form fills (dark social problem)",
        "Treating first-touch data as absolute truth rather than one perspective on customer journey"
      ]}
      goodExamples={[
        "SaaS startup using first-touch to measure which paid social campaigns generate most new trial signups within 7 days",
        "E-commerce brand analyzing first-touch by UTM source to understand which influencers drive highest LTV customers",
        "B2C mobile app tracking first-touch channel to optimize brand awareness budget allocation",
        "Content marketing team measuring first-touch attribution by blog post to identify top acquisition content"
      ]}
      badExamples={[
        "Enterprise software company using only first-touch for 12-month sales cycle (ignores 11 months of nurture)",
        "Cutting retargeting budget because it shows low first-touch attribution (it's designed for last-touch)",
        "B2B company attributing demo signup to blog post read 6 months ago without considering recent touchpoints",
        "Not combining first-touch with last-touch or multi-touch models for complete view"
      ]}
      relatedTerms={[
        { slug: "last-touch", term: "Last-Touch Attribution", category: "Analytics" },
        { slug: "multi-touch", term: "Multi-Touch Attribution", category: "Analytics" },
        { slug: "linear", term: "Linear Attribution", category: "Analytics" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Model", url: "/resources/frameworks/attribution-clarity-model", type: "framework" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Dashboard Examples", url: "/resources/examples/dashboard-examples", type: "examples" },
        { title: "Simple Analytics Guide", url: "/resources/guides/simple-analytics", type: "guide" },
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default FirstTouchTerm;
