import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Repeat, Sparkles, BarChart3 } from "lucide-react";

const SmartRouting = () => {
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
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Smart routing</h1>
          </div>
          <p className="text-lg text-zinc-600">
            AI-powered routing that automatically optimizes for conversions.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is smart routing?</h2>
          <p className="text-zinc-600 mb-4">
            Smart routing uses AI to automatically direct visitors to the destination most 
            likely to convert them, based on their characteristics and historical performance.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">How it works</h4>
            <ol className="text-sm text-zinc-600 space-y-2">
              <li>1. AI analyzes visitor signals (device, location, referrer, time)</li>
              <li>2. Matches against historical conversion patterns</li>
              <li>3. Routes to highest-probability destination</li>
              <li>4. Continuously learns and improves</li>
            </ol>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up smart routing</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Create a link with multiple destination variants</li>
            <li>Enable <strong>Smart routing</strong> in targeting settings</li>
            <li>Set your conversion goal (purchase, signup, etc.)</li>
            <li>Let it learn from at least 100 conversions</li>
            <li>AI takes over optimization</li>
          </ol>

          <ProTip>
            Smart routing needs data to learn. Start with equal-weight rotation until you 
            have enough conversions, then switch to smart routing.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Signals used</h2>
          <p className="text-zinc-600 mb-4">
            The AI considers these visitor characteristics:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Device signals</h4>
              <ul className="text-sm text-zinc-600 space-y-1">
                <li>• Device type (mobile/desktop)</li>
                <li>• Operating system</li>
                <li>• Browser</li>
                <li>• Screen size</li>
              </ul>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Context signals</h4>
              <ul className="text-sm text-zinc-600 space-y-1">
                <li>• Country/region</li>
                <li>• Referrer source</li>
                <li>• Time of day</li>
                <li>• Day of week</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Learning mode</h2>
          <p className="text-zinc-600 mb-4">
            During the learning phase:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Traffic is distributed evenly to gather data</li>
            <li>AI builds conversion models for each segment</li>
            <li>You'll see "Learning" status in the dashboard</li>
            <li>Typically takes 1-2 weeks depending on traffic volume</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Optimization mode</h2>
          <p className="text-zinc-600 mb-4">
            Once learning is complete:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>AI routes visitors to optimal destinations</li>
            <li>Continues to test and validate decisions</li>
            <li>Adapts to changing patterns automatically</li>
            <li>Status changes to "Optimizing"</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Performance metrics</h2>
          <div className="flex items-start gap-3 mb-4">
            <BarChart3 className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Track smart routing performance in the analytics dashboard:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Lift:</strong> Improvement vs. random distribution</li>
            <li><strong>Confidence:</strong> Statistical confidence in routing decisions</li>
            <li><strong>Segment breakdown:</strong> Performance by visitor type</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">When to use smart routing</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>You have multiple landing page variants</li>
            <li>You're getting 100+ conversions per month</li>
            <li>You want hands-off optimization</li>
            <li>You have diverse traffic sources</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Enterprise feature:</strong> Smart routing is available on Business and Enterprise plans.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default SmartRouting;
