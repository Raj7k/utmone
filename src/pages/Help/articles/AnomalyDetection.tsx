import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, TrendingUp, TrendingDown, AlertTriangle, Settings } from "lucide-react";

const AnomalyDetection = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link 
          to="/help/analytics" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Anomaly detection</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Pulse Watchdog automatically detects unusual traffic patterns and alerts you to opportunities and issues.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How it works</h2>
          <p className="text-zinc-600 mb-4">
            Pulse Watchdog uses statistical analysis (Z-score) to compare your current traffic 
            against historical baselines. When traffic deviates significantly from the norm, 
            you get alerted.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-4">Detected anomaly types</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Traffic spikes</p>
                  <p className="text-sm text-zinc-500">Clicks 3x or more above your baseline. Don't miss viral moments!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Traffic drops</p>
                  <p className="text-sm text-zinc-500">Clicks significantly below baseline. Might indicate broken links.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">New referrers</p>
                  <p className="text-sm text-zinc-500">Traffic from sources you've never seen before.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up alerts</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Alerts</strong></li>
            <li>Enable <strong>Pulse Watchdog</strong></li>
            <li>Choose your notification channels (email, Slack, webhook)</li>
            <li>Set your sensitivity level</li>
            <li>Configure quiet hours (optional)</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Sensitivity levels</h2>
          <p className="text-zinc-600 mb-4">
            Control how sensitive anomaly detection should be:
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Low</h4>
              <p className="text-sm text-zinc-600">
                Only major anomalies (5x deviation). Fewer alerts, bigger events only.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 border-amber-300">
              <h4 className="font-medium text-zinc-900 mb-2">Medium (default)</h4>
              <p className="text-sm text-zinc-600">
                Significant anomalies (3x deviation). Balanced alert frequency.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">High</h4>
              <p className="text-sm text-zinc-600">
                All anomalies (2x deviation). More alerts, catch everything.
              </p>
            </div>
          </div>

          <ProTip>
            Start with Medium sensitivity. If you're getting too many alerts, lower it. 
            If you're missing important events, raise it.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Notification channels</h2>
          <p className="text-zinc-600 mb-4">
            Choose where to receive anomaly alerts:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="space-y-4">
              <div>
                <p className="font-medium text-zinc-900">Email</p>
                <p className="text-sm text-zinc-500">Detailed alert with charts sent to your inbox</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Slack</p>
                <p className="text-sm text-zinc-500">Instant notification to your team channel</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Webhook</p>
                <p className="text-sm text-zinc-500">POST request to your custom endpoint for automation</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Quiet hours</h2>
          <div className="flex items-start gap-3 mb-4">
            <Settings className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Don't want alerts at 3am? Set quiet hours to pause notifications during 
                off-hours. Anomalies are still recorded—you just won't be pinged.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Alert debouncing</h2>
          <p className="text-zinc-600 mb-4">
            To prevent alert fatigue, Pulse Watchdog includes smart debouncing:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Same anomaly type won't trigger twice within 24 hours</li>
            <li>Related anomalies are grouped into single alerts</li>
            <li>You can snooze specific anomaly types</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing anomaly history</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Advanced</strong></li>
            <li>Select <strong>Anomaly History</strong></li>
            <li>View all detected anomalies with timestamps</li>
            <li>Click any anomaly to see the data that triggered it</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Why this matters</h2>
          <p className="text-zinc-600 mb-4">
            Without proactive monitoring, you might miss:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Viral moments:</strong> Your content is spreading and you don't know</li>
            <li><strong>Broken campaigns:</strong> A link is dead and losing you leads</li>
            <li><strong>Bot attacks:</strong> Fake traffic is skewing your metrics</li>
            <li><strong>New opportunities:</strong> An influencer shared your link</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Enterprise feature:</strong> Advanced anomaly detection with custom 
              thresholds and ML-powered predictions is available on Business and Enterprise plans.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default AnomalyDetection;
