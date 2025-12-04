import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";

const Glossary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    "Core Tracking": "hsl(217 91% 60%)", // Electric Blue
    "Governance": "hsl(271 81% 60%)", // Purple
    "Analytics": "hsl(173 58% 39%)", // Teal
    "Marketing Channels": "hsl(25 95% 53%)", // Orange
    "Sales & RevOps": "hsl(330 81% 60%)", // Pink
    "B2B SaaS": "hsl(142 76% 36%)", // Green
    "Operational": "hsl(215 20% 45%)", // Slate
    "PLG & Product-Led": "hsl(262 83% 58%)", // Purple-Blue
    "Customer Success": "hsl(199 89% 48%)", // Bright Blue
    "Marketing Operations": "hsl(340 82% 52%)", // Magenta
  };

  const terms = [
    // Core Tracking (6 terms)
    {
      slug: "utm",
      term: "UTM",
      definition: "Urchin Tracking Module — standardized parameters appended to URLs to track campaign performance across analytics platforms.",
      category: "Core Tracking"
    },
    {
      slug: "source",
      term: "utm_source",
      definition: "Parameter identifying where traffic originated — platform or referrer sending visitors to your content.",
      category: "Core Tracking"
    },
    {
      slug: "medium",
      term: "utm_medium",
      definition: "Parameter categorizing the type of traffic — paid, organic, social, email, referral, or affiliate.",
      category: "Core Tracking"
    },
    {
      slug: "campaign",
      term: "utm_campaign",
      definition: "Parameter naming the specific marketing campaign, product launch, or promotion driving traffic.",
      category: "Core Tracking"
    },
    {
      slug: "content",
      term: "utm_content",
      definition: "Parameter identifying creative variants, ad copy versions, or placement details within a campaign.",
      category: "Core Tracking"
    },
    {
      slug: "term",
      term: "utm_term",
      definition: "Parameter capturing paid search keywords that triggered an ad impression and click.",
      category: "Core Tracking"
    },
    
    // Governance (3 terms)
    {
      slug: "taxonomy",
      term: "Taxonomy",
      definition: "Structured naming system for organizing campaigns, channels, and content in a consistent, scalable hierarchy.",
      category: "Governance"
    },
    {
      slug: "naming-convention",
      term: "Naming Convention",
      definition: "Structured pattern for constructing consistent, human-readable names across campaigns, links, and analytics entities.",
      category: "Governance"
    },
    {
      slug: "tracking-architecture",
      term: "Tracking Architecture",
      definition: "Comprehensive system design defining how data flows from user actions through UTMs, events, and analytics platforms to dashboards.",
      category: "Governance"
    },
    
    // Analytics (5 terms)
    {
      slug: "first-touch",
      term: "First-Touch Attribution",
      definition: "Attribution model assigning 100% conversion credit to the initial marketing touchpoint that introduced prospect.",
      category: "Analytics"
    },
    {
      slug: "last-touch",
      term: "Last-Touch Attribution",
      definition: "Attribution model assigning 100% conversion credit to the final marketing touchpoint before conversion.",
      category: "Analytics"
    },
    {
      slug: "multi-touch",
      term: "Multi-Touch Attribution",
      definition: "Attribution model distributing conversion credit across multiple touchpoints in customer journey.",
      category: "Analytics"
    },
    {
      slug: "linear",
      term: "Linear Attribution",
      definition: "Multi-touch model assigning equal credit to all touchpoints in conversion path.",
      category: "Analytics"
    },
    {
      slug: "time-decay",
      term: "Time-Decay Attribution",
      definition: "Multi-touch model assigning more credit to touchpoints closer to conversion event.",
      category: "Analytics"
    },
    
    // Marketing Channels (8 terms)
    {
      slug: "paid-search",
      term: "Paid Search",
      definition: "Advertising channel using paid text/shopping ads on search engines triggered by keyword queries.",
      category: "Marketing Channels"
    },
    {
      slug: "paid-social",
      term: "Paid Social",
      definition: "Advertising channel using paid promoted posts/ads on social media platforms.",
      category: "Marketing Channels"
    },
    {
      slug: "organic-social",
      term: "Organic Social",
      definition: "Non-paid social media posts/shares driving unpaid traffic from social platforms.",
      category: "Marketing Channels"
    },
    {
      slug: "email",
      term: "Email Marketing",
      definition: "Marketing channel using email newsletters, campaigns, and automation to engage audiences.",
      category: "Marketing Channels"
    },
    {
      slug: "seo",
      term: "SEO (Search Engine Optimization)",
      definition: "Organic channel driving traffic via unpaid search engine results through content/technical optimization.",
      category: "Marketing Channels"
    },
    {
      slug: "referral",
      term: "Referral Traffic",
      definition: "Traffic originating from external website links, blog mentions, or content citations.",
      category: "Marketing Channels"
    },
    {
      slug: "direct",
      term: "Direct Traffic",
      definition: "Traffic arriving with no identifiable referrer — typed URLs, bookmarks, or dark social.",
      category: "Marketing Channels"
    },
    {
      slug: "display",
      term: "Display Advertising",
      definition: "Visual banner/video ads served on websites and apps via programmatic ad networks.",
      category: "Marketing Channels"
    },
    
    // Sales & RevOps (7 terms)
    {
      slug: "mql",
      term: "MQL (Marketing Qualified Lead)",
      definition: "Lead meeting marketing-defined engagement threshold, signaling interest but not yet sales-ready.",
      category: "Sales & RevOps"
    },
    {
      slug: "sql",
      term: "SQL (Sales Qualified Lead)",
      definition: "Lead meeting sales-defined qualification criteria, ready for direct sales outreach.",
      category: "Sales & RevOps"
    },
    {
      slug: "sal",
      term: "SAL (Sales Accepted Lead)",
      definition: "Marketing-qualified lead formally accepted by sales for follow-up and nurturing.",
      category: "Sales & RevOps"
    },
    {
      slug: "lead-scoring",
      term: "Lead Scoring",
      definition: "Quantitative framework assigning numerical values to leads based on engagement and fit signals.",
      category: "Sales & RevOps"
    },
    {
      slug: "conversion-rate",
      term: "Conversion Rate",
      definition: "Percentage of visitors completing desired action — form submission, purchase, signup.",
      category: "Sales & RevOps"
    },
    {
      slug: "pipeline",
      term: "Pipeline",
      definition: "Collection of sales opportunities at various stages from initial contact to closed deal.",
      category: "Sales & RevOps"
    },
    {
      slug: "cohort",
      term: "Cohort Analysis",
      definition: "Grouping users by shared characteristics or time period to track retention and behavior patterns.",
      category: "Sales & RevOps"
    },
    
    // B2B SaaS (6 terms)
    {
      slug: "arr",
      term: "ARR (Annual Recurring Revenue)",
      definition: "Annualized value of subscription revenue, normalizing contracts to yearly basis for growth tracking.",
      category: "B2B SaaS"
    },
    {
      slug: "mrr",
      term: "MRR (Monthly Recurring Revenue)",
      definition: "Monthly value of all active subscriptions, excluding one-time payments and variable usage.",
      category: "B2B SaaS"
    },
    {
      slug: "cac",
      term: "CAC (Customer Acquisition Cost)",
      definition: "Total sales and marketing spend divided by number of customers acquired in period.",
      category: "B2B SaaS"
    },
    {
      slug: "ltv",
      term: "LTV (Lifetime Value)",
      definition: "Predicted total revenue from average customer over entire relationship duration.",
      category: "B2B SaaS"
    },
    {
      slug: "churn",
      term: "Churn Rate",
      definition: "Percentage of customers or revenue lost in period due to cancellations.",
      category: "B2B SaaS"
    },
    {
      slug: "activation",
      term: "Activation Rate",
      definition: "Percentage of new users reaching first value milestone within defined timeframe.",
      category: "B2B SaaS"
    },
    
    // Operational (5 terms)
    {
      slug: "link-shortener",
      term: "Link Shortener",
      definition: "Service converting long URLs into short, memorable links for easier sharing and tracking.",
      category: "Operational"
    },
    {
      slug: "qr-code",
      term: "QR Code",
      definition: "Scannable matrix barcode encoding URL, enabling smartphone camera to instantly navigate to link.",
      category: "Operational"
    },
    {
      slug: "redirect",
      term: "Redirect",
      definition: "Server instruction forwarding visitors from short link to destination URL while tracking analytics.",
      category: "Operational"
    },
    {
      slug: "custom-domain",
      term: "Custom Domain",
      definition: "Branded domain for short links matching company brand instead of generic shortener domain.",
      category: "Operational"
    },
    {
      slug: "link-expiration",
      term: "Link Expiration",
      definition: "Time-based or click-based limit after which short link stops redirecting or shows custom message.",
      category: "Operational"
    },
    
    // PLG & Product-Led (3 terms)
    {
      slug: "pql",
      term: "PQL (Product Qualified Lead)",
      definition: "User demonstrating product value through usage behavior, indicating sales-readiness via product engagement.",
      category: "PLG & Product-Led"
    },
    {
      slug: "self-serve-conversion",
      term: "Self-Serve Conversion",
      definition: "User upgrading to paid plan without sales interaction, completing purchase through product interface.",
      category: "PLG & Product-Led"
    },
    {
      slug: "usage-threshold",
      term: "Usage Threshold",
      definition: "Predefined usage limit triggering upgrade prompts, paywalls, or sales outreach when reached.",
      category: "PLG & Product-Led"
    },
    
    // Customer Success (9 terms)
    {
      slug: "health-score",
      term: "Health Score",
      definition: "Composite metric predicting customer retention likelihood based on product usage, engagement, and satisfaction signals.",
      category: "Customer Success"
    },
    {
      slug: "renewal-motion",
      term: "Renewal Motion",
      definition: "Structured process and timeline for managing subscription renewals and preventing churn.",
      category: "Customer Success"
    },
    {
      slug: "qbr",
      term: "QBR (Quarterly Business Review)",
      definition: "Strategic check-in meeting reviewing customer goals, product usage, ROI, and expansion opportunities.",
      category: "Customer Success"
    },
    {
      slug: "time-to-value",
      term: "Time-to-Value",
      definition: "Duration from signup to first meaningful outcome, measuring onboarding efficiency and product stickiness.",
      category: "Customer Success"
    },
    {
      slug: "implementation-plan",
      term: "Implementation Plan",
      definition: "Structured roadmap guiding customer from purchase through full product deployment and adoption.",
      category: "Customer Success"
    },
    {
      slug: "adoption-milestones",
      term: "Adoption Milestones",
      definition: "Predefined usage benchmarks indicating successful product integration and value realization.",
      category: "Customer Success"
    },
    {
      slug: "early-churn-signals",
      term: "Early Churn Signals",
      definition: "Leading behavioral indicators predicting increased cancellation risk before formal churn occurs.",
      category: "Customer Success"
    },
    {
      slug: "reactivation-campaign",
      term: "Reactivation Campaign",
      definition: "Targeted outreach re-engaging churned or inactive customers to restore product usage.",
      category: "Customer Success"
    },
    {
      slug: "value-moments",
      term: "Value Moments",
      definition: "Critical product interactions where users experience tangible benefits, driving retention and expansion.",
      category: "Customer Success"
    },
    
    // Marketing Operations (18 terms)
    {
      slug: "funnel-math",
      term: "Funnel Math",
      definition: "Quantitative framework calculating required top-of-funnel volume to hit revenue targets given conversion rates.",
      category: "Marketing Operations"
    },
    {
      slug: "lead-velocity-rate",
      term: "Lead Velocity Rate",
      definition: "Month-over-month percentage growth in qualified leads, predicting future revenue momentum.",
      category: "Marketing Operations"
    },
    {
      slug: "conversion-waterfall",
      term: "Conversion Waterfall",
      definition: "Sequential visualization showing drop-off rates at each funnel stage from awareness to purchase.",
      category: "Marketing Operations"
    },
    {
      slug: "commit-forecast",
      term: "Commit Forecast",
      definition: "High-confidence revenue prediction sales commits to delivering, typically 90%+ probability deals.",
      category: "Marketing Operations"
    },
    {
      slug: "pipeline-coverage-ratio",
      term: "Pipeline Coverage Ratio",
      definition: "Total pipeline value divided by quota, indicating sufficient opportunity to hit revenue targets.",
      category: "Marketing Operations"
    },
    {
      slug: "run-rate",
      term: "Run-Rate",
      definition: "Current period's revenue annualized, projecting yearly performance based on recent trajectory.",
      category: "Marketing Operations"
    },
    {
      slug: "quality-score",
      term: "Quality Score",
      definition: "Platform-assigned metric rating ad relevance, landing page experience, and expected click-through rate.",
      category: "Marketing Operations"
    },
    {
      slug: "bid-strategy",
      term: "Bid Strategy",
      definition: "Automated or manual approach determining how much to pay per click/impression to optimize campaign goals.",
      category: "Marketing Operations"
    },
    {
      slug: "creative-fatigue",
      term: "Creative Fatigue",
      definition: "Performance decline when target audience repeatedly sees same ad creative, reducing engagement over time.",
      category: "Marketing Operations"
    },
    {
      slug: "booth-engagement-rate",
      term: "Booth Engagement Rate",
      definition: "Percentage of event attendees meaningfully interacting with trade show booth versus total foot traffic.",
      category: "Marketing Operations"
    },
    {
      slug: "event-roi-model",
      term: "Event ROI Model",
      definition: "Framework calculating event profitability by comparing total costs against pipeline and revenue generated.",
      category: "Marketing Operations"
    },
    {
      slug: "pipeline-influence",
      term: "Pipeline Influence",
      definition: "Percentage of closed deals where marketing touchpoint occurred anywhere in customer journey.",
      category: "Marketing Operations"
    },
    {
      slug: "solution-mapping",
      term: "Solution Mapping",
      definition: "Process aligning product capabilities to prospect's specific technical requirements and use cases.",
      category: "Marketing Operations"
    },
    {
      slug: "technical-validation",
      term: "Technical Validation",
      definition: "Proof-of-concept phase where prospect tests product against technical requirements before purchase.",
      category: "Marketing Operations"
    },
    {
      slug: "pilot-success-criteria",
      term: "Pilot Success Criteria",
      definition: "Predefined metrics and outcomes determining whether trial/proof-of-concept justifies full purchase.",
      category: "Marketing Operations"
    },
    {
      slug: "gross-margin",
      term: "Gross Margin",
      definition: "Revenue minus cost of goods sold, expressed as percentage, measuring core product profitability.",
      category: "Marketing Operations"
    },
    {
      slug: "cac-payback-period",
      term: "CAC Payback Period",
      definition: "Time required to recover customer acquisition costs through gross margin, measuring efficiency.",
      category: "Marketing Operations"
    },
    {
      slug: "revenue-recognition",
      term: "Revenue Recognition",
      definition: "Rules for recording subscription revenue over contract term, matching revenue to delivery period.",
      category: "Marketing Operations"
    }
  ];

  const categories = Array.from(new Set(terms.map(t => t.category)));

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // Add ItemList schema markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "utm.one Glossary",
      "description": "Canonical definitions for UTM, taxonomy, attribution, and campaign tracking terminology.",
      "numberOfItems": terms.length,
      "itemListElement": terms.map((term, index) => ({
        "@type": "DefinedTerm",
        "@id": `#${term.slug}`,
        "position": index + 1,
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": "https://utm.one/resources/glossary",
        "url": `https://utm.one/resources/glossary/${term.slug}`
      }))
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.head.removeChild(schemaScript);
    };
  }, [terms]);

  return (
    <MainLayout showAnnouncement={false}>
      <section className="py-20 border-b border-white/10">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to resources
          </Link>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold hero-gradient">
                  Glossary
                </h1>
                <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.2)', color: 'rgba(59,130,246,1)' }}>
                  {terms.length} terms
                </span>
              </div>
              <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
                canonical definitions for utm, taxonomy, attribution, and campaign structure.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-zinc-900/40 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
                style={!selectedCategory ? { background: 'rgba(59,130,246,1)' } : {}}
              >
                all terms
              </button>
              {categories.map((category) => {
                const color = categoryColors[category] || "hsl(217 91% 60%)";
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "text-white"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    style={
                      selectedCategory === category
                        ? { backgroundColor: color }
                        : { color: color }
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-white/60">
                no terms found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTerms.map((item) => {
                const color = categoryColors[item.category] || "hsl(217 91% 60%)";
                return (
                  <Link
                    key={item.slug}
                    to={`/resources/glossary/${item.slug}`}
                    className="group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    style={{ borderLeftWidth: "4px", borderLeftColor: color }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-display font-semibold text-white group-hover:text-white/80 transition-colors">
                          {item.term}
                        </h2>
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                        {item.definition}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Glossary;
