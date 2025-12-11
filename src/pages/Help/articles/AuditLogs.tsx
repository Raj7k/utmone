import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Search, Download } from "lucide-react";

const AuditLogs = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/security" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Security
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Audit logs</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Track all actions in your workspace for security and compliance.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What's logged</h2>
          <p className="text-zinc-600 mb-4">
            Audit logs capture all significant actions in your workspace:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-zinc-900 mb-2">Link actions</p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Link created</li>
                  <li>• Link edited</li>
                  <li>• Link deleted</li>
                  <li>• Destination changed</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900 mb-2">Team actions</p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Member invited</li>
                  <li>• Member removed</li>
                  <li>• Role changed</li>
                  <li>• Invitation accepted</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900 mb-2">Security actions</p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Login attempt</li>
                  <li>• 2FA enabled/disabled</li>
                  <li>• API key created</li>
                  <li>• Password changed</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900 mb-2">Settings actions</p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Domain added/removed</li>
                  <li>• Integration connected</li>
                  <li>• Workspace settings changed</li>
                  <li>• Plan upgraded/downgraded</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing audit logs</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Security → Audit Log</strong></li>
            <li>Browse the chronological list of events</li>
            <li>Use filters to narrow down results</li>
            <li>Click any event for full details</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Event details</h2>
          <p className="text-zinc-600 mb-4">
            Each audit log entry includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Timestamp:</strong> When the action occurred (UTC)</li>
            <li><strong>Actor:</strong> Who performed the action</li>
            <li><strong>Action:</strong> What was done</li>
            <li><strong>Resource:</strong> What was affected</li>
            <li><strong>IP address:</strong> Where the action originated</li>
            <li><strong>Changes:</strong> Before/after values (when applicable)</li>
          </ul>

          <ProTip>
            Use audit logs to investigate security incidents. If a link was unexpectedly 
            changed, you can see exactly who changed it and when.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Filtering logs</h2>
          <div className="flex items-start gap-3 mb-4">
            <Search className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Filter audit logs by:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Date range:</strong> Last 24h, 7d, 30d, or custom</li>
            <li><strong>Actor:</strong> Filter by specific team member</li>
            <li><strong>Action type:</strong> Create, update, delete, etc.</li>
            <li><strong>Resource type:</strong> Links, team, settings, etc.</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Exporting logs</h2>
          <div className="flex items-start gap-3 mb-4">
            <Download className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Export audit logs for compliance or investigation:
              </p>
            </div>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Apply your desired filters</li>
            <li>Click <strong>Export</strong></li>
            <li>Choose format (CSV or JSON)</li>
            <li>Download the file</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Retention</h2>
          <p className="text-zinc-600 mb-4">
            Audit log retention varies by plan:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Plan</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">Free</td>
                  <td className="p-3 text-zinc-600">7 days</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Starter</td>
                  <td className="p-3 text-zinc-600">30 days</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Growth</td>
                  <td className="p-3 text-zinc-600">90 days</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Business</td>
                  <td className="p-3 text-zinc-600">1 year</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Enterprise</td>
                  <td className="p-3 text-zinc-600">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default AuditLogs;
