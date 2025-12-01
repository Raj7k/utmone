import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/AppHeader";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Network, Users, DollarSign } from "lucide-react";
import { ProductMockup } from "@/components/product/ProductMockup";

interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  mockupType: "attribution-graph" | "identity-stitching" | "state-value";
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

export default function JourneyIntelligence() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one Journey Intelligence",
    "applicationCategory": "BusinessApplication",
    "description": "Stop tracking clicks. Start engineering journeys with Bayesian Inference and Identity Stitching.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Journey Intelligence - Truth & Revenue | utm.one</title>
        <meta name="description" content="Most tools lie with Last Click attribution. We use Bayesian Inference and Identity Stitching to reveal the true causal impact of every channel." />
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
              stop tracking clicks. start engineering journeys.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Most tools lie to you with "Last Click" attribution. We use <strong>Bayesian Inference</strong> and <strong>Identity Stitching</strong> to reveal the true causal impact of every channel—from the first anonymous blog read to the final signed contract.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button asChild size="lg" variant="marketing">
                <Link to="/early-access">see your journey graph</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/resources/guides/bayesian-testing">read methodology</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 md:py-40">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <FeatureBlock
              icon={<Network className="w-6 h-6" />}
              title="see the invisible influence"
              description="We model your customer journey as a Probabilistic Graph. Discover that while Google Search gets the credit, your 'boring' whitepaper actually increased the probability of conversion by 300%."
              mockupType="attribution-graph"
              reversed={false}
            />

            <FeatureBlock
              icon={<Users className="w-6 h-6" />}
              title="de-anonymize your traffic"
              description="Our Time-Travel Stitching engine remembers 'Anonymous Visitor 582' from 3 weeks ago. When they sign up today, we retroactively link their entire history to their real email."
              mockupType="identity-stitching"
              reversed={true}
            />

            <FeatureBlock
              icon={<DollarSign className="w-6 h-6" />}
              title="know the dollar value of every page"
              description="We calculate the Markov State Value ($V$) of every URL. Know instantly that your Pricing Page is worth $45.00 per visit, while your About Page is worth $0.50."
              mockupType="state-value"
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
                  what attribution models do you use?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We move beyond simple "Linear" or "Time Decay" models. We use Causal Inference (Bayesian Networks) to calculate the "Lift" or incremental value of each touchpoint.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase">
                  is identity resolution GDPR compliant?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. We use first-party cookies only and stitch identities based on user-consented actions (like form fills). We never share identity graphs between customers.
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
