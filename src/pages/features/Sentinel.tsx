import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CTAButton } from "@/components/ui/CTAButton";
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { SoftwareApplicationSchema } from "@/components/seo/SoftwareApplicationSchema";
import { 
  Shield, 
  Bot, 
  HeartPulse, 
  RefreshCw, 
  ShoppingCart, 
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

const Sentinel = () => {
  const faqs = [
    {
      question: "What is Sentinel Mode?",
      answer: "Sentinel Mode is utm.one's AI-powered link protection system. It actively monitors your links, detects bot traffic, checks destination health before redirecting, and automatically routes to fallback URLs when issues occur."
    },
    {
      question: "How does bot detection work?",
      answer: "Sentinel uses machine learning to analyze visitor patterns, user agents, behavior signals, and known bot signatures. It blocks crawlers and scrapers while allowing legitimate traffic through."
    },
    {
      question: "What happens when a destination is down?",
      answer: "When health preflight detects a failing destination (404, 500, SSL error, timeout), Sentinel automatically routes visitors to your configured fallback URL. You get notified, but visitors never see a broken page."
    },
    {
      question: "Does Sentinel slow down redirects?",
      answer: "No. Health checks run asynchronously and results are cached. The redirect happens in milliseconds."
    }
  ];

  const carouselItems = [
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
    },
    {
      icon: Activity,
      title: "real-time monitoring",
      description: "see exactly how sentinel protects your links. bots blocked, failures prevented, auto-heals triggered."
    },
    {
      icon: AlertTriangle,
      title: "instant alerts",
      description: "get notified when destinations fail or unusual traffic patterns emerge. stay ahead of issues."
    }
  ];

  const stats = [
    { value: "99.9", label: "uptime guarantee", suffix: "%" },
    { value: "50", label: "check latency", suffix: "ms" },
    { value: "15", label: "bot traffic blocked", suffix: "-30%" },
    { value: "0", label: "broken experiences", suffix: "" }
  ];

  const beforeAfterItems = [
    { feature: "bot traffic", before: "inflates analytics 15-30%", after: "clean human-only data" },
    { feature: "broken links", before: "visitors see 404 pages", after: "auto-heal routes instantly" },
    { feature: "QR scans", before: "fail when destination down", after: "always land on working page" },
    { feature: "inventory", before: "links to out-of-stock items", after: "shopify sync prevents dead ends" },
    { feature: "monitoring", before: "discover issues from complaints", after: "proactive real-time protection" }
  ];

  const capabilities = [
    {
      icon: Bot,
      title: "bot protection",
      features: ["ML pattern analysis", "user agent filtering", "behavior signals", "known bot signatures"]
    },
    {
      icon: HeartPulse,
      title: "health checks",
      features: ["preflight validation", "SSL monitoring", "response time tracking", "status code checks"]
    },
    {
      icon: RefreshCw,
      title: "auto-healing",
      features: ["instant fallback routing", "cascade rules", "zero downtime", "graceful degradation"]
    },
    {
      icon: Activity,
      title: "monitoring",
      features: ["real-time dashboard", "sentinel saves metric", "failure analytics", "protection reports"]
    }
  ];

  return (
    <FeatureLayout
      title="Sentinel Mode - AI Link Protection | utm.one"
      description="Protect your links with AI bot detection, health preflight checks, auto-heal fallbacks, and inventory-aware routing."
      canonical="https://utm.one/features/sentinel"
      keywords={["sentinel mode", "link protection", "bot detection", "link health", "auto-heal", "fallback URL"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Sentinel Mode", url: "https://utm.one/features/sentinel" },
      ]}
    >
      <FAQSchema questions={faqs} />
      <SoftwareApplicationSchema
        name="Sentinel Mode by utm.one"
        description="AI-powered link protection with bot detection, health checks, and auto-heal capabilities."
        category="BusinessApplication"
        url="https://utm.one/features/sentinel"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Shield className="w-4 h-4" />
              AI-powered protection
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold hero-gradient mb-6">
              sentinel mode.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              your links, protected 24/7. AI bot detection, health checks, and auto-heal—so your visitors never see a broken page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                get early access
              </CTAButton>
              <CTAButton href="/book-demo" variant="secondary">
                book a demo
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <FeatureCarouselSection
        headline="four layers of protection"
        subheadline="sentinel doesn't just monitor—it actively protects"
        items={carouselItems}
      />

      {/* Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Before/After */}
      <FeatureBeforeAfter
        headline="without sentinel vs with sentinel"
        subheadline="see the difference protection makes"
        items={beforeAfterItems}
      />

      {/* Showcase */}
      <FeatureShowcase
        headline="sentinel saves dashboard"
        subheadline="see exactly how sentinel protects your links"
      >
        <div className="aspect-video rounded-2xl bg-card/50 border border-border p-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-muted/30 text-center animate-fade-in">
              <Bot className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">2,847</p>
              <p className="text-xs text-muted-foreground">bots blocked</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 text-center animate-fade-in [animation-delay:100ms]">
              <HeartPulse className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">156</p>
              <p className="text-xs text-muted-foreground">failures prevented</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 text-center animate-fade-in [animation-delay:200ms]">
              <RefreshCw className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">89</p>
              <p className="text-xs text-muted-foreground">auto-heals triggered</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-mono">utm.one/promo-summer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">healthy</span>
                <span className="text-xs text-muted-foreground">12 saves today</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm font-mono">utm.one/flash-sale</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">auto-healed</span>
                <span className="text-xs text-muted-foreground">fallback active</span>
              </div>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      {/* Bento Grid */}
      <FeatureBentoGrid
        headline="protection pillars"
        subheadline="comprehensive link security"
        items={capabilities}
      />

      {/* Final CTA */}
      <FeatureFinalCTA
        headline="protect your links today"
        subheadline="join teams using sentinel to ensure every click lands on a working page"
      />
    </FeatureLayout>
  );
};

export default Sentinel;