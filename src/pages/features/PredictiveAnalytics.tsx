import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { LineChart, TrendingUp, Users, Briefcase, GitBranch } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function PredictiveAnalytics() {
  const faqs = [
    {
      question: "How accurate are the predictions?",
      answer: "Our pattern recognition AI learns from your historical data—the more clicks you have, the more accurate predictions become. We show confidence intervals (e.g., ±150 clicks) so you know the range, not fake precision."
    },
    {
      question: "What if I don't have much historical data yet?",
      answer: "The system starts making predictions after just 7 days of data. Early predictions have wider confidence bands, which narrow as we learn your traffic patterns."
    },
    {
      question: "Does this replace Google Analytics?",
      answer: "No—it complements GA4. utm.one predicts future traffic based on link-level patterns. Use both: GA4 for overall site analytics, utm.one for campaign forecasting."
    },
    {
      question: "Can I see 'best times to post' for my audience?",
      answer: "Yes. The system shows hourly and daily patterns—you'll see exactly when your audience is most active, not just generic advice."
    },
    {
      question: "What happens if my campaign goes viral?",
      answer: "The model detects anomalies and updates predictions in real-time. If traffic suddenly spikes, the forecast adjusts within 6 hours."
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
          <SocialProofCounter variant="minimal" />
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold hero-gradient lowercase mt-8 mb-6">
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

      {/* Solution */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how prediction should work</h2>
            <p className="text-xl text-muted-foreground">no more guessing. just math.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
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
              <div className="bg-primary/10 rounded-lg p-4 text-sm">
                <span className="font-semibold text-primary">Your summer sale link:</span>
                <div className="mt-2 text-foreground font-medium">~1,200 clicks ± 150 by Friday</div>
                <div className="text-xs text-muted-foreground mt-1">85% confidence</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-8">
            <h3 className="text-xl font-semibold lowercase mb-4">real-time learning</h3>
            <p className="text-muted-foreground">
              The model retrains every 6 hours with new click data. As your campaigns evolve, predictions get smarter. No manual recalibration needed.
            </p>
          </div>
        </div>
      </section>

      {/* Real Example */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">see the difference</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-destructive/30 rounded-xl p-6">
              <div className="text-sm text-destructive mb-2 uppercase tracking-wide font-semibold">without utm.one</div>
              <p className="text-muted-foreground mb-4">"You got 1,000 clicks last week."</p>
              <p className="text-sm text-muted-foreground italic">Now what? Still guessing for next week.</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary rounded-xl p-6">
              <div className="text-sm text-primary mb-2 uppercase tracking-wide font-semibold">with utm.one</div>
              <p className="text-foreground font-medium mb-4">"You'll get ~1,200 clicks ± 150 next week. 85% confidence."</p>
              <p className="text-sm text-primary font-medium">Plan server capacity. Schedule content. Make decisions with data.</p>
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
