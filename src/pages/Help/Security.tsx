import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { Shield, Lock, Key, Smartphone, FileText } from "lucide-react";

const Security = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Security & Privacy" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Security & Privacy</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400">Enterprise-grade security with encryption, compliance, and access controls.</p>
    </div>

    <ProTip>
      Enable two-factor authentication for all admin accounts. It's required for admin access on Business and Enterprise plans.
    </ProTip>

    <div className="space-y-3">
      <ExpandableArticle
        title="Two-factor authentication"
        description="Enable TOTP-based 2FA with any authenticator app."
        icon={Smartphone}
      >
        <h3>What is 2FA?</h3>
        <p>Two-factor authentication adds an extra layer of security by requiring both your password and a time-based code from your phone to sign in.</p>
        
        <h3>Supported methods</h3>
        <ul>
          <li><strong>Authenticator app</strong> — Google Authenticator, Authy, 1Password, etc.</li>
          <li><strong>Security key</strong> — YubiKey or other WebAuthn-compatible hardware keys</li>
        </ul>
        
        <h3>Setting up 2FA</h3>
        <ol>
          <li>Go to Settings → Security</li>
          <li>Click "Enable 2FA"</li>
          <li>Scan the QR code with your authenticator app</li>
          <li>Enter the verification code</li>
          <li>Save your backup codes securely</li>
        </ol>
        
        <h3>Backup codes</h3>
        <p>When you enable 2FA, you'll receive 10 single-use backup codes. Store these securely—they're your only way back in if you lose your authenticator.</p>
        
        <h3>Enterprise requirement</h3>
        <p>On Business and Enterprise plans, 2FA is required for all admin accounts.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Security keys (WebAuthn)"
        description="Add hardware security keys like YubiKey for phishing-resistant authentication."
        icon={Key}
      >
        <h3>What are security keys?</h3>
        <p>Hardware security keys provide phishing-resistant authentication. Even if someone has your password, they can't sign in without the physical key.</p>
        
        <h3>Supported keys</h3>
        <ul>
          <li>YubiKey 5 series</li>
          <li>Google Titan</li>
          <li>Any FIDO2/WebAuthn compatible key</li>
        </ul>
        
        <h3>Adding a security key</h3>
        <ol>
          <li>Go to Settings → Security</li>
          <li>Click "Add Security Key"</li>
          <li>Insert your key when prompted</li>
          <li>Touch the key to confirm</li>
          <li>Name your key for identification</li>
        </ol>
        
        <h3>Important note</h3>
        <p>Security keys are bound to the domain where they're registered. If your workspace URL changes, you'll need to re-register your keys.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Audit logs"
        description="See who did what and when. Track changes for compliance."
        icon={FileText}
      >
        <h3>What's logged</h3>
        <ul>
          <li>Link creation, editing, and deletion</li>
          <li>Team member invitations and role changes</li>
          <li>Settings changes</li>
          <li>API key creation and usage</li>
          <li>Sign-in attempts (successful and failed)</li>
        </ul>
        
        <h3>Viewing audit logs</h3>
        <ol>
          <li>Go to Settings → Security → Audit Logs</li>
          <li>Filter by date, user, or action type</li>
          <li>Export for compliance reports</li>
        </ol>
        
        <h3>Retention</h3>
        <p>Audit logs are retained for 1 year on Growth, 2 years on Business, and 7 years on Enterprise plans.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Data privacy"
        description="GDPR compliance, data processing, right to deletion, and data export."
        icon={Shield}
      >
        <h3>GDPR compliance</h3>
        <p>utm.one is fully GDPR compliant. We provide:</p>
        <ul>
          <li>Data Processing Agreement (DPA) for Business and Enterprise</li>
          <li>EU data residency options</li>
          <li>Cookie consent management</li>
        </ul>
        
        <h3>Data rights</h3>
        <ul>
          <li><strong>Right to access</strong> — Export all your data anytime</li>
          <li><strong>Right to deletion</strong> — Request complete account deletion</li>
          <li><strong>Right to portability</strong> — Download data in standard formats</li>
        </ul>
        
        <h3>Requesting data export</h3>
        <ol>
          <li>Go to Settings → Account</li>
          <li>Click "Export My Data"</li>
          <li>Receive a download link via email</li>
        </ol>
        
        <h3>Account deletion</h3>
        <p>To delete your account and all associated data, go to Settings → Account → Delete Account. This action is permanent and cannot be undone.</p>
      </ExpandableArticle>
    </div>

    <FeatureAvailability
      feature="Security Features"
      availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
    />
  </HelpLayout>
);

export default Security;
