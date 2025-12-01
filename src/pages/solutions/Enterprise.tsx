import { Link } from "react-router-dom";
import { CTAButton } from "@/components/ui/CTAButton";
import { Shield, Lock, Zap, Database, Users, KeyRound, Activity, GitBranch, CheckCircle2 } from "lucide-react";
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

const Enterprise = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Enterprise Link Management - Security, Scale, Governance"
        description="SSO, SAML, audit logs, field-level encryption, Knapsack edge caching, and enterprise-grade SLA. Built for security-first organizations."
        canonical="https://utm.one/solutions/enterprise"
        keywords={["enterprise link management", "SSO", "SAML", "audit logs", "field encryption", "enterprise security"]}
      />
      <WebPageSchema
        name="Enterprise Link Management"
        description="SSO, SAML, audit logs, field-level encryption, Knapsack edge caching, and enterprise-grade SLA. Built for security-first organizations."
        url="https://utm.one/solutions/enterprise"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Enterprise', url: 'https://utm.one/solutions/enterprise' }
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
              enterprise-grade link governance
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              SSO, audit logs, field-level encryption, sub-millisecond redirects, and 99.99% SLA. Built for security-first organizations.
            </p>
            <div className="pt-4">
              <CTAButton href="/book-demo" variant="primary" pulse>
                book a demo
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: Security First */}
      <section className="relative py-24 md:py-32 bg-wildSand overflow-hidden">
        <DotPattern />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              security by default
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Every layer hardened. Every token encrypted. Every action logged.
            </p>
          </div>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <KeyRound className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">SSO & SAML</h3>
                <p className="text-secondary-label">
                  Google OAuth, Microsoft Azure AD, Okta, OneLogin—single sign-on that works
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">field encryption</h3>
                <p className="text-secondary-label">
                  AES-256 encryption on all tokens, secrets, and API keys—even if database is breached
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <GitBranch className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">audit logs</h3>
                <p className="text-secondary-label">
                  Every link created, edited, deleted logged with who/what/when/old-vs-new diffs
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-3 lowercase">RLS policies</h3>
                <p className="text-secondary-label">
                  Row-level security ensures users only see their workspace data—multi-tenant isolation
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
              Enterprise-grade infrastructure and support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "SSO & SAML authentication",
              "Field-level AES-256 encryption",
              "Comprehensive audit logs",
              "99.99% uptime SLA",
              "Sub-100ms redirect latency",
              "Dedicated support team",
              "Custom contract terms",
              "On-premise deployment option",
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
              built for enterprise scale
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Shield}
              title="Enterprise Security"
              description="SSO, encryption, audit logs"
              color="blazeOrange"
              delay={0}
              href="/features/enterprise-control"
            />
            <FeatureMappedCard
              icon={Zap}
              title="Performance"
              description="Sub-millisecond redirects"
              color="deepSea"
              delay={0.1}
              href="/features/performance"
            />
            <FeatureMappedCard
              icon={Database}
              title="Scalability"
              description="Built for millions of clicks"
              color="primary"
              delay={0.2}
              href="/features/analytics"
            />
            <FeatureMappedCard
              icon={Users}
              title="Team Management"
              description="Role-based access control"
              color="blazeOrange"
              delay={0.3}
              href="/features/enterprise-control"
            />
            <FeatureMappedCard
              icon={Activity}
              title="Monitoring"
              description="Real-time health checks"
              color="deepSea"
              delay={0.4}
              href="/features/link-immunity"
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
              Deploy → Govern → Scale → Support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {[
              { icon: Lock, label: "Deploy", step: "01" },
              { icon: Shield, label: "Govern", step: "02" },
              { icon: Zap, label: "Scale", step: "03" },
              { icon: Users, label: "Support", step: "04" },
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
        headline="talk to our enterprise team"
        subheadline="Custom SLAs, dedicated support, on-premise deployment, and volume discounts available."
        primaryCTA="book a demo"
        secondaryCTA="View Security"
        secondaryCTALink="/trust"
      />

      <Footer />
    </div>
  );
};

export default Enterprise;
