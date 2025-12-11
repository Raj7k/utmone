import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CTABanner } from "@/components/resources/CTABanner";
import { Link } from "react-router-dom";
import { ArrowLeft, Music2 } from "lucide-react";

const UTMBuilderTikTok = () => {
  const breadcrumbs = [
    { label: "tools", href: "/tools" },
    { label: "utm builder for tiktok", href: "" }
  ];

  const faqs = [
    {
      question: "What UTM parameters should I use for TikTok?",
      answer: "Use utm_source=tiktok, utm_medium=social (organic) or utm_medium=paid (TikTok Ads), utm_campaign=[campaign-name], utm_content=[video-type or ad-creative], and utm_term=[audience-targeting]."
    },
    {
      question: "How do I track TikTok organic vs TikTok Ads?",
      answer: "Use utm_medium=social for organic content (bio link, video descriptions) and utm_medium=paid for TikTok Ads. This separates organic virality from paid reach."
    },
    {
      question: "Can I use UTMs in TikTok video descriptions?",
      answer: "TikTok video descriptions don't support clickable links for most users. Use your bio link with UTM tracking, or use TikTok's link sticker feature for business accounts."
    },
    {
      question: "What's the best utm_content for TikTok?",
      answer: "Use utm_content to identify video type: duet, stitch, original, tutorial, trending-sound. For ads, use creative variants like video-v1, video-v2."
    },
    {
      question: "Should I track TikTok Shop separately?",
      answer: "Yes, use utm_medium=shop for TikTok Shop traffic to distinguish it from organic social and paid ads. This helps attribute sales correctly."
    }
  ];

  const howToSteps = [
    { name: "Enter your TikTok destination URL", text: "Paste the landing page URL for your TikTok traffic" },
    { name: "Set utm_source to tiktok", text: "This identifies TikTok as the traffic source" },
    { name: "Choose utm_medium", text: "Use 'social' for organic or 'paid' for TikTok Ads" },
    { name: "Name your campaign", text: "Use descriptive names like 'gen-z-launch' or 'trend-jacking-q1'" },
    { name: "Add utm_content", text: "Identify video type: original, duet, stitch, or ad creative" },
    { name: "Deploy in bio or ads", text: "Use in your bio link, link stickers, or TikTok Ads Manager" }
  ];

  return (
    <>
      <SEO
        title="UTM Builder for TikTok - Track TikTok Ads & Organic Content | utm.one"
        description="Free UTM builder for TikTok. Generate tracking URLs for TikTok organic content, TikTok Ads, and TikTok Shop. Best practices for TikTok campaign tracking."
        canonical="https://utm.one/tools/utm-builder-tiktok"
        ogType="article"
        keywords={["utm builder tiktok", "tiktok tracking", "tiktok ads utm", "tiktok analytics", "tiktok campaign tracking"]}
      />
      <ArticleSchema
        headline="UTM Builder for TikTok"
        description="Generate tracking URLs optimized for TikTok organic content, TikTok Ads, and TikTok Shop"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <HowToSchema
        name="How to Create UTM Links for TikTok"
        description="Step-by-step guide to creating tracked URLs for TikTok campaigns"
        steps={howToSteps}
      />
      <SpeakableSchema headline="UTM Builder for TikTok" summary="Generate tracking URLs optimized for TikTok organic content and TikTok Ads" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            back to tools
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground">UTM Builder for TikTok</h1>
                  <p className="text-muted-foreground">generate tracking URLs for TikTok content & ads</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50 speakable-content">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                TikTok's explosive growth makes it essential for reaching younger audiences. Proper UTM tracking helps you understand which content—organic videos, creator partnerships, or paid ads—actually drives business results.
              </p>
              
              <UTMBuilderBasic />
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">TikTok UTM best practices</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_source:</strong> Always use <code className="text-sm bg-muted px-2 py-1 rounded">tiktok</code> (lowercase)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_medium:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">social</code> for organic, <code className="text-sm bg-muted px-2 py-1 rounded">paid</code> for ads, <code className="text-sm bg-muted px-2 py-1 rounded">shop</code> for TikTok Shop
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_content:</strong> Identify video type: <code className="text-sm bg-muted px-2 py-1 rounded">original</code>, <code className="text-sm bg-muted px-2 py-1 rounded">duet</code>, <code className="text-sm bg-muted px-2 py-1 rounded">stitch</code>, <code className="text-sm bg-muted px-2 py-1 rounded">tutorial</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_term:</strong> Use for targeting: <code className="text-sm bg-muted px-2 py-1 rounded">gen-z</code>, <code className="text-sm bg-muted px-2 py-1 rounded">interest-fashion</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">Where to use TikTok UTM links</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><strong className="text-foreground">Bio link:</strong> Primary placement for organic traffic</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><strong className="text-foreground">Link stickers:</strong> Available for business accounts with 1K+ followers</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><strong className="text-foreground">TikTok Ads Manager:</strong> Add UTMs to your ad destination URLs</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span><strong className="text-foreground">TikTok Shop:</strong> Use in product links for sales tracking</span>
                </div>
              </div>
            </div>

            <CTABanner
              title="prove TikTok drives real business results"
              description="utm.one connects TikTok virality to actual conversions and revenue."
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

export default UTMBuilderTikTok;
