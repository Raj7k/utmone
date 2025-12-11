import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const SalesforceIntegration = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "Salesforce integration" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Salesforce integration</h1>
      <p className="lead text-lg text-zinc-500">Push attribution data to Salesforce leads and opportunities. Prove marketing's revenue impact.</p>
      
      <h2>Why connect Salesforce?</h2>
      <ul>
        <li>Attribute closed deals to marketing campaigns</li>
        <li>See link engagement on lead records</li>
        <li>Influence scoring based on link clicks</li>
        <li>Report marketing ROI in Salesforce</li>
      </ul>
      
      <h2>Setup requirements</h2>
      <ul>
        <li>Salesforce Professional, Enterprise, or Unlimited edition</li>
        <li>API access enabled in your Salesforce org</li>
        <li>utm.one Business or Enterprise plan</li>
      </ul>
      
      <h2>Connection steps</h2>
      <ol>
        <li>Go to Settings → Integrations → Salesforce</li>
        <li>Click "Connect Salesforce"</li>
        <li>Log in and authorize utm.one</li>
        <li>Map utm.one fields to Salesforce fields</li>
        <li>Choose objects to sync (Leads, Contacts, Opportunities)</li>
      </ol>
      
      <h2>Synced data</h2>
      <ul>
        <li>First touch campaign on lead</li>
        <li>Last touch campaign on opportunity</li>
        <li>Click activity as tasks</li>
        <li>Attribution percentage on opportunity</li>
      </ul>
      
      <FeatureAvailability tier="business" />
    </article>
    <RelatedArticles articles={[
      { title: "HubSpot integration", href: "/help/articles/hubspot-integration" },
      { title: "Offline import", href: "/help/articles/offline-import" },
    ]} />
  </HelpLayout>
);

export default SalesforceIntegration;
