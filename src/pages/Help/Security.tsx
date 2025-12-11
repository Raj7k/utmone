import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Shield, Lock, Key, Smartphone, FileText, Eye, Server, UserCheck } from "lucide-react";

const articles = [
  { title: "Data security overview", description: "AES-256 encryption at rest, TLS 1.3 in transit, SOC 2 compliance in progress. Your data is protected.", href: "/help/security#overview", icon: Shield },
  { title: "Encryption standards", description: "All sensitive data encrypted with AES-256. Encryption keys stored separately from data.", href: "/help/security#encryption", icon: Lock },
  { title: "GDPR compliance", description: "Data processing agreement, right to deletion, data export, and EU data residency options.", href: "/help/security#gdpr", icon: FileText },
  { title: "Link security", description: "Password protection, expiration dates, click limits. Control who can access your links.", href: "/help/security#links", icon: Eye },
  { title: "Security keys (WebAuthn)", description: "Add hardware security keys like YubiKey for phishing-resistant authentication.", href: "/help/security#webauthn", icon: Key },
  { title: "Two-factor authentication", description: "Enable TOTP-based 2FA with any authenticator app. Required for admin accounts.", href: "/help/security#2fa", icon: Smartphone },
  { title: "Session management", description: "View active sessions, revoke access remotely, set session timeout preferences.", href: "/help/security#sessions", icon: UserCheck },
  { title: "Infrastructure security", description: "Multi-region deployment, automatic failover, DDoS protection, and 99.99% uptime SLA.", href: "/help/security#infrastructure", icon: Server },
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
