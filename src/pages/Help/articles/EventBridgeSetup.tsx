import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";
import { ProTip } from "@/components/help/ProTip";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Badge } from "@/components/ui/badge";

const EventBridgeSetup = () => {
  return (
    <HelpArticleLayout
      title="Event Bridge setup"
      description="Step-by-step guide to creating your first Event Bridge flow"
      breadcrumbs={[
        { label: "Events & Field Marketing", href: "/help/events" },
        { label: "Event Bridge setup" }
      ]}
    >
      {/* Prerequisites */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">before you start</h2>
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
          <p className="text-zinc-600 mb-3">make sure you have:</p>
          <ul className="space-y-2 text-zinc-600">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded border border-zinc-300 flex items-center justify-center text-xs">✓</span>
              <span>a Business or Enterprise plan (Event Bridge requires Business tier)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded border border-zinc-300 flex items-center justify-center text-xs">✓</span>
              <span>admin access to your event platform (Luma, Airmeet, Goldcast, or Eventbrite)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded border border-zinc-300 flex items-center justify-center text-xs">✓</span>
              <span>CRM API credentials (if you want to route leads to your CRM)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Step 1: Create Flow */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">step 1: create a flow</h2>
        <ol className="space-y-3 text-zinc-600">
          <li>1. go to <strong>Dashboard → Events → Event Bridge</strong> tab</li>
          <li>2. click <strong>"Create Flow"</strong></li>
          <li>3. enter a name for your flow (e.g., "SaaStr 2025 Registrations")</li>
          <li>4. select your source platform from the dropdown</li>
          <li>5. optionally enable enrichment and select a provider</li>
          <li>6. click <strong>"Create"</strong></li>
        </ol>
        <ProTip>
          use descriptive names like "Web Summit 2025 - Luma" so you can easily identify flows later.
        </ProTip>
      </section>

      {/* Step 2: Platform-specific setup */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">step 2: connect your event platform</h2>
        
        {/* Luma */}
        <div className="mb-6 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-zinc-900">Luma</h3>
            <Badge variant="outline" className="text-xs">via Zapier</Badge>
          </div>
          <p className="text-sm text-zinc-600 mb-3">
            Luma doesn't support native webhooks, so we use Zapier to bridge registrations.
          </p>
          <ol className="space-y-2 text-sm text-zinc-600">
            <li>1. copy the webhook URL from your flow card</li>
            <li>2. go to <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Zapier</a> and create a new Zap</li>
            <li>3. trigger: <strong>Luma → New Guest Registration</strong></li>
            <li>4. action: <strong>Webhooks by Zapier → POST</strong></li>
            <li>5. paste your webhook URL and map the fields:
              <ul className="ml-4 mt-1 space-y-1">
                <li>• email → guest_email</li>
                <li>• first_name → guest_first_name</li>
                <li>• last_name → guest_last_name</li>
              </ul>
            </li>
            <li>6. test and turn on the Zap</li>
          </ol>
        </div>

        {/* Airmeet */}
        <div className="mb-6 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-zinc-900">Airmeet</h3>
            <Badge variant="outline" className="text-xs">native webhook</Badge>
          </div>
          <ol className="space-y-2 text-sm text-zinc-600">
            <li>1. copy the webhook URL from your flow card</li>
            <li>2. go to your Airmeet event → Settings → Integrations → Webhooks</li>
            <li>3. click "Add Webhook"</li>
            <li>4. paste the webhook URL</li>
            <li>5. select events: "Attendee Registered"</li>
            <li>6. save the webhook</li>
          </ol>
        </div>

        {/* Goldcast */}
        <div className="mb-6 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-zinc-900">Goldcast</h3>
            <Badge variant="outline" className="text-xs">native webhook</Badge>
          </div>
          <ol className="space-y-2 text-sm text-zinc-600">
            <li>1. copy the webhook URL from your flow card</li>
            <li>2. go to Goldcast → Settings → Integrations → Webhooks</li>
            <li>3. click "Add Webhook Endpoint"</li>
            <li>4. paste the webhook URL</li>
            <li>5. subscribe to "registration.created" event</li>
            <li>6. save</li>
          </ol>
        </div>

        {/* Eventbrite */}
        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-zinc-900">Eventbrite</h3>
            <Badge variant="outline" className="text-xs">via Zapier</Badge>
          </div>
          <ol className="space-y-2 text-sm text-zinc-600">
            <li>1. copy the webhook URL from your flow card</li>
            <li>2. create a Zap: <strong>Eventbrite → New Attendee Registered</strong></li>
            <li>3. action: <strong>Webhooks → POST to webhook URL</strong></li>
            <li>4. map attendee fields and activate</li>
          </ol>
        </div>
      </section>

      {/* Step 3: Test */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">step 3: test your flow</h2>
        <ol className="space-y-3 text-zinc-600">
          <li>1. register for your own event using a test email</li>
          <li>2. wait 10-30 seconds</li>
          <li>3. check the Event Bridge tab - you should see "1 registration received"</li>
          <li>4. if enrichment is enabled, you'll see enrichment status</li>
          <li>5. if routing is configured, check your CRM for the new contact</li>
        </ol>
      </section>

      {/* Troubleshooting */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">common issues</h2>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-1">registrations not appearing?</h4>
            <p className="text-sm text-amber-700">
              check that your webhook URL is correctly pasted (no trailing spaces). 
              for Zapier, make sure the Zap is turned on and has available tasks.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-1">enrichment showing "failed"?</h4>
            <p className="text-sm text-amber-700">
              verify your enrichment provider API key is valid. go to Settings → Integrations 
              and test the connection.
            </p>
          </div>
        </div>
      </section>

      <FeatureAvailability
        feature="Event Bridge"
        availability={{ free: false, starter: false, growth: false, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Event Bridge overview", href: "/help/articles/event-bridge-overview" },
          { title: "Routing rules configuration", href: "/help/articles/event-bridge-routing" },
          { title: "CRM integrations", href: "/help/articles/event-bridge-crm" },
        ]}
      />
    </HelpArticleLayout>
  );
};

export default EventBridgeSetup;
