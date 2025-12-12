import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelOverview = () => (
  <HelpArticleLayout
    title="Sentinel Mode overview"
    description="What is Sentinel Mode and how it protects your links with AI-powered monitoring."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Overview" }
    ]}
  >
    <h2>What is Sentinel Mode?</h2>
    <p>
      Sentinel Mode is utm.one's AI-powered link protection system. It actively monitors your links 24/7, 
      detecting bot traffic, validating destination health before redirecting, and automatically routing 
      to fallback URLs when issues occur.
    </p>

    <h2>Why it matters</h2>
    <p>
      Without protection, your links are vulnerable to several problems:
    </p>
    <ul>
      <li><strong>Bot traffic</strong> inflates your analytics by 15-30%, making data unreliable</li>
      <li><strong>Broken destinations</strong> lead visitors to 404 pages, damaging trust</li>
      <li><strong>QR scan failures</strong> frustrate users when destination is temporarily down</li>
      <li><strong>Out-of-stock products</strong> create dead-end experiences for shoppers</li>
    </ul>

    <h2>How Sentinel works</h2>
    <p>
      Sentinel provides four layers of protection:
    </p>

    <h3>1. AI Bot Detection</h3>
    <p>
      Machine learning analyzes visitor patterns, user agents, behavior signals, and known bot signatures. 
      Crawlers and scrapers are blocked while legitimate traffic flows through normally.
    </p>

    <h3>2. Health Preflight</h3>
    <p>
      Before redirecting, Sentinel checks your destination URL for common issues: 404 errors, SSL problems, 
      server timeouts, and connection failures. Problems are detected proactively, not when visitors click.
    </p>

    <h3>3. Auto-Heal</h3>
    <p>
      When a destination fails health checks, Sentinel automatically routes visitors to your configured 
      fallback URL. You're notified of the issue, but visitors never see a broken page.
    </p>

    <h3>4. Inventory Sync</h3>
    <p>
      For e-commerce teams, Sentinel connects to Shopify to monitor product inventory. When items go 
      out of stock, links automatically route to alternatives—category pages, similar products, or 
      custom fallbacks.
    </p>

    <h2>Who it's for</h2>
    <ul>
      <li><strong>Performance marketers</strong> protecting ad spend from bot clicks</li>
      <li><strong>Affiliate managers</strong> ensuring commission links never break</li>
      <li><strong>Event teams</strong> running QR campaigns that must work flawlessly</li>
      <li><strong>E-commerce teams</strong> managing product links at scale</li>
    </ul>

    <h2>Pro tips</h2>
    <ul>
      <li>Enable Sentinel on all paid campaign links to protect your ad budget</li>
      <li>Always configure fallback URLs before enabling auto-heal</li>
      <li>Review the Sentinel Saves dashboard weekly to understand protection value</li>
      <li>Use bulk operations to enable Sentinel across your entire workspace</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Basic bot detection is included on <strong>Starter</strong> plans. Full Sentinel Mode with health 
      preflight, auto-heal, and Shopify sync requires <strong>Growth</strong> or <strong>Business</strong> plans.
    </p>
  </HelpArticleLayout>
);

export default SentinelOverview;
