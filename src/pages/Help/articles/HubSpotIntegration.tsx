import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const HubSpotIntegration = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "HubSpot integration" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">HubSpot integration</h1>
      <p className="lead text-lg text-zinc-500">Sync link clicks and conversions to HubSpot contacts. See utm.one data in your CRM timeline.</p>
      
      <h2>What you get</h2>
      <ul>
        <li>Click events appear on contact timeline</li>
        <li>See which links each contact clicked</li>
        <li>Trigger workflows based on link clicks</li>
        <li>Attribution data flows to deals</li>
      </ul>
      
      <h2>Setup</h2>
      <ol>
        <li>Go to Settings → Integrations → HubSpot</li>
        <li>Click "Connect HubSpot"</li>
        <li>Authorize utm.one in the HubSpot popup</li>
        <li>Select which data to sync</li>
        <li>Connection is live immediately</li>
      </ol>
      
      <h2>Synced data</h2>
      <ul>
        <li><strong>Contact properties</strong> — First/last touch source, campaign</li>
        <li><strong>Timeline events</strong> — Each link click as an activity</li>
        <li><strong>Custom properties</strong> — Total clicks, last click date</li>
      </ul>
      
      <h2>Workflow triggers</h2>
      <p>Create HubSpot workflows triggered by:</p>
      <ul>
        <li>Contact clicked any utm.one link</li>
        <li>Contact clicked a specific campaign link</li>
        <li>Contact reached X total clicks</li>
      </ul>
      
      <FeatureAvailability tier="growth" />
    </article>
    <RelatedArticles articles={[
      { title: "Salesforce integration", href: "/help/articles/salesforce-integration" },
      { title: "Revenue attribution", href: "/help/articles/revenue-attribution" },
    ]} />
  </HelpLayout>
);

export default HubSpotIntegration;
