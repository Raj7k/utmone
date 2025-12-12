import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { Shield, Settings, HeartPulse, Bot, RefreshCw, Layers, ShoppingCart, BarChart3 } from "lucide-react";

const HelpSentinel = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Sentinel Mode" }]} />
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Sentinel Mode</h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">NEW</span>
      </div>
      <p className="text-lg text-zinc-500">
        Link protection with health checks and fallback routing when destinations become unavailable.
      </p>
    </div>
    
    <div className="space-y-4">
      {/* Overview */}
      <ExpandableArticle
        title="Sentinel Mode overview"
        description="What is Sentinel Mode and how it helps protect your links."
        icon={Shield}
        tier="starter"
      >
        <h2>What it is</h2>
        <p>
          Sentinel Mode is a link protection layer that monitors your destination URLs and 
          automatically handles failures. When enabled, Sentinel checks if your destination 
          is reachable before redirecting visitors.
        </p>

        <h2>Key capabilities</h2>
        <ul>
          <li><strong>Health checks:</strong> Validates destination URLs respond correctly</li>
          <li><strong>Fallback routing:</strong> Redirects to backup URLs when primary destinations fail</li>
          <li><strong>Status monitoring:</strong> Dashboard showing link health across your workspace</li>
        </ul>

        <h2>Who it's for</h2>
        <ul>
          <li>Marketing teams running campaigns who can't afford broken links</li>
          <li>E-commerce brands linking to product pages that may go out of stock</li>
          <li>Event organizers with QR codes that must work reliably</li>
        </ul>

        <h2>Plan availability</h2>
        <p>
          Sentinel Mode is available on <strong>Starter</strong> plans and above. Advanced features 
          like auto-heal and inventory sync require <strong>Growth</strong> or <strong>Business</strong> plans.
        </p>
      </ExpandableArticle>

      {/* Configuration */}
      <ExpandableArticle
        title="Configuring Sentinel"
        description="How to enable and configure Sentinel Mode settings."
        icon={Settings}
        tier="starter"
      >
        <h2>Enabling Sentinel on a link</h2>
        <ol>
          <li>Open the link detail page</li>
          <li>Find the <strong>Sentinel Mode</strong> toggle in the settings section</li>
          <li>Enable the toggle</li>
          <li>Optionally configure a fallback URL</li>
          <li>Save the link</li>
        </ol>

        <h2>Workspace defaults</h2>
        <p>
          You can set Sentinel Mode as the default for all new links in your workspace:
        </p>
        <ol>
          <li>Go to <strong>Settings → Workspace</strong></li>
          <li>Find the <strong>Link Defaults</strong> section</li>
          <li>Enable <strong>Sentinel Mode by default</strong></li>
        </ol>

        <h2>Configuration options</h2>
        <ul>
          <li><strong>Health check:</strong> Enable destination URL validation</li>
          <li><strong>Fallback URL:</strong> Where to send visitors if the primary URL fails</li>
        </ul>
      </ExpandableArticle>

      {/* Health Checks */}
      <ExpandableArticle
        title="Health preflight checks"
        description="How Sentinel validates destination URLs."
        icon={HeartPulse}
        tier="growth"
      >
        <h2>What Sentinel checks</h2>
        <p>
          When health checking is enabled, Sentinel periodically validates that your destination URL:
        </p>
        <ul>
          <li>Returns an HTTP 200 response</li>
          <li>Has a valid SSL certificate (for HTTPS URLs)</li>
          <li>Responds within a reasonable timeframe</li>
        </ul>

        <h2>Health status</h2>
        <ul>
          <li><strong>Healthy:</strong> Destination is responding normally</li>
          <li><strong>Degraded:</strong> Destination is slow but still working</li>
          <li><strong>Unhealthy:</strong> Destination is failing checks</li>
        </ul>

        <h2>What happens when a check fails</h2>
        <p>
          If you've configured a fallback URL, visitors will be routed there instead. 
          You'll receive a notification about the failure so you can investigate.
        </p>
      </ExpandableArticle>

      {/* Bot Detection - Future Feature */}
      <ExpandableArticle
        title="Bot detection"
        description="Filtering non-human traffic from your analytics."
        icon={Bot}
        tier="growth"
      >
        <h2>How it works</h2>
        <p>
          Sentinel can identify automated traffic (bots, crawlers, scrapers) and filter 
          them from your click analytics, giving you cleaner data about real human visitors.
        </p>

        <h2>What gets filtered</h2>
        <ul>
          <li>Known search engine crawlers</li>
          <li>Social media preview bots</li>
          <li>Monitoring and uptime services</li>
          <li>Suspicious automated patterns</li>
        </ul>

        <h2>Your analytics stay clean</h2>
        <p>
          Bot clicks are still logged but marked separately, so your conversion rates 
          and engagement metrics reflect actual human behavior.
        </p>
      </ExpandableArticle>

      {/* Auto-heal */}
      <ExpandableArticle
        title="Auto-heal & fallback URLs"
        description="Automatic routing to backup destinations when primary URLs fail."
        icon={RefreshCw}
        tier="growth"
      >
        <h2>Setting up fallback URLs</h2>
        <ol>
          <li>Open the link detail page</li>
          <li>Enable Sentinel Mode</li>
          <li>Enter your backup destination in the <strong>Fallback URL</strong> field</li>
          <li>Save the link</li>
        </ol>

        <h2>Best practices</h2>
        <ul>
          <li><strong>Use a page you control:</strong> Host your fallback on your own domain</li>
          <li><strong>Match the intent:</strong> If linking to a product, fallback to a related category</li>
          <li><strong>Test your fallback:</strong> Verify it works before relying on it</li>
        </ul>

        <h2>When fallback activates</h2>
        <p>
          Fallback routing activates when health checks detect the primary URL is 
          unavailable. Once the primary URL recovers, traffic automatically returns to it.
        </p>
      </ExpandableArticle>

      {/* Bulk Operations */}
      <ExpandableArticle
        title="Bulk Sentinel operations"
        description="Enable or disable Sentinel across multiple links at once."
        icon={Layers}
        tier="business"
      >
        <h2>Enabling Sentinel in bulk</h2>
        <ol>
          <li>Go to the <strong>Links</strong> page</li>
          <li>Select multiple links using the checkboxes</li>
          <li>Click the <strong>Bulk Actions</strong> button</li>
          <li>Choose <strong>Enable Sentinel Mode</strong></li>
        </ol>

        <h2>What you can configure in bulk</h2>
        <ul>
          <li>Enable/disable Sentinel Mode</li>
          <li>Enable/disable health checks</li>
          <li>Set a default fallback URL for selected links</li>
        </ul>
      </ExpandableArticle>

      {/* Shopify Sync - Planned Feature */}
      <ExpandableArticle
        title="Shopify inventory sync"
        description="Automatic routing based on product availability."
        icon={ShoppingCart}
        tier="business"
      >
        <h2>Coming soon</h2>
        <p>
          Shopify inventory sync is a planned feature that will allow Sentinel to 
          automatically detect when products go out of stock and route visitors 
          to alternative pages.
        </p>

        <h2>Planned capabilities</h2>
        <ul>
          <li>Automatic stock level monitoring</li>
          <li>Route to "back in stock" signup pages</li>
          <li>Route to similar product recommendations</li>
        </ul>

        <p>
          <em>This feature is not yet available. Check our roadmap for updates.</em>
        </p>
      </ExpandableArticle>

      {/* Analytics */}
      <ExpandableArticle
        title="Sentinel analytics"
        description="Understanding protection metrics and saved clicks."
        icon={BarChart3}
        tier="starter"
      >
        <h2>What you can track</h2>
        <ul>
          <li><strong>Health status:</strong> Current state of all monitored links</li>
          <li><strong>Fallback activations:</strong> How often backup routing was used</li>
          <li><strong>Protected clicks:</strong> Clicks that would have hit broken pages</li>
        </ul>

        <h2>Viewing Sentinel data</h2>
        <p>
          Access Sentinel analytics from your dashboard. You'll see an overview of 
          link health across your workspace and can drill down into individual links.
        </p>
      </ExpandableArticle>
    </div>
  </HelpLayout>
);

export default HelpSentinel;
