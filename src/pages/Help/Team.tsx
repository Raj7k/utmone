import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Users, Building2, Shield, Clock, FileText, Key, UserCog, Settings, CheckSquare, Lock } from "lucide-react";

const articles = [
  { title: "Workspaces explained", description: "Workspaces are separate environments for different teams or clients. Each has its own links, domains, and team members.", href: "/help/team#workspaces", icon: Building2 },
  { title: "Inviting team members", description: "Send email invites to add colleagues. They'll create an account and automatically join your workspace.", href: "/help/team#invite", icon: Users },
  { title: "Roles & permissions", description: "Admin (full access), Editor (create/edit links), Viewer (analytics only). Assign based on responsibility.", href: "/help/team#roles", icon: UserCog },
  { title: "Approval workflows", description: "Require admin approval before links go live. Perfect for regulated industries and brand governance.", href: "/help/team#approvals", icon: CheckSquare, tier: "business" },
  { title: "Audit logs", description: "See who did what and when. Track link creation, edits, deletions, and team changes for compliance.", href: "/help/team#audit", icon: FileText, tier: "business" },
  { title: "SSO (SAML) setup", description: "Connect to your identity provider for single sign-on. Okta, Azure AD, Google Workspace supported.", href: "/help/team#sso", icon: Key, tier: "enterprise" },
  { title: "White-label options", description: "Remove utm.one branding entirely. Custom login pages, emails, and dashboard appearance.", href: "/help/team#white-label", icon: Settings, tier: "enterprise" },
  { title: "Workspace settings", description: "Configure default domains, UTM templates, notification preferences, and team-wide defaults.", href: "/help/team#settings", icon: Settings },
  { title: "Data isolation", description: "Each workspace's data is completely isolated. Team members only see their own workspace's links and analytics.", href: "/help/team#isolation", icon: Shield },
  { title: "Access requests", description: "Users can request access to workspaces. Admins approve or deny from the team dashboard.", href: "/help/team#requests", icon: Lock },
];

const Team = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Team & Governance" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Team & Governance</h1>
      <p className="text-lg text-zinc-500">Manage workspaces, roles, permissions, approval workflows, and enterprise SSO.</p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} tier={article.tier as any} />
      ))}
    </div>
  </HelpLayout>
);

export default Team;
