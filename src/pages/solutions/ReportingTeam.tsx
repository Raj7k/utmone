import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { Database, FileSpreadsheet, GitBranch, CheckCircle2, Filter, Clock } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const ReportingTeam = () => {
  const faqs = [
    {
      question: "How does utm.one reduce manual data cleanup time?",
      answer: "Enforced UTM standards mean zero typos, zero capitalization errors, zero missing parameters. Your team stops spending 40% of their time normalizing marketing data and starts analyzing it."
    },
    {
      question: "Can we export utm.one data to our data warehouse?",
      answer: "Yes. Native BigQuery, Snowflake, and Redshift connectors. Plus, webhook export to any HTTP endpoint. Your reports pull from clean source data, not marketing's messy spreadsheets."
    },
    {
      question: "What if Marketing changes UTM conventions mid-quarter?",
      answer: "Historical data stays consistent because utm.one enforces the taxonomy at creation. New conventions apply forward-only. Your quarter-over-quarter reports don't break."
    },
    {
      question: "How do we reconcile utm.one data with GA4?",
      answer: "utm.one IS the source of truth that GA4 reads from. Every link created in utm.one matches GA4's attribution model because the UTMs are validated before the click happens."
    },
    {
      question: "Can we create custom reports without bothering engineering?",
      answer: "Yes. SQL-like query builder, scheduled exports, and API access. Your team doesn't wait on engineering for 'one more report.'"
    },
    {
      question: "What about compliance and data retention?",
      answer: "GDPR-compliant with configurable retention periods. Audit logs track every change. Data export for regulatory requests. Enterprise tier includes BAA for HIPAA compliance."
    }
  ];

  const benefits = [
    {
      icon: Database,
      title: "clean data in, clean reports out",
      description: "Every dashboard tells the same story because every link follows the same standard.",
      color: "primary"
    },
    {
      icon: FileSpreadsheet,
      title: "export to anywhere",
      description: "BigQuery, Snowflake, Redshift, Looker, Tableau. If it reads HTTP or SQL, it reads utm.one.",
      color: "blazeOrange"
    },
    {
      icon: GitBranch,
      title: "version-controlled taxonomy",
      description: "See who changed what, when, and why. Roll back bad conventions. Keep historical reports consistent.",
      color: "deepSea"
    },
    {
      icon: Clock,
      title: "automated scheduled exports",
      description: "Daily/weekly/monthly exports to S3, SFTP, or webhook. Your reports update automatically.",
      color: "primary"
    },
    {
      icon: Filter,
      title: "sql-like query builder",
      description: "Filter by campaign, date range, channel, custom fields. No engineering tickets required.",
      color: "blazeOrange"
    },
    {
      icon: CheckCircle2,
      title: "audit trails for compliance",
      description: "Every link creation, edit, and deletion logged with user, timestamp, and reason. SOC 2 ready.",
      color: "deepSea"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2]" style={{ background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)' }} />
      <SEO 
        title="utm.one for Reporting Teams"
        description="Clean data in, clean reports out. utm.one gives BI analysts and reporting teams the data infrastructure they need to stop cleaning and start analyzing."
        canonical="https://utm.one/solutions/reporting-team"
        keywords={['reporting analytics', 'data warehouse', 'BI tools', 'clean data', 'automated reporting']}
      />
      <WebPageSchema 
        name="utm.one for Reporting Teams"
        description="Clean data in, clean reports out. utm.one gives BI analysts and reporting teams the data infrastructure they need to stop cleaning and start analyzing."
        url="https://utm.one/solutions/reporting-team"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Reporting Team', url: 'https://utm.one/solutions/reporting-team' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero with RetroGradientMesh */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              stop cleaning data. start trusting it.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives reporting teams the clean, consistent source data they need. no more spending 40% of your time normalizing marketing's mess.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Enterprise-ready • SOC 2 compliant • GDPR ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: "The Moment" Story Card */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the quarterly report that showed 47 utm variations"
            timestamp="Friday, 3:47 PM"
            scenario="The CMO wants a quarterly performance report by Monday. You query GA4 and find 47 different variations of 'utm_medium=social' (social, Social, SOCIAL, socialmedia, sm, social-media, soc, etc.). You spend the weekend manually grouping them into a single category. Again. This is the fourth quarter in a row."
            visual={
              <div className="bg-card border-2 border-destructive rounded-xl p-6 font-mono text-sm">
                <div className="text-destructive font-semibold mb-3">❌ Your Data Cleanup Spreadsheet:</div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">utm_medium variations for Q4:</div>
                  <div className="flex justify-between">
                    <span>social, Social, SOCIAL, socialmedia</span>
                    <span className="text-destructive">→ social</span>
                  </div>
                  <div className="flex justify-between">
                    <span>sm, soc, social-media, social_media</span>
                    <span className="text-destructive">→ social</span>
                  </div>
                  <div className="flex justify-between">
                    <span>email, Email, EMAIL, em, eml</span>
                    <span className="text-destructive">→ email</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  8 hours to normalize data. 2 hours to analyze. Again.
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After Comparison */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto">
              same data needs. different time investment.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="every dashboard tells a different story"
            afterTitle="one source of truth"
            beforeContent={
              <div className="space-y-3 font-mono text-sm">
                <div className="text-destructive font-semibold mb-2">Your Weekly Routine:</div>
                <div className="text-muted-foreground">Monday: Marketing's spreadsheet says 12K social clicks</div>
                <div className="text-muted-foreground">Tuesday: GA4 says 8.7K social clicks</div>
                <div className="text-muted-foreground">Wednesday: HubSpot says 15.2K social clicks</div>
                <div className="text-xs text-destructive mt-4">
                  All three tools read the same data. None agree. You spend 6 hours reconciling.
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3 font-mono text-sm">
                <div className="text-primary font-semibold mb-2">Your New Reality:</div>
                <div className="text-foreground">Marketing Dashboard: 12,453 social clicks</div>
                <div className="text-foreground">GA4: 12,453 social clicks</div>
                <div className="text-foreground">HubSpot: 12,453 social clicks</div>
                <div className="text-xs text-primary mt-4">
                  All three tools read the same clean UTMs. All agree. Zero reconciliation needed.
                </div>
              </div>
            }
            caption="Clean source data means every report tells the same story"
          />
        </div>
      </section>

      {/* Fold 4: What You Get - Visual Benefit Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              The data infrastructure your reports deserve.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={benefits} />
        </div>
      </section>

      {/* Fold 5: Role-Specific FAQs */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="reporting teams" faqs={faqs} />
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="ready to trust your reports?"
        subheadline="join reporting teams who stopped cleaning and started analyzing."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default ReportingTeam;
