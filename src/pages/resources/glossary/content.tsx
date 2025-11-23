import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ContentTerm = () => {
  return (
    <GlossaryTermLayout
      term="utm_content"
      category="Core Tracking"
      quickDefinition="Parameter identifying creative variants, ad copy versions, or placement details within a campaign."
      fullDefinition={[
        "utm_content is the fourth UTM parameter, used to differentiate between multiple links within the same campaign. It answers the question: 'Which specific creative, placement, or variant drove this click?' This parameter is critical for A/B testing and multi-variant campaign optimization.",
        "Common use cases include identifying ad creative variants (headline-a vs headline-b), email placements (hero-cta vs sidebar-cta vs footer-link), social post formats (carousel vs single-image vs video), or link positions (top-nav vs bottom-cta). The goal is granular attribution within a campaign.",
        "utm_content enables creative optimization at scale. When you're running the same campaign across multiple ad creatives or email layouts, utm_content tells you exactly which version performed best. Without it, you're measuring campaign performance as a black box without visibility into what's actually working.",
        "Advanced teams use structured naming conventions for utm_content to enable automated creative performance analysis. For example: 'format-variant-position' (e.g., 'carousel-v2-top', 'single-image-v1-sidebar') creates a taxonomy that can be parsed programmatically for reporting."
      ]}
      whenToUse="Use utm_content when running multiple variants within a single campaign: A/B testing ad copy, testing different placements in emails, comparing social post formats, or tracking multiple CTAs on a landing page."
      whenNotToUse="Don't use utm_content for campaign-level differentiation (that's utm_campaign). Don't create hundreds of unique content values—keep it structured and reusable for clean reporting."
      commonMistakes={[
        "Using random IDs instead of descriptive names (utm_content=12345 instead of headline-a)",
        "Not establishing a content naming convention, leading to inconsistent tagging",
        "Conflating content with campaign (putting campaign details in utm_content)",
        "Making values too specific (utm_content=facebook-carousel-variant-2-top-placement-final instead of carousel-v2-top)",
        "Not documenting what each content variant represents, making analysis impossible months later"
      ]}
      goodExamples={[
        "utm_content=headline-a (A/B test variant)",
        "utm_content=hero-cta (email placement)",
        "utm_content=carousel-v2 (social format)",
        "utm_content=top-banner (page position)",
        "utm_content=video-testimonial (creative type)",
        "utm_content=red-button (CTA variant)"
      ]}
      badExamples={[
        "utm_content=12345 (meaningless ID)",
        "utm_content=Test 1 (has space, generic)",
        "utm_content=facebook_carousel_variant_2_top_placement_final_version (too long)",
        "utm_content=campaign-name (campaign belongs in utm_campaign)",
        "utm_content=link1 (not descriptive)"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "campaign", term: "utm_campaign", category: "Core Tracking" },
        { slug: "term", term: "utm_term", category: "Core Tracking" },
        { slug: "taxonomy", term: "Taxonomy", category: "Governance" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "UTM Template", url: "/resources/templates/utm-template", type: "template" },
        { title: "UTM Examples", url: "/resources/examples/utm-examples", type: "examples" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track-framework", type: "guide" }
      ]}
    />
  );
};

export default ContentTerm;
