import { motion } from "framer-motion";
import { Shield, TrendingUp, Link2, Lock } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { AdaptiveGovernanceVisual } from "@/components/enterprise/AdaptiveGovernanceVisual";
import { TimeTravelAuditMockup } from "@/components/enterprise/TimeTravelAuditMockup";
import { JustInTimeProvisioningVisual } from "@/components/enterprise/JustInTimeProvisioningVisual";
import { BayesianAttributionPreview } from "@/components/enterprise/BayesianAttributionPreview";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";

const Enterprise = () => {
  const pillars = [
    {
      icon: TrendingUp,
      title: "attribution",
      subtitle: "growth",
      description: "know exactly where revenue comes from",
      detail: "Bayesian multi-touch attribution shows the true influence of every channel on conversions"
    },
    {
      icon: Link2,
      title: "reliability",
      subtitle: "uptime",
      description: "zero broken links",
      detail: "Automated health probes detect and fix broken URLs before customers see them"
    },
    {
      icon: Shield,
      title: "governance",
      subtitle: "security",
      description: "precise control over every click",
      detail: "RBAC, audit logs, SSO, and field-level encryption for enterprise-grade security"
    }
  ];

  const trustBadges = [
    { title: "SSO & SAML", description: "Google, Azure AD, Okta" },
    { title: "AES-256 Encryption", description: "Field-level security" },
    { title: "99.99% SLA", description: "Enterprise uptime" },
    { title: "SOC 2 Type II", description: "Coming Q2 2025" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="utm.one for Enterprise - Governance, Attribution, Security"
        description="Enterprise-grade link governance with SSO, Bayesian attribution, time-travel audit logs, and adaptive access control. Built for security-first organizations."
        canonical="https://utm.one/solutions/enterprise"
        keywords={["enterprise link management", "SSO", "RBAC", "audit logs", "Bayesian attribution", "governance"]}
      />
      <WebPageSchema
        name="utm.one for Enterprise"
        description="Enterprise-grade governance for every click. SSO, Bayesian attribution, time-travel audit logs, and adaptive access control."
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

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SocialProofCounter variant="minimal" role="ops" />
            
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl lowercase text-label mb-6 mt-8">
              enterprise-grade governance<br />for every click
            </h1>
            <p className="text-xl md:text-2xl text-secondary-label max-w-3xl mx-auto mb-12">
              SSO, Bayesian attribution, time-travel audit logs, and adaptive access control. 
              Built for security-first organizations.
            </p>
            <CTAButton href="/early-access" variant="primary" pulse>
              book a demo
            </CTAButton>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lowercase text-label mb-6">
              the three pillars
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto">
              large companies care about growth and risk. we deliver both.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/30 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <pillar.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-label lowercase mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-lg text-label font-medium mb-3">
                    "{pillar.description}"
                  </p>
                </div>
                <p className="text-sm text-secondary-label">{pillar.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptive Governance Shield */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lowercase text-label mb-6">
              adaptive governance shield
            </h2>
            <p className="text-xl text-secondary-label">
              Instead of just "user roles," we offer <span className="text-primary font-semibold">least privilege optimization</span>. 
              A dynamic role engine that uses constraint satisfaction to create custom roles on the fly.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AdaptiveGovernanceVisual />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-12 p-8 rounded-2xl bg-muted/30 border border-border"
          >
            <h3 className="font-display font-bold text-2xl text-label lowercase mb-4">
              the problem
            </h3>
            <p className="text-secondary-label mb-6">
              In big teams, users get "Admin" access because they need to do one specific thing 
              (e.g., view billing), but this exposes the company to risk (e.g., they can also delete links).
            </p>
            <h3 className="font-display font-bold text-2xl text-label lowercase mb-4">
              the solution
            </h3>
            <p className="text-secondary-label">
              Check the exact capabilities a user needs. The system minimizes the "Privilege Surface Area" 
              while satisfying all work requirements. No more over-privileged accounts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Clean Track Quiz */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <CleanTrackScoreQuiz />
        </div>
      </section>

      {/* Time-Travel Audit Trail */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lowercase text-label mb-6">
              time-travel audit trail
            </h2>
            <p className="text-xl text-secondary-label">
              Enterprises need to know who broke a link and when. We provide a forensic timeline 
              that lets admins replay the link's history over the last 30 days.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <TimeTravelAuditMockup />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-12 text-center"
          >
            <p className="text-lg text-secondary-label">
              Don't just show a text log—show a timeline visualization with before/after diffs, 
              user attribution, and change context. Perfect for compliance audits and incident investigation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Just-in-Time Provisioning */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lowercase text-label mb-6">
              just-in-time provisioning
            </h2>
            <p className="text-xl text-secondary-label">
              If a user signs up with @nike.com, they're automatically captured into the Nike workspace 
              and assigned the "Viewer" role until approved. This prevents Shadow IT.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <JustInTimeProvisioningVisual />
          </div>
        </div>
      </section>

      {/* Bayesian Attribution */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lowercase text-label mb-6">
              bayesian influence graph
            </h2>
            <p className="text-xl text-secondary-label">
              Multi-touch attribution shows the true influence of every marketing channel, 
              not just last-click. Know exactly where revenue comes from.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <BayesianAttributionPreview />
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <ROICalculator />
        </div>
      </section>

      {/* Trust & Security Badges */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lowercase text-label mb-6">
              enterprise trust
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto">
              security and compliance built-in from day one
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border-2 border-border text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-label lowercase mb-2">
                  {badge.title}
                </h3>
                <p className="text-sm text-secondary-label">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl lowercase text-label mb-6">
              talk to our enterprise team
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto mb-12">
              Get a personalized demo and see how utm.one delivers enterprise-grade 
              governance, attribution, and reliability for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary" pulse>
                book a demo
              </CTAButton>
              <CTAButton href="/pricing" variant="secondary" showArrow={false}>
                view pricing
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Enterprise;
