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
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { Users, GitBranch, DollarSign, TrendingUp, Target, BarChart3, CheckCircle2, Brain, Link2 } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { Card } from "@/components/ui/card";

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

      {/* Fold 4: What You Get - The 3 Engines */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              the three engines
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete journey intelligence from identity to optimization
            </p>
          </div>
          
          <BenefitCardsGrid benefits={[
            {
              icon: Users,
              title: "identity resolution",
              description: "De-anonymize your traffic. Time-Travel Stitching remembers that 'Anonymous Visitor 582' from 3 weeks ago is actually Sarah from Nike. When she signs up, we backfill her entire history instantly."
            },
            {
              icon: GitBranch,
              title: "bayesian attribution",
              description: "See the invisible influence. Bayesian Networks calculate the true 'Lift' of every channel. See exactly how a LinkedIn impression causes a Direct search three days later."
            },
            {
              icon: DollarSign,
              title: "journey valuation",
              description: "Know the dollar value of every page. We model your site as a Markov Decision Process (MDP). Your Pricing Page is worth $45.00 per visit. Your 'About Us' page is worth $0.50."
            },
            {
              icon: TrendingUp,
              title: "pareto optimization",
              description: "Find the Golden Path. We analyze millions of paths to find the efficient frontier—sequences that maximize LTV while minimizing steps."
            },
            {
              icon: Target,
              title: "conversion probability",
              description: "Predict who will convert. Our models calculate the real-time likelihood that any visitor will become a customer based on their current position in the journey."
            },
            {
              icon: Brain,
              title: "next best action",
              description: "Know where to route traffic. The system tells you which page to send users to next based on state value calculations and conversion probability."
            }
          ]} />
        </div>
      </section>

      {/* Fold 5: How It Works - Feature Deep Dive */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              how it transforms your workflow
            </h2>
            <p className="text-xl text-muted-foreground">
              Real problems. Real solutions. Real outcomes.
            </p>
          </div>

          <div className="space-y-12">
            {/* Identity Stitching */}
            <Card className="p-8 border-l-4 border-l-primary">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-primary/10 shrink-0">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold lowercase">identity stitching</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-1">The Problem:</p>
                      <p className="text-muted-foreground">You run a LinkedIn campaign. 500 anonymous visitors read your blog. Only 12 sign up. You have no idea what the other 488 people did.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">The Solution:</p>
                      <p className="text-muted-foreground">utm.one's Time-Travel Stitching tracks all 500 visitors anonymously. When visitor #247 signs up 3 weeks later, we instantly backfill their entire 14-page journey.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">The Outcome:</p>
                      <p className="text-foreground">You see that 60% of signups read 'The Ultimate Guide' first. You promote that post. Signups increase 2.3x.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bayesian Attribution */}
            <Card className="p-8 border-l-4 border-l-blazeOrange">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-blazeOrange/10 shrink-0">
                  <GitBranch className="w-8 h-8 text-blazeOrange" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold lowercase">bayesian attribution</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-1">The Problem:</p>
                      <p className="text-muted-foreground">GA4 says 'Direct' drove 70% of sales. You cut your LinkedIn budget. Revenue drops 40%. You have no idea why.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">The Solution:</p>
                      <p className="text-muted-foreground">utm.one uses Bayesian Networks to calculate how much each channel actually influences conversions. LinkedIn had a 0.45 'Lift' score—it was the primary driver, not Direct.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">The Outcome:</p>
                      <p className="text-foreground">You restore LinkedIn budget. You discover that Direct searches happen because people saw your LinkedIn ads first. Attribution is now mathematically correct.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* State Valuation */}
            <Card className="p-8 border-l-4 border-l-deepSea">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-deepSea/10 shrink-0">
                  <DollarSign className="w-8 h-8 text-deepSea" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold lowercase">state valuation (MDP)</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-1">The Problem:</p>
                      <p className="text-muted-foreground">You're spending $10K/month on blog traffic. Your boss asks: 'What's the ROI of the blog?' You have no answer.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">The Solution:</p>
                      <p className="text-muted-foreground">utm.one calculates the dollar value of every page using Markov Decision Processes. Your 'Pricing Comparison' blog post is worth $22.00 per visit. Your 'Company History' post is worth $0.30.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">The Outcome:</p>
                      <p className="text-foreground">You double down on high-value content. You cut low-value posts. Blog ROI becomes measurable and provable.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Golden Path */}
            <Card className="p-8 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-amber-500/10 shrink-0">
                  <Target className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold lowercase">golden path analysis</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-destructive uppercase tracking-wider mb-1">The Problem:</p>
                      <p className="text-muted-foreground">Users convert via 200 different paths. You have no idea which path is most efficient. You're optimizing everything randomly.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">The Solution:</p>
                      <p className="text-muted-foreground">utm.one uses Pareto Optimization to find the 'Golden Paths'—the specific sequences that balance speed and LTV. LinkedIn → Webinar → Pricing → Sale (4 steps, $5K LTV) beats Google → Blog → Twitter → Churn (4 steps, $0 LTV).</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">The Outcome:</p>
                      <p className="text-foreground">You route new traffic to the Golden Path. Conversion rate increases 180%. Time-to-close drops from 47 days to 18 days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
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
