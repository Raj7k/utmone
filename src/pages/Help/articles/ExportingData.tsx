import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileSpreadsheet, FileText, Calendar } from "lucide-react";

const ExportingData = () => {
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
              <Download className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Exporting data</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Download your analytics data in various formats for reporting, analysis, or archiving.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Export formats</h2>
          <p className="text-zinc-600 mb-4">
            utm.one supports multiple export formats to fit your workflow:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-zinc-900">CSV</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Universal format. Opens in Excel, Google Sheets, or any data tool. Best for analysis.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-zinc-900">Excel (.xlsx)</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Native Excel format with formatting. Best for sharing with non-technical teams.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-amber-600" />
                <h4 className="font-medium text-zinc-900">JSON</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Structured data format. Best for developers and API integrations.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-zinc-900">PDF Report</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Formatted report with charts. Best for executive presentations.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Exporting click data</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Navigate to <strong>Intelligence</strong> or any link's detail page</li>
            <li>Apply any filters you want (date range, device, country, etc.)</li>
            <li>Click the <strong>Export</strong> button in the toolbar</li>
            <li>Select your preferred format</li>
            <li>Download starts automatically</li>
          </ol>

          <ProTip>
            Exports include all data matching your current filters. If you want all clicks, 
            make sure no filters are active before exporting.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What's included in exports</h2>
          <p className="text-zinc-600 mb-4">
            Click data exports include:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-1 text-zinc-600">
                <li>• Timestamp (UTC)</li>
                <li>• Short link URL</li>
                <li>• Destination URL</li>
                <li>• Device type</li>
                <li>• Browser</li>
                <li>• Operating system</li>
              </ul>
              <ul className="space-y-1 text-zinc-600">
                <li>• Country</li>
                <li>• City</li>
                <li>• Referrer</li>
                <li>• UTM source</li>
                <li>• UTM medium</li>
                <li>• UTM campaign</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Exporting link lists</h2>
          <p className="text-zinc-600 mb-4">
            You can also export your link library:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Links</strong> from the sidebar</li>
            <li>Apply any filters (campaign, status, date created)</li>
            <li>Click <strong>Export</strong></li>
            <li>Choose format</li>
          </ol>
          <p className="text-zinc-600 mb-4">
            Link exports include: short URL, destination URL, creation date, total clicks, 
            status, tags, and all UTM parameters.
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Scheduled reports</h2>
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Set up automatic report delivery on a schedule:
              </p>
            </div>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Reports</strong></li>
            <li>Click <strong>Create scheduled report</strong></li>
            <li>Choose report type and data to include</li>
            <li>Set frequency (daily, weekly, monthly)</li>
            <li>Add recipient email addresses</li>
            <li>Save and activate</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Data retention</h2>
          <p className="text-zinc-600 mb-4">
            Export limits and data availability vary by plan:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Plan</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Data retention</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Export limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">Free</td>
                  <td className="p-3 text-zinc-600">30 days</td>
                  <td className="p-3 text-zinc-600">1,000 rows</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Starter</td>
                  <td className="p-3 text-zinc-600">90 days</td>
                  <td className="p-3 text-zinc-600">10,000 rows</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Growth</td>
                  <td className="p-3 text-zinc-600">1 year</td>
                  <td className="p-3 text-zinc-600">100,000 rows</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Business</td>
                  <td className="p-3 text-zinc-600">Unlimited</td>
                  <td className="p-3 text-zinc-600">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> Need to export more data than your plan allows? Set up a scheduled 
              weekly export to incrementally backup your data, or upgrade to a higher tier.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default ExportingData;
