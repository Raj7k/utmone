import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileSpreadsheet, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { DownloadOptions } from "@/components/resources/DownloadOptions";
import { UsageSteps } from "@/components/resources/UsageSteps";
import { CTABanner } from "@/components/resources/CTABanner";

const UTMTemplate = () => {
  const utmTemplateCSV = `campaign_name,destination_url,utm_source,utm_medium,utm_campaign,utm_content,utm_term,short_link
Summer Sale 2024,https://example.com/sale,google,cpc,summer-sale-2024,hero-banner,discount,
LinkedIn Post - Product Launch,https://example.com/product,linkedin,social,product-launch-q1,organic-post,,
Email Newsletter - March,https://example.com/news,newsletter,email,march-newsletter-2024,header-cta,,
Partner Referral - Acme Corp,https://example.com/signup,acme-corp,referral,partner-referral,landing-page,,
Event Booth - TechConf,https://example.com/demo,offline,qr-code,techconf-2024,booth-qr,,`;

  const paidSearchTemplate = `campaign_name,destination_url,utm_source,utm_medium,utm_campaign,utm_content,utm_term
Brand Search Campaign,https://example.com,google,cpc,brand-search-q1,ad-variant-a,brand-keyword
Non-Brand Campaign,https://example.com,google,cpc,nonbrand-search-q1,ad-variant-b,competitor-keyword
Display Retargeting,https://example.com,google,display,retargeting-q1,banner-300x250,remarketing`;

  const socialMediaTemplate = `campaign_name,destination_url,utm_source,utm_medium,utm_campaign,utm_content
Facebook Post Organic,https://example.com,facebook,social,organic-social-feb,image-post-1
LinkedIn Sponsored,https://example.com,linkedin,paid-social,linkedin-sponsor-q1,carousel-ad-v2
Twitter Thread,https://example.com,twitter,social,twitter-thread-launch,thread-1`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to resources
          </Link>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase mb-4">
                utm template
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
                master template for consistent UTM tracking across paid, organic, social, email, partner, and offline campaigns.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                download template
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-16 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <DownloadOptions
            title="download in multiple formats"
            options={[
              {
                label: "Download CSV",
                format: "2 KB",
                icon: FileSpreadsheet,
                onClick: () => {
                  const blob = new Blob([utmTemplateCSV], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'utm-template.csv';
                  a.click();
                }
              },
              {
                label: "Open in Google Sheets",
                format: "Online",
                icon: Table,
                href: "https://docs.google.com/spreadsheets"
              },
              {
                label: "Download Excel",
                format: "5 KB",
                icon: FileSpreadsheet,
                onClick: () => {
                  const blob = new Blob([utmTemplateCSV], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'utm-template.xlsx';
                  a.click();
                }
              }
            ]}
          />
        </div>
      </section>

      {/* Template Preview */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            template structure
          </h2>

          <InlineTemplate
            title="Master UTM Template"
            description="Complete template with all channels"
            code={utmTemplateCSV}
            language="csv"
          />

          <div className="mt-12 space-y-6">
            <h3 className="text-2xl font-display font-semibold text-foreground lowercase">
              channel-specific templates
            </h3>

            <InlineTemplate
              title="Paid Search Campaigns"
              description="Google Ads, Bing Ads structure"
              code={paidSearchTemplate}
              language="csv"
            />

            <InlineTemplate
              title="Social Media Campaigns"
              description="Facebook, LinkedIn, Twitter"
              code={socialMediaTemplate}
              language="csv"
            />
          </div>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="py-16 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <UsageSteps
            steps={[
              { number: 1, title: "download template", time: "15 sec" },
              { number: 2, title: "fill in your campaign details", time: "10 min" },
              { number: 3, title: "import to utm.one or paste to your tool", time: "5 min" },
              { number: 4, title: "generate short links", time: "automated" }
            ]}
          />
        </div>
      </section>

      {/* Template Fields Explained */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            template fields explained
          </h2>

          <div className="grid gap-6">
            {[
              { field: "campaign_name", description: "Human-readable name for your campaign" },
              { field: "destination_url", description: "The final URL where users land" },
              { field: "utm_source", description: "Traffic source (google, facebook, newsletter)" },
              { field: "utm_medium", description: "Marketing medium (cpc, social, email)" },
              { field: "utm_campaign", description: "Campaign identifier (summer-sale-2024)" },
              { field: "utm_content", description: "Content variant (banner-a, text-link)" },
              { field: "utm_term", description: "Keywords or audience targeting" },
              { field: "short_link", description: "Auto-generated by utm.one (leave blank)" }
            ].map((item) => (
              <div key={item.field} className="p-4 rounded-lg bg-card border border-border/50">
                <code className="text-sm font-mono text-primary">{item.field}</code>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-muted-foreground">
              for detailed explanations, see the{" "}
              <Link to="/resources/guides/utm-guide" className="text-primary hover:underline">
                UTM Guide
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            related resources
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/resources/guides/utm-guide"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Guide</h3>
              <p className="text-sm text-muted-foreground">Conceptual understanding</p>
            </Link>

            <Link
              to="/resources/playbooks/naming-convention-playbook"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">Naming Convention Playbook</h3>
              <p className="text-sm text-muted-foreground">Implementation guide</p>
            </Link>

            <Link
              to="/resources/playbooks/utm-governance-playbook"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Governance Playbook</h3>
              <p className="text-sm text-muted-foreground">Enforcement strategies</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <CTABanner
            title="import this template directly to utm.one"
            description="automate your UTM generation and tracking"
            buttonText="get early access"
            buttonHref="/early-access"
            variant="primary"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UTMTemplate;
