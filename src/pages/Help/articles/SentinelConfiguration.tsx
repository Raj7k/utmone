import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelConfiguration = () => (
  <HelpArticleLayout
    title="Configuring Sentinel"
    description="How to enable and configure Sentinel Mode settings for your links."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Configuration" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Sentinel configuration allows you to enable link protection on individual links or across your 
      entire workspace, with customizable settings for bot detection, health checks, and fallback routing.
    </p>

    <h2>Why it matters</h2>
    <p>
      Different links need different protection levels. A high-value paid ad link deserves full 
      Sentinel protection, while internal test links might only need basic monitoring.
    </p>

    <h2>How to enable Sentinel on a single link</h2>
    <ol>
      <li>Open the link detail page by clicking any link in your dashboard</li>
      <li>Find the <strong>Sentinel Mode</strong> toggle in the link settings panel</li>
      <li>Enable the toggle to activate protection</li>
      <li>Configure optional settings (fallback URL, Shopify sync)</li>
      <li>Save your changes</li>
    </ol>

    <h2>Sentinel settings explained</h2>

    <h3>Bot Detection</h3>
    <p>
      Automatically enabled when Sentinel is active. No configuration needed—AI handles bot 
      identification based on behavior patterns.
    </p>

    <h3>Health Preflight</h3>
    <p>
      Runs automated checks on your destination URL. Configure check frequency:
    </p>
    <ul>
      <li><strong>Real-time:</strong> Check on every click (slight latency, maximum protection)</li>
      <li><strong>Cached:</strong> Check every 5 minutes (recommended for most links)</li>
      <li><strong>Hourly:</strong> Check once per hour (low-priority links)</li>
    </ul>

    <h3>Fallback URL</h3>
    <p>
      The backup destination when your primary URL fails. Best practices:
    </p>
    <ul>
      <li>Use a reliable page you control (not another third-party URL)</li>
      <li>Match the intent of the original link (same product category, similar content)</li>
      <li>Include a message explaining the issue to visitors</li>
    </ul>

    <h3>Auto-Heal Behavior</h3>
    <p>
      Choose how Sentinel responds to failures:
    </p>
    <ul>
      <li><strong>Immediate redirect:</strong> Route to fallback on first failure</li>
      <li><strong>Retry once:</strong> Try original URL again before falling back</li>
      <li><strong>Alert only:</strong> Notify you but don't change routing</li>
    </ul>

    <h2>Workspace-level defaults</h2>
    <p>
      Set default Sentinel settings for all new links:
    </p>
    <ol>
      <li>Go to <strong>Settings → Sentinel</strong></li>
      <li>Configure default bot detection, health check frequency, and fallback behavior</li>
      <li>New links will inherit these settings automatically</li>
    </ol>

    <h2>Pro tips</h2>
    <ul>
      <li>Start with "Cached" health checks for most links—real-time adds latency</li>
      <li>Always test your fallback URL before enabling auto-heal</li>
      <li>Use workspace defaults to ensure consistent protection</li>
      <li>Review Sentinel alerts weekly to identify patterns</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Basic configuration is available on <strong>Starter</strong>. Advanced settings (health check 
      frequency, auto-heal behavior) require <strong>Growth</strong> or higher.
    </p>
  </HelpArticleLayout>
);

export default SentinelConfiguration;
