import { Helmet } from "react-helmet";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Link2, BarChart3, Brain, Shield, QrCode, Globe, Zap, Users, Check, X } from "lucide-react";
import { ProductControlDeck } from "@/components/product/ProductControlDeck";
import { Button } from "@/components/ui/button";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// 5 Capability Pillars
const capabilities = [
  {
    id: "link-infrastructure",
    title: "Link Infrastructure",
    icon: Link2,
    features: ["Short links with custom slugs", "Multi-domain support", "Branded QR codes", "Link expiration & limits"],
    href: "/features/short-links",
  },
  {
    id: "clean-track",
    title: "Clean-Track Intelligence",
    icon: Zap,
    features: ["UTM governance & validation", "Naming convention enforcement", "Template library", "Auto-normalization"],
    href: "/features/utm-builder",
  },
  {
    id: "revenue-attribution",
    title: "Revenue Attribution",
    icon: BarChart3,
    features: ["Multi-touch attribution models", "Identity graph", "Journey mapping", "Conversion tracking"],
    href: "/features/attribution-graph",
  },
  {
    id: "ai-intelligence",
    title: "AI Intelligence",
    icon: Brain,
    features: ["Semantic auto-fill", "Predictive quality scores", "Anomaly detection", "Smart insights"],
    href: "/features/predictive-analytics",
  },
  {
    id: "enterprise-governance",
    title: "Enterprise Governance",
    icon: Shield,
    features: ["Role-based access", "Approval workflows", "Audit logging", "SSO & WebAuthn"],
    href: "/features/enterprise-control",
  },
];

// Comparison data
const comparisonItems = [
  { feature: "UTM consistency", before: "manual spreadsheets", after: "automated governance" },
  { feature: "Attribution", before: "last-click only", after: "multi-touch models" },
  { feature: "Cross-device", before: "blind spots", after: "identity graph" },
  { feature: "QR tracking", before: "no visibility", after: "full analytics" },
  { feature: "Team access", before: "shared passwords", after: "role-based control" },
];

export default function Product() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one",
    "description": "The intelligence layer for every link. Attribution, prediction, governance—one platform.",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Product | utm.one - The Intelligence Layer for Every Link</title>
        <meta name="description" content="utm.one: attribution, prediction, governance—one platform. See how we transform link management with AI intelligence and revenue attribution." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
        {/* Noise Texture */}
        <div className="fixed inset-0 pointer-events-none z-0 will-change-transform obsidian-noise" />

        {/* Center Axis */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none z-0 bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Spotlight */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[100vh] pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,_hsl(var(--primary)_/_0.05)_0%,_transparent_70%)]" />

        <Navigation />
        
        {/* Fold 1: Hero with Interactive Control Deck */}
        <section className="pt-20">
          <div className="max-w-4xl mx-auto px-6 text-center py-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4"
            >
              The Product
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold hero-gradient mb-6 lowercase"
            >
              the intelligence layer<br />for every link.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              attribution. prediction. governance. one platform.
            </motion.p>
          </div>
          <ProductControlDeck />
        </section>

        {/* Fold 2: Capability Pillars - Bento Grid */}
        <section className="relative z-10 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold hero-gradient mb-4 lowercase">
                five pillars of intelligence
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                everything you need to track, attribute, and optimize your marketing links.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={cap.id}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
                    className={index === 0 || index === 1 ? "lg:col-span-1" : ""}
                  >
                    <Link to={cap.href} className="block group h-full">
                      <div className="relative p-8 h-full transition-all duration-500 group-hover:scale-[1.02] bg-card/50 backdrop-blur-xl rounded-2xl border border-border group-hover:border-primary/30">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-muted">
                          <Icon className="w-6 h-6 text-foreground" />
                        </div>
                        <h3 className="text-xl font-display font-semibold text-foreground mb-4 lowercase">
                          {cap.title}
                        </h3>
                        <ul className="space-y-2">
                          {cap.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-primary shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                          learn more
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Fold 3: Interactive Demo Widget */}
        <section className="relative z-10 py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold hero-gradient mb-4 lowercase">
                see it in action
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                paste any URL and watch utm.one transform it in under 5 seconds.
              </p>
              
              {/* Demo preview placeholder */}
              <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <div className="flex-1 w-full">
                    <div className="bg-muted rounded-xl p-4 text-left">
                      <p className="text-xs text-muted-foreground mb-2">destination URL</p>
                      <p className="text-sm text-foreground font-mono truncate">
                        https://example.com/products/summer-collection?ref=homepage
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
                  <div className="flex-1 w-full">
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-left">
                      <p className="text-xs text-primary mb-2">utm.one short link</p>
                      <p className="text-sm text-foreground font-mono">
                        utm.one/summer24
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <QrCode className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">QR code</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">geo-targeting</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">analytics</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">AI insights</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Fold 4: Stats Strip */}
        <section className="relative z-10 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { stat: "99.99%", label: "uptime guarantee" },
                { stat: "<100ms", label: "redirect latency" },
                { stat: "5", label: "intelligence layers" },
                { stat: "4", label: "pricing tiers" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-6 text-center bg-card/30 backdrop-blur-xl rounded-2xl border border-border"
                >
                  <div className="text-4xl md:text-5xl font-display font-bold hero-gradient mb-2">
                    {item.stat}
                  </div>
                  <div className="text-sm uppercase text-muted-foreground tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Fold 5: Before/After Comparison */}
        <section className="relative z-10 py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold hero-gradient mb-4 lowercase">
                before vs. after utm.one
              </h2>
              <p className="text-lg text-muted-foreground">
                transform your link management workflow.
              </p>
            </motion.div>

            <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 text-center p-4 border-b border-border bg-muted/50">
                <div className="text-sm font-medium text-muted-foreground">Feature</div>
                <div className="text-sm font-medium text-destructive/80 flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Before
                </div>
                <div className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> After
                </div>
              </div>
              {comparisonItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-3 text-center p-4 border-b border-border last:border-b-0"
                >
                  <div className="text-sm font-medium text-foreground">{item.feature}</div>
                  <div className="text-sm text-muted-foreground">{item.before}</div>
                  <div className="text-sm text-foreground">{item.after}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fold 6: Final CTA */}
        <section className="relative z-10 py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 md:p-16 relative overflow-hidden bg-card/50 backdrop-blur-xl rounded-3xl border border-border"
            >
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_center,_hsl(var(--primary)_/_0.05)_0%,_transparent_60%)]" />
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 relative z-10 hero-gradient lowercase">
                ready to take control?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 relative z-10">
                join teams who measure what matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link to="/early-access">
                  <Button size="lg" variant="marketing" className="rounded-full px-10">
                    get started free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/book-demo">
                  <Button size="lg" variant="outline" className="rounded-full px-10 border-border hover:bg-muted">
                    book a demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <FloatingNavigation />
        <Footer />
      </div>
    </>
  );
}