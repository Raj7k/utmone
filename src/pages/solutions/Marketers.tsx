import { Link as LinkIcon, Settings, QrCode, BarChart3, Shield, CheckCircle2, AlertCircle, Layers, FileText, Zap, TrendingUp } from "lucide-react";
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
import { CTAButton } from "@/components/ui/CTAButton";

const Marketers = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Marketers"
        description="Campaigns work better when links do. utm.one gives marketers clean links, clean UTMs, clean QR codes, and clean reporting — all without slowing you down."
        canonical="https://utm.one/solutions/marketers"
        keywords={['marketing automation', 'campaign tracking', 'UTM parameters', 'link management for marketers', 'marketing analytics']}
      />
      <WebPageSchema 
        name="utm.one for Marketers"
        description="Campaigns work better when links do. utm.one gives marketers clean links, clean UTMs, clean QR codes, and clean reporting."
        url="https://utm.one/solutions/marketers"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Marketers', url: 'https://utm.one/solutions/marketers' }
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
              Campaigns Work Better When Links Do
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives marketers clean links, clean UTMs, clean QR codes, and clean reporting — all without slowing you down.
            </p>
            <CTAButton href="/early-access" variant="primary" pulse={true}>
              Start Building Campaigns →
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Fold 2: Day in the Life */}
      <section className="relative py-24 md:py-32 bg-wildSand overflow-hidden">
        <DotPattern />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              Monday Morning Campaign Launch
            </h2>
            <p className="text-xl text-muted-foreground italic">
              From idea to live campaign in under 3 minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">8:30 AM</div>
                  <div className="text-sm text-foreground font-medium">Create link with clean UTMs</div>
                  <div className="text-xs text-muted-foreground mt-1">utm_source=linkedin • utm_medium=cpc • utm_campaign=q4-webinar</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">8:31 AM</div>
                  <div className="text-sm text-foreground font-medium">Generate branded QR code</div>
                  <div className="text-xs text-muted-foreground mt-1">Brand colors applied • High-res PNG ready</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">8:32 AM</div>
                  <div className="text-sm text-foreground font-medium">Shared to 3 channels</div>
                  <div className="text-xs text-muted-foreground mt-1">LinkedIn ad • Email campaign • Event page</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="text-sm font-semibold text-label">Campaign Link Created</div>
                <div className="text-xs text-primary">✓ Active</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Short URL</div>
                <div className="font-mono text-sm text-primary bg-primary/5 p-2 rounded">utm.one/q4-webinar</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">UTM Parameters</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between"><span>source:</span><span className="text-primary">linkedin</span></div>
                  <div className="flex justify-between"><span>medium:</span><span className="text-primary">cpc</span></div>
                  <div className="flex justify-between"><span>campaign:</span><span className="text-primary">q4-webinar</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 pt-3 border-t border-border">
                <CheckCircle2 className="w-4 h-4" />
                <span>Clean-Track Validated</span>
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
              Clarity → Trust → Performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Predictable UTMs",
              "Semantic links",
              "Branded QR codes",
              "Clear preview cards",
              "Campaign-level analytics",
              "Clean attribution",
              "Workspace governance that never gets in your way",
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
              Built for Marketing Teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={LinkIcon}
              title="Short Links"
              description="Easy to share, easy to trust"
              color="blazeOrange"
              delay={0}
            />
            <FeatureMappedCard
              icon={Settings}
              title="UTM Builder"
              description="Zero-error parameters"
              color="deepSea"
              delay={0.1}
            />
            <FeatureMappedCard
              icon={QrCode}
              title="QR Generator"
              description="Print-ready and trackable"
              color="primary"
              delay={0.2}
            />
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track"
              description="Every campaign follows the same standard"
              color="blazeOrange"
              delay={0.3}
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="Analytics"
              description="The top metrics that actually matter"
              color="deepSea"
              delay={0.4}
            />
            <FeatureMappedCard
              icon={Shield}
              title="Enterprise Control"
              description="Governance without friction"
              color="primary"
              delay={0.5}
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
              All from one clean workspace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {[
              { icon: FileText, label: "Build Campaign", step: "01" },
              { icon: Zap, label: "Generate Links", step: "02" },
              { icon: TrendingUp, label: "Share", step: "03" },
              { icon: BarChart3, label: "Measure", step: "04" },
            ].map((workflow, index) => (
              <div key={index} className="relative">
                <InteractiveWorkflowCard
                  icon={workflow.icon}
                  label={workflow.label}
                  stepNumber={workflow.step}
                  delay={index * 0.15}
                />
                <AnimatedConnectingLine index={index} total={4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="Ready to Transform Your Marketing?"
        subheadline="Join marketing teams who trust utm.one for clean links and clear attribution."
        primaryCTA="Start Free Today →"
      />

      <Footer />
    </div>
  );
};

export default Marketers;
