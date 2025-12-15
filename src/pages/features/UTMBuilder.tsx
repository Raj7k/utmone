import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureCarouselSection } from "@/components/features/StaticFeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/StaticFeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/StaticFeatureShowcase";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { motion } from "framer-motion";
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
  BarChart3
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated visuals for carousel
const SyntaxRulesVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="15" y="12" width="90" height="12" rx="3" fill="rgba(255,255,255,0.1)"
      initial={{ width: 0 }} animate={{ width: 90 }} transition={{ duration: 0.4 }} />
    <motion.rect x="15" y="28" width="70" height="12" rx="3" fill="rgba(255,255,255,0.15)"
      initial={{ width: 0 }} animate={{ width: 70 }} transition={{ delay: 0.1, duration: 0.4 }} />
    <motion.rect x="15" y="44" width="80" height="12" rx="3" fill="rgba(255,255,255,0.1)"
      initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.2, duration: 0.4 }} />
    <motion.circle cx="100" cy="18" r="5" fill="rgba(74,222,128,0.4)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
    <motion.circle cx="80" cy="34" r="5" fill="rgba(74,222,128,0.4)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
    <motion.circle cx="90" cy="50" r="5" fill="rgba(74,222,128,0.4)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
  </svg>
);

const TemplateVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="10" width="100" height="40" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    <motion.rect x="18" y="18" width="30" height="8" rx="2" fill="rgba(255,255,255,0.25)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
    <motion.rect x="52" y="18" width="25" height="8" rx="2" fill="rgba(255,255,255,0.15)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
    <motion.rect x="18" y="32" width="50" height="8" rx="2" fill="rgba(255,255,255,0.2)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
    <motion.rect x="72" y="32" width="30" height="8" rx="2" fill="rgba(255,255,255,0.1)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
  </svg>
);

const ValidationVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="20" y="15" width="80" height="30" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <motion.text x="30" y="34" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="ui-monospace">utm_source=</motion.text>
    <motion.text x="70" y="34" fill="rgba(74,222,128,0.9)" fontSize="8" fontFamily="ui-monospace" fontWeight="bold"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>google</motion.text>
    <motion.circle cx="98" cy="30" r="6" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.6)" strokeWidth="1"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
    <motion.path d="M95,30 L97,32 L101,28" stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
  </svg>
);

const AutocompleteVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="15" y="8" width="90" height="14" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <motion.rect x="15" y="26" width="90" height="28" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"
      initial={{ height: 0, opacity: 0 }} animate={{ height: 28, opacity: 1 }} transition={{ delay: 0.3 }} />
    <motion.rect x="20" y="32" width="80" height="8" rx="2" fill="rgba(255,255,255,0.2)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
    <motion.rect x="20" y="44" width="60" height="6" rx="2" fill="rgba(255,255,255,0.1)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
    <motion.text x="92" y="38" fill="rgba(255,200,50,0.9)" fontSize="8">🔥</motion.text>
  </svg>
);

const ApprovalVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.circle cx="30" cy="30" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <motion.circle cx="60" cy="30" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <motion.circle cx="90" cy="30" r="10" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.5)" strokeWidth="1"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
    <motion.line x1="40" y1="30" x2="50" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
    <motion.line x1="70" y1="30" x2="80" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.path d="M86,30 L89,33 L94,27" stroke="rgba(74,222,128,0.9)" strokeWidth="2" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
  </svg>
);

const AuditVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="20" y="10" width="80" height="10" rx="2" fill="rgba(255,255,255,0.15)"
      initial={{ x: -80 }} animate={{ x: 20 }} transition={{ duration: 0.4 }} />
    <motion.rect x="20" y="24" width="80" height="10" rx="2" fill="rgba(255,255,255,0.1)"
      initial={{ x: -80 }} animate={{ x: 20 }} transition={{ delay: 0.1, duration: 0.4 }} />
    <motion.rect x="20" y="38" width="80" height="10" rx="2" fill="rgba(255,255,255,0.08)"
      initial={{ x: -80 }} animate={{ x: 20 }} transition={{ delay: 0.2, duration: 0.4 }} />
    <motion.circle cx="15" cy="15" r="3" fill="rgba(74,222,128,0.5)" />
    <motion.circle cx="15" cy="29" r="3" fill="rgba(255,200,50,0.5)" />
    <motion.circle cx="15" cy="43" r="3" fill="rgba(255,255,255,0.3)" />
  </svg>
);

