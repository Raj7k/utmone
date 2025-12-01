import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { LineChart, TrendingUp, Brain, Zap, Target, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

export default function PredictiveAnalytics() {
  return (
    <MainLayout>
      <SEO
        title="Predictive Analytics - Don't Just Track Clicks. Predict Them."
        description="Gaussian Process traffic forecasting, Monte Carlo risk modeling, and probabilistic attribution. Intelligence that sees what's coming, not just what happened."
        canonical="https://utm.one/features/predictive-analytics"
        keywords={["predictive analytics", "traffic forecasting", "gaussian process", "monte carlo simulation", "probabilistic attribution"]}
      />

      <FeatureHero
        headlineLine1="don't just track clicks."
        headlineLine2="predict them."
        subheadline="Gaussian Process traffic forecasting, Monte Carlo risk modeling, and probabilistic attribution. Intelligence that sees what's coming, not just what happened."
      />

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            traffic forecasting with gaussian processes
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            7-day historical patterns + 7-day future predictions with expanding confidence intervals
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <LineChart className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">pattern recognition</h3>
              <p className="text-secondary-label">
                Learns weekly patterns, seasonal trends, and campaign cycles automatically
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">confidence bands</h3>
              <p className="text-secondary-label">
                95% confidence intervals expand into the future—honest uncertainty, not fake precision
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Activity className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">real-time updates</h3>
              <p className="text-secondary-label">
                Model retrains every 6 hours with new click data—predictions get smarter over time
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <p className="text-center text-lg text-secondary-label">
            <span className="font-semibold text-label">Example:</span> "Your summer-sale link will hit ~1,200 clicks ± 150 by Friday" — not guesswork, probabilistic math.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            risk-adjusted roi with monte carlo
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            10,000 simulations reveal the true range of possible outcomes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">campaign uncertainty quantified</h3>
                <p className="text-secondary-label">
                  "Campaign X has 30% chance of 10x ROI, 60% chance of 2x ROI, 10% chance of loss"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">rare event probability</h3>
                <p className="text-secondary-label">
                  Cross-entropy method estimates "What's the chance this goes viral?" with confidence intervals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">portfolio optimization</h3>
                <p className="text-secondary-label">
                  Pareto frontier shows efficient campaigns—maximum clicks for minimum spend
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">how it works</h4>
            <ol className="space-y-3 text-secondary-label">
              <li className="flex gap-3">
                <span className="text-primary font-semibold">1.</span>
                <span>Simulate 10,000 alternate realities based on historical variance</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">2.</span>
                <span>Count how many realities hit your conversion goal</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">3.</span>
                <span>That percentage is your probability of success</span>
              </li>
            </ol>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted" maxWidth="narrow">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
            the difference between tracking and predicting
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-tertiary-label mb-2 uppercase tracking-wide">Old Way</p>
              <p className="text-secondary-label">"You got 1,000 clicks last week."</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary rounded-xl p-6">
              <p className="text-sm text-primary mb-2 uppercase tracking-wide">utm.one</p>
              <p className="text-label font-medium">"You'll get ~1,200 clicks ± 150 next week. 85% confidence."</p>
            </div>
          </div>
          <p className="text-xl text-secondary-label pt-4">
            One tells you what happened. The other tells you what's coming.
          </p>
        </div>
      </FeatureSection>
    </MainLayout>
  );
}
