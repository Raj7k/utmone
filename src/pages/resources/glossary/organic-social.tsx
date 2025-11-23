import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const OrganicSocialTerm = () => {
  return (
    <GlossaryTermLayout
      term="Organic Social"
      category="Marketing Channels"
      quickDefinition="Unpaid social media posts from brand accounts that reach followers and extended networks through shares, engagement, and platform algorithms."
      fullDefinition={[
        "Organic Social refers to unpaid content posted on social media platforms (LinkedIn, Twitter/X, Instagram, Facebook, TikTok) from your brand's account. Unlike paid social ads, organic posts don't require advertising spend and primarily reach your existing followers, though viral posts can extend to broader networks through shares and algorithmic promotion.",
        "Organic reach has declined significantly across platforms as algorithms prioritize paid content and posts from personal connections over brand pages. LinkedIn typically offers best organic B2B reach, Twitter/X enables conversation and thought leadership, Instagram favors visual storytelling, and TikTok's algorithm can make even new accounts go viral.",
        "Organic social excels at community building, customer engagement, thought leadership, customer support, and content distribution. However, it's increasingly difficult to drive significant traffic or conversions without paid amplification. Most effective when combined with paid social to reach new audiences beyond follower base.",
        "In UTM tracking, use utm_medium=organic-social with utm_source=linkedin, utm_source=twitter, etc. This differentiates from paid-social campaigns and enables measurement of organic content performance. Critical for understanding which content types drive traffic and whether organic social justifies continued investment."
      ]}
      whenToUse="Use organic social for building community with existing followers, customer support and engagement, thought leadership and brand personality, distributing content to followers, testing messaging before paid campaigns, or leveraging executives/employees as brand amplifiers."
      whenNotToUse="Don't rely on organic social as primary traffic driver for new audience growth (reach is too limited), immediate lead generation goals (conversion rates are low), launching to cold audiences (no followers yet), or when you need predictable scalable results."
      commonMistakes={[
        "Using utm_medium=social for both organic and paid (creates attribution confusion - use organic-social vs paid-social)",
        "Not using UTMs on organic social links at all (can't track performance)",
        "Posting same content across all platforms without adapting format and messaging",
        "Not tracking which content types (video vs text vs carousel) drive most clicks and conversions",
        "Measuring vanity metrics (likes, followers) instead of clicks and downstream conversions"
      ]}
      goodExamples={[
        "utm_source=linkedin&utm_medium=organic-social&utm_campaign=thought-leadership-2024&utm_content=post-utm-governance&utm_term=",
        "utm_source=twitter&utm_medium=organic-social&utm_campaign=product-updates&utm_content=feature-announcement-qr&utm_term=",
        "utm_source=instagram&utm_medium=organic-social&utm_campaign=brand-storytelling&utm_content=customer-spotlight-video&utm_term=",
        "Using utm_content to differentiate post types (carousel vs video vs text) for performance analysis"
      ]}
      badExamples={[
        "Not using UTMs on organic social links (no way to measure traffic or conversions)",
        "utm_medium=social (doesn't differentiate paid from organic)",
        "Using same UTM for all organic posts regardless of platform (can't compare LinkedIn vs Twitter performance)",
        "utm_content=post1, post2, post3 (not descriptive enough for analysis)"
      ]}
      relatedTerms={[
        { slug: "paid-social", term: "Paid Social", category: "Marketing Channels" },
        { slug: "referral", term: "Referral Traffic", category: "Marketing Channels" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" },
        { title: "UTM Template", url: "/resources/templates/utm", type: "template" },
        { title: "Naming Examples", url: "/resources/examples/naming", type: "examples" }
      ]}
    />
  );
};

export default OrganicSocialTerm;
