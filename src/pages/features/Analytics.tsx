import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureCarouselSection } from "@/components/features/StaticFeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/StaticFeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/StaticFeatureShowcase";
import { FeatureControlDeck } from "@/components/features/StaticFeatureControlDeck";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CTAButton } from "@/components/ui/CTAButton";
import {
  AttributionFlowVisual,
  CrossDeviceVisual,
  PredictionVisual,
  AICommandVisual,
  AnomalyRadarVisual,
} from "@/components/features/visuals/FeatureVisuals";
import { RevenueIntelligenceDashboard } from "@/components/features/visuals/RevenueIntelligenceDashboard";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  GitBranch, 
  Smartphone, 
  Brain, 
  Bell, 
  Target,
  Zap,
  Route,
  MessageSquare
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const controlDeckTabs = [
  {
    id: "attribution",
    icon: GitBranch,
    label: "multi-touch attribution",
    headline: "every touchpoint credited.",
    subheadline: "7 attribution models show each channel's true contribution to revenue—not just last-click.",
    visual: <AttributionFlowVisual />,
  },
  {
    id: "cross-device",
    icon: Smartphone,
    label: "cross-device identity",
    headline: "unified customer view.",
    subheadline: "stitch mobile → desktop → app sessions. see the complete journey, not device fragments.",
    visual: <CrossDeviceVisual />,
  },
  {
    id: "forecasting",
    icon: TrendingUp,
    label: "predictive forecasting",
    headline: "see 7 days ahead.",
    subheadline: "traffic predictions with 85-92% accuracy. plan campaigns with confidence intervals.",
    visual: <PredictionVisual />,
  },
  {
    id: "ai",
    icon: Brain,
    label: "AI command center",
    headline: "ask anything.",
    subheadline: "natural language queries: 'which campaign had best ROI?' get instant, data-backed answers.",
    visual: <AICommandVisual />,
  },
  {
    id: "anomaly",
    icon: Bell,
    label: "anomaly detection",
    headline: "24/7 pulse monitoring.",
    subheadline: "get alerts when traffic spikes or drops unexpectedly. never miss a viral moment.",
    visual: <AnomalyRadarVisual />,
  },
];

const Analytics = () => {
  const carouselItems = [
    {
      icon: GitBranch,
      title: "multi-touch attribution",
      description: "7 attribution models show each touchpoint's true contribution to revenue—not just last-click."
    },
    {
      icon: Smartphone,
      title: "cross-device identity",
      description: "stitch mobile → desktop → app sessions. see the complete journey, not device fragments."
    },
    {
      icon: Route,
      title: "customer journey flow",
      description: "sankey diagrams show how prospects flow through touchpoints to conversion."
    },
    {
      icon: TrendingUp,
      title: "traffic forecasting",
      description: "7-day predictions with 85-92% accuracy. plan campaigns with confidence intervals."
    },
    {
      icon: Brain,
      title: "AI command center",
      description: "ask questions in plain english. 'which campaign had the best ROI?' get instant answers."
    },
    {
      icon: Bell,
      title: "anomaly detection",
      description: "pulse watchdog monitors your data 24/7. get alerts when traffic spikes or drops."
    },
    {
      icon: Target,
      title: "topic attribution",
      description: "which content themes drive conversions? fingerprint your content and track what resonates."
    },
    {
      icon: MessageSquare,
      title: "smart insights",
      description: "auto-generated recommendations. surface hidden opportunities. spot trends first."
    }
  ];

  const stats = [
    { value: "7", label: "attribution models", suffix: "" },
    { value: "85", label: "forecast accuracy", suffix: "%" },
    { value: "24", label: "monitoring", suffix: "/7" },
    { value: "100", label: "latency", suffix: "ms" }
  ];

  const beforeAfterItems = [
    { feature: "attribution", before: "last-click only", after: "7 multi-touch models" },
    { feature: "cross-device", before: "fragmented silos", after: "unified identity graph" },
    { feature: "forecasting", before: "gut feelings", after: "85-92% accuracy predictions" },
    { feature: "insights", before: "manual reports", after: "AI-powered answers" },
    { feature: "anomalies", before: "missed entirely", after: "instant pulse alerts" }
  ];

  const capabilities = [
    {
      icon: GitBranch,
      title: "attribution models",
      features: ["linear", "time-decay", "position-based", "first-click", "last-click", "w-shaped", "custom weighted"]
    },
    {
      icon: Smartphone,
      title: "identity graph",
      features: ["cross-device stitching", "probabilistic matching", "login identity sync", "session unification"]
    },
    {
      icon: TrendingUp,
      title: "predictions",
      features: ["traffic forecasting", "conversion predictions", "best time analysis", "lift modeling"]
    },
    {
      icon: Brain,
      title: "AI intelligence",
      features: ["natural language queries", "smart recommendations", "anomaly detection", "automated reports"]
    }
  ];

  return (
    <FeatureLayout
      title="Revenue Intelligence | utm.one"
      description="Stop counting clicks. Start measuring revenue. Multi-touch attribution, customer journey visualization, predictive forecasting, and AI-powered insights."
      canonical="https://utm.one/features/analytics"
      keywords={["revenue intelligence", "multi-touch attribution", "marketing analytics", "customer journey", "predictive analytics"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Revenue Intelligence", url: "https://utm.one/features/analytics" },
      ]}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: appleEase }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Zap className="w-4 h-4" />
              revenue intelligence platform
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold hero-gradient mb-6">
              from clicks to revenue.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              utm.one doesn't just count clicks. it shows which touchpoints actually drive revenue—across devices, channels, and time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                start free
              </CTAButton>
              <CTAButton href="/book-demo" variant="secondary">
                book a demo
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Control Deck */}
      <FeatureControlDeck
        tabs={controlDeckTabs}
        badge={{ title: "Clean Track Intelligence™", subtitle: "MIT & Harvard algorithms" }}
      />

      {/* Carousel Section */}
      <FeatureCarouselSection
        headline="everything you need to understand revenue"
        subheadline="8 capabilities working together"
        items={carouselItems}
      />

      {/* Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Before/After */}
      <FeatureBeforeAfter
        headline="analytics, transformed"
        subheadline="from scattered clicks to unified revenue intelligence"
        items={beforeAfterItems}
      />

      {/* Showcase */}
      <FeatureShowcase
        headline="see the complete picture"
        subheadline="every touchpoint, every device, every conversion"
      >
        <RevenueIntelligenceDashboard />
      </FeatureShowcase>

      {/* Bento Grid */}
      <FeatureBentoGrid
        headline="built for revenue teams"
        subheadline="four pillars of intelligence"
        items={capabilities}
      />

      {/* Final CTA */}
      <FeatureFinalCTA
        headline="ready to see what's really working?"
        subheadline="join teams measuring revenue, not just clicks"
      />
    </FeatureLayout>
  );
};

export default Analytics;
