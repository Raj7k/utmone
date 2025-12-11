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
import { UTMDebugger } from "@/components/resources/utm/UTMDebugger";
import { GovernanceMaturityAssessment } from "@/components/resources/utm/GovernanceMaturityAssessment";
import { RoadmapTimeline } from "@/components/resources/utm/RoadmapTimeline";
import { DataFragmentationCalculator } from "@/components/resources/utm/DataFragmentationCalculator";
import { MultiTouchAttributionSimulator } from "@/components/resources/utm/MultiTouchAttributionSimulator";
import { CaseStudyExplorer } from "@/components/resources/utm/CaseStudyExplorer";
import { TeamRACIMatrix } from "@/components/resources/utm/TeamRACIMatrix";
import { Link } from "react-router-dom";

const UTMGuide = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Guides", href: "/resources/guides" },
    { label: "UTM Tracking Guide", href: "/resources/guides/utm-guide" }
  ];

  const relatedResources = [
    { title: "LLM-First SEO Guide", href: "/resources/guides/llm-seo", description: "Optimize UTM-tracked pages for AI discovery" },
    { title: "LLM Ranking Playbook", href: "/resources/playbooks/llm-ranking", description: "90-day roadmap to rank in ChatGPT and Claude" },
    { title: "UTM Template", href: "/resources/templates", description: "Copy/paste UTM templates for common campaigns" },
    { title: "Clean-Track Framework", href: "/resources/frameworks", description: "4-layer architecture for tracking at scale" },
    { title: "Partner Program", href: "/features/partner-program", description: "Track affiliate UTMs and referral campaigns" },
    { title: "Analytics Dashboard", href: "/features/analytics", description: "Visualize UTM campaign performance" }
  ];

  return (
    <>
      <SEO
        title="The UTM Guide (2025 Edition) - Complete UTM Tracking & Governance | utm.one"
        description="The definitive guide to UTM tracking, naming conventions, and governance. 11 interactive tools, real-world case studies, and multi-touch attribution strategies."
        canonical="https://utm.one/resources/guides/utm-guide"
        ogType="article"
        publishedTime="2025-01-01"
        modifiedTime="2025-01-23"
        keywords={["utm parameters", "utm tracking", "utm guide", "campaign tracking", "utm naming conventions", "utm governance"]}
      />
      <ArticleSchema
        headline="The UTM Guide (2025 Edition)"
        description="The definitive guide to UTM tracking, naming conventions, and governance with 11 interactive tools"
        author="utm.one"
        datePublished="2025-01-01"
        dateModified="2025-01-23"
      />
      <HowToSchema
        name="How to Implement UTM Tracking and Governance"
        description="Complete implementation guide for UTM tracking governance across marketing teams"
        steps={[
          { name: "Define naming conventions", text: "Establish lowercase, hyphen-separated UTM standards across all campaigns" },
          { name: "Create templates", text: "Build pre-approved UTM templates for all campaign types" },
          { name: "Set up governance", text: "Establish workflows and approval processes for link creation" },
          { name: "Audit existing UTMs", text: "Identify and fix inconsistent UTM values in existing campaigns" },
          { name: "Train your team", text: "Document standards and onboard team members on UTM best practices" }
        ]}
      />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: `https://utm.one${b.href}` }))} />
      
      <GuideLayout
        title="The UTM Guide (2025 Edition)"
        subtitle="The definitive guide to UTM tracking, naming conventions, and governance. Built for marketers who want clean data and reliable campaign attribution."
        readTime="45 min read"
        lastUpdated="January 2025"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
        backLink="/resources/guides"
        backLabel="Back to Guides"
      >
      <TableOfContents />
      
      <QuickAnswer>
        UTM parameters are query strings appended to URLs to track where website traffic comes from. The 5 parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content) identify traffic origins and campaign performance in analytics tools. Proper UTM governance ensures consistent tracking, reliable attribution, and accurate campaign reporting across all marketing channels.
      </QuickAnswer>

      {/* Section 1: Why This Guide Exists */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 id="why-this-guide-exists" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">
            Why This Guide Exists
          </h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed">
            <p>Marketing breaks when links break. And links break when UTMs are inconsistent, incomplete, or forgotten entirely.</p>
            <p>You've seen it happen: campaigns launch with mismatched UTM values. Some links use "linkedin", others use "LinkedIn". Some use underscores, others use hyphens. By the time you open Google Analytics, your data is fragmented across dozens of inconsistent sources.</p>
            <p>This isn't a tracking problem. It's a governance problem. And it compounds over time.</p>
            <p>This guide explains how to build a UTM system that scales—one that works for small teams launching their first campaign, and for enterprises running hundreds of campaigns across dozens of channels. <a href="/resources/guides/llm-seo" className="text-primary hover:underline">Learn how to optimize your UTM-tracked content for discovery by AI systems</a> to ensure your campaigns are visible not just in analytics, but in AI-powered search.</p>
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
        <section className="mb-12">
          <h2 id="what-are-utms" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">What Are UTM Parameters?</h2>
          
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
        <section className="mb-12">
          <h2 id="utm-parameters" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">The 5 UTM Parameters</h2>
          
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
        <section className="mb-12">
          <h2 id="naming-conventions" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">UTM Naming Conventions That Scale</h2>
          
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
        <section className="mb-12">
          <h2 id="utm-templates" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">UTM Template Builder</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Templates ensure consistency across your team. Instead of manually building UTMs for each campaign, use pre-approved templates that automatically enforce your naming conventions.</p>
          </div>

          <UTMTemplateBuilder />
        </section>
      </ProgressiveReveal>

      {/* Section 6: Multi-Touch Attribution */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 id="attribution" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">Multi-Touch Attribution with UTMs</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>UTM parameters enable multi-touch attribution by tracking every customer touchpoint. Understanding how different attribution models assign credit helps you optimize campaign budgets and channel mix.</p>
          </div>

          <MultiTouchAttributionSimulator />
          
          <div className="mt-8">
            <CaseStudyExplorer />
          </div>
        </section>
      </ProgressiveReveal>

      {/* Section 7: Governance + Assessment */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 id="governance" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">UTM Governance Framework</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Governance isn't bureaucracy—it's the system that prevents data chaos. A good governance framework defines who creates links, how they're approved, and what happens when mistakes occur.</p>
          </div>

          <GovernanceMaturityAssessment />
          
          <div className="mt-8">
            <TeamRACIMatrix />
          </div>
        </section>
      </ProgressiveReveal>

      {/* Section 8: Troubleshooting + Debugger */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 id="troubleshooting" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">UTM Troubleshooting & Debugging</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Even with perfect governance, mistakes happen. The UTM Debugger identifies issues and provides corrected versions automatically.</p>
            <p>Once your UTMs are clean and consistent, make sure your landing pages are discoverable by AI systems. See our <Link to="/resources/guides/llm-seo" className="text-primary hover:underline">LLM-First SEO Guide</Link> or follow our <Link to="/resources/playbooks/llm-ranking" className="text-primary hover:underline">90-day LLM Ranking Playbook</Link> for complete implementation guidance.</p>
          </div>

          <UTMDebugger />
        </section>
      </ProgressiveReveal>

      {/* Section 9: Implementation Roadmap */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 id="roadmap" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">90-Day Implementation Roadmap</h2>
          
          <div className="space-y-4 text-lg text-foreground leading-relaxed mb-8">
            <p>Implementing UTM governance takes time. This 90-day roadmap breaks the work into manageable phases with specific tasks and milestones.</p>
            <p>Phase 2 includes optimizing your campaign landing pages for discoverability. Use our <a href="/resources/guides/llm-seo#schema-generator" className="text-primary hover:underline">Schema Generator</a> and <a href="/resources/guides/llm-seo#readiness-scorer" className="text-primary hover:underline">LLM Readiness Scorer</a> to make your content AI-discoverable.</p>
          </div>

          <RoadmapTimeline />
        </section>
      </ProgressiveReveal>

      <CTABanner
        title="Ready to Implement Clean UTM Tracking?"
        description="utm.one provides all the tools you need for UTM governance at scale"
        buttonText="Get Early Access"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* FAQ Section */}
      <ProgressiveReveal>
        <section className="mb-12">
          <h2 id="faq" className="text-3xl font-display font-bold text-foreground mb-6 scroll-mt-24">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            { question: "What are UTM parameters?", answer: <p>UTM parameters are tags added to URLs to track where website traffic comes from. They were created by Urchin (later acquired by Google) and are now the standard way to measure campaign performance in Google Analytics and other analytics tools.</p> },
            { question: "Why do my UTMs keep breaking?", answer: <p>UTMs break because of inconsistent naming conventions across teams. When one person uses "linkedin" and another uses "LinkedIn" or "li", your analytics tools treat them as different sources, fragmenting your data.</p> },
            { question: "Do I need all 5 UTM parameters?", answer: <p>Only utm_source, utm_medium, and utm_campaign are required. However, using all 5 parameters gives you much more granular insights into campaign performance.</p> },
            { question: "Should UTMs be lowercase or mixed case?", answer: <p>Always use lowercase. Google Analytics treats "LinkedIn" and "linkedin" as different sources, which fragments your data. Standardizing on lowercase prevents this issue.</p> },
            { question: "How do UTMs affect SEO?", answer: <p>UTM parameters don't directly hurt SEO, but they can cause duplicate content issues if not handled properly. Use canonical tags to tell search engines which version of a page is the original.</p> },
            { question: "Can I change UTM values after launching a campaign?", answer: <p>You can, but it will split your reporting. Analytics tools treat the old and new UTM values as separate campaigns, making it harder to see total performance.</p> },
            { question: "How long should my UTM values be?", answer: <p>Keep UTM values concise but descriptive. Aim for 3-20 characters per parameter. "q1-product-launch" is better than "q1-2025-new-product-launch-campaign-january". Shorter values are easier to read in reports and less prone to truncation.</p> },
            { question: "Can I use UTMs for internal links?", answer: <p>Technically yes, but it's not recommended. UTMs are designed for external campaign tracking. Using them on internal links can inflate your analytics data and misattribute conversions. Use event tracking or custom dimensions for internal navigation instead.</p> },
            { question: "What's the difference between utm_term and utm_content?", answer: <p>utm_term identifies paid search keywords (originally for Google Ads). utm_content differentiates similar content or links in the same ad (e.g., "cta-top" vs "cta-bottom"). In practice, utm_content is more versatile and used for A/B testing ad variants.</p> },
            { question: "How do I track offline campaigns with UTMs?", answer: <p>Use QR codes or vanity URLs with pre-populated UTMs. For example, a billboard QR code links to utm.one/go/billboard-campaign with utm_source=billboard, utm_medium=offline, utm_campaign=q1-awareness. Track QR scans to measure offline campaign performance.</p> }
          ]} />
        </section>
      </ProgressiveReveal>
      </GuideLayout>
    </>
  );
};

export default UTMGuide;
