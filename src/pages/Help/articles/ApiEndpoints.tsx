import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const ApiEndpoints = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "API endpoints" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">API endpoints</h1>
      <p className="lead text-lg text-zinc-500">Create links, retrieve analytics, manage campaigns, and more programmatically.</p>
      
      <h2>Base URL</h2>
      <pre><code>https://api.utm.one/v1</code></pre>
      
      <h2>Links</h2>
      <ul>
        <li><code>POST /links</code> — Create a new short link</li>
        <li><code>GET /links</code> — List all links</li>
        <li><code>GET /links/:id</code> — Get link details</li>
        <li><code>PATCH /links/:id</code> — Update a link</li>
        <li><code>DELETE /links/:id</code> — Delete a link</li>
      </ul>
      
      <h2>Analytics</h2>
      <ul>
        <li><code>GET /links/:id/analytics</code> — Get link analytics</li>
        <li><code>GET /analytics/summary</code> — Workspace analytics summary</li>
      </ul>
      
      <h2>Campaigns</h2>
      <ul>
        <li><code>POST /campaigns</code> — Create a campaign</li>
        <li><code>GET /campaigns</code> — List campaigns</li>
        <li><code>GET /campaigns/:id/links</code> — List links in campaign</li>
      </ul>
      
      <h2>Example: Create a link</h2>
      <pre><code>{`POST /links
{
  "url": "https://example.com/product",
  "utm_source": "twitter",
  "utm_medium": "social",
  "utm_campaign": "launch-2025"
}`}</code></pre>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "API authentication", href: "/help/articles/api-authentication" },
      { title: "Webhooks", href: "/help/articles/webhooks" },
    ]} />
  </HelpLayout>
);

export default ApiEndpoints;
