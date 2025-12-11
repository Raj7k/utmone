import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const ZapierIntegration = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "Zapier connection" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Zapier connection</h1>
      <p className="lead text-lg text-zinc-500">Connect utm.one to 5,000+ apps. Trigger workflows when links are created or clicked.</p>
      
      <h2>Available triggers</h2>
      <ul>
        <li><strong>New Link Created</strong> — When any link is created in your workspace</li>
        <li><strong>Link Clicked</strong> — When a link receives a click</li>
        <li><strong>Milestone Reached</strong> — When a link hits 100, 1000, etc. clicks</li>
        <li><strong>Conversion Tracked</strong> — When a conversion is attributed</li>
      </ul>
      
      <h2>Available actions</h2>
      <ul>
        <li><strong>Create Link</strong> — Create a new short link</li>
        <li><strong>Get Link Analytics</strong> — Retrieve click data for a link</li>
        <li><strong>Update Link</strong> — Change destination or settings</li>
      </ul>
      
      <h2>Popular Zaps</h2>
      <ul>
        <li>Slack notification when link reaches 1,000 clicks</li>
        <li>Google Sheets row for each new link created</li>
        <li>Airtable record when conversion tracked</li>
        <li>Email alert when traffic spikes</li>
      </ul>
      
      <h2>Setup</h2>
      <ol>
        <li>Search "utm.one" in Zapier</li>
        <li>Click "Connect an Account"</li>
        <li>Paste your API key from Settings → API Keys</li>
        <li>Build your Zap!</li>
      </ol>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Webhooks configuration", href: "/help/articles/webhooks" },
      { title: "Slack notifications", href: "/help/articles/slack-integration" },
    ]} />
  </HelpLayout>
);

export default ZapierIntegration;
