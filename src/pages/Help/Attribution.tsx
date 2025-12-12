import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import {
  Network,
  Target,
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  GitBranch,
} from "lucide-react";

const Attribution = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Attribution & Revenue" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Attribution & Revenue</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Connect marketing touchpoints to actual revenue. Know exactly which campaigns drive results.
        </p>
      </div>

      {/* Attribution Models Visual */}
      <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Attribution models compared</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-emerald-400" />
              <span className="font-medium">First-touch</span>
            </div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 flex-1 bg-emerald-500 rounded-l"></div>
              <div className="h-3 flex-1 bg-white/20"></div>
              <div className="h-3 flex-1 bg-white/20 rounded-r"></div>
            </div>
            <p className="text-xs text-zinc-400">100% → 0% → 0%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="font-medium">Linear</span>
            </div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 flex-1 bg-blue-500 rounded-l"></div>
              <div className="h-3 flex-1 bg-blue-500"></div>
              <div className="h-3 flex-1 bg-blue-500 rounded-r"></div>
            </div>
            <p className="text-xs text-zinc-400">33% → 33% → 33%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Time-decay</span>
            </div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 flex-1 bg-purple-300 rounded-l"></div>
              <div className="h-3 flex-1 bg-purple-400"></div>
              <div className="h-3 flex-1 bg-purple-600 rounded-r"></div>
            </div>
            <p className="text-xs text-zinc-400">20% → 30% → 50%</p>
          </div>
        </div>
      </div>

      <ProTip>
        Start with first-touch and last-touch to understand your funnel extremes. Then use Clean Track Intelligence™ to see the full picture.
      </ProTip>

      {/* Attribution Fundamentals */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Attribution fundamentals</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="What is attribution?"
            description="Attribution connects marketing touchpoints to conversions."
            icon={Network}
          >
            <h3>Understanding attribution</h3>
            <p>Attribution answers the question: "When someone converts (buys, signs up, downloads), which marketing touchpoints deserve credit?"</p>
            <h3>Why it matters</h3>
            <ul>
              <li>Know which campaigns actually drive revenue</li>
              <li>Optimize marketing spend based on real data</li>
              <li>Prove ROI to stakeholders</li>
              <li>Stop wasting budget on ineffective channels</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Attribution models"
            description="First-touch, last-touch, linear, time-decay, and Clean Track Intelligence."
            icon={Target}
          >
            <h3>Common models</h3>
            <p><strong>First-touch</strong> — 100% credit to the first interaction. Shows what channels drive awareness.</p>
            <p><strong>Last-touch</strong> — 100% credit to the final interaction before conversion. Shows what closes deals.</p>
            <p><strong>Linear</strong> — Equal credit to all touchpoints. Fair but may not reflect reality.</p>
            <p><strong>Time-decay</strong> — More credit to recent touchpoints. Reflects recency bias in purchasing decisions.</p>
            <p><strong>Clean Track Intelligence™</strong> — Our proprietary model that uses data patterns to assign credit based on actual influence.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Installing the tracking pixel"
            description="Add our JavaScript snippet to unlock conversion tracking."
            icon={ArrowRight}
          >
            <h3>Installation steps</h3>
            <ol>
              <li>Go to Settings → Tracking Pixel</li>
              <li>Copy the JavaScript snippet</li>
              <li>Paste it in the <code>&lt;head&gt;</code> of your website</li>
              <li>Verify installation in the settings panel</li>
            </ol>
            <h3>What the pixel tracks</h3>
            <ul>
              <li>Page views and navigation</li>
              <li>UTM parameters from URL</li>
              <li>Conversion events you define</li>
              <li>Cross-session visitor identification</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Conversion tracking"
            description="Track purchases, signups, form submissions, and custom events."
            icon={BarChart3}
          >
            <h3>Tracking conversions</h3>
            <p>Once the tracking pixel is installed, you can track conversions using our JavaScript API:</p>
            <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded text-sm overflow-x-auto">
{`utm.track('purchase', {
  revenue: 99.00,
  currency: 'USD',
  orderId: 'ORD-123'
});`}
            </pre>
            <h3>Built-in events</h3>
            <ul>
              <li><code>purchase</code> — For completed transactions</li>
              <li><code>signup</code> — For new registrations</li>
              <li><code>lead</code> — For form submissions</li>
              <li><code>custom</code> — For any other event</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Customer journey analytics"
            description="Visualize the complete path from first click to conversion."
            icon={GitBranch}
          >
            <h3>What you'll see</h3>
            <ul>
              <li>Timeline of all touchpoints for each conversion</li>
              <li>Common paths that lead to conversion</li>
              <li>Drop-off points where visitors abandon</li>
              <li>Time between touchpoints</li>
            </ul>
            <h3>Journey visualization</h3>
            <p>View journeys as a Sankey diagram showing flow between channels, or as a timeline for individual conversions.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Identity Graph"
            description="Connect anonymous clicks to known customers across devices."
            icon={Users}
            tier="business"
          >
            <h3>How Identity Graph works</h3>
            <p>Identity Graph connects multiple sessions and devices to a single user profile, giving you a complete view of their journey even when they switch browsers or devices.</p>
            <h3>Connection methods</h3>
            <ul>
              <li><strong>Email matching</strong> — When users log in or submit forms</li>
              <li><strong>Cookie linking</strong> — First-party cookies across sessions</li>
              <li><strong>Probabilistic matching</strong> — Device fingerprinting with high confidence thresholds</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      {/* Advanced Attribution */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Advanced attribution</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Revenue attribution"
            description="Connect revenue to marketing touchpoints. Know your true ROI."
            icon={DollarSign}
            tier="growth"
          >
            <h3>How it works</h3>
            <p>When you track revenue with conversions, we attribute that revenue to the touchpoints that influenced the sale using your chosen attribution model.</p>
            <h3>Revenue metrics</h3>
            <ul>
              <li><strong>Attributed revenue</strong> — Revenue credited to each channel/campaign</li>
              <li><strong>ROAS</strong> — Return on ad spend</li>
              <li><strong>Cost per acquisition</strong> — When ad spend data is connected</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Lift Analysis"
            description="Measure incremental impact by comparing converted vs non-converted paths."
            icon={TrendingUp}
            tier="business"
          >
            <h3>What is Lift Analysis?</h3>
            <p>Lift Analysis compares users who converted with similar users who didn't, measuring the incremental impact of each channel. This proves causation, not just correlation.</p>
            <h3>Metrics provided</h3>
            <ul>
              <li><strong>Incremental conversions</strong> — Conversions that wouldn't have happened without the touchpoint</li>
              <li><strong>Lift percentage</strong> — How much the channel increased conversion rate</li>
              <li><strong>Confidence interval</strong> — Statistical certainty of the measurement</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      <FeatureAvailability
        feature="Attribution"
        availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
      />
    </HelpLayout>
  );
};

export default Attribution;
