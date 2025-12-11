import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CTABanner } from "@/components/resources/CTABanner";
import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin } from "lucide-react";

const UTMBuilderLinkedIn = () => {
  const breadcrumbs = [
    { label: "tools", href: "/tools" },
    { label: "utm builder for linkedin", href: "" }
  ];

  const faqs = [
    {
      question: "What UTM parameters should I use for LinkedIn?",
      answer: "For LinkedIn campaigns, use utm_source=linkedin, utm_medium=social (organic) or utm_medium=paid (ads), utm_campaign=[campaign-name], utm_content=[post-type or ad-variant], and utm_term=[targeting-criteria]."
    },
    {
      question: "How do I track LinkedIn organic vs paid?",
      answer: "Use utm_medium=social for organic posts and utm_medium=paid or utm_medium=cpc for LinkedIn Ads. This allows you to segment organic reach from paid campaigns in your analytics."
    },
    {
      question: "What's the best utm_content for LinkedIn?",
      answer: "Use utm_content to identify post type: carousel, video, image, article, or text. For ads, use variant names like ad-v1, ad-v2 to track A/B tests."
    },
    {
      question: "Should I use utm_term for LinkedIn?",
      answer: "Yes, use utm_term for targeting details like job-title-cmo, industry-tech, or company-size-500plus. This helps identify which audience segments convert best."
    },
    {
      question: "How do I shorten LinkedIn UTM links?",
      answer: "Use utm.one to create branded short links with UTM tracking. Long UTM URLs look unprofessional in LinkedIn posts—short links maintain trust while preserving tracking."
    }
  ];

  const howToSteps = [
    { name: "Enter your LinkedIn destination URL", text: "Paste the landing page URL where LinkedIn traffic should go" },
    { name: "Set utm_source to linkedin", text: "This identifies LinkedIn as the traffic source in analytics" },
    { name: "Choose utm_medium", text: "Use 'social' for organic posts or 'paid' for LinkedIn Ads" },
    { name: "Name your campaign", text: "Use descriptive names like 'q1-product-launch' or 'webinar-promo'" },
    { name: "Add utm_content", text: "Specify post type: carousel, video, image, or ad variant" },
    { name: "Copy and use", text: "Copy the generated URL and use in your LinkedIn post or ad" }
  ];

  return (
    <>
      <SEO
        title="UTM Builder for LinkedIn - Track LinkedIn Campaign Performance | utm.one"
        description="Free UTM builder optimized for LinkedIn. Generate tracking URLs for LinkedIn organic posts and ads. Best practices for utm_source, utm_medium, utm_content for LinkedIn."
        canonical="https://utm.one/tools/utm-builder-linkedin"
        ogType="article"
        keywords={["utm builder linkedin", "linkedin tracking", "linkedin utm parameters", "linkedin campaign tracking", "linkedin analytics"]}
      />
      <ArticleSchema
        headline="UTM Builder for LinkedIn"
        description="Generate tracking URLs optimized for LinkedIn organic posts and paid campaigns"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <HowToSchema
        name="How to Create UTM Links for LinkedIn"
        description="Step-by-step guide to creating tracked URLs for LinkedIn campaigns"
        steps={howToSteps}
      />
      <SpeakableSchema headline="UTM Builder for LinkedIn" summary="Generate tracking URLs optimized for LinkedIn organic posts and paid campaigns" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            back to tools
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground">UTM Builder for LinkedIn</h1>
                  <p className="text-muted-foreground">generate tracking URLs optimized for LinkedIn campaigns</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50 speakable-content">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                LinkedIn is one of the most valuable B2B traffic sources. Proper UTM tracking helps you understand which LinkedIn content—organic posts, carousels, videos, or paid ads—drives actual business results.
              </p>
              
              <UTMBuilderBasic />
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border/50">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">LinkedIn UTM best practices</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_source:</strong> Always use <code className="text-sm bg-muted px-2 py-1 rounded">linkedin</code> (lowercase, no variations)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_medium:</strong> Use <code className="text-sm bg-muted px-2 py-1 rounded">social</code> for organic, <code className="text-sm bg-muted px-2 py-1 rounded">paid</code> or <code className="text-sm bg-muted px-2 py-1 rounded">cpc</code> for ads
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_content:</strong> Differentiate post types: <code className="text-sm bg-muted px-2 py-1 rounded">carousel</code>, <code className="text-sm bg-muted px-2 py-1 rounded">video</code>, <code className="text-sm bg-muted px-2 py-1 rounded">image</code>, <code className="text-sm bg-muted px-2 py-1 rounded">text</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div>
                    <strong className="text-foreground">utm_term:</strong> Use for targeting: <code className="text-sm bg-muted px-2 py-1 rounded">job-title-cmo</code>, <code className="text-sm bg-muted px-2 py-1 rounded">industry-saas</code>
                  </div>
                </div>
              </div>
            </div>

            <CTABanner
              title="track all your LinkedIn campaigns in one place"
              description="utm.one auto-applies LinkedIn best practices and shows which posts drive revenue."
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

export default UTMBuilderLinkedIn;
