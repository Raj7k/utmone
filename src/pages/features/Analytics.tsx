import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureControlDeck } from "@/components/features/FeatureControlDeck";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CTAButton } from "@/components/ui/CTAButton";
import {
  AttributionFlowVisual,
  CrossDeviceVisual,
  PredictionVisual,
  AICommandVisual,
  AnomalyRadarVisual,
} from "@/components/features/visuals/FeatureVisuals";
import {
  RevenueWaterfallVisual,
  UTMDecayAlertVisual,
  BudgetReallocationVisual,
  ConversionLagHeatmapVisual,
  SaturationCurveVisual,
  RealTimePulseVisual,
} from "@/components/features/visuals/EnhancedFeatureVisuals";
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
  MessageSquare,
  DollarSign,
  AlertTriangle,
  Clock,
  Activity,
  Waves,
  PieChart
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const controlDeckTabs = [
  {
    id: "revenue-waterfall",
    icon: DollarSign,
    label: "revenue waterfall",
    headline: "see money flow.",
    subheadline: "interactive waterfall shows exactly where revenue comes from—by UTM, by channel, by campaign.",
    visual: <RevenueWaterfallVisual />,
  },
  {
    id: "decay-alerts",
    icon: AlertTriangle,
    label: "UTM decay alerts",
    headline: "stale parameters detected.",
    subheadline: "we alert you when UTM performance drops. catch decay before your reports lie.",
    visual: <UTMDecayAlertVisual />,
  },
  {
    id: "budget-ai",
    icon: Brain,
    label: "budget reallocation AI",
    headline: "spend smarter.",
    subheadline: "AI shows where to move budget for maximum ROI. data-backed, not gut-based.",
    visual: <BudgetReallocationVisual />,
  },
  {
    id: "conversion-lag",
    icon: Clock,
    label: "conversion lag heatmap",
    headline: "time to convert.",
    subheadline: "visualize how long each channel takes to close. plan campaigns with timing insight.",
    visual: <ConversionLagHeatmapVisual />,
  },
  {
    id: "saturation",
    icon: Waves,
    label: "channel saturation",
    headline: "when enough is enough.",
    subheadline: "see diminishing returns before you overspend on saturated channels.",
    visual: <SaturationCurveVisual />,
  },
  {
    id: "pulse",
    icon: Activity,
    label: "real-time pulse",
    headline: "live campaign vitals.",
    subheadline: "heartbeat monitor for your active campaigns. green = healthy, red = needs attention.",
    visual: <RealTimePulseVisual />,
  },
];

const Analytics = () => {
  const carouselItems = [
    {
      icon: DollarSign,
      title: "revenue waterfall",
      description: "see exactly where revenue flows—by UTM, channel, campaign. interactive drill-down."
    },
    {
      icon: GitBranch,
      title: "multi-touch attribution",
      description: "7 models show each touchpoint's true contribution to revenue—not just last-click."
    },
    {
      icon: Smartphone,
      title: "cross-device identity",
      description: "stitch mobile → desktop → app sessions. see the complete journey, not fragments."
    },
    {
      icon: Brain,
      title: "budget reallocation AI",
      description: "AI shows where to move budget for maximum ROI. data-backed recommendations."
    },
    {
      icon: AlertTriangle,
      title: "UTM decay alerts",
      description: "get notified when UTM performance drops. catch decay before it corrupts reports."
    },
    {
      icon: Clock,
      title: "conversion lag analysis",
      description: "how long does each channel take to convert? plan campaigns with timing insight."
    },
    {
      icon: Waves,
      title: "saturation curves",
      description: "see diminishing returns before you overspend. know when enough is enough."
    },
    {
      icon: Activity,
      title: "real-time pulse",
      description: "heartbeat monitor for campaigns. green = healthy, red = needs attention."
    }
  ];

  const stats = [
    { value: "7", label: "attribution models", suffix: "" },
    { value: "92", label: "forecast accuracy", suffix: "%" },
    { value: "<100", label: "latency", suffix: "ms" },
    { value: "$2.4M", label: "avg revenue attributed", suffix: "" },
  ];

  const beforeAfterItems = [
    { feature: "revenue visibility", before: "clicks only", after: "full revenue waterfall" },
    { feature: "attribution", before: "last-click bias", after: "7 multi-touch models" },
    { feature: "budget decisions", before: "gut feelings", after: "AI-powered reallocation" },
    { feature: "performance decay", before: "missed entirely", after: "instant decay alerts" },
    { feature: "channel saturation", before: "overspend blindly", after: "see diminishing returns" },
    { feature: "campaign health", before: "check manually", after: "real-time pulse monitor" }
  ];

  const capabilities = [
    {
      icon: DollarSign,
      title: "Revenue Intelligence",
      features: ["Revenue waterfall", "Channel ROI", "Campaign attribution", "Deal tracking"]
    },
    {
      icon: GitBranch,
      title: "Attribution Models",
      features: ["Linear", "Time-decay", "Position-based", "First/last-click", "W-shaped", "Custom"]
    },
    {
      icon: Brain,
      title: "AI Insights",
      features: ["Budget reallocation", "Performance predictions", "Natural language queries", "Smart recommendations"]
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      features: ["Campaign pulse", "UTM decay alerts", "Saturation curves", "Anomaly detection"]
    }
  ];

  return (
    <FeatureLayout
      title="Revenue Intelligence - From Clicks to Revenue | utm.one"
      description="Stop counting clicks. Start measuring revenue. Multi-touch attribution, revenue waterfall, budget AI, and real-time campaign monitoring."
      canonical="https://utm.one/features/analytics"
      keywords={["revenue intelligence", "multi-touch attribution", "marketing analytics", "revenue waterfall", "budget optimization"]}
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
              from clicks<br />to revenue.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              utm.one doesn't just count clicks. it shows which touchpoints actually drive revenue—with AI recommendations to spend smarter.
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

      {/* Control Deck - New Features */}
      <FeatureControlDeck
        tabs={controlDeckTabs}
        badge={{ title: "Clean Track Intelligence™", subtitle: "AI-powered analytics" }}
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
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "book a demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
};

export default Analytics;
