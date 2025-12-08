import { Helmet } from "react-helmet";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductHeroSimplified } from "@/components/product/ProductHeroSimplified";
import { ProductPainStory } from "@/components/product/ProductPainStory";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { QRROICalculator } from "@/components/product/QRROICalculator";
import { motion } from "framer-motion";
import { Palette, RefreshCw, MapPin, Download, Shield, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function QRStudio() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one QR Studio",
    "applicationCategory": "BusinessApplication",
    "description": "QR codes that actually work. Beautiful codes guaranteed to scan, powered by Clean-Track scan reliability engine.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>QR Studio - Codes That Actually Scan | utm.one</title>
        <meta name="description" content="Beautiful QR codes that actually work. Our Clean-Track engine guarantees scannability with brand colors, dynamic URLs, and geo-tracking." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <MainLayout showAnnouncement={false}>
        {/* Hero */}
        <ProductHeroSimplified
          headline="qr codes that actually work."
          subheadline="beautiful codes guaranteed to scan. every time."
          primaryCTA={{ text: "create free code", to: "/tools/qr-generator" }}
          secondaryCTA={{ text: "explore studio", to: "/features/qr-generator" }}
          socialProof={{ count: 10000, label: "codes generated" }}
        />

        {/* Pain Story */}
        <ProductPainStory
          scenario="the trade show disaster"
          story="You printed 5,000 brochures for the biggest trade show of the year. Day 1: the QR code doesn't scan under the venue lights. Your booth looks amateur. The sales team is furious. Every lead walks away because they can't access your demo."
          visual={
            <div className="bg-destructive/10 rounded-lg p-6 text-center">
              <div className="w-32 h-32 mx-auto bg-destructive/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-6xl">❌</div>
              </div>
              <p className="text-sm font-semibold text-destructive">QR Code Not Recognized</p>
              <p className="text-xs text-muted-foreground mt-1">Low contrast • Poor lighting • 15% scan failure rate</p>
            </div>
          }
        />

        {/* Before vs After */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <ContentComparison
              beforeTitle="generic qr"
              afterTitle="clean-track qr"
              beforeContent={
                <div className="space-y-4 text-center">
                  <div className="w-40 h-40 mx-auto bg-card rounded-lg border-2 border-border p-2">
                    <div className="w-full h-full bg-foreground/90" style={{ 
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, currentColor 8px, currentColor 10px), repeating-linear-gradient(90deg, transparent, transparent 8px, currentColor 8px, currentColor 10px)',
                      backgroundSize: '10px 10px'
                    }} />
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Random black/white only</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Hard to scan in low light</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>No logo, off-brand</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>No tracking</span>
                    </div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-4 text-center">
                  <div className="w-40 h-40 mx-auto bg-card rounded-lg border-2 border-primary p-2">
                    <div className="w-full h-full bg-primary/20" style={{ 
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, hsl(var(--primary)) 8px, hsl(var(--primary)) 10px), repeating-linear-gradient(90deg, transparent, transparent 8px, hsl(var(--primary)) 8px, hsl(var(--primary)) 10px)',
                      backgroundSize: '10px 10px'
                    }}>
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-card rounded-lg border-2 border-primary flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Brand colors validated</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>98% scan rate guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Logo centered perfectly</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Live geo analytics</span>
                    </div>
                  </div>
                </div>
              }
              caption="same destination. 3x more scans."
            />
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase mb-4">
                what you get with qr studio
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                powered by clean-track scan reliability engine
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Palette className="w-6 h-6" />,
                  title: "brand colors that scan",
                  description: "clean-track validates contrast in real-time. your brand colors work, guaranteed."
                },
                {
                  icon: <RefreshCw className="w-6 h-6" />,
                  title: "print once, update forever",
                  description: "printed 10,000 flyers with wrong url? change it instantly. no reprints needed."
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  title: "know where they scan",
                  description: "geo heatmap shows which locations drive scans. optimize your placements."
                },
                {
                  icon: <Download className="w-6 h-6" />,
                  title: "export for print or digital",
                  description: "png for web, svg for print, pdf for agencies. all formats included."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "scan guarantee",
                  description: "error correction auto-set based on logo complexity. 98% scan rate guaranteed."
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "track every scan",
                  description: "device breakdown, time analytics, referrer data. full visibility."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full transition-colors hover:border-white/20">
                    <div className="w-12 h-12 rounded-xl bg-white/5 text-white flex items-center justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white brand-lowercase mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase mb-4">
                from url to print in 60 seconds
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", label: "paste url", desc: "any long url" },
                { step: "2", label: "add brand", desc: "colors + logo" },
                { step: "3", label: "download", desc: "png/svg/pdf" },
                { step: "4", label: "track scans", desc: "live analytics" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-display font-semibold text-white brand-lowercase mb-1">
                    {item.label}
                  </h4>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Loop - ROI Calculator */}
        <QRROICalculator />

        {/* Feature Cards */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "qr generator",
                  description: "full customization suite with real-time validation",
                  link: "/features/qr-generator"
                },
                {
                  title: "analytics",
                  description: "track scans, devices, locations, and conversion events",
                  link: "/features/analytics"
                },
                {
                  title: "custom domains",
                  description: "branded short urls for professional qr codes",
                  link: "/features/custom-domains"
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 transition-colors group cursor-pointer hover:border-white/20">
                  <Link to={feature.link}>
                    <h3 className="text-xl font-display font-semibold text-white brand-lowercase mb-2 group-hover:text-white/80 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4">{feature.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span>learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 brand-lowercase">
              frequently asked questions
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  q: "what happens if i print a complex logo in the middle?",
                  a: "our clean-track engine automatically raises error correction to 'high' (30% recovery), ensuring your code scans even with 30% coverage by your logo."
                },
                {
                  q: "can i change the destination after printing?",
                  a: "yes. all qr codes are dynamic—they point to a short link you can update anytime from your dashboard. no reprints needed."
                },
                {
                  q: "do you support custom brand colors?",
                  a: "absolutely. clean-track validates contrast ratios in real-time and auto-corrects your design to guarantee scannability in any lighting."
                },
                {
                  q: "what file formats can i export?",
                  a: "png for web (high-res), svg for print (vector), pdf for agencies. all formats included on every plan."
                },
                {
                  q: "how accurate is geo-tracking?",
                  a: "country-level 100% accurate, city-level 85-90% accurate based on ip geolocation."
                },
                {
                  q: "can i track conversions from qr scans?",
                  a: "yes. install our tracking pixel and every qr scan becomes a trackable conversion event in your analytics."
                },
                {
                  q: "what's your scan guarantee?",
                  a: "98% scan rate or we refund your month. our clean-track validation ensures every code works before you download."
                },
                {
                  q: "do you support bulk qr generation?",
                  a: "yes. business and enterprise plans include csv upload for bulk qr code generation with unique tracking per code."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-white brand-lowercase">
                    {faq.q}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-white/5 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase">
              ready to stop guessing if your codes work?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              join marketers using clean-track qr codes
            </p>
            <Button asChild size="lg" variant="marketing">
              <Link to="/tools/qr-generator">create your first code</Link>
            </Button>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
