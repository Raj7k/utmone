import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { ForecastingPreview } from "@/components/features/ForecastingPreview";
import { UseCasesGrid } from "@/components/features/UseCasesGrid";
import { LineChart, TrendingUp, Users, Briefcase, GitBranch, Clock, Target, Zap } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function PredictiveAnalytics() {
  const useCases = [
    {
      title: "Black Friday capacity planning",
      scenario: "You're launching a Black Friday sale. Your boss asks: 'How much server capacity do we need?' You look at last year, add 20%, and pray.",
      solution: "utm.one predicts ~15,000 clicks ± 2,000 by Friday 6pm with 85% confidence. You provision the right capacity. No crashes. No wasted money."
    },
    {
      title: "Webinar registration forecasting",
      scenario: "Your webinar is in 3 days. You have 200 registrations. You need 500 to hit quota. Will you make it? You have no idea.",
      solution: "Forecasting shows ~450 registrations ± 50 by launch. You know you're short. You boost promotion 48 hours early. You hit 520 registrations."
    },
    {
      title: "Content scheduling optimization",
      scenario: "You're posting a LinkedIn article. When should you publish? Morning? Evening? You guess Tuesday at 10am.",
      solution: "Best time analysis shows your audience peaks Thursday 2-3pm. You schedule there. Your post gets 3x more engagement than usual."
    },
    {
      title: "Campaign budget allocation",
      scenario: "You have $50K to spend across 5 campaigns. Which will perform best? You split it evenly and hope.",
      solution: "Forecasting predicts Campaign A will drive 2x more clicks than Campaign B. You reallocate $30K to A, $20K to others. ROI increases 40%."
    }
  ];

  const faqs = [
    {
      question: "How accurate are the predictions?",
      answer: "Our pattern recognition AI learns from your historical data—the more clicks you have, the more accurate predictions become. We show confidence intervals (e.g., ±150 clicks) so you know the range, not fake precision. Typical accuracy: 85-90% confidence within the predicted range."
    },
    {
      question: "What if I don't have much historical data yet?",
      answer: "The system starts making predictions after just 7 days of data. Early predictions have wider confidence bands (e.g., ±300 instead of ±150), which narrow as we learn your traffic patterns. After 30 days, predictions stabilize at 85%+ confidence."
    },
    {
      question: "Does this replace Google Analytics?",
      answer: "No—it complements GA4. utm.one predicts future traffic based on link-level patterns. Use both: GA4 for overall site analytics, utm.one for campaign forecasting. Think of it as 'Google Analytics + Time Machine'."
    },
    {
      question: "Can I see 'best times to post' for my audience?",
      answer: "Yes. The system shows hourly and daily patterns—you'll see exactly when your audience is most active, not just generic advice. For example: 'Your webinar links peak Tuesday 10-11am, Thursday 2-3pm'."
    },
    {
      question: "What happens if my campaign goes viral?",
      answer: "The model detects anomalies and updates predictions in real-time. If traffic suddenly spikes, the forecast adjusts within 6 hours. You'll see the confidence band widen temporarily, then narrow as the model incorporates the new data."
    },
    {
      question: "Can I forecast by UTM source, medium, or campaign?",
      answer: "Yes. Forecasting works at the link level and rolls up to UTM parameters. You can see: 'Your linkedin/paid links will drive ~5,000 clicks next week' or 'Your Q1 campaign will hit 50,000 clicks by end of month'."
    },
    {
      question: "How far into the future can I forecast?",
      answer: "Standard forecasts show 7 days ahead. Extended forecasts show 14 days (wider confidence bands). Long-range forecasts show 30+ days for strategic planning (widest bands). The further out, the less precise—but still better than guessing."
    },
    {
      question: "What if I'm planning a completely new campaign?",
      answer: "For brand-new campaigns with zero history, the system uses 'similar campaign' patterns. It finds links with similar UTM structures, traffic sources, and audience profiles, then forecasts based on those patterns. Confidence is lower (~70%) but still actionable."
    }
  ];

  return (
    <FeatureLayout
      title="Predictive Analytics - Stop Guessing. Start Knowing."
      description="Ever been asked 'what will traffic look like next week?' and just guessed? utm.one's pattern recognition AI predicts future clicks with confidence intervals, so you can plan campaigns around real data."
      canonical="https://utm.one/features/predictive-analytics"
      keywords={["predictive analytics", "traffic forecasting", "campaign planning", "click prediction"]}
      breadcrumbs={[
        { name: 'Home', url: 'https://utm.one' },
        { name: 'Features', url: 'https://utm.one/features' },
        { name: 'Predictive Analytics', url: 'https://utm.one/features/predictive-analytics' }
      ]}
    >
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative max-w-[980px] mx-auto px-8 z-10 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold hero-gradient lowercase mb-6">
            stop guessing. start knowing.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            ever been asked "what will traffic look like next week?" and just guessed? utm.one's pattern recognition AI predicts future clicks with confidence intervals, so you can plan campaigns around real data.
          </p>
          <CTAButton href="/early-access" variant="primary" pulse>get early access</CTAButton>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <HorrorStorySection
            title="the blind campaign planning trap"
            description="You're launching a Black Friday campaign. Your boss asks: 'How much server capacity do we need?' You look at last year's data, add 20%, and pray. The campaign launches. Traffic is 3x higher than predicted. Your site crashes. Customers rage on Twitter. Revenue lost: $50K. All because you were guessing instead of predicting."
            stats={[
              { label: "Campaigns over-provisioned", value: "40%" },
              { label: "Campaigns under-provisioned", value: "35%" },
              { label: "Lost revenue from bad guesses", value: "$50K+" }
            ]}
          />
        </div>
      </section>

      {/* Interactive Forecasting Preview */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">see the future</h2>
            <p className="text-xl text-muted-foreground">real prediction with confidence intervals</p>
          </div>
          <ForecastingPreview />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how prediction works</h2>
            <p className="text-xl text-muted-foreground">no magic. just math.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <LineChart className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold lowercase">pattern recognition</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                The AI learns your weekly patterns, seasonal trends, and campaign cycles automatically. No setup required.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Example:</span> Your webinar links always spike on Tuesdays at 10 AM. The system learns this and adjusts predictions.
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold lowercase">confidence intervals</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Every prediction includes a confidence range. Not fake precision—honest uncertainty.
              </p>
              <div className="rounded-lg p-4 text-sm bg-primary/10">
                <span className="font-semibold text-primary">Your summer sale link:</span>
                <div className="mt-2 text-foreground font-medium">~1,200 clicks ± 150 by Friday</div>
                <div className="text-xs text-muted-foreground mt-1">85% confidence</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold lowercase">real-time learning</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                The model retrains every 6 hours with new click data. As campaigns evolve, predictions get smarter.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                No manual recalibration needed. The system adapts to your changing traffic patterns automatically.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">real use cases</h2>
            <p className="text-xl text-muted-foreground">problems we actually solve</p>
          </div>
          <UseCasesGrid useCases={useCases} />
        </div>
      </section>

      {/* Best Times to Share */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">know when your audience is active</h2>
            <p className="text-xl text-muted-foreground">stop posting at random times</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border-2 border-border rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold lowercase">hourly heatmap</h3>
              </div>
              <p className="text-muted-foreground mb-4">See exactly which hours drive the most engagement for your links.</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Your audience peaks:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium text-primary">Tuesday 10-11am</span> - 2,400 clicks/hour</li>
                  <li>• <span className="font-medium text-primary">Thursday 2-3pm</span> - 2,100 clicks/hour</li>
                  <li>• <span className="text-muted-foreground">Monday 9am</span> - 800 clicks/hour</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border-2 border-border rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold lowercase">day-of-week patterns</h3>
              </div>
              <p className="text-muted-foreground mb-4">Understand which days perform best for different campaign types.</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Campaign patterns:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium text-primary">Webinars</span> - Tuesday/Thursday</li>
                  <li>• <span className="font-medium text-primary">Sales emails</span> - Wednesday</li>
                  <li>• <span className="text-muted-foreground">Social posts</span> - Monday/Friday</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">for your role</h2>
          </div>
          <PersonaCalloutCards callouts={[
            { icon: Users, title: "for marketers", benefit: "Plan campaign launches around predicted traffic peaks—no more 'hope it works' launch days." },
            { icon: Briefcase, title: "for ops", benefit: "Right-size infrastructure spending—never over-provision or under-provision server capacity again." },
            { icon: GitBranch, title: "for enterprise", benefit: "Forecast quarterly traffic trends across 50+ campaigns—board-ready projections with confidence intervals." }
          ]} />
        </div>
      </section>

      {/* Growth Loop */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">calculate your savings</h2>
            <p className="text-xl text-muted-foreground">see how much time utm.one saves your team</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="teams" faqs={faqs} />
        </div>
      </section>
    </FeatureLayout>
  );
}
