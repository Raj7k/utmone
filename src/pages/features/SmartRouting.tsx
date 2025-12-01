import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Zap, Globe, Target, Brain, Users, TrendingUp } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

export default function SmartRouting() {
  return (
    <MainLayout>
      <SEO
        title="Smart Routing - The Link That Learns"
        description="Contextual Bandit algorithms route visitors to optimal destinations based on device, location, and behavior. Geo-targeting with LinUCB intelligence."
        canonical="https://utm.one/features/smart-routing"
        keywords={["smart routing", "contextual bandit", "geo targeting", "adaptive routing", "LinUCB algorithm"]}
      />

      <FeatureHero
        headlineLine1="the link"
        headlineLine2="that learns."
        subheadline="Contextual Bandit algorithms route visitors to optimal destinations based on device, location, and behavior. One link, infinite possibilities."
      />

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            adaptive routing with LinUCB
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Contextual Bandit algorithm learns which destination converts best for each visitor segment
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">contextual awareness</h3>
              <p className="text-secondary-label">
                Routes iOS users to App Store, Android to Play Store—automatically learned from conversion data
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">explore vs exploit</h3>
              <p className="text-secondary-label">
                90% traffic to best destination, 10% explores alternatives—balances performance and discovery
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">continuous improvement</h3>
              <p className="text-secondary-label">
                Model updates every hour—routing gets smarter as more visitors click and convert
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <h4 className="text-center text-lg font-semibold mb-6 lowercase text-label">how smart routing works</h4>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">1</div>
              <p className="text-sm text-secondary-label">User clicks link</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">2</div>
              <p className="text-sm text-secondary-label">System reads device, location, referrer</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">3</div>
              <p className="text-sm text-secondary-label">LinUCB algorithm scores each destination</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">4</div>
              <p className="text-sm text-label font-medium">Routes to highest-scoring destination</p>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            geo-targeting that adapts
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Route visitors by country, region, or city—with intelligent fallbacks and A/B testing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">country-level targeting</h3>
                <p className="text-secondary-label">
                  US visitors → USD pricing page, EU visitors → EUR pricing, UK → GBP pricing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">intelligent fallback</h3>
                <p className="text-secondary-label">
                  If country not configured, routes to default destination—no broken links
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">a/b testing per region</h3>
                <p className="text-secondary-label">
                  Test different landing pages for US vs EU visitors—geo + experimentation combined
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">example: global campaign</h4>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-tertiary-label mb-1">🇺🇸 United States</p>
                <p className="text-secondary-label font-mono text-xs">example.com/us-pricing</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-tertiary-label mb-1">🇬🇧 United Kingdom</p>
                <p className="text-secondary-label font-mono text-xs">example.com/uk-pricing</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-tertiary-label mb-1">🇩🇪 Germany</p>
                <p className="text-secondary-label font-mono text-xs">example.com/de-pricing</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-tertiary-label mb-1">🌍 All Other Countries</p>
                <p className="text-secondary-label font-mono text-xs">example.com/global</p>
              </div>
            </div>
            <p className="text-sm text-secondary-label mt-4 text-center">
              One link. Four destinations. Zero confusion.
            </p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted" maxWidth="narrow">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
            static links are dead
          </h2>
          <p className="text-xl text-secondary-label">
            Your links should be as smart as your marketing strategy.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-tertiary-label mb-2 uppercase tracking-wide">Old Way</p>
              <p className="text-secondary-label">One link → one destination. Manual geo-routing with multiple links.</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary rounded-xl p-6">
              <p className="text-sm text-primary mb-2 uppercase tracking-wide">utm.one</p>
              <p className="text-label font-medium">One link → infinite destinations. Automatic, intelligent, adaptive.</p>
            </div>
          </div>
          <div className="pt-6">
            <a
              href="/early-access"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors lowercase"
            >
              make your links smarter
            </a>
          </div>
        </div>
      </FeatureSection>
    </MainLayout>
  );
}
