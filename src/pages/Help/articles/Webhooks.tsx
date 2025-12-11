import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const Webhooks = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "Webhooks configuration" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Webhooks configuration</h1>
      <p className="lead text-lg text-zinc-500">Receive real-time notifications when links are clicked, created, or reach milestones.</p>
      
      <h2>Setting up webhooks</h2>
      <ol>
        <li>Go to Settings → Webhooks</li>
        <li>Click "Add Webhook"</li>
        <li>Enter your endpoint URL</li>
        <li>Select which events to receive</li>
        <li>Save and test the webhook</li>
      </ol>
      
      <h2>Available events</h2>
      <ul>
        <li><code>link.created</code> — New link created</li>
        <li><code>link.clicked</code> — Link was clicked</li>
        <li><code>link.updated</code> — Link settings changed</li>
        <li><code>link.milestone</code> — Link reached click milestone</li>
        <li><code>conversion.tracked</code> — Conversion attributed</li>
      </ul>
      
      <h2>Payload example</h2>
      <pre><code>{`{
  "event": "link.clicked",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "link_id": "abc123",
    "short_url": "https://utm.one/summer",
    "country": "US",
    "device": "mobile"
  }
}`}</code></pre>
      
      <h2>Security</h2>
      <p>We sign each webhook with a secret. Verify the <code>X-UTM-Signature</code> header to ensure authenticity.</p>
      
      <FeatureAvailability tier="starter" />
    </article>
    <RelatedArticles articles={[
      { title: "API endpoints", href: "/help/articles/api-endpoints" },
      { title: "Zapier connection", href: "/help/articles/zapier-integration" },
    ]} />
  </HelpLayout>
);

export default Webhooks;
