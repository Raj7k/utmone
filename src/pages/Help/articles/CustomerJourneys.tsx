import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Route, Users, Eye } from "lucide-react";

const CustomerJourneys = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link 
          to="/help/attribution" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Attribution
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Route className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Customer journeys</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Visualize the complete path customers take from first touch to conversion.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Understanding journeys</h2>
          <p className="text-zinc-600 mb-4">
            A customer journey is the sequence of touchpoints a visitor experiences before 
            converting. utm.one tracks every interaction to show you the complete picture.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example journey</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">1</div>
                <div>
                  <p className="font-medium text-zinc-900">LinkedIn Ad Click</p>
                  <p className="text-sm text-zinc-500">Day 1 • utm_source=linkedin • utm_medium=paid</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-700">2</div>
                <div>
                  <p className="font-medium text-zinc-900">Blog Article Visit</p>
                  <p className="text-sm text-zinc-500">Day 3 • Organic search • "best utm tools"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-700">3</div>
                <div>
                  <p className="font-medium text-zinc-900">Email Newsletter Click</p>
                  <p className="text-sm text-zinc-500">Day 7 • utm_source=email • utm_campaign=weekly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-medium text-amber-700">4</div>
                <div>
                  <p className="font-medium text-zinc-900">Conversion: Pro Plan Purchase</p>
                  <p className="text-sm text-zinc-500">Day 10 • $149/month • Order #12345</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing journeys</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Attribution</strong></li>
            <li>Select the <strong>Journey</strong> tab</li>
            <li>Browse recent customer journeys</li>
            <li>Click any journey to see full detail</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Journey visualization</h2>
          <p className="text-zinc-600 mb-4">
            utm.one offers multiple ways to visualize journeys:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Timeline view</h4>
              <p className="text-sm text-zinc-600">
                Chronological list of touchpoints with timestamps, channels, and campaigns.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Sankey diagram</h4>
              <p className="text-sm text-zinc-600">
                Flow visualization showing how traffic moves through your funnel.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Path analysis</h4>
              <p className="text-sm text-zinc-600">
                Common paths that lead to conversion, ranked by frequency.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Funnel view</h4>
              <p className="text-sm text-zinc-600">
                Stage-by-stage conversion rates and drop-off points.
              </p>
            </div>
          </div>

          <ProTip>
            Look for "Golden Paths"—journey patterns with the highest conversion rates. 
            Then optimize your marketing to drive more traffic through those paths.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Journey metrics</h2>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-zinc-900">Average touchpoints</p>
                <p className="text-sm text-zinc-500">How many interactions before conversion</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Average time to convert</p>
                <p className="text-sm text-zinc-500">Days from first touch to conversion</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Top entry channels</p>
                <p className="text-sm text-zinc-500">Where converting journeys begin</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Top closing channels</p>
                <p className="text-sm text-zinc-500">What triggers the final conversion</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Filtering journeys</h2>
          <p className="text-zinc-600 mb-4">
            Narrow down journeys to find specific patterns:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>By conversion type:</strong> Purchases, signups, leads</li>
            <li><strong>By channel:</strong> Journeys that include specific channels</li>
            <li><strong>By campaign:</strong> Journeys from specific campaigns</li>
            <li><strong>By length:</strong> Short vs. long journeys</li>
            <li><strong>By revenue:</strong> High-value vs. low-value conversions</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Cross-device journeys</h2>
          <div className="flex items-start gap-3 mb-4">
            <Users className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                utm.one's Identity Graph stitches together touchpoints across devices. A visitor 
                who clicks your ad on mobile, then converts on desktop, appears as one journey.
              </p>
            </div>
          </div>
          <Link 
            to="/help/articles/identity-graph" 
            className="inline-flex items-center gap-2 text-amber-600 hover:underline"
          >
            Learn about Identity Graph →
          </Link>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Acting on journey insights</h2>
          <p className="text-zinc-600 mb-4">
            Use journey data to optimize your marketing:
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Long journeys:</strong> Consider retargeting to shorten the path</li>
            <li><strong>High drop-off:</strong> Improve content at that stage</li>
            <li><strong>Channel gaps:</strong> Add touchpoints where journeys stall</li>
            <li><strong>Successful paths:</strong> Invest more in channels on winning journeys</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default CustomerJourneys;
