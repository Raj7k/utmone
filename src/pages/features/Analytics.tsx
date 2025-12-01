import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GlossaryTooltip } from "@/components/llm/GlossaryTooltip";
import { BarChart3, Zap, PieChart, TrendingUp, Globe, Sparkles } from "lucide-react";

const Analytics = () => {
  const capabilities = [
    {
      icon: Zap,
      title: "Top 3 Metrics At A Glance",
      description: "See what matters most without scrolling or filtering.",
    },
    {
      icon: PieChart,
      title: "Campaign, Channel, Partner Views",
      description: "Organized analytics for every dimension that matters.",
    },
    {
      icon: BarChart3,
      title: "QR Performance",
      description: "Track offline-to-online attribution seamlessly.",
    },
    {
      icon: TrendingUp,
      title: "Link-Level Timeline",
      description: "Understand performance trends over time.",
    },
    {
      icon: Globe,
      title: "Device & Geography",
      description: "Know where your clicks come from and what they use.",
    },
    {
      icon: Sparkles,
      title: "AI Summaries",
      description: "Natural language insights without manual analysis.",
    },
  ];

  const comparisonItems = [
    { feature: "Minimal layout", competitors: false, utmOne: true },
    { feature: "Progressive disclosure", competitors: false, utmOne: true },
    { feature: "Fast-loading graphs", competitors: true, utmOne: true },
    { feature: "Clean hierarchy", competitors: false, utmOne: true },
    { feature: "Instant data export", competitors: true, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="Clean Data, Clear Insights - Analytics Dashboard - utm.one"
      description="utm.one shows you only what matters — no clutter, no confusion, no analytics fatigue."
      canonical="https://utm.one/features/analytics"
      keywords={["link analytics", "campaign analytics", "utm analytics", "marketing dashboard", "click tracking"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Analytics", url: "https://utm.one/features/analytics" },
      ]}
    >
      <FeatureHero
        headlineLine1="clean data,"
        headlineLine2="clear insight."
        subheadline="utm.one shows you only what matters — no clutter, no confusion, no analytics fatigue."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Analytics That Feel Effortless
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-body-apple text-secondary-label">
            <p>Zero noise</p>
            <p>Zero overwhelm</p>
            <p>Zero configuration</p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            clean track intelligence
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Predictions that actually help you plan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">traffic forecasting</h3>
                <p className="text-secondary-label">
                  See predicted clicks for the next 7 days with confidence intervals based on historical patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">best time analysis</h3>
                <p className="text-secondary-label">
                  Know exactly when your audience is most active—no guesswork, just data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">performance trends</h3>
                <p className="text-secondary-label">
                  Spot patterns in click behavior before they become problems or opportunities
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">7-day forecast</h4>
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-sm text-secondary-label">Predicted Traffic</span>
                <span className="text-2xl font-bold text-label">~1,200</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary-label">Confidence</span>
                  <span className="text-label font-semibold">95%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary-label">Range</span>
                  <span className="text-label font-semibold">1,050 - 1,350 clicks</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary-label">Peak Day</span>
                  <span className="text-label font-semibold">Friday 2PM</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-secondary-label italic">
                  Based on 30 days of historical data
                </p>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Designed Around Clarity
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={index}
              icon={capability.icon}
              title={capability.title}
              description={capability.description}
              delay={index * 0.1}
            />
          ))}
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          Analytics made human.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          No Dashboards That Fight You
        </h2>
        <FeatureComparison
          title="utm.one vs Complex Analytics Tools"
          items={comparisonItems}
        />
        <p className="text-center text-title-2 text-label font-medium mt-12">
          Marketers shouldn't need manuals to read charts.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Click → Understand → Act
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <WorkflowStep
            icon={BarChart3}
            title="Click"
            description="User engages with your link"
          />
          <WorkflowStep
            icon={Sparkles}
            title="Understand"
            description="See clear, actionable insights"
          />
          <WorkflowStep
            icon={TrendingUp}
            title="Act"
            description="Make informed decisions fast"
          />
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          Your data, simplified.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            See Your Insights
          </h2>
          <p className="text-body-apple text-secondary-label mb-8">
            Start understanding your link performance today.
          </p>
          <Button
            variant="marketing"
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform"
          >
            <Link to="/early-access">Get Early Access</Link>
          </Button>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default Analytics;
