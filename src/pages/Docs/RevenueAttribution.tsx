import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { TableOfContents } from "@/components/resources/TableOfContents";

const RevenueAttribution = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingNavigation />

      {/* Hero */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold hero-gradient mb-6">
              revenue attribution
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Track the full customer journey from first click to closed deal. Know exactly which campaigns drive revenue, not just traffic.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-16">
          {/* Main Content */}
          <div className="space-y-24">
            {/* What is Revenue Attribution */}
            <section id="what-is-attribution">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                what is revenue attribution?
              </h2>
              
              <p className="text-lg text-foreground leading-relaxed mb-8">
                Revenue attribution connects your marketing campaigns to actual closed deals. 
                Instead of just seeing "500 clicks," you see "LinkedIn Ad generated 3 deals worth $15,000."
              </p>

              <div className="bg-muted/20 border border-border rounded-2xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">The Problem</h3>
                <p className="text-muted-foreground">
                  Most link shorteners only track clicks. They tell you traffic happened, but not if that traffic turned into customers. 
                  You're left guessing which campaigns actually made money.
                </p>
              </div>

              <div className="rounded-2xl p-8 bg-primary/5 border border-primary/20">
                <h3 className="text-xl font-semibold text-foreground mb-4">The Solution</h3>
                <p className="text-muted-foreground">
                  utm.one tracks the full funnel—from click to lead to SQL to closed deal. 
                  When your sales team closes a $10,000 deal, we show you which campaign brought that customer in.
                </p>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                how it works
              </h2>

              <div className="space-y-6">
                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">visitor clicks your link</h3>
                      <p className="text-muted-foreground">
                        Someone clicks your utm.one short link from a LinkedIn ad, email, or social post. 
                        We assign them a unique visitor ID and track where they came from.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">they become a lead</h3>
                      <p className="text-muted-foreground">
                        The visitor fills out a form, signs up for a demo, or subscribes. 
                        Our tracking pixel captures their email and links it to their original click.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">sales team works the deal</h3>
                      <p className="text-muted-foreground">
                        Your sales team qualifies the lead (SAL → SQL), moves them through the pipeline, 
                        and eventually closes the deal in your CRM (Salesforce, HubSpot, etc.).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">we sync the revenue</h3>
                      <p className="text-muted-foreground">
                        When the deal closes, your CRM sends us a webhook with the deal value. 
                        We attribute that $10,000 back to the original campaign that brought them in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* The Funnel View */}
            <section id="funnel-view">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                full-funnel visibility
              </h2>

              <p className="text-lg text-foreground leading-relaxed mb-8">
                See your entire conversion funnel in one place. Track how many clicks turn into leads, 
                how many leads become SQLs, and which campaigns drive actual revenue.
              </p>

              <div className="bg-muted/20 border border-border rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">example: linkedin ad campaign</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground font-medium">Clicks</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">500</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground font-medium">Leads</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">50</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-muted-foreground" />
                      <span className="text-foreground font-medium">SQLs</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">12</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="text-foreground font-medium">Closed Won</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">3 deals ($15,000)</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  <strong className="text-foreground">Result:</strong> Your LinkedIn ad didn't just drive traffic—it drove $15,000 in revenue. 
                  Now you know it's worth continuing.
                </p>
              </div>
            </section>

            {/* Setup Instructions */}
            <section id="setup">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                how to set it up
              </h2>

              <div className="space-y-6">
                <div className="border border-border rounded-2xl p-8 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">step 1: install tracking pixel</h3>
                  <p className="text-muted-foreground mb-4">
                    Add the utm.one tracking pixel to your website's <code className="text-primary">&lt;head&gt;</code> tag. 
                    This captures pageviews and form submissions.
                  </p>
                  <Link to="/docs/pixel-installation">
                    <Button variant="outline" size="sm">
                      Pixel Installation Guide
                    </Button>
                  </Link>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">step 2: connect your CRM</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect Salesforce, HubSpot, or any CRM via webhook. When deals close, 
                    we automatically sync the revenue data back to utm.one.
                  </p>
                  <Link to="/docs/crm-integrations">
                    <Button variant="outline" size="sm">
                      CRM Integration Guide
                    </Button>
                  </Link>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">step 3: view your funnel</h3>
                  <p className="text-muted-foreground mb-4">
                    Navigate to Analytics → Pipeline Funnel to see conversion rates and revenue by campaign.
                  </p>
                  <Link to="/dashboard/analytics">
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section id="use-cases">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                who needs revenue attribution?
              </h2>

              <div className="grid gap-6">
                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">performance marketers</h3>
                  <p className="text-muted-foreground text-sm">
                    Prove which paid ads drive revenue, not just clicks. Stop wasting budget on channels that don't convert.
                  </p>
                </div>

                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">revenue ops teams</h3>
                  <p className="text-muted-foreground text-sm">
                    Unify marketing and sales data. See which campaigns generate pipeline and which close deals.
                  </p>
                </div>

                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">B2B SaaS companies</h3>
                  <p className="text-muted-foreground text-sm">
                    Track multi-touch attribution across long sales cycles. Know which touchpoints matter most.
                  </p>
                </div>

                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">agencies</h3>
                  <p className="text-muted-foreground text-sm">
                    Show clients ROI with real revenue numbers, not vanity metrics. Prove your campaigns drive growth.
                  </p>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <section className="border-t border-border pt-16">
              <div className="bg-muted/20 border border-border rounded-2xl p-12 text-center">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  ready to track revenue?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Set up revenue attribution in under 10 minutes.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/docs/pixel-installation">
                    <Button variant="marketing">
                      Install Tracking Pixel
                    </Button>
                  </Link>
                  <Link to="/docs/crm-integrations">
                    <Button variant="outline">
                      Connect Your CRM
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Table of Contents */}
          <TableOfContents />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RevenueAttribution;
