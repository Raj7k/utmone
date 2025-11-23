import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const PaidSocialTerm = () => {
  return (
    <GlossaryTermLayout
      term="Paid Social"
      category="Marketing Channels"
      quickDefinition="Paid advertisements on social media platforms (Facebook, Instagram, LinkedIn, Twitter, TikTok) targeting users based on demographics, interests, and behaviors."
      fullDefinition={[
        "Paid Social refers to sponsored content and advertisements on social media platforms where advertisers pay to reach specific audiences. Unlike organic social posts from your brand page, paid social uses platform algorithms and audience targeting to show ads to users who may not follow your account.",
        "Major platforms include Facebook/Instagram Ads (Meta), LinkedIn Ads (B2B), Twitter/X Ads, TikTok Ads, Pinterest Ads, and Snapchat Ads. Each platform offers unique targeting capabilities: Facebook excels at interest and behavior targeting, LinkedIn targets job titles and company attributes, TikTok reaches younger demographics with video-first creative.",
        "Paid social is interruption marketing—users aren't actively searching for solutions like paid search, they're browsing feeds. This makes creative and targeting quality critical. Best for awareness, consideration-stage education, retargeting, and audience building. Less effective for immediate bottom-funnel conversions compared to search.",
        "In UTM structure, use utm_medium=paid-social with utm_source=facebook, utm_source=linkedin, etc. Critical to track campaign objectives (awareness vs conversion), ad formats (carousel vs video vs static), audience types (cold vs warm vs retargeting), and creative variants for optimization."
      ]}
      whenToUse="Use paid social for building brand awareness in new markets, reaching specific demographic/interest audiences, launching visual or video-first products, retargeting website visitors, testing messaging with fast feedback loops, or scaling proven creatives to cold audiences."
      whenNotToUse="Don't use paid social as primary channel for high-intent bottom-funnel conversions (use paid search), reaching older B2B decision makers (LinkedIn is expensive), products requiring extensive technical education, or when creative production is limited."
      commonMistakes={[
        "Using utm_medium=social for both organic and paid (must differentiate with paid-social vs organic-social)",
        "Not segmenting cold audience, warm audience, and retargeting campaigns in UTM structure",
        "Using same creative for 6+ months without refresh (creative fatigue kills performance)",
        "Not tracking ad format (carousel vs video vs collection) in utm_content for creative analysis",
        "Optimizing for clicks instead of downstream conversions (cheap clicks don't always convert)"
      ]}
      goodExamples={[
        "utm_source=facebook&utm_medium=paid-social&utm_campaign=product-launch-2024&utm_content=carousel-v1&utm_term=lookalike-converters",
        "utm_source=linkedin&utm_medium=paid-social&utm_campaign=abm-enterprise&utm_content=thought-leadership-video&utm_term=vp-marketing",
        "utm_source=tiktok&utm_medium=paid-social&utm_campaign=brand-awareness-gen-z&utm_content=ugc-style-v3&utm_term=",
        "Separating cold prospecting, warm retargeting, and customer upsell campaigns with distinct UTM campaigns"
      ]}
      badExamples={[
        "utm_source=facebook&utm_medium=social (doesn't differentiate paid from organic posts)",
        "Lumping awareness and conversion campaigns together without separate UTM campaigns",
        "utm_content=ad1 (not descriptive - should be video-demo or carousel-testimonials)",
        "Not using utm_term to track audience segment targeting (lookalike vs interest vs behavioral)"
      ]}
      relatedTerms={[
        { slug: "organic-social", term: "Organic Social", category: "Marketing Channels" },
        { slug: "display", term: "Display Advertising", category: "Marketing Channels" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "content", term: "utm_content", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "UTM Examples", url: "/resources/examples/utm-examples", type: "examples" },
        { title: "Campaign Brief Template", url: "/resources/templates/campaign-brief-template", type: "template" },
        { title: "Campaign Launch Checklist", url: "/resources/checklists/campaign-launch", type: "checklist" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" }
      ]}
    />
  );
};

export default PaidSocialTerm;
