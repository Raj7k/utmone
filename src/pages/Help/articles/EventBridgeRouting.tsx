import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";
import { ProTip } from "@/components/help/ProTip";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ArrowRight } from "lucide-react";

const EventBridgeRouting = () => {
  return (
    <HelpArticleLayout
      title="Routing rules configuration"
      description="Set up conditional routing to send leads to different CRMs based on criteria"
      breadcrumbs={[
        { label: "Events & Field Marketing", href: "/help/events" },
        { label: "Routing rules configuration" }
      ]}
    >
      {/* What are routing rules */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">what are routing rules?</h2>
        <p className="text-zinc-600 mb-4">
          routing rules determine where event registrations are sent after processing. 
          you can route all leads to one CRM, or set up conditional rules to send different 
          leads to different destinations.
        </p>
        
        {/* Visual example */}
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500 mb-3">example routing flow:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 bg-white rounded border border-zinc-200">if title contains "VP"</span>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">Salesforce (enterprise)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 bg-white rounded border border-zinc-200">if has phone</span>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Kylas (for calling)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 bg-white rounded border border-zinc-200">always</span>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">HubSpot (all leads)</span>
            </div>
          </div>
        </div>
      </section>

      {/* How to create rules */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">creating routing rules</h2>
        <ol className="space-y-3 text-zinc-600">
          <li>1. expand your Event Bridge flow card</li>
          <li>2. scroll to the "Routing Rules" section</li>
          <li>3. click <strong>"Add Rule"</strong></li>
          <li>4. select a condition:
            <ul className="ml-4 mt-2 space-y-1 text-sm">
              <li>• <strong>Always</strong> - route all registrations</li>
              <li>• <strong>Has Phone</strong> - only if phone was enriched</li>
              <li>• <strong>Has Title</strong> - only if job title was found</li>
              <li>• <strong>Title Contains</strong> - job title matches specific text</li>
            </ul>
          </li>
          <li>5. select a destination CRM</li>
          <li>6. click <strong>"Save Rules"</strong></li>
        </ol>
      </section>

      {/* Rule conditions explained */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">condition types</h2>
        <div className="space-y-4">
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h3 className="font-medium text-zinc-900 mb-1">Always</h3>
            <p className="text-sm text-zinc-600">
              routes every registration regardless of data. use this as a catch-all rule at the bottom of your list.
            </p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h3 className="font-medium text-zinc-900 mb-1">Has Phone</h3>
            <p className="text-sm text-zinc-600">
              only routes leads that have a phone number (either from registration or enrichment). 
              great for sending warm leads to an outbound calling tool.
            </p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h3 className="font-medium text-zinc-900 mb-1">Has Title</h3>
            <p className="text-sm text-zinc-600">
              only routes leads that have a job title. useful for filtering out incomplete records.
            </p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h3 className="font-medium text-zinc-900 mb-1">Title Contains</h3>
            <p className="text-sm text-zinc-600">
              routes leads whose job title contains specific text. examples: "VP", "CEO", "Director".
              use this to route enterprise leads to a dedicated sales queue.
            </p>
          </div>
        </div>
      </section>

      {/* Rule order */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">rule order matters</h2>
        <p className="text-zinc-600 mb-4">
          rules are evaluated from top to bottom. the first matching rule wins. 
          place more specific rules at the top and catch-all rules at the bottom.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-medium text-emerald-900 mb-2">recommended order:</h4>
          <ol className="text-sm text-emerald-700 space-y-1">
            <li>1. title contains "CEO, CFO, CTO" → enterprise CRM</li>
            <li>2. title contains "VP, Director" → enterprise CRM</li>
            <li>3. has phone → outbound calling tool</li>
            <li>4. always → general marketing CRM</li>
          </ol>
        </div>
      </section>

      {/* Multiple destinations */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">routing to multiple CRMs</h2>
        <p className="text-zinc-600 mb-4">
          a single registration can match multiple rules and be sent to multiple CRMs. 
          if you want a lead to go to both HubSpot (for marketing) and Salesforce (for sales), 
          create two rules with the same or overlapping conditions.
        </p>
        <ProTip>
          when routing to multiple CRMs, make sure your deduplication settings are configured 
          in each CRM to prevent creating duplicate records if the same lead appears multiple times.
        </ProTip>
      </section>

      {/* CRM connection required */}
      <section className="mb-8">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">CRM connection required</h2>
        <p className="text-zinc-600 mb-4">
          before you can route leads to a CRM, you must connect it first. go to the CRM Integrations 
          section in your flow settings and add your API credentials.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            destinations that aren't connected will show a "not connected" badge and won't receive leads 
            until you configure the integration.
          </p>
        </div>
      </section>

      <FeatureAvailability
        feature="Event Bridge Routing"
        availability={{ free: false, starter: false, growth: false, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Event Bridge overview", href: "/help/articles/event-bridge-overview" },
          { title: "CRM integrations", href: "/help/articles/event-bridge-crm" },
          { title: "Event Bridge setup", href: "/help/articles/event-bridge-setup" },
        ]}
      />
    </HelpArticleLayout>
  );
};

export default EventBridgeRouting;
