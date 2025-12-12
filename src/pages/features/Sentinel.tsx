import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ShieldCheck, HeartPulse, RefreshCw, ShoppingCart, ArrowRight, Bot, Zap, Activity, CheckCircle2, XCircle, Clock, TrendingUp, AlertTriangle, Layers } from "lucide-react";
import { FeatureLayout } from "@/components/features/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { SoftwareApplicationSchema } from "@/components/seo/SoftwareApplicationSchema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Sentinel = () => {
  const features = [
    {
      icon: Bot,
      title: "AI bot detection",
      description: "machine learning identifies and blocks crawlers, scrapers, and bot traffic while allowing real humans through."
    },
    {
      icon: HeartPulse,
      title: "health preflight",
      description: "checks destination URL before redirecting. catches 404s, SSL errors, and broken pages in real-time."
    },
    {
      icon: RefreshCw,
      title: "auto-heal",
      description: "when a destination fails, sentinel automatically routes to your fallback URL. zero broken experiences."
    },
    {
      icon: ShoppingCart,
      title: "shopify sync",
      description: "inventory-aware routing. automatically disable links for out-of-stock products."
    }
  ];

  const useCases = [
    { title: "paid ads", example: "protect ad spend from bot clicks", impact: "save 15-30% budget" },
    { title: "affiliate links", example: "ensure commissions aren't lost", impact: "99.9% uptime" },
    { title: "QR campaigns", example: "never show broken pages", impact: "zero bad scans" },
    { title: "email campaigns", example: "prevent bounced clicks", impact: "higher CTR" }
  ];

  const faqs = [
    {
      question: "What is Sentinel Mode?",
      answer: "Sentinel Mode is utm.one's AI-powered link protection system. It actively monitors your links, detects bot traffic, checks destination health before redirecting, and automatically routes to fallback URLs when issues occur."
    },
    {
      question: "How does bot detection work?",
      answer: "Sentinel uses machine learning to analyze visitor patterns, user agents, behavior signals, and known bot signatures. It blocks crawlers and scrapers while allowing legitimate traffic through, protecting your analytics from inflation."
    },
    {
      question: "What happens when a destination is down?",
      answer: "When health preflight detects a failing destination (404, 500, SSL error, timeout), Sentinel automatically routes visitors to your configured fallback URL. You get notified, but your visitors never see a broken page."
    },
    {
      question: "Does Sentinel slow down redirects?",
      answer: "No. Health checks run asynchronously and results are cached. The redirect happens in milliseconds. Failed destinations are detected proactively, not at click time."
    },
    {
      question: "How does Shopify sync work?",
      answer: "Connect your Shopify store and Sentinel will check product inventory status. When a product goes out of stock, links to that product automatically route to an alternative (category page, similar product, or custom fallback)."
    },
    {
      question: "Can I enable Sentinel on specific links only?",
      answer: "Yes. Sentinel can be enabled per-link or in bulk across your entire workspace. You control the protection level for each link."
    },
    {
      question: "What analytics does Sentinel provide?",
      answer: "Sentinel tracks bots blocked, health check failures prevented, auto-heals triggered, and uptime percentage. The 'Sentinel Saves' metric shows how many bad experiences were prevented."
    },
    {
      question: "Is Sentinel available on all plans?",
      answer: "Basic bot detection is available on Starter. Full Sentinel Mode with health preflight, auto-heal, and Shopify sync requires Growth or Business plans."
    }
  ];

  return (
    <FeatureLayout
      title="Sentinel Mode - AI Link Protection | utm.one"
      description="Protect your links with AI bot detection, health preflight checks, auto-heal fallbacks, and inventory-aware routing."
      canonical="https://utm.one/features/sentinel"
      keywords={["sentinel mode", "link protection", "bot detection", "link health", "auto-heal", "fallback URL", "shopify sync"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Sentinel Mode", url: "https://utm.one/features/sentinel" }
      ]}
    >
      <FAQSchema questions={faqs} />
      <SoftwareApplicationSchema
        name="Sentinel Mode by utm.one"
        description="AI-powered link protection with bot detection, health checks, and auto-heal capabilities."
        category="BusinessApplication"
        url="https://utm.one/features/sentinel"
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-12 px-4 overflow-hidden">
          <RetroGradientMesh />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
                <Shield className="w-4 h-4" />
                AI-powered link protection
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight obsidian-platinum-text leading-tight">
                sentinel mode
              </h1>
              
              <p className="text-xl text-obsidian-text-muted max-w-2xl mx-auto">
                your links, protected 24/7. AI bot detection, health checks, and auto-heal—so your visitors never see a broken page.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/early-access">get early access<ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "99.9%", label: "uptime guarantee" },
                { value: "<50ms", label: "check latency" },
                { value: "15-30%", label: "bot traffic blocked" },
                { value: "0", label: "broken experiences" }
              ].map((stat) => (
                <Card key={stat.label} className="p-4 bg-card border-border text-center">
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold obsidian-platinum-text">
                four layers of protection
              </h2>
              <p className="text-obsidian-text-muted mt-4 max-w-2xl mx-auto">
                sentinel doesn't just monitor—it actively protects every click.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-card border-border h-full">
                    <feature.icon className="w-10 h-10 text-white mb-4" />
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After */}
        <section className="px-4 py-20 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">
              without sentinel vs with sentinel
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-destructive/5 border-destructive/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  without sentinel
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    bots inflate your click analytics by 15-30%
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    visitors land on 404 pages from broken links
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    QR scans fail when destination is down
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    out-of-stock products frustrate customers
                  </li>
                </ul>
              </Card>
              <Card className="p-6 bg-white/5 border-white/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-status-success" />
                  with sentinel
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    clean analytics with real human clicks only
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    auto-heal routes to fallback instantly
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    every scan lands on a working page
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    inventory sync prevents dead-end experiences
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Sentinel Dashboard Mockup */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4"><Activity className="w-3 h-3 mr-1" />real-time monitoring</Badge>
              <h2 className="text-2xl font-display font-bold obsidian-platinum-text">sentinel saves dashboard</h2>
              <p className="text-obsidian-text-muted mt-2">see exactly how sentinel protects your links</p>
            </div>
            
            <Card className="p-6 bg-card border-border">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-white/5 text-center">
                  <Bot className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-display font-bold text-white">2,847</p>
                  <p className="text-xs text-muted-foreground">bots blocked</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 text-center">
                  <HeartPulse className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-display font-bold text-white">156</p>
                  <p className="text-xs text-muted-foreground">failures prevented</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 text-center">
                  <RefreshCw className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-display font-bold text-white">89</p>
                  <p className="text-xs text-muted-foreground">auto-heals triggered</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    <span className="text-sm text-foreground font-mono">utm.one/promo-summer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">healthy</Badge>
                    <span className="text-xs text-muted-foreground">12 saves today</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm text-foreground font-mono">utm.one/flash-sale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">auto-healed</Badge>
                    <span className="text-xs text-muted-foreground">fallback active</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Use Cases */}
        <section className="px-4 py-20 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">
              protect every campaign type
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((uc) => (
                <Card key={uc.title} className="p-4 bg-card border-border text-center">
                  <h3 className="font-semibold text-foreground">{uc.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{uc.example}</p>
                  <p className="text-sm text-status-success font-medium mt-2">{uc.impact}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">
              frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold obsidian-platinum-text mb-4">
              protect your links today
            </h2>
            <p className="text-obsidian-text-muted mb-8">
              join teams using sentinel to ensure every click lands on a working page.
            </p>
            <Button asChild size="lg">
              <Link to="/early-access">get early access<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
    </FeatureLayout>
  );
};

export default Sentinel;
