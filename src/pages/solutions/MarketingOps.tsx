import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Settings, FileText, CheckCircle2, AlertCircle, Layers, Lock, BarChart3 } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { HeroFloatingShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { PainPointCard } from "@/components/solutions/PainPointCard";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";

const MarketingOps = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Marketing Ops"
        description="Governance, without the noise. utm.one enforces the structure your org needs — automatically, quietly, consistently."
        canonical="https://utm.one/solutions/marketing-ops"
        keywords={['marketing operations', 'UTM governance', 'campaign governance', 'marketing ops tools', 'data quality']}
      />
      <WebPageSchema 
        name="utm.one for Marketing Ops"
        description="Governance, without the noise. utm.one enforces the structure your org needs — automatically, quietly, consistently."
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
      <section className="relative py-32 bg-gradient-to-br from-background via-wildSand/30 to-background overflow-hidden">
        <HeroFloatingShapes />
        <HeroGlow />
        <DiagonalAccent position="top-left" />
        <DiagonalAccent position="bottom-right" />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              Governance, Without the Noise
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one enforces the structure your org needs — automatically, quietly, consistently.
            </p>
            <div className="pt-4">
              <Link to="/early-access">
                <Button size="lg" className="bg-blazeOrange hover:bg-blazeOrange/90 text-white text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02]">
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: Day in the Life */}
      <section className="relative py-24 md:py-32 bg-wildSand overflow-hidden">
        <DotPattern />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              Report Day Without the Panic
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Clean data means clean dashboards
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Before/After Comparison */}
            <div className="space-y-6">
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
                <div className="text-xs uppercase font-semibold text-destructive mb-4">before: messy GA4</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span>utm_source</span><span className="text-muted-foreground">847 clicks</span></div>
                  <div className="flex justify-between"><span>UTM_Source</span><span className="text-muted-foreground">312 clicks</span></div>
                  <div className="flex justify-between"><span>utm-source</span><span className="text-muted-foreground">156 clicks</span></div>
                  <div className="flex justify-between"><span>utmsource</span><span className="text-muted-foreground">89 clicks</span></div>
                  <div className="flex justify-between"><span>(unknown)</span><span className="text-muted-foreground">1,203 clicks</span></div>
                </div>
                <div className="mt-4 text-xs text-destructive font-semibold">
                  ❌ 5 variations = broken reports
                </div>
              </div>
              
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
                <div className="text-xs uppercase font-semibold text-primary mb-4">after: clean utm.one</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span>utm_source</span><span className="text-primary font-semibold">2,607 clicks</span></div>
                  <div className="flex justify-between"><span>utm_medium</span><span className="text-primary font-semibold">2,607 clicks</span></div>
                  <div className="flex justify-between"><span>utm_campaign</span><span className="text-primary font-semibold">2,607 clicks</span></div>
                </div>
                <div className="mt-4 text-xs text-primary font-semibold">
                  ✓ 100% consistent = reliable insights
                </div>
              </div>
            </div>

            {/* Clean-Track Rules */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="text-sm font-semibold text-label mb-4">Clean-Track Governance</div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Lowercase enforcement</div>
                    <div className="text-xs text-muted-foreground">All UTMs auto-converted to lowercase</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Required fields</div>
                    <div className="text-xs text-muted-foreground">No incomplete UTMs allowed</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Template validation</div>
                    <div className="text-xs text-muted-foreground">Matches approved naming patterns</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">Data quality score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 3: What You Get */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              What You Get
            </h2>
            <p className="text-xl text-muted-foreground">
              Quality becomes the default.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Workspace governance",
              "Naming systems",
              "Approval flows",
              "Syntax rules",
              "Audit logs",
              "Monthly clean-track audits",
              "Consistent UTMs across teams",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-deepSea flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 4: Mapped Features */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-wildSand/50 to-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              Built for Marketing Ops
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track"
              description="The backbone of your tracking discipline"
              color="blazeOrange"
              delay={0}
            />
            <FeatureMappedCard
              icon={Shield}
              title="Enterprise Control"
              description="Roles, permissions, approvals"
              color="deepSea"
              delay={0.1}
            />
            <FeatureMappedCard
              icon={Lock}
              title="Link Governance"
              description="Ownership, lifespan, history"
              color="primary"
              delay={0.2}
            />
            <FeatureMappedCard
              icon={FileText}
              title="Naming System"
              description="A standard the entire team follows"
              color="blazeOrange"
              delay={0.3}
            />
            <FeatureMappedCard
              icon={Settings}
              title="UTM Builder"
              description="Zero-error parameters"
              color="deepSea"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Fold 5: Workflow */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-6 lowercase">
              Your Workflow, Simplified
            </h2>
            <p className="text-xl text-white/70">
              Ops becomes the silent force behind clean data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 relative max-w-4xl mx-auto">
            {[
              { icon: FileText, label: "Define", step: "01" },
              { icon: Lock, label: "Enforce", step: "02" },
              { icon: BarChart3, label: "Monitor", step: "03" },
            ].map((workflow, index) => (
              <div key={index} className="relative">
                <InteractiveWorkflowCard
                  icon={workflow.icon}
                  label={workflow.label}
                  stepNumber={workflow.step}
                  delay={index * 0.15}
                />
                <AnimatedConnectingLine index={index} total={3} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="Ready to Enforce Quality?"
        subheadline="Join marketing ops teams who trust utm.one for governance without friction."
        primaryCTA="Explore utm.one for Marketing Ops"
      />

      <Footer />
    </div>
  );
};

export default MarketingOps;
