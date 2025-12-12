import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelBotDetection = () => (
  <HelpArticleLayout
    title="AI bot detection"
    description="How machine learning identifies and blocks crawler traffic while allowing real humans through."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Bot Detection" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Sentinel's bot detection uses machine learning to identify non-human traffic—crawlers, 
      scrapers, automated scripts—and filters them from your analytics while ensuring real 
      visitors get through normally.
    </p>

    <h2>Why it matters</h2>
    <p>
      Bot traffic can account for 15-30% of all clicks on your links. This inflated data:
    </p>
    <ul>
      <li>Makes your analytics unreliable for decision-making</li>
      <li>Wastes ad budget when bots click paid links</li>
      <li>Skews A/B test results with fake conversions</li>
      <li>Triggers false alerts from traffic anomalies</li>
    </ul>

    <h2>How detection works</h2>

    <h3>Behavioral analysis</h3>
    <p>
      Real humans behave differently than bots. Sentinel analyzes:
    </p>
    <ul>
      <li><strong>Click timing:</strong> Humans have natural delays; bots click instantly</li>
      <li><strong>Movement patterns:</strong> Mouse movements and scrolling behavior</li>
      <li><strong>Session context:</strong> What pages they visit, in what order</li>
      <li><strong>Request frequency:</strong> Bots often make rapid sequential requests</li>
    </ul>

    <h3>User agent classification</h3>
    <p>
      Known bot user agents (Googlebot, Bingbot, etc.) are identified automatically. 
      Sentinel also detects bots trying to disguise themselves with fake user agents.
    </p>

    <h3>IP reputation</h3>
    <p>
      Traffic from known data centers, VPNs commonly used for scraping, and IP addresses 
      with bot history receive additional scrutiny.
    </p>

    <h3>Machine learning model</h3>
    <p>
      All signals feed into an ML model trained on millions of real and bot interactions. 
      The model improves continuously as new bot patterns emerge.
    </p>

    <h2>What happens to detected bots</h2>
    <ul>
      <li><strong>Blocked bots:</strong> Receive a 403 response, never reach your destination</li>
      <li><strong>Filtered analytics:</strong> Bot clicks are excluded from your reports</li>
      <li><strong>Separate tracking:</strong> Bot traffic is logged separately for auditing</li>
    </ul>

    <h2>Types of bots detected</h2>

    <h3>Search engine crawlers</h3>
    <p>
      Googlebot, Bingbot, etc. These are generally legitimate but shouldn't count as clicks. 
      Sentinel identifies and filters them from analytics.
    </p>

    <h3>SEO tools</h3>
    <p>
      Ahrefs, SEMrush, Moz crawlers checking backlinks. Useful for SEO but not real visitors.
    </p>

    <h3>Scrapers</h3>
    <p>
      Automated scripts extracting data from your pages. Often used by competitors or 
      data aggregators.
    </p>

    <h3>Click fraud</h3>
    <p>
      Malicious bots designed to drain ad budgets or inflate competitor metrics. 
      Sentinel's behavioral analysis is particularly effective here.
    </p>

    <h2>Allowing legitimate bots</h2>
    <p>
      Some bots are beneficial (search engine indexing, monitoring services). You can 
      configure allowlists:
    </p>
    <ol>
      <li>Go to <strong>Settings → Sentinel → Bot Allowlist</strong></li>
      <li>Add user agent patterns or IP ranges to allow</li>
      <li>These bots will still be tracked separately from human traffic</li>
    </ol>

    <h2>Pro tips</h2>
    <ul>
      <li>Enable bot detection on all links—there's no downside to clean data</li>
      <li>Review the "Bots Blocked" report monthly to understand traffic composition</li>
      <li>If legitimate traffic is being blocked, check the allowlist settings</li>
      <li>Use bot detection data to optimize your security settings over time</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Basic bot detection is included on <strong>Starter</strong> plans. Advanced behavioral 
      analysis and custom allowlists require <strong>Growth</strong> or higher.
    </p>
  </HelpArticleLayout>
);

export default SentinelBotDetection;
