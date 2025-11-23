import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const SourceTerm = () => {
  return (
    <GlossaryTermLayout
      term="utm_source"
      category="Core Tracking"
      quickDefinition="Parameter identifying where traffic originated — the platform or referrer sending visitors to your content."
      fullDefinition={[
        "utm_source is the first and most critical UTM parameter, identifying the specific platform, website, or referrer that sent traffic to your destination. It answers the fundamental question: 'Where did this visitor come from?'",
        "Common utm_source values include platform names (google, facebook, linkedin, twitter), email systems (mailchimp, sendgrid, hubspot), partner websites (techcrunch, producthunt), or offline sources (qr-code, event-booth, business-card). The key is consistency—always use the same exact value for the same source.",
        "The utm_source parameter is the foundation of multi-channel attribution. When combined with utm_medium and utm_campaign, it enables precise tracking of which channels, campaigns, and tactics drive results. Without consistent utm_source values, your analytics become fragmented and unreliable.",
        "Best practice: maintain an approved taxonomy of utm_source values your team can use. This prevents variations like 'facebook', 'Facebook', 'fb', 'FB', 'meta', and 'Meta' from fragmenting your data across dozens of source values in reports."
      ]}
      whenToUse="Use utm_source on every external campaign link to identify the platform sending traffic. Always pair it with utm_medium and utm_campaign for complete tracking."
      whenNotToUse="Don't use generic values like 'social' or 'paid' for utm_source (those belong in utm_medium). Don't use abbreviations or internal codes that won't make sense in reports 6 months from now."
      commonMistakes={[
        "Using different variations for the same source (facebook vs Facebook vs fb vs FB vs meta)",
        "Using descriptive names instead of platform names (utm_source=paid-ads instead of utm_source=google)",
        "Abbreviating unnecessarily (utm_source=li instead of utm_source=linkedin)",
        "Using utm_source to describe medium (utm_source=email instead of utm_medium=email)",
        "Not documenting approved values, leading to free-form entry across teams"
      ]}
      goodExamples={[
        "utm_source=google (for Google Ads or organic search)",
        "utm_source=linkedin (for LinkedIn posts or ads)",
        "utm_source=newsletter (for email newsletter campaigns)",
        "utm_source=producthunt (for Product Hunt launch traffic)",
        "utm_source=qr-code (for QR code scans)"
      ]}
      badExamples={[
        "utm_source=Facebook (uppercase)",
        "utm_source=fb (abbreviation)",
        "utm_source=paid-social (this is a medium, not a source)",
        "utm_source=email (this is a medium, not a source)",
        "utm_source=campaign (this belongs in utm_campaign)"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "campaign", term: "utm_campaign", category: "Core Tracking" },
        { slug: "taxonomy", term: "Taxonomy", category: "Governance" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" },
        { title: "Naming Taxonomy Template", url: "/resources/templates/naming-taxonomy", type: "template" }
      ]}
    />
  );
};

export default SourceTerm;
