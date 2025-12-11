import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const ApiAuthentication = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "API authentication" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">API authentication</h1>
      <p className="lead text-lg text-zinc-500">Generate API keys, understand rate limits, and authenticate requests.</p>
      
      <h2>Creating an API key</h2>
      <ol>
        <li>Go to Settings → API Keys</li>
        <li>Click "Generate New Key"</li>
        <li>Name your key (e.g., "Production Server")</li>
        <li>Copy the key immediately — it won't be shown again</li>
      </ol>
      
      <h2>Authentication</h2>
      <p>Include your API key in the Authorization header:</p>
      <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>
      
      <h2>Rate limits</h2>
      <table>
        <thead><tr><th>Plan</th><th>Requests/minute</th></tr></thead>
        <tbody>
          <tr><td>Free</td><td>60</td></tr>
          <tr><td>Starter</td><td>300</td></tr>
          <tr><td>Growth</td><td>600</td></tr>
          <tr><td>Business+</td><td>1,200</td></tr>
        </tbody>
      </table>
      
      <h2>Key scopes</h2>
      <ul>
        <li><code>links:read</code> — Read link data</li>
        <li><code>links:write</code> — Create and update links</li>
        <li><code>analytics:read</code> — Access analytics data</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "API endpoints", href: "/help/articles/api-endpoints" },
      { title: "Webhooks configuration", href: "/help/articles/webhooks" },
    ]} />
  </HelpLayout>
);

export default ApiAuthentication;
