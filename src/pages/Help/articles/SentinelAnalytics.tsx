import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelAnalytics = () => (
  <HelpArticleLayout
    title="Sentinel analytics"
    description="Understanding the Sentinel Saves dashboard and protection metrics."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Analytics" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Sentinel analytics shows you exactly how link protection is working—how many bots 
      were blocked, health failures prevented, and visitors saved from broken experiences.
    </p>

    <h2>Why it matters</h2>
    <p>
      Protection is only valuable if you can see its impact. Sentinel analytics:
    </p>
    <ul>
      <li>Proves the ROI of link protection to stakeholders</li>
      <li>Identifies patterns in bot traffic and failures</li>
      <li>Helps optimize your protection settings over time</li>
      <li>Provides clean, human-only analytics for decision making</li>
    </ul>

    <h2>The Sentinel Saves dashboard</h2>
    <p>
      Access from <strong>Analytics → Sentinel</strong> or the Sentinel icon in your header.
    </p>

    <h3>Key metrics</h3>
    <ul>
      <li><strong>Bots blocked:</strong> Total bot clicks filtered from your analytics</li>
      <li><strong>Health failures prevented:</strong> Clicks that would have hit broken pages</li>
      <li><strong>Auto-heals triggered:</strong> Times fallback routing activated</li>
      <li><strong>Visitors saved:</strong> People who got a working page instead of an error</li>
    </ul>

    <h2>Bot detection analytics</h2>

    <h3>Bot traffic overview</h3>
    <p>
      See the breakdown of your traffic:
    </p>
    <ul>
      <li>Percentage of total traffic identified as bots</li>
      <li>Human vs bot clicks over time</li>
      <li>Trends in bot activity (increasing/decreasing)</li>
    </ul>

    <h3>Bot types</h3>
    <p>
      Understand what's hitting your links:
    </p>
    <ul>
      <li><strong>Search crawlers:</strong> Googlebot, Bingbot, etc.</li>
      <li><strong>SEO tools:</strong> Ahrefs, SEMrush, Moz</li>
      <li><strong>Scrapers:</strong> Unknown bots extracting data</li>
      <li><strong>Suspicious:</strong> Potential click fraud or malicious bots</li>
    </ul>

    <h3>Geographic distribution</h3>
    <p>
      Where bot traffic originates—useful for identifying data center clusters 
      or regional bot farms.
    </p>

    <h2>Health monitoring analytics</h2>

    <h3>Uptime by link</h3>
    <p>
      Track destination reliability:
    </p>
    <ul>
      <li>Uptime percentage for each link</li>
      <li>Number of health check failures</li>
      <li>Average response time trends</li>
    </ul>

    <h3>Failure types</h3>
    <p>
      Breakdown of what's going wrong:
    </p>
    <ul>
      <li>404 errors (page not found)</li>
      <li>500 errors (server errors)</li>
      <li>SSL issues</li>
      <li>Timeouts</li>
    </ul>

    <h3>Failure timeline</h3>
    <p>
      When failures occur—identify patterns like:
    </p>
    <ul>
      <li>Daily maintenance windows causing regular outages</li>
      <li>Traffic spikes overwhelming destinations</li>
      <li>Weekend vs weekday reliability differences</li>
    </ul>

    <h2>Auto-heal analytics</h2>

    <h3>Activation history</h3>
    <p>
      Every time auto-heal activated:
    </p>
    <ul>
      <li>Which link triggered</li>
      <li>Duration of fallback routing</li>
      <li>Visitors routed to fallback</li>
      <li>Recovery timestamp</li>
    </ul>

    <h3>Fallback performance</h3>
    <p>
      How fallback pages performed:
    </p>
    <ul>
      <li>Click-through rate on fallback pages</li>
      <li>Bounce rate comparison (original vs fallback)</li>
      <li>Conversion rate during auto-heal periods</li>
    </ul>

    <h2>Exporting Sentinel data</h2>
    <p>
      Download reports for stakeholder presentations:
    </p>
    <ul>
      <li><strong>PDF summary:</strong> Executive overview with key metrics</li>
      <li><strong>CSV export:</strong> Detailed data for analysis</li>
      <li><strong>Scheduled reports:</strong> Weekly/monthly email summaries</li>
    </ul>

    <h2>Pro tips</h2>
    <ul>
      <li>Share the "Visitors Saved" metric with leadership to prove protection value</li>
      <li>Review bot type breakdown monthly to identify emerging threats</li>
      <li>Set up alerts for unusual spikes in bot traffic or failures</li>
      <li>Use failure patterns to work with vendors on improving reliability</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Basic Sentinel analytics are available on <strong>Starter</strong>. Detailed breakdowns, 
      exports, and scheduled reports require <strong>Growth</strong> or higher.
    </p>
  </HelpArticleLayout>
);

export default SentinelAnalytics;
