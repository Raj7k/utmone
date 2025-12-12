import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import {
  BarChart3,
  MousePointer,
  Smartphone,
  Globe,
  Link2,
  Calendar,
  TrendingUp,
  Bell,
  RefreshCw,
  Activity,
} from "lucide-react";

const Analytics = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Analytics & Intelligence" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Analytics & Intelligence</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Understand your audience with real-time click analytics. Every link, every click, every insight.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Key metrics at a glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">12,847</div>
            <div className="text-sm text-zinc-500">Total clicks</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">8,234</div>
            <div className="text-sm text-zinc-500">Unique visitors</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700 text-center">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">64%</div>
            <div className="text-sm text-zinc-500">Mobile traffic</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700 text-center">
            <div className="text-2xl font-bold text-emerald-600">+23%</div>
            <div className="text-sm text-zinc-500">vs last week</div>
          </div>
        </div>
      </div>

      <ProTip>
        Set up Pulse Watchdog alerts to get notified when traffic patterns change. Catch viral moments and broken campaigns early.
      </ProTip>

      {/* Core Analytics */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Core analytics</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Analytics overview"
            description="Your command center showing total clicks, top links, and traffic trends."
            icon={BarChart3}
          >
            <h3>Dashboard sections</h3>
            <ul>
              <li><strong>Summary cards</strong> — Total clicks, unique visitors, top performing link</li>
              <li><strong>Time series chart</strong> — Click trends over time</li>
              <li><strong>Top links table</strong> — Your most clicked links</li>
              <li><strong>Quick actions</strong> — Create link, view details, export data</li>
            </ul>
            <h3>Filtering options</h3>
            <p>Filter by date range, link, campaign, UTM parameter, or custom tags.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Click tracking"
            description="See total clicks, unique visitors, and click-through rates."
            icon={MousePointer}
          >
            <h3>What we track</h3>
            <ul>
              <li><strong>Total clicks</strong> — Every time someone clicks your link</li>
              <li><strong>Unique visitors</strong> — Individual people who clicked</li>
              <li><strong>Click-through rate</strong> — Clicks divided by impressions (if tracking pixels installed)</li>
              <li><strong>Repeat visitors</strong> — People who clicked multiple times</li>
            </ul>
            <h3>Data retention</h3>
            <p>Click data is retained for 2 years on all plans.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Device & browser analytics"
            description="Know what devices your audience uses—desktop, mobile, tablet."
            icon={Smartphone}
          >
            <h3>Device breakdown</h3>
            <ul>
              <li><strong>Device type</strong> — Desktop, mobile, tablet</li>
              <li><strong>Operating system</strong> — iOS, Android, Windows, macOS, Linux</li>
              <li><strong>Browser</strong> — Chrome, Safari, Firefox, Edge, etc.</li>
            </ul>
            <h3>Why this matters</h3>
            <p>Optimize your landing pages for the devices your audience actually uses. If 80% of your traffic is mobile, prioritize mobile experience.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Geographic data"
            description="See where your clicks come from with country, region, and city data."
            icon={Globe}
          >
            <h3>Location data</h3>
            <ul>
              <li><strong>Country</strong> — Always available</li>
              <li><strong>Region/State</strong> — Available in most countries</li>
              <li><strong>City</strong> — Available for most traffic</li>
            </ul>
            <h3>Visualization</h3>
            <p>View geographic data on an interactive map or as a sortable table.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Referrer tracking"
            description="Discover which websites and platforms drive traffic to your links."
            icon={Link2}
          >
            <h3>What we capture</h3>
            <ul>
              <li><strong>Referring domain</strong> — The website that sent the visitor</li>
              <li><strong>Referring URL</strong> — The specific page they came from</li>
              <li><strong>Direct traffic</strong> — When someone types the URL directly</li>
            </ul>
            <p>Note: Some platforms (like Facebook) may not send referrer data due to privacy settings.</p>
          </ExpandableArticle>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Advanced analytics</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Real-time analytics"
            description="Watch clicks roll in live during campaign launches."
            icon={RefreshCw}
          >
            <h3>Real-time features</h3>
            <ul>
              <li>Live click counter with auto-refresh</li>
              <li>Geographic visualization of recent clicks</li>
              <li>Device breakdown in real-time</li>
              <li>Alerts for significant activity</li>
            </ul>
            <h3>Best used for</h3>
            <p>Monitoring launches, time-sensitive promotions, and viral content as it happens.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Exporting data"
            description="Download your analytics as CSV or connect via API."
            icon={Calendar}
          >
            <h3>Export options</h3>
            <ul>
              <li><strong>CSV download</strong> — One-time export of selected data</li>
              <li><strong>Scheduled reports</strong> — Automatic weekly/monthly exports</li>
              <li><strong>API access</strong> — Programmatic access to all data</li>
            </ul>
            <h3>What's included</h3>
            <p>All click-level data: timestamp, link, UTM parameters, device, location, referrer.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="AI insights"
            description="AI-powered analysis with recommendations for improving performance."
            icon={TrendingUp}
            tier="growth"
          >
            <h3>What AI analyzes</h3>
            <ul>
              <li>Traffic patterns and anomalies</li>
              <li>Best performing campaigns and why</li>
              <li>Underperforming links with suggestions</li>
              <li>Optimal posting times based on your data</li>
            </ul>
            <h3>How to use</h3>
            <p>AI insights appear automatically in your dashboard when there's something actionable to share.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Anomaly detection"
            description="Get notified when traffic spikes, drops, or shows unusual patterns."
            icon={Bell}
            tier="growth"
          >
            <h3>What we detect</h3>
            <ul>
              <li><strong>Traffic spikes</strong> — Sudden increases (potential viral moment)</li>
              <li><strong>Traffic drops</strong> — Unexpected decreases (potential issue)</li>
              <li><strong>New referrers</strong> — Significant traffic from new sources</li>
              <li><strong>Geographic shifts</strong> — Unusual location patterns</li>
            </ul>
            <h3>Alert channels</h3>
            <p>Receive alerts via email, Slack, or in-app notifications.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Data reliability"
            description="Confidence levels based on click volume—500+ clicks for reliable insights."
            icon={Activity}
          >
            <h3>Reliability tiers</h3>
            <ul>
              <li><strong>30+ clicks</strong> — Minimum threshold, gathering initial data</li>
              <li><strong>100+ clicks</strong> — Early insights available</li>
              <li><strong>300+ clicks</strong> — Good data confidence</li>
              <li><strong>500+ clicks</strong> — Reliable insights</li>
            </ul>
            <p>We display confidence indicators so you know when data is statistically meaningful.</p>
          </ExpandableArticle>
        </div>
      </div>

      <FeatureAvailability
        feature="Analytics"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />
    </HelpLayout>
  );
};

export default Analytics;
