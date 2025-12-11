import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Users, Mail, Shield } from "lucide-react";

const InvitingMembers = () => {
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
              <UserPlus className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Inviting team members</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Add colleagues to your workspace to collaborate on links and campaigns.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Sending invitations</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Team</strong></li>
            <li>Click <strong>Invite member</strong></li>
            <li>Enter their email address</li>
            <li>Select their role (Admin, Editor, or Viewer)</li>
            <li>Click <strong>Send invitation</strong></li>
          </ol>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-900">Invitation email</p>
                <p className="text-sm text-zinc-500 mt-1">
                  The invitee will receive an email with a link to join your workspace. 
                  The link expires in 7 days.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Roles</h2>
          <div className="space-y-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-zinc-900">Admin</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Full access. Can manage team, billing, integrations, and all links.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium text-zinc-900">Editor</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Can create, edit, and delete links. Cannot access billing or team settings.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-zinc-400" />
                <h4 className="font-medium text-zinc-900">Viewer</h4>
              </div>
              <p className="text-sm text-zinc-600">
                Read-only access. Can view links and analytics but cannot make changes.
              </p>
            </div>
          </div>

          <ProTip>
            Give team members the minimum role they need. You can always upgrade their 
            permissions later.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Bulk invitations</h2>
          <p className="text-zinc-600 mb-4">
            Invite multiple people at once:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Click <strong>Invite multiple</strong></li>
            <li>Enter email addresses (one per line or comma-separated)</li>
            <li>Select a role for all invitees</li>
            <li>Click <strong>Send invitations</strong></li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Pending invitations</h2>
          <p className="text-zinc-600 mb-4">
            View and manage pending invitations:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>See who hasn't accepted yet</li>
            <li>Resend invitation emails</li>
            <li>Revoke invitations before they're accepted</li>
            <li>View invitation expiry dates</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Team member limits</h2>
          <p className="text-zinc-600 mb-4">
            Team size depends on your plan:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Plan</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Team members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">Free</td>
                  <td className="p-3 text-zinc-600">1 (owner only)</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Starter</td>
                  <td className="p-3 text-zinc-600">2</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Growth</td>
                  <td className="p-3 text-zinc-600">5</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Business</td>
                  <td className="p-3 text-zinc-600">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-zinc-600 mb-4">
            Need more seats? You can purchase additional team member add-ons or upgrade your plan.
          </p>
        </div>
      </div>
    </HelpLayout>
  );
};

export default InvitingMembers;
