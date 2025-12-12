import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CTAButton } from "@/components/ui/CTAButton";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { motion } from "framer-motion";
import { 
  GitBranch, 
  TrendingUp, 
  Target, 
  CheckCircle2,
  Brain,
  BarChart3,
  Zap,
  Eye
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BayesianAttribution = () => {
  const carouselItems = [
    {
      icon: Brain,
      title: "Clean Track Intelligence™",
      description: "statistical models calculate the true causal influence of every marketing channel."
    },
    {
      icon: TrendingUp,
      title: "removal effect",
      description: "measures what would happen if you removed a channel. LinkedIn drove 40% of conversions? That's its real impact."
    },
    {
      icon: Target,
      title: "confidence intervals",
      description: "'LinkedIn: 42% ± 3%' with 95% confidence. know exactly how reliable your attribution is."
    },
    {
      icon: GitBranch,
      title: "assisted conversions",
      description: "every touchpoint gets credit proportional to its causal influence. no more all-or-nothing."
    },
    {
      icon: BarChart3,
      title: "channel lift analysis",
      description: "understand which channels create demand vs. which capture it. optimize budget allocation."
    },
    {
      icon: Eye,
      title: "invisible influence",
      description: "see how a LinkedIn impression causes a direct search three days later. trace the full chain."
    }
  ];

  const stats = [
    { value: "95", label: "confidence level", suffix: "%" },
    { value: "100", label: "min conversions", suffix: "+" },
    { value: "7", label: "attribution models", suffix: "" },
    { value: "30", label: "recommended days", suffix: "" }
  ];

  const beforeAfterItems = [
    { feature: "attribution model", before: "last-click only", after: "Clean Track Intelligence™" },
    { feature: "channel credit", before: "all-or-nothing", after: "proportional to causal influence" },
    { feature: "direct traffic", before: "measurement gap", after: "traced to original source" },
    { feature: "confidence", before: "guesswork", after: "95% confidence intervals" },
    { feature: "assisted conversions", before: "ignored", after: "fully credited" }
  ];

  const capabilities = [
    {
      icon: Brain,
      title: "causal inference",
      features: ["removal effect modeling", "counterfactual analysis", "channel lift calculation", "true ROI measurement"]
    },
    {
      icon: GitBranch,
      title: "multi-touch credit",
      features: ["proportional attribution", "assisted conversion tracking", "touchpoint scoring", "journey weighting"]
    },
    {
      icon: Target,
      title: "statistical rigor",
      features: ["confidence intervals", "sample size guidance", "significance testing", "reliability scores"]
    },
    {
      icon: TrendingUp,
      title: "optimization",
      features: ["budget reallocation", "channel mix modeling", "spend efficiency", "performance forecasting"]
    }
  ];

  return (
    <FeatureLayout
      title="Clean Track Intelligence™ & Causal Inference | utm.one"
      description="See the invisible influence. utm.one uses Clean Track Intelligence™ to calculate the true causal impact of every marketing channel, not just last-click."
      canonical="https://utm.one/features/bayesian-attribution"
      keywords={["attribution", "multi-touch attribution", "causal inference", "marketing attribution model"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Clean Track Intelligence™", url: "https://utm.one/features/bayesian-attribution" },
      ]}
    >
      <WebPageSchema 
        name="Clean Track Intelligence™"
        description="Calculate true causal influence of every marketing channel."
        url="https://utm.one/features/bayesian-attribution"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Features', url: 'https://utm.one/features' },
          { name: 'Clean Track Intelligence™', url: 'https://utm.one/features/bayesian-attribution' }
        ]}
      />

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
              Clean Track Intelligence™
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold hero-gradient mb-6">
              see the invisible influence.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              forget "Linear" or "Time Decay" models. we calculate the true "Lift" of every channel. see exactly how a LinkedIn impression <em>causes</em> a direct search three days later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                calculate true attribution
              </CTAButton>
              <CTAButton href="/book-demo" variant="secondary">
                book a demo
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Powered by Causal Inference • 95% Confidence Intervals</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: appleEase }}
            className="p-8 md:p-12 rounded-2xl bg-destructive/5 border border-destructive/20"
          >
            <Zap className="w-12 h-12 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              GA4 says 'direct' drove 40%
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              but 'Direct' isn't a channel—it's a measurement gap. users saw your LinkedIn ad, googled your brand 3 days later, and GA4 credited 'Direct'. Clean Track Intelligence™ reveals: LinkedIn gets 42% credit because that's its true causal influence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Carousel Section */}
      <FeatureCarouselSection
        headline="causal attribution, not guesswork"
        subheadline="6 capabilities that reveal true influence"
        items={carouselItems}
      />

      {/* Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Before/After */}
      <FeatureBeforeAfter
        headline="last-click vs causal attribution"
        subheadline="see the difference in how credit is assigned"
        items={beforeAfterItems}
      />

      {/* Showcase */}
      <FeatureShowcase
        headline="attribution network in action"
        subheadline="not last-click. true causal influence."
      >
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border flex items-center justify-center">
          <div className="text-center space-y-4">
            <GitBranch className="w-16 h-16 text-primary mx-auto" />
            <p className="text-muted-foreground">attribution graph visualization</p>
          </div>
        </div>
      </FeatureShowcase>

      {/* Bento Grid */}
      <FeatureBentoGrid
        headline="causal attribution pillars"
        subheadline="statistical rigor meets marketing reality"
        items={capabilities}
      />

      {/* Final CTA */}
      <FeatureFinalCTA
        headline="stop crediting 'direct.' start finding true ROI."
        subheadline="join marketing teams using Clean Track Intelligence™ to optimize spend correctly"
      />
    </FeatureLayout>
  );
};

export default BayesianAttribution;
