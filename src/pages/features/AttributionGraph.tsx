import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/StaticFeatureHero";
import { FeatureCarouselSection } from "@/components/features/StaticFeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/StaticFeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/StaticFeatureShowcase";
import { FeatureControlDeck } from "@/components/features/StaticFeatureControlDeck";
import {
  AttributionFlowVisual,
  CrossDeviceVisual,
  PredictionVisual,
} from "@/components/features/visuals/FeatureVisuals";
import { motion } from "framer-motion";
import { GitBranch, Target, BarChart3, Lightbulb, DollarSign, TrendingUp, Layers, Workflow, Route, RefreshCw } from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Journey Flow Visual for Attribution
const JourneyFlowVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Journey path */}
      <motion.path
        d="M40,90 Q100,40 160,90 T280,90"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Touchpoint nodes */}
      {[
        { x: 40, label: "First" },
        { x: 120, label: "Middle" },
        { x: 200, label: "Assist" },
        { x: 280, label: "Convert" },
      ].map((node, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}>
          <circle cx={node.x} cy="90" r={i === 3 ? 14 : 10} fill={i === 3 ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.1)"} stroke={i === 3 ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.3)"} strokeWidth="2" />
          <text x={node.x} y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">{node.label}</text>
        </motion.g>
      ))}
      {/* Moving particle */}
      <motion.circle
        r="4"
        fill="rgba(255,255,255,0.9)"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        style={{ offsetPath: 'path("M40,90 Q100,40 160,90 T280,90")' } as any}
      />
    </svg>
  </div>
);

// Revenue Channel Visual
const RevenueChannelVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Channel bars */}
      {[
        { label: "LinkedIn", pct: 32, color: "rgba(10,102,194,0.6)" },
        { label: "Email", pct: 28, color: "rgba(255,255,255,0.4)" },
        { label: "Content", pct: 18, color: "rgba(74,222,128,0.5)" },
        { label: "Google", pct: 22, color: "rgba(251,191,36,0.5)" },
      ].map((channel, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <text x="30" y={45 + i * 35} fill="rgba(255,255,255,0.6)" fontSize="10">{channel.label}</text>
          <rect x="90" y={35 + i * 35} width="0" height="16" rx="4" fill="rgba(255,255,255,0.1)" />
          <motion.rect
            x="90" y={35 + i * 35}
            width={channel.pct * 5}
            height="16" rx="4"
            fill={channel.color}
            initial={{ width: 0 }}
            animate={{ width: channel.pct * 5 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
          />
          <motion.text
            x={100 + channel.pct * 5}
            y={47 + i * 35}
            fill="rgba(255,255,255,0.8)"
            fontSize="10"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            {channel.pct}%
          </motion.text>
        </motion.g>
      ))}
    </svg>
  </div>
);

// CRM Sync Visual
const CRMSyncVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* utm.one box */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <rect x="30" y="60" width="80" height="60" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="70" y="95" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontWeight="bold">utm.one</text>
      </motion.g>
      {/* Sync arrows */}
      <motion.path
        d="M120,90 L180,90"
        stroke="rgba(74,222,128,0.5)"
        strokeWidth="2"
        strokeDasharray="6 4"
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.circle
        cx="150" cy="90" r="12"
        fill="rgba(74,222,128,0.1)"
        stroke="rgba(74,222,128,0.4)"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ delay: 0.5, duration: 1, type: "spring" }}
      />
      {/* CRM boxes */}
      {["HubSpot", "Salesforce"].map((crm, i) => (
        <motion.g key={crm} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
          <rect x="200" y={50 + i * 40} width="90" height="35" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="245" y={72 + i * 40} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">{crm}</text>
        </motion.g>
      ))}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(74,222,128,0.5)" />
        </marker>
      </defs>
    </svg>
  </div>
);

const controlDeckTabs = [
  {
    id: "journey",
    icon: Route,
    label: "journey tracking",
    headline: "every touchpoint captured.",
    subheadline: "30-day lookback window tracks the complete path from first anonymous visit to final sale.",
    visual: <JourneyFlowVisual />,
  },
  {
    id: "intelligence",
    icon: Lightbulb,
    label: "Clean Track Intelligence™",
    headline: "probabilistic credit.",
    subheadline: "which touchpoints caused the conversion, not just appeared. MIT & Harvard algorithms.",
    visual: <AttributionFlowVisual />,
  },
  {
    id: "revenue",
    icon: DollarSign,
    label: "revenue attribution",
    headline: "channel ROI revealed.",
    subheadline: "see exactly which channels drive revenue. prove marketing's contribution to the board.",
    visual: <RevenueChannelVisual />,
  },
  {
    id: "cross-device",
    icon: Layers,
    label: "cross-device tracking",
    headline: "unified journeys.",
    subheadline: "stitch journeys across devices. 80-85% cross-device journey capture accuracy.",
    visual: <CrossDeviceVisual />,
  },
  {
    id: "crm",
    icon: RefreshCw,
    label: "CRM push",
    headline: "auto-sync deals.",
    subheadline: "push attribution data to HubSpot & Salesforce. close the loop on marketing ROI.",
    visual: <CRMSyncVisual />,
  },
];

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

      {/* Control Deck */}
      <FeatureControlDeck
        tabs={controlDeckTabs}
        badge={{ title: "Clean Track Intelligence™", subtitle: "probabilistic attribution" }}
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
