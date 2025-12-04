import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { DownloadOptions } from "@/components/resources/DownloadOptions";
import { UsageSteps } from "@/components/resources/UsageSteps";
import { CTABanner } from "@/components/resources/CTABanner";

const AuditChecklistTemplate = () => {
  const checklistMarkdown = `# UTM Audit Checklist

## 1. Source/Medium Validation
- [ ] All utm_source values are lowercase
- [ ] No spaces in source values
- [ ] Source follows allowed taxonomy
- [ ] All utm_medium values are lowercase
- [ ] Medium follows allowed taxonomy (cpc, social, email, referral, organic)
- [ ] No custom medium values without approval
- [ ] Source/medium combinations are logical

## 2. Campaign Naming Validation
- [ ] All utm_campaign values are lowercase
- [ ] Campaign names follow naming convention
- [ ] No special characters except hyphens
- [ ] Date format is consistent (YYYY-MM or YYYYMMDD)
- [ ] Campaign structure matches template

## 3. Content/Term Consistency
- [ ] utm_content values describe actual creative
- [ ] utm_term used for keywords/audiences
- [ ] No duplicate content/term combinations
- [ ] Values are descriptive and meaningful

## 4. Lowercase Enforcement
- [ ] All UTM parameters are lowercase
- [ ] No mixed case values
- [ ] Spaces replaced with hyphens
- [ ] Special characters removed

## 5. Duplicates Check
- [ ] No duplicate campaign names
- [ ] No identical UTM combinations
- [ ] Unique short links per campaign
- [ ] No conflicting link destinations

## 6. Link Integrity
- [ ] All destination URLs are valid
- [ ] HTTPS used where possible
- [ ] No broken links
- [ ] Short links resolve correctly
- [ ] QR codes link to correct destinations`;

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold hero-gradient lowercase mb-4">
                audit checklist template
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
                comprehensive checklist for auditing existing links, UTMs, and tracking implementation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                download checklist
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
                label: "Download PDF",
                format: "Print-ready",
                icon: FileText,
                onClick: () => {
                  const blob = new Blob([checklistMarkdown], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'utm-audit-checklist.md';
                  a.click();
                }
              },
              {
                label: "Download Markdown",
                format: "Text format",
                icon: FileText,
                onClick: () => {
                  const blob = new Blob([checklistMarkdown], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'utm-audit-checklist.md';
                  a.click();
                }
              },
              {
                label: "Open in Notion",
                format: "Online",
                icon: FileText,
                href: "https://notion.so"
              }
            ]}
          />
        </div>
      </section>

      {/* Interactive Checklist */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            interactive checklist
          </h2>

          <ActionChecklist
            items={[
              { id: "source-lowercase", text: "All utm_source values are lowercase" },
              { id: "source-no-spaces", text: "No spaces in source values" },
              { id: "source-taxonomy", text: "Source follows allowed taxonomy" },
              { id: "medium-lowercase", text: "All utm_medium values are lowercase" },
              { id: "medium-taxonomy", text: "Medium follows allowed taxonomy" },
              { id: "campaign-lowercase", text: "All utm_campaign values are lowercase" },
              { id: "campaign-convention", text: "Campaign names follow naming convention" },
              { id: "campaign-special-chars", text: "No special characters except hyphens" },
              { id: "content-descriptive", text: "utm_content values describe actual creative" },
              { id: "lowercase-all", text: "All UTM parameters are lowercase" },
              { id: "no-duplicates", text: "No duplicate campaign names" },
              { id: "urls-valid", text: "All destination URLs are valid" },
              { id: "https-used", text: "HTTPS used where possible" },
              { id: "links-working", text: "Short links resolve correctly" }
            ]}
            storageKey="utm-audit-checklist"
          />
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="py-16 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <UsageSteps
            steps={[
              { number: 1, title: "download checklist", time: "15 sec" },
              { number: 2, title: "export current UTM data", time: "5 min" },
              { number: 3, title: "run through each section", time: "30 min" },
              { number: 4, title: "fix identified issues", time: "varies" },
              { number: 5, title: "schedule quarterly audits", time: "5 min" }
            ]}
          />
        </div>
      </section>

      {/* Audit Frequency */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            audit frequency recommendations
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-2">monthly</h3>
              <p className="text-sm text-muted-foreground">For high-volume campaigns with frequent launches</p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-2">quarterly</h3>
              <p className="text-sm text-muted-foreground">For standard operations and regular maintenance</p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-2">pre-launch</h3>
              <p className="text-sm text-muted-foreground">Before every major campaign to ensure quality</p>
            </div>
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
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Guide</h3>
              <p className="text-sm text-muted-foreground">Understanding UTM parameters</p>
            </Link>

            <Link
              to="/resources/playbooks/utm-governance-playbook"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Governance Playbook</h3>
              <p className="text-sm text-muted-foreground">Enforcement strategies</p>
            </Link>

            <Link
              to="/resources/templates/utm-template"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Template</h3>
              <p className="text-sm text-muted-foreground">Standard structure template</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <CTABanner
            title="run automated audits in utm.one"
            description="let utm.one automatically validate your UTMs"
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

export default AuditChecklistTemplate;
