import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Eye, MousePointer, Globe, Smartphone } from "lucide-react";

const AnalyticsOverview = () => {
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
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Analytics overview</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Understand your link performance with comprehensive analytics that track clicks, devices, locations, and more.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">The Intelligence Hub</h2>
          <p className="text-zinc-600 mb-4">
            utm.one consolidates all your analytics into a single Intelligence Hub. Instead of jumping between 
            multiple dashboards, you get one unified view of all your link performance data.
          </p>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-zinc-900 mb-4">Key metrics at a glance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MousePointer className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Total clicks</p>
                  <p className="text-sm text-zinc-500">All clicks across all links</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Unique visitors</p>
                  <p className="text-sm text-zinc-500">Deduplicated by device fingerprint</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Geographic distribution</p>
                  <p className="text-sm text-zinc-500">Country and city-level data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Device breakdown</p>
                  <p className="text-sm text-zinc-500">Mobile, desktop, tablet</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Accessing analytics</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Navigate to <strong>Intelligence</strong> from the sidebar</li>
            <li>Select the <strong>Overview</strong> tab for high-level metrics</li>
            <li>Use the date picker to adjust your analysis period</li>
            <li>Click on any metric card to drill down into details</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Time period selection</h2>
          <p className="text-zinc-600 mb-4">
            Choose from preset ranges or create custom date ranges:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Today</strong> - Real-time data from the current day</li>
            <li><strong>This week</strong> - Monday to today</li>
            <li><strong>This month</strong> - First of month to today</li>
            <li><strong>Last 7/30/90 days</strong> - Rolling periods</li>
            <li><strong>Custom range</strong> - Select any start and end date</li>
          </ul>

          <ProTip>
            Enable "Compare to previous period" to see how your metrics are trending compared to the same period before.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Real-time vs. aggregated data</h2>
          <p className="text-zinc-600 mb-4">
            utm.one provides both real-time and aggregated analytics:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h4 className="font-medium text-zinc-900">Real-time</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Clicks appear within seconds. Perfect for monitoring live campaigns or launches.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium text-zinc-900">Aggregated</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Historical trends processed hourly. Best for reporting and analysis.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Next steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/click-tracking" className="block p-4 bg-white border border-zinc-200 rounded-xl hover:border-amber-300 transition-colors">
              <h4 className="font-medium text-zinc-900 mb-1">Click tracking</h4>
              <p className="text-sm text-zinc-500">Deep dive into click metrics</p>
            </Link>
            <Link to="/help/articles/device-analytics" className="block p-4 bg-white border border-zinc-200 rounded-xl hover:border-amber-300 transition-colors">
              <h4 className="font-medium text-zinc-900 mb-1">Device analytics</h4>
              <p className="text-sm text-zinc-500">Understand your audience's devices</p>
            </Link>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default AnalyticsOverview;
