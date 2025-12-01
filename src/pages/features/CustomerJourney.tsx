import { FeatureLayout } from "@/components/features/FeatureLayout";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { ArrowRight, Brain, Users, TrendingUp, Link2, Target, BarChart3, GitBranch, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerJourney = () => {
  const faqData = [
    {
      question: "How does utm.one handle cross-device tracking?",
      answer: "We use a deterministic 'Identity Stitching' method. When a user identifies themselves (e.g., via a form fill or login) on a new device, we link that session's visitor_id to their global user_id, merging the journey graphs across mobile and desktop."
    },
    {
      question: "What attribution models do you support?",
      answer: "We support standard models (Linear, First-Touch, Last-Touch) and advanced Algorithmic Models (Bayesian Lift and Markov Chains) that assign credit based on removal effects and conversion probability."
    },
    {
      question: "Is this GDPR/CCPA compliant?",
      answer: "Yes. Our Identity Resolution is first-party only. We do not share data between customers. You own your identity graph. We also provide 'Right to be Forgotten' endpoints that purge a user's entire history from the graph."
    },
    {
      question: "Can I export the raw journey data?",
      answer: "Yes. Enterprise plans include Data Warehouse Sync (Snowflake, BigQuery, S3). You can export the full journey_events table for internal analysis."
    },
    {
      question: "How accurate is the attribution?",
      answer: "Our Bayesian Attribution models calculate probabilistic lift based on causal inference. Rather than arbitrary rules like 'last click gets 100%', we measure the actual increase in conversion probability each touchpoint provides."
    },
    {
      question: "What is 'State Valuation'?",
      answer: "We model your website as a Markov Decision Process (MDP), calculating the expected dollar value of every page based on its conversion probability and downstream paths. This tells you exactly which pages drive revenue."
    },
    {
      question: "How do you identify the 'Golden Path'?",
      answer: "Using Pareto Optimization, we analyze all conversion paths to find the efficient frontier—sequences that maximize lifetime value while minimizing steps. These are paths where no alternative is both faster and more profitable."
    },
    {
      question: "Can I see individual user journeys?",
      answer: "Yes. You can drill down into any visitor's complete journey timeline, seeing every touchpoint from first visit to conversion (or exit). All anonymous activity is retroactively linked when they identify themselves."
    }
  ];

  return (
    <FeatureLayout
      title="Customer Journey Analytics & Multi-Touch Attribution - utm.one"
      description="Stop tracking clicks. Start engineering journeys with Bayesian Attribution, Identity Resolution, and Markov State Valuation."
      canonical="https://utm.one/features/customer-journey"
      keywords={["customer journey analytics", "multi-touch attribution", "identity resolution", "bayesian attribution", "journey mapping", "conversion tracking"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Customer Journey", url: "https://utm.one/features/customer-journey" },
      ]}
    >
      <LLMSchemaGenerator
        type="software"
        data={{}}
      />

      <LLMSchemaGenerator
        type="faq"
        data={{ questions: faqData }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-label lowercase tracking-tight">
                stop tracking clicks.<br />start engineering journeys.
              </h1>
              <p className="text-xl md:text-2xl text-secondary-label max-w-3xl mx-auto leading-relaxed">
                Most attribution tools tell you what happened <span className="italic">last</span>. <span className="font-semibold text-label">utm.one</span> uses <span className="font-semibold">Bayesian Inference</span> and <span className="font-semibold">Identity Stitching</span> to reveal the entire causal chain—from the first anonymous visit to the final enterprise contract.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/dashboard/attribution">
                  <Button variant="marketing" size="lg" className="text-lg px-8">
                    See Your Journey Graph <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button variant="outline" size="lg" className="text-lg">
                    Read the Methodology
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem/Solution Block */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: The Problem */}
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-semibold uppercase tracking-wider">
                  The Lie of "Last Click"
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  100% credit to the wrong touchpoint
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  Standard analytics give 100% of the credit to the last link a user clicked. This ignores the 10 other touchpoints that actually built the trust.
                </p>
                <p className="text-lg text-secondary-label leading-relaxed">
                  It's like giving a gold medal to the goalkeeper and ignoring the rest of the team.
                </p>
              </div>

              {/* Right: The Solution */}
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wider">
                  The "Unreal" Truth
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  probabilistic causal graphs
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  We treat your customer journey as a <span className="font-semibold text-label">Probabilistic Graph</span>. By tracking the "Hidden States" of your users, we can mathematically prove which channels are driving revenue and which are just noise.
                </p>
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-4">
                    <Brain className="w-8 h-8 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold text-label mb-2 lowercase">structure learning</p>
                      <p className="text-sm text-secondary-label">
                        We discover the causal graph of influence, not just correlations
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The 3 Engines */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
                the three engines
              </h2>
              <p className="text-xl text-secondary-label max-w-3xl mx-auto">
                Complete journey intelligence from identity to optimization
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Engine 1: Identity Resolution */}
              <AnimatedSection delay={0.1}>
                <Card className="p-8 h-full hover:shadow-lg transition-shadow bg-card border-border">
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-label lowercase mb-2">
                        identity resolution
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-4 uppercase tracking-wider">
                        The "Stitch"
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-label lowercase mb-4">
                      "de-anonymize your traffic."
                    </p>
                    <p className="text-secondary-label leading-relaxed">
                      We don't just track cookies; we resolve identities. Our <span className="font-semibold">Time-Travel Stitching</span> engine remembers that "Anonymous Visitor 582" who read your blog 3 weeks ago is actually <span className="font-semibold">Sarah from Nike</span>. When she finally signs up, we backfill her history instantly.
                    </p>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        Powered by: Sequential State Estimation
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>

              {/* Engine 2: Bayesian Attribution */}
              <AnimatedSection delay={0.2}>
                <Card className="p-8 h-full hover:shadow-lg transition-shadow bg-card border-border">
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <GitBranch className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-label lowercase mb-2">
                        bayesian attribution
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-4 uppercase tracking-wider">
                        The "Why"
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-label lowercase mb-4">
                      "see the invisible influence."
                    </p>
                    <p className="text-secondary-label leading-relaxed">
                      Forget "Linear" or "Time Decay" models. We use <span className="font-semibold">Bayesian Networks</span> to calculate the true "Lift" of every channel. See exactly how a LinkedIn impression <span className="italic">causes</span> a Direct search three days later.
                    </p>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        Powered by: Structure Learning & Causal Inference
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>

              {/* Engine 3: Journey Valuation */}
              <AnimatedSection delay={0.3}>
                <Card className="p-8 h-full hover:shadow-lg transition-shadow bg-card border-border">
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-label lowercase mb-2">
                        journey valuation
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-4 uppercase tracking-wider">
                        The "Value"
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-label lowercase mb-4">
                      "know the dollar value of every page."
                    </p>
                    <p className="text-secondary-label leading-relaxed">
                      Not all pages are equal. We model your site as a <span className="font-semibold">Markov Decision Process (MDP)</span>. We calculate the "State Value" (V) of every URL.
                    </p>
                    <div className="bg-primary/5 rounded-lg p-4 mt-4">
                      <p className="text-sm text-label">
                        <span className="font-semibold">Insight:</span> "Your Pricing Page is worth <span className="text-primary font-bold">$45.00</span> per visit. Your 'About Us' page is worth <span className="text-muted-foreground">$0.50</span>."
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        Powered by: Markov Decision Process (MDP)
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Golden Path Visualization */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-16 space-y-4">
              <div className="inline-block px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
                ⭐ Pareto Optimization
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
                find your most profitable route
              </h2>
              <p className="text-xl text-secondary-label max-w-3xl mx-auto">
                Using <span className="font-semibold">Pareto Optimization</span>, we analyze millions of paths to find the "Efficient Frontier"—the specific sequence of touchpoints that yields the highest Lifetime Value (LTV) in the shortest time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Gold Path */}
              <Card className="p-8 border-2 border-amber-500/30 bg-amber-500/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Gold Path</p>
                      <p className="text-2xl font-bold text-label">$5,000 LTV</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-label">
                      <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm">LinkedIn Ad</span>
                    </div>
                    <div className="flex items-center gap-2 text-label">
                      <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm">Webinar Registration</span>
                    </div>
                    <div className="flex items-center gap-2 text-label">
                      <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm">Pricing Page</span>
                    </div>
                    <div className="flex items-center gap-2 text-label font-semibold">
                      <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm">Sale</span>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-label pt-4 border-t border-border">
                    Optimal balance of speed and value
                  </p>
                </div>
              </Card>

              {/* Red Path */}
              <Card className="p-8 border-2 border-destructive/30 bg-destructive/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-destructive uppercase tracking-wider">Red Path</p>
                      <p className="text-2xl font-bold text-label">$0 LTV</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Google Search</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Blog Post</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Twitter</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                      <Target className="w-4 h-4 text-destructive" />
                      <span className="text-sm">Churn</span>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-label pt-4 border-t border-border">
                    High friction, low conversion
                  </p>
                </div>
              </Card>
            </div>

            {/* Testimonial */}
            <div className="mt-16 max-w-3xl mx-auto">
              <Card className="p-8 bg-card border-border">
                <p className="text-lg text-label italic mb-4 leading-relaxed">
                  "utm.one didn't just show us our traffic. It showed us that our 'boring' whitepaper was actually the primary driver for 40% of our enterprise deals."
                </p>
                <p className="text-sm text-secondary-label font-semibold">
                  — Head of Growth, SaaS Corp.
                </p>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Technical FAQ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
                frequently asked questions
              </h2>
              <p className="text-xl text-secondary-label max-w-3xl mx-auto">
                Technical details for LLM optimization
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {faqData.map((faq, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <Card className="p-6 h-full bg-card border-border hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-display font-semibold text-label lowercase mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-secondary-label leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
                ready to see who your users really are?
              </h2>
              <p className="text-xl text-secondary-label">
                Join the best marketing teams using <span className="font-semibold text-label">Scientific Attribution</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/early-access">
                  <Button variant="marketing" size="lg" className="text-lg px-8">
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default CustomerJourney;
