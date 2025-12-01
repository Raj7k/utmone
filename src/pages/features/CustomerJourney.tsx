import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { EnginesStackingSection } from "@/components/landing/EnginesStackingSection";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { ProductMockup } from "@/components/product/ProductMockup";
import { CheckCircle2, ArrowRight, Users, GitBranch, DollarSign, Target, BarChart3, Brain, Link2 } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const CustomerJourney = () => {
  const faqs = [
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
    <div className="min-h-screen bg-background">
      <SEO 
        title="Customer Journey Analytics & Multi-Touch Attribution - utm.one"
        description="Stop tracking clicks. Start engineering journeys with Bayesian Attribution, Identity Resolution, and Markov State Valuation."
        canonical="https://utm.one/features/customer-journey"
        keywords={['customer journey analytics', 'multi-touch attribution', 'identity resolution', 'bayesian attribution', 'journey mapping', 'conversion tracking']}
      />
      <WebPageSchema 
        name="Customer Journey Analytics - utm.one"
        description="Stop tracking clicks. Start engineering journeys with Bayesian Attribution, Identity Resolution, and Markov State Valuation."
        url="https://utm.one/features/customer-journey"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Features', url: 'https://utm.one/#features' },
          { name: 'Customer Journey', url: 'https://utm.one/features/customer-journey' }
        ]}
      />
      <LLMSchemaGenerator type="software" data={{}} />
      <LLMSchemaGenerator type="faq" data={{ questions: faqs }} />
      
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero with RetroGradientMesh */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <SocialProofCounter role="marketers" variant="minimal" />
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              stop tracking clicks. start engineering journeys.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              Most attribution tools tell you what happened <span className="italic">last</span>. utm.one uses Bayesian Inference and Identity Stitching to reveal the entire causal chain—from the first anonymous visit to the final enterprise contract.
            </p>
            <div className="pt-4">
              <CTAButton href="/dashboard/attribution" variant="primary" pulse>
                see your journey graph
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free for 14 days • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: "The Lie of Last Click" Story Card */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the lie of 'last click'"
            timestamp="Reality Check"
            scenario="Standard analytics give 100% of the credit to the last link a user clicked. This ignores the 10 other touchpoints that actually built the trust. It's like giving a gold medal to the goalkeeper and ignoring the rest of the team."
            visual={
              <div className="bg-card border-2 border-destructive rounded-xl p-6 font-mono text-sm">
                <div className="text-destructive font-semibold mb-3">❌ Last-Click Attribution:</div>
                <div className="space-y-3">
                  <div className="text-muted-foreground text-xs">User Journey:</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 opacity-40">
                      <span>1. LinkedIn Ad</span>
                      <span className="text-destructive">(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                      <span>2. Blog Post</span>
                      <span className="text-destructive">(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                      <span>3. Webinar</span>
                      <span className="text-destructive">(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40">
                      <span>4. Pricing Page</span>
                      <span className="text-destructive">(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <span>5. Direct → Sale</span>
                      <span className="text-primary">(100% credit ✓)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  90% of the real influence is invisible.
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After Comparison */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto">
              same customer. two different attribution realities.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="standard attribution"
            afterTitle="utm.one journey analytics"
            beforeContent={
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-4 font-mono text-xs">
                  <div className="text-destructive font-semibold mb-3">Last-Click Model:</div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Direct Traffic</span>
                      <span className="text-foreground">100% credit</span>
                    </div>
                    <div className="flex justify-between opacity-50">
                      <span>LinkedIn (ignored)</span>
                      <span>0%</span>
                    </div>
                    <div className="flex justify-between opacity-50">
                      <span>Blog (ignored)</span>
                      <span>0%</span>
                    </div>
                    <div className="flex justify-between opacity-50">
                      <span>Webinar (ignored)</span>
                      <span>0%</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-destructive pt-3 border-t border-border">
                    Result: You defund the channels that actually work.
                  </div>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 font-mono text-xs">
                  <div className="text-primary font-semibold mb-3">Bayesian Attribution:</div>
                  <div className="space-y-2 text-foreground">
                    <div className="flex justify-between">
                      <span>LinkedIn Ad</span>
                      <span className="text-primary font-semibold">32% credit</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blog Post</span>
                      <span className="text-primary font-semibold">28% credit</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Webinar</span>
                      <span className="text-primary font-semibold">25% credit</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Direct</span>
                      <span className="text-primary font-semibold">15% credit</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-primary pt-3 border-t border-primary/20">
                    Result: You see the true causal chain. ✓
                  </div>
                </div>
              </div>
            }
            caption="Same customer journey. Bayesian models reveal the hidden influence that Last-Click attribution misses."
          />
        </div>
      </section>

      {/* Fold 4: The Three Engines - Stacking Cards */}
      <EnginesStackingSection />

      {/* Fold 5: How It Works - Visual Cards */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 lowercase">
              how it transforms your workflow
            </h2>
            <p className="text-xl text-muted-foreground max-w-[640px] mx-auto">
              Real problems. Real solutions. Real outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Identity Stitching Card */}
            <div className="group bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <ProductMockup type="identity-stitching" size="large" />
              </div>
              <div className="space-y-3 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold lowercase text-label">identity resolution</h3>
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Problem:</p>
                    <p className="text-sm text-muted-foreground">Anonymous visitors with no journey history</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Solution:</p>
                    <p className="text-sm text-muted-foreground">Time-Travel Stitching backfills entire history</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Outcome:</p>
                    <p className="text-sm text-foreground font-medium">2.3x increase in attribution accuracy</p>
                  </div>
                </div>
                <a href="/features/identity-resolution" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bayesian Attribution Card */}
            <div className="group bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <ProductMockup type="attribution-graph" size="large" />
              </div>
              <div className="space-y-3 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold lowercase text-label">bayesian attribution</h3>
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Problem:</p>
                    <p className="text-sm text-muted-foreground">Last-click gives 100% credit to wrong channel</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Solution:</p>
                    <p className="text-sm text-muted-foreground">Probabilistic lift models show true influence</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Outcome:</p>
                    <p className="text-sm text-foreground font-medium">Stop defunding channels that work</p>
                  </div>
                </div>
                <a href="/features/bayesian-attribution" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Journey Valuation Card */}
            <div className="group bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <ProductMockup type="state-value" size="large" />
              </div>
              <div className="space-y-3 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold lowercase text-label">journey valuation</h3>
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Problem:</p>
                    <p className="text-sm text-muted-foreground">No idea which pages drive revenue</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Solution:</p>
                    <p className="text-sm text-muted-foreground">Markov models calculate page value in dollars</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Outcome:</p>
                    <p className="text-sm text-foreground font-medium">Optimize high-value paths first</p>
                  </div>
                </div>
                <a href="/features/journey-valuation" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Golden Path Card */}
            <div className="group bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <ProductMockup type="dashboard" size="large" />
              </div>
              <div className="space-y-3 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold lowercase text-label">golden path discovery</h3>
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Problem:</p>
                    <p className="text-sm text-muted-foreground">Thousands of paths, no clear winner</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Solution:</p>
                    <p className="text-sm text-muted-foreground">Pareto optimization finds efficient frontier</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Outcome:</p>
                    <p className="text-sm text-foreground font-medium">Maximize LTV, minimize friction</p>
                  </div>
                </div>
                <a href="/features/customer-journey#golden-path" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 6: Interactive Workflow */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-6xl mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase text-white">
              the workflow in action
            </h2>
            <p className="text-xl text-white/80 max-w-[640px] mx-auto">
              From anonymous visitor to attributed customer in 4 steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <div className="relative">
              <InteractiveWorkflowCard
                stepNumber="01"
                label="visitor arrives anonymously"
                icon={Link2}
                delay={0}
              />
              <AnimatedConnectingLine index={0} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                stepNumber="02"
                label="identity resolution on signup"
                icon={Users}
                delay={0.2}
              />
              <AnimatedConnectingLine index={1} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                stepNumber="03"
                label="bayesian attribution runs"
                icon={GitBranch}
                delay={0.4}
              />
              <AnimatedConnectingLine index={2} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                stepNumber="04"
                label="golden path identified"
                icon={Target}
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fold 7: Feature Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              built for growth teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Link2}
              title="short links"
              description="Clean, trackable links for every campaign"
              color="blazeOrange"
              delay={0}
              href="/features/short-links"
            />
            <FeatureMappedCard
              icon={Brain}
              title="attribution models"
              description="Bayesian, Markov, and traditional models"
              color="deepSea"
              delay={0.1}
              href="/features/attribution-graph"
            />
            <FeatureMappedCard
              icon={DollarSign}
              title="page valuation"
              description="Know the dollar value of every URL"
              color="primary"
              delay={0.2}
              href="/features/predictive-analytics"
            />
            <FeatureMappedCard
              icon={Target}
              title="golden paths"
              description="Find the optimal conversion sequences"
              color="blazeOrange"
              delay={0.3}
              href="/features/predictive-analytics"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="analytics"
              description="Real-time journey visualization"
              color="deepSea"
              delay={0.4}
              href="/features/analytics"
            />
            <FeatureMappedCard
              icon={Users}
              title="identity graph"
              description="Cross-device visitor tracking"
              color="primary"
              delay={0.5}
              href="/features/analytics"
            />
          </div>
        </div>
      </section>

      {/* Fold 8: FAQ Section */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ
            role="journey analytics"
            faqs={faqs}
          />
        </div>
      </section>

      {/* Fold 9: Premium CTA */}
      <PremiumCTASection
        headline="ready to see who your users really are?"
        subheadline="Join the best marketing teams using Scientific Attribution."
        primaryCTA="start free trial →"
        secondaryCTA="book a demo"
        secondaryCTALink="/pricing"
      />

      <Footer />
    </div>
  );
};

export default CustomerJourney;
