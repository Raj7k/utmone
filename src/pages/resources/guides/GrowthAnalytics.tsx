import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CaseStudyCard } from "@/components/resources/CaseStudyCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { QuickAnswer } from "@/components/resources/QuickAnswer";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { Link } from "react-router-dom";

const GrowthAnalytics = () => {
  const breadcrumbs = [
    { label: "resources", href: "/resources" },
    { label: "guides", href: "/resources/guides" },
    { label: "growth analytics", href: "" }
  ];

  const relatedResources = [
    { title: "Simple Analytics", href: "/resources/guides/simple-analytics", description: "Minimal metrics framework" },
    { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Master campaign tracking" },
    { title: "Tracking Architecture", href: "/resources/guides/tracking-architecture", description: "Blueprint for data flow" },
  ];

  const faqs = [
    {
      question: "What is Growth Analytics?",
      answer: "Growth Analytics is the discipline of measuring acquisition, activation, retention, and revenue across the entire customer lifecycle using clean, structured tracking. It's how growth teams understand what's driving business results."
    },
    {
      question: "How is this different from marketing analytics?",
      answer: "Marketing analytics focuses on campaigns. Growth analytics tracks the full customer journey—from first click through activation, retention, and revenue. It connects marketing efforts to business outcomes."
    },
    {
      question: "What is the AARRR framework?",
      answer: "AARRR stands for Acquisition → Activation → Retention → Revenue → Referral. It's the pirate metrics framework that tracks users through every lifecycle stage, showing where growth happens and where it breaks."
    },
    {
      question: "Why do growth teams fail at analytics?",
      answer: "Most growth teams track too many metrics without clear definitions. They can't answer 'what's our activation rate?' because nobody defined what activation means. Growth Analytics establishes clear metric definitions upfront."
    },
    {
      question: "Can I implement this without a data team?",
      answer: "Yes. Growth Analytics focuses on simple, actionable metrics that any team can track. utm.one automates the tracking infrastructure so you don't need engineering resources."
    },
  ];

  return (
    <>
      <SEO
        title="Growth Analytics Guide - Measuring What Matters | utm.one"
        description="Measuring acquisition, activation, retention, and revenue across the entire customer lifecycle. AARRR framework for growth teams."
        canonical="https://utm.one/resources/guides/growth-analytics"
        ogType="article"
        publishedTime="2025-01-23"
        keywords={["growth analytics", "aarrr framework", "pirate metrics", "customer lifecycle"]}
      />
      <ArticleSchema
        headline="Growth Analytics — Measuring What Matters"
        description="Measuring acquisition, activation, retention, and revenue across the entire customer lifecycle"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <SpeakableSchema headline="Growth Analytics" summary="Measuring acquisition, activation, retention, and revenue across the entire customer lifecycle using the AARRR framework" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />
      
      <GuideLayout
        title="Growth Analytics — Measuring What Matters"
        subtitle="measuring acquisition, activation, retention, and revenue across the entire customer lifecycle"
        readTime="14 min read"
        lastUpdated="2025-01-23"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
        backLink="/resources/guides"
        backLabel="Back to Guides"
      >
      <QuickAnswer>
        Growth Analytics is the discipline of measuring acquisition, activation, retention, and revenue across the entire customer lifecycle using clean, structured tracking. It uses the AARRR framework (Pirate Metrics) to track users through every lifecycle stage, showing where growth happens and where it breaks.
      </QuickAnswer>

      {/* Narrative Introduction */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">why growth teams fail at analytics</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Growth teams fail not because they lack data, but because they lack structured analytics.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          They track signups but can't explain why activation dropped. They measure clicks but don't know which campaigns drive retention. They celebrate revenue wins without understanding what actually drove them.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This happens because growth analytics isn't just "more marketing metrics." It's a complete measurement system tracking users through acquisition → activation → retention → revenue—the full lifecycle, not just the first touchpoint.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This guide introduces the Growth Analytics Model, a scalable framework for modern SaaS and product-led companies that connects campaign tracking to business outcomes.
        </p>
      </section>

      <CTABanner
        title="utm.one tracks the full customer journey"
        description="From first click to final conversion—see which campaigns drive real growth, not just traffic."
        buttonText="see growth tracking"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* AARRR Framework */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-foreground">the growth analytics model (AARRR)</h2>

        <p className="text-lg text-muted-foreground leading-relaxed">
          The AARRR framework (also called Pirate Metrics) tracks users through 5 lifecycle stages:
        </p>

        <div className="space-y-6">
          {/* Stage 1 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">stage 1</div>
              <h3 className="text-lg font-display font-semibold text-foreground">acquisition</h3>
              <p className="text-muted-foreground">
                How many people are entering your funnel? Measured as clicks, visits, or signups depending on your model.
              </p>
              <p className="text-sm text-muted-foreground">
                Key metric: <strong className="text-foreground">Signup rate</strong> (visits → signups)
              </p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">stage 2</div>
              <h3 className="text-lg font-display font-semibold text-foreground">activation</h3>
              <p className="text-muted-foreground">
                Did users experience your product's core value? For SaaS, this might be "completed onboarding" or "sent first campaign."
              </p>
              <p className="text-sm text-muted-foreground">
                Key metric: <strong className="text-foreground">Activation rate</strong> (signups → activated users)
              </p>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">stage 3</div>
              <h3 className="text-lg font-display font-semibold text-foreground">retention</h3>
              <p className="text-muted-foreground">
                Are users coming back? Measured as Day 7, Day 30, or Month 2 retention depending on your product cycle.
              </p>
              <p className="text-sm text-muted-foreground">
                Key metric: <strong className="text-foreground">D7 retention</strong> (% of users returning after 7 days)
              </p>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">stage 4</div>
              <h3 className="text-lg font-display font-semibold text-foreground">revenue</h3>
              <p className="text-muted-foreground">
                Are users converting to paid customers? Measured as conversion rate, MRR, or LTV.
              </p>
              <p className="text-sm text-muted-foreground">
                Key metric: <strong className="text-foreground">Conversion rate</strong> (activated users → paid customers)
              </p>
            </div>
          </div>

          {/* Stage 5 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wide text-primary">stage 5</div>
              <h3 className="text-lg font-display font-semibold text-foreground">referral</h3>
              <p className="text-muted-foreground">
                Are customers bringing new users? Measured as referral rate, viral coefficient, or NPS.
              </p>
              <p className="text-sm text-muted-foreground">
                Key metric: <strong className="text-foreground">Referral rate</strong> (% of customers who refer others)
              </p>
            </div>
          </div>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          These 5 stages form a complete growth measurement system. If you can answer "How's acquisition? Activation? Retention? Revenue? Referral?" you understand where growth happens and where it breaks.
        </p>

        <p className="text-sm text-muted-foreground">
          → Simplified approach in our <Link to="/resources/guides/simple-analytics" className="text-primary hover:underline">Simple Analytics Guide</Link>
        </p>
      </section>

      {/* Case Study */}
      <CaseStudyCard
        title="SaaS Company: Acme Analytics"
        before={{
          title: "before growth analytics",
          items: [
            "Tracked signups but couldn't explain why activation dropped from 45% to 30%",
            "Marketing celebrated 10K clicks but couldn't connect them to revenue",
            "Retention metrics existed but weren't tied to acquisition sources",
            "Revenue attribution was unclear—sales and marketing showed different numbers"
          ]
        }}
        after={{
          title: "after growth analytics",
          items: [
            "Identified that LinkedIn campaigns drove 60% higher activation than Google Ads",
            "Connected UTM tracking to full funnel—now knows which campaigns drive retention",
            "Discovered organic signups had 2x better D7 retention than paid channels",
            "Unified revenue attribution—marketing and sales use same dashboard"
          ],
          metrics: "Activation rate: 45% | Revenue per campaign: $50K MRR | CAC payback: 3 months"
        }}
        highlightMetric="300%"
      />

      <CTABanner
        title="see which campaigns drive real growth"
        description="utm.one connects acquisition → activation → retention → revenue so you know what's actually working."
        buttonText="track full funnel"
        buttonHref="/early-access"
        variant="accent"
      />

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">frequently asked questions</h2>
        <FAQAccordion items={faqs} />
      </section>

      <CTABanner
        title="ready to measure growth properly?"
        description="utm.one implements the Growth Analytics Model automatically—from acquisition tracking to revenue attribution."
        buttonText="get early access"
        buttonHref="/early-access"
      />
      </GuideLayout>
    </>
  );
};

export default GrowthAnalytics;