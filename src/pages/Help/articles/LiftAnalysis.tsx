import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, BarChart3, Target } from "lucide-react";

const LiftAnalysis = () => {
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
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Lift analysis</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Measure the true incremental impact of your marketing campaigns.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is lift?</h2>
          <p className="text-zinc-600 mb-4">
            Lift measures the incremental impact of your marketing—the conversions that 
            wouldn't have happened without the campaign. It answers: "Did this campaign 
            actually cause more conversions, or would they have happened anyway?"
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">The lift calculation</h4>
            <div className="space-y-2 text-sm">
              <p className="text-zinc-600">Campaign conversions: 1,000</p>
              <p className="text-zinc-600">Baseline (would have converted anyway): 600</p>
              <p className="text-zinc-600 border-t border-zinc-200 pt-2">
                <strong>Incremental conversions:</strong> 400
              </p>
              <p className="text-amber-600 font-medium">Lift: +67%</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Why lift matters</h2>
          <p className="text-zinc-600 mb-4">
            Without lift analysis, you might think a campaign is successful when it's actually 
            just capturing organic conversions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Brand campaigns may convert users who would have searched anyway</li>
            <li>Retargeting often targets users already about to buy</li>
            <li>Email campaigns go to engaged users who'd return organically</li>
          </ul>

          <ProTip>
            A campaign with 1,000 conversions and 10% lift is less valuable than one with 
            100 conversions and 80% lift. Focus on incremental impact, not total volume.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How utm.one measures lift</h2>
          <p className="text-zinc-600 mb-4">
            utm.one uses Clean Track Intelligence™ to estimate lift through:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <BarChart3 className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Baseline modeling</h4>
              <p className="text-sm text-zinc-600">
                Compare against historical conversion rates without campaigns.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Target className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Control groups</h4>
              <p className="text-sm text-zinc-600">
                Compare exposed vs. unexposed user segments.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing lift data</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Advanced</strong></li>
            <li>Select <strong>Lift Analysis</strong></li>
            <li>Choose a campaign or channel to analyze</li>
            <li>View estimated lift and confidence intervals</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Understanding confidence</h2>
          <p className="text-zinc-600 mb-4">
            Lift estimates come with confidence ranges because attribution is probabilistic:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <p className="text-sm text-zinc-600 mb-2">
              <strong>Example:</strong> LinkedIn Campaign Lift
            </p>
            <p className="text-lg font-medium text-amber-600 mb-1">+45% lift</p>
            <p className="text-sm text-zinc-500">Confidence range: +38% to +52%</p>
            <p className="text-sm text-zinc-500 mt-2">
              95% confident that true lift is within this range.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Lift by channel</h2>
          <p className="text-zinc-600 mb-4">
            Different channels typically have different lift characteristics:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 font-medium text-zinc-900">Channel</th>
                  <th className="text-left py-2 font-medium text-zinc-900">Typical lift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="py-2 text-zinc-600">Brand search</td>
                  <td className="py-2 text-zinc-600">5-20% (users would likely search anyway)</td>
                </tr>
                <tr>
                  <td className="py-2 text-zinc-600">Non-brand search</td>
                  <td className="py-2 text-zinc-600">40-70% (capturing new intent)</td>
                </tr>
                <tr>
                  <td className="py-2 text-zinc-600">Social ads</td>
                  <td className="py-2 text-zinc-600">30-60% (awareness building)</td>
                </tr>
                <tr>
                  <td className="py-2 text-zinc-600">Retargeting</td>
                  <td className="py-2 text-zinc-600">10-30% (accelerating, not creating)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Acting on lift data</h2>
          <p className="text-zinc-600 mb-4">
            Use lift analysis to optimize your marketing mix:
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>High lift, low volume:</strong> Scale up—there's incremental headroom</li>
            <li><strong>Low lift, high volume:</strong> Consider reducing spend—diminishing returns</li>
            <li><strong>High lift, high volume:</strong> Your winners—protect this budget</li>
            <li><strong>Low lift, low volume:</strong> Test or cut—not moving the needle</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Lift analysis requires significant data volume to be 
              statistically meaningful. We recommend at least 500 conversions per channel.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default LiftAnalysis;
