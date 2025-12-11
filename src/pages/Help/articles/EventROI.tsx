import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Calculator, TrendingUp } from "lucide-react";

const EventROI = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/events" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Event ROI calculation</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Measure the true return on investment from your field marketing events.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">The ROI formula</h2>
          <p className="text-zinc-600 mb-4">
            utm.one calculates event ROI using both direct and halo impact:
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-zinc-900">Total Event Value</p>
                <p className="text-zinc-600">= (Badge Scans + Halo Visitors) × Conversion Rate × Avg Deal Value</p>
              </div>
              <div className="border-t border-zinc-200 pt-4">
                <p className="font-medium text-zinc-900">Event ROI</p>
                <p className="text-zinc-600">= (Total Event Value - Event Cost) / Event Cost × 100%</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up ROI tracking</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Open your event in utm.one</li>
            <li>Go to <strong>Event Settings</strong></li>
            <li>Enter your <strong>Event Budget</strong> (total cost)</li>
            <li>Configure <strong>Average Deal Value</strong></li>
            <li>Set expected <strong>Conversion Rate</strong></li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Value settings</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Calculator className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Average deal value</h4>
              <p className="text-sm text-zinc-600">
                Your typical contract size. Use historical data or ask sales for the number.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <TrendingUp className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Conversion rate</h4>
              <p className="text-sm text-zinc-600">
                What % of event leads become customers? Usually 5-15% for B2B.
              </p>
            </div>
          </div>

          <ProTip>
            If you're unsure about conversion rates, start with industry averages (10% for B2B SaaS). 
            Update as you gather real data from events.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Understanding the numbers</h2>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-4">Example calculation</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Badge scans (direct leads)</span>
                <span className="font-medium">200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Halo visitors (Event Halo detected)</span>
                <span className="font-medium">1,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Total reached</span>
                <span className="font-medium">1,600</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">× Conversion rate (10%)</span>
                <span className="font-medium">160 deals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">× Average deal value ($10,000)</span>
                <span className="font-medium text-green-600">$1,600,000</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between">
                <span className="text-zinc-600">Event cost</span>
                <span className="font-medium">$50,000</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span className="font-medium">ROI</span>
                <span className="font-medium">3,100%</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Using inferred values</h2>
          <p className="text-zinc-600 mb-4">
            utm.one can infer deal value and conversion rate from your historical data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Enable "Use inferred values" in event settings</li>
            <li>System analyzes past events and conversion tracking</li>
            <li>Automatically calculates data-driven estimates</li>
            <li>Override manually anytime if needed</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Pipeline vs. revenue</h2>
          <p className="text-zinc-600 mb-4">
            utm.one reports both pipeline and revenue metrics:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-1">Attributed pipeline</h4>
              <p className="text-sm text-zinc-600">
                Total potential value of leads generated (before conversion)
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-1">Attributed revenue</h4>
              <p className="text-sm text-zinc-600">
                Actual closed deals from event leads (after conversion tracking)
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Presenting to leadership</h2>
          <p className="text-zinc-600 mb-4">
            When sharing event ROI with executives:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Lead with the ROI number and total pipeline generated</li>
            <li>Show the halo effect—the invisible 90% most miss</li>
            <li>Compare to control city to prove causation</li>
            <li>Export the PDF report for slides</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default EventROI;
