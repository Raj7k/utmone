import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/AppHeader";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, Lock } from "lucide-react";
import { ProductMockup } from "@/components/product/ProductMockup";

interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  mockupType: "dashboard" | "security" | "governance";
  reversed: boolean;
}

const FeatureBlock = ({ icon, title, description, mockupType, reversed }: FeatureBlockProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} 
                items-center gap-12 md:gap-20`}
  >
    {/* Text Content */}
    <div className="w-full md:w-[40%] space-y-6">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground brand-lowercase leading-tight">
        {title}
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>

    {/* Mockup */}
    <div className="w-full md:w-[60%]">
      <ProductMockup type={mockupType} />
    </div>
  </motion.div>
);

export default function LinkOrchestration() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one Link Orchestration",
    "applicationCategory": "BusinessApplication",
    "description": "The first link manager with a self-healing immune system. Control and reliability for every click.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Link Orchestration - Self-Healing Links | utm.one</title>
        <meta name="description" content="Stop losing revenue to broken links. utm.one uses Contextual Bandit Algorithms to route every click optimally and automatically fixes 404s before users see them." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold hero-gradient brand-lowercase"
            >
              the first link manager with a self-healing immune system
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Stop losing revenue to broken links and generic routing. <strong>utm.one</strong> uses <strong>Contextual Bandit Algorithms</strong> to route every click to its optimal destination and automatically fixes 404s before your users see them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button asChild size="lg" variant="marketing">
                <Link to="/early-access">start for free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/book-demo">book a demo</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 md:py-40">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <FeatureBlock
              icon={<Zap className="w-6 h-6" />}
              title="the link that learns who you are"
              description="We don't just route randomly. Our Bandit Algorithms learn in real-time. If iOS users convert better on the App Store and Desktop users on the Web, we automatically split the traffic to maximize your revenue."
              mockupType="dashboard"
              reversed={false}
            />

            <FeatureBlock
              icon={<Shield className="w-6 h-6" />}
              title="zero broken links. guaranteed."
              description="Our Active Probe pings your destinations every hour. If a page goes down (404), we instantly reroute traffic to your Fallback URL so you never waste a click."
              mockupType="security"
              reversed={true}
            />

            <FeatureBlock
              icon={<Lock className="w-6 h-6" />}
              title="security that adapts to your team"
              description="Forget static 'Admin' roles. Our Constraint-Based Permission Engine assigns the precise 'Least Privilege' access needed for each task. Plus, a forensic 'Time-Travel' Audit Log for SOC2 compliance."
              mockupType="governance"
              reversed={false}
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-32 bg-muted/20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 brand-lowercase">
              frequently asked questions
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase">
                  how does the "self-healing" link work?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use a "Minimax" robust optimization approach. You define a primary URL and a "Fallback" URL (like your homepage). Our edge nodes monitor the primary URL's health. If it fails (500/404), traffic is instantly shifted to the Fallback.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase">
                  can i use my own domain?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. We support full custom domains (e.g., link.nike.com) with automatic SSL provisioning and HSTS enforcement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
