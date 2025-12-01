import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/AppHeader";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, RefreshCw, MapPin } from "lucide-react";
import { ProductMockup } from "@/components/product/ProductMockup";

interface FeatureBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  mockupType: "qr-customizer" | "geo-map";
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

export default function QRStudio() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one QR Studio",
    "applicationCategory": "BusinessApplication",
    "description": "QR Codes engineered for the real world. Beautiful codes that actually scan.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>QR Studio - Physical Reliability | utm.one</title>
        <meta name="description" content="Beautiful QR codes that actually scan. Our Reliability Architect mathematically guarantees scannability by optimizing contrast, density, and error correction." />
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
              QR codes engineered for the real world
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Beautiful codes that actually scan. Our <strong>Reliability Architect</strong> mathematically guarantees scannability by optimizing contrast, density, and error correction in real-time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button asChild size="lg" variant="marketing">
                <Link to="/tools/qr-generator">create free code</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/features/qr-generator">explore studio</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 md:py-40">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <FeatureBlock
              icon={<Palette className="w-6 h-6" />}
              title="beautiful, yet readable"
              description="Don't guess if your brand colors will work. Our Constrained Optimization engine calculates the WCAG luminance ratio in real-time and auto-corrects your design to ensure it scans in low light."
              mockupType="qr-customizer"
              reversed={false}
            />

            <FeatureBlock
              icon={<RefreshCw className="w-6 h-6" />}
              title="print once, update forever"
              description="You printed 10,000 flyers with the wrong link? No problem. Change the destination URL instantly from your dashboard without reprinting a single page."
              mockupType="qr-customizer"
              reversed={true}
            />

            <FeatureBlock
              icon={<MapPin className="w-6 h-6" />}
              title="know exactly where your ads work"
              description="See a heatmap of every scan. Compare the performance of your 'New York Billboard' vs. your 'London Flyer' in real-time."
              mockupType="geo-map"
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
                  what happens if i print a complex logo in the middle?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our "Density Check" algorithm automatically raises the Error Correction Level (ECL) to 'High' (30% recovery), ensuring your code scans even if 30% of it is covered by your logo.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase">
                  can i change the destination after printing?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. All QR codes from utm.one are dynamic—they point to a short link that you can update anytime from your dashboard.
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
