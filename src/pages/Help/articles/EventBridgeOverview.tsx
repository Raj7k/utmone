import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";
import { ProTip } from "@/components/help/ProTip";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Zap, ArrowRight, Database, Users, RefreshCw, Shield } from "lucide-react";

const EventBridgeOverview = () => {
  return (
    <HelpArticleLayout
      title="Event Bridge overview"
      description="Automate event registration to CRM sync with lead enrichment"
      breadcrumbs={[
        { label: "Events & Field Marketing", href: "/help/events" },
        { label: "Event Bridge overview" }
      ]}
    >
      {/* Hero Visual */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Zap className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-zinc-300">Event Bridge</span>
        </div>
        <h2 className="text-2xl font-semibold mb-3">connect events to revenue. automatically.</h2>
        <p className="text-zinc-300 mb-6 max-w-xl">
          registrations from Luma, Airmeet, Goldcast flow through enrichment and land in your CRM. 
          zero manual data entry. zero lost leads.
        </p>
        
        {/* Visual Flow */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-3 py-2 bg-white/10 rounded-lg text-sm">Luma</div>
          <ArrowRight className="h-4 w-4 text-zinc-500" />
          <div className="px-3 py-2 bg-primary/20 rounded-lg text-sm">enrich</div>
          <ArrowRight className="h-4 w-4 text-zinc-500" />
          <div className="px-3 py-2 bg-white/10 rounded-lg text-sm">HubSpot</div>
        </div>
      </div>

      {/* What it is */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">what is Event Bridge?</h2>
        <p className="text-zinc-600 mb-4">
          Event Bridge is an automation layer that connects your event platforms (Luma, Airmeet, Goldcast, Eventbrite) 
          to your CRM (HubSpot, Salesforce, Zoho, Pipedrive). when someone registers for your event, their data is 
          automatically enriched with missing information (email, phone, company, title) and synced to your CRM.
        </p>
        <p className="text-zinc-600">
          this eliminates the manual work of exporting CSVs, cleaning data, and importing to your CRM. 
          your sales team sees new leads within seconds of registration.
        </p>
      </section>

      {/* Why it matters */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">why it matters</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: Database,
              title: "zero manual data entry",
              description: "registrations flow automatically. no spreadsheets. no copy-paste."
            },
            {
              icon: Users,
              title: "enriched leads",
              description: "missing email or title? auto-enrich with Apollo, Clay, or ZoomInfo before syncing."
            },
            {
              icon: RefreshCw,
              title: "real-time sync",
              description: "leads appear in your CRM within seconds. sales never waits."
            },
            {
              icon: Shield,
              title: "smart deduplication",
              description: "same person registers twice? we merge them. no duplicate CRM records."
            }
          ].map((benefit) => (
            <div key={benefit.title} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <benefit.icon className="h-5 w-5 text-zinc-700 mb-2" />
              <h3 className="font-medium text-zinc-900 mb-1">{benefit.title}</h3>
              <p className="text-sm text-zinc-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">how it works</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium text-zinc-900">create a flow</h3>
              <p className="text-sm text-zinc-600">select your event platform (Luma, Airmeet, etc.) and give the flow a name.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium text-zinc-900">connect via webhook</h3>
              <p className="text-sm text-zinc-600">copy the webhook URL and paste it in your event platform or Zapier. registrations will start flowing.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium text-zinc-900">configure enrichment (optional)</h3>
              <p className="text-sm text-zinc-600">connect Apollo, Clay, or ZoomInfo to auto-fill missing contact data.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">4</div>
            <div>
              <h3 className="font-medium text-zinc-900">set up routing rules</h3>
              <p className="text-sm text-zinc-600">decide where leads go: HubSpot for all, Salesforce for enterprise only, etc.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Who it's for */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">who it's for</h2>
        <ul className="space-y-2 text-zinc-600">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span><strong>Field marketing teams</strong> running webinars, conferences, and trade shows</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span><strong>Marketing ops</strong> who want to eliminate manual CRM data entry</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span><strong>Sales teams</strong> who need leads in CRM immediately after registration</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span><strong>RevOps</strong> building automated lead routing workflows</span>
          </li>
        </ul>
      </section>

      <ProTip>
        set up Event Bridge before your event starts. this ensures every registration is captured and enriched in real-time, 
        not batch-imported days later.
      </ProTip>

      <FeatureAvailability
        feature="Event Bridge"
        availability={{ free: false, starter: false, growth: false, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Event Bridge setup", href: "/help/articles/event-bridge-setup" },
          { title: "Routing rules configuration", href: "/help/articles/event-bridge-routing" },
          { title: "CRM integrations", href: "/help/articles/event-bridge-crm" },
          { title: "Troubleshooting Event Bridge", href: "/help/articles/event-bridge-troubleshooting" },
        ]}
      />
    </HelpArticleLayout>
  );
};

export default EventBridgeOverview;
