import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { Users, UserCog, Settings } from "lucide-react";

const Team = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Team & Governance" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Team & Governance</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400">Manage workspaces, roles, permissions, approval workflows, and enterprise SSO.</p>
    </div>
    <div className="space-y-3">
      <ExpandableArticle
        title="Inviting team members"
        description="Send email invites to add colleagues to your workspace."
        icon={Users}
      >
        <h3>How to invite</h3>
        <ol>
          <li>Go to Settings → Team</li>
          <li>Click "Invite Member"</li>
          <li>Enter their email address</li>
          <li>Select their role</li>
          <li>Send the invitation</li>
        </ol>
        <h3>Invitation expiry</h3>
        <p>Invitations expire after 7 days. You can resend from the pending invitations list.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Roles & permissions"
        description="Admin, Editor, Viewer—assign based on responsibility."
        icon={UserCog}
      >
        <h3>Available roles</h3>
        <p><strong>Admin</strong> — Full access to all features, settings, and team management. Can invite/remove members and manage billing.</p>
        <p><strong>Editor</strong> — Create, edit, and delete links. Access all analytics. Cannot manage team or billing.</p>
        <p><strong>Viewer</strong> — View analytics only. Cannot create or edit links. Perfect for stakeholders who need reporting access.</p>
        <h3>Changing roles</h3>
        <p>Admins can change any member's role from Settings → Team.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Workspace settings"
        description="Configure default domains, UTM templates, and team-wide defaults."
        icon={Settings}
      >
        <h3>General settings</h3>
        <ul>
          <li><strong>Workspace name</strong> — Display name for your team</li>
          <li><strong>Default domain</strong> — Which domain to use for new links</li>
          <li><strong>Timezone</strong> — For analytics and scheduling</li>
        </ul>
        <h3>Link defaults</h3>
        <ul>
          <li>Default UTM parameters</li>
          <li>Default expiration settings</li>
          <li>Require UTM parameters on all links</li>
        </ul>
        <h3>Governance settings</h3>
        <ul>
          <li>UTM validation rules</li>
          <li>Approval workflows</li>
          <li>Restricted slugs</li>
        </ul>
      </ExpandableArticle>
    </div>

    <FeatureAvailability
      feature="Team Management"
      availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
    />
  </HelpLayout>
);

export default Team;
