import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Users, Settings } from "lucide-react";

const WorkspaceSettings = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/team" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Building2 className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Workspace settings</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Configure your workspace name, defaults, and team-wide settings.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Accessing settings</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Click <strong>Settings</strong> in the sidebar</li>
            <li>Select <strong>Workspace</strong> from the menu</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">General settings</h2>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="space-y-4">
              <div>
                <p className="font-medium text-zinc-900">Workspace name</p>
                <p className="text-sm text-zinc-500">The name shown in the workspace switcher</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Workspace URL</p>
                <p className="text-sm text-zinc-500">Your workspace's unique identifier</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Default domain</p>
                <p className="text-sm text-zinc-500">Domain used for new links by default</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Timezone</p>
                <p className="text-sm text-zinc-500">Used for analytics and scheduled reports</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Link defaults</h2>
          <p className="text-zinc-600 mb-4">
            Set default values for new links:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Default UTM source:</strong> Pre-fill for all new links</li>
            <li><strong>Default UTM medium:</strong> Pre-fill for all new links</li>
            <li><strong>Link expiration:</strong> Default expiry period (e.g., 30 days)</li>
            <li><strong>Require UTMs:</strong> Force UTM parameters on all links</li>
          </ul>

          <ProTip>
            Setting workspace-wide UTM defaults ensures consistency across all team-created 
            links and reduces manual entry errors.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Governance settings</h2>
          <p className="text-zinc-600 mb-4">
            Control link creation and editing rules:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>UTM validation:</strong> Require specific UTM formats</li>
            <li><strong>Approval workflow:</strong> Require admin approval for new links</li>
            <li><strong>Slug rules:</strong> Enforce naming conventions for slugs</li>
            <li><strong>Domain restrictions:</strong> Limit which domains can be used</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Notification settings</h2>
          <p className="text-zinc-600 mb-4">
            Configure workspace-wide notifications:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Weekly digest:</strong> Summary email to all admins</li>
            <li><strong>Anomaly alerts:</strong> Pulse Watchdog notifications</li>
            <li><strong>Team activity:</strong> Notifications when team members make changes</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Danger zone</h2>
          <p className="text-zinc-600 mb-4">
            Destructive actions require extra confirmation:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-6">
            <ul className="text-sm text-red-800 space-y-2">
              <li><strong>Transfer ownership:</strong> Give another admin full control</li>
              <li><strong>Export all data:</strong> Download all links and analytics</li>
              <li><strong>Delete workspace:</strong> Permanently remove workspace and all data</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Multiple workspaces</h2>
          <p className="text-zinc-600 mb-4">
            You can be a member of multiple workspaces:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Switch between workspaces using the dropdown in the header</li>
            <li>Each workspace has separate links, team, and billing</li>
            <li>Your role may differ across workspaces</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default WorkspaceSettings;
