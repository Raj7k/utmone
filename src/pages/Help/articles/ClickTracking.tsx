import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, MousePointer, Clock, Filter, Download } from "lucide-react";

const ClickTracking = () => {
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
              <MousePointer className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Click tracking</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Track every click with precision—know exactly when, where, and how users engage with your links.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What we track</h2>
          <p className="text-zinc-600 mb-4">
            Every click captures comprehensive data to help you understand user behavior:
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Timestamp data</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Exact click time (UTC)</li>
                  <li>• Local time zone</li>
                  <li>• Day of week patterns</li>
                  <li>• Hour distribution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Source data</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Referrer URL</li>
                  <li>• UTM parameters</li>
                  <li>• Campaign attribution</li>
                  <li>• Traffic source</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">User data</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Device type</li>
                  <li>• Browser & version</li>
                  <li>• Operating system</li>
                  <li>• Screen resolution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Location data</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Country</li>
                  <li>• Region/state</li>
                  <li>• City</li>
                  <li>• Approximate coordinates</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing click data</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Links</strong> from the sidebar</li>
            <li>Click on any link to open its detail view</li>
            <li>Select the <strong>Clicks</strong> tab</li>
            <li>View the click stream with all captured data</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Filtering clicks</h2>
          <p className="text-zinc-600 mb-4">
            Use filters to narrow down your click data:
          </p>
          <div className="flex items-start gap-3 mb-4">
            <Filter className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                <strong>Available filters:</strong> Date range, device type, country, browser, 
                referrer, UTM source, UTM medium, UTM campaign
              </p>
            </div>
          </div>

          <ProTip>
            Combine multiple filters to find specific click patterns. For example, filter by "Mobile" + "United States" + "Instagram" to see US mobile traffic from Instagram.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Click timing insights</h2>
          <div className="flex items-start gap-3 mb-4">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                The timing heatmap shows when your links get the most engagement. Use this to 
                optimize send times for emails, social posts, and campaigns.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Exporting click data</h2>
          <div className="flex items-start gap-3 mb-4">
            <Download className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Export your click data as CSV or Excel for further analysis:
              </p>
            </div>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Apply any desired filters</li>
            <li>Click the <strong>Export</strong> button</li>
            <li>Choose your format (CSV or Excel)</li>
            <li>Download includes all visible columns</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Total vs. unique clicks</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Total clicks</h4>
              <p className="text-sm text-zinc-600">
                Every single click, including repeat visitors. Shows raw engagement volume.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Unique clicks</h4>
              <p className="text-sm text-zinc-600">
                Deduplicated by device fingerprint. Shows actual reach and individual visitors.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Privacy note:</strong> utm.one uses privacy-respecting fingerprinting that doesn't 
              rely on cookies. We never store personal identifiers—only aggregate patterns.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default ClickTracking;
