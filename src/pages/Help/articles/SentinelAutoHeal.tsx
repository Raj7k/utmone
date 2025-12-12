import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelAutoHeal = () => (
  <HelpArticleLayout
    title="Auto-heal & fallback URLs"
    description="Configure automatic routing to backup destinations when your primary URL fails."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Auto-Heal" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Auto-heal is Sentinel's automatic failover system. When your destination URL becomes 
      unavailable, Sentinel instantly routes visitors to your configured fallback URL—no 
      manual intervention required.
    </p>

    <h2>Why it matters</h2>
    <p>
      Every second of downtime costs you visitors, conversions, and trust. Auto-heal ensures:
    </p>
    <ul>
      <li>Visitors never see a broken page or error message</li>
      <li>QR codes at events continue working even if your server has issues</li>
      <li>Paid traffic isn't wasted on 404 pages</li>
      <li>Your brand maintains a professional, reliable appearance</li>
    </ul>

    <h2>How auto-heal works</h2>

    <h3>1. Detection</h3>
    <p>
      Sentinel's health preflight detects when your destination URL fails (404, 500, timeout, 
      SSL error). The failure is confirmed with a retry to avoid false positives.
    </p>

    <h3>2. Activation</h3>
    <p>
      Once a failure is confirmed, auto-heal activates immediately. New clicks are routed 
      to your fallback URL instead of the failing destination.
    </p>

    <h3>3. Notification</h3>
    <p>
      You receive an alert (email, Slack, or dashboard notification) explaining what happened 
      and that auto-heal is active.
    </p>

    <h3>4. Recovery</h3>
    <p>
      Sentinel continues monitoring the original URL. When it recovers, routing automatically 
      switches back to the primary destination.
    </p>

    <h2>Setting up fallback URLs</h2>
    <ol>
      <li>Open the link detail page</li>
      <li>Enable Sentinel Mode if not already active</li>
      <li>Find the <strong>Fallback URL</strong> field</li>
      <li>Enter your backup destination</li>
      <li>Save the link</li>
    </ol>

    <h2>Fallback URL best practices</h2>

    <h3>Use a page you control</h3>
    <p>
      Don't use another third-party URL as fallback—it could also fail. Host your fallback 
      on your own domain for maximum reliability.
    </p>

    <h3>Match the intent</h3>
    <p>
      If the original link goes to a product page, the fallback should be a related category 
      or similar product—not your homepage.
    </p>

    <h3>Explain the situation</h3>
    <p>
      Consider creating a dedicated fallback page that acknowledges something went wrong 
      and offers alternatives. Example: "We're experiencing technical difficulties. 
      Here are similar products you might like..."
    </p>

    <h3>Test your fallback</h3>
    <p>
      Before enabling auto-heal, manually visit your fallback URL to ensure it works 
      and provides a good experience.
    </p>

    <h2>Auto-heal settings</h2>

    <h3>Trigger behavior</h3>
    <ul>
      <li><strong>Immediate:</strong> Activate on first confirmed failure</li>
      <li><strong>After 2 failures:</strong> Wait for consecutive failures to avoid false triggers</li>
      <li><strong>Manual only:</strong> Notify you but don't auto-activate</li>
    </ul>

    <h3>Recovery behavior</h3>
    <ul>
      <li><strong>Auto-recover:</strong> Switch back when primary is healthy again</li>
      <li><strong>Manual recovery:</strong> Wait for you to confirm before switching back</li>
    </ul>

    <h2>Monitoring auto-heal</h2>
    <p>
      Track auto-heal activity in your dashboard:
    </p>
    <ul>
      <li><strong>Active auto-heals:</strong> Links currently using fallback routing</li>
      <li><strong>Auto-heal history:</strong> Past activations with timestamps and durations</li>
      <li><strong>Visitors saved:</strong> How many visitors were routed to fallbacks</li>
    </ul>

    <h2>Pro tips</h2>
    <ul>
      <li>Set up fallback URLs proactively—before you need them</li>
      <li>Use "After 2 failures" trigger to avoid brief glitches activating auto-heal</li>
      <li>Create a single, reliable fallback page for multiple related links</li>
      <li>Review auto-heal history to identify patterns (recurring failures at certain times)</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Auto-heal is available on <strong>Growth</strong> plans and above.
    </p>
  </HelpArticleLayout>
);

export default SentinelAutoHeal;
