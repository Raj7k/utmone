import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Users, FolderKanban, FileBarChart, Globe, Shield, Zap } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

export default function Agencies() {
  return (
    <MainLayout>
      <SEO
        title="utm.one for Agencies - Multi-Client Link Management"
        description="Workspaces, team invites, white-label reports, and client-branded domains. Manage dozens of clients without chaos."
        canonical="https://utm.one/solutions/agencies"
        keywords={["agency link management", "multi-client workspaces", "white-label reports", "agency utm tracking"]}
      />

      <FeatureHero
        headlineLine1="built for agencies"
        headlineLine2="managing dozens of clients."
        subheadline="Workspaces, team invites, white-label reports, and client-branded domains. No more spreadsheet chaos."
      />

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            one platform, unlimited clients
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Each client gets their own workspace with isolated data, branded domains, and custom UTM rules
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <FolderKanban className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">client workspaces</h3>
              <p className="text-secondary-label">
                Create a workspace for each client—data isolated, UTM templates separate, no cross-contamination
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">branded domains</h3>
              <p className="text-secondary-label">
                Each client can use their own domain—nike.com/go/, adidas.com/c/, reebok.com/u/
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-card border border-border rounded-2xl p-8">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-3 lowercase">team invites</h3>
              <p className="text-secondary-label">
                Invite client team members to their workspace—they see only their data, not others
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <h4 className="text-center text-lg font-semibold mb-6 lowercase text-label">example: managing 5 clients</h4>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-label mb-1">Nike</p>
              <p className="text-xs text-secondary-label">nike.com/go/</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-label mb-1">Adidas</p>
              <p className="text-xs text-secondary-label">adidas.com/c/</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-label mb-1">Reebok</p>
              <p className="text-xs text-secondary-label">reebok.com/u/</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-label mb-1">Puma</p>
              <p className="text-xs text-secondary-label">puma.com/l/</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-label mb-1">ASICS</p>
              <p className="text-xs text-secondary-label">asics.com/go/</p>
            </div>
          </div>
          <p className="text-center text-sm text-secondary-label mt-4">
            All managed from one account. Zero confusion. Zero cross-pollination.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            white-label reporting
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Client reports with your branding, their logo, and zero utm.one references
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileBarChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">automated PDF reports</h3>
                <p className="text-secondary-label">
                  Weekly, monthly, or custom-scheduled reports sent to clients automatically
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">custom branding</h3>
                <p className="text-secondary-label">
                  Your agency logo, client logo, custom color scheme—fully white-labeled
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">shareable dashboards</h3>
                <p className="text-secondary-label">
                  Give clients view-only dashboard access—real-time data without giving them full login
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">what's included in reports</h4>
            <ul className="space-y-3 text-secondary-label">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Total clicks, unique visitors, conversion rate</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Top-performing campaigns by UTM breakdown</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Device, browser, and geolocation analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Time-series charts showing week-over-week growth</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Top referrers and traffic sources</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Executive summary with key insights</span>
              </li>
            </ul>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            agency pricing that scales
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold mb-2 lowercase">starter</h3>
            <p className="text-4xl font-bold text-primary mb-4">$99<span className="text-lg text-secondary-label">/mo</span></p>
            <ul className="space-y-3 text-secondary-label mb-6">
              <li>• Up to 5 client workspaces</li>
              <li>• 5 custom domains</li>
              <li>• Unlimited team invites</li>
              <li>• White-label reports</li>
            </ul>
          </div>
          <div className="bg-primary/5 border-2 border-primary rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-display font-semibold mb-2 lowercase">growth</h3>
            <p className="text-4xl font-bold text-primary mb-4">$299<span className="text-lg text-secondary-label">/mo</span></p>
            <ul className="space-y-3 text-secondary-label mb-6">
              <li>• Up to 20 client workspaces</li>
              <li>• 20 custom domains</li>
              <li>• Unlimited team invites</li>
              <li>• White-label reports</li>
              <li>• Priority support</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold mb-2 lowercase">enterprise</h3>
            <p className="text-4xl font-bold text-primary mb-4">Custom</p>
            <ul className="space-y-3 text-secondary-label mb-6">
              <li>• Unlimited workspaces</li>
              <li>• Unlimited domains</li>
              <li>• Dedicated support</li>
              <li>• Custom SLA</li>
              <li>• Volume discounts</li>
            </ul>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="narrow">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
            stop juggling spreadsheets
          </h2>
          <p className="text-xl text-secondary-label">
            One dashboard to manage every client's links, UTMs, QR codes, and analytics.
          </p>
          <div className="pt-6">
            <a
              href="/early-access"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors lowercase"
            >
              start managing clients
            </a>
          </div>
        </div>
      </FeatureSection>
    </MainLayout>
  );
}
