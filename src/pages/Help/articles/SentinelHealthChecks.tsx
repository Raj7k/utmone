import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelHealthChecks = () => (
  <HelpArticleLayout
    title="Health preflight checks"
    description="Understanding how Sentinel validates destination URLs before redirecting visitors."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Health Checks" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Health preflight is Sentinel's proactive URL validation system. Before redirecting visitors, 
      it checks your destination for common issues that would result in a bad experience.
    </p>

    <h2>Why it matters</h2>
    <p>
      Every broken link damages trust. When a visitor clicks your campaign link and lands on a 404 
      page, they blame your brand—not the destination server. Health preflight catches problems 
      before visitors see them.
    </p>

    <h2>What gets checked</h2>
    <p>
      Sentinel's health preflight validates:
    </p>
    <ul>
      <li><strong>HTTP status:</strong> Looking for 200 OK, flagging 4xx and 5xx errors</li>
      <li><strong>SSL certificate:</strong> Valid, not expired, matches domain</li>
      <li><strong>Response time:</strong> Destination responds within timeout threshold</li>
      <li><strong>Connection:</strong> Server is reachable and accepting requests</li>
      <li><strong>Content type:</strong> Response is a web page (not a download or error)</li>
    </ul>

    <h2>How checks work</h2>

    <h3>Background validation</h3>
    <p>
      Health checks run in the background, not at click time. Results are cached so redirects 
      remain fast (under 50ms) while protection stays active.
    </p>

    <h3>Check frequency</h3>
    <ul>
      <li><strong>Every 5 minutes:</strong> Default for most links</li>
      <li><strong>Every minute:</strong> High-priority links with paid traffic</li>
      <li><strong>Hourly:</strong> Low-priority or stable destinations</li>
    </ul>

    <h3>Failure detection</h3>
    <p>
      When a check fails, Sentinel:
    </p>
    <ol>
      <li>Retries the check to confirm the failure</li>
      <li>Updates the link's health status</li>
      <li>Triggers auto-heal if configured</li>
      <li>Sends you an alert notification</li>
    </ol>

    <h2>Understanding health status</h2>
    <ul>
      <li><strong>Healthy (green):</strong> All checks passing, destination working normally</li>
      <li><strong>Degraded (yellow):</strong> Slow response times or intermittent issues</li>
      <li><strong>Unhealthy (red):</strong> Consistent failures, auto-heal may be active</li>
      <li><strong>Unknown (gray):</strong> Not enough data yet or checks disabled</li>
    </ul>

    <h2>Common failure types</h2>

    <h3>404 Not Found</h3>
    <p>
      Page was removed or URL changed. Fix: Update your destination URL or enable auto-heal 
      to route to an alternative.
    </p>

    <h3>SSL Certificate Error</h3>
    <p>
      Certificate expired or misconfigured. Fix: Contact the destination site owner to 
      renew their SSL certificate.
    </p>

    <h3>Connection Timeout</h3>
    <p>
      Server not responding. Could be temporary (traffic spike) or permanent (server down). 
      Sentinel will retry and auto-heal if the issue persists.
    </p>

    <h3>503 Service Unavailable</h3>
    <p>
      Server overloaded or under maintenance. Usually temporary—Sentinel monitors for recovery.
    </p>

    <h2>Pro tips</h2>
    <ul>
      <li>Set higher check frequency for links with active paid campaigns</li>
      <li>Review the health history to identify patterns (e.g., daily maintenance windows)</li>
      <li>Configure fallback URLs before issues occur, not after</li>
      <li>Use Slack/email alerts to get notified of health changes immediately</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Health preflight is available on <strong>Growth</strong> plans and above. Starter plans 
      include basic status monitoring without proactive checks.
    </p>
  </HelpArticleLayout>
);

export default SentinelHealthChecks;