const carouselItems = [
  {
    icon: Type,
    title: "syntax rules",
    description: "define naming conventions that everyone follows automatically. no more utm_Source vs utm_source chaos.",
    visual: <SyntaxRulesVisual />,
  },
  {
    icon: FileText,
    title: "template library",
    description: "pre-built templates for campaigns, channels, and content types. one click to perfect UTMs.",
    visual: <TemplateVisual />,
  },
  {
    icon: CheckSquare,
    title: "real-time validation",
    description: "instant feedback as you type. errors caught before they break your analytics.",
    visual: <ValidationVisual />,
  },
  {
    icon: Sparkles,
    title: "smart autocomplete",
    description: "suggestions based on historical performance. see which sources drive the most clicks.",
    visual: <AutocompleteVisual />,
  },
  {
    icon: GitBranch,
    title: "approval workflows",
    description: "review and approve UTMs before they go live. governance without bottlenecks.",
    visual: <ApprovalVisual />,
  },
  {
    icon: Calendar,
    title: "monthly audits",
    description: "automated checks keep your UTM structure clean over time. catch drift before it spreads.",
    visual: <AuditVisual />,
  },
  {
    icon: Lock,
    title: "required fields",
    description: "make critical parameters mandatory. prevent incomplete tracking from day one.",
    visual: <ValidationVisual />,
  },
  {
    icon: Target,
    title: "campaign mapping",
    description: "connect UTMs directly to campaigns and goals. see performance in context.",
    visual: <TemplateVisual />,
  },
];

const stats = [
  { value: "100%", label: "UTM consistency" },
  { value: "0", label: "broken parameters" },
  { value: "5x", label: "faster creation" },
  { value: "90%", label: "fewer errors" },
];

const beforeAfterItems = [
  { feature: "Naming consistency", before: "utm_Source, UTM_source, source", after: "utm_source (always)" },
  { feature: "Parameter format", before: "mixed case, spaces, typos", after: "auto-normalized" },
  { feature: "Team alignment", before: "everyone does it differently", after: "one standard, enforced" },
  { feature: "Error prevention", before: "catch errors in reports", after: "prevent at creation" },
  { feature: "Historical learning", before: "start from scratch", after: "AI-powered suggestions" },
];

const capabilities = [
  {
    id: "syntax",
    title: "Syntax Governance",
    icon: Type,
    features: ["Auto-lowercase enforcement", "Delimiter standardization", "Character validation", "Length limits"],
  },
  {
    id: "templates",
    title: "Template Library",
    icon: FileText,
    features: ["Pre-built campaign templates", "Channel-specific formats", "Custom template builder", "Template sharing"],
  },
  {
    id: "validation",
    title: "Real-time Validation",
    icon: Shield,
    features: ["Instant error detection", "Format enforcement", "Duplicate prevention", "Required field checks"],
  },
  {
    id: "intelligence",
    title: "AI Intelligence",
    icon: Sparkles,
    features: ["Historical CTR predictions", "High-impact suggestions", "Performance badges", "Learning autocomplete"],
  },
  {
    id: "workflow",
    title: "Approval Workflows",
    icon: GitBranch,
    features: ["Review before publish", "Role-based approvals", "Audit logging", "Change tracking"],
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
      title="UTM Builder - Always Consistent Parameters - utm.one"
      description="utm.one makes messy UTMs impossible. Every link follows the rules you define with clean-track governance and AI-powered suggestions."
      canonical="https://utm.one/features/utm-builder"
      keywords={["utm builder", "utm parameters", "campaign tracking", "utm generator", "clean utms", "utm governance"]}
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
        subheadline="build UTMs that follow your rules automatically. smart autocomplete, real-time validation, and AI-powered suggestions."
        toolComponent={<UTMBuilderBasic />}
      />

      {/* Fold 2: Feature Carousel */}
      <FeatureCarouselSection
        headline="8 ways to keep UTMs perfect"
        subheadline="governance that works without slowing you down"
        items={carouselItems}
      />

      {/* Fold 3: Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Fold 4: Before/After Comparison */}
      <FeatureBeforeAfter
        headline="before vs. after clean-track"
        subheadline="see what governance actually looks like"
        items={beforeAfterItems}
      />

      {/* Fold 5: Showcase - Autocomplete Demo */}
      <FeatureShowcase
        headline="autocomplete that learns"
        subheadline="historical performance guides every suggestion"
      >
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-4">Select utm_source</div>
            
            <motion.div 
              className="p-4 rounded-lg border-2 border-primary bg-primary/10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">google</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">🔥 HIGH IMPACT</span>
              </div>
              <div className="text-xs text-muted-foreground">3.2% avg CTR • Used 847 times</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-primary/20">
                <motion.div 
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="p-4 rounded-lg border border-border bg-card/50 opacity-70"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">linkedin</span>
                <span className="text-xs text-muted-foreground">AVERAGE</span>
              </div>
              <div className="text-xs text-muted-foreground">2.1% avg CTR • Used 312 times</div>
            </motion.div>
            
            <motion.div 
              className="p-4 rounded-lg border border-border bg-card/50 opacity-50"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.5, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">tiktok</span>
                <span className="text-xs text-amber-500">⚡ NEW</span>
              </div>
              <div className="text-xs text-muted-foreground">No data yet</div>
            </motion.div>
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

      {/* Fold 6: Capability Pillars */}
      <FeatureBentoGrid
        headline="clean-track governance suite"
        subheadline="everything you need to eliminate UTM chaos forever"
        capabilities={capabilities}
      />

      {/* Fold 7: Final CTA */}
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
