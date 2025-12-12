import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { motion } from "framer-motion";
import { GitBranch, Target, BarChart3, Lightbulb, DollarSign, TrendingUp, Layers, Workflow } from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AttributionGraph() {
  const carouselItems = [
    {
      title: "Multi-Touch Attribution",
      description: "See every touchpoint in the customer journey. Credit distributed by actual contribution.",
      icon: GitBranch,
    },
    {
      title: "Clean Track Intelligence™",
      description: "Probabilistic credit distribution. Which touchpoints caused the conversion, not just appeared.",
      icon: Lightbulb,
    },
    {
      title: "Journey Visualization",
      description: "Beautiful flow diagrams showing the path from first touch to conversion.",
      icon: Workflow,
    },
    {
      title: "Revenue Attribution",
      description: "Know exactly which channels drive revenue. Prove marketing's contribution to the board.",
      icon: DollarSign,
    },
    {
      title: "Cross-Device Tracking",
      description: "Stitch journeys across devices. 80-85% cross-device journey capture.",
      icon: Layers,
    },
    {
      title: "GA4 Comparison",
      description: "Side-by-side: see what GA4 hides. Reveal the hidden 30-50% attribution.",
      icon: BarChart3,
    },
  ];

  const stats = [
    { value: "30-50", label: "Hidden Attribution", suffix: "%" },
    { value: "85", label: "Cross-Device Accuracy", suffix: "%" },
    { value: "30", label: "Day Lookback", suffix: "days" },
    { value: "0", label: "Extra Setup", suffix: "" },
  ];

  const beforeAfterItems = [
    { feature: "Attribution Model", before: "Last-click only", after: "Multi-touch probabilistic" },
    { feature: "Upper Funnel Credit", before: "0% (invisible)", after: "True contribution revealed" },
    { feature: "Cross-Device", before: "Siloed by device", after: "Unified journey view" },
    { feature: "Budget Decisions", before: "Based on lies", after: "Based on real data" },
    { feature: "Marketing ROI Proof", before: "Impossible", after: "Board-ready reports" },
  ];

  const capabilities = [
    {
      icon: GitBranch,
      title: "Journey Tracking",
      features: ["Every touchpoint logged", "30-day window", "Cross-device stitching", "Offline + online"],
    },
    {
      icon: BarChart3,
      title: "Attribution Models",
      features: ["Clean Track Intelligence™", "First-touch", "Last-touch", "Linear comparison"],
    },
    {
      icon: DollarSign,
      title: "Revenue Intelligence",
      features: ["Deal attribution", "Channel ROI", "Campaign contribution", "Pipeline attribution"],
    },
    {
      icon: Workflow,
      title: "Integrations",
      features: ["CRM push (HubSpot/SF)", "GA4 comparison", "Webhook events", "API access"],
    },
  ];

  // Journey visualization data
  const journeySteps = [
    { channel: "LinkedIn", credit: 32, position: "first" },
    { channel: "Email", credit: 28, position: "middle" },
    { channel: "Blog", credit: 18, position: "middle" },
    { channel: "Google", credit: 22, position: "last" },
  ];

  return (
    <FeatureLayout
      title="Attribution Graph - Finally Know Where Revenue Comes From - utm.one"
      description="Tired of Google taking 100% credit? utm.one reveals the true contribution of every marketing touchpoint."
      canonical="https://utm.one/features/attribution-graph"
      keywords={["attribution modeling", "multi-touch attribution", "customer journey", "marketing attribution"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Attribution Graph", url: "https://utm.one/features/attribution-graph" },
      ]}
    >
      <FeatureHero
        headlineLine1="finally know where"
        headlineLine2="revenue comes from."
        subheadline="Tired of Google taking 100% credit? We reveal the true contribution of every touchpoint in the customer journey."
      />

      <FeatureCarouselSection
        headline="True Attribution"
        subheadline="Every touchpoint gets the credit it deserves"
        items={carouselItems}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="The Truth vs The Lie"
        subheadline="See what last-click attribution hides"
        items={beforeAfterItems}
      />

      <FeatureShowcase
        headline="Customer Journey Visualization"
        subheadline="Every touchpoint. Every contribution. One beautiful flow."
      >
        <div className="bg-background/50 rounded-xl border border-border p-8">
          {/* Journey flow */}
          <div className="flex items-center justify-between relative">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 80 50 Q 200 20, 280 50 Q 400 80, 480 50 Q 600 20, 680 50"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: appleEase }}
              />
            </svg>
            
            {journeySteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: appleEase }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-lg font-bold text-primary">{step.credit}%</span>
                </div>
                <h3 className="text-sm font-semibold">{step.channel}</h3>
                <p className="text-xs text-muted-foreground capitalize">{step.position} touch</p>
              </motion.div>
            ))}
            
            {/* Conversion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5, ease: appleEase }}
              className="relative z-10 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-3 mx-auto shadow-lg shadow-primary/30">
                <DollarSign className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-semibold">Conversion</h3>
              <p className="text-xs text-primary font-medium">$15,000</p>
            </motion.div>
          </div>
          
          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5, ease: appleEase }}
            className="mt-10 grid grid-cols-2 gap-4"
          >
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <h4 className="text-sm font-semibold text-destructive/80 mb-2">GA4 Last-Click</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LinkedIn</span>
                  <span className="line-through text-muted-foreground/50">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="line-through text-muted-foreground/50">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blog</span>
                  <span className="line-through text-muted-foreground/50">0%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Google</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="text-sm font-semibold text-primary mb-2">utm.one Attribution</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LinkedIn</span>
                  <span className="text-primary font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-primary font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blog</span>
                  <span className="text-primary font-medium">18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Google</span>
                  <span className="text-primary font-medium">22%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </FeatureShowcase>

      <FeatureBentoGrid
        headline="Complete Attribution Stack"
        subheadline="Everything you need to prove marketing's contribution"
        capabilities={capabilities}
      />

      <FeatureShowcase
        headline="Revenue by Channel"
        subheadline="See the real ROI of every marketing investment"
        background="muted"
      >
        <div className="bg-background/50 rounded-xl border border-border p-6">
          <div className="space-y-4">
            {[
              { channel: "LinkedIn Ads", revenue: "$48,200", contribution: 32, color: "bg-[#0A66C2]" },
              { channel: "Email Marketing", revenue: "$42,000", contribution: 28, color: "bg-primary" },
              { channel: "Content/SEO", revenue: "$27,000", contribution: 18, color: "bg-emerald-500" },
              { channel: "Google Ads", revenue: "$33,000", contribution: 22, color: "bg-amber-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: appleEase }}
                className="flex items-center gap-4"
              >
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium w-32">{item.channel}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.contribution}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: appleEase }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
                <span className="text-sm font-bold w-20 text-right">{item.revenue}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">{item.contribution}%</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Attributed Revenue</span>
            <span className="text-xl font-bold text-primary">$150,200</span>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="Ready to See the Full Picture?"
        subheadline="Stop letting last-click steal credit from your best channels."
        primaryCTA={{ label: "Get Started Free", href: "/early-access" }}
        secondaryCTA={{ label: "See a Demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
}
