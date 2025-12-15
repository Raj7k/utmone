import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { DollarSign, Layers, MapPin, TrendingUp, Target, GitBranch } from "lucide-react";

const JourneyValuation = () => {
  const stats = [
    { value: "$45", label: "Pricing Page Value" },
    { value: "$0.50", label: "About Page Value" },
    { value: "90x", label: "Value Difference" },
    { value: "∞", label: "Optimization Potential" },
  ];

  const capabilities = [
    {
      icon: DollarSign,
      title: "State Value ($V$)",
      description: "Calculate the expected revenue value of every page on your site.",
    },
    {
      icon: Layers,
      title: "Golden Path",
      description: "Find the Pareto-optimal route from first touch to conversion.",
    },
    {
      icon: MapPin,
      title: "Route Traffic Correctly",
      description: "Stop promoting high-view, low-value pages. Route to high-value paths.",
    },
    {
      icon: TrendingUp,
      title: "LTV Optimization",
      description: "Identify sequences that maximize lifetime value in shortest time.",
    },
    {
      icon: Target,
      title: "Conversion Probability",
      description: "See the likelihood of conversion from any page in the journey.",
    },
    {
      icon: GitBranch,
      title: "Path Analysis",
      description: "Compare golden paths vs red paths that don't convert.",
    },
  ];

  const comparisonItems = [
    { feature: "Page value metric", before: "Page views only", after: "Dollar value per visit" },
    { feature: "Optimization target", before: "High-traffic pages", after: "High-value pages" },
    { feature: "Path analysis", before: "Top pages list", after: "Revenue-maximizing sequences" },
    { feature: "Traffic routing", before: "Equal treatment", after: "Route to high-value paths" },
    { feature: "Content investment", before: "Guesswork", after: "Data-driven prioritization" },
    { feature: "Conversion modeling", before: "Single funnel", after: "Multi-path optimization" },
  ];

  return (
    <FeatureLayout
      title="Journey Valuation & State Values - utm.one"
      description="Know the dollar value of every page. Model your site as a Markov Decision Process to calculate expected revenue per URL."
      canonical="https://utm.one/features/journey-valuation"
      keywords={["journey valuation", "state value", "MDP marketing", "page value analytics", "golden path optimization"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Journey Valuation", url: "https://utm.one/features/journey-valuation" },
      ]}
    >
      <FeatureHero
        headline="know the dollar value of every page."
        subheadline="Not all pages are equal. Your Pricing Page is worth $45.00 per visit. Your About page is worth $0.50. Stop optimizing for pageviews."
        primaryCTA={{ label: "calculate values", href: "/early-access" }}
        secondaryCTA={{ label: "see methodology", href: "#methodology" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureShowcase
        headline="Page Value Heatmap"
        subheadline="See which pages actually drive revenue"
        background="muted"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { page: "/pricing", value: "$45.00", color: "bg-green-500/20 text-green-400 border-green-500/30" },
              { page: "/features", value: "$28.50", color: "bg-green-500/15 text-green-400 border-green-500/25" },
              { page: "/blog", value: "$12.20", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25" },
              { page: "/about", value: "$0.50", color: "bg-red-500/15 text-red-400 border-red-500/25" },
            ].map((item) => (
              <div key={item.page} className={`rounded-xl p-6 border ${item.color}`}>
                <div className="font-mono text-sm mb-2">{item.page}</div>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs opacity-70">per visit</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-sans font-semibold text-foreground mb-4">Golden Path Identified</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">LinkedIn Ad</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Webinar</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Pricing</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold">$5,000 Deal</span>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureBeforeAfter
        headline="Optimizing for Pageviews is Broken"
        subheadline="Switch from volume metrics to value metrics"
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Journey Valuation Features"
        subheadline="Understand the true value of every step in the customer journey"
        items={capabilities}
      />

      <FeatureFinalCTA
        headline="stop optimizing for pageviews."
        subheadline="Start routing traffic to high-value conversion paths."
      />
    </FeatureLayout>
  );
};

export default JourneyValuation;
