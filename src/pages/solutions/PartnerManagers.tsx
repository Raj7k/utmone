import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon, QrCode, BarChart3, CheckCircle2, AlertCircle, Layers, Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
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

const PartnerManagers = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Partner Managers"
        description="Clear attribution, zero manual work. utm.one makes partner programs easier to run — with clean links, clean QR, and clean reporting."
        canonical="https://utm.one/solutions/partner-managers"
        keywords={['partner management', 'affiliate tracking', 'partner attribution', 'referral tracking', 'partner program software']}
      />
      <WebPageSchema 
        name="utm.one for Partner Managers"
        description="Clear attribution, zero manual work. utm.one makes partner programs easier to run — with clean links, clean QR, and clean reporting."
        url="https://utm.one/solutions/partner-managers"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Partner Managers', url: 'https://utm.one/solutions/partner-managers' }
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
              Clear Attribution, Zero Manual Work
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one makes partner programs easier to run — with clean links, clean QR, and clean reporting.
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
              Partner Onboarding in 60 Seconds
            </h2>
            <p className="text-xl text-muted-foreground italic">
              From invite to first commission in under a minute
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">0:00</div>
                  <div className="text-sm text-foreground font-medium">Send email invite</div>
                  <div className="text-xs text-muted-foreground">partner@company.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">0:30</div>
                  <div className="text-sm text-foreground font-medium">Partner accepts & creates first link</div>
                  <div className="text-xs text-muted-foreground">utm.one/partner-acme</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">0:60</div>
                  <div className="text-sm text-foreground font-medium">First click tracked & attributed</div>
                  <div className="text-xs text-muted-foreground">Commission calculated automatically</div>
                </div>
              </div>
            </div>

            {/* Partner Dashboard Visual */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="text-sm font-semibold text-label">Acme Partner Portal</div>
                <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-semibold">ACTIVE</div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">This Month</div>
                  <div className="text-3xl font-bold text-primary">$2,340</div>
                  <div className="text-xs text-muted-foreground">earned from 47 conversions</div>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Clicks</span>
                    <span className="font-semibold text-foreground">1,283</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Conversions</span>
                    <span className="font-semibold text-foreground">47</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold text-primary">3.7%</span>
                  </div>
                </div>
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
              Partners get clarity. You get peace of mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Partner-specific links",
              "QR codes for offline distribution",
              "Clean attribution",
              "Signup + conversion tracking",
              "Payout history",
              "Partner dashboards",
              "One-click reporting",
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
              Built for Partner Teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Users}
              title="Partner Program"
              description="Links + QR + attribution"
              color="blazeOrange"
              delay={0}
            />
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track"
              description="Every partner follows the same tracking rules"
              color="deepSea"
              delay={0.1}
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="Analytics"
              description="See performance by partner, channel, timeline"
              color="primary"
              delay={0.2}
            />
            <FeatureMappedCard
              icon={QrCode}
              title="QR Generator"
              description="Perfect for events, booths, flyers"
              color="blazeOrange"
              delay={0.3}
            />
            <FeatureMappedCard
              icon={LinkIcon}
              title="Short Links"
              description="Safe, clear, customizable"
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
              Simple. Transparent. Scalable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {[
              { icon: UserPlus, label: "Invite", step: "01" },
              { icon: LinkIcon, label: "Assign Link", step: "02" },
              { icon: TrendingUp, label: "Track", step: "03" },
              { icon: DollarSign, label: "Payout", step: "04" },
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
        headline="Ready to Scale Your Partner Program?"
        subheadline="Join partner teams who trust utm.one for clear attribution and zero manual work."
        primaryCTA="Explore utm.one for Partner Teams"
      />

      <Footer />
    </div>
  );
};

export default PartnerManagers;
