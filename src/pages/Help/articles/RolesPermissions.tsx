import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Edit, Trash2 } from "lucide-react";

const RolesPermissions = () => {
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
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Roles & permissions</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Control what team members can see and do in your workspace.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Role overview</h2>
          <p className="text-zinc-600 mb-4">
            utm.one uses a simple role-based access control system with three levels:
          </p>
          
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Permission</th>
                  <th className="text-center p-3 font-medium text-zinc-900">Viewer</th>
                  <th className="text-center p-3 font-medium text-zinc-900">Editor</th>
                  <th className="text-center p-3 font-medium text-zinc-900">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">View links & analytics</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Create links</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Edit/delete links</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Manage campaigns</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Manage domains</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Invite team members</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Manage billing</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Manage integrations</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-zinc-300">—</td>
                  <td className="p-3 text-center text-green-600">✓</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Changing roles</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Team</strong></li>
            <li>Find the team member</li>
            <li>Click the role dropdown</li>
            <li>Select the new role</li>
            <li>Change takes effect immediately</li>
          </ol>

          <ProTip>
            Only Admins can change other members' roles. The workspace owner's role 
            cannot be changed—they're always an Admin.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Role descriptions</h2>
          
          <div className="space-y-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-zinc-400" />
                <h4 className="font-medium text-zinc-900">Viewer</h4>
              </div>
              <p className="text-sm text-zinc-600 mb-2">
                Best for stakeholders who need to see data but not make changes.
              </p>
              <ul className="text-sm text-zinc-500 space-y-1">
                <li>• View all links and campaigns</li>
                <li>• Access analytics dashboards</li>
                <li>• Export reports</li>
              </ul>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium text-zinc-900">Editor</h4>
              </div>
              <p className="text-sm text-zinc-600 mb-2">
                Best for marketing team members who create and manage links daily.
              </p>
              <ul className="text-sm text-zinc-500 space-y-1">
                <li>• Everything Viewers can do</li>
                <li>• Create, edit, and delete links</li>
                <li>• Manage campaigns and tags</li>
                <li>• Generate QR codes</li>
              </ul>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-zinc-900">Admin</h4>
              </div>
              <p className="text-sm text-zinc-600 mb-2">
                Best for team leads and ops who manage the workspace.
              </p>
              <ul className="text-sm text-zinc-500 space-y-1">
                <li>• Everything Editors can do</li>
                <li>• Invite and manage team members</li>
                <li>• Manage domains and integrations</li>
                <li>• Access billing and workspace settings</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Removing members</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Team</strong></li>
            <li>Find the team member</li>
            <li>Click the <Trash2 className="inline h-4 w-4" /> remove button</li>
            <li>Confirm removal</li>
          </ol>
          <p className="text-zinc-600 mb-4">
            Removed members immediately lose access. Their created links remain in the workspace.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Enterprise feature:</strong> Custom roles with granular permissions are 
              available on Enterprise plans.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default RolesPermissions;
