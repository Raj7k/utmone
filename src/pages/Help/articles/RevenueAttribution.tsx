import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, TrendingUp, PieChart } from "lucide-react";

const RevenueAttribution = () => {
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
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Revenue attribution</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Connect your marketing efforts directly to revenue and calculate true ROI.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Why revenue attribution matters</h2>
          <p className="text-zinc-600 mb-4">
            Counting conversions isn't enough. You need to know which channels drive the 
            highest-value customers and the best return on ad spend.
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">The problem with conversion counting</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">LinkedIn: 50 conversions</span>
                <span className="text-zinc-400">vs</span>
                <span className="text-zinc-600">Twitter: 100 conversions</span>
              </div>
              <p className="text-zinc-500">Looks like Twitter wins, right?</p>
              <div className="border-t border-zinc-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-900 font-medium">LinkedIn: $50,000 revenue</span>
                  <span className="text-zinc-400">vs</span>
                  <span className="text-zinc-900 font-medium">Twitter: $10,000 revenue</span>
                </div>
                <p className="text-zinc-600 mt-2">LinkedIn drives 5x more revenue per conversion!</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up revenue tracking</h2>
          <p className="text-zinc-600 mb-4">
            Revenue attribution requires tracking purchase events with values:
          </p>
          <div className="bg-zinc-900 rounded-xl p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-zinc-100">
{`// Track purchase with revenue
window.utm.track('purchase', {
  revenue: 149.99,
  currency: 'USD',
  order_id: 'ORD-12345'
});`}
            </pre>
          </div>

          <ProTip>
            For subscription businesses, track the first payment amount. You can later enrich 
            with lifetime value data through the API.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Revenue metrics</h2>
          <p className="text-zinc-600 mb-4">
            utm.one calculates key revenue metrics automatically:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <DollarSign className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Total attributed revenue</h4>
              <p className="text-sm text-zinc-600">
                Sum of all revenue from conversions attributed to your links.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <PieChart className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Revenue by channel</h4>
              <p className="text-sm text-zinc-600">
                Revenue broken down by source, medium, and campaign.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <TrendingUp className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Revenue per click</h4>
              <p className="text-sm text-zinc-600">
                Average revenue generated per link click.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <DollarSign className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Average order value</h4>
              <p className="text-sm text-zinc-600">
                Average revenue per conversion, by channel.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing revenue data</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Attribution</strong></li>
            <li>View the <strong>Revenue</strong> card at the top</li>
            <li>See total attributed revenue and period comparison</li>
            <li>Click <strong>View by channel</strong> for breakdown</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Revenue attribution models</h2>
          <p className="text-zinc-600 mb-4">
            Revenue can be attributed using the same models as conversions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>First-touch:</strong> 100% of revenue to first touchpoint</li>
            <li><strong>Last-touch:</strong> 100% of revenue to last touchpoint</li>
            <li><strong>Linear:</strong> Revenue split equally across all touchpoints</li>
            <li><strong>Position-based:</strong> 40% first, 40% last, 20% middle</li>
          </ul>
          <p className="text-zinc-600 mb-4">
            For a $100 sale with 4 touchpoints using position-based:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 my-6">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="bg-amber-200 px-3 py-1 rounded">LinkedIn: $40</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-amber-100 px-3 py-1 rounded">Blog: $10</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-amber-100 px-3 py-1 rounded">Email: $10</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-amber-200 px-3 py-1 rounded">Direct: $40</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">ROI calculation</h2>
          <p className="text-zinc-600 mb-4">
            With revenue data, you can calculate true channel ROI:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <p className="text-sm text-zinc-600 mb-3">
              <strong>Formula:</strong> ROI = (Attributed Revenue - Ad Spend) / Ad Spend × 100
            </p>
            <div className="text-sm text-zinc-600">
              <p><strong>Example:</strong></p>
              <p>LinkedIn ad spend: $1,000</p>
              <p>Attributed revenue: $5,000</p>
              <p className="text-amber-600 font-medium mt-2">ROI = ($5,000 - $1,000) / $1,000 × 100 = 400%</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Multi-currency support</h2>
          <p className="text-zinc-600 mb-4">
            utm.one supports revenue tracking in any currency:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Track transactions in their native currency</li>
            <li>Automatic conversion to your reporting currency</li>
            <li>Daily exchange rate updates</li>
            <li>Set default currency in workspace settings</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Enterprise feature:</strong> Import ad spend data automatically from 
              Google Ads, Facebook, LinkedIn, and other platforms for automated ROI calculation.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default RevenueAttribution;
