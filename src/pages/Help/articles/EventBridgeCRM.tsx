import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";
import { ProTip } from "@/components/help/ProTip";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink } from "lucide-react";

const EventBridgeCRM = () => {
  return (
    <HelpArticleLayout
      title="CRM integrations"
      description="Connect HubSpot, Salesforce, Zoho, Pipedrive, and Kylas to Event Bridge"
      breadcrumbs={[
        { label: "Events & Field Marketing", href: "/help/events" },
        { label: "CRM integrations" }
      ]}
    >
      {/* Supported CRMs */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">supported CRMs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "HubSpot", description: "contacts & deals", auth: "Private App Token" },
            { name: "Salesforce", description: "leads & opportunities", auth: "OAuth Connected App" },
            { name: "Zoho CRM", description: "leads & contacts", auth: "API Key / OAuth" },
            { name: "Pipedrive", description: "persons & deals", auth: "API Token" },
            { name: "Kylas CRM", description: "leads for calling", auth: "API Key" },
          ].map((crm) => (
            <div key={crm.name} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-zinc-900">{crm.name}</h3>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm text-zinc-600 mb-2">{crm.description}</p>
              <Badge variant="outline" className="text-xs">{crm.auth}</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* HubSpot Setup */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">HubSpot setup</h2>
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
          <ol className="space-y-3 text-zinc-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">1</span>
              <span>go to <strong>Settings → Integrations → Private Apps</strong> in HubSpot</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">2</span>
              <span>click <strong>"Create a private app"</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">3</span>
              <span>name it "utm.one Event Bridge"</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">4</span>
              <div>
                <span>under <strong>Scopes</strong>, enable:</span>
                <ul className="ml-2 mt-1 text-sm text-zinc-500">
                  <li>• crm.objects.contacts.write</li>
                  <li>• crm.objects.contacts.read</li>
                  <li>• crm.objects.deals.write (optional)</li>
                </ul>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">5</span>
              <span>click <strong>"Create app"</strong> and copy the access token</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">6</span>
              <span>paste the token in utm.one's CRM setup and click <strong>"Connect"</strong></span>
            </li>
          </ol>
          <a 
            href="https://developers.hubspot.com/docs/api/private-apps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
          >
            HubSpot Private Apps documentation <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      {/* Salesforce Setup */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Salesforce setup</h2>
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
          <ol className="space-y-3 text-zinc-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">1</span>
              <span>go to <strong>Setup → Apps → App Manager</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">2</span>
              <span>click <strong>"New Connected App"</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">3</span>
              <span>enable <strong>OAuth Settings</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">4</span>
              <div>
                <span>select OAuth scopes:</span>
                <ul className="ml-2 mt-1 text-sm text-zinc-500">
                  <li>• api</li>
                  <li>• refresh_token, offline_access</li>
                </ul>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">5</span>
              <span>save and copy <strong>Consumer Key</strong> and <strong>Consumer Secret</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">6</span>
              <span>paste in utm.one as <code className="px-1 bg-zinc-200 rounded text-xs">key:secret</code></span>
            </li>
          </ol>
        </div>
      </section>

      {/* Pipedrive Setup */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Pipedrive setup</h2>
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
          <ol className="space-y-3 text-zinc-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">1</span>
              <span>go to <strong>Settings → Personal preferences → API</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">2</span>
              <span>copy your <strong>API token</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-sm">3</span>
              <span>paste it in utm.one and click <strong>"Connect"</strong></span>
            </li>
          </ol>
          <a 
            href="https://developers.pipedrive.com/docs/api/v1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
          >
            Pipedrive API documentation <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      {/* Security note */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">security</h2>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-700">
            <strong>your credentials are encrypted.</strong> we use AES-256 encryption to store all API keys 
            and tokens. plaintext credentials are never stored in the database. only the encrypted version 
            is saved, and decryption happens only at runtime when syncing leads.
          </p>
        </div>
      </section>

      <ProTip>
        create a dedicated API user or app for utm.one integrations. this makes it easy to track 
        which records were created by Event Bridge and allows you to revoke access without affecting 
        other integrations.
      </ProTip>

      <FeatureAvailability
        feature="CRM Integrations"
        availability={{ free: false, starter: false, growth: false, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Event Bridge overview", href: "/help/articles/event-bridge-overview" },
          { title: "Routing rules configuration", href: "/help/articles/event-bridge-routing" },
          { title: "Troubleshooting Event Bridge", href: "/help/articles/event-bridge-troubleshooting" },
        ]}
      />
    </HelpArticleLayout>
  );
};

export default EventBridgeCRM;
