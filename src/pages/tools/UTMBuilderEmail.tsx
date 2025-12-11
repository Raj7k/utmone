import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CTABanner } from "@/components/resources/CTABanner";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const UTMBuilderEmail = () => {
  const breadcrumbs = [
    { label: "tools", href: "/tools" },
    { label: "utm builder for email", href: "" }
  ];

  const faqs = [
    {
      question: "What UTM parameters should I use for email?",
      answer: "Use utm_source=email (or your email platform like 'mailchimp', 'hubspot'), utm_medium=email, utm_campaign=[campaign-name], utm_content=[cta-button or link-position], and utm_term=[subscriber-segment]."
    },
    {
      question: "Should I use 'email' or my ESP name as utm_source?",
      answer: "Both approaches work. Use 'email' for simplicity, or use your ESP name (mailchimp, hubspot, klaviyo) if you use multiple email tools and need to compare them."
    },
    {
      question: "What's the best utm_content for email?",
      answer: "Use utm_content to identify link position: header-logo, hero-cta, footer-link, inline-text. This shows which email elements drive the most clicks."
    },
    {
      question: "How do I track different subscriber segments?",
      answer: "Use utm_term for segments: new-subscribers, power-users, churned-win-back. This helps you understand which segments respond best to campaigns."
    },
    {
      question: "Should I track transactional emails with UTMs?",
      answer: "Yes, but use different utm_medium values: 'transactional' for receipts and notifications, 'email' for marketing emails. This separates engagement types."
    }
  ];

  const howToSteps = [
    { name: "Enter your email destination URL", text: "Paste the landing page URL for your email campaign" },
    { name: "Set utm_source", text: "Use 'email' or your ESP name (mailchimp, hubspot, klaviyo)" },
    { name: "Set utm_medium to email", text: "This groups all email traffic in analytics" },
    { name: "Name your campaign", text: "Use descriptive names like 'welcome-series-day3' or 'product-launch'" },
    { name: "Add utm_content", text: "Identify CTA position: hero-cta, sidebar-link, footer-button" },
    { name: "Use in your email", text: "Replace all links in your email with the tracked URLs" }
  ];

  return (
    <>
      <SEO
        title="UTM Builder for Email - Track Email Campaign Performance | utm.one"
        description="Free UTM builder for email campaigns. Generate tracking URLs for newsletters, drip sequences, and transactional emails. Best practices for email UTM tracking."
        canonical="https://utm.one/tools/utm-builder-email"
        ogType="article"
        keywords={["utm builder email", "email tracking", "email campaign utm", "newsletter tracking", "email analytics"]}
      />
      <ArticleSchema
        headline="UTM Builder for Email"
        description="Generate tracking URLs optimized for email campaigns, newsletters, and drip sequences"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <HowToSchema
        name="How to Create UTM Links for Email Campaigns"
        description="Step-by-step guide to creating tracked URLs for email marketing"
        steps={howToSteps}
      />
      <SpeakableSchema headline="UTM Builder for Email" summary="Generate tracking URLs optimized for email campaigns, newsletters, and drip sequences" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            back to tools
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground">UTM Builder for Email</h1>
                  <p className="text-muted-foreground">generate tracking URLs for email campaigns</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50 speakable-content">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Email remains one of the highest-ROI marketing channels. Proper UTM tracking helps you understand which emails, CTAs, and subscriber segments drive actual conversions—not just opens and clicks.
              </p>
              
              <UTMBuilderBasic />
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Email UTM best practices</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_source:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">email</code> or your ESP name: <code className="text-sm bg-muted px-2 py-1 rounded">mailchimp</code>, <code className="text-sm bg-muted px-2 py-1 rounded">hubspot</code>, <code className="text-sm bg-muted px-2 py-1 rounded">klaviyo</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_medium:</strong> Always use <code className="text-sm bg-muted px-2 py-1 rounded">email</code> (use <code className="text-sm bg-muted px-2 py-1 rounded">transactional</code> for receipts)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_campaign:</strong> Use descriptive names: <code className="text-sm bg-muted px-2 py-1 rounded">welcome-series-day1</code>, <code className="text-sm bg-muted px-2 py-1 rounded">q1-promo</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_content:</strong> Identify link position: <code className="text-sm bg-muted px-2 py-1 rounded">hero-cta</code>, <code className="text-sm bg-muted px-2 py-1 rounded">inline-link</code>, <code className="text-sm bg-muted px-2 py-1 rounded">footer-button</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_term:</strong> Use for segments: <code className="text-sm bg-muted px-2 py-1 rounded">new-subscribers</code>, <code className="text-sm bg-muted px-2 py-1 rounded">engaged-30d</code>, <code className="text-sm bg-muted px-2 py-1 rounded">churned</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">Email campaign naming examples</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><code className="bg-muted px-2 py-1 rounded">welcome-series-day1</code> - First email in welcome sequence</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><code className="bg-muted px-2 py-1 rounded">newsletter-2025-01-15</code> - Weekly newsletter by date</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><code className="bg-muted px-2 py-1 rounded">product-launch-teaser</code> - Campaign-specific emails</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><code className="bg-muted px-2 py-1 rounded">abandoned-cart-reminder</code> - Automated sequences</span>
                </div>
              </div>
            </div>

            <CTABanner
              title="prove email drives real revenue"
              description="utm.one connects email clicks to actual conversions, showing which emails generate ROI."
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

export default UTMBuilderEmail;
