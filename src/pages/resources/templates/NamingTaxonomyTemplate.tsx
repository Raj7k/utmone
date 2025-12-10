import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { DownloadOptions } from "@/components/resources/DownloadOptions";
import { UsageSteps } from "@/components/resources/UsageSteps";
import { CTABanner } from "@/components/resources/CTABanner";

const NamingTaxonomyTemplate = () => {
  const sourcesTaxonomy = `# utm_source Taxonomy

google,Search engine - Google
facebook,Social media - Facebook
linkedin,Social media - LinkedIn
twitter,Social media - Twitter / X
instagram,Social media - Instagram
newsletter,Email newsletter
partner,Partner/affiliate referrals
direct,Direct traffic
offline,Offline marketing (QR codes, print)`;

  const mediumTaxonomy = `# utm_medium Taxonomy

cpc,Cost per click (paid search)
paid-social,Paid social media ads
social,Organic social media
email,Email campaigns
referral,Referral traffic
affiliate,Affiliate marketing
organic,Organic search
display,Display advertising
qr-code,QR code scans`;

  const campaignStructure = `# utm_campaign Structure

Format: [channel]-[region]-[product]-[date]

Examples:
google-us-pro-202401,Google Ads for Pro tier in US, January 2024
linkedin-emea-enterprise-q1,LinkedIn campaign for Enterprise in EMEA, Q1
email-global-launch-feb,Global email campaign for product launch, February`;

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 mb-4">
                naming taxonomy template
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
                pre-built taxonomy for organizing campaigns by channel, region, product, and time period.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                download taxonomy
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
                format: "3 KB",
                icon: FileSpreadsheet,
                onClick: () => {
                  const combinedCSV = `${sourcesTaxonomy}\n\n${mediumTaxonomy}\n\n${campaignStructure}`;
                  const blob = new Blob([combinedCSV], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'naming-taxonomy.csv';
                  a.click();
                }
              },
              {
                label: "Download Excel",
                format: "5 KB",
                icon: FileSpreadsheet,
                onClick: () => alert("Excel download would start here")
              },
              {
                label: "Open in Google Sheets",
                format: "Online",
                icon: FileSpreadsheet,
                href: "https://docs.google.com/spreadsheets"
              }
            ]}
          />
        </div>
      </section>

      {/* Taxonomy Tables */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            taxonomy structure
          </h2>

          <div className="space-y-6">
            <InlineTemplate
              title="utm_source Taxonomy"
              description="Allowed source values with definitions"
              code={sourcesTaxonomy}
              language="csv"
            />

            <InlineTemplate
              title="utm_medium Taxonomy"
              description="Allowed medium values with definitions"
              code={mediumTaxonomy}
              language="csv"
            />

            <InlineTemplate
              title="utm_campaign Structure"
              description="Campaign naming format and examples"
              code={campaignStructure}
            />
          </div>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="py-16 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <UsageSteps
            steps={[
              { number: 1, title: "download taxonomy", time: "15 sec" },
              { number: 2, title: "customize for your business", time: "1 hour" },
              { number: 3, title: "share with team", time: "15 min" },
              { number: 4, title: "enforce in utm.one", time: "automated" },
              { number: 5, title: "review quarterly", time: "30 min" }
            ]}
          />
        </div>
      </section>

      {/* Customization Guidelines */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            customization guidelines
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-3">how to add new values</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Keep values lowercase</li>
                <li>• Use hyphens instead of spaces</li>
                <li>• Be descriptive but concise</li>
                <li>• Document the purpose of each value</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-3">naming conventions best practices</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Consistency is more important than perfection</li>
                <li>• Get team buy-in before rolling out</li>
                <li>• Start simple, add complexity only when needed</li>
                <li>• Review and prune unused values quarterly</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-3">common pitfalls to avoid</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Don't use mixed case (uppercase/lowercase)</li>
                <li>• Don't include spaces or special characters</li>
                <li>• Don't create too many taxonomy values upfront</li>
                <li>• Don't allow custom values without governance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            related resources
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/resources/playbooks/naming-convention-playbook"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">Naming Convention Playbook</h3>
              <p className="text-sm text-muted-foreground">Implementation guide</p>
            </Link>

            <Link
              to="/resources/guides/utm-guide"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Guide</h3>
              <p className="text-sm text-muted-foreground">Conceptual understanding</p>
            </Link>

            <Link
              to="/resources/templates/utm-template"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Template</h3>
              <p className="text-sm text-muted-foreground">Apply your taxonomy</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <CTABanner
            title="enforce taxonomy rules in utm.one"
            description="automate validation and ensure compliance"
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

export default NamingTaxonomyTemplate;
