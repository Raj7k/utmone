import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const SEOTerm = () => {
  return (
    <GlossaryTermLayout
      term="SEO (Organic Search)"
      category="Marketing Channels"
      quickDefinition="Search Engine Optimization — the practice of optimizing website content and technical infrastructure to rank higher in unpaid (organic) search engine results."
      fullDefinition={[
        "SEO (Search Engine Optimization) is the process of improving your website's visibility in organic (unpaid) search engine results, primarily on Google which controls 90%+ of search market share. Unlike paid search where you bid for placement, organic rankings are earned through content quality, technical optimization, and backlink authority.",
        "SEO encompasses three main areas: On-Page SEO (content optimization, keyword targeting, meta tags, internal linking), Technical SEO (site speed, mobile optimization, indexability, structured data), and Off-Page SEO (backlinks from other websites, domain authority, brand signals). Modern SEO increasingly emphasizes user experience, content depth, and E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).",
        "Organic search is typically the highest-volume traffic source for established websites, generates high-intent visitors (users searching for solutions), and provides compounding returns (rankings build over time). However, SEO is slow (6-12 months for competitive terms), algorithm-dependent (Google updates change rankings), and competitive (established sites dominate valuable terms).",
        "In analytics, organic search traffic typically shows as utm_source=(direct) or referrer=google.com without UTM parameters since search engines don't append tracking. However, you can manually add UTM parameters to content shared on external sites to differentiate SEO-driven traffic from direct visits. Most SEO attribution happens through GA4's default source/medium: google/organic."
      ]}
      whenToUse="Use SEO when building long-term sustainable traffic, targeting evergreen high-intent keywords, have resources for content creation and technical optimization, need traffic without ongoing ad spend, or competing in established markets with search demand."
      whenNotToUse="Don't rely solely on SEO when launching new products without search demand, need traffic in first 3 months, lack content production resources, have poor website fundamentals (slow, broken, thin content), or constantly changing product/positioning (can't build authority)."
      commonMistakes={[
        "Not tracking SEO landing pages with Analytics properly (missing conversion data)",
        "Expecting SEO results in weeks (realistic timeline is 6-12 months for competitive terms)",
        "Keyword stuffing and over-optimization (Google penalizes unnatural content)",
        "Ignoring technical SEO (page speed, mobile usability, indexability) while focusing only on content",
        "Not building backlinks from authoritative sites (off-page SEO is critical for competitive terms)"
      ]}
      goodExamples={[
        "Building content hub around 'link management' with comprehensive guides, comparison pages, and templates",
        "Optimizing landing pages for high-intent keywords like 'bitly alternative' or 'utm builder'",
        "Creating comparison content like 'utm.one vs Bitly' targeting bottom-funnel searches",
        "Building domain authority through guest posts, partnerships, and PR coverage"
      ]}
      badExamples={[
        "Expecting page-one rankings for 'URL shortener' in first month (extremely competitive)",
        "Creating thin content (200-word blog posts) targeting valuable keywords",
        "Ignoring mobile optimization when 60%+ of searches happen on mobile",
        "Not monitoring Google Search Console for indexing issues and opportunities"
      ]}
      relatedTerms={[
        { slug: "paid-search", term: "Paid Search (CPC/PPC)", category: "Marketing Channels" },
        { slug: "direct", term: "Direct Traffic", category: "Marketing Channels" },
        { slug: "referral", term: "Referral Traffic", category: "Marketing Channels" },
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "LLM-First SEO Guide", url: "/resources/guides/llm-seo", type: "guide" },
        { title: "Naming Examples", url: "/resources/examples/naming", type: "examples" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track", type: "guide" }
      ]}
    />
  );
};

export default SEOTerm;
