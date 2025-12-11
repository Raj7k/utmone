import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CTABanner } from "@/components/resources/CTABanner";
import { Link } from "react-router-dom";
import { ArrowLeft, Facebook } from "lucide-react";

const UTMBuilderFacebook = () => {
  const breadcrumbs = [
    { label: "tools", href: "/tools" },
    { label: "utm builder for facebook", href: "" }
  ];

  const faqs = [
    {
      question: "What UTM parameters should I use for Facebook?",
      answer: "Use utm_source=facebook, utm_medium=social (organic) or utm_medium=paid (Meta Ads), utm_campaign=[campaign-name], utm_content=[ad-set or post-type], and utm_term=[audience-targeting]."
    },
    {
      question: "How do I track Facebook organic vs Meta Ads?",
      answer: "Use utm_medium=social for organic posts and utm_medium=paid or utm_medium=cpc for Meta Ads. This separates organic engagement from paid campaigns in your analytics."
    },
    {
      question: "Should I use Facebook's auto-tagging or manual UTMs?",
      answer: "Use both. Facebook's auto-tagging (fbclid) works with Facebook Analytics, but manual UTMs give you control in Google Analytics and other tools. utm.one tracks both automatically."
    },
    {
      question: "What's the best utm_content for Facebook Ads?",
      answer: "Use utm_content to identify ad creative: video-testimonial, carousel-features, image-promo. For ad sets, use ad-set-name to track audience performance."
    },
    {
      question: "How do I track Facebook Messenger campaigns?",
      answer: "Use utm_source=facebook and utm_medium=messenger for Messenger bot links. This distinguishes Messenger traffic from feed posts and ads."
    }
  ];

  const howToSteps = [
    { name: "Enter your Facebook destination URL", text: "Paste the landing page URL for your Facebook traffic" },
    { name: "Set utm_source to facebook", text: "This identifies Facebook as the traffic source" },
    { name: "Choose utm_medium", text: "Use 'social' for organic or 'paid' for Meta Ads" },
    { name: "Name your campaign", text: "Match your Meta Ads campaign name for consistency" },
    { name: "Add utm_content", text: "Identify ad creative or post type for performance analysis" },
    { name: "Copy and deploy", text: "Use the URL in your Facebook post or Meta Ads Manager" }
  ];

  return (
    <>
      <SEO
        title="UTM Builder for Facebook - Track Meta Ads & Organic Posts | utm.one"
        description="Free UTM builder for Facebook and Meta Ads. Generate tracking URLs for Facebook organic posts, Meta Ads, and Messenger campaigns. Best UTM practices for Facebook."
        canonical="https://utm.one/tools/utm-builder-facebook"
        ogType="article"
        keywords={["utm builder facebook", "facebook tracking", "meta ads utm", "facebook utm parameters", "facebook campaign tracking"]}
      />
      <ArticleSchema
        headline="UTM Builder for Facebook"
        description="Generate tracking URLs optimized for Facebook organic posts and Meta Ads campaigns"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <HowToSchema
        name="How to Create UTM Links for Facebook"
        description="Step-by-step guide to creating tracked URLs for Facebook campaigns"
        steps={howToSteps}
      />
      <SpeakableSchema headline="UTM Builder for Facebook" summary="Generate tracking URLs optimized for Facebook organic posts and Meta Ads campaigns" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            back to tools
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground">UTM Builder for Facebook</h1>
                  <p className="text-muted-foreground">generate tracking URLs for Facebook & Meta Ads</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50 speakable-content">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Facebook and Meta Ads remain one of the largest paid traffic sources. Proper UTM tracking helps you understand which campaigns, ad sets, and creatives actually drive conversions—not just clicks.
              </p>
              
              <UTMBuilderBasic />
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Facebook UTM best practices</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_source:</strong> Always use <code className="text-sm bg-muted px-2 py-1 rounded">facebook</code> (not "fb" or "meta")
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_medium:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">social</code> for organic, <code className="text-sm bg-muted px-2 py-1 rounded">paid</code> for Meta Ads
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_campaign:</strong> Match your Meta Ads campaign name exactly
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_content:</strong> Use for ad creative: <code className="text-sm bg-muted px-2 py-1 rounded">video-v1</code>, <code className="text-sm bg-muted px-2 py-1 rounded">carousel-features</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_term:</strong> Use for audience: <code className="text-sm bg-muted px-2 py-1 rounded">lookalike-purchasers</code>, <code className="text-sm bg-muted px-2 py-1 rounded">interest-marketing</code>
                  </div>
                </div>
              </div>
            </div>

            <CTABanner
              title="track Facebook ROI, not just clicks"
              description="utm.one connects Facebook clicks to actual revenue so you know which ads are profitable."
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

export default UTMBuilderFacebook;
