import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const TermParameter = () => {
  return (
    <GlossaryTermLayout
      term="utm_term"
      category="Core Tracking"
      quickDefinition="Parameter capturing paid search keywords that triggered an ad impression and click."
      fullDefinition={[
        "utm_term is the fifth UTM parameter, originally designed exclusively for paid search campaigns to capture the specific keyword that triggered an ad. It answers the question: 'What search term did the user enter to see our ad?' This enables keyword-level performance analysis and bid optimization.",
        "In Google Ads and Microsoft Advertising, utm_term is typically populated automatically using dynamic parameters like {keyword} or {QueryString}, which insert the actual search query. This allows marketers to see exactly which keywords drive clicks, conversions, and revenue at a granular level.",
        "While utm_term was designed for paid search, some advanced teams repurpose it for other use cases: audience segment identifiers (utm_term=enterprise-segment), targeting criteria (utm_term=lookalike-audience), or experiment cohorts (utm_term=test-group-a). However, this non-standard usage can create confusion in reporting.",
        "For non-search campaigns, utm_term should typically be left empty rather than filled with placeholder values. This keeps data clean and makes it obvious which traffic comes from paid search versus other channels."
      ]}
      whenToUse="Use utm_term for paid search campaigns to capture keyword data. Use dynamic insertion parameters from your ad platform to populate it automatically. Consider using it for audience segments if your team has a documented convention."
      whenNotToUse="Don't use utm_term for non-search campaigns unless your team has a clear, documented reason. Don't use generic placeholders like 'none' or 'n/a'—leave it empty instead. Don't conflate term with content (creative variants belong in utm_content)."
      commonMistakes={[
        "Leaving utm_term empty on paid search campaigns (loses valuable keyword data)",
        "Hardcoding keyword values instead of using dynamic insertion (creates maintenance burden)",
        "Using utm_term for non-search campaigns without documentation (confuses analysts)",
        "Filling with placeholder values like 'none' or 'n/a' instead of leaving empty",
        "Not using match type modifiers to distinguish broad vs exact match performance"
      ]}
      goodExamples={[
        "utm_term={keyword} (Google Ads dynamic insertion)",
        "utm_term=url-shortener (specific paid search keyword)",
        "utm_term=best-link-management-tool (long-tail keyword)",
        "utm_term= (empty for non-search campaigns)",
        "utm_term=enterprise-segment (if using for audience targeting with documentation)"
      ]}
      badExamples={[
        "utm_term=none (use empty value instead)",
        "utm_term=keyword (generic placeholder instead of actual keyword)",
        "utm_term=paid-search (this is a medium, not a term)",
        "utm_term=headline-a (this belongs in utm_content)",
        "utm_term=campaign-name (this belongs in utm_campaign)"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "campaign", term: "utm_campaign", category: "Core Tracking" },
        { slug: "content", term: "utm_content", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" },
        { title: "Naming Taxonomy Template", url: "/resources/templates/naming-taxonomy", type: "template" }
      ]}
    />
  );
};

export default TermParameter;
