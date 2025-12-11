import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const AccountSettings = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Getting Started", href: "/help/getting-started" }, { label: "Account settings" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Account settings</h1>
      <p className="lead text-lg text-zinc-500">Manage your profile, security, notifications, and connected accounts.</p>
      
      <h2>Profile settings</h2>
      <ul>
        <li><strong>Display name</strong> — How you appear to teammates</li>
        <li><strong>Email</strong> — Your login email and notification address</li>
        <li><strong>Avatar</strong> — Upload a profile photo</li>
        <li><strong>Timezone</strong> — Used for scheduling and time-based analytics</li>
      </ul>
      
      <h2>Security settings</h2>
      <ul>
        <li><strong>Password</strong> — Change your login password</li>
        <li><strong>Two-factor authentication</strong> — Enable 2FA for extra security</li>
        <li><strong>Security keys</strong> — Add hardware keys like YubiKey</li>
        <li><strong>Active sessions</strong> — View and revoke device access</li>
      </ul>
      
      <h2>Notification preferences</h2>
      <ul>
        <li><strong>Email notifications</strong> — Choose which alerts you receive</li>
        <li><strong>Pulse Watchdog</strong> — Traffic anomaly alerts</li>
        <li><strong>Team updates</strong> — When teammates create or edit links</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Two-factor authentication", href: "/help/articles/two-factor-auth" },
      { title: "Session management", href: "/help/articles/session-management" },
    ]} />
  </HelpLayout>
);

export default AccountSettings;
