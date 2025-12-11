import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Shield, Lock, Key, Smartphone, FileText, Eye, Server, UserCheck } from "lucide-react";

const articles = [
  { title: "Two-factor authentication", description: "Enable TOTP-based 2FA with any authenticator app. Required for admin accounts.", href: "/help/articles/two-factor-auth", icon: Smartphone },
  { title: "Security keys (WebAuthn)", description: "Add hardware security keys like YubiKey for phishing-resistant authentication.", href: "/help/articles/security-keys", icon: Key },
  { title: "Audit logs", description: "See who did what and when. Track link creation, edits, deletions, and team changes for compliance.", href: "/help/articles/audit-logs", icon: FileText },
  { title: "Data privacy", description: "GDPR compliance, data processing agreement, right to deletion, and data export options.", href: "/help/articles/data-privacy", icon: Shield },
];

const Security = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Security & Privacy" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Security & Privacy</h1>
      <p className="text-lg text-zinc-500">Enterprise-grade security with encryption, compliance, and access controls.</p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} />
      ))}
    </div>
  </HelpLayout>
);

export default Security;
