import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsRebrandly = () => {
  const faqs = [
    // Core Differences
    { question: "What's the main difference between utm.one and Rebrandly?", answer: "Rebrandly focuses on branded link aesthetics. utm.one focuses on the complete link lifecycle including attribution, governance, Clean Track Intelligence™, and AI-powered features for enterprise GTM teams." },
    { question: "Is utm.one a Rebrandly alternative?", answer: "Yes, utm.one is a comprehensive Rebrandly alternative that goes beyond branding. It includes trust previews, UTM governance, multi-touch attribution, and accessibility features Rebrandly doesn't offer." },
    
    // Migration Questions
    { question: "Can I import my Rebrandly links to utm.one?", answer: "Yes, utm.one supports bulk import from Rebrandly. Export your links as CSV and import them directly while preserving your branded domains and analytics history." },
    { question: "How do I migrate my custom domains from Rebrandly?", answer: "Simply point your DNS records to utm.one's servers. Our domain verification wizard guides you through the process, typically completed in under 10 minutes." },
    { question: "Will my Rebrandly branded links continue working?", answer: "Yes, existing links continue working. utm.one supports the same custom domain structure, ensuring zero downtime during migration." },
    
    // Pricing Questions
    { question: "Is utm.one cheaper than Rebrandly?", answer: "utm.one offers better value with unlimited team members included. Rebrandly's per-seat pricing ($39/user/month) adds up quickly for teams, while utm.one Growth at $49/month includes unlimited users." },
    { question: "Does utm.one charge for custom domains?", answer: "utm.one includes multiple custom domains on paid plans without extra fees. Rebrandly limits domains per plan and charges for additional ones." },
    { question: "Does utm.one have hidden fees?", answer: "No, utm.one pricing is transparent with no per-click overage charges, no per-seat fees on Growth+, and no hidden costs for standard features." },
    
    // Feature Questions
    { question: "Does utm.one support workspace branding?", answer: "Yes, utm.one supports full workspace customization including branded QR codes, custom domains, and white-label options on Business plans." },
    { question: "Can I create branded QR codes with utm.one?", answer: "Yes, utm.one includes advanced QR customization with brand colors, logo embedding, and AI-generated stamp designs that match your brand identity." },
    { question: "Does utm.one have link retargeting?", answer: "Yes, utm.one supports retargeting pixels from Facebook, Google, LinkedIn, and custom platforms for remarketing your link clickers." },
    
    // Enterprise Questions
    { question: "Does utm.one offer workspace isolation?", answer: "Yes, utm.one provides complete workspace isolation with separate domains, users, links, and analytics. Perfect for agencies managing multiple clients." },
    { question: "Can I white-label utm.one?", answer: "Yes, Enterprise plans include white-label options where you can rebrand the entire platform with your agency's identity." },
    { question: "Does utm.one support team collaboration?", answer: "Yes, utm.one includes real-time collaboration, shared link libraries, team analytics dashboards, and approval workflows for enterprise teams." },
    
    // Use Case Questions
    { question: "Which is better for brand consistency: utm.one or Rebrandly?", answer: "utm.one provides deeper brand consistency through UTM governance rules, naming conventions, and approval workflows that ensure every link aligns with brand standards—not just the URL appearance." },
    { question: "Which is better for analytics: utm.one or Rebrandly?", answer: "utm.one offers significantly more advanced analytics including multi-touch attribution, revenue tracking, identity graphs, and Clean Track Intelligence™ that Rebrandly doesn't provide." },
  ];

  const featureCategories = [
    {
      name: "Branded Link Features",
      features: [
        { capability: "Custom Branded Domains", utmOne: "Unlimited", competitor: "Limited" },
        { capability: "Vanity URLs", utmOne: true, competitor: true },
        { capability: "Semantic Slugs", utmOne: true, competitor: "Partial" },
        { capability: "Custom Slug Length", utmOne: true, competitor: true },
        { capability: "Link-in-Bio Pages", utmOne: true, competitor: true },
        { capability: "Workspace Branding", utmOne: true, competitor: true },
        { capability: "White-Label Platform", utmOne: "Enterprise", competitor: false },
      ]
    },
    {
      name: "Analytics & Attribution",
      features: [
        { capability: "Click Analytics", utmOne: true, competitor: true },
        { capability: "Device Breakdown", utmOne: true, competitor: true },
        { capability: "Geographic Data", utmOne: true, competitor: true },
        { capability: "Referrer Tracking", utmOne: true, competitor: true },
        { capability: "Multi-Touch Attribution", utmOne: true, competitor: false },
        { capability: "Revenue Attribution", utmOne: true, competitor: false },
        { capability: "Clean Track Intelligence™", utmOne: true, competitor: false },
        { capability: "Cross-Device Tracking", utmOne: true, competitor: false },
        { capability: "Conversion Funnels", utmOne: true, competitor: false },
      ]
    },
    {
      name: "UTM Management",
      features: [
        { capability: "UTM Builder", utmOne: true, competitor: "Basic" },
        { capability: "UTM Templates", utmOne: true, competitor: false },
        { capability: "UTM Governance Rules", utmOne: true, competitor: false },
        { capability: "Naming Conventions", utmOne: true, competitor: false },
        { capability: "Campaign Organization", utmOne: true, competitor: "Basic" },
        { capability: "Bulk UTM Updates", utmOne: true, competitor: false },
      ]
    },
    {
      name: "QR Code Features",
      features: [
        { capability: "QR Code Generation", utmOne: true, competitor: true },
        { capability: "Custom Colors", utmOne: true, competitor: true },
        { capability: "Logo Embedding", utmOne: true, competitor: "Paid" },
        { capability: "QR Attribution", utmOne: true, competitor: "Partial" },
        { capability: "AI Stamp Generation", utmOne: true, competitor: false },
        { capability: "QR Templates", utmOne: true, competitor: false },
        { capability: "Print-Ready Export", utmOne: true, competitor: true },
      ]
    },
    {
      name: "Trust & Security",
      features: [
        { capability: "Trust Preview Pages", utmOne: true, competitor: false },
        { capability: "Safety Scanning", utmOne: true, competitor: false },
        { capability: "Link Transparency", utmOne: true, competitor: false },
        { capability: "SSL Certificates", utmOne: true, competitor: true },
        { capability: "SOC 2 Compliance", utmOne: true, competitor: true },
        { capability: "GDPR Compliance", utmOne: true, competitor: true },
        { capability: "Role-Based Access", utmOne: true, competitor: true },
        { capability: "Audit Logs", utmOne: true, competitor: false },
      ]
    },
    {
      name: "AI & Automation",
      features: [
        { capability: "AI Semantic Analysis", utmOne: true, competitor: false },
        { capability: "Predictive Analytics", utmOne: true, competitor: false },
        { capability: "Smart Routing", utmOne: true, competitor: false },
        { capability: "Auto UTM Suggestions", utmOne: true, competitor: false },
        { capability: "Metadata for LLMs", utmOne: true, competitor: false },
        { capability: "Auto-Tagging", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Integrations",
      features: [
        { capability: "REST API", utmOne: true, competitor: true },
        { capability: "Webhooks", utmOne: true, competitor: true },
        { capability: "Zapier", utmOne: true, competitor: true },
        { capability: "Slack", utmOne: true, competitor: false },
        { capability: "GA4 Integration", utmOne: true, competitor: false },
        { capability: "Retargeting Pixels", utmOne: true, competitor: true },
        { capability: "Chrome Extension", utmOne: true, competitor: true },
      ]
    },
    {
      name: "Accessibility",
      features: [
        { capability: "WCAG AAA Compliance", utmOne: true, competitor: false },
        { capability: "Screen Reader Support", utmOne: true, competitor: "Partial" },
        { capability: "Keyboard Navigation", utmOne: true, competitor: "Partial" },
        { capability: "High Contrast Mode", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Pricing & Value",
      features: [
        { capability: "Free Plan", utmOne: true, competitor: true },
        { capability: "Unlimited Team Members", utmOne: true, competitor: false },
        { capability: "Per-Seat Pricing", utmOne: "No", competitor: "$39/user" },
        { capability: "Transparent Pricing", utmOne: true, competitor: false },
        { capability: "No Click Overages", utmOne: true, competitor: false },
      ]
    },
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs Rebrandly", url: "https://utm.one/compare/rebrandly" }
  ];

  const relatedComparisons = [
    { name: "utm.one vs Bitly", path: "/compare/bitly", category: "link shortening" },
    { name: "utm.one vs Short.io", path: "/compare/short-io", category: "developer-focused" },
    { name: "utm.one vs Bl.ink", path: "/compare/bl-ink", category: "enterprise" },
  ];

  return (
    <>
      <SEO 
        title="utm.one vs Rebrandly (2025) - Complete Feature Comparison"
        description="Detailed comparison of utm.one vs Rebrandly. See how utm.one offers attribution, governance, and enterprise features beyond branded links."
        canonical="https://utm.one/compare/rebrandly"
      />
      <ArticleSchema
        headline="utm.one vs Rebrandly - Branded Link Management Comparison 2025"
        description="Comprehensive comparison of utm.one and Rebrandly covering 50+ features across branding, analytics, governance, and pricing."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise link management platform with clarity, trust, accessibility, and structured attribution"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="rebrandly"
        category="branded links + attribution"
        headline="utm.one vs rebrandly"
        subheadline="rebrandly focuses on branded URLs. utm.one focuses on clarity, trust, accessibility, and structured attribution."
        summary={{
          line1: "rebrandly makes branded links",
          line2: "utm.one makes meaningful links that drive revenue"
        }}
        featureCategories={featureCategories}
        faqs={faqs}
        pricing={{
          utmOne: "From $29/mo",
          competitor: "From $39/user/mo",
          utmOneDetails: [
            "Unlimited team members included",
            "Unlimited custom domains on Growth",
            "Full attribution suite included",
            "No per-seat charges ever"
          ],
          competitorDetails: [
            "Per-user pricing multiplies quickly",
            "Limited domains per plan",
            "No attribution features",
            "Advanced features cost extra"
          ]
        }}
        whitespace={{
          headline: "branding ≠ clarity"
        ,
          points: [
            "utm.one focuses on the click experience, not just the slug",
            "trust previews before clicks build confidence",
            "semantic meaning in every link structure",
            "accessibility built-in from day one",
            "metadata for AI discovery and indexing",
            "governance without complexity or overhead",
            "attribution that connects links to revenue",
            "enterprise security by default"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who rebrandly is for",
          points: [
            "small teams focused on link aesthetics",
            "basic branding without governance needs",
            "simple redirects without attribution",
            "teams that don't need UTM management",
            "individual users or small marketing teams"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "GTM teams needing attribution",
            "enterprise ops requiring governance",
            "partner programs with tracking needs",
            "metadata-driven organizations",
            "agencies managing multiple brands",
            "teams requiring accessibility compliance"
          ]
        }}
        ctaText="see utm.one"
        relatedComparisons={relatedComparisons}
        migrationCta={{
          headline: "Ready to migrate from Rebrandly?",
          description: "Transfer your branded domains and links seamlessly. Keep your custom domains working while gaining attribution superpowers."
        }}
      />
    </>
  );
};

export default UtmOneVsRebrandly;
