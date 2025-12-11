import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const TeamRoles = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Team & Governance", href: "/help/team" },
          { label: "Roles & Permissions" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Roles & Permissions</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Control who can do what in your workspace with role-based access control. 
          Assign the right level of access to each team member.
        </p>

        <FeatureAvailability tier="starter" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Available Roles</h2>
        
        <div className="space-y-6 mb-8">
          <div className="border border-zinc-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-zinc-900 text-lg">Owner</h3>
              <span className="text-xs bg-zinc-900 text-white px-2 py-1 rounded">1 per workspace</span>
            </div>
            <p className="text-zinc-600 mb-4">
              Full control over the workspace. Can manage billing, delete the workspace, 
              transfer ownership, and configure all settings.
            </p>
            <div className="text-sm text-zinc-500">
              Typically: Founder, Marketing Director, or Account Owner
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <h3 className="font-semibold text-zinc-900 text-lg mb-3">Admin</h3>
            <p className="text-zinc-600 mb-4">
              Can manage team members, configure integrations, create/edit/delete all links, 
              and access all analytics. Cannot manage billing or delete workspace.
            </p>
            <div className="text-sm text-zinc-500">
              Typically: Marketing Manager, Team Lead, Operations Manager
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <h3 className="font-semibold text-zinc-900 text-lg mb-3">Editor</h3>
            <p className="text-zinc-600 mb-4">
              Can create new links, edit their own links, generate QR codes, and view analytics. 
              Cannot delete others' links or manage team settings.
            </p>
            <div className="text-sm text-zinc-500">
              Typically: Marketing Specialist, Campaign Manager, Content Creator
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <h3 className="font-semibold text-zinc-900 text-lg mb-3">Viewer</h3>
            <p className="text-zinc-600 mb-4">
              Read-only access to links and analytics. Cannot create, edit, or delete anything. 
              Perfect for executives or stakeholders who need visibility.
            </p>
            <div className="text-sm text-zinc-500">
              Typically: Executive, Client, External Partner, Auditor
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Permission Matrix</h2>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
            <thead className="bg-zinc-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-zinc-900">Permission</th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-900">Viewer</th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-900">Editor</th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-900">Admin</th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-900">Owner</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600">
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">View links</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">View analytics</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Create links</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Edit own links</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Edit all links</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Delete links</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">Own only</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Invite members</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Remove members</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Manage integrations</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">View audit logs</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Manage billing</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="py-3 px-4">Transfer ownership</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ProTip>
          Start with the most restrictive role that allows someone to do their job. 
          It's easier to grant more access later than to revoke it.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Changing Roles</h2>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Go to <strong>Settings → Team</strong></li>
          <li>Find the team member you want to modify</li>
          <li>Click the role dropdown next to their name</li>
          <li>Select the new role</li>
          <li>Changes take effect immediately</li>
        </ol>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Transferring Ownership</h2>
        <p className="text-zinc-600 mb-4">
          To transfer workspace ownership to another member:
        </p>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>The new owner must already be an Admin</li>
          <li>Go to <strong>Settings → Workspace → Danger Zone</strong></li>
          <li>Click "Transfer Ownership"</li>
          <li>Select the new owner from the dropdown</li>
          <li>Confirm with your password</li>
        </ol>
        <p className="text-zinc-600 text-sm mb-6">
          <strong>Note:</strong> After transfer, you'll be demoted to Admin. This action cannot be undone without the new owner's consent.
        </p>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Approval Workflows</h2>
        <p className="text-zinc-600 mb-4">
          On Business and Enterprise plans, you can require approval before links go live:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Editors submit links for approval</li>
          <li>Admins and Owners review and approve/reject</li>
          <li>Links remain in "Pending" status until approved</li>
          <li>Rejection includes feedback for the creator</li>
        </ul>

        <RelatedArticles
          articles={[
            { title: "Inviting Team Members", href: "/help/team/invite-members" },
            { title: "Workspaces Explained", href: "/help/team/workspaces" },
            { title: "Approval Workflows", href: "/help/team/approval-workflows" },
            { title: "Audit Logs", href: "/help/team/audit-logs" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default TeamRoles;
