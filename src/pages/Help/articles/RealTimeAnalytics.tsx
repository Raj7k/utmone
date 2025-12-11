import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Zap, Bell } from "lucide-react";

const RealTimeAnalytics = () => {
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
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Real-time analytics</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Watch clicks happen live as your audience engages with your links.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How real-time works</h2>
          <p className="text-zinc-600 mb-4">
            utm.one uses websocket connections to stream click data directly to your dashboard. 
            When someone clicks your link, you'll see it within seconds.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-zinc-900">Live connection active</span>
            </div>
            <p className="text-sm text-zinc-600">
              When you see this indicator, your dashboard is receiving real-time updates. 
              New clicks will appear automatically without refreshing.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Accessing real-time view</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Navigate to <strong>Intelligence → Overview</strong></li>
            <li>Look for the <strong>Live Pulse</strong> indicator</li>
            <li>The click counter updates in real-time</li>
            <li>Recent clicks stream into the activity feed</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Live click stream</h2>
          <p className="text-zinc-600 mb-4">
            The live feed shows each click as it happens:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-zinc-600">Just now</span>
              <span className="text-zinc-900">utm.one/spring-sale</span>
              <span className="text-zinc-500">→ US, Mobile, Chrome</span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-75">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-zinc-600">2s ago</span>
              <span className="text-zinc-900">utm.one/newsletter</span>
              <span className="text-zinc-500">→ UK, Desktop, Safari</span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-50">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-zinc-600">5s ago</span>
              <span className="text-zinc-900">utm.one/product-launch</span>
              <span className="text-zinc-500">→ DE, Mobile, Firefox</span>
            </div>
          </div>

          <ProTip>
            Real-time analytics are perfect for monitoring campaign launches. Open the dashboard 
            before sending your email blast or publishing your social post to watch engagement unfold.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Use cases for real-time</h2>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Campaign launches:</strong> Monitor initial engagement after sending</li>
            <li><strong>Live events:</strong> Track QR scans during presentations or events</li>
            <li><strong>Social posts:</strong> Watch clicks spike after publishing</li>
            <li><strong>A/B testing:</strong> Compare variant performance in real-time</li>
            <li><strong>Sales demos:</strong> Show prospects live engagement data</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Pulse Watchdog alerts</h2>
          <div className="flex items-start gap-3 mb-4">
            <Bell className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Don't want to watch the dashboard constantly? Pulse Watchdog automatically detects 
                unusual traffic patterns and alerts you via email or Slack.
              </p>
            </div>
          </div>
          <p className="text-zinc-600 mb-4">
            Pulse Watchdog detects:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Traffic spikes:</strong> Viral moments you shouldn't miss</li>
            <li><strong>Traffic drops:</strong> Broken links or campaign issues</li>
            <li><strong>New sources:</strong> Unexpected referrers appearing</li>
            <li><strong>Anomalies:</strong> Unusual patterns that need attention</li>
          </ul>

          <Link 
            to="/help/articles/anomaly-detection" 
            className="inline-flex items-center gap-2 text-amber-600 hover:underline"
          >
            Set up Pulse Watchdog alerts →
          </Link>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Technical notes</h2>
          <p className="text-zinc-600 mb-4">
            Understanding real-time data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Clicks appear within 1-3 seconds of happening</li>
            <li>Real-time requires an active browser tab</li>
            <li>Historical aggregations update every few minutes</li>
            <li>Very high traffic may show slight delays during processing</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Real-time analytics are available on all plans. Historical data 
              retention varies by plan tier.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default RealTimeAnalytics;
