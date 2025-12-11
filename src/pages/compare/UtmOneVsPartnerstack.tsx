import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsPartnerstack = () => {
  const faqs = [
    // Core Differences
    { question: "What's the main difference between utm.one and PartnerStack?", answer: "PartnerStack manages complex partner ecosystems with marketplaces and payouts. utm.one makes partner links clean, trusted, and trackable with Clean Track Intelligence™ attribution." },
    { question: "Is utm.one a PartnerStack alternative?", answer: "utm.one is complementary or alternative depending on needs. For clean attribution links without ecosystem complexity, utm.one is ideal. For full marketplace management, PartnerStack offers more." },
    
    // Migration Questions
    { question: "Can I use utm.one with PartnerStack?", answer: "Yes, utm.one integrates via webhooks. Use utm.one for clean, governed partner links while PartnerStack handles marketplace and payouts." },
    { question: "Can utm.one replace PartnerStack?", answer: "For teams that need clean partner attribution without a marketplace, yes. utm.one handles links, tracking, QR codes, and governance without PartnerStack's complexity or cost." },
    { question: "How do I migrate from PartnerStack?", answer: "Export partner links and import to utm.one. Partners get clean branded links while you maintain attribution continuity." },
    
    // Pricing Questions
    { question: "Is utm.one cheaper than PartnerStack?", answer: "Significantly. PartnerStack requires enterprise contracts often $500+/month. utm.one starts at $29/month with partner features on Growth ($49/month)." },
    { question: "Does utm.one have partner fees?", answer: "No, utm.one has no per-partner fees or transaction costs. PartnerStack charges per partner and takes transaction percentages." },
    { question: "Does utm.one require annual contracts?", answer: "No, utm.one offers monthly billing with no commitments. PartnerStack typically requires annual enterprise contracts." },
    
    // Feature Questions
    { question: "Does utm.one have a partner marketplace?", answer: "No, utm.one focuses on clean link attribution, not marketplace discovery. If you need a marketplace, PartnerStack or similar platforms complement utm.one." },
    { question: "Does utm.one support partner onboarding?", answer: "Yes, utm.one provides simple partner onboarding with self-serve link creation, branded portals, and analytics dashboards." },
    { question: "Can partners track their own performance?", answer: "Yes, partners get access to their own analytics dashboards showing clicks, conversions, and attribution data." },
    
    // Enterprise Questions
    { question: "Does utm.one support enterprise partner programs?", answer: "Yes, utm.one Business and Enterprise plans support large partner programs with governance, SSO, audit logs, and dedicated support." },
    { question: "Can I customize partner experiences?", answer: "Yes, utm.one supports custom branding, white-label options, and tailored partner portals on Enterprise plans." },
    { question: "Does utm.one integrate with CRMs for partner data?", answer: "Yes, utm.one integrates with HubSpot, Salesforce, and other CRMs to sync partner attribution and conversion data." },
    
    // Use Case Questions
    { question: "Which is better for B2B SaaS partnerships: utm.one or PartnerStack?", answer: "utm.one is better for clean attribution without marketplace overhead. PartnerStack is better if you need partner discovery and complex ecosystem management." },
    { question: "Which is better for simple referral programs: utm.one or PartnerStack?", answer: "utm.one is ideal for simple, clean referral programs. PartnerStack's complexity and cost are overkill for straightforward partner tracking." },
  ];

  const featureCategories = [
    {
      name: "Partner Link Management",
      features: [
        { capability: "Partner Links", utmOne: true, competitor: true },
        { capability: "Clean Link Structure", utmOne: true, competitor: "Limited" },
        { capability: "Custom Branded Domains", utmOne: true, competitor: true },
        { capability: "Semantic Slugs", utmOne: true, competitor: false },
        { capability: "Trust Previews", utmOne: true, competitor: false },
        { capability: "Link Permanence", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Attribution & Analytics",
      features: [
        { capability: "Click Tracking", utmOne: true, competitor: true },
        { capability: "Conversion Tracking", utmOne: true, competitor: true },
        { capability: "Multi-Touch Attribution", utmOne: true, competitor: "Basic" },
        { capability: "Revenue Attribution", utmOne: true, competitor: true },
        { capability: "Clean Track Intelligence™", utmOne: true, competitor: false },
        { capability: "Identity Graph", utmOne: true, competitor: false },
        { capability: "Partner Analytics Dashboard", utmOne: true, competitor: true },
      ]
    },
    {
      name: "UTM & Governance",
      features: [
        { capability: "UTM Builder", utmOne: true, competitor: false },
        { capability: "UTM Templates", utmOne: true, competitor: false },
        { capability: "UTM Governance", utmOne: true, competitor: false },
        { capability: "Naming Conventions", utmOne: true, competitor: false },
        { capability: "Clean-Track Rules", utmOne: true, competitor: false },
        { capability: "Approval Workflows", utmOne: true, competitor: true },
      ]
    },
    {
      name: "QR Codes",
      features: [
        { capability: "QR Code Generation", utmOne: true, competitor: false },
        { capability: "Branded QR Codes", utmOne: true, competitor: false },
        { capability: "QR Attribution", utmOne: true, competitor: false },
        { capability: "AI Stamp Generation", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Partner Ecosystem",
      features: [
        { capability: "Partner Marketplace", utmOne: false, competitor: true },
        { capability: "Partner Discovery", utmOne: false, competitor: true },
        { capability: "Partner Onboarding", utmOne: "Simple", competitor: "Heavy" },
        { capability: "Partner Portal", utmOne: true, competitor: true },
        { capability: "Co-Selling Features", utmOne: false, competitor: true },
      ]
    },
    {
      name: "Payouts & Commission",
      features: [
        { capability: "Commission Management", utmOne: false, competitor: true },
        { capability: "Automated Payouts", utmOne: false, competitor: true },
        { capability: "Commission Tiers", utmOne: false, competitor: true },
        { capability: "Tax Compliance", utmOne: false, competitor: true },
      ]
    },
    {
      name: "Security & Compliance",
      features: [
        { capability: "SSO/SAML", utmOne: true, competitor: true },
        { capability: "Role-Based Access", utmOne: true, competitor: true },
        { capability: "Audit Logs", utmOne: true, competitor: true },
        { capability: "SOC 2 Compliance", utmOne: true, competitor: true },
        { capability: "WCAG AAA Compliance", utmOne: true, competitor: false },
      ]
    },
    {
      name: "AI & Intelligence",
      features: [
        { capability: "AI Semantic Analysis", utmOne: true, competitor: false },
        { capability: "Predictive Analytics", utmOne: true, competitor: false },
        { capability: "Smart Routing", utmOne: true, competitor: false },
        { capability: "Metadata for LLMs", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Pricing & UX",
      features: [
        { capability: "Simple Interface", utmOne: true, competitor: false },
        { capability: "Fast Onboarding", utmOne: true, competitor: false },
        { capability: "Transparent Pricing", utmOne: "From $29/mo", competitor: "Enterprise" },
        { capability: "Monthly Billing", utmOne: true, competitor: false },
        { capability: "No Transaction Fees", utmOne: true, competitor: false },
      ]
    },
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs PartnerStack", url: "https://utm.one/compare/partnerstack" }
  ];

  const relatedComparisons = [
    { name: "utm.one vs FirstPromoter", path: "/compare/firstpromoter", category: "affiliate tracking" },
    { name: "utm.one vs Rewardful", path: "/compare/rewardful", category: "referral programs" },
    { name: "utm.one vs Bl.ink", path: "/compare/bl-ink", category: "enterprise links" },
  ];

  return (
    <>
      <SEO 
        title="utm.one vs PartnerStack (2025) - Partner Ecosystem Comparison"
        description="Detailed comparison of utm.one vs PartnerStack. See how utm.one offers clean attribution without ecosystem complexity."
        canonical="https://utm.one/compare/partnerstack"
      />
      <ArticleSchema
        headline="utm.one vs PartnerStack - Partner Ecosystem Comparison 2025"
        description="Comprehensive comparison of utm.one and PartnerStack covering 50+ features across attribution, governance, and pricing."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise partner attribution platform with clean links, simple UX, and transparent pricing"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="partnerstack"
        category="partner attribution + simplicity"
        headline="utm.one vs partnerstack"
        subheadline="partnerstack manages partner ecosystems. utm.one makes partner links clean, trusted, and trackable."
        summary={{
          line1: "partnerstack is complex & powerful",
          line2: "utm.one is simple & predictable"
        }}
        featureCategories={featureCategories}
        faqs={faqs}
        pricing={{
          utmOne: "From $29/mo",
          competitor: "$500+/mo Enterprise",
          utmOneDetails: [
            "Monthly billing available",
            "Unlimited partner links",
            "No transaction fees",
            "Full attribution suite"
          ],
          competitorDetails: [
            "Annual contracts required",
            "Per-partner fees",
            "Transaction percentages",
            "Enterprise pricing only"
          ]
        }}
        whitespace={{
          headline: "perfect for teams that want clarity, not overhead",
          points: [
            "simple interface partners love",
            "clean partner links with trust",
            "QR attribution for events",
            "metadata built-in for discovery",
            "accessible design by default",
            "transparent, predictable pricing",
            "governance without complexity",
            "no ecosystem lock-in"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who partnerstack is for",
          points: [
            "large partner ecosystems",
            "marketplace-based programs",
            "complex co-selling workflows",
            "enterprise budgets ($500+/mo)",
            "teams needing partner discovery"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "clarity-first teams",
            "simple partner programs",
            "clean attribution needs",
            "transparent operations",
            "budget-conscious programs",
            "teams avoiding ecosystem lock-in"
          ]
        }}
        ctaText="see utm.one partner program"
        relatedComparisons={relatedComparisons}
        migrationCta={{
          headline: "Simplify your partner program?",
          description: "Get clean attribution without ecosystem complexity. No contracts, no transaction fees, no overhead."
        }}
      />
    </>
  );
};

export default UtmOneVsPartnerstack;
