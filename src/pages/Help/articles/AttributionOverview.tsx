import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, TrendingUp, DollarSign, GitBranch } from "lucide-react";

const AttributionOverview = () => {
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
              <Target className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Attribution overview</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Understand which marketing touchpoints drive your conversions and revenue.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is attribution?</h2>
          <p className="text-zinc-600 mb-4">
            Attribution answers the question: "Which marketing efforts actually drove this sale?" 
            When a customer converts, attribution helps you understand all the touchpoints they 
            interacted with on their journey.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example customer journey</h4>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">LinkedIn Ad</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Blog Post</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Email</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">Demo</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-zinc-900 text-white px-3 py-1 rounded-full">Sale!</span>
            </div>
            <p className="text-sm text-zinc-500 mt-3">
              Which touchpoint gets credit? Attribution models help answer this.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Why attribution matters</h2>
          <p className="text-zinc-600 mb-4">
            Without proper attribution, you're flying blind:
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Wasted budget:</strong> Spending money on channels that don't convert</li>
            <li><strong>Missed opportunities:</strong> Under-investing in channels that do work</li>
            <li><strong>Wrong conclusions:</strong> Last-click attribution ignores the full journey</li>
            <li><strong>Team conflicts:</strong> Every team claims credit for the same sale</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">utm.one's approach</h2>
          <p className="text-zinc-600 mb-4">
            utm.one uses Clean Track Intelligence™ to provide accurate, multi-touch attribution:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <TrendingUp className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Multi-touch tracking</h4>
              <p className="text-sm text-zinc-600">
                Track every touchpoint across the customer journey, not just the last click.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <DollarSign className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Revenue attribution</h4>
              <p className="text-sm text-zinc-600">
                Connect clicks to actual revenue, not just conversion counts.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <GitBranch className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Multiple models</h4>
              <p className="text-sm text-zinc-600">
                Choose from first-touch, last-touch, linear, or data-driven models.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Target className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Cross-device</h4>
              <p className="text-sm text-zinc-600">
                Track users across devices with privacy-respecting identity resolution.
              </p>
            </div>
          </div>

          <ProTip>
            Start with the "Position-based" attribution model. It gives 40% credit to first touch, 
            40% to last touch, and 20% split among middle touches—a balanced view of your funnel.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Getting started</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Ensure all your marketing links use utm.one short links</li>
            <li>Install the utm.one tracking pixel on your site</li>
            <li>Set up conversion events (form submissions, purchases, etc.)</li>
            <li>Navigate to <strong>Intelligence → Attribution</strong></li>
            <li>Choose your attribution model and analyze</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Next steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/attribution-models" className="block p-4 bg-white border border-zinc-200 rounded-xl hover:border-amber-300 transition-colors">
              <h4 className="font-medium text-zinc-900 mb-1">Attribution models</h4>
              <p className="text-sm text-zinc-500">Compare first-touch, last-touch, linear, and more</p>
            </Link>
            <Link to="/help/articles/tracking-pixel" className="block p-4 bg-white border border-zinc-200 rounded-xl hover:border-amber-300 transition-colors">
              <h4 className="font-medium text-zinc-900 mb-1">Tracking pixel setup</h4>
              <p className="text-sm text-zinc-500">Install the pixel for full journey tracking</p>
            </Link>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default AttributionOverview;
