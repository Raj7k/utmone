import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { QuickAnswer } from "@/components/resources/QuickAnswer";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { Link } from "react-router-dom";

const SimpleAnalytics = () => {
  const breadcrumbs = [
    { label: "resources", href: "/resources" },
    { label: "guides", href: "/resources/guides" },
    { label: "simple analytics", href: "" }
  ];

  const relatedResources = [
    { title: "Tracking Architecture", href: "/resources/guides/tracking-architecture", description: "Blueprint for unified data flow" },
    { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Master UTM parameters" },
    { title: "Clean-Track Framework", href: "/resources/guides/clean-track-framework", description: "Foundation of campaign tracking" },
  ];

  const faqs = [
    {
      question: "What is Simple Analytics?",
      answer: "Simple Analytics is the discipline of reducing your measurement system to the smallest set of metrics, events, and dashboards required to make confident decisions. It fights data overload, reporting noise, and analytics paralysis."
    },
    {
      question: "Isn't more data always better?",
      answer: "No. More data creates more noise. When dashboards show 50 metrics, nobody knows which 3 actually matter. Simple Analytics focuses on the minimal set of metrics that drive action."
    },
    {
      question: "What are the 3 core metrics?",
      answer: "1) Acquisition (clicks, visits, signups), 2) Engagement (activation, retention), 3) Revenue (conversions, MRR, LTV). Everything else is secondary. These 3 tell you if campaigns are working."
    },
    {
      question: "How is this different from Google Analytics?",
      answer: "GA tracks everything. Simple Analytics focuses on what matters. GA shows 100+ reports—Simple Analytics distills to 3-5 dashboards that actually drive decisions."
    },
    {
      question: "Can I still track advanced metrics?",
      answer: "Yes, but only when they're actionable. If a metric doesn't change behavior or inform a decision, it's noise. Simple Analytics eliminates noise so you focus on signal."
    },
  ];

  return (
    <>
      <SEO
        title="Simple Analytics Guide - Clarity Over Complexity | utm.one"
        description="Reduce measurement to the smallest set of metrics, events, and dashboards required for confident decisions. Focus on what matters: acquisition, engagement, revenue."
        canonical="https://utm.one/resources/guides/simple-analytics"
        ogType="article"
        publishedTime="2025-01-23"
        keywords={["simple analytics", "minimal metrics", "analytics framework", "marketing measurement"]}
      />
      <ArticleSchema
        headline="Simple Analytics — Clarity Over Complexity"
        description="Reducing measurement to the smallest set of metrics, events, and dashboards required for confident decisions"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      
      <GuideLayout
        title="Simple Analytics — Clarity Over Complexity"
        subtitle="reducing measurement to the smallest set of metrics, events, and dashboards required for confident decisions"
        readTime="10 min read"
        lastUpdated="2025-01-23"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
        backLink="/resources/guides"
        backLabel="Back to Guides"
      >
      <QuickAnswer>
        Simple Analytics is the discipline of reducing your measurement system to the smallest set of metrics, events, and dashboards required to make confident decisions. It focuses on 3 core metrics (acquisition, engagement, revenue) instead of tracking everything, eliminating analytics paralysis and reporting noise.
      </QuickAnswer>

      {/* Narrative Introduction */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">the problem with complex analytics</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Most marketing teams are drowning in data but starving for insights.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          They track 50 metrics, build 20 dashboards, and configure 100 events—yet when asked "how's the campaign performing?" they stare at screens trying to remember which metric matters.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This is analytics paralysis. The more data you track, the harder it becomes to find clarity. Dashboards overflow with noise. Meetings devolve into metric debates. Teams can't agree on what "success" means because they're measuring too many things at once.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Simple Analytics is the antidote. It's the discipline of reducing measurement to the absolute minimum required to make confident decisions. Not "what can we track?" but "what must we track?"
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This guide shows you how to strip analytics down to 3 core metrics, 5 essential events, and 1 dashboard that actually drives action.
        </p>
      </section>

      <CTABanner
        title="utm.one shows you the 3 metrics that matter"
        description="No overwhelming dashboards. No metric overload. Just clean, simple analytics focused on what drives decisions."
        buttonText="see simple dashboards"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* The 3 Core Metrics */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-foreground">the minimal metrics framework</h2>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Every SaaS, ecommerce, or product-led company needs 3 core metrics:
        </p>

        <div className="space-y-8">
          {/* Metric 1 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="space-y-3">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">metric 1</div>
              <h3 className="text-xl font-display font-semibold text-foreground">acquisition</h3>
              <p className="text-muted-foreground leading-relaxed">
                How many people are entering your funnel? Measured as clicks, visits, or signups depending on your business.
              </p>
              <p className="text-sm text-muted-foreground">
                Example: "This campaign drove 10,000 clicks and 500 signups this month."
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="space-y-3">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">metric 2</div>
              <h3 className="text-xl font-display font-semibold text-foreground">engagement</h3>
              <p className="text-muted-foreground leading-relaxed">
                Are people activating and coming back? Measured as activation rate (did they complete onboarding?) and retention (did they return in 7 days?).
              </p>
              <p className="text-sm text-muted-foreground">
                Example: "40% of signups activated. 25% returned after 7 days."
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="space-y-3">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">metric 3</div>
              <h3 className="text-xl font-display font-semibold text-foreground">revenue</h3>
              <p className="text-muted-foreground leading-relaxed">
                Are campaigns profitable? Measured as conversions, MRR, or LTV depending on your business model.
              </p>
              <p className="text-sm text-muted-foreground">
                Example: "Campaign generated $50K MRR at $200 CAC."
              </p>
              <p className="text-sm text-muted-foreground">
                → Track conversions with our <Link to="/resources/guides/utm-guide" className="text-primary hover:underline">UTM Guide</Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          That's it. Three metrics. If you can answer "How's acquisition? How's engagement? How's revenue?" you can make confident decisions.
        </p>
      </section>

      {/* Good vs Bad */}
      <ComparisonCard
        goodExample={{
          title: "simple analytics approach",
          items: [
            "Track 3 core metrics: acquisition, engagement, revenue",
            "1 primary dashboard showing campaign performance",
            "5-7 essential events (signup, activation, purchase)",
            "Weekly review takes 15 minutes because metrics are clear"
          ],
          explanation: "Team knows exactly what's working and what needs attention. Decisions happen fast."
        }}
        badExample={{
          title: "complex analytics trap",
          items: [
            "Track 50+ metrics across multiple dashboards",
            "10+ dashboards showing conflicting views",
            "30+ events tracked but nobody uses most of them",
            "Weekly reviews take 2 hours debating which metrics matter"
          ],
          explanation: "Team drowns in data but can't find insights. Paralysis replaces action."
        }}
      />

      <CTABanner
        title="utm.one focuses on signal, not noise"
        description="See acquisition, engagement, and revenue in one clean dashboard—no metric overload."
        buttonText="see clean dashboards"
        buttonHref="/early-access"
        variant="accent"
      />

      {/* Dashboard Simplification */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">dashboard simplification</h2>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Most teams have too many dashboards. Marketing has one, sales has another, ops builds a third. They show different numbers for the same campaign.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Simple Analytics uses 1 primary dashboard with 3 sections:
        </p>

        <ul className="space-y-3 text-lg text-muted-foreground leading-relaxed ml-6">
          <li className="flex items-start gap-3">
            <span className="mt-1 text-primary">→</span>
            <span><strong className="text-foreground">Section 1:</strong> Acquisition (clicks, visits, signups by campaign)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-primary">→</span>
            <span><strong className="text-foreground">Section 2:</strong> Engagement (activation rate, retention by cohort)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-primary">→</span>
            <span><strong className="text-foreground">Section 3:</strong> Revenue (conversions, MRR, CAC by channel)</span>
          </li>
        </ul>

        <p className="text-lg text-muted-foreground leading-relaxed">
          One dashboard. Three sections. Everyone sees the same numbers.
        </p>

        <p className="text-sm text-muted-foreground">
          → Implementation details in our <Link to="/resources/guides/tracking-architecture" className="text-primary hover:underline">Tracking Architecture Guide</Link>
        </p>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">frequently asked questions</h2>
        <FAQAccordion items={faqs} />
      </section>

      <CTABanner
        title="ready for clarity over complexity?"
        description="utm.one's simple analytics show you exactly what matters—no noise, no overload."
        buttonText="get early access"
        buttonHref="/early-access"
      />
      </GuideLayout>
    </>
  );
};

export default SimpleAnalytics;