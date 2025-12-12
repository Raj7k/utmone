import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { Plug, Activity, Code2, Webhook, Chrome, BarChart3, Users, MessageSquare, Zap, FileCode, Sparkles } from "lucide-react";

const Integrations = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations & API" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Integrations & API</h1>
      <p className="text-lg text-zinc-500">Connect utm.one to your existing marketing stack with our API, webhooks, and native integrations.</p>
    </div>
    <div className="space-y-4">
      <ExpandableArticle
        title="Tracking pixel installation"
        description="Add our lightweight JavaScript snippet to unlock conversion tracking, journey analytics, and revenue attribution."
        icon={Activity}
      >
        <h4>What it is</h4>
        <p>The utm.one tracking pixel is a lightweight JavaScript snippet (&lt;2KB) that captures visitor behavior, conversions, and journey data on your website.</p>
        
        <h4>Why it matters</h4>
        <p>Without the pixel, you only see click data. With the pixel, you see the complete journey from click to conversion, enabling revenue attribution and funnel analysis.</p>
        
        <h4>How to install</h4>
        <ol>
          <li>Go to Settings → Tracking Pixel in your dashboard</li>
          <li>Copy your unique snippet code</li>
          <li>Paste before the closing <code>&lt;/head&gt;</code> tag on all pages</li>
          <li>Verify installation using the pixel debugger</li>
        </ol>
        
        <h4>Data collected</h4>
        <ul>
          <li>Page views and session duration</li>
          <li>UTM parameters from URLs</li>
          <li>Conversion events (when tracked)</li>
          <li>Device and browser information</li>
          <li>Anonymous visitor IDs for journey stitching</li>
        </ul>
        
        <p><strong>Available on:</strong> All plans</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Chrome extension setup"
        description="Create short links without leaving your browser. Right-click any page to shorten instantly."
        icon={Chrome}
      >
        <h4>What it is</h4>
        <p>The utm.one Chrome extension lets you create short links directly from any webpage without switching tabs or opening the dashboard.</p>
        
        <h4>Features</h4>
        <ul>
          <li>Right-click context menu to shorten current page</li>
          <li>Keyboard shortcut (Ctrl/Cmd + Shift + L)</li>
          <li>Auto-fills UTM parameters based on context</li>
          <li>Copy link or QR code to clipboard instantly</li>
          <li>View recent links in popup</li>
        </ul>
        
        <h4>Installation</h4>
        <ol>
          <li>Visit the Chrome Web Store (search "utm.one")</li>
          <li>Click "Add to Chrome"</li>
          <li>Sign in with your utm.one credentials</li>
          <li>Pin the extension for quick access</li>
        </ol>
        
        <p><strong>Available on:</strong> All plans</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Lead enrichment setup"
        description="Connect Clay, Apollo, or ZoomInfo to auto-find missing emails and phone numbers from badge scans."
        icon={Sparkles}
        tier="growth"
        isNew
      >
        <h4>What it is</h4>
        <p>Lead enrichment automatically fills in missing contact information when you scan event badges, using third-party data providers.</p>
        
        <h4>Supported providers</h4>
        <ul>
          <li><strong>Clay</strong> – Comprehensive B2B data with AI enrichment</li>
          <li><strong>Apollo.io</strong> – Email and phone number lookup</li>
          <li><strong>ZoomInfo</strong> – Enterprise contact data</li>
        </ul>
        
        <h4>How to connect</h4>
        <ol>
          <li>Go to Settings → Integrations → Enrichment</li>
          <li>Select your preferred provider</li>
          <li>Enter your API key from the provider's dashboard</li>
          <li>Configure auto-enrich settings (on/off per event)</li>
        </ol>
        
        <h4>How it works</h4>
        <p>When you scan a badge with partial information (e.g., just email), utm.one queries your enrichment provider to find additional data like phone number, job title, company size, and LinkedIn profile.</p>
        
        <p><strong>Available on:</strong> Growth plan and above</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="API authentication"
        description="Generate API keys, understand rate limits, and authenticate requests. Full REST API documentation."
        icon={Code2}
      >
        <h4>Getting started</h4>
        <p>The utm.one API uses API keys for authentication. Each key is scoped to a specific workspace.</p>
        
        <h4>Generate an API key</h4>
        <ol>
          <li>Go to Settings → Developer → API Keys</li>
          <li>Click "Create new key"</li>
          <li>Name your key and select permissions (read/write)</li>
          <li>Copy the key immediately (it won't be shown again)</li>
        </ol>
        
        <h4>Authentication</h4>
        <p>Include your API key in the <code>Authorization</code> header:</p>
        <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>
        
        <h4>Rate limits</h4>
        <ul>
          <li><strong>Free:</strong> 100 requests/hour</li>
          <li><strong>Starter:</strong> 1,000 requests/hour</li>
          <li><strong>Growth:</strong> 10,000 requests/hour</li>
          <li><strong>Business:</strong> 100,000 requests/hour</li>
        </ul>
        
        <p>Rate limit headers are included in all responses: <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code></p>
        
        <p><strong>Available on:</strong> All plans (different limits)</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="API endpoints"
        description="Create links, retrieve analytics, manage campaigns, and more programmatically. All endpoints documented."
        icon={FileCode}
      >
        <h4>Base URL</h4>
        <pre><code>https://api.utm.one/v1</code></pre>
        
        <h4>Core endpoints</h4>
        <ul>
          <li><code>POST /links</code> – Create a new short link</li>
          <li><code>GET /links</code> – List all links (paginated)</li>
          <li><code>GET /links/:id</code> – Get link details</li>
          <li><code>PATCH /links/:id</code> – Update a link</li>
          <li><code>DELETE /links/:id</code> – Archive a link</li>
          <li><code>GET /links/:id/analytics</code> – Get click analytics</li>
        </ul>
        
        <h4>Campaign endpoints</h4>
        <ul>
          <li><code>POST /campaigns</code> – Create campaign</li>
          <li><code>GET /campaigns</code> – List campaigns</li>
          <li><code>GET /campaigns/:id/links</code> – Get links in campaign</li>
        </ul>
        
        <h4>Example request</h4>
        <pre><code>{`curl -X POST https://api.utm.one/v1/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "slug": "summer-sale"}'`}</code></pre>
        
        <p><strong>Available on:</strong> All plans</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Webhooks configuration"
        description="Receive real-time notifications when links are clicked, created, or reach milestones."
        icon={Webhook}
      >
        <h4>What are webhooks?</h4>
        <p>Webhooks send HTTP POST requests to your server when specific events occur in utm.one, enabling real-time automation.</p>
        
        <h4>Available events</h4>
        <ul>
          <li><code>link.created</code> – When a new link is created</li>
          <li><code>link.clicked</code> – When a link receives a click</li>
          <li><code>link.milestone</code> – When a link hits click milestones (100, 1K, 10K)</li>
          <li><code>conversion.tracked</code> – When a conversion is recorded</li>
          <li><code>campaign.created</code> – When a campaign is created</li>
        </ul>
        
        <h4>Setup</h4>
        <ol>
          <li>Go to Settings → Developer → Webhooks</li>
          <li>Click "Add webhook endpoint"</li>
          <li>Enter your endpoint URL (HTTPS required)</li>
          <li>Select events to subscribe to</li>
          <li>Copy the signing secret for verification</li>
        </ol>
        
        <h4>Verification</h4>
        <p>All webhook payloads include a signature header <code>X-UTM-Signature</code> for verification using HMAC-SHA256.</p>
        
        <p><strong>Available on:</strong> Growth plan and above</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="GA4 integration"
        description="Send utm.one click data to Google Analytics 4 for unified reporting in your existing dashboards."
        icon={BarChart3}
        tier="growth"
      >
        <h4>What it does</h4>
        <p>The GA4 integration sends link click events to your Google Analytics 4 property, allowing you to analyze utm.one data alongside your existing analytics.</p>
        
        <h4>Data sent to GA4</h4>
        <ul>
          <li>Click events with link metadata</li>
          <li>UTM parameters (source, medium, campaign, term, content)</li>
          <li>Geographic data (country, city)</li>
          <li>Device and browser information</li>
          <li>Conversion events (when configured)</li>
        </ul>
        
        <h4>Setup</h4>
        <ol>
          <li>Go to Settings → Integrations → Google Analytics</li>
          <li>Click "Connect GA4"</li>
          <li>Enter your GA4 Measurement ID (G-XXXXXXXXXX)</li>
          <li>Optionally add your API secret for server-side events</li>
          <li>Test the connection</li>
        </ol>
        
        <p><strong>Available on:</strong> Growth plan and above</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="HubSpot integration"
        description="Sync link clicks and conversions to HubSpot contacts. See utm.one data in your CRM timeline."
        icon={Users}
        tier="growth"
      >
        <h4>What it does</h4>
        <p>Connect utm.one to HubSpot to automatically log link clicks as timeline activities and sync conversion data to contact records.</p>
        
        <h4>Features</h4>
        <ul>
          <li>Link clicks appear in contact timeline</li>
          <li>Conversion events update contact properties</li>
          <li>Attribution data syncs to deals</li>
          <li>Custom properties for campaign tracking</li>
        </ul>
        
        <h4>Setup</h4>
        <ol>
          <li>Go to Settings → Integrations → HubSpot</li>
          <li>Click "Connect HubSpot"</li>
          <li>Authorize utm.one in HubSpot OAuth</li>
          <li>Map fields between utm.one and HubSpot</li>
          <li>Enable sync for desired data types</li>
        </ol>
        
        <p><strong>Available on:</strong> Growth plan and above</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Salesforce integration"
        description="Push attribution data to Salesforce leads and opportunities. Prove marketing's revenue impact."
        icon={Users}
        tier="business"
      >
        <h4>What it does</h4>
        <p>The Salesforce integration pushes marketing attribution data directly to your CRM, connecting link clicks to revenue.</p>
        
        <h4>Features</h4>
        <ul>
          <li>First-touch and multi-touch attribution on leads</li>
          <li>Campaign influence on opportunities</li>
          <li>Custom objects for journey data</li>
          <li>Bi-directional sync for offline conversions</li>
        </ul>
        
        <h4>Setup</h4>
        <ol>
          <li>Go to Settings → Integrations → Salesforce</li>
          <li>Click "Connect Salesforce"</li>
          <li>Log in with Salesforce admin credentials</li>
          <li>Install the utm.one managed package</li>
          <li>Configure field mappings and sync rules</li>
        </ol>
        
        <p><strong>Available on:</strong> Business plan and above</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Zapier connection"
        description="Connect utm.one to 5,000+ apps. Trigger workflows when links are created or clicked."
        icon={Zap}
      >
        <h4>What it does</h4>
        <p>The Zapier integration lets you automate workflows between utm.one and thousands of other applications without code.</p>
        
        <h4>Available triggers</h4>
        <ul>
          <li>New link created</li>
          <li>Link clicked</li>
          <li>Link milestone reached</li>
          <li>Conversion tracked</li>
        </ul>
        
        <h4>Available actions</h4>
        <ul>
          <li>Create short link</li>
          <li>Update link</li>
          <li>Add link to campaign</li>
        </ul>
        
        <h4>Popular Zaps</h4>
        <ul>
          <li>Add new leads from link clicks to a spreadsheet</li>
          <li>Send Slack notification when link hits 1,000 clicks</li>
          <li>Create utm.one link when new blog post is published</li>
        </ul>
        
        <p><strong>Available on:</strong> All plans</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Slack notifications"
        description="Get alerts in Slack when campaigns launch, traffic spikes, or links hit milestones."
        icon={MessageSquare}
      >
        <h4>What it does</h4>
        <p>Receive real-time notifications in your Slack workspace for important utm.one events.</p>
        
        <h4>Notification types</h4>
        <ul>
          <li>Link created by team member</li>
          <li>Link milestone reached (100, 1K, 10K clicks)</li>
          <li>Traffic anomaly detected (spike or drop)</li>
          <li>Conversion goal achieved</li>
          <li>Campaign status changes</li>
        </ul>
        
        <h4>Setup</h4>
        <ol>
          <li>Go to Settings → Notifications → Slack</li>
          <li>Click "Connect to Slack"</li>
          <li>Select the channel for notifications</li>
          <li>Choose which events to receive</li>
          <li>Optionally set quiet hours</li>
        </ol>
        
        <p><strong>Available on:</strong> All plans</p>
      </ExpandableArticle>
    </div>
  </HelpLayout>
);

export default Integrations;
