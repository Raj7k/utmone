import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { Shield, Settings, FileText, CheckCircle2, Layers, Lock, BarChart3, Users } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const MarketingOps = () => {
  const faqs = [
    {
      question: "Can I enforce naming conventions across our entire marketing team?",
      answer: "Yes. Clean-Track lets you define templates and validation rules. Team members can't create links that don't match your approved UTM structure. Lowercase enforcement, required fields, and pattern matching are all configurable."
    },
    {
      question: "How do I migrate existing links without breaking campaigns?",
      answer: "You can bulk import existing links with their UTM parameters. utm.one will normalize the UTMs to your new Clean-Track standard while preserving the short codes, so nothing breaks."
    },
    {
      question: "What if someone creates a link outside utm.one?",
      answer: "You can set governance rules to require utm.one for all campaign links. Plus, utm.one provides a browser extension and Slack/Teams integration so creating compliant links is easier than going rogue."
    },
    {
      question: "Can I audit who created which links?",
      answer: "Yes. Every link includes creator info, timestamps, and modification history. You can filter by user, date, campaign, or UTM parameter to audit link creation across the org."
    },
    {
      question: "How does utm.one handle multiple workspaces?",
      answer: "Each workspace has its own governance rules, domains, and team members. Perfect for agencies managing multiple clients or enterprises with regional teams."
    },
    {
      question: "Will this slow down our marketers?",
      answer: "No. Templates auto-fill UTM parameters, so creating a compliant link takes 10 seconds. Faster than manually typing UTMs into a spreadsheet."
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col relative overflow-hidden bg-obsidian-bg">
      <div className="obsidian-noise" />
      <div className="obsidian-lighting" />
      <SEO 
        title="utm.one for Marketing Ops"
        description="Governance without friction. utm.one enforces the structure your org needs—automatically, quietly, consistently."
        canonical="https://utm.one/solutions/marketing-ops"
        keywords={['marketing operations', 'UTM governance', 'campaign governance', 'marketing ops tools', 'data quality']}
      />
      <WebPageSchema 
        name="utm.one for Marketing Ops"
        description="Governance without friction. utm.one enforces the structure your org needs—automatically, quietly, consistently."
        url="https://utm.one/solutions/marketing-ops"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Marketing Ops', url: 'https://utm.one/solutions/marketing-ops' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              governance without friction.
            </h1>
            <p className="text-lg md:text-xl max-w-[640px] mx-auto font-sans text-muted-foreground">
              utm.one enforces the structure your org needs—automatically, quietly, consistently. no more manual audits. no more broken reports.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free for 14 days • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Moment Story */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the audit that revealed your data quality nightmare"
            timestamp="Thursday, 3:12 PM"
            scenario="Your CMO wants a report on Q4 campaign performance. You pull GA4 data. 47 variations of 'utm_source' appear across 12 teams. 'linkedin', 'LinkedIn', 'LINKEDIN', 'linked-in', 'lnkdin'—all variations of the same source, but GA4 treats them as separate. 38% of traffic is '(not set)' because someone forgot UTM parameters. The report is worthless."
            visual={
              <div className="rounded-xl p-6 font-mono text-sm bg-card border-2 border-destructive/30">
                <div className="text-destructive font-semibold mb-3">❌ Your GA4 Data Nightmare:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs mb-2 text-muted-foreground">utm_source variations</div>
                    <div className="space-y-1 text-xs text-foreground">
                      <div>linkedin (8,234 clicks)</div>
                      <div>LinkedIn (3,891 clicks)</div>
                      <div>LINKEDIN (1,203 clicks)</div>
                      <div>linked-in (487 clicks)</div>
                      <div>lnkdin (156 clicks)</div>
                      <div>LI (89 clicks)</div>
                      <div>(not set) (12,847 clicks)</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs mb-2 text-muted-foreground">utm_medium variations</div>
                    <div className="space-y-1 text-xs text-foreground">
                      <div>cpc (6,123 clicks)</div>
                      <div>CPC (2,456 clicks)</div>
                      <div>paid (1,890 clicks)</div>
                      <div>paid-social (734 clicks)</div>
                      <div>(not set) (15,704 clicks)</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  Total data loss: 46%. CMO report impossible to deliver.
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase text-foreground">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl mt-4 max-w-[640px] mx-auto font-sans text-muted-foreground">
              chaos vs governance in one comparison.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="47 variations"
            afterTitle="1 standard"
            beforeContent={
              <div className="space-y-3">
                <div className="rounded-lg p-4 font-mono text-xs bg-card border border-border">
                  <div className="text-destructive font-semibold mb-2 text-sm">utm_source chaos:</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>linkedin (8,234)</div>
                    <div>LinkedIn (3,891)</div>
                    <div>LINKEDIN (1,203)</div>
                    <div>linked-in (487)</div>
                    <div>lnkdin (156)</div>
                    <div>LI (89)</div>
                    <div>(not set) (12,847)</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border text-destructive text-xs">
                    46% data loss
                  </div>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3">
                <div className="rounded-lg p-4 font-mono text-xs bg-primary/10">
                  <div className="font-semibold mb-2 text-sm text-primary">utm_source clean:</div>
                  <div className="space-y-1 text-foreground">
                    <div>linkedin (26,908)</div>
                  </div>
                  <div className="mt-3 pt-3 text-xs border-t border-primary/20 text-primary">
                    100% attribution ✓
                  </div>
                </div>
              </div>
            }
            caption="Same campaigns. 100% consistent UTMs = 100% reliable reports."
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase text-foreground">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground font-sans">
              Quality becomes the default.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={[
            {
              icon: Shield,
              title: "workspace governance",
              description: "Roles, permissions, approvals. Control without micromanaging."
            },
            {
              icon: Layers,
              title: "naming templates",
              description: "Enforce structure. Team can't create non-compliant links."
            },
            {
              icon: CheckCircle2,
              title: "approval flows",
              description: "Optional review queue before links go live. Your choice."
            },
            {
              icon: Settings,
              title: "syntax rules",
              description: "Lowercase enforcement, required fields, pattern matching."
            },
            {
              icon: FileText,
              title: "audit logs",
              description: "Who created what, when. Full history for every link."
            },
            {
              icon: BarChart3,
              title: "quality scoring",
              description: "Monthly Clean-Track audits show data quality trends."
            }
          ]} />
        </div>
      </section>

      {/* Fold 5: Your Workflow Transformed */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-6xl mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mb-4">
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
                label="set governance rules"
                stepNumber="01"
                delay={0}
              />
              <AnimatedConnectingLine index={0} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Users}
                label="team creates links"
                stepNumber="02"
                delay={0.2}
              />
              <AnimatedConnectingLine index={1} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={CheckCircle2}
                label="auto-validation"
                stepNumber="03"
                delay={0.4}
              />
              <AnimatedConnectingLine index={2} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={FileText}
                label="clean reports"
                stepNumber="04"
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fold 6: Growth Loop - ROI Calculator */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase mb-4">
              calculate your data quality ROI
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              How much time does your team waste cleaning messy UTMs?
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Fold 7: Feature Cards */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase text-foreground">
              built for marketing ops
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Layers}
              title="clean-track"
              description="The backbone of your tracking discipline"
              color="blazeOrange"
              delay={0}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={Shield}
              title="governance"
              description="Roles, permissions, approvals"
              color="deepSea"
              delay={0.1}
              href="/features/governance"
            />
            <FeatureMappedCard
              icon={Lock}
              title="link immunity"
              description="Ownership, lifespan, history"
              color="primary"
              delay={0.2}
              href="/features/link-immunity"
            />
            <FeatureMappedCard
              icon={FileText}
              title="naming system"
              description="A standard the entire team follows"
              color="blazeOrange"
              delay={0.3}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={Settings}
              title="utm builder"
              description="Zero-error parameters"
              color="deepSea"
              delay={0.4}
              href="/features/utm-builder"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="analytics"
              description="Trustworthy data, always"
              color="primary"
              delay={0.5}
              href="/features/analytics"
            />
          </div>
        </div>
      </section>

      {/* Fold 8: FAQs */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="marketing ops teams" faqs={faqs} />
        </div>
      </section>

      {/* Fold 9: CTA */}
      <PremiumCTASection
        headline="ready to enforce quality?"
        subheadline="join marketing ops teams who trust utm.one for governance without friction."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default MarketingOps;