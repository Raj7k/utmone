import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Database, TrendingUp } from "lucide-react";
import { ProductMockup } from "@/components/product/ProductMockup";

interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  mockupType: "analytics" | "dashboard";
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

export default function DataPipeline() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one Data Pipeline",
    "applicationCategory": "DeveloperTool",
    "description": "Your data, in your warehouse. Stream raw click-stream data directly to Snowflake, BigQuery, or S3.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Data Pipeline - Freedom & Scale | utm.one</title>
        <meta name="description" content="Bypass the dashboard. Stream raw, granular click-stream data directly to your Snowflake, BigQuery, or S3 bucket. Built for teams that build their own models." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold hero-gradient brand-lowercase"
            >
              your data, in your warehouse
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Bypass the dashboard. Stream raw, granular click-stream data directly to your Snowflake, BigQuery, or S3 bucket. Built for teams that need to build their own models.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button asChild size="lg" variant="marketing">
                <Link to="/docs/api">read API docs</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/docs/api#schema">view schema</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 md:py-40">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <FeatureBlock
              icon={<Zap className="w-6 h-6" />}
              title="sub-second event streaming"
              description="receive a JSON payload for every link.clicked, lead.identified, or qr.scanned event in < 200ms. Perfect for triggering instant sales alerts in Slack or HubSpot."
              mockupType="analytics"
              reversed={false}
            />

            <FeatureBlock
              icon={<Database className="w-6 h-6" />}
              title="daily dumps to S3/Snowflake"
              description="We automatically batch and export your entire analytics_events table every night to your private S3 bucket in Apache Parquet or CSV format."
              mockupType="dashboard"
              reversed={true}
            />

            <FeatureBlock
              icon={<TrendingUp className="w-6 h-6" />}
              title="scale without the crash"
              description="Our API gateway uses Adaptive Throttling based on system load. We guarantee 99.99% availability for enterprise keys even during traffic spikes."
              mockupType="analytics"
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
                  what is the data schema for the export?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We provide a flat JSON schema including visitor_id, timestamp, user_agent, geo_location, utm_parameters, and identity_id.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase">
                  how fast are the webhooks?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use an asynchronous queue (Edge Functions) to dispatch webhooks. 99% of events are delivered within 500ms of the user click.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FloatingNavigation />
        <Footer />
      </div>
    </>
  );
}
