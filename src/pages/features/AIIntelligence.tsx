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
import { AIControlDeck } from "@/components/ai/AIControlDeck";
import { motion } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  GitBranch, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  Zap,
  Target
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const AIIntelligence = () => {
  const faqs = [
    {
      question: "How does the AI learn from my data?",
      answer: "Our AI analyzes your campaign patterns, click behavior, and conversion data to build models specific to your business. All learning happens within your workspace—your data is never shared."
    },
    {
      question: "What if I don't have much historical data?",
      answer: "The AI starts working from day one. Even with minimal data, it provides industry benchmarks. As you accumulate more data, predictions become increasingly accurate."
    },
    {
      question: "Is my data used to train external models?",
      answer: "Absolutely not. Your data stays within your workspace. We don't aggregate customer data or use it for any purpose other than providing insights to you."
    },
    {
      question: "Does this require API keys or complex setup?",
      answer: "No setup required. AI Intelligence works out of the box as soon as you start creating links. No API keys, no configuration needed."
    }
  ];

  const carouselItems = [
    {
      icon: TrendingUp,
      title: "predictive analytics",
      description: "pattern recognition and trend forecasting before you spend another dollar on campaigns."
    },
    {
      icon: GitBranch,
      title: "attribution graph",
      description: "multi-touch attribution that traces every dollar to its source across all channels."
    },
    {
      icon: AlertTriangle,
      title: "anomaly detection",
      description: "real-time monitoring catches traffic spikes, drops, and unusual patterns instantly."
    },
    {
      icon: MessageSquare,
      title: "smart insights",
      description: "natural language queries for instant campaign intelligence. ask anything, get answers."
    },
    {
      icon: Sparkles,
      title: "automated recommendations",
      description: "AI-generated optimization suggestions based on your campaign performance patterns."
    },
    {
      icon: Target,
      title: "audience intelligence",
      description: "understand who your best customers are and where they come from."
    }
  ];

  const stats = [
    { value: "99.9", label: "accuracy", suffix: "%" },
    { value: "2", label: "insights", suffix: "s" },
    { value: "4", label: "AI layers", suffix: "" },
    { value: "0", label: "API keys", suffix: "" }
  ];

  const beforeAfterItems = [
    { feature: "campaign insights", before: "manual reports", after: "real-time AI analysis" },
    { feature: "attribution", before: "last-click only", after: "multi-touch models" },
    { feature: "anomaly detection", before: "missed entirely", after: "instant alerts" },
    { feature: "forecasting", before: "gut feelings", after: "data-driven predictions" },
    { feature: "recommendations", before: "trial and error", after: "AI-powered suggestions" }
  ];

  const capabilities = [
    {
      icon: TrendingUp,
      title: "predictive analytics",
      features: ["campaign forecasting", "budget optimization", "trend detection", "performance modeling"]
    },
    {
      icon: GitBranch,
      title: "attribution graph",
      features: ["revenue mapping", "cross-channel credit", "journey analysis", "touchpoint scoring"]
    },
    {
      icon: AlertTriangle,
      title: "anomaly detection",
      features: ["traffic spike alerts", "drop detection", "pattern changes", "automated notifications"]
    },
    {
      icon: MessageSquare,
      title: "smart insights",
      features: ["natural language queries", "contextual answers", "performance summaries", "actionable recommendations"]
    }
  ];

  return (
    <FeatureLayout
      title="AI Intelligence | utm.one"
      description="Four AI layers working behind the scenes. Predictive analytics, attribution mapping, anomaly detection, and smart insights—no prompt needed."
      canonical="https://utm.one/features/ai-intelligence"
      keywords={["AI intelligence", "predictive analytics", "marketing AI", "campaign intelligence"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "AI Intelligence", url: "https://utm.one/features/ai-intelligence" },
      ]}
    >
      <FAQSchema questions={faqs} />

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
              <Brain className="w-4 h-4" />
              AI Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold hero-gradient mb-6">
              smarter decisions.<br />while you sleep.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              four AI layers working behind the scenes. no prompt needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                get early access
              </CTAButton>
              <CTAButton href="/product" variant="secondary">
                see product
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Control Deck */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: appleEase }}
          >
            <AIControlDeck />
          </motion.div>
        </div>
      </section>

      {/* Carousel Section */}
      <FeatureCarouselSection
        headline="four layers. one intelligence."
        subheadline="each layer works together to transform raw data into actionable insights"
        items={carouselItems}
      />

      {/* Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Before/After */}
      <FeatureBeforeAfter
        headline="before vs. after"
        subheadline="see what changes when AI works for you"
        items={beforeAfterItems}
      />

      {/* Bento Grid */}
      <FeatureBentoGrid
        headline="AI capabilities"
        subheadline="intelligence that works for you"
        items={capabilities}
      />

      {/* Final CTA */}
      <FeatureFinalCTA
        headline="ready for smarter marketing?"
        subheadline="no API keys. no setup. just intelligence."
      />
    </FeatureLayout>
  );
};

export default AIIntelligence;
