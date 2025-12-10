import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { GitMerge, Users, DollarSign, CheckCircle2, BarChart3, Shield, Settings, FileText } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { preserveAcronyms as p } from "@/utils/textFormatter";

const RevOps = () => {
  const faqs = [
    {
      question: "How does utm.one create a single source of truth across Marketing, Sales, and CS?",
      answer: "Every team creates links with the same UTM taxonomy. Marketing's campaign links, Sales' outbound links, and CS's renewal links all follow the same standard. Your funnel reports finally match."
    },
    {
      question: "Can we track full customer journey from first click to renewal?",
      answer: "Yes. utm.one tracks attribution touchpoints from initial engagement through conversion, expansion, and renewal. See which campaigns drive not just MQLs, but ARR."
    },
    {
      question: "How do we prevent teams from breaking the attribution model?",
      answer: "Template enforcement. Sales can't create links without utm_campaign. Marketing can't skip utm_content. The taxonomy is baked into the workflow, not a training doc everyone ignores."
    },
    {
      question: "What if Sales and Marketing disagree on attribution?",
      answer: "utm.one supports multiple attribution models (first-touch, last-touch, multi-touch, custom weighting). Run the same data through both models. Show Sales first-touch. Show Marketing multi-touch. Both are true."
    },
    {
      question: "How does this integrate with our RevOps stack?",
      answer: "Native integrations with HubSpot, Salesforce, Gong, Chorus, Outreach. Push click data to CRM, pull conversion data back. Your pipeline reports show real attribution, not guesswork."
    },
    {
      question: "Can we forecast revenue impact before campaigns launch?",
      answer: "Yes. Predictive Analytics feature forecasts clicks, conversions, and pipeline contribution based on historical campaign performance. Run 'what-if' scenarios before you spend."
    }
  ];

  const benefits = [
    {
      icon: GitMerge,
      title: "one source of truth",
      description: "Marketing, Sales, and CS all use the same UTM taxonomy. Your funnel reports finally match.",
      color: "primary"
    },
    {
      icon: Users,
      title: "full-funnel visibility",
      description: "Track customer journey from first click to renewal. See which campaigns drive ARR, not just MQLs.",
      color: "blazeOrange"
    },
    {
      icon: DollarSign,
      title: "revenue attribution",
      description: "Attribute pipeline and revenue back to specific campaigns, channels, and content pieces.",
      color: "deepSea"
    },
    {
      icon: BarChart3,
      title: "predictive forecasting",
      description: "Forecast campaign ROI before launch. Model pipeline impact with confidence intervals.",
      color: "primary"
    },
    {
      icon: Shield,
      title: "enforced governance",
      description: "Templates prevent teams from breaking the taxonomy. No more 'oops, I forgot UTMs' in the pipeline report.",
      color: "blazeOrange"
    },
    {
      icon: CheckCircle2,
      title: "crm-native attribution",
      description: "Push click data to Salesforce/HubSpot. See campaign influence on closed-won deals.",
      color: "deepSea"
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col relative overflow-hidden bg-obsidian-bg">
      <div className="obsidian-noise" />
      <div className="obsidian-lighting" />
      <SEO 
        title="utm.one for RevOps"
        description="One source of truth from click to close. utm.one gives RevOps teams full-funnel visibility with clean attribution across Marketing, Sales, and CS."
        canonical="https://utm.one/solutions/revops"
        keywords={['revenue operations', 'full-funnel attribution', 'pipeline tracking', 'revenue attribution', 'CRM integration']}
      />
      <WebPageSchema 
        name="utm.one for RevOps"
        description="One source of truth from click to close. utm.one gives RevOps teams full-funnel visibility with clean attribution across Marketing, Sales, and CS."
        url="https://utm.one/solutions/revops"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'RevOps', url: 'https://utm.one/solutions/revops' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero with RetroGradientMesh */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter hero-gradient leading-[1.05]">
              one source of truth. click to close.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto font-sans">
              utm.one gives RevOps teams full-funnel visibility with clean attribution across Marketing, Sales, and Customer Success.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>CRM-native • Full-funnel • Revenue attribution</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: "The Moment" Story Card */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the board meeting where three funnels told three stories"
            timestamp="Thursday, Q4 Board Meeting"
            scenario="The board asks: 'What's driving pipeline?' Marketing shows their attribution model (multi-touch, campaign-heavy). Sales shows theirs (last-touch, SDR-heavy). Finance shows theirs (spreadsheet-based, who knows). All three use the same CRM data. None agree on which channels matter. The board loses confidence."
            visual={
              <div className="bg-card border-2 border-destructive/30 rounded-xl p-6 font-mono text-sm">
                <div className="text-destructive font-semibold mb-3">❌ Your Three Pipeline Reports:</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Marketing (Multi-Touch):</div>
                    <div className="text-foreground">Social: 42% of pipeline</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Sales (Last-Touch):</div>
                    <div className="text-foreground">SDR Outbound: 67% of pipeline</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Finance (Spreadsheet):</div>
                    <div className="text-foreground">Unknown: 51% of pipeline</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  Same CRM. Three stories. Zero confidence.
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After Comparison */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto font-sans">
              same teams. different alignment.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="marketing, sales, cs all use different attribution"
            afterTitle="one taxonomy, every team"
            beforeContent={
              <div className="space-y-3 font-mono text-sm">
                <div className="text-muted-foreground">Marketing: custom UTMs (inconsistent)</div>
                <div className="text-muted-foreground">Sales: manual entry (missing)</div>
                <div className="text-muted-foreground">CS: no tracking at all</div>
                <div className="text-xs text-destructive mt-4">
                  Funnel leakage at every handoff. Pipeline attribution is guesswork.
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3 font-mono text-sm">
                <div className="text-foreground">Marketing: utm.one links (validated)</div>
                <div className="text-foreground">Sales: utm.one links (enforced)</div>
                <div className="text-foreground">CS: utm.one links (tracked)</div>
                <div className="text-xs mt-4 text-primary">
                  Every touchpoint tracked. Full customer journey visible. Revenue attribution clear.
                </div>
              </div>
            }
            caption="Clean taxonomy means Marketing, Sales, and CS finally agree"
          />
        </div>
      </section>

      {/* Fold 4: What You Get - Visual Benefit Cards */}
      <section className="py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-foreground">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground font-sans">
              The attribution infrastructure your board deserves.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={benefits} />
        </div>
      </section>

      {/* Fold 5: Your Workflow Transformed */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-6xl mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              your workflow, transformed
            </h2>
            <p className="text-lg text-white/70 font-sans">
              How your day changes with utm.one
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Settings}
                label="connect tools"
                stepNumber="01"
                delay={0}
              />
              <AnimatedConnectingLine index={0} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={GitMerge}
                label="unify taxonomy"
                stepNumber="02"
                delay={0.2}
              />
              <AnimatedConnectingLine index={1} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={BarChart3}
                label="reconcile funnels"
                stepNumber="03"
                delay={0.4}
              />
              <AnimatedConnectingLine index={2} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={FileText}
                label="generate reports"
                stepNumber="04"
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fold 6: Role-Specific FAQs */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="revops" faqs={faqs} />
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="ready to align your funnel?"
        subheadline="join RevOps teams who replaced spreadsheet reconciliation with real revenue attribution."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default RevOps;