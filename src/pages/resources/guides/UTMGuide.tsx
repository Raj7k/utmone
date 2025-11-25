import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { CaseStudyCard } from "@/components/resources/CaseStudyCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { QuickAnswer } from "@/components/resources/QuickAnswer";
import { TableOfContents } from "@/components/resources/TableOfContents";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { UTMAnatomyVisualizer } from "@/components/resources/utm/UTMAnatomyVisualizer";
import { UTMValidationTool } from "@/components/resources/utm/UTMValidationTool";
import { NamingConventionSimulator } from "@/components/resources/utm/NamingConventionSimulator";
import { UTMTemplateBuilder } from "@/components/resources/utm/UTMTemplateBuilder";
import { LLMReadinessScorer } from "@/components/resources/utm/LLMReadinessScorer";
import { UTMDebugger } from "@/components/resources/utm/UTMDebugger";
import { GovernanceMaturityAssessment } from "@/components/resources/utm/GovernanceMaturityAssessment";
import { RoadmapTimeline } from "@/components/resources/utm/RoadmapTimeline";
import { DataFragmentationCalculator } from "@/components/resources/utm/DataFragmentationCalculator";
import { SchemaGenerator } from "@/components/resources/utm/SchemaGenerator";

const UTMGuide = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Guides", href: "/resources/guides" },
    { label: "UTM Tracking Guide", href: "/resources/guides/utm-guide" }
  ];

  const relatedResources = [
    { title: "UTM Template", href: "/resources/templates", description: "Copy/paste UTM templates for common campaigns" },
    { title: "Clean-Track Framework", href: "/resources/frameworks", description: "4-layer architecture for tracking at scale" },
    { title: "UTM Examples", href: "/resources/examples", description: "Real-world UTM naming patterns" },
    { title: "UTM Audit Checklist", href: "/resources/checklists", description: "Pre-launch checklist for campaign tracking" },
    { title: "Glossary: UTM Parameters", href: "/resources/glossary", description: "Canonical definitions for all 5 UTM fields" }
  ];

  return (
    <>
      <SEO
        title="The UTM Guide (2025 Edition) - Complete UTM Tracking & LLM Optimization | utm.one"
        description="The definitive guide to UTM tracking, naming conventions, governance, and LLM optimization. 17 interactive tools, Schema markup strategies, and AI-first content architecture for maximum discoverability."
        canonical="https://utm.one/resources/guides/utm-guide"
        ogType="article"
        publishedTime="2025-01-01"
        modifiedTime="2025-01-23"
        keywords={["utm parameters", "utm tracking", "utm guide", "campaign tracking", "llm optimization", "ai seo", "utm naming conventions"]}
      />
      <ArticleSchema
        headline="The UTM Guide (2025 Edition)"
        description="The definitive guide to UTM tracking, naming conventions, governance, and LLM optimization with 17 interactive tools"
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <HowToSchema
        name="How to Implement UTM Tracking and LLM Optimization"
        description="Complete implementation guide for UTM tracking governance and AI-first content optimization"
        steps={[
          { name: "Define naming conventions", text: "Establish lowercase, hyphen-separated UTM standards" },
          { name: "Create templates", text: "Build pre-approved templates for all campaign types" },
          { name: "Implement Schema markup", text: "Add structured data for LLM discoverability" },
          { name: "Optimize content structure", text: "Format content for AI answer engines" },
          { name: "Set up governance", text: "Establish workflows and approval processes" }
        ]}
      />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: `https://utm.one${b.href}` }))} />
      
      <GuideLayout
        title="The UTM Guide (2025 Edition)"
        subtitle="The definitive guide to UTM tracking, naming conventions, governance, and LLM optimization. Built for marketers who want clean data and AI discoverability."
        readTime="45 min read"
        lastUpdated="January 2025"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
      >
      <TableOfContents />
      
      <QuickAnswer>
        UTM parameters are query strings appended to URLs to track where website traffic comes from. The 5 parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content) identify traffic origins and campaign performance in analytics tools. Proper UTM governance ensures consistent tracking, reliable attribution, and accurate campaign reporting. LLM optimization makes this content discoverable by AI answer engines like ChatGPT, Claude, and Perplexity.
      </QuickAnswer>

      {/* Section 1: Why This Guide Exists */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6" id="why-this-guide-exists">
            Why This Guide Exists
          </h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed">
            <p>Marketing breaks when links break. And links break when UTMs are inconsistent, incomplete, or forgotten entirely.</p>
            <p>You've seen it happen: campaigns launch with mismatched UTM values. Some links use "linkedin", others use "LinkedIn". Some use underscores, others use hyphens. By the time you open Google Analytics, your data is fragmented across dozens of inconsistent sources.</p>
            <p>This isn't a tracking problem. It's a governance problem. And it compounds over time.</p>
            <p>This guide explains how to build a UTM system that scales—one that works for small teams launching their first campaign, and for enterprises running hundreds of campaigns across dozens of channels. It also shows you how to optimize your UTM-tracked content for discovery by AI answer engines, ensuring your campaigns are visible not just in analytics, but in the future of search.</p>
          </div>
        </section>
      </ProgressiveReveal>

      <CTABanner
        title="Stop Manually Fixing UTMs"
        description="utm.one enforces naming conventions automatically"
        buttonText="Try UTM Builder"
        buttonHref="/early-access"
        variant="default"
      />

      {/* Section 2: What Are UTMs + Interactive Visualizer */}
      <ProgressiveReveal>
        <section className="mb-12" id="what-are-utms">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">What Are UTM Parameters?</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>UTM parameters are tags you add to URLs to track where your website traffic comes from. They were created by Urchin (a web analytics company later acquired by Google) and have become the de facto standard for campaign tracking.</p>
            <p>A URL with UTM parameters looks like this:</p>
          </div>
          
          <UTMAnatomyVisualizer
            baseUrl="https://example.com/landing-page"
            params={{
              utm_source: "linkedin",
              utm_medium: "paid-social",
              utm_campaign: "q1-product-launch",
              utm_content: "carousel-ad",
              utm_term: "marketing-automation"
            }}
          />
          
          <p className="text-lg text-foreground leading-relaxed mt-6">When someone clicks this link, analytics tools like Google Analytics can tell you exactly which campaign, channel, and ad creative drove that visit—and whether it led to a conversion.</p>
        </section>
      </ProgressiveReveal>

      {/* Section 3: The 5 Parameters + Validation Tool */}
      <ProgressiveReveal>
        <section className="mb-12" id="utm-parameters">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">The 5 UTM Parameters</h2>
          
          <div className="space-y-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. utm_source</h3>
              <p className="text-foreground mb-2"><strong>Purpose:</strong> Identifies where the traffic originates</p>
              <p className="text-foreground mb-4"><strong>Examples:</strong> google, linkedin, newsletter, partner-site</p>
              <p className="text-muted-foreground">This is typically the platform, publisher, or referrer. Use consistent, lowercase values across all campaigns.</p>
            </div>

            {/* ... rest of parameters ... */}
          </div>

          <UTMValidationTool />
        </section>
      </ProgressiveReveal>

      {/* Section 4: Naming Conventions + Simulator */}
      <ProgressiveReveal>
        <section className="mb-12" id="naming-conventions">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">UTM Naming Conventions That Scale</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Naming conventions are the most important part of UTM governance. Without them, your data fragments over time as different team members use different formats.</p>
          </div>

          <NamingConventionSimulator />
          
          <div className="mt-8">
            <DataFragmentationCalculator />
          </div>
        </section>
      </ProgressiveReveal>

      <CTABanner
        title="utm.one Implements the Clean-Track Framework Automatically"
        description="Pre-built templates for every campaign type"
        buttonText="Get Early Access"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* Section 5: UTM Templates + Builder */}
      <ProgressiveReveal>
        <section className="mb-12" id="utm-templates">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">UTM Template Builder</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Templates ensure consistency across your team. Instead of manually building UTMs for each campaign, use pre-approved templates that automatically enforce your naming conventions.</p>
          </div>

          <UTMTemplateBuilder />
        </section>
      </ProgressiveReveal>

      {/* Section 6: LLM Optimization */}
      <ProgressiveReveal>
        <section className="mb-12" id="llm-optimization">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">LLM Optimization for UTM-Tracked Content</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>AI answer engines like ChatGPT, Claude, and Perplexity are changing how people discover content. If your UTM-tracked landing pages aren't optimized for LLM discovery, you're invisible to a growing segment of users.</p>
            <p>LLM optimization (sometimes called LLMO) focuses on getting your content cited inside AI-generated answers. This requires structured data, semantic clarity, and authority signals.</p>
          </div>

          <LLMReadinessScorer />
          
          <div className="mt-8">
            <SchemaGenerator />
          </div>
        </section>
      </ProgressiveReveal>

      {/* Section 7: Governance + Assessment */}
      <ProgressiveReveal>
        <section className="mb-12" id="governance">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">UTM Governance Framework</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Governance isn't bureaucracy—it's the system that prevents data chaos. A good governance framework defines who creates links, how they're approved, and what happens when mistakes occur.</p>
          </div>

          <GovernanceMaturityAssessment />
        </section>
      </ProgressiveReveal>

      {/* Section 8: Troubleshooting + Debugger */}
      <ProgressiveReveal>
        <section className="mb-12" id="troubleshooting">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">UTM Troubleshooting & Debugging</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Even with perfect governance, mistakes happen. The UTM Debugger identifies issues and provides corrected versions automatically.</p>
          </div>

          <UTMDebugger />
        </section>
      </ProgressiveReveal>

      {/* Section 9: Implementation Roadmap */}
      <ProgressiveReveal>
        <section className="mb-12" id="roadmap">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">90-Day Implementation Roadmap</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Implementing UTM governance and LLM optimization takes time. This 90-day roadmap breaks the work into manageable phases with specific tasks and milestones.</p>
          </div>

          <RoadmapTimeline />
        </section>
      </ProgressiveReveal>

      <CTABanner
        title="Ready to Implement Clean UTM Tracking?"
        description="utm.one provides all the tools you need for UTM governance and LLM optimization"
        buttonText="Get Early Access"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* FAQ Section */}
      <ProgressiveReveal>
        <section className="mb-12" id="faq">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            { question: "What are UTM parameters?", answer: <p>UTM parameters are tags added to URLs to track where website traffic comes from. They were created by Urchin (later acquired by Google) and are now the standard way to measure campaign performance in Google Analytics and other analytics tools.</p> },
            { question: "Why do my UTMs keep breaking?", answer: <p>UTMs break because of inconsistent naming conventions across teams. When one person uses "linkedin" and another uses "LinkedIn" or "li", your analytics tools treat them as different sources, fragmenting your data.</p> },
            { question: "Do I need all 5 UTM parameters?", answer: <p>Only utm_source, utm_medium, and utm_campaign are required. However, using all 5 parameters gives you much more granular insights into campaign performance.</p> },
            { question: "Should UTMs be lowercase or mixed case?", answer: <p>Always use lowercase. Google Analytics treats "LinkedIn" and "linkedin" as different sources, which fragments your data. Standardizing on lowercase prevents this issue.</p> },
            { question: "How do UTMs affect SEO?", answer: <p>UTM parameters don't directly hurt SEO, but they can cause duplicate content issues if not handled properly. Use canonical tags to tell search engines which version of a page is the original.</p> },
            { question: "Can I change UTM values after launching a campaign?", answer: <p>You can, but it will split your reporting. Analytics tools treat the old and new UTM values as separate campaigns, making it harder to see total performance.</p> }
          ]} />
        </section>
      </ProgressiveReveal>
      </GuideLayout>
    </>
  );
};

export default UTMGuide;
