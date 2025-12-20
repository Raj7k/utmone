import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureControlDeck } from "@/components/features/FeatureControlDeck";
import {
  AttributionFlowVisual,
  CrossDeviceVisual,
} from "@/components/features/visuals/FeatureVisuals";
import {
  IncrementalLiftVisual,
  MarketingMixVisual,
  CausalInferenceVisual,
  ModelComparisonVisual,
  HoldoutTestVisual,
  DiminishingReturnsVisual,
} from "@/components/features/visuals/EnhancedFeatureVisuals";
import { 
  GitBranch, 
  Target, 
  BarChart3, 
  Lightbulb, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Workflow, 
  Route, 
  RefreshCw,
  FlaskConical,
  PieChart,
  Zap,
  Scale,
  TestTube,
  TrendingDown
} from "lucide-react";

// Control Deck tabs with new causal/scientific features
const controlDeckTabs = [
  {
    id: "incremental-lift",
    icon: FlaskConical,
    label: "incremental lift",
    headline: "prove causation, not correlation.",
    subheadline: "statistical holdout testing shows what marketing actually caused—not just appeared before.",
    visual: <IncrementalLiftVisual />,
  },
  {
    id: "marketing-mix",
    icon: PieChart,
    label: "marketing mix model",
    headline: "the big picture view.",
    subheadline: "model channel interactions at scale. see how paid, organic, and earned work together.",
    visual: <MarketingMixVisual />,
  },
  {
    id: "causal-inference",
    icon: Zap,
    label: "causal inference",
    headline: "if you hadn't spent, would they have bought?",
    subheadline: "counterfactual analysis shows true incremental impact of each dollar.",
    visual: <CausalInferenceVisual />,
  },
  {
    id: "model-comparison",
    icon: Scale,
    label: "model arena",
    headline: "7 models. one truth.",
    subheadline: "compare linear, time-decay, position-based, and Clean Track Intelligence™ side by side.",
    visual: <ModelComparisonVisual />,
  },
  {
    id: "holdout-tests",
    icon: TestTube,
    label: "geo holdout tests",
    headline: "run tests while you sleep.",
    subheadline: "automated geo and audience holdouts prove marketing's true contribution.",
    visual: <HoldoutTestVisual />,
  },
  {
    id: "diminishing-returns",
    icon: TrendingDown,
    label: "diminishing returns",
    headline: "know when to stop.",
    subheadline: "visualize channel saturation. stop throwing money at diminishing returns.",
    visual: <DiminishingReturnsVisual />,
  },
];

// Journey Flow Visual (CSS-only)
const JourneyFlowVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      <path
        d="M40,90 Q100,40 160,90 T280,90"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        strokeDasharray="8 4"
        className="animate-fade-in"
      />
      {[
        { x: 40, label: "First" },
        { x: 120, label: "Middle" },
        { x: 200, label: "Assist" },
        { x: 280, label: "Convert" },
      ].map((node, i) => (
        <g key={i} className="animate-scale-in" style={{ animationDelay: `${300 + i * 150}ms` }}>
          <circle cx={node.x} cy="90" r={i === 3 ? 14 : 10} fill={i === 3 ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.1)"} stroke={i === 3 ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.3)"} strokeWidth="2" />
          <text x={node.x} y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">{node.label}</text>
        </g>
      ))}
    </svg>
  </div>
);

// Revenue Channel Visual (CSS-only)
const RevenueChannelVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {[
        { label: "LinkedIn", pct: 32, color: "rgba(10,102,194,0.6)" },
        { label: "Email", pct: 28, color: "rgba(255,255,255,0.4)" },
        { label: "Content", pct: 18, color: "rgba(74,222,128,0.5)" },
        { label: "Google", pct: 22, color: "rgba(251,191,36,0.5)" },
      ].map((channel, i) => (
        <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <text x="30" y={45 + i * 35} fill="rgba(255,255,255,0.6)" fontSize="10">{channel.label}</text>
          <rect x="90" y={35 + i * 35} width="0" height="16" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect
            x="90" y={35 + i * 35}
            width={channel.pct * 5}
            height="16" rx="4"
            fill={channel.color}
            className="animate-scale-in"
            style={{ animationDelay: `${300 + i * 100}ms` }}
          />
          <text
            x={100 + channel.pct * 5}
            y={47 + i * 35}
            fill="rgba(255,255,255,0.8)"
            fontSize="10"
            fontWeight="bold"
            className="animate-fade-in"
            style={{ animationDelay: `${600 + i * 100}ms` }}
          >
            {channel.pct}%
          </text>
        </g>
      ))}
    </svg>
  </div>
);

export default function AttributionGraph() {
  const carouselItems = [
    {
      title: "incremental lift modeling",
      description: "prove causation, not correlation. statistical holdouts show what marketing actually caused.",
      icon: FlaskConical,
    },
    {
      title: "marketing mix modeling",
      description: "see the big picture. how paid, organic, and earned channels work together at scale.",
      icon: PieChart,
    },
    {
      title: "causal inference engine",
      description: "counterfactual analysis: if you hadn't spent, would they have bought?",
      icon: Zap,
    },
    {
      title: "Clean Track Intelligence™",
      description: "probabilistic credit distribution. which touchpoints caused the conversion, not just appeared.",
      icon: Lightbulb,
    },
    {
      title: "model comparison arena",
      description: "7 models side by side. see how linear, time-decay, and position-based differ.",
      icon: Scale,
    },
    {
      title: "geo holdout automation",
      description: "run tests while you sleep. automated geographic and audience holdouts.",
      icon: TestTube,
    },
    {
      title: "diminishing returns curves",
      description: "know when to stop. visualize saturation before you overspend.",
      icon: TrendingDown,
    },
    {
      title: "cross-device tracking",
      description: "stitch journeys across devices. 80-85% cross-device accuracy.",
      icon: Layers,
    },
  ];

  const stats = [
    { value: "30-50", label: "hidden attribution revealed", suffix: "%" },
    { value: "85", label: "cross-device accuracy", suffix: "%" },
    { value: "7", label: "attribution models", suffix: "" },
    { value: "0", label: "guesswork required", suffix: "" },
  ];

  const beforeAfterItems = [
    { feature: "attribution model", before: "last-click only", after: "7 models + causal inference" },
    { feature: "upper funnel credit", before: "0% (invisible)", after: "true incremental lift" },
    { feature: "budget proof", before: "correlation only", after: "holdout-proven causation" },
    { feature: "channel saturation", before: "overspend blindly", after: "diminishing returns visible" },
    { feature: "marketing ROI proof", before: "impossible", after: "board-ready causal reports" },
    { feature: "cross-device", before: "siloed by device", after: "unified journey view" },
  ];

  const capabilities = [
    {
      icon: FlaskConical,
      title: "Causal Proof",
      features: ["Incremental lift modeling", "Geo holdout tests", "Counterfactual analysis", "Statistical significance"],
    },
    {
      icon: BarChart3,
      title: "Attribution Models",
      features: ["Clean Track Intelligence™", "First-touch", "Last-touch", "Linear", "Time-decay", "Position-based", "Custom"],
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

  const journeySteps = [
    { channel: "LinkedIn", credit: 32, position: "first" },
    { channel: "Email", credit: 28, position: "middle" },
    { channel: "Blog", credit: 18, position: "middle" },
    { channel: "Google", credit: 22, position: "last" },
  ];

  return (
    <FeatureLayout
      title="Attribution Graph - Prove Causation, Not Correlation | utm.one"
      description="Tired of Google taking 100% credit? Prove marketing's true impact with incremental lift modeling, geo holdouts, and causal inference."
      canonical="https://utm.one/features/attribution-graph"
      keywords={["attribution modeling", "incremental lift", "marketing mix model", "causal inference", "multi-touch attribution"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Attribution Graph", url: "https://utm.one/features/attribution-graph" },
      ]}
    >
      <FeatureHero
        headlineLine1="finally know where"
        headlineLine2="revenue comes from."
        subheadline="tired of Google taking 100% credit? we prove causation, not correlation—with incremental lift modeling and automated holdout tests."
      />

      {/* Control Deck - New Causal Features */}
      <FeatureControlDeck
        tabs={controlDeckTabs}
        badge={{ title: "Clean Track Intelligence™", subtitle: "causal attribution" }}
      />

      <FeatureCarouselSection
        headline="true attribution, proven"
        subheadline="every touchpoint gets the credit it deserves—with causal proof"
        items={carouselItems}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="the truth vs the lie"
        subheadline="see what last-click attribution hides"
        items={beforeAfterItems}
      />

      {/* Model Arena Showcase */}
      <FeatureShowcase
        headline="attribution model arena"
        subheadline="7 models. same journey. different truth."
      >
        <div className="bg-background/50 rounded-xl border border-border p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { model: "Last-Click", linkedin: 0, email: 0, blog: 0, google: 100, verdict: "Google takes all" },
              { model: "Linear", linkedin: 25, email: 25, blog: 25, google: 25, verdict: "Equal split" },
              { model: "Clean Track™", linkedin: 32, email: 28, blog: 18, google: 22, verdict: "True contribution" },
            ].map((row, i) => (
              <div
                key={row.model}
                className={`p-5 rounded-xl border animate-fade-in ${i === 2 ? 'border-primary/30 bg-primary/5' : 'border-border bg-card/50'}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${i === 2 ? 'text-primary' : 'text-foreground'}`}>{row.model}</h3>
                  {i === 2 && <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">recommended</span>}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LinkedIn</span>
                    <span className={i === 0 && row.linkedin === 0 ? "line-through text-muted-foreground/50" : ""}>{row.linkedin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className={i === 0 && row.email === 0 ? "line-through text-muted-foreground/50" : ""}>{row.email}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blog</span>
                    <span className={i === 0 && row.blog === 0 ? "line-through text-muted-foreground/50" : ""}>{row.blog}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Google</span>
                    <span className={i === 0 ? "font-bold" : ""}>{row.google}%</span>
                  </div>
                </div>
                <div className={`mt-4 pt-3 border-t ${i === 2 ? 'border-primary/20' : 'border-border'}`}>
                  <p className={`text-xs ${i === 2 ? 'text-primary' : 'text-muted-foreground'}`}>{row.verdict}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Journey visualization */}
          <div
            className="flex items-center justify-between relative pt-8 border-t border-border animate-fade-in [animation-delay:500ms]"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 80 50 Q 200 20, 280 50 Q 400 80, 480 50 Q 600 20, 680 50"
                fill="none"
                stroke="url(#lineGradient2)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>
            
            {journeySteps.map((step, i) => (
              <div
                key={i}
                className="relative z-10 text-center animate-fade-in"
                style={{ animationDelay: `${600 + i * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-lg font-bold text-primary">{step.credit}%</span>
                </div>
                <h3 className="text-sm font-semibold">{step.channel}</h3>
                <p className="text-xs text-muted-foreground capitalize">{step.position} touch</p>
              </div>
            ))}
            
            <div
              className="relative z-10 text-center animate-scale-in [animation-delay:1000ms]"
            >
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-3 mx-auto shadow-lg shadow-primary/30">
                <DollarSign className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-semibold">Conversion</h3>
              <p className="text-xs text-primary font-medium">$15,000</p>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureBentoGrid
        headline="complete attribution stack"
        subheadline="everything you need to prove marketing's contribution"
        capabilities={capabilities}
      />

      {/* Revenue by Channel Showcase */}
      <FeatureShowcase
        headline="revenue by channel"
        subheadline="see the real ROI of every marketing investment"
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
              <div
                key={i}
                className="flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium w-32">{item.channel}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} animate-scale-in`}
                    style={{ 
                      width: `${item.contribution}%`,
                      animationDelay: `${i * 100 + 300}ms` 
                    }}
                  />
                </div>
                <span className="text-sm font-bold w-20 text-right">{item.revenue}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">{item.contribution}%</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Attributed Revenue</span>
            <span className="text-xl font-bold text-primary">$150,200</span>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="ready to prove marketing's impact?"
        subheadline="stop letting last-click steal credit from your best channels."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "see a demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
}