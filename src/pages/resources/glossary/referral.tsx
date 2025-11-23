import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ReferralTerm = () => {
  return (
    <GlossaryTermLayout
      term="Referral Traffic"
      category="Marketing Channels"
      quickDefinition="Website visitors who arrive via clickable links on external websites, partner sites, or third-party platforms rather than search engines or direct navigation."
      fullDefinition={[
        "Referral Traffic refers to visitors who land on your website by clicking a link from another website. This includes links from partner websites, news articles, review sites, guest posts, directories, forums (Reddit, Hacker News), and any external site that links to yours. The referring domain is captured in analytics as the traffic source.",
        "In Google Analytics, referral traffic shows as medium=referral with source={domain name}. For example, traffic from a ProductHunt feature would show as producthunt.com/referral. Referral traffic is distinct from organic search (user found you via search engine) and direct traffic (user typed URL or used bookmark).",
        "High-quality referral traffic typically comes from authoritative, relevant sites where your target audience already spends time. A review from TechCrunch or discussion on Hacker News can drive significant qualified traffic. However, not all referrals are equal—a link from a spam site provides little value, while a thoughtful mention from an industry publication can drive conversions.",
        "Best practice is to add UTM parameters to links when you control the placement (guest posts, partnerships, sponsored content). This transforms generic 'referral' attribution into specific campaign tracking. Without UTMs, you only know traffic came from external site, not which specific article, campaign, or partnership drove it."
      ]}
      whenToUse="Use referral strategies when building partnerships with complementary brands, pursuing press coverage and earned media, guest posting on industry publications, getting featured on directories/review sites, or engaging in relevant online communities."
      whenNotToUse="Don't chase referral links from irrelevant or low-quality sites (hurts SEO and wastes time), pay for spammy directory listings, spam communities with self-promotional links, or rely solely on referrals for predictable traffic (too volatile)."
      commonMistakes={[
        "Not adding UTM parameters to partner links and guest posts (defaults to generic referral attribution)",
        "Treating all referral traffic equally (TechCrunch ≠ random blog)",
        "Not monitoring referral sources in Analytics to understand which partnerships drive conversions",
        "Pursuing quantity of backlinks over quality (100 spam links < 1 authoritative mention)",
        "Not having dedicated landing pages for major referral sources (ProductHunt vs TechCrunch traffic needs different messaging)"
      ]}
      goodExamples={[
        "Guest post link with utm_source=techcrunch&utm_medium=referral&utm_campaign=guest-post-2024&utm_content=author-bio",
        "Partnership link with utm_source=partner-acme&utm_medium=referral&utm_campaign=integration-partnership&utm_content=tools-page",
        "ProductHunt feature with utm_source=producthunt&utm_medium=referral&utm_campaign=launch-2024&utm_content=main-listing",
        "Monitoring which referring domains drive highest conversion rates and deepening those partnerships"
      ]}
      badExamples={[
        "Not using UTMs on controlled referral links (can only see 'referral' not specific campaigns)",
        "Paying for directory listings on irrelevant sites just to get backlinks",
        "Sending all referral traffic to homepage instead of contextually relevant landing pages",
        "Not tracking which referral sources convert vs just drive vanity traffic"
      ]}
      relatedTerms={[
        { slug: "direct", term: "Direct Traffic", category: "Marketing Channels" },
        { slug: "seo", term: "SEO (Organic Search)", category: "Marketing Channels" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "UTM Examples", url: "/resources/examples/utm-examples", type: "examples" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Attribution Clarity Model", url: "/resources/frameworks/attribution-clarity-model", type: "framework" }
      ]}
    />
  );
};

export default ReferralTerm;
