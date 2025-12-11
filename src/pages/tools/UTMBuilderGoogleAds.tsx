import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CTABanner } from "@/components/resources/CTABanner";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UTMBuilderGoogleAds = () => {
  const breadcrumbs = [
    { label: "tools", href: "/tools" },
    { label: "utm builder for google ads", href: "" }
  ];

  const faqs = [
    {
      question: "Do I need UTMs for Google Ads?",
      answer: "Google Ads auto-tagging (gclid) works with GA4, but manual UTMs give you control in other analytics tools and help with cross-platform comparison. Use both for complete tracking."
    },
    {
      question: "What UTM parameters should I use for Google Ads?",
      answer: "Use utm_source=google, utm_medium=cpc (for search) or utm_medium=display (for display network), utm_campaign={campaignid}, utm_content={adgroupid}, and utm_term={keyword}."
    },
    {
      question: "Can I use Google Ads ValueTrack parameters in UTMs?",
      answer: "Yes! Use {campaignid}, {adgroupid}, {keyword}, {matchtype}, and {device} in your UTM values. Google replaces these dynamically with actual values."
    },
    {
      question: "How do I track Search vs Display campaigns?",
      answer: "Use utm_medium=cpc for Search campaigns and utm_medium=display for Display Network. This segments your traffic correctly in analytics."
    },
    {
      question: "Should utm_term match my keywords?",
      answer: "Yes, use utm_term={keyword} to dynamically insert the keyword that triggered your ad. This shows exactly which keywords drive conversions."
    }
  ];

  const howToSteps = [
    { name: "Enter your landing page URL", text: "Paste the destination URL for your Google Ads" },
    { name: "Set utm_source to google", text: "This identifies Google as the traffic source" },
    { name: "Choose utm_medium", text: "Use 'cpc' for Search or 'display' for Display Network" },
    { name: "Use ValueTrack parameters", text: "Add {campaignid}, {keyword}, {matchtype} for dynamic tracking" },
    { name: "Set up in Google Ads", text: "Apply the tracking template at account, campaign, or ad level" },
    { name: "Verify tracking", text: "Check your analytics to confirm UTMs are being captured" }
  ];

  return (
    <>
      <SEO
        title="UTM Builder for Google Ads - Track Search & Display Campaigns | utm.one"
        description="Free UTM builder for Google Ads. Generate tracking templates with ValueTrack parameters for Search, Display, and Performance Max campaigns. Complete Google Ads UTM guide."
        canonical="https://utm.one/tools/utm-builder-google-ads"
        ogType="article"
        keywords={["utm builder google ads", "google ads tracking", "valuetrack parameters", "google ads utm", "ppc tracking"]}
      />
      <ArticleSchema
        headline="UTM Builder for Google Ads"
        description="Generate tracking templates with ValueTrack parameters for Google Ads Search, Display, and Performance Max campaigns"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <HowToSchema
        name="How to Create UTM Links for Google Ads"
        description="Step-by-step guide to creating tracked URLs for Google Ads campaigns"
        steps={howToSteps}
      />
      <SpeakableSchema headline="UTM Builder for Google Ads" summary="Generate tracking templates with ValueTrack parameters for Google Ads campaigns" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            back to tools
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#4285F4]/10 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4285F4"/>
                    <path d="M2 17l10 5 10-5" stroke="#4285F4" strokeWidth="2"/>
                    <path d="M2 12l10 5 10-5" stroke="#34A853" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground">UTM Builder for Google Ads</h1>
                  <p className="text-muted-foreground">generate tracking templates with ValueTrack parameters</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50 speakable-content">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Google Ads is often the largest paid traffic source for B2B and ecommerce. While auto-tagging works with GA4, manual UTMs give you control across all analytics tools and enable cross-platform comparison.
              </p>
              
              <UTMBuilderBasic />
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Google Ads UTM best practices</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_source:</strong> Always use <code className="text-sm bg-muted px-2 py-1 rounded">google</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_medium:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">cpc</code> for Search, <code className="text-sm bg-muted px-2 py-1 rounded">display</code> for Display Network
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_campaign:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">{'{campaignid}'}</code> for dynamic campaign ID
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_term:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">{'{keyword}'}</code> for dynamic keyword insertion
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_content:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">{'{adgroupid}'}</code> or <code className="text-sm bg-muted px-2 py-1 rounded">{'{creative}'}</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">ValueTrack parameters cheat sheet</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><code className="bg-muted px-2 py-1 rounded">{'{campaignid}'}</code> - Campaign ID</div>
                <div><code className="bg-muted px-2 py-1 rounded">{'{adgroupid}'}</code> - Ad group ID</div>
                <div><code className="bg-muted px-2 py-1 rounded">{'{keyword}'}</code> - Triggering keyword</div>
                <div><code className="bg-muted px-2 py-1 rounded">{'{matchtype}'}</code> - Match type (e, p, b)</div>
                <div><code className="bg-muted px-2 py-1 rounded">{'{device}'}</code> - Device (m, t, c)</div>
                <div><code className="bg-muted px-2 py-1 rounded">{'{network}'}</code> - Network (g, s, d)</div>
              </div>
            </div>

            <CTABanner
              title="connect Google Ads spend to actual revenue"
              description="utm.one tracks the full journey from ad click to conversion, showing true ROI."
              buttonText="get early access"
              buttonHref="/early-access"
              variant="primary"
            />

            <section className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-foreground">frequently asked questions</h2>
              <FAQAccordion items={faqs} />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default UTMBuilderGoogleAds;
