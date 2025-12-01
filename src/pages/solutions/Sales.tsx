import { Link } from "react-router-dom";
import { CTAButton } from "@/components/ui/CTAButton";
import { ArrowRight, Link as LinkIcon, Settings, QrCode, BarChart3, CheckCircle2, AlertCircle, Layers, UserPlus, MessageSquare, TrendingUp } from "lucide-react";
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

const Sales = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Sales Teams"
        description="Links that explain your influence. utm.one helps sales teams share cleaner, faster, clearer links — with attribution built in."
        canonical="https://utm.one/solutions/sales"
        keywords={['sales tools', 'sales attribution', 'link tracking for sales', 'outreach links', 'sales analytics']}
      />
      <WebPageSchema 
        name="utm.one for Sales Teams"
        description="Links that explain your influence. utm.one helps sales teams share cleaner, faster, clearer links — with attribution built in."
        url="https://utm.one/solutions/sales"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Sales', url: 'https://utm.one/solutions/sales' }
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
              Links That Explain Your Influence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one helps sales teams share cleaner, faster, clearer links — with attribution built in.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
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
              The Prospect Who Actually Clicked
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Know exactly which content moves deals forward
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* CRM Integration Visual */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="text-sm font-semibold text-label">John Smith - Acme Corp</div>
                <div className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-semibold">HOT LEAD</div>
              </div>
              
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Recent Activity</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Viewed pricing page</div>
                      <div className="text-xs text-muted-foreground">via utm.one/pricing-deck • 3 times today</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Downloaded case study</div>
                      <div className="text-xs text-muted-foreground">via utm.one/enterprise-case • Yesterday</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span>High engagement signal - follow up now</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Day 1</div>
                  <div className="text-sm text-foreground font-medium">Share pricing deck via tracked link</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-primary/20 mt-2" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Day 2</div>
                  <div className="text-sm text-foreground font-medium">See John viewed it 3x</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Day 3</div>
                  <div className="text-sm text-foreground font-medium">Perfect timing for follow-up call</div>
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
              Send with confidence. Track with clarity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Simple short links",
              "Personal tracking",
              "Clean UTMs built automatically",
              "QR for events and booths",
              "Partner attribution (if needed)",
              "Analytics that make sense",
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
              Built for Sales Teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={LinkIcon}
              title="Short Links"
              description="Clean, memorable links in outreach"
              color="blazeOrange"
              delay={0}
              href="/features/short-links"
            />
            <FeatureMappedCard
              icon={Settings}
              title="UTM Builder"
              description="Auto-filled parameters for sequences & cadences"
              color="deepSea"
              delay={0.1}
              href="/features/utm-builder"
            />
            <FeatureMappedCard
              icon={QrCode}
              title="QR Generator"
              description="Perfect for events, dinners, meetups"
              color="primary"
              delay={0.2}
              href="/features/qr-generator"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="Analytics"
              description="See who clicked and where they came from"
              color="blazeOrange"
              delay={0.3}
              href="/features/analytics"
            />
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track"
              description="Consistent naming, even across sales + marketing"
              color="deepSea"
              delay={0.4}
              href="/features/clean-track"
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
              No complex setup, no extra tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 relative max-w-4xl mx-auto">
            {[
              { icon: MessageSquare, label: "Share", step: "01" },
              { icon: BarChart3, label: "Track", step: "02" },
              { icon: UserPlus, label: "Follow Up", step: "03" },
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
        headline="Ready to Track Your Influence?"
        subheadline="Join sales teams who trust utm.one for clear attribution and faster follow-ups."
        primaryCTA="Explore utm.one for Sales"
      />

      <Footer />
    </div>
  );
};

export default Sales;
