import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GlossaryTooltip } from "@/components/llm/GlossaryTooltip";
import { ProductMockup } from "@/components/product/ProductMockup";
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase">
              analytics that feel effortless
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground font-sans">
              <p>Zero noise</p>
              <p>Zero overwhelm</p>
              <p>Zero configuration</p>
            </div>
            <p className="text-lg text-foreground font-medium font-sans">
              Just the metrics that matter.
            </p>
          </div>
          
          <div>
            <ProductMockup type="dashboard" delay={0.2} />
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="default" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground lowercase">
            clean track intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-sans">
            Predictions that actually help you plan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">traffic forecasting</h3>
                <p className="text-muted-foreground font-sans">
                  See predicted clicks for the next 7 days with confidence intervals based on historical patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">best time analysis</h3>
                <p className="text-muted-foreground font-sans">
                  Know exactly when your audience is most active—no guesswork, just data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">performance trends</h3>
                <p className="text-muted-foreground font-sans">
                  Spot patterns in click behavior before they become problems or opportunities
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-foreground font-sans">7-day forecast</h4>
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground font-sans">Predicted Traffic</span>
                <span className="text-2xl font-bold text-foreground">~1,200</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-sans">Confidence</span>
                  <span className="text-foreground font-semibold">95%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-sans">Range</span>
                  <span className="text-foreground font-semibold">1,050 - 1,350 clicks</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-sans">Peak Day</span>
                  <span className="text-foreground font-semibold">Friday 2PM</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground italic font-sans">
                  Based on 30 days of historical data
                </p>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-foreground">
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
        <p className="text-center text-lg text-muted-foreground mt-12 font-sans">
          Analytics made human.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-foreground">
          No Dashboards That Fight You
        </h2>
        <FeatureComparison
          title="utm.one vs Complex Analytics Tools"
          items={comparisonItems}
        />
        <p className="text-center text-lg text-foreground font-medium mt-12 font-sans">
          Marketers shouldn't need manuals to read charts.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-foreground">
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
        <p className="text-center text-lg text-muted-foreground mt-12 font-sans">
          Your data, simplified.
        </p>
      </FeatureSection>

      <FeatureSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase">
              insights that write themselves
            </h2>
            <p className="text-lg text-muted-foreground">
              AI-powered summaries turn raw click data into plain-English insights your team can act on immediately.
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-primary/10 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase text-primary">AI Insight</span>
                </div>
                <p className="text-sm text-foreground font-medium">
                  Traffic up 23% from LinkedIn this week
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on 1,847 clicks across 12 links
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Trend</span>
                </div>
                <p className="text-sm text-foreground">
                  Mobile traffic peaks at 2-4 PM
                </p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="text-sm font-semibold text-foreground font-sans">Weekly Summary</div>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Total Clicks</span>
                  <span className="text-2xl font-bold text-primary">2,847</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18% vs last week</span>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Top Source</div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">linkedin</span>
                  <span className="text-sm text-primary">847 clicks</span>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Best Performing Link</div>
                <div className="font-mono text-xs text-primary">utm.one/q4-webinar</div>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-foreground">
            See Your Insights
          </h2>
          <p className="text-lg text-muted-foreground mb-8 font-sans">
            Start understanding your link performance today.
          </p>
          <Button
            variant="marketing"
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform"
          >
            <Link to="/book-demo">Book a Demo</Link>
          </Button>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default Analytics;
