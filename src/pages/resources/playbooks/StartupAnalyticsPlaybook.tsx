import { GuideLayout } from "@/components/resources/GuideLayout";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { TemplateDownload } from "@/components/resources/TemplateDownload";
import { TimeEstimate } from "@/components/resources/TimeEstimate";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";

export default function StartupAnalyticsPlaybook() {
  const steps = [
    { number: 1, title: "Core Metrics" },
    { number: 2, title: "Architecture" },
    { number: 3, title: "UTM Tagging" },
    { number: 4, title: "Tool Setup" },
    { number: 5, title: "Dashboards" },
    { number: 6, title: "Reporting" },
  ];

  const setupChecklist = [
    { id: "setup-1", text: "Create Google Analytics 4 property" },
    { id: "setup-2", text: "Install GA4 tracking code on all pages" },
    { id: "setup-3", text: "Set up conversion events (sign-up, purchase, demo request)" },
    { id: "setup-4", text: "Connect GA4 to Looker Studio for dashboards" },
    { id: "setup-5", text: "Configure data retention settings (14 months recommended)" },
    { id: "setup-6", text: "Set up weekly email reports for key metrics" },
  ];

  const utmChecklist = [
    { id: "utm-1", text: "Document standard utm_source values (google, facebook, linkedin, email)" },
    { id: "utm-2", text: "Define utm_medium taxonomy (cpc, social, email, organic, referral)" },
    { id: "utm-3", text: "Create campaign naming convention ([channel]-[product]-[month])" },
    { id: "utm-4", text: "Build UTM builder spreadsheet or tool" },
    { id: "utm-5", text: "Train team on UTM tagging process" },
  ];

  const faqItems = [
    {
      question: "Do I really need all this for an early-stage startup?",
      answer: "You need core metrics (traffic, conversions, revenue) and UTM tagging. Everything else can wait until you have product-market fit. Start simple and expand only when you have specific questions to answer."
    },
    {
      question: "Which analytics tool should I use?",
      answer: "Google Analytics 4 is free and covers 90% of startup needs. Add Mixpanel or Amplitude only if you need detailed product analytics (feature usage, user flows). Most startups over-invest in tools before they have enough traffic to analyze."
    },
    {
      question: "How do I know if my tracking is working?",
      answer: "Visit your site, click through your funnel, and check if events appear in GA4 real-time view within 30 seconds. If they do, you're good. If not, check your tracking code installation."
    },
  ];

  const metricsExample = `Core Startup Metrics (First 12 Months)

Acquisition:
- Website visitors/month
- Organic vs paid traffic ratio
- Top 3 traffic sources

Activation:
- Sign-up conversion rate
- Time to first value (e.g., first link created)
- Day 1 retention rate

Revenue:
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Customer acquisition cost (CAC)

That's it. Track 9 metrics religiously. Ignore everything else.`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Playbooks", href: "/resources#playbooks" },
    { label: "Startup Analytics", href: "" },
  ];

  const howToSteps = [
    { name: "Define Core Metrics", text: "Identify 9 key metrics: acquisition (3), activation (3), revenue (3)" },
    { name: "Set Up Architecture", text: "Configure client-side tracking (GA4) and server-side events (Stripe)" },
    { name: "Implement UTM Tagging", text: "Document standard values, create naming convention, build UTM tool" },
    { name: "Configure Tools", text: "Set up GA4, install tracking, create conversion events" },
    { name: "Build Dashboards", text: "Create one-screen dashboard showing traffic, conversions, top sources" },
    { name: "Create Reporting Cadence", text: "Set up weekly email reports with core metrics and changes" }
  ];

  return (
    <>
      <SEO
        title="Startup Analytics Playbook - Set Up Analytics in 2 Hours | utm.one"
        description="Tactical guide for setting up analytics infrastructure from scratch. 9 core metrics, GA4 setup, UTM tagging, and simple dashboards for early-stage startups."
        canonical="https://utm.one/resources/playbooks/startup-analytics"
        ogType="article"
        publishedTime="2024-11-01"
        keywords={["startup analytics", "ga4 setup", "analytics infrastructure", "startup metrics"]}
      />
      <ArticleSchema
        headline="Startup Analytics Playbook: Set Up Analytics Infrastructure in 2 Hours"
        description="Tactical guide for setting up analytics infrastructure from scratch without over-engineering"
        author="utm.one"
        datePublished="2024-11-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqItems} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href ? `https://utm.one${b.href}` : "" }))} />
      <HowToSchema
        name="How to Set Up Startup Analytics"
        description="6-step process for setting up analytics infrastructure for startups"
        steps={howToSteps}
      />
      <SpeakableSchema cssSelector=".speakable-content" />
      
      <GuideLayout
        title="Startup Analytics Playbook"
        subtitle="Tactical guide for setting up analytics infrastructure from scratch without over-engineering"
        readTime="18 min read"
        lastUpdated="November 2024"
        breadcrumbs={breadcrumbs}
        relatedResources={[
          { title: "Simple Analytics Guide", href: "/resources/guides/simple-analytics", description: "Reduce measurement complexity" },
          { title: "Tracking Architecture Guide", href: "/resources/guides/tracking-architecture", description: "Blueprint for data flow" },
          { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Complete UTM tagging guide" },
        ]}
      >
        {/* Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            Simple Analytics is the discipline of reducing your measurement system to the smallest set of metrics, events, and dashboards required to make confident decisions. This playbook shows you exactly how to set it up in 1-2 hours.
          </p>
        </ProgressiveReveal>

        <TimeEstimate time="1-2 hours to set up" difficulty="easy" className="mb-12" />

        {/* Step Tracker */}
        <PlaybookSteps steps={steps} currentStep={1} className="mb-16" />

        {/* Step 1: Define Core Metrics */}
        <section className="mb-16" id="step-1">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 1: Define Your Core Metrics
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Most startups track 50+ metrics and make decisions on 3. Start with the 3 that matter: how many people arrive, how many convert, and how much revenue you generate. Everything else is noise until you have product-market fit.
            </p>
          </ProgressiveReveal>

          <InlineTemplate
            title="Core Metrics Framework"
            code={metricsExample}
            description="The 9 metrics every early-stage startup should track"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Why only 9 metrics? Because you can remember 9. You can't remember 47. When you open your dashboard, you should instantly know if things are working or broken. More metrics = more confusion.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Startup Metrics Worksheet"
            description="Editable spreadsheet to define and track your core metrics"
            fileType="xlsx"
            fileSize="32 KB"
            downloadUrl="#"
          />
        </section>

        {/* Step 2: Set Up Tracking Architecture */}
        <section className="mb-16" id="step-2">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 2: Set Up Tracking Architecture
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Your tracking architecture answers: where do events come from? How do they flow to analytics tools? What gets stored and for how long? For most startups, this is simpler than you think.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Start with client-side tracking (Google Analytics) for website behavior and server-side events (Stripe webhooks) for revenue. Add product analytics (Mixpanel) only when you need to track in-app feature usage. Most startups over-engineer this and regret it.
            </p>
          </ProgressiveReveal>
        </section>

        <CTABanner
          title="Track campaigns with utm.one"
          description="Built-in UTM builder, link tracking, and analytics—no coding required"
          buttonText="Try utm.one"
          buttonHref="/early-access"
          variant="primary"
        />

        {/* Step 3: Implement UTM Tagging */}
        <section className="mb-16" id="step-3">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 3: Implement UTM Tagging
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              UTM tagging is how you know which campaigns drive results. Every external link (ads, emails, social posts, partnerships) should have UTM parameters. No exceptions.
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={utmChecklist}
            storageKey="startup-analytics-utm"
            title="UTM Implementation Checklist"
          />

          <TemplateDownload
            title="UTM Tagging Template"
            description="Pre-built template with dropdown values for source, medium, and campaign"
            fileType="csv"
            fileSize="18 KB"
            downloadUrl="#"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Create a simple spreadsheet or use a UTM builder tool. The key is making it easy enough that your team actually uses it. Complicated tools create compliance problems.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 4: Configure Analytics Tools */}
        <section className="mb-16" id="step-4">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 4: Configure Analytics Tools
          </h2>

          <ActionChecklist
            items={setupChecklist}
            storageKey="startup-analytics-setup"
            title="Tool Setup Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              GA4 setup takes 30 minutes if you follow the docs. The hard part is deciding what to track. Start with page views, sign-ups, and purchases. Add more events only when you have specific questions they'll answer.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 5: Build Simple Dashboards */}
        <section className="mb-16" id="step-5">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 5: Build Simple Dashboards
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Your dashboard should fit on one screen and answer: how many people visited, how many converted, and where did they come from? If you need to scroll or switch tabs, you over-built it.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Startup Dashboard Template (Looker Studio)"
            description="One-page dashboard showing traffic, conversions, and top sources"
            fileType="json"
            fileSize="12 KB"
            downloadUrl="#"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Use Looker Studio (free) or Notion (embed GA4 reports). Avoid building custom dashboards until you have a dedicated data person. Pre-built tools are good enough for the first 12 months.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 6: Create Reporting Cadence */}
        <section className="mb-16" id="step-6">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 6: Create Reporting Cadence
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Set up automated weekly email reports showing your 9 core metrics with week-over-week change. Review these reports every Monday morning. If a metric drops 20%, investigate. If it's stable, keep building.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Monthly deep dives are where you analyze trends, identify patterns, and make strategic changes. Weekly reports are for awareness, monthly reviews are for decisions.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Weekly Report Template"
            description="Email template showing core metrics with change indicators"
            fileType="pdf"
            fileSize="156 KB"
            downloadUrl="#"
          />
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-8">
            Common Questions
          </h2>
          <FAQAccordion items={faqItems} />
        </section>

        {/* Final CTA */}
        <CTABanner
          title="Start tracking campaigns today"
          description="utm.one gives you UTM builder, link tracking, and analytics in one simple platform"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="accent"
        />
      </GuideLayout>
    </>
  );
}
