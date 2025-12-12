import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { Globe, Lock, Zap, TrendingUp, Server, Shield } from "lucide-react";

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

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="Why Branded Domains Matter"
        subheadline="Generic links hurt trust. Branded domains build confidence."
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Custom Domain Features"
        subheadline="Everything you need for professional branded links"
        items={capabilities}
      />

      <FeatureShowcase
        headline="The Data on Branded Links"
        subheadline="Research-backed benefits of using your own domain"
        background="muted"
      >
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-xl p-8 bg-primary/5 border-primary/20 text-center">
            <div className="text-5xl font-bold mb-2 text-primary">34%</div>
            <p className="text-muted-foreground">Higher click-through rate with branded domains</p>
          </div>
          <div className="border rounded-xl p-8 bg-primary/5 border-primary/20 text-center">
            <div className="text-5xl font-bold mb-2 text-primary">2.5x</div>
            <p className="text-muted-foreground">More trust vs generic short links</p>
          </div>
          <div className="border rounded-xl p-8 bg-primary/5 border-primary/20 text-center">
            <div className="text-5xl font-bold mb-2 text-primary">&lt;5min</div>
            <p className="text-muted-foreground">Average DNS setup time</p>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="start using your own domain."
        subheadline="Setup takes 5 minutes. SSL provisioning is automatic. Branding is instant."
      />
    </FeatureLayout>
  );
};

export default CustomDomains;
