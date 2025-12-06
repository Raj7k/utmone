import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { QuickAnswer } from "@/components/resources/QuickAnswer";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { Link } from "react-router-dom";
import { GitBranch, Database, BarChart3, Users, Zap } from "lucide-react";

const TrackingArchitecture = () => {
  const breadcrumbs = [
    { label: "resources", href: "/resources" },
    { label: "guides", href: "/resources/guides" },
    { label: "tracking architecture", href: "" }
  ];

  const relatedResources = [
    { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Master UTM parameters and conventions" },
    { title: "Clean-Track Framework", href: "/resources/guides/clean-track-framework", description: "Foundation of campaign tracking" },
    { title: "Simple Analytics", href: "/resources/guides/simple-analytics", description: "Minimal metrics framework" },
  ];

  const faqs = [
    {
      question: "What is tracking architecture?",
      answer: "Tracking architecture defines how campaigns, UTMs, channels, events, and reporting systems connect into a single, unified data flow. It's the blueprint behind clean attribution, reliable dashboards, and scalable analytics."
    },
    {
      question: "Why do I need an architecture—can't I just add UTMs?",
      answer: "UTMs are one piece. Architecture connects campaigns → links → clicks → events → attribution → dashboards into a complete system. Without architecture, data flows break and reporting becomes unreliable."
    },
    {
      question: "What are the 5 architecture principles?",
      answer: "1) Single source of truth for all links, 2) Consistent taxonomy across channels, 3) Clean event pipeline (no dropped data), 4) Unified attribution model, 5) Standardized reporting layer. These principles ensure data flows correctly from campaign creation to final dashboard."
    },
    {
      question: "How does this differ from Google Analytics setup?",
      answer: "GA is one reporting tool. Architecture defines the entire data flow—from how links are created, how UTMs are structured, how events are tracked, and how all systems connect. GA is the final layer, not the architecture itself."
    },
    {
      question: "Can I implement this without technical help?",
      answer: "Yes, but it requires planning. utm.one implements tracking architecture automatically with templates, validation, and unified dashboards so you don't need to architect it manually."
    },
  ];

  return (
    <>
      <SEO
        title="Tracking Architecture Guide - Building for Scale | utm.one"
        description="Blueprint for how campaigns, UTMs, channels, events, and reporting systems connect into unified data flow. 5 principles for scalable tracking infrastructure."
        canonical="https://utm.one/resources/guides/tracking-architecture"
        ogType="article"
        publishedTime="2025-01-23"
        keywords={["tracking architecture", "utm infrastructure", "analytics system", "data flow"]}
      />
      <ArticleSchema
        headline="Tracking Architecture — Building for Scale"
        description="Blueprint for how campaigns, UTMs, channels, events, and reporting systems connect into unified data flow"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      
      <GuideLayout
        title="Tracking Architecture — Building for Scale"
        subtitle="blueprint for how campaigns, UTMs, channels, events, and reporting systems connect into unified data flow"
        readTime="18 min read"
        lastUpdated="2025-01-23"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
      >
      <QuickAnswer>
        Tracking architecture defines how campaigns, UTMs, channels, events, and reporting systems connect into a single, unified data flow. It's the blueprint behind clean attribution, reliable dashboards, and scalable analytics—ensuring data flows cleanly from campaign creation to final report without breaking under complexity.
      </QuickAnswer>

      {/* Narrative Introduction */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">why architecture matters</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Most teams build tracking systems that work on day one but break by month six.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          They add UTMs without structure. They track events without naming conventions. They connect tools without understanding data flow. Then reporting breaks—dashboards show conflicting numbers, attribution credit is unclear, and nobody trusts the data.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Tracking architecture solves this. It's the blueprint that defines how campaigns, links, clicks, events, and dashboards connect into a single, unified system. With good architecture, data flows cleanly from campaign creation to final report. Without it, tracking degrades under complexity.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This guide explains the 5 foundational principles behind scalable tracking architecture and how to implement them for reliable, long-term data quality.
        </p>
      </section>

      <CTABanner
        title="utm.one implements tracking architecture automatically"
        description="From link creation to final dashboard—your data flows cleanly without manual setup."
        buttonText="see how it works"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* The 5 Architecture Principles */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-foreground">the 5 architecture principles</h2>

        <div className="space-y-8">
          {/* Principle 1 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">1. single source of truth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All links, campaigns, and tracking parameters live in one centralized system. No scattered spreadsheets, no duplicate Bitly accounts, no "I don't know where that link came from."
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This ensures every team member sees the same campaign data and nobody creates conflicting links with different UTMs.
                </p>
              </div>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">2. consistent taxonomy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every campaign follows the same naming structure. UTM parameters use standardized values. Channel names don't drift from <code className="text-sm bg-muted px-2 py-1 rounded">email</code> to <code className="text-sm bg-muted px-2 py-1 rounded">newsletter</code> to <code className="text-sm bg-muted px-2 py-1 rounded">email_marketing</code>.
                </p>
                <p className="text-sm text-muted-foreground">
                  → Details in our <Link to="/resources/guides/clean-track-framework" className="text-primary hover:underline">Clean-Track Framework</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">3. clean event pipeline</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Clicks, conversions, and attribution events flow through a reliable pipeline—no dropped data, no missing events, no "we lost 20% of our conversion tracking last week."
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This requires proper error handling, event validation, and monitoring to catch issues before they corrupt reporting.
                </p>
              </div>
            </div>
          </div>

          {/* Principle 4 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">4. unified attribution model</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Credit is assigned consistently across all touchpoints. Whether you use first-click, last-click, or multi-touch attribution, the rules are standardized so reporting doesn't conflict.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Without unified attribution, marketing says one campaign drove 100 conversions while sales says it was 50—same data, different interpretations.
                </p>
              </div>
            </div>
          </div>

          {/* Principle 5 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">5. standardized reporting layer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboards, metrics, and aggregation rules are consistent across teams. Everyone sees the same campaign performance instead of building their own competing reports.
                </p>
                <p className="text-sm text-muted-foreground">
                  → Minimal dashboard approach in <Link to="/resources/guides/simple-analytics" className="text-primary hover:underline">Simple Analytics Guide</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Good vs Bad */}
      <ComparisonCard
        goodExample={{
          title: "with tracking architecture",
          items: [
            "All links created from single system",
            "UTMs follow consistent rules automatically",
            "Events flow through reliable pipeline",
            "Attribution model standardized across teams",
            "Dashboards show unified metrics"
          ],
          explanation: "Data flows cleanly from campaign creation to final report. Teams trust the numbers."
        }}
        badExample={{
          title: "without architecture",
          items: [
            "Links scattered across Bitly, spreadsheets, manual creation",
            "UTM conventions drift over time",
            "Events drop or duplicate randomly",
            "Attribution credit assigned inconsistently",
            "Every team builds their own dashboard with different totals"
          ],
          explanation: "Reporting breaks under complexity. Nobody trusts the data."
        }}
      />

      <CTABanner
        title="stop rebuilding tracking systems every 6 months"
        description="utm.one's architecture scales from 10 campaigns to 10,000 without breaking."
        buttonText="see the architecture"
        buttonHref="/early-access"
        variant="accent"
      />

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">frequently asked questions</h2>
        <FAQAccordion items={faqs} />
      </section>

      <CTABanner
        title="ready to build scalable tracking?"
        description="utm.one implements all 5 architecture principles automatically—from single source of truth to unified reporting."
        buttonText="get early access"
        buttonHref="/early-access"
      />
      </GuideLayout>
    </>
  );
};

export default TrackingArchitecture;