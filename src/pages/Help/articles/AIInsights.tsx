import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

const AIInsights = () => {
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
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">AI insights</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Let AI analyze your data and surface actionable insights you might have missed.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What AI insights does</h2>
          <p className="text-zinc-600 mb-4">
            utm.one's AI continuously analyzes your link performance data to find patterns, 
            anomalies, and opportunities. Instead of manually digging through reports, you 
            get proactive recommendations.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-4">Types of insights</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Performance patterns</p>
                  <p className="text-sm text-zinc-500">"Your links get 3x more clicks on Tuesdays at 10am"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Anomaly detection</p>
                  <p className="text-sm text-zinc-500">"Traffic from India spiked 500% today—investigate?"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Optimization suggestions</p>
                  <p className="text-sm text-zinc-500">"LinkedIn drives 40% of clicks but only 5% of conversions"</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Accessing AI insights</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Navigate to <strong>Intelligence → Overview</strong></li>
            <li>Look for the <strong>AI Insights</strong> card</li>
            <li>Review the list of current insights</li>
            <li>Click any insight to see details and recommended actions</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Example insights</h2>
          <div className="space-y-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Best performing campaign</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Your "spring-sale" campaign has a 12% click-through rate—2x higher than 
                    your average. Consider applying similar messaging to other campaigns.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-100 rounded">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Potential bot traffic detected</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    23% of clicks on "promo-link" come from a single IP range in 
                    Russia. This may be bot traffic affecting your metrics.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Timing optimization</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Your audience is most active between 2-4pm EST. Consider scheduling 
                    your email sends and social posts during this window.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ProTip>
            AI insights improve over time as it learns your specific patterns. The more data 
            you have, the more accurate and useful the insights become.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Acting on insights</h2>
          <p className="text-zinc-600 mb-4">
            Each insight includes actionable next steps:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>View data:</strong> Jump directly to the relevant analytics view</li>
            <li><strong>Create campaign:</strong> Apply learnings to a new campaign</li>
            <li><strong>Set alert:</strong> Monitor this pattern going forward</li>
            <li><strong>Dismiss:</strong> Hide insights that aren't relevant to you</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Insight frequency</h2>
          <p className="text-zinc-600 mb-4">
            AI analyzes your data continuously and surfaces new insights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Real-time:</strong> Anomalies and sudden changes</li>
            <li><strong>Daily:</strong> Performance summaries and trends</li>
            <li><strong>Weekly:</strong> Strategic recommendations and patterns</li>
            <li><strong>Monthly:</strong> Long-term trends and benchmarks</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Privacy & data usage</h2>
          <p className="text-zinc-600 mb-4">
            AI insights are powered by Lovable AI and only analyze your workspace's data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Your data is never shared with other workspaces</li>
            <li>Analysis happens on aggregate patterns, not individual clicks</li>
            <li>No personal user data is used in AI processing</li>
            <li>You can disable AI insights in workspace settings</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> AI insights require at least 100 clicks to generate 
              meaningful patterns. New workspaces will see their first insights after 
              reaching this threshold.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default AIInsights;
