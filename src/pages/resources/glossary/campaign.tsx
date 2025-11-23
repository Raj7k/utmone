import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CampaignTerm = () => {
  return (
    <GlossaryTermLayout
      term="utm_campaign"
      category="Core Tracking"
      quickDefinition="Parameter naming the specific marketing campaign, product launch, or promotion driving traffic."
      fullDefinition={[
        "utm_campaign is the third core UTM parameter, identifying the specific campaign, initiative, or promotion. It answers the question: 'What campaign drove this traffic?' While utm_source and utm_medium tell you where traffic came from and how, utm_campaign tells you why—what marketing effort was running.",
        "Campaign names should be descriptive, consistent, and follow a structured naming convention. Many organizations use patterns like 'objective-product-audience-timeframe' (e.g., 'awareness-crm-enterprise-q1-2024') or 'source_medium-theme-variant' (e.g., 'linkedin_paid-webinar-series-v1'). The key is choosing a convention and sticking to it across all campaigns.",
        "The utm_campaign parameter enables campaign-level performance analysis and optimization. When your VP asks 'how did our Q4 product launch perform across channels?', they want to filter analytics by utm_campaign to see unified results. Without consistent campaign naming, each team might use different names for the same launch, fragmenting the data.",
        "Advanced teams often encode metadata into campaign names using underscores or hyphens as separators (e.g., 'product-launch_enterprise_awareness_2024-q1'). This structured approach enables automated reporting and campaign taxonomy analysis at scale."
      ]}
      whenToUse="Use utm_campaign on every campaign link to identify the specific initiative. Apply the same campaign name across all channels (paid social, paid search, email, etc.) for unified reporting."
      whenNotToUse="Don't use generic names like 'campaign1' or 'test'. Don't create new campaign names for every individual post or creative—use utm_content for variants within a campaign."
      commonMistakes={[
        "Using different campaign names across channels for the same launch (e.g., 'product-launch' on LinkedIn, 'new-product' on Google)",
        "Including spaces or special characters (utm_campaign=Summer Sale 2024! instead of summer-sale-2024)",
        "Making campaign names too long (utm_campaign=q4-2024-product-launch-enterprise-awareness-campaign-v2-final)",
        "Not versioning campaign iterations (running same name twice creates data overlap)",
        "Using abbreviations only the creator understands (utm_campaign=pl-ent-q4 without documentation)"
      ]}
      goodExamples={[
        "utm_campaign=product-launch-2024 (clear, dated, lowercase)",
        "utm_campaign=webinar-series-q1 (themed, time-bound)",
        "utm_campaign=black-friday-sale (event-specific)",
        "utm_campaign=brand-awareness_enterprise_q2 (structured with underscores)",
        "utm_campaign=content-upgrade_ebook_lead-gen (objective-asset-goal format)"
      ]}
      badExamples={[
        "utm_campaign=Campaign 1 (has space and generic name)",
        "utm_campaign=Test (not descriptive or reusable)",
        "utm_campaign=product launch 2024 (has spaces)",
        "utm_campaign=ProductLaunch (inconsistent casing)",
        "utm_campaign=pl (abbreviation without context)"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "content", term: "utm_content", category: "Core Tracking" },
        { slug: "naming-convention", term: "Naming Convention", category: "Governance" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" },
        { title: "Campaign Brief Template", url: "/resources/templates/campaign-brief", type: "template" },
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" }
      ]}
    />
  );
};

export default CampaignTerm;
