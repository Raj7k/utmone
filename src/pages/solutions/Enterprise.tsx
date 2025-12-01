import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Shield, Lock, Zap, Database, Users, KeyRound, Activity, GitBranch } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

export default function Enterprise() {
  return (
    <MainLayout>
      <SEO
        title="Enterprise Link Management - Security, Scale, Governance"
        description="SSO, SAML, audit logs, field-level encryption, Knapsack edge caching, and enterprise-grade SLA. Built for security-first organizations."
        canonical="https://utm.one/solutions/enterprise"
        keywords={["enterprise link management", "SSO", "SAML", "audit logs", "field encryption", "enterprise security"]}
      />

      <FeatureHero
        headlineLine1="enterprise-grade"
        headlineLine2="link governance."
        subheadline="SSO, audit logs, field-level encryption, sub-millisecond redirects, and 99.99% SLA. Built for security-first organizations."
      />

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            security by default
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Every layer hardened. Every token encrypted. Every action logged.
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <KeyRound className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">SSO & SAML</h3>
              <p className="text-secondary-label">
                Google OAuth, Microsoft Azure AD, Okta, OneLogin—single sign-on that works
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Lock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">field encryption</h3>
              <p className="text-secondary-label">
                AES-256 encryption on all tokens, secrets, and API keys—even if database is breached
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <GitBranch className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">audit logs</h3>
              <p className="text-secondary-label">
                Every link created, edited, deleted logged with who/what/when/old-vs-new diffs
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">RLS policies</h3>
              <p className="text-secondary-label">
                Row-level security ensures users only see their workspace data—multi-tenant isolation
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <h4 className="text-center text-lg font-semibold mb-4 lowercase text-label">compliance ready</h4>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="bg-card border border-border rounded-lg px-6 py-3">
              <p className="text-sm font-semibold text-label">GDPR</p>
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-3">
              <p className="text-sm font-semibold text-label">SOC 2 Type II</p>
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-3">
              <p className="text-sm font-semibold text-label">HIPAA</p>
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-3">
              <p className="text-sm font-semibold text-label">ISO 27001</p>
            </div>
          </div>
          <p className="text-center text-sm text-secondary-label mt-4">
            Documentation, certifications, and BAAs available on request
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            built for scale
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Knapsack edge caching, adaptive throttling, and sub-millisecond redirects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">knapsack caching</h3>
                <p className="text-secondary-label">
                  Edge cache optimized like a 0/1 Knapsack—highest-traffic links cached for sub-millisecond redirects
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">adaptive throttling</h3>
                <p className="text-secondary-label">
                  System automatically scales under burst traffic—campaign launches don't break redirects
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">stratified loading</h3>
                <p className="text-secondary-label">
                  Analytics dashboards render 10% sample instantly, backfill precision in background—no 10s waits
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 lowercase text-label">performance guarantees</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-label">Redirect Latency</span>
                  <span className="text-label font-semibold">&lt;100ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-label">Uptime SLA</span>
                  <span className="text-label font-semibold">99.99%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-label">Analytics Load</span>
                  <span className="text-label font-semibold">&lt;2s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-label">API Response</span>
                  <span className="text-label font-semibold">&lt;200ms</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-secondary-label text-center">
                Backed by contractual SLA with downtime credits
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            team & access control
          </h2>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">role-based access</h3>
              <p className="text-secondary-label mb-4">
                Admin, Editor, Viewer, Approver—granular permissions per workspace
              </p>
              <ul className="text-sm text-secondary-label space-y-2">
                <li>• Admin: full control</li>
                <li>• Editor: create/edit links</li>
                <li>• Viewer: read-only analytics</li>
                <li>• Approver: approve link requests</li>
              </ul>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">approval workflows</h3>
              <p className="text-secondary-label mb-4">
                Require approval before links go live—governance without bottlenecks
              </p>
              <ul className="text-sm text-secondary-label space-y-2">
                <li>• Draft → Pending → Approved</li>
                <li>• Multi-level approval chains</li>
                <li>• Slack/email notifications</li>
              </ul>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Database className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">workspace isolation</h3>
              <p className="text-secondary-label mb-4">
                Each team sees only their data—multi-tenant by design
              </p>
              <ul className="text-sm text-secondary-label space-y-2">
                <li>• Separate domains per workspace</li>
                <li>• Cross-workspace analytics blocked</li>
                <li>• Data export per workspace</li>
              </ul>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="narrow">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
            talk to our enterprise team
          </h2>
          <p className="text-xl text-secondary-label">
            Custom SLAs, dedicated support, on-premise deployment, and volume discounts available.
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
