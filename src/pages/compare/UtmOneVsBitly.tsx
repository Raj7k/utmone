import { ComparisonPage } from "@/components/compare/ComparisonPage";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, ProductSchema } from "@/components/seo/SchemaMarkup";

const UtmOneVsBitly = () => {
  const faqs = [
    // Core Differences
    { question: "What's the main difference between utm.one and Bitly?", answer: "Bitly focuses on link shortening and basic analytics. utm.one is an enterprise attribution platform with trust indicators, UTM governance, Clean Track Intelligence™, QR attribution, and AI-powered features for modern GTM teams." },
    { question: "Is utm.one a Bitly alternative?", answer: "Yes, utm.one is designed as a modern Bitly alternative for teams that need more than shortening. It includes semantic slugs, trust previews, accessibility compliance, metadata for AI discovery, and enterprise governance features Bitly doesn't offer." },
    
    // Migration Questions
    { question: "Can I import my Bitly links to utm.one?", answer: "Yes, utm.one supports bulk import of existing links. You can export your Bitly links as CSV and import them directly into utm.one while preserving your click history and analytics." },
    { question: "How long does migration from Bitly take?", answer: "Most teams complete migration within 24-48 hours. Our migration wizard handles bulk imports, and you can run both platforms in parallel during the transition period." },
    { question: "Will my existing Bitly links break if I switch?", answer: "No, your existing Bitly links will continue working. utm.one can create new links with 301 redirects from your old Bitly URLs, ensuring zero downtime during migration." },
    
    // Pricing Questions
    { question: "Is utm.one cheaper than Bitly?", answer: "utm.one offers transparent pricing starting at $29/month for Starter, compared to Bitly's $35/month. Plus, utm.one includes unlimited team members on all plans, while Bitly charges per seat." },
    { question: "Does utm.one have a free plan?", answer: "Yes, utm.one offers a free forever plan with basic link shortening, QR codes, and analytics. Paid plans unlock advanced features like custom domains, governance, and attribution." },
    { question: "Does utm.one charge per team member?", answer: "No, utm.one includes unlimited team members on Growth and Business plans. Bitly charges additional fees per seat, making utm.one more cost-effective for growing teams." },
    
    // Feature Questions
    { question: "Does utm.one have an API?", answer: "Yes, utm.one provides a comprehensive REST API for programmatic link creation, bulk operations, and analytics. API access is available on Growth plans and above." },
    { question: "Can I use custom domains with utm.one?", answer: "Yes, utm.one supports unlimited custom domains with automatic SSL provisioning. You can use branded domains like go.yourcompany.com for professional link branding." },
    { question: "Does utm.one support QR codes?", answer: "Yes, utm.one includes advanced QR code generation with full attribution tracking, customizable designs, logo embedding, and AI-powered stamp generation on Business plans." },
    
    // Enterprise Questions
    { question: "Does utm.one support SSO?", answer: "Yes, utm.one Business and Enterprise plans include SAML SSO integration with providers like Okta, Azure AD, and Google Workspace for secure team access." },
    { question: "Is utm.one SOC 2 compliant?", answer: "utm.one is SOC 2 Type II compliant with enterprise-grade security, encryption at rest, and comprehensive audit logging for compliance requirements." },
    { question: "Does utm.one have role-based permissions?", answer: "Yes, utm.one includes granular role-based access control with Owner, Admin, Editor, and Viewer roles. Custom roles are available on Enterprise plans." },
    
    // Use Case Questions
    { question: "Which is better for marketing teams: utm.one or Bitly?", answer: "utm.one is purpose-built for marketing teams with UTM governance, campaign attribution, and Clean Track Intelligence™. Bitly is better suited for simple link shortening without marketing-specific features." },
    { question: "Which is better for agencies: utm.one or Bitly?", answer: "utm.one is ideal for agencies with multi-workspace support, white-label options, and client reporting features. Agencies can manage multiple brands from a single dashboard with separate analytics." },
  ];

  const featureCategories = [
    {
      name: "Core Link Features",
      features: [
        { capability: "Link Shortening", utmOne: true, competitor: true },
        { capability: "Custom Domains", utmOne: "Unlimited", competitor: "Limited" },
        { capability: "Branded Links", utmOne: true, competitor: true },
        { capability: "Semantic Slugs", utmOne: true, competitor: false },
        { capability: "Link Expiration", utmOne: true, competitor: true },
        { capability: "Password Protection", utmOne: true, competitor: "Paid" },
        { capability: "Link Permanence Guarantee", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Analytics & Attribution",
      features: [
        { capability: "Click Tracking", utmOne: true, competitor: true },
        { capability: "Device Analytics", utmOne: true, competitor: true },
        { capability: "Geographic Analytics", utmOne: true, competitor: true },
        { capability: "Referrer Tracking", utmOne: true, competitor: true },
        { capability: "Multi-Touch Attribution", utmOne: true, competitor: false },
        { capability: "Revenue Attribution", utmOne: true, competitor: false },
        { capability: "Clean Track Intelligence™", utmOne: true, competitor: false },
        { capability: "Identity Graph", utmOne: true, competitor: false },
        { capability: "Conversion Tracking", utmOne: true, competitor: false },
      ]
    },
    {
      name: "UTM & Campaign Management",
      features: [
        { capability: "UTM Builder", utmOne: true, competitor: "Basic" },
        { capability: "UTM Templates", utmOne: true, competitor: false },
        { capability: "UTM Governance Rules", utmOne: true, competitor: false },
        { capability: "Campaign Grouping", utmOne: true, competitor: false },
        { capability: "Naming Convention Enforcement", utmOne: true, competitor: false },
        { capability: "Bulk UTM Operations", utmOne: true, competitor: false },
      ]
    },
    {
      name: "QR Codes",
      features: [
        { capability: "QR Code Generation", utmOne: true, competitor: true },
        { capability: "Custom QR Colors", utmOne: true, competitor: "Paid" },
        { capability: "Logo Embedding", utmOne: true, competitor: "Paid" },
        { capability: "QR Attribution Tracking", utmOne: true, competitor: false },
        { capability: "AI Stamp Generation", utmOne: true, competitor: false },
        { capability: "Dynamic QR Codes", utmOne: true, competitor: true },
      ]
    },
    {
      name: "Governance & Security",
      features: [
        { capability: "Role-Based Access Control", utmOne: true, competitor: "Basic" },
        { capability: "SSO/SAML", utmOne: true, competitor: "Enterprise" },
        { capability: "Audit Logs", utmOne: true, competitor: false },
        { capability: "Link Approval Workflows", utmOne: true, competitor: false },
        { capability: "SOC 2 Compliance", utmOne: true, competitor: true },
        { capability: "Data Export", utmOne: true, competitor: true },
        { capability: "GDPR Compliance", utmOne: true, competitor: true },
      ]
    },
    {
      name: "AI & Intelligence",
      features: [
        { capability: "AI Semantic Analysis", utmOne: true, competitor: false },
        { capability: "Predictive Performance", utmOne: true, competitor: false },
        { capability: "Smart Routing", utmOne: true, competitor: false },
        { capability: "Auto UTM Suggestions", utmOne: true, competitor: false },
        { capability: "Metadata for LLMs", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Integrations & API",
      features: [
        { capability: "REST API", utmOne: true, competitor: true },
        { capability: "Webhooks", utmOne: true, competitor: "Paid" },
        { capability: "Zapier Integration", utmOne: true, competitor: true },
        { capability: "Slack Integration", utmOne: true, competitor: false },
        { capability: "GA4 Integration", utmOne: true, competitor: false },
        { capability: "CRM Integration", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Accessibility & Trust",
      features: [
        { capability: "WCAG AAA Compliance", utmOne: true, competitor: false },
        { capability: "Trust Preview Pages", utmOne: true, competitor: false },
        { capability: "Safety Scan", utmOne: true, competitor: false },
        { capability: "Link Transparency", utmOne: true, competitor: false },
      ]
    },
    {
      name: "Pricing & Support",
      features: [
        { capability: "Free Plan", utmOne: true, competitor: true },
        { capability: "Unlimited Team Members", utmOne: true, competitor: false },
        { capability: "Transparent Pricing", utmOne: true, competitor: false },
        { capability: "Priority Support", utmOne: true, competitor: "Paid" },
        { capability: "Dedicated CSM", utmOne: "Enterprise", competitor: "Enterprise" },
      ]
    },
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://utm.one" },
    { name: "Compare", url: "https://utm.one/compare" },
    { name: "utm.one vs Bitly", url: "https://utm.one/compare/bitly" }
  ];

  const relatedComparisons = [
    { name: "utm.one vs Rebrandly", path: "/compare/rebrandly", category: "branded links" },
    { name: "utm.one vs Short.io", path: "/compare/short-io", category: "link shortening" },
    { name: "utm.one vs Bl.ink", path: "/compare/bl-ink", category: "enterprise" },
  ];

  return (
    <>
      <SEO 
        title="utm.one vs Bitly (2025) - Complete Feature Comparison"
        description="Detailed comparison of utm.one vs Bitly. See how utm.one offers UTM governance, attribution, AI features, and enterprise security that Bitly doesn't provide."
        canonical="https://utm.one/compare/bitly"
      />
      <ArticleSchema
        headline="utm.one vs Bitly - Complete Enterprise Link Management Comparison 2025"
        description="Comprehensive comparison of utm.one and Bitly covering 50+ features across analytics, attribution, governance, AI, and pricing."
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name="utm.one"
        description="Enterprise link management platform with trust, governance, metadata, accessibility, and attribution"
        brand="utm.one"
      />
      <ComparisonPage
        competitor="bitly"
        category="short links + attribution"
        headline="utm.one vs bitly"
        subheadline="bitly shortens links. utm.one builds trust, structure, metadata, accessibility, and attribution around them."
        summary={{
          line1: "bitly is for shortening.",
          line2: "utm.one is for teams who need clean, governed, trustworthy links."
        }}
        featureCategories={featureCategories}
        faqs={faqs}
        pricing={{
          utmOne: "From $29/mo",
          competitor: "From $35/mo",
          utmOneDetails: [
            "Unlimited team members included",
            "All analytics features included",
            "No per-seat charges",
            "Transparent, predictable pricing"
          ],
          competitorDetails: [
            "Per-seat pricing adds up quickly",
            "Advanced features require upgrades",
            "QR customization costs extra",
            "Enterprise features locked behind sales"
          ]
        }}
        whitespace={{
          headline: "bitly solves speed. utm.one solves trust",
          points: [
            "transparent previews before clicks",
            "semantic links that make sense",
            "metadata built-in for AI discovery",
            "consistent UTMs with governance",
            "QR codes with full attribution",
            "clean governance without complexity",
            "accessibility-first design",
            "enterprise security by default"
          ]
        }}
        whoCompetitorIsFor={{
          title: "who bitly is for",
          points: [
            "one-off link shortening",
            "personal use and side projects",
            "light tracking without attribution",
            "teams that don't need governance",
            "basic QR code generation"
          ]
        }}
        whoUtmOneIsFor={{
          title: "who utm.one is for",
          points: [
            "marketing teams needing attribution",
            "sales teams tracking outreach",
            "marketing ops enforcing UTM standards",
            "developers building integrations",
            "partners needing clean tracking",
            "agencies managing multiple brands",
            "enterprises requiring governance"
          ]
        }}
        ctaText="see utm.one in action"
        relatedComparisons={relatedComparisons}
        migrationCta={{
          headline: "Ready to migrate from Bitly?",
          description: "Import your existing Bitly links in minutes. Our migration wizard preserves your click history and analytics."
        }}
      />
    </>
  );
};

export default UtmOneVsBitly;
