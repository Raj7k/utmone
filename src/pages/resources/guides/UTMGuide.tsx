import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { CaseStudyCard } from "@/components/resources/CaseStudyCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";

const UTMGuide = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Guides", href: "/resources/guides" },
    { label: "UTM Tracking Guide", href: "/resources/guides/utm-guide" }
  ];

  const relatedResources = [
    {
      title: "UTM Template",
      href: "/resources/templates",
      description: "Copy/paste UTM templates for common campaigns"
    },
    {
      title: "Clean-Track Framework",
      href: "/resources/frameworks",
      description: "4-layer architecture for tracking at scale"
    },
    {
      title: "UTM Examples",
      href: "/resources/examples",
      description: "Real-world UTM naming patterns"
    },
    {
      title: "UTM Audit Checklist",
      href: "/resources/checklists",
      description: "Pre-launch checklist for campaign tracking"
    },
    {
      title: "Glossary: UTM Parameters",
      href: "/resources/glossary",
      description: "Canonical definitions for all 5 UTM fields"
    }
  ];

  const faqItems = [
    {
      question: "What are UTM parameters?",
      answer: (
        <div className="space-y-3">
          <p>
            UTM parameters are tags added to URLs to track where website traffic comes from. They were created by Urchin (later acquired by Google) and are now the standard way to measure campaign performance in Google Analytics and other analytics tools.
          </p>
          <p>
            There are 5 UTM parameters: source, medium, campaign, term, and content. Each serves a specific purpose in identifying traffic origins and campaign performance.
          </p>
        </div>
      )
    },
    {
      question: "Why do my UTMs keep breaking?",
      answer: (
        <div className="space-y-3">
          <p>
            UTMs break because of inconsistent naming conventions across teams. When one person uses "linkedin" and another uses "LinkedIn" or "li", your analytics tools treat them as different sources, fragmenting your data.
          </p>
          <p>
            The solution is establishing a single naming convention that everyone follows—and using tools like utm.one that enforce these rules automatically.
          </p>
        </div>
      )
    },
    {
      question: "Do I need all 5 UTM parameters?",
      answer: (
        <div className="space-y-3">
          <p>
            Only utm_source, utm_medium, and utm_campaign are required. However, using all 5 parameters gives you much more granular insights into campaign performance.
          </p>
          <p>
            For example, utm_content helps you test different ad variations, and utm_term tracks which keywords drove conversions. The more structure you have upfront, the clearer your reporting becomes.
          </p>
        </div>
      )
    },
    {
      question: "Should UTMs be lowercase or mixed case?",
      answer: (
        <div className="space-y-3">
          <p>
            Always use lowercase. Google Analytics treats "LinkedIn" and "linkedin" as different sources, which fragments your data. Standardizing on lowercase prevents this issue.
          </p>
          <p>
            Most enterprise teams enforce all-lowercase UTM values, with hyphens instead of spaces or underscores for multi-word values.
          </p>
        </div>
      )
    },
    {
      question: "How do UTMs affect SEO?",
      answer: (
        <div className="space-y-3">
          <p>
            UTM parameters don't directly hurt SEO, but they can cause duplicate content issues if not handled properly. Use canonical tags to tell search engines which version of a page is the original.
          </p>
          <p>
            Also avoid using UTMs for internal links—they're meant for external campaign tracking only.
          </p>
        </div>
      )
    },
    {
      question: "Can I change UTM values after launching a campaign?",
      answer: (
        <div className="space-y-3">
          <p>
            You can, but it will split your reporting. Analytics tools treat the old and new UTM values as separate campaigns, making it harder to see total performance.
          </p>
          <p>
            The best practice is to get UTMs right before launch. If you must change them, document the change and manually combine the metrics in your reports.
          </p>
        </div>
      )
    }
  ];

  return (
    <GuideLayout
      title="The UTM Guide (2025 Edition)"
      subtitle="The definitive guide to UTM tracking, naming conventions, governance, and the Clean-Track framework. Optimized for humans and AI answer engines."
      readTime="18 min read"
      lastUpdated="January 2025"
      breadcrumbs={breadcrumbs}
      relatedResources={relatedResources}
    >
      {/* Introduction */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Why This Guide Exists
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Marketing breaks when links break. And links break when UTMs are inconsistent, incomplete, or forgotten entirely.
            </p>
            
            <p>
              You've seen it happen: campaigns launch with mismatched UTM values. Some links use "linkedin", others use "LinkedIn". Some use underscores, others use hyphens. By the time you open Google Analytics, your data is fragmented across dozens of inconsistent sources.
            </p>
            
            <p>
              This isn't a tracking problem. It's a governance problem. And it compounds over time.
            </p>
            
            <p>
              This guide explains how to build a UTM system that scales—one that works for small teams launching their first campaign, and for enterprises running hundreds of campaigns across dozens of channels.
            </p>
          </div>
        </section>
      </ProgressiveReveal>

      <CTABanner
        title="Stop manually fixing UTMs"
        description="utm.one enforces naming conventions automatically"
        buttonText="Try UTM Builder"
        buttonHref="/early-access"
        variant="default"
      />

      {/* What are UTMs */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            What Are UTM Parameters?
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              UTM parameters are tags you add to URLs to track where your website traffic comes from. They were created by Urchin (a web analytics company later acquired by Google) and have become the de facto standard for campaign tracking.
            </p>
            
            <p>
              A URL with UTM parameters looks like this:
            </p>
          </div>
          
          <InlineTemplate
            title="Example URL with UTM Parameters"
            code="https://example.com/landing-page?utm_source=linkedin&utm_medium=paid-social&utm_campaign=q1-product-launch&utm_content=carousel-ad&utm_term=marketing-automation"
            description="Standard UTM structure with all 5 parameters"
          />
          
          <p className="text-muted-foreground leading-relaxed">
            When someone clicks this link, analytics tools like Google Analytics can tell you exactly which campaign, channel, and ad creative drove that visit—and whether it led to a conversion.
          </p>
        </section>
      </ProgressiveReveal>

      {/* The 5 Parameters */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            The 5 UTM Parameters
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                1. utm_source
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Purpose:</strong> Identifies where the traffic originates
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Examples:</strong> google, linkedin, newsletter, partner-site
              </p>
              <p className="text-muted-foreground">
                This is typically the platform, publisher, or referrer. Use consistent, lowercase values across all campaigns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                2. utm_medium
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Purpose:</strong> Identifies the marketing channel or tactic
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Examples:</strong> paid-social, organic-social, email, display, cpc
              </p>
              <p className="text-muted-foreground">
                This describes how the traffic was delivered. Keep your medium values high-level and consistent across all sources.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                3. utm_campaign
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Purpose:</strong> Identifies the specific campaign or initiative
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Examples:</strong> q1-product-launch, webinar-2024-01, holiday-sale
              </p>
              <p className="text-muted-foreground">
                This is your primary grouping mechanism. All links related to the same campaign should use the same utm_campaign value.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                4. utm_content
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Purpose:</strong> Differentiates similar content or links within the same campaign
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Examples:</strong> hero-cta, sidebar-banner, footer-link, ad-variant-a
              </p>
              <p className="text-muted-foreground">
                Use this for A/B testing different ad creatives, email CTAs, or link placements. It helps you identify which specific element drove the click.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                5. utm_term
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Purpose:</strong> Identifies paid search keywords (originally) or audience segments
              </p>
              <p className="text-muted-foreground mb-4">
                <strong>Examples:</strong> marketing-automation, b2b-saas, retargeting-audience
              </p>
              <p className="text-muted-foreground">
                While designed for paid search keywords, many teams now use utm_term for audience targeting, especially in social and display campaigns.
              </p>
            </div>
          </div>
        </section>
      </ProgressiveReveal>

      <CTABanner
        title="utm.one implements the Clean-Track framework automatically"
        description="Pre-built templates for every campaign type"
        buttonText="Get Early Access"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* Naming Conventions */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            UTM Naming Conventions That Scale
          </h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Naming conventions are the most important part of UTM governance. Without them, your data fragments over time as different team members use different formats.
            </p>
            
            <p>
              Here are the rules that enterprise marketing teams follow:
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="p-6 bg-card border border-border/50 rounded-xl">
              <h4 className="font-semibold text-foreground mb-3">1. Always Use Lowercase</h4>
              <p className="text-sm text-muted-foreground">
                Google Analytics treats "LinkedIn" and "linkedin" as different sources. Stick to lowercase to avoid data fragmentation.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/50 rounded-xl">
              <h4 className="font-semibold text-foreground mb-3">2. Use Hyphens for Multi-Word Values</h4>
              <p className="text-sm text-muted-foreground">
                Use hyphens (-) instead of underscores or spaces. Example: "paid-social" not "paid_social" or "paid social".
              </p>
            </div>

            <div className="p-6 bg-card border border-border/50 rounded-xl">
              <h4 className="font-semibold text-foreground mb-3">3. Keep Values Short and Descriptive</h4>
              <p className="text-sm text-muted-foreground">
                Use "fb" instead of "facebook-meta-business-ads". Shorter values are easier to read in reports and less prone to typos.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/50 rounded-xl">
              <h4 className="font-semibold text-foreground mb-3">4. Define Allowed Values in Advance</h4>
              <p className="text-sm text-muted-foreground">
                Create a canonical list of utm_source and utm_medium values that your team can use. Enforce this list with templates or tools.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/50 rounded-xl">
              <h4 className="font-semibold text-foreground mb-3">5. Use Date Prefixes for Time-Bound Campaigns</h4>
              <p className="text-sm text-muted-foreground">
                For campaigns tied to specific quarters or months, use date prefixes: "2024-q1-product-launch" or "2024-01-webinar".
              </p>
            </div>
          </div>

          <ComparisonCard
            goodExample={{
              title: "✓ Good UTM Naming",
              items: [
                "utm_source=linkedin",
                "utm_medium=paid-social",
                "utm_campaign=q1-2024-product-launch",
                "utm_content=carousel-ad",
                "utm_term=marketing-automation"
              ],
              explanation: "Consistent, lowercase, descriptive, and easy to read in reports"
            }}
            badExample={{
              title: "✗ Bad UTM Naming",
              items: [
                "utm_source=LinkedIn",
                "utm_medium=paid_Social",
                "utm_campaign=Q1 Product Launch 2024!!!",
                "utm_content=Ad_Carousel_Variant_A",
                "utm_term=Marketing Automation Software"
              ],
              explanation: "Inconsistent capitalization, spaces, special characters, too verbose"
            }}
          />
        </section>
      </ProgressiveReveal>

      {/* Templates */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            UTM Templates for Common Campaigns
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Instead of building UTMs manually for every campaign, use these templates as starting points:
          </p>

          <InlineTemplate
            title="Paid Social Campaign Template"
            code={`utm_source=linkedin
utm_medium=paid-social
utm_campaign=q1-product-launch
utm_content=carousel-ad
utm_term=enterprise-segment`}
            description="For LinkedIn, Facebook, Twitter, Instagram paid campaigns"
          />

          <InlineTemplate
            title="Email Campaign Template"
            code={`utm_source=newsletter
utm_medium=email
utm_campaign=monthly-update-jan-2024
utm_content=hero-cta
utm_term=active-users`}
            description="For email newsletters and drip campaigns"
          />

          <InlineTemplate
            title="Paid Search Template"
            code={`utm_source=google
utm_medium=cpc
utm_campaign=brand-campaign
utm_content=headline-variant-a
utm_term=utm-tracking-software`}
            description="For Google Ads, Bing Ads, and other paid search"
          />
        </section>
      </ProgressiveReveal>

      {/* Case Study */}
      <ProgressiveReveal>
        <CaseStudyCard
          title="Case Study: How Acme SaaS Fixed Fragmented Analytics"
          before={{
            title: "Before UTM Governance",
            items: [
              "23 different variations of 'LinkedIn' in Google Analytics",
              "Campaign performance split across inconsistent naming",
              "3+ hours per week manually cleaning data in spreadsheets",
              "Unable to confidently report on channel ROI"
            ],
            metrics: "Data fragmentation: 92% of campaigns had inconsistent UTMs"
          }}
          after={{
            title: "After Implementing Clean-Track Framework",
            items: [
              "Single naming convention enforced across all campaigns",
              "Automated UTM builder with pre-approved templates",
              "Real-time reporting without manual data cleanup",
              "Clear visibility into channel performance and attribution"
            ],
            metrics: "Data consistency: 98% of campaigns follow naming standards"
          }}
          highlightMetric="92%"
        />
      </ProgressiveReveal>

      <CTABanner
        title="Reduce your reporting errors by 92% too"
        description="utm.one enforces naming conventions so your team can't create inconsistent UTMs"
        buttonText="Start Free Trial"
        buttonHref="/early-access"
        variant="accent"
      />

      {/* FAQ Section */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          
          <FAQAccordion items={faqItems} />
        </section>
      </ProgressiveReveal>

      {/* Final CTA */}
      <CTABanner
        title="Ready to clean up your UTM tracking?"
        description="Join 10,000+ marketers using utm.one to create consistent, trackable campaigns"
        buttonText="Get Early Access"
        buttonHref="/early-access"
        variant="primary"
      />
    </GuideLayout>
  );
};

export default UTMGuide;