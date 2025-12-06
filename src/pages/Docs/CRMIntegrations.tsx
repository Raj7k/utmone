import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, Webhook, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TableOfContents } from "@/components/resources/TableOfContents";

const CRMIntegrations = () => {
  const [copiedSalesforce, setCopiedSalesforce] = useState(false);
  const [copiedHubSpot, setCopiedHubSpot] = useState(false);

  const salesforceExample = `// Salesforce Process Builder Setup
// 1. Go to Setup → Process Builder
// 2. Create New Process on "Opportunity"
// 3. Add Criteria: Stage = "Closed Won"
// 4. Add Action: Send Outbound Message
// 5. Use this endpoint URL:
https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/webhook-salesforce/YOUR_WORKSPACE_ID

// The outbound message will include:
// - Email (Contact Email)
// - Amount (Opportunity Amount)
// - StageName (e.g., "Closed Won")
// - OpportunityId`;

  const hubspotExample = `// HubSpot Workflow Setup
// 1. Go to Automation → Workflows
// 2. Create Contact-Based Workflow
// 3. Trigger: Lifecycle Stage changes to "Customer"
// 4. Action: Send Webhook
// 5. Use this endpoint:
https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/webhook-hubspot/YOUR_WORKSPACE_ID

// Webhook Payload (JSON):
{
  "email": "{{contact.email}}",
  "lifecyclestage": "{{contact.lifecyclestage}}",
  "dealstage": "{{deal.dealstage}}",
  "amount": "{{deal.amount}}"
}`;

  const handleCopySalesforce = () => {
    navigator.clipboard.writeText(salesforceExample);
    setCopiedSalesforce(true);
    setTimeout(() => setCopiedSalesforce(false), 2000);
  };

  const handleCopyHubSpot = () => {
    navigator.clipboard.writeText(hubspotExample);
    setCopiedHubSpot(true);
    setTimeout(() => setCopiedHubSpot(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingNavigation />

      {/* Hero */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold hero-gradient mb-6">
              CRM integrations
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Connect Salesforce, HubSpot, or any CRM to sync deal stages and revenue back to utm.one. 
              Track full-funnel attribution from click to close.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-16">
          {/* Main Content */}
          <div className="space-y-24">
            {/* Overview */}
            <section id="overview">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                how CRM sync works
              </h2>
              
              <p className="text-lg text-foreground leading-relaxed mb-8">
                When a lead moves through your sales funnel (SAL → SQL → Opportunity → Closed Won), 
                your CRM can send us a webhook so we know where they are. This enables full revenue attribution.
              </p>

              <div className="bg-muted/20 border border-border rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">the flow</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Lead clicks your utm.one short link and converts on your website.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Your sales team works the deal in Salesforce or HubSpot.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">3.</span>
                    <span>When they change the stage (e.g., mark as "Closed Won"), your CRM fires a webhook.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">4.</span>
                    <span>We receive the deal value and attribute it to the original campaign.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">5.</span>
                    <span>You see revenue-per-campaign metrics in your analytics dashboard.</span>
                  </li>
                </ol>
              </div>
            </section>

            {/* Salesforce Integration */}
            <section id="salesforce">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                salesforce integration
              </h2>

              <div className="space-y-6">
                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">get your workspace webhook URL</h3>
                      <p className="text-muted-foreground mb-4">
                        Go to Settings → Integrations in utm.one to find your unique Salesforce webhook URL.
                      </p>
                      <Link to="/settings/integrations">
                        <Button variant="outline" size="sm">
                          Go to Integrations
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">create outbound message</h3>
                      <p className="text-muted-foreground mb-4">
                        In Salesforce, go to <strong>Setup → Process Builder</strong> and create a new process that triggers 
                        when an Opportunity's stage changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">configure the action</h3>
                      <p className="text-muted-foreground mb-4">
                        Add an action "Send Outbound Message" with the following fields:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Email (from Contact)</li>
                        <li>• Amount (Opportunity Amount)</li>
                        <li>• StageName (Opportunity Stage)</li>
                        <li>• OpportunityId</li>
                      </ul>
                      <div className="relative">
                        <pre className="bg-muted/50 p-4 rounded-xl overflow-x-auto text-sm">
                          <code>{salesforceExample}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopySalesforce}
                          className="absolute top-2 right-2"
                        >
                          {copiedSalesforce ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">test the integration</h3>
                      <p className="text-muted-foreground">
                        Change an Opportunity to "Closed Won" in Salesforce. Within a few minutes, 
                        you should see the deal appear in your utm.one Analytics → Pipeline Funnel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HubSpot Integration */}
            <section id="hubspot">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                HubSpot integration
              </h2>

              <div className="space-y-6">
                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">get your webhook URL</h3>
                      <p className="text-muted-foreground mb-4">
                        Navigate to Settings → Integrations in utm.one to find your HubSpot webhook endpoint.
                      </p>
                      <Link to="/settings/integrations">
                        <Button variant="outline" size="sm">
                          Go to Integrations
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">create workflow</h3>
                      <p className="text-muted-foreground mb-4">
                        In HubSpot, go to <strong>Automation → Workflows</strong> and create a contact-based workflow.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">add webhook action</h3>
                      <p className="text-muted-foreground mb-4">
                        Set the trigger to "Lifecycle stage changes to Customer" (or when deal stage changes to "Closed Won"). 
                        Add a webhook action with this configuration:
                      </p>
                      <div className="relative">
                        <pre className="bg-muted/50 p-4 rounded-xl overflow-x-auto text-sm">
                          <code>{hubspotExample}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyHubSpot}
                          className="absolute top-2 right-2"
                        >
                          {copiedHubSpot ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-primary/10 text-primary">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">activate and test</h3>
                      <p className="text-muted-foreground">
                        Turn on your workflow. When a contact's lifecycle stage changes or a deal closes, 
                        the webhook fires and we record the conversion in your utm.one dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Zapier / Other CRMs */}
            <section id="zapier">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Zapier & other CRMs
              </h2>

              <p className="text-lg text-foreground leading-relaxed mb-8">
                Don't use Salesforce or HubSpot? Connect any CRM via Zapier, Make, or direct API.
              </p>

              <div className="border border-border rounded-2xl p-8 bg-card mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <Zap className="w-6 h-6 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Zapier integration</h3>
                    <p className="text-muted-foreground mb-4">
                      Use Zapier to connect 5,000+ apps including Pipedrive, Zoho, Microsoft Dynamics, 
                      Copper, and Close.
                    </p>
                  </div>
                </div>
                <ol className="text-sm text-muted-foreground space-y-2 ml-10">
                  <li>1. Create a new Zap with your CRM as the trigger (e.g., "Deal stage changed").</li>
                  <li>2. Add a Webhook action (POST request).</li>
                  <li>3. Use the Pipeline API endpoint: <code className="text-primary">https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-pipeline</code></li>
                  <li>4. Map the fields: email, stage, value, timestamp.</li>
                </ol>
              </div>

              <div className="border border-border rounded-2xl p-8 bg-card">
                <div className="flex items-start gap-4 mb-4">
                  <Webhook className="w-6 h-6 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">direct API access</h3>
                    <p className="text-muted-foreground mb-4">
                      For custom integrations or internal CRMs, use our Pipeline API directly.
                    </p>
                  </div>
                </div>
                <pre className="bg-muted/50 p-4 rounded-xl overflow-x-auto text-sm">
                  <code>{`POST /functions/v1/track-pipeline
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "email": "customer@example.com",
  "stage": "closed_won",
  "value": 10000,
  "currency": "USD",
  "timestamp": "2024-01-15T10:00:00Z"
}`}</code>
                </pre>
              </div>
            </section>

            {/* Next Steps */}
            <section className="border-t border-border pt-16">
              <div className="bg-muted/20 border border-border rounded-2xl p-12 text-center">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  need help setting up?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our team can help you configure your CRM integration.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/support">
                    <Button variant="marketing">
                      Contact Support
                    </Button>
                  </Link>
                  <Link to="/docs/api">
                    <Button variant="outline">
                      API Documentation
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

export default CRMIntegrations;
