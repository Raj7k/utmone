import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, RotateCcw, Calendar } from "lucide-react";

const LinkRotation = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/advanced" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <RotateCcw className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Link rotation</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Distribute traffic across multiple destinations using weighted rotation.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is link rotation?</h2>
          <p className="text-zinc-600 mb-4">
            Link rotation sends visitors to different URLs based on configurable weights. 
            Perfect for A/B testing, load balancing, or distributing leads.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example: Lead distribution</h4>
            <p className="text-sm text-zinc-600 mb-3">Single link: <code>utm.one/demo</code></p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">50%</span>
                <span className="text-zinc-600">→ calendly.com/sales-rep-1</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">30%</span>
                <span className="text-zinc-600">→ calendly.com/sales-rep-2</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">20%</span>
                <span className="text-zinc-600">→ calendly.com/sales-rep-3</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up rotation</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Open any link's detail page</li>
            <li>Click the <strong>Targeting</strong> tab</li>
            <li>Enable <strong>Link rotation</strong></li>
            <li>Add destination URLs with weights</li>
            <li>Ensure weights total 100%</li>
            <li>Save changes</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Use cases</h2>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>A/B testing:</strong> Test landing page variants (50/50 split)</li>
            <li><strong>Lead distribution:</strong> Balance leads across sales reps</li>
            <li><strong>Load balancing:</strong> Distribute traffic across servers</li>
            <li><strong>Multi-variant testing:</strong> Test multiple versions simultaneously</li>
          </ul>

          <ProTip>
            For statistical significance in A/B tests, run until you have at least 100 
            conversions per variant. Use our experiment tracker for proper analysis.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Rotation methods</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Weighted random</h4>
              <p className="text-sm text-zinc-600">
                Each visitor is randomly assigned based on weights. Over time, distribution 
                matches the configured percentages.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Sequential</h4>
              <p className="text-sm text-zinc-600">
                Visitors are assigned in order: first to URL 1, second to URL 2, etc. 
                Ensures exact distribution.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Sticky sessions</h2>
          <p className="text-zinc-600 mb-4">
            Enable sticky sessions to ensure returning visitors see the same destination:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Useful for consistent A/B test experiences</li>
            <li>Based on cookie or device fingerprint</li>
            <li>Can be disabled for pure random distribution</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Analytics</h2>
          <p className="text-zinc-600 mb-4">
            Track rotation performance in analytics:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Clicks by destination URL</li>
            <li>Actual distribution vs. configured weights</li>
            <li>Conversion rates per variant</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Pausing variants</h2>
          <p className="text-zinc-600 mb-4">
            Temporarily disable a rotation variant:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Click the pause icon next to the variant</li>
            <li>Traffic redistributes to remaining variants</li>
            <li>Click again to re-enable</li>
          </ol>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Pro feature:</strong> Link rotation is available on Growth plans and above.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default LinkRotation;
