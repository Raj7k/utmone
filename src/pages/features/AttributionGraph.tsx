import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { GitBranch, TrendingUp, Users, Zap, Eye, Target } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

export default function AttributionGraph() {
  return (
    <MainLayout>
      <SEO
        title="Attribution Graph - See the Invisible Connections"
        description="Bayesian influence modeling, multi-touch attribution, and lift analysis. Understand which touchpoints truly drive conversions."
        canonical="https://utm.one/features/attribution-graph"
        keywords={["attribution modeling", "bayesian attribution", "multi-touch attribution", "customer journey", "lift analysis"]}
      />

      <FeatureHero
        headlineLine1="see the invisible"
        headlineLine2="connections."
        subheadline="Bayesian influence modeling reveals which touchpoints truly drive conversions. Not last-click lies. Real causal inference."
      />

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            multi-touch attribution that works
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Every touchpoint in the journey gets credit based on statistical contribution
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <GitBranch className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">bayesian influence</h3>
              <p className="text-secondary-label">
                Probabilistic model estimates each touchpoint's causal contribution to conversion
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">lift vs last-click</h3>
              <p className="text-secondary-label">
                Shows how much lift each channel provides compared to last-click attribution
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">journey visualization</h3>
              <p className="text-secondary-label">
                Interactive graph shows paths from first touch to conversion with click weights
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <h4 className="text-center text-lg font-semibold mb-4 lowercase text-label">example journey</h4>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 mb-2">
                <span className="font-semibold">Email</span>
              </div>
              <span className="text-sm text-secondary-label">22% credit</span>
            </div>
            <span className="text-2xl text-secondary-label">→</span>
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 mb-2">
                <span className="font-semibold">Facebook</span>
              </div>
              <span className="text-sm text-secondary-label">35% credit</span>
            </div>
            <span className="text-2xl text-secondary-label">→</span>
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 mb-2">
                <span className="font-semibold">Google</span>
              </div>
              <span className="text-sm text-secondary-label">43% credit</span>
            </div>
            <span className="text-2xl text-secondary-label">→</span>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-xl px-4 py-2 mb-2">
                <span className="font-semibold">Convert</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-secondary-label mt-6">
            Credit distributed based on incremental lift at each stage—not arbitrary rules
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            incremental lift analysis
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Did the touchpoint cause the conversion, or was it just along for the ride?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">counterfactual testing</h3>
                <p className="text-secondary-label">
                  "What would've happened without this touchpoint?" — answered with control groups
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">assisted vs direct</h3>
                <p className="text-secondary-label">
                  Separates touchpoints that assist conversions from those that directly close them
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">time-decay modeling</h3>
                <p className="text-secondary-label">
                  Recent touchpoints weighted higher—because memory fades and recency matters
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 lowercase text-label">last-click attribution</h4>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-secondary-label mb-2">Google Search: <span className="font-semibold text-label">100% credit</span></p>
                <p className="text-tertiary-label text-sm">Email: 0% • Facebook: 0% • LinkedIn: 0%</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 lowercase text-primary">utm.one bayesian attribution</h4>
              <div className="bg-primary/5 border-2 border-primary rounded-lg p-4">
                <p className="text-secondary-label mb-2">Email: <span className="font-semibold text-label">22%</span></p>
                <p className="text-secondary-label mb-2">Facebook: <span className="font-semibold text-label">35%</span></p>
                <p className="text-secondary-label">Google: <span className="font-semibold text-label">43%</span></p>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted" maxWidth="narrow">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
            attribution that reflects reality
          </h2>
          <p className="text-xl text-secondary-label">
            Last-click attribution is a lie. Multi-touch attribution with Bayesian inference tells the truth.
          </p>
          <div className="pt-6">
            <a
              href="/book-demo"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors lowercase"
            >
              book a demo
            </a>
          </div>
        </div>
      </FeatureSection>
    </MainLayout>
  );
}
