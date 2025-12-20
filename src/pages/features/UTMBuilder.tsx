import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureControlDeck } from "@/components/features/FeatureControlDeck";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import {
  AIUTMGeneratorVisual,
  TeamVelocityVisual,
  ConflictDetectionVisual,
  UTMInheritanceVisual,
  PerformancePredictionVisual,
  AdPlatformSyncVisual,
} from "@/components/features/visuals/EnhancedFeatureVisuals";
import { 
  Type, 
  FileText, 
  Lock, 
  GitBranch, 
  Calendar, 
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Zap,
  Shield,
  Target,
  BarChart3,
  Bot,
  Users,
  Link2,
  TrendingUp,
  Download
} from "lucide-react";

// Control Deck tabs with new AI-powered features
const controlDeckTabs = [
  {
    id: "ai-generator",
    icon: Bot,
    label: "AI UTM generator",
    headline: "describe your campaign. get perfect UTMs.",
    subheadline: "tell AI what you're promoting—it builds the parameters automatically. no memorizing syntax.",
    visual: <AIUTMGeneratorVisual />,
  },
  {
    id: "velocity",
    icon: Users,
    label: "team velocity",
    headline: "see who's shipping.",
    subheadline: "track link creation speed across your team. spot bottlenecks before they hurt.",
    visual: <TeamVelocityVisual />,
  },
  {
    id: "conflicts",
    icon: AlertTriangle,
    label: "conflict detection",
    headline: "no more UTM collisions.",
    subheadline: "we catch duplicate parameters across teams before they fragment your data.",
    visual: <ConflictDetectionVisual />,
  },
  {
    id: "inheritance",
    icon: Link2,
    label: "UTM inheritance",
    headline: "set once, use everywhere.",
    subheadline: "campaign-level UTMs flow down to every link automatically. zero copy-paste.",
    visual: <UTMInheritanceVisual />,
  },
  {
    id: "predictions",
    icon: TrendingUp,
    label: "CTR predictions",
    headline: "know before you launch.",
    subheadline: "see predicted CTR based on historical patterns for each UTM combination.",
    visual: <PerformancePredictionVisual />,
  },
  {
    id: "platform-sync",
    icon: Download,
    label: "ad platform sync",
    headline: "import from the source.",
    subheadline: "pull UTMs directly from Google Ads, Meta, LinkedIn. no copy-paste errors.",
    visual: <AdPlatformSyncVisual />,
  },
];

const carouselItems = [
  {
    icon: Bot,
    title: "AI UTM generator",
    description: "describe your campaign in plain english. AI generates perfect, consistent UTMs instantly.",
  },
  {
    icon: Type,
    title: "syntax governance",
    description: "define naming rules once. every link follows them automatically—no more utm_Source chaos.",
  },
  {
    icon: FileText,
    title: "template library",
    description: "pre-built templates for campaigns, channels, content types. one click to perfect UTMs.",
  },
  {
    icon: CheckSquare,
    title: "real-time validation",
    description: "instant feedback as you type. errors caught before they break your analytics.",
  },
  {
    icon: Sparkles,
    title: "smart autocomplete",
    description: "suggestions ranked by historical CTR. see which sources drive the most clicks.",
  },
  {
    icon: AlertTriangle,
    title: "conflict detection",
    description: "catch duplicate UTMs across teams before they fragment your data.",
  },
  {
    icon: GitBranch,
    title: "approval workflows",
    description: "review and approve UTMs before they go live. governance without bottlenecks.",
  },
  {
    icon: TrendingUp,
    title: "CTR predictions",
    description: "know which UTM combinations perform best—before you hit publish.",
  },
];

const stats = [
  { value: "100", label: "UTM consistency", suffix: "%" },
  { value: "5", label: "faster than manual", suffix: "x" },
  { value: "0", label: "parameter conflicts", suffix: "" },
  { value: "85", label: "CTR prediction accuracy", suffix: "%" },
];

const beforeAfterItems = [
  { feature: "UTM creation", before: "manual typing, constant typos", after: "AI-generated in seconds" },
  { feature: "naming consistency", before: "utm_Source vs utm_source chaos", after: "one standard, enforced" },
  { feature: "team alignment", before: "everyone does it differently", after: "shared templates & rules" },
  { feature: "error prevention", before: "catch errors in reports", after: "prevent at creation" },
  { feature: "performance insight", before: "no idea which UTMs work", after: "CTR predictions before launch" },
  { feature: "cross-team conflicts", before: "duplicate UTMs fragment data", after: "conflicts caught instantly" },
];

