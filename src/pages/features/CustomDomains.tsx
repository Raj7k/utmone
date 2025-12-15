import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/StaticFeatureHero";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/StaticFeatureBeforeAfter";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { DomainSetupDemoWidget } from "@/components/features/visuals/DomainSetupDemoWidget";
import { Globe, Lock, Zap, TrendingUp, Server, Shield, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const CustomDomains = () => {
  const stats = [
    { value: "34%", label: "Higher CTR" },
    { value: "2.5x", label: "More Trust" },
    { value: "<5min", label: "Setup Time" },
    { value: "∞", label: "Domains (Enterprise)" },
  ];

  const capabilities = [
    {
      icon: Globe,
      title: "Your Brand, Your Domain",
      description: "Use go.yourcompany.com instead of generic utm.one links.",
    },
    {
      icon: Lock,
      title: "Auto SSL Provisioning",
      description: "HTTPS certificates automatically provisioned via Let's Encrypt.",
    },
    {
      icon: Zap,
      title: "Easy DNS Setup",
      description: "Simple CNAME record setup with step-by-step instructions.",
    },
    {
      icon: Server,
      title: "Multiple Domains",
      description: "Pro: 1 domain, Business: 5 domains, Enterprise: unlimited.",
    },
    {
      icon: TrendingUp,
      title: "Higher Click-Through Rates",
      description: "Branded links get 34% higher CTR than generic short links.",
    },
    {
      icon: Shield,
      title: "Client-Specific Domains",
      description: "Agencies can assign different domains to each client workspace.",
    },
  ];

  const comparisonItems = [
    { feature: "Brand recognition", before: "Generic short domain", after: "Your company domain" },
    { feature: "Click-through rate", before: "Lower trust = lower CTR", after: "34% higher CTR" },
    { feature: "Email deliverability", before: "Often flagged as spam", after: "Trusted sender reputation" },
    { feature: "SSL certificates", before: "Manual configuration", after: "Auto-provisioned HTTPS" },
    { feature: "DNS setup", before: "Complex configuration", after: "Simple CNAME record" },
    { feature: "Client branding", before: "One domain for all", after: "Domain per workspace" },
  ];

  const benefits = [
    "Instant brand recognition in emails & social",
    "Higher click-through rates from trusted URLs",
    "Better email deliverability (not flagged as spam)",
    "Professional appearance for enterprise clients",
    "Complete control over your link branding",
  ];

  return (
    <FeatureLayout
      title="Custom Branded Domains - utm.one"
      description="Use your own domain for short links with auto SSL provisioning and easy DNS setup."
      canonical="https://utm.one/features/custom-domains"
      keywords={["custom domain", "branded links", "white label domain", "ssl certificate", "cname setup"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Custom Domains", url: "https://utm.one/features/custom-domains" },
      ]}
    >
      <FeatureHero
        headline="your brand. your domain."
        subheadline="Use go.yourcompany.com for all short links with auto SSL and easy DNS setup. Setup takes 5 minutes."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "setup guide", href: "/help/domains" }}
      />

      {/* Interactive Demo Widget */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              try it yourself
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how quick and easy it is to set up your custom domain
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <DomainSetupDemoWidget />
          </motion.div>
        </div>
      </section>

      <FeatureStatsStrip stats={stats} />

      {/* Benefits Showcase */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                why branded domains matter
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Generic short links hurt trust and reduce clicks. Your domain builds confidence and drives engagement.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Comparison visual */}
              <div className="space-y-4">
                {/* Generic link */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">In someone's inbox</span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Link:</p>
                    <p className="text-sm font-mono text-red-400 line-through">bit.ly/3xK9mNq</p>
                    <p className="text-xs text-red-400 mt-2">⚠️ Generic domain - lower trust</p>
                  </div>
                </div>

                {/* Branded link */}
                <div className="p-6 rounded-xl bg-card border-2 border-emerald-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500/10 px-3 py-1 rounded-bl-lg">
                    <span className="text-xs font-medium text-emerald-400">+34% CTR</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">In someone's inbox</span>
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <p className="text-xs text-muted-foreground mb-1">Link:</p>
                    <p className="text-sm font-mono text-emerald-400 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      go.yourcompany.com/promo
                    </p>
                    <p className="text-xs text-emerald-400 mt-2">✓ Your brand = trusted clicks</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FeatureBeforeAfter
        headline="The Difference is Clear"
        subheadline="Generic links hurt trust. Branded domains build confidence."
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Custom Domain Features"
        subheadline="Everything you need for professional branded links"
        items={capabilities}
      />

      <FeatureFinalCTA
        headline="start using your own domain."
        subheadline="Setup takes 5 minutes. SSL provisioning is automatic. Branding is instant."
      />
    </FeatureLayout>
  );
};

export default CustomDomains;