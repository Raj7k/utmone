import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const UTMTerm = () => {
  return (
    <GlossaryTermLayout
      term="UTM"
      category="Core Tracking"
      quickDefinition="Urchin Tracking Module — standardized parameters appended to URLs to track campaign performance across analytics platforms."
      fullDefinition={[
        "UTM (Urchin Tracking Module) is a standardized set of URL parameters originally developed by Urchin Software Corporation (later acquired by Google to become Google Analytics). These parameters allow marketers to track the effectiveness of campaigns across traffic sources and publishing media.",
        "UTM parameters are appended to the end of a URL and consist of five core elements: utm_source (where traffic originates), utm_medium (type of traffic), utm_campaign (specific campaign name), utm_content (variant identifier), and utm_term (paid search keywords). When a user clicks a link with UTM parameters, those values are captured by analytics platforms and used for attribution.",
        "The power of UTMs lies in their universality—they work across Google Analytics, Adobe Analytics, Mixpanel, Amplitude, and virtually every modern analytics platform. This makes them the de facto standard for campaign tracking in digital marketing, enabling consistent measurement across channels, teams, and tools.",
        "However, UTMs are only as good as the discipline behind them. Without a structured taxonomy, naming convention, and governance process, UTM data quickly becomes chaotic—leading to broken dashboards, misattributed revenue, and lost trust in analytics."
      ]}
      whenToUse="Use UTMs on every external marketing link where you want to measure campaign performance: paid ads, email campaigns, social posts, partner links, QR codes, and offline-to-online campaigns."
      whenNotToUse="Don't use UTMs on internal site navigation links (this breaks GA4 session tracking). Don't use them inconsistently—missing UTMs on some campaign links while using them on others creates incomplete data."
      commonMistakes={[
        "Using uppercase letters (utm_Source=Facebook) — UTMs are case-sensitive and should always be lowercase",
        "Adding spaces (utm_campaign=summer sale 2024) — breaks tracking and creates reporting issues",
        "Using different values for the same source (facebook vs Facebook vs fb vs FB) — fragments analytics data",
        "Forgetting to set all 5 parameters — incomplete data reduces attribution accuracy",
        "Not documenting UTM structure — leads to inconsistent tagging across teams"
      ]}
      goodExamples={[
        "?utm_source=linkedin&utm_medium=paid-social&utm_campaign=product-launch-2024&utm_content=carousel-v1&utm_term=b2b-saas",
        "?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-digest&utm_content=hero-cta&utm_term=",
        "?utm_source=google&utm_medium=cpc&utm_campaign=brand-search&utm_content=headline-a&utm_term=url-shortener"
      ]}
      badExamples={[
        "?utm_source=Facebook&utm_medium=Social (inconsistent casing)",
        "?utm_campaign=Summer Sale 2024 (has spaces)",
        "?utm_source=fb (abbreviation instead of full name)",
        "?utm_source=linkedin&utm_medium=paid (missing campaign, content, term)"
      ]}
      relatedTerms={[
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "campaign", term: "utm_campaign", category: "Core Tracking" },
        { slug: "content", term: "utm_content", category: "Core Tracking" },
        { slug: "term", term: "utm_term", category: "Core Tracking" },
        { slug: "taxonomy", term: "Taxonomy", category: "Governance" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track", type: "guide" },
        { title: "UTM Template", url: "/resources/templates/utm", type: "template" },
        { title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance", type: "playbook" },
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" }
      ]}
    />
  );
};

export default UTMTerm;