const capabilities = [
  {
    id: "ai",
    title: "AI Intelligence",
    icon: Bot,
    features: ["Natural language generation", "Historical CTR predictions", "Smart autocomplete", "Performance badges"],
  },
  {
    id: "governance",
    title: "Syntax Governance",
    icon: Type,
    features: ["Auto-lowercase enforcement", "Delimiter standardization", "Character validation", "Required fields"],
  },
  {
    id: "templates",
    title: "Template Library",
    icon: FileText,
    features: ["Campaign templates", "Channel-specific formats", "Custom template builder", "One-click apply"],
  },
  {
    id: "validation",
    title: "Real-time Validation",
    icon: Shield,
    features: ["Instant error detection", "Conflict prevention", "Duplicate checking", "Format enforcement"],
  },
  {
    id: "workflow",
    title: "Team Workflows",
    icon: GitBranch,
    features: ["Approval queues", "Role-based access", "Audit logging", "Change tracking"],
    href: "/features/governance",
  },
  {
    id: "analytics",
    title: "Performance Insights",
    icon: BarChart3,
    features: ["Source performance", "Campaign comparison", "Trend analysis", "ROI tracking"],
    href: "/features/analytics",
  },
];

const UTMBuilder = () => {
  return (
    <FeatureLayout
      title="UTM Builder - AI-Powered Campaign Tracking | utm.one"
      description="Build UTMs that follow your rules automatically. AI-powered generation, real-time validation, CTR predictions—all in one place."
      canonical="https://utm.one/features/utm-builder"
      keywords={["utm builder", "utm parameters", "campaign tracking", "utm generator", "ai utm", "utm governance"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "UTM Builder", url: "https://utm.one/features/utm-builder" },
      ]}
    >
      {/* Fold 1: Hero with Interactive Tool */}
      <FeatureHeroWithTool
        headlineLine1="UTM chaos ends"
        headlineLine2="here."
        subheadline="build UTMs that follow your rules automatically. AI-powered generation, real-time validation, and CTR predictions—all in one place."
        toolComponent={<UTMBuilderBasic />}
      />

      {/* Fold 2: Control Deck - AI Features */}
      <FeatureControlDeck
        tabs={controlDeckTabs}
        badge={{ title: "AI-Powered", subtitle: "intelligent UTM generation" }}
      />

      {/* Fold 3: Feature Carousel */}
      <FeatureCarouselSection
        headline="8 ways to eliminate UTM chaos"
        subheadline="governance that works without slowing you down"
        items={carouselItems}
      />

      {/* Fold 4: Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Fold 5: Before/After Comparison */}
      <FeatureBeforeAfter
        headline="before vs. after clean-track"
        subheadline="see what governance actually looks like"
        items={beforeAfterItems}
      />

      {/* Fold 6: Showcase - AI Autocomplete Demo */}
      <FeatureShowcase
        headline="autocomplete that learns"
        subheadline="historical performance guides every suggestion"
      >
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-4">Select utm_source</div>
            
            <div 
              className="p-4 rounded-lg border-2 border-primary bg-primary/10 animate-fade-in"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">google</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">🔥 HIGH IMPACT</span>
              </div>
              <div className="text-xs text-muted-foreground">3.2% avg CTR • Used 847 times</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-primary/20">
                <div 
                  className="h-full rounded-full bg-primary animate-[grow_0.8s_ease-out_0.3s_forwards]"
                  style={{ width: 0 }}
                />
              </div>
            </div>
            
            <div 
              className="p-4 rounded-lg border border-border bg-card/50 opacity-70 animate-fade-in [animation-delay:100ms]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">linkedin</span>
                <span className="text-xs text-muted-foreground">AVERAGE</span>
              </div>
              <div className="text-xs text-muted-foreground">2.1% avg CTR • Used 312 times</div>
            </div>
            
            <div 
              className="p-4 rounded-lg border border-border bg-card/50 opacity-50 animate-fade-in [animation-delay:200ms]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">tiktok</span>
                <span className="text-xs text-amber-500">⚡ NEW</span>
              </div>
              <div className="text-xs text-muted-foreground">No data yet</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">AI-Powered Suggestions</div>
                  <div className="text-xs text-muted-foreground">Based on 847 historical links</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• High-performing sources show 🔥 badges</p>
                <p>• New sources marked with ⚡</p>
                <p>• CTR predictions guide decisions</p>
                <p>• Usage frequency shows team patterns</p>
              </div>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      {/* Fold 7: Capability Pillars */}
      <FeatureBentoGrid
        headline="clean-track governance suite"
        subheadline="everything you need to eliminate UTM chaos forever"
        capabilities={capabilities}
      />

      {/* Fold 8: Final CTA */}
      <FeatureFinalCTA
        headline="ready for perfect UTMs?"
        subheadline="join teams who never worry about broken parameters."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "book a demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
};

export default UTMBuilder;