import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BentoFeatures } from "@/components/premium/BentoFeatures";
import { Shield, Zap, Network, CheckCircle } from "lucide-react";

export default function LinkOrchestration() {
  return (
    <FeatureLayout
      title="Link Orchestration - Control & Reliability | utm.one"
      description="The first link manager with a self-healing immune system. Contextual routing and zero broken links guaranteed."
      canonical="https://utm.one/products/link-orchestration"
      keywords={["link management", "contextual routing", "smart links", "link immunity", "governance"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "link orchestration", url: "/products/link-orchestration" },
      ]}
    >
      {/* Hero Section */}
      <FeatureSection background="white" className="min-h-[70vh] flex items-center">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight brand-lowercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            the first link manager with a self-healing immune system
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Stop losing revenue to broken links and generic routing. utm.one uses Contextual Bandit Algorithms to route every click to its optimal destination and automatically fixes 404s before your users see them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="marketing" className="text-lg px-8">
                start for free
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                book a demo
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>

      {/* Bento Grid Features */}
      <FeatureSection background="muted">
        <BentoFeatures />
      </FeatureSection>

      {/* Feature Grid */}
      <FeatureSection background="white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 brand-lowercase">
            the "unreal" tech
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Network className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              contextual smart routing (LinUCB)
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "The link that learns who you are."
            </p>
            <p className="text-foreground/70">
              We don't just route randomly. Our Bandit Algorithms learn in real-time. If iOS users convert better on the App Store and Desktop users on the Web, we automatically split the traffic to maximize your revenue.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              link immunity (robustness)
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Zero broken links. Guaranteed."
            </p>
            <p className="text-foreground/70">
              Our Active Probe pings your destinations every hour. If a page goes down (404), we instantly reroute traffic to your Fallback URL so you never waste a click.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-card border">
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              adaptive governance shield
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Security that adapts to your team."
            </p>
            <p className="text-foreground/70">
              Forget static "Admin" roles. Our Constraint-Based Permission Engine assigns the precise "Least Privilege" access needed for each task. Plus, a forensic "Time-Travel" Audit Log for SOC2 compliance.
            </p>
          </div>
        </div>
      </FeatureSection>

      {/* FAQ Section */}
      <FeatureSection background="muted">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 brand-lowercase">
            frequently asked questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">How does the "Self-Healing" link work?</h3>
              <p className="text-muted-foreground">
                We use a "Minimax" robust optimization approach. You define a primary URL and a "Fallback" URL (like your homepage). Our edge nodes monitor the primary URL's health. If it fails (500/404), traffic is instantly shifted to the Fallback.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Can I use my own domain?</h3>
              <p className="text-muted-foreground">
                Yes. We support full custom domains (e.g., link.nike.com) with automatic SSL provisioning and HSTS enforcement.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">What is LinUCB?</h3>
              <p className="text-muted-foreground">
                LinUCB is a Contextual Bandit algorithm that learns from user behavior patterns. It analyzes device type, location, and other signals to route each visitor to the destination where they're most likely to convert.
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <FeatureSection background="white">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold brand-lowercase">
            ready to control & reliability?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the best teams using Scientific Link Management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" variant="marketing">
                start free trial
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                book a demo
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
}
