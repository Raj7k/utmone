import { Link } from "react-router-dom";
import { CTAButton } from "@/components/ui/CTAButton";
import { FolderKanban, Globe, Users, FileBarChart, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { HeroFloatingShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

const Agencies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="utm.one for Agencies - Multi-Client Link Management"
        description="Workspaces, team invites, white-label reports, and client-branded domains. Manage dozens of clients without chaos."
        canonical="https://utm.one/solutions/agencies"
        keywords={["agency link management", "multi-client workspaces", "white-label reports", "agency utm tracking"]}
      />
      <WebPageSchema
        name="utm.one for Agencies"
        description="Workspaces, team invites, white-label reports, and client-branded domains. Manage dozens of clients without chaos."
        url="https://utm.one/solutions/agencies"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Agencies', url: 'https://utm.one/solutions/agencies' }
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
              built for agencies managing dozens of clients
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              Workspaces, team invites, white-label reports, and client-branded domains. No more spreadsheet chaos.
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
              one platform, unlimited clients
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Each client gets their own workspace with isolated data, branded domains, and custom UTM rules
            </p>
          </div>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16">
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <FolderKanban className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">client workspaces</h3>
                <p className="text-secondary-label">
                  Create a workspace for each client—data isolated, UTM templates separate, no cross-contamination
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">branded domains</h3>
                <p className="text-secondary-label">
                  Each client can use their own domain—nike.com/go/, adidas.com/c/, reebok.com/u/
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">team invites</h3>
                <p className="text-secondary-label">
                  Invite client team members to their workspace—they see only their data, not others
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Fold 3: What You Get */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage clients at scale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Unlimited client workspaces",
              "White-label PDF reports",
              "Client-branded domains",
              "Team member invites",
              "Shared analytics dashboards",
              "Automated reporting",
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
              built for agency workflows
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={FolderKanban}
              title="Multi-Client Workspaces"
              description="Isolated data per client"
              color="blazeOrange"
              delay={0}
              href="/features/workspaces"
            />
            <FeatureMappedCard
              icon={FileBarChart}
              title="White-Label Reports"
              description="Branded PDF exports"
              color="deepSea"
              delay={0.1}
              href="/features/reporting"
            />
            <FeatureMappedCard
              icon={Globe}
              title="Custom Domains"
              description="Client-branded short links"
              color="primary"
              delay={0.2}
              href="/features/custom-domains"
            />
            <FeatureMappedCard
              icon={Shield}
              title="Team Permissions"
              description="Role-based access control"
              color="blazeOrange"
              delay={0.3}
              href="/features/enterprise-control"
            />
            <FeatureMappedCard
              icon={Zap}
              title="Automated Workflows"
              description="Scheduled reports & alerts"
              color="deepSea"
              delay={0.4}
              href="/features/automation"
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
              your workflow, simplified
            </h2>
            <p className="text-xl text-white/70">
              Onboard → Assign → Track → Report
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {[
              { icon: Users, label: "Onboard", step: "01" },
              { icon: Globe, label: "Assign", step: "02" },
              { icon: FileBarChart, label: "Track", step: "03" },
              { icon: Zap, label: "Report", step: "04" },
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
        headline="stop juggling spreadsheets"
        subheadline="One dashboard to manage every client's links, UTMs, QR codes, and analytics."
        primaryCTA="get early access"
        secondaryCTA="View Pricing"
        secondaryCTALink="/pricing"
      />

      <Footer />
    </div>
  );
};

export default Agencies;
