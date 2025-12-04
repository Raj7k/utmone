import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Globe, Lock, Zap, TrendingUp, Server, Shield } from "lucide-react";
import { formatText } from "@/utils/textFormatter";
import { motion } from "framer-motion";

const CustomDomains = () => {
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

  const workflowSteps = [
    {
      icon: Globe,
      title: "Add Your Domain",
      description: "Enter your domain (e.g., go.yourcompany.com) in settings.",
    },
    {
      icon: Server,
      title: "Configure DNS",
      description: "Add a CNAME record pointing to go.utm.one at your DNS provider.",
    },
    {
      icon: Lock,
      title: "Verify & Activate",
      description: "utm.one verifies DNS and auto-provisions SSL certificate.",
    },
    {
      icon: Zap,
      title: "Start Creating Links",
      description: "All new links default to your custom domain automatically.",
    },
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
      {/* Hero with RetroGradientMesh */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="container px-6 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 lowercase">
              {formatText("your brand.")}
              <br />
              {formatText("your domain.")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Use go.yourcompany.com for all short links with auto SSL and easy DNS setup.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 lowercase" style={{ color: 'rgba(59,130,246,1)' }}>
              get started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <FeatureSection background="default">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            {formatText("Why Branded Domains Matter")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-8 text-left">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
              <p className="text-lg text-secondary-label leading-relaxed mb-4">
                <strong className="text-destructive">Generic short links:</strong> utm.one/abc123
              </p>
              <ul className="space-y-2 text-secondary-label">
                <li>❌ No brand recognition</li>
                <li>❌ Lower click-through rates</li>
                <li>❌ Looks untrustworthy in emails</li>
                <li>❌ Can't customize domain per client</li>
              </ul>
            </div>
            <div className="border rounded-xl p-8" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
              <p className="text-lg text-label leading-relaxed mb-4">
                <strong style={{ color: 'rgba(59,130,246,1)' }}>Branded custom domain:</strong> go.yourcompany.com/webinar
              </p>
              <ul className="space-y-2 text-label">
                <li>✓ 34% higher click-through rate</li>
                <li>✓ Instant brand recognition</li>
                <li>✓ Builds trust with audience</li>
                <li>✓ Different domain per client workspace</li>
              </ul>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* Capabilities Grid */}
      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            {formatText("What You Get")}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} {...capability} delay={index * 0.1} />
          ))}
        </div>
      </FeatureSection>

      {/* Workflow Timeline */}
      <section className="py-24 md:py-32 bg-mirage relative overflow-hidden">
        <div className="container px-6 mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-white lowercase">
            {formatText("Setup in 5 Minutes")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {workflowSteps.map((step, index) => (
              <WorkflowStep key={index} {...step} delay={index * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <FeatureSection background="default">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-label lowercase">
            {formatText("The Data on Branded Links")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-xl p-8" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'rgba(59,130,246,1)' }}>34%</div>
              <p className="text-secondary-label">Higher click-through rate with branded domains</p>
            </div>
            <div className="border rounded-xl p-8" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'rgba(59,130,246,1)' }}>2.5x</div>
              <p className="text-secondary-label">More trust vs generic short links</p>
            </div>
            <div className="border rounded-xl p-8" style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'rgba(59,130,246,1)' }}>&lt; 5min</div>
              <p className="text-secondary-label">Average DNS setup time</p>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="container px-6 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 lowercase">
              {formatText("start using your own domain.")}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Setup takes 5 minutes. SSL provisioning is automatic. Branding is instant.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 lowercase" style={{ color: 'rgba(59,130,246,1)' }}>
              get started
            </Button>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default CustomDomains;
