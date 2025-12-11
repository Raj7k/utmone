import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Users, Building2, Shield, Clock, FileText, Key, UserCog, Settings, CheckSquare, Lock } from "lucide-react";

const articles = [
  { title: "Inviting team members", description: "Send email invites to add colleagues. They'll create an account and automatically join your workspace.", href: "/help/articles/inviting-members", icon: Users },
  { title: "Roles & permissions", description: "Admin (full access), Editor (create/edit links), Viewer (analytics only). Assign based on responsibility.", href: "/help/articles/roles-permissions", icon: UserCog },
  { title: "Workspace settings", description: "Configure default domains, UTM templates, notification preferences, and team-wide defaults.", href: "/help/articles/workspace-settings", icon: Settings },
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
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} />
      ))}
    </div>
  </HelpLayout>
);

export default Team;
