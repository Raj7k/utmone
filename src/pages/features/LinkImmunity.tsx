import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { ShieldCheck, Activity, Zap, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

export default function LinkImmunity() {
  return (
    <MainLayout>
      <SEO
        title="Link Immunity - Zero Broken Links. Guaranteed."
        description="Automated health probes, instant fallback routing, and 24/7 uptime monitoring. Your links never break, even when destinations do."
        canonical="https://utm.one/features/link-immunity"
        keywords={["link monitoring", "uptime monitoring", "broken link detection", "automatic fallback", "link health"]}
      />

      <FeatureHero
        headlineLine1="zero broken links."
        headlineLine2="guaranteed."
        subheadline="Automated health probes detect failures in seconds. Instant fallback routing ensures visitors never hit 404s. Your reputation stays intact."
      />

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            robustness probes that never sleep
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Every link checked every hour. 404s, 500s, and timeouts detected instantly.
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Activity className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">continuous monitoring</h3>
              <p className="text-secondary-label">
                Top 100 links probed every hour. High-traffic links checked every 15 minutes.
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <AlertCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">instant alerts</h3>
              <p className="text-secondary-label">
                Slack, email, or webhook notifications sent within 60 seconds of failure detection
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">historical uptime</h3>
              <p className="text-secondary-label">
                99.99% uptime dashboard shows reliability over time—build trust with stakeholders
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <h4 className="text-center text-lg font-semibold mb-6 lowercase text-label">what gets monitored</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary mb-1">404</p>
              <p className="text-sm text-secondary-label">Page Not Found</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary mb-1">500</p>
              <p className="text-sm text-secondary-label">Server Error</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary mb-1">Timeout</p>
              <p className="text-sm text-secondary-label">&gt;10s Response</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary mb-1">SSL</p>
              <p className="text-sm text-secondary-label">Certificate Expiry</p>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            automatic fallback routing
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            When primary destination fails, traffic routes to backup—no manual intervention required
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">zero-downtime failover</h3>
                <p className="text-secondary-label">
                  If primary URL returns 404/500, visitors instantly routed to fallback—no 404 page shown
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">automatic recovery</h3>
                <p className="text-secondary-label">
                  When primary destination recovers, traffic automatically switches back—no config change needed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">cascade fallback</h3>
                <p className="text-secondary-label">
                  Configure multiple fallback URLs—if backup 1 fails, tries backup 2, then backup 3
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">fallback flow</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-label mb-1">Primary Destination</p>
                  <p className="text-xs font-mono text-secondary-label">example.com/campaign</p>
                </div>
                <div className="text-xs text-green-600 font-semibold">✓ Healthy</div>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="bg-muted text-secondary-label rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-label mb-1">Fallback 1</p>
                  <p className="text-xs font-mono text-secondary-label">example.com/backup</p>
                </div>
                <div className="text-xs text-secondary-label">Standby</div>
              </div>
              <div className="flex items-center gap-4 opacity-30">
                <div className="bg-muted text-secondary-label rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-label mb-1">Fallback 2</p>
                  <p className="text-xs font-mono text-secondary-label">example.com/final</p>
                </div>
                <div className="text-xs text-secondary-label">Standby</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200 text-center">
                <span className="font-semibold">If #1 fails:</span> Traffic automatically routes to #2
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted" maxWidth="narrow">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
            broken links destroy trust
          </h2>
          <p className="text-xl text-secondary-label">
            404 errors cost you customers. Link Immunity ensures your campaigns never break—even when your website does.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-sm text-tertiary-label mb-2 uppercase tracking-wide">Without Immunity</p>
              <p className="text-secondary-label">Website goes down → links break → campaigns fail → customers churn.</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary rounded-xl p-6">
              <p className="text-sm text-primary mb-2 uppercase tracking-wide">With Immunity</p>
              <p className="text-label font-medium">Website goes down → fallback activates → campaigns continue → customers convert.</p>
            </div>
          </div>
          <div className="pt-6">
            <a
              href="/early-access"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors lowercase"
            >
              protect your campaigns
            </a>
          </div>
        </div>
      </FeatureSection>
    </MainLayout>
  );
}
