import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { BeforeAfterComparison } from "@/components/landing/BeforeAfterComparison";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { Shield, Settings, FileText, CheckCircle2, Layers, Lock, BarChart3 } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const MarketingOps = () => {
  const faqs = [
    {
      question: "Can I enforce naming conventions across our entire marketing team?",
      answer: "Yes. Clean-Track lets you define templates and validation rules. Team members can't create links that don't match your approved UTM structure. Lowercase enforcement, required fields, and pattern matching are all configurable."
    },
    {
      question: "How do I migrate existing links without breaking campaigns?",
      answer: "You can bulk import existing links with their UTM parameters. utm.one will normalize the UTMs to your new Clean-Track standard while preserving the short codes, so nothing breaks."
    },
    {
      question: "What if someone creates a link outside utm.one?",
      answer: "You can set governance rules to require utm.one for all campaign links. Plus, utm.one provides a browser extension and Slack/Teams integration so creating compliant links is easier than going rogue."
    },
    {
      question: "Can I audit who created which links?",
      answer: "Yes. Every link includes creator info, timestamps, and modification history. You can filter by user, date, campaign, or UTM parameter to audit link creation across the org."
    },
    {
      question: "How does utm.one handle multiple workspaces?",
      answer: "Each workspace has its own governance rules, domains, and team members. Perfect for agencies managing multiple clients or enterprises with regional teams."
    },
    {
      question: "Will this slow down our marketers?",
      answer: "No. Templates auto-fill UTM parameters, so creating a compliant link takes 10 seconds. Faster than manually typing UTMs into a spreadsheet."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Marketing Ops"
        description="Governance without friction. utm.one enforces the structure your org needs—automatically, quietly, consistently."
        canonical="https://utm.one/solutions/marketing-ops"
        keywords={['marketing operations', 'UTM governance', 'campaign governance', 'marketing ops tools', 'data quality']}
      />
      <WebPageSchema 
        name="utm.one for Marketing Ops"
        description="Governance without friction. utm.one enforces the structure your org needs—automatically, quietly, consistently."
        url="https://utm.one/solutions/marketing-ops"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Marketing Ops', url: 'https://utm.one/solutions/marketing-ops' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <SocialProofCounter role="ops" variant="minimal" />
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              governance without friction.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one enforces the structure your org needs—automatically, quietly, consistently. no more manual audits. no more broken reports.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free for 14 days • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Moment Story */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the audit that revealed your data quality nightmare"
            timestamp="Thursday, 3:12 PM"
            scenario="Your CMO wants a report on Q4 campaign performance. You pull GA4 data. 47 variations of 'utm_source' appear across 12 teams. 'linkedin', 'LinkedIn', 'LINKEDIN', 'linked-in', 'lnkdin'—all variations of the same source, but GA4 treats them as separate. 38% of traffic is '(not set)' because someone forgot UTM parameters. The report is worthless."
            visual={
              <div className="bg-card border-2 border-destructive rounded-xl p-6 font-mono text-sm">
                <div className="text-destructive font-semibold mb-3">❌ Your GA4 Data Nightmare:</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">utm_source variations</div>
                    <div className="space-y-1 text-xs">
                      <div>linkedin (8,234 clicks)</div>
                      <div>LinkedIn (3,891 clicks)</div>
                      <div>LINKEDIN (1,203 clicks)</div>
                      <div>linked-in (487 clicks)</div>
                      <div>lnkdin (156 clicks)</div>
                      <div>LI (89 clicks)</div>
                      <div>(not set) (12,847 clicks)</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">utm_medium variations</div>
                    <div className="space-y-1 text-xs">
                      <div>cpc (6,123 clicks)</div>
                      <div>CPC (2,456 clicks)</div>
                      <div>paid (1,890 clicks)</div>
                      <div>paid-social (734 clicks)</div>
                      <div>(not set) (15,704 clicks)</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  Total data loss: 46%. CMO report impossible to deliver.
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground lowercase mb-6">
              messy data vs clean data
            </h2>
            <p className="text-xl text-muted-foreground">
              Same campaigns. Different data quality.
            </p>
          </div>
          
          <BeforeAfterComparison
            beforeImage="/placeholder.svg"
            afterImage="/placeholder.svg"
            beforeLabel="47 variations"
            afterLabel="1 standard"
            caption="100% consistent UTMs = 100% reliable attribution = 100% confidence in your reports"
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              Quality becomes the default.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Workspace governance (roles, permissions, approvals)",
              "Naming system templates (enforce structure)",
              "Approval flows (optional review before publishing)",
              "Syntax rules (lowercase, required fields, patterns)",
              "Audit logs (who created what, when)",
              "Monthly clean-track audits (data quality score)",
              "Consistent UTMs across teams (zero variations)",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 5: Growth Loop - ROI Calculator */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase mb-4">
              calculate your data quality ROI
            </h2>
            <p className="text-lg text-muted-foreground">
              How much time does your team waste cleaning messy UTMs?
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Fold 6: Feature Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              built for marketing ops
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Layers}
              title="clean-track"
              description="The backbone of your tracking discipline"
              color="blazeOrange"
              delay={0}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={Shield}
              title="governance"
              description="Roles, permissions, approvals"
              color="deepSea"
              delay={0.1}
              href="/features/governance"
            />
            <FeatureMappedCard
              icon={Lock}
              title="link immunity"
              description="Ownership, lifespan, history"
              color="primary"
              delay={0.2}
              href="/features/link-immunity"
            />
            <FeatureMappedCard
              icon={FileText}
              title="naming system"
              description="A standard the entire team follows"
              color="blazeOrange"
              delay={0.3}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={Settings}
              title="utm builder"
              description="Zero-error parameters"
              color="deepSea"
              delay={0.4}
              href="/features/utm-builder"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="analytics"
              description="Trustworthy data, always"
              color="primary"
              delay={0.5}
              href="/features/analytics"
            />
          </div>
        </div>
      </section>

      {/* Fold 7: FAQs */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="marketing ops teams" faqs={faqs} />
        </div>
      </section>

      {/* Fold 8: CTA */}
      <PremiumCTASection
        headline="ready to enforce quality?"
        subheadline="join marketing ops teams who trust utm.one for governance without friction."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default MarketingOps;
