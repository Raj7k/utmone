import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { LineChart, TrendingUp, Clock, Target, Zap, BarChart3, Calendar, Brain } from "lucide-react";

export default function PredictiveAnalytics() {
  const carouselItems = [
    {
      title: "Traffic Forecasting",
      description: "Predict future clicks with confidence intervals. Know what's coming before it arrives.",
      icon: TrendingUp,
    },
    {
      title: "Pattern Recognition",
      description: "AI learns your weekly patterns, seasonal trends, and campaign cycles automatically.",
      icon: Brain,
    },
    {
      title: "Confidence Intervals",
      description: "Every prediction includes a range. Not fake precision — honest uncertainty.",
      icon: Target,
    },
    {
      title: "Best Time Analysis",
      description: "See exactly when your audience is most active. Stop guessing post times.",
      icon: Clock,
    },
    {
      title: "Campaign Planning",
      description: "Forecast performance before you launch. Allocate budget with confidence.",
      icon: Calendar,
    },
    {
      title: "Real-Time Learning",
      description: "The model retrains every 6 hours. As campaigns evolve, predictions get smarter.",
      icon: Zap,
    },
  ];

  const stats = [
    { value: "85", label: "Prediction Accuracy", suffix: "%" },
    { value: "7", label: "Days Forecast", suffix: "" },
    { value: "6", label: "Hour Model Refresh", suffix: "hr" },
    { value: "0", label: "Setup Required", suffix: "" },
  ];

  const beforeAfterItems = [
    { feature: "Traffic Planning", before: "Looking at last year + guessing", after: "85% accurate predictions" },
    { feature: "Server Capacity", before: "Over/under provisioning", after: "Right-sized infrastructure" },
    { feature: "Post Timing", before: "Random guesses", after: "Data-driven scheduling" },
    { feature: "Budget Allocation", before: "Even split and hope", after: "Predictive ROI allocation" },
    { feature: "Campaign Launches", before: "Launch and pray", after: "Forecast-driven planning" },
  ];

  const capabilities = [
    {
      icon: TrendingUp,
      title: "Click Forecasting",
      features: ["7-day predictions", "30-day extended", "Campaign-level", "Source/medium breakdown"],
    },
    {
      icon: Clock,
      title: "Timing Intelligence",
      features: ["Hourly heatmaps", "Day-of-week patterns", "Best time alerts", "Timezone aware"],
    },
    {
      icon: BarChart3,
      title: "Capacity Planning",
      features: ["Server load prediction", "Infrastructure sizing", "Cost optimization", "Peak detection"],
    },
    {
      icon: Calendar,
      title: "Campaign Planning",
      features: ["Pre-launch forecasts", "Budget recommendations", "Seasonal adjustments", "ROI predictions"],
    },
  ];

  // Forecast chart data
  const forecastData = [
    { day: "Mon", actual: 1200, predicted: null, lower: null, upper: null },
    { day: "Tue", actual: 1450, predicted: null, lower: null, upper: null },
    { day: "Wed", actual: 1380, predicted: null, lower: null, upper: null },
    { day: "Thu", actual: null, predicted: 1520, lower: 1350, upper: 1690 },
    { day: "Fri", actual: null, predicted: 1680, lower: 1480, upper: 1880 },
    { day: "Sat", actual: null, predicted: 1240, lower: 1080, upper: 1400 },
    { day: "Sun", actual: null, predicted: 980, lower: 820, upper: 1140 },
  ];

  const maxValue = 2000;

  return (
    <FeatureLayout
      title="Predictive Analytics - Stop Guessing. Start Knowing. - utm.one"
      description="Pattern recognition AI predicts future clicks with confidence intervals. Plan campaigns around real data, not gut feelings."
      canonical="https://utm.one/features/predictive-analytics"
      keywords={["predictive analytics", "traffic forecasting", "campaign planning", "click prediction"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Predictive Analytics", url: "https://utm.one/features/predictive-analytics" },
      ]}
    >
      <FeatureHero
        headlineLine1="stop guessing."
        headlineLine2="start knowing."
        subheadline="Our AI predicts future clicks with confidence intervals. Plan campaigns around real data, not gut feelings."
      />

      <FeatureCarouselSection
        headline="See the Future"
        subheadline="Predictions powered by pattern recognition"
        items={carouselItems}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="From Guessing to Knowing"
        subheadline="The transformation is immediate"
        items={beforeAfterItems}
      />

      <FeatureShowcase
        headline="7-Day Traffic Forecast"
        subheadline="Real predictions with confidence bands"
      >
        <div className="bg-background/50 rounded-xl border border-border p-6">
          {/* Chart visualization */}
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-muted-foreground">
              <span>2K</span>
              <span>1.5K</span>
              <span>1K</span>
              <span>500</span>
              <span>0</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-14 h-full flex items-end justify-between gap-2 pb-8 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-border/30 w-full" />
                ))}
              </div>
              
              {/* Bars */}
              {forecastData.map((item, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center relative z-10 animate-scale-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {item.actual ? (
                    <div
                      className="w-full bg-primary rounded-t-md"
                      style={{ height: `${(item.actual / maxValue) * 100}%` }}
                    />
                  ) : (
                    <div className="w-full relative">
                      {/* Confidence band */}
                      <div
                        className="absolute w-full bg-primary/10 rounded-t-md"
                        style={{ 
                          height: `${((item.upper! - item.lower!) / maxValue) * 100}%`,
                          bottom: `${(item.lower! / maxValue) * 100}%`
                        }}
                      />
                      {/* Predicted value line */}
                      <div
                        className="w-full bg-primary/40 rounded-t-md border-2 border-dashed border-primary"
                        style={{ height: `${(item.predicted! / maxValue) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="ml-14 flex justify-between text-xs text-muted-foreground">
              {forecastData.map((item, i) => (
                <span key={i} className="flex-1 text-center">{item.day}</span>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-sm" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/40 border-2 border-dashed border-primary rounded-sm" />
              <span className="text-muted-foreground">Predicted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/10 rounded-sm" />
              <span className="text-muted-foreground">Confidence Band</span>
            </div>
          </div>
          
          {/* Prediction summary */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center animate-fade-in [animation-delay:500ms]">
            <p className="text-sm text-muted-foreground">Predicted total for next 4 days:</p>
            <p className="text-2xl font-bold text-primary mt-1">5,420 ± 480 clicks</p>
            <p className="text-xs text-muted-foreground mt-1">85% confidence interval</p>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureBentoGrid
        headline="Intelligence That Works for You"
        subheadline="No setup required. Predictions start after 7 days of data."
        capabilities={capabilities}
      />

      <FeatureShowcase
        headline="Best Times to Post"
        subheadline="Know exactly when your audience is active"
        background="muted"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hourly heatmap */}
          <div className="bg-background/50 rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Hourly Activity</h3>
            </div>
            <div className="space-y-3">
              {[
                { time: "10-11 AM", activity: 95, label: "Peak" },
                { time: "2-3 PM", activity: 85, label: "High" },
                { time: "9-10 AM", activity: 65, label: "Good" },
                { time: "4-5 PM", activity: 45, label: "Moderate" },
              ].map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-sm text-muted-foreground w-20">{slot.time}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${slot.activity}%` }}
                    />
                  </div>
                  <span className="text-xs text-primary font-medium w-16">{slot.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Day of week patterns */}
          <div className="bg-background/50 rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Day Patterns</h3>
            </div>
            <div className="space-y-3">
              {[
                { day: "Tuesday", type: "Webinars", activity: 90 },
                { day: "Thursday", type: "Sales Emails", activity: 85 },
                { day: "Wednesday", type: "Blog Posts", activity: 70 },
                { day: "Monday", type: "Newsletters", activity: 60 },
              ].map((pattern, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div>
                    <span className="text-sm font-medium">{pattern.day}</span>
                    <span className="text-xs text-muted-foreground ml-2">Best for {pattern.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${pattern.activity}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="Ready to See the Future?"
        subheadline="Start predicting campaign performance today."
        primaryCTA={{ label: "Get Started Free", href: "/early-access" }}
        secondaryCTA={{ label: "See a Demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
}