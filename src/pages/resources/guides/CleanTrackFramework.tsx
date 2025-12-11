import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { QuickAnswer } from "@/components/resources/QuickAnswer";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { Link } from "react-router-dom";
import { Layers, Database, LineChart, Shield } from "lucide-react";

const CleanTrackFramework = () => {
  const breadcrumbs = [
    { label: "resources", href: "/resources" },
    { label: "guides", href: "/resources/guides" },
    { label: "clean-track framework", href: "" }
  ];

  const relatedResources = [
    { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Master UTM parameter fundamentals" },
    { title: "Tracking Architecture", href: "/resources/guides/tracking-architecture", description: "Blueprint for unified data flow" },
    { title: "Simple Analytics", href: "/resources/guides/simple-analytics", description: "Minimal metrics for confident decisions" },
  ];

  const faqs = [
    {
      question: "What is the Clean-Track Framework?",
      answer: "The Clean-Track Framework is the foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems. It's the operating system behind clean data, accurate dashboards, and trustworthy reporting."
    },
    {
      question: "Why do I need a tracking framework?",
      answer: "Without a framework, your tracking breaks under campaign complexity. Links accumulate inconsistent UTMs, naming conventions diverge across teams, and reporting becomes unreliable. The Clean-Track Framework prevents this chaos."
    },
    {
      question: "What are the 4 layers of Clean-Track?",
      answer: "Layer 1: Campaign Taxonomy (naming structure), Layer 2: UTM Governance (parameter rules), Layer 3: Attribution Logic (credit assignment), Layer 4: Reporting Standards (dashboard consistency)."
    },
    {
      question: "How does this relate to UTM parameters?",
      answer: "UTMs are part of Layer 2 (UTM Governance). The framework ensures all 5 UTM parameters follow consistent rules across every campaign. See our UTM Guide for parameter-specific details."
    },
    {
      question: "Can I implement this without utm.one?",
      answer: "Yes, but it requires significant manual effort. utm.one automates all 4 layers with templates, validation rules, and real-time enforcement so your team never creates inconsistent links."
    },
  ];

  return (
    <>
      <SEO
        title="Clean-Track Framework - Data Architecture Guide | utm.one"
        description="The foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems. 4-layer framework for tracking governance."
        canonical="https://utm.one/resources/guides/clean-track-framework"
        ogType="article"
        publishedTime="2025-01-23"
        keywords={["clean-track framework", "tracking governance", "utm architecture", "campaign tracking"]}
      />
      <ArticleSchema
        headline="Clean-Track Framework — Data Architecture Guide"
        description="The foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      <SpeakableSchema headline="Clean-Track Framework" summary="The foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems" cssSelectors={['.speakable-content', 'article', 'h1', 'h2']} />
      
      <GuideLayout
        title="Clean-Track Framework — Data Architecture Guide"
        subtitle="the foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems"
        readTime="15 min read"
        lastUpdated="2025-01-23"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
        backLink="/resources/guides"
        backLabel="Back to Guides"
      >
      <QuickAnswer>
        The Clean-Track Framework is the foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems. It's a 4-layer architecture: Campaign Taxonomy (naming structure), UTM Governance (parameter rules), Attribution Logic (credit assignment), and Reporting Standards (dashboard consistency).
      </QuickAnswer>

      {/* Narrative Introduction */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">why tracking frameworks matter</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Marketing breaks when links break. Links break when tracking breaks. Tracking breaks when there's no system behind it.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          The Clean-Track Framework is that system. It's the foundation that ensures your campaigns, UTMs, attribution logic, and reporting dashboards all speak the same language—no matter how many teams, tools, or campaigns you're running.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Without a framework, tracking degrades under pressure. One team uses <code className="text-sm bg-muted px-2 py-1 rounded">utm_source=email</code>, another uses <code className="text-sm bg-muted px-2 py-1 rounded">utm_source=newsletter</code>. Campaign names drift from <code className="text-sm bg-muted px-2 py-1 rounded">q1-promo</code> to <code className="text-sm bg-muted px-2 py-1 rounded">Q1_Promo_2025_Final_v2</code>. Dashboards show incomplete data because attribution rules weren't standardized.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This isn't just a "nice to have." It's the difference between accurate attribution and broken reporting. Between confident decisions and guesswork.
        </p>
      </section>

      <CTABanner
        title="utm.one implements the Clean-Track Framework automatically"
        description="Every link follows your rules. Every UTM stays consistent. Every dashboard stays accurate."
        buttonText="get early access"
        buttonHref="/early-access"
        variant="primary"
      />

      {/* The 4 Layers */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-foreground">the 4 layers of clean-track</h2>

        <div className="space-y-8">
          {/* Layer 1 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">layer 1: campaign taxonomy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your naming structure for campaigns, channels, and initiatives. This is the semantic layer that makes your tracking human-readable.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Example: <code className="text-sm bg-muted px-2 py-1 rounded">linkedin-demand-product-q1</code> tells you the channel (LinkedIn), team (demand), focus (product), and timing (Q1) instantly.
                </p>
                <p className="text-sm text-muted-foreground">
                  → Learn more in our <Link to="/resources/guides/utm-guide" className="text-primary hover:underline">UTM Guide</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">layer 2: UTM governance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rules for all 5 UTM parameters (<code className="text-sm">source</code>, <code className="text-sm">medium</code>, <code className="text-sm">campaign</code>, <code className="text-sm">term</code>, <code className="text-sm">content</code>) ensuring consistency across every link.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This layer enforces lowercase, prevents spaces, validates allowed values, and auto-applies templates so no link ever breaks your taxonomy.
                </p>
                <p className="text-sm text-muted-foreground">
                  → See implementation in our <Link to="/resources/guides/tracking-architecture" className="text-primary hover:underline">Tracking Architecture Guide</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Layer 3 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">layer 3: attribution logic</h3>
                <p className="text-muted-foreground leading-relaxed">
                  How credit is assigned across touchpoints (first-click, last-click, multi-touch). This determines which campaigns get credit for conversions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Without standardized attribution, your reporting shows conflicting numbers. Marketing says one campaign drove 100 conversions, sales says it was 50.
                </p>
              </div>
            </div>
          </div>

          {/* Layer 4 */}
          <div className="p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground">layer 4: reporting standards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboard structure, metric definitions, and aggregation rules. This ensures everyone sees the same numbers when they ask "how's the campaign performing?"
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Standardized reporting means your marketing, sales, and ops teams trust the same dashboards instead of building competing versions.
                </p>
                <p className="text-sm text-muted-foreground">
                  → Simplified approach in our <Link to="/resources/guides/simple-analytics" className="text-primary hover:underline">Simple Analytics Guide</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Good vs Bad */}
      <ComparisonCard
        goodExample={{
          title: "with clean-track framework",
          items: [
            "All campaigns follow same naming structure",
            "UTMs validated before links go live",
            "Attribution rules defined upfront",
            "Dashboards show consistent metrics across teams"
          ],
          explanation: "Reporting stays accurate as campaigns scale. Teams trust the data."
        }}
        badExample={{
          title: "without framework",
          items: [
            "Campaign names drift over time (Q1-promo vs q1_promo_final)",
            "UTMs contain typos, mixed cases, special characters",
            "Attribution credit assigned inconsistently",
            "Every team builds their own dashboard with different numbers"
          ],
          explanation: "Data quality degrades under pressure. Reporting becomes unreliable."
        }}
      />

      <CTABanner
        title="stop manually enforcing tracking rules"
        description="utm.one applies the Clean-Track Framework automatically—validation, templates, and governance built in."
        buttonText="try utm.one"
        buttonHref="/early-access"
        variant="accent"
      />

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">frequently asked questions</h2>
        <FAQAccordion items={faqs} />
      </section>

      <CTABanner
        title="ready to implement clean tracking?"
        description="utm.one automates the entire Clean-Track Framework—from UTM governance to reporting standards."
        buttonText="get early access"
        buttonHref="/early-access"
      />
      </GuideLayout>
    </>
  );
};

export default CleanTrackFramework;