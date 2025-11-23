import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const PaidSearchTerm = () => {
  return (
    <GlossaryTermLayout
      term="Paid Search (CPC/PPC)"
      category="Marketing Channels"
      quickDefinition="Paid advertisements on search engines (Google, Bing) where advertisers bid on keywords and pay per click (CPC) or per impression."
      fullDefinition={[
        "Paid Search, also known as Search Engine Marketing (SEM), Pay-Per-Click (PPC), or Cost-Per-Click (CPC) advertising, refers to sponsored text ads that appear in search engine results when users search for specific keywords. Advertisers bid on search terms relevant to their business and pay each time someone clicks their ad.",
        "The dominant platform is Google Ads, with Microsoft Advertising (Bing) as secondary player. Ads appear above or below organic search results with 'Sponsored' or 'Ad' labels. Advertisers control bidding strategy, ad copy, landing pages, keyword targeting, audience targeting, and daily budgets.",
        "Paid search is intent-driven marketing—users actively searching for solutions are typically further down the funnel than social media browsers. This makes paid search excellent for direct-response and lead generation, though competition for high-intent keywords (especially commercial terms) drives CPCs up significantly.",
        "In UTM tracking, paid search typically uses utm_medium=cpc or utm_medium=ppc with utm_source=google, utm_source=bing, etc. Campaign-level tracking should include brand vs non-brand segmentation, keyword match types, and ad group structure for proper performance analysis."
      ]}
      whenToUse="Use paid search when targeting high-intent keywords with commercial or transactional intent, launching products where people already search for solutions, need fast traffic for testing, have strong landing page conversion rates, or competing in established markets with search demand."
      whenNotToUse="Don't rely solely on paid search for brand awareness (users must already know to search), early-stage markets without search volume, businesses with weak margins unable to sustain CPC costs, or products requiring extensive education before purchase consideration."
      commonMistakes={[
        "Using generic utm_medium=cpc without differentiating campaigns in utm_campaign structure",
        "Bidding on broad match keywords without negative keyword lists (wasted spend)",
        "Not separating brand search campaigns from non-brand (different economics and attribution)",
        "Sending all paid search traffic to homepage instead of keyword-relevant landing pages",
        "Not tracking conversion value and optimizing for clicks instead of ROI"
      ]}
      goodExamples={[
        "utm_source=google&utm_medium=cpc&utm_campaign=brand-search-us&utm_content=headline-a&utm_term=url-shortener",
        "utm_source=bing&utm_medium=ppc&utm_campaign=nonbrand-competitor&utm_content=ad-variant-1&utm_term=bitly-alternative",
        "Separating exact match, phrase match, and broad match keywords into different campaigns for proper tracking",
        "Using Dynamic Keyword Insertion (DKI) in landing page headlines while maintaining consistent UTM structure"
      ]}
      badExamples={[
        "utm_source=google&utm_medium=cpc (missing campaign/content/term - can't analyze performance)",
        "Lumping brand and non-brand keywords in same campaign UTM (vastly different conversion rates)",
        "Using utm_term=keyword when bidding on 1000+ keywords (should segment by ad group or theme)",
        "Not using utm_content to differentiate ad variants in A/B tests"
      ]}
      relatedTerms={[
        { slug: "seo", term: "SEO (Organic Search)", category: "Marketing Channels" },
        { slug: "display", term: "Display Advertising", category: "Marketing Channels" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" }
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

export default PaidSearchTerm;
