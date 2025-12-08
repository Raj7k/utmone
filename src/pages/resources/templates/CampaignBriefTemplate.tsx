import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { DownloadOptions } from "@/components/resources/DownloadOptions";
import { UsageSteps } from "@/components/resources/UsageSteps";
import { CTABanner } from "@/components/resources/CTABanner";

const CampaignBriefTemplate = () => {
  const campaignOverview = `# Campaign Overview

**Campaign Name:** Summer Product Launch 2024
**Objective:** Drive 10,000 signups for new product tier
**Timeline:** June 1 - August 31, 2024
**Budget:** $50,000
**Owner:** Marketing Team Lead
**Status:** Planning`;

  const targetAudience = `# Target Audience

**Primary Persona:** SaaS Founders & Marketing Leaders
**Segments:** 
- Series A-B funded startups (500+ employees)
- Marketing ops professionals at mid-market companies
- Data/analytics teams looking for better attribution

**Geographies:** North America, Western Europe`;

  const trackingPlan = `# Tracking Plan

## UTM Structure
- utm_source: google, linkedin, twitter, newsletter
- utm_medium: cpc, paid-social, email, organic
- utm_campaign: summer-launch-2024
- utm_content: hero-banner, text-ad, video-ad
- utm_term: [keywords/audiences]

## Events to Track
- Page View (landing page)
- Signup Started
- Signup Completed
- Product Demo Requested
- Free Trial Activated

## Goals
- Primary: Signups
- Secondary: Demo requests
- Tertiary: Email subscriptions`;

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 lowercase mb-4">
                campaign brief template
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
                template for planning campaign launches with built-in UTM and tracking requirements.
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
                label: "Download PDF",
                format: "Print-ready",
                icon: FileText,
                onClick: () => alert("PDF download would start here")
              },
              {
                label: "Open in Google Docs",
                format: "Online",
                icon: FileText,
                href: "https://docs.google.com"
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

      {/* Template Sections */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            template sections
          </h2>

          <div className="space-y-6">
            <InlineTemplate
              title="1. Campaign Overview"
              description="High-level campaign details and objectives"
              code={campaignOverview}
            />

            <InlineTemplate
              title="2. Target Audience"
              description="Who you're targeting and why"
              code={targetAudience}
            />

            <InlineTemplate
              title="3. Tracking Plan"
              description="UTM structure and analytics setup"
              code={trackingPlan}
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
              { number: 2, title: "fill in campaign details", time: "45 min" },
              { number: 3, title: "get stakeholder sign-off", time: "1 week" },
              { number: 4, title: "use tracking plan to set up utm.one", time: "30 min" },
              { number: 5, title: "launch and track", time: "ongoing" }
            ]}
          />
        </div>
      </section>

      {/* When to Use */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 lowercase">
            when to use this template
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Product launches",
              "Seasonal campaigns",
              "Multi-channel campaigns",
              "Events and webinars",
              "Partnership campaigns",
              "Brand awareness campaigns"
            ].map((useCase) => (
              <div key={useCase} className="p-6 rounded-xl border border-border/50 bg-card">
                <p className="text-foreground font-medium">{useCase}</p>
              </div>
            ))}
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
              to="/resources/templates/utm-template"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">UTM Template</h3>
              <p className="text-sm text-muted-foreground">Standard tracking structure</p>
            </Link>

            <Link
              to="/resources/playbooks/naming-convention-playbook"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">Naming Convention Playbook</h3>
              <p className="text-sm text-muted-foreground">Campaign naming rules</p>
            </Link>

            <Link
              to="/resources/playbooks/event-led-growth-playbook"
              className="p-6 rounded-xl border border-border/50 bg-card hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-foreground mb-2">Event-Led Growth Playbook</h3>
              <p className="text-sm text-muted-foreground">Event campaign strategies</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <CTABanner
            title="build your campaign tracking in utm.one"
            description="from brief to analytics in one platform"
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

export default CampaignBriefTemplate;
