import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const MediumTerm = () => {
  return (
    <GlossaryTermLayout
      term="utm_medium"
      category="Core Tracking"
      quickDefinition="Parameter categorizing the type of traffic — paid, organic, social, email, referral, or affiliate."
      fullDefinition={[
        "utm_medium is the second core UTM parameter, categorizing the marketing channel or type of traffic. It answers the question: 'How did this visitor arrive?' While utm_source identifies the platform (linkedin, google, newsletter), utm_medium identifies the channel category (paid-social, cpc, email).",
        "Common utm_medium values follow industry standards: 'cpc' or 'paid-search' for paid search ads, 'paid-social' for paid social media campaigns, 'organic-social' for unpaid social posts, 'email' for email campaigns, 'referral' for partner links, 'affiliate' for affiliate marketing, and 'display' for banner ads.",
        "The utm_medium parameter is critical for channel-level attribution and budget allocation decisions. When your CFO asks 'what's the ROI of paid social vs paid search?', they're asking you to compare utm_medium values across campaigns. Without consistent medium values, these comparisons become impossible.",
        "Best practice: use a small, standardized set of utm_medium values (typically 8-12) rather than creating dozens of custom values. This keeps reports clean and enables apples-to-apples channel comparisons over time."
      ]}
      whenToUse="Use utm_medium on every external campaign link to categorize the channel type. Always pair it with utm_source and utm_campaign for complete attribution."
      whenNotToUse="Don't use platform names in utm_medium (linkedin belongs in utm_source, not utm_medium). Don't create one-off medium values that won't be used consistently across campaigns."
      commonMistakes={[
        "Using platform names instead of channel types (utm_medium=linkedin instead of utm_medium=paid-social)",
        "Creating too many medium values (paid-linkedin, paid-facebook, etc. instead of paid-social)",
        "Inconsistent naming (paid_social vs paidsocial vs paid-social vs PaidSocial)",
        "Using generic values like 'online' or 'digital' that don't provide meaningful categorization",
        "Not aligning with Google Analytics default channel groupings, breaking built-in reports"
      ]}
      goodExamples={[
        "utm_medium=cpc (for Google Ads or Bing Ads)",
        "utm_medium=paid-social (for Facebook, LinkedIn, Twitter ads)",
        "utm_medium=email (for email campaigns)",
        "utm_medium=organic-social (for unpaid social posts)",
        "utm_medium=referral (for partner website links)",
        "utm_medium=affiliate (for affiliate marketing programs)"
      ]}
      badExamples={[
        "utm_medium=linkedin (platform name, should be in utm_source)",
        "utm_medium=Paid Social (has space and uppercase)",
        "utm_medium=paid-linkedin-ads (too specific, creates data fragmentation)",
        "utm_medium=online (too generic, no useful categorization)",
        "utm_medium=campaign (this belongs in utm_campaign)"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "campaign", term: "utm_campaign", category: "Core Tracking" },
        { slug: "taxonomy", term: "Taxonomy", category: "Governance" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "UTM Template", url: "/resources/templates/utm-template", type: "template" },
        { title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance", type: "playbook" },
        { title: "UTM Examples", url: "/resources/examples/utm-examples", type: "examples" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track-framework", type: "guide" }
      ]}
    />
  );
};

export default MediumTerm;
