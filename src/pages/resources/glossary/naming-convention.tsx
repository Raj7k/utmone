import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const NamingConventionTerm = () => {
  return (
    <GlossaryTermLayout
      term="Naming Convention"
      category="Governance"
      quickDefinition="Structured pattern for constructing consistent, human-readable names across campaigns, links, and analytics entities."
      fullDefinition={[
        "A naming convention is a documented pattern or template that defines how to construct names for campaigns, links, audiences, and other marketing entities. It ensures consistency across teams, time periods, and channels—making data instantly scannable and reports automatically aggregatable.",
        "Effective naming conventions use clear separators (hyphens for words, underscores for components), lowercase formatting, and structured components in predictable order. For example, a campaign naming convention might be 'channel_medium-objective-product-quarter' (e.g., 'linkedin_paid-awareness-crm-q1-2024'). This pattern encodes metadata directly into the name, enabling both human comprehension and programmatic parsing.",
        "The power of naming conventions compounds over time. When every campaign follows the same pattern for 12 months, you can instantly compare Q1 2024 vs Q1 2025 performance. When every team uses the same pattern, cross-functional reporting 'just works' without manual cleanup. When naming is consistent, dashboards remain accurate even as team members change.",
        "The best naming conventions balance information density with readability. They include enough detail to be self-documenting (you can understand what 'linkedin_paid-awareness-crm-q1-2024' represents without context) while staying short enough to be practical (fitting in spreadsheets, tools, and reports without truncation)."
      ]}
      whenToUse="Implement naming conventions before launching your first multi-channel campaign. Apply them consistently across UTM parameters, campaign names, audience segments, ad groups, and any entity that appears in reports."
      whenNotToUse="Don't apply overly rigid conventions that make names 50+ characters. Don't create different conventions for each channel—use one unified pattern. Don't enforce conventions without providing tools (templates, generators) that make compliance easy."
      commonMistakes={[
        "Creating conventions without team buy-in (leads to non-compliance)",
        "Making patterns too long (linkedin_paid-social_carousel-ad_product-launch_enterprise-segment_awareness_2024-q1-january becomes unreadable)",
        "Using inconsistent separators (sometimes hyphens, sometimes underscores, sometimes neither)",
        "Not versioning campaigns (running 'product-launch' twice a year without v1/v2/v3 creates data overlap)",
        "Defining conventions but not documenting examples for each channel"
      ]}
      goodExamples={[
        "linkedin_paid-awareness-webinar-q1 (channel_medium-objective-theme-quarter)",
        "google_cpc-conversion-enterprise-fy24 (4 clear components, readable)",
        "newsletter_email-nurture-feature-update (source_medium-goal-content type)",
        "producthunt_organic-launch-v2 (platform_medium-campaign-version)"
      ]}
      badExamples={[
        "Campaign 1 (not descriptive or structured)",
        "LinkedIn Paid Social Product Launch Enterprise Awareness Q1 2024 (spaces, inconsistent casing, too long)",
        "lpd-aw-pl-q1 (abbreviations without documentation)",
        "linkedin-paid-awareness-webinar-enterprise-segment-fy2024-q1-january (too many components)",
        "Product_Launch_V1 (inconsistent casing, unclear structure)"
      ]}
      relatedTerms={[
        { slug: "taxonomy", term: "Taxonomy", category: "Governance" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "campaign", term: "utm_campaign", category: "Core Tracking" },
        { slug: "tracking-architecture", term: "Tracking Architecture", category: "Governance" }
      ]}
      relatedResources={[
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" },
        { title: "Naming Taxonomy Template", url: "/resources/templates/naming-taxonomy", type: "template" },
        { title: "Naming Examples", url: "/resources/examples/naming", type: "examples" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track", type: "guide" },
        { title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance", type: "playbook" }
      ]}
    />
  );
};

export default NamingConventionTerm;
