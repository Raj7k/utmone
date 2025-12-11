import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Key, Shield, Smartphone } from "lucide-react";

const TwoFactorAuth = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/security" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Security
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Key className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Two-factor authentication</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Add an extra layer of security to your utm.one account.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is 2FA?</h2>
          <p className="text-zinc-600 mb-4">
            Two-factor authentication (2FA) requires two forms of verification to sign in:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Something you know (your password)</li>
            <li>Something you have (your phone or security key)</li>
          </ol>
          <p className="text-zinc-600 mb-4">
            Even if someone steals your password, they can't access your account without the second factor.
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2FA methods</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Smartphone className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Authenticator app</h4>
              <p className="text-sm text-zinc-600">
                Use Google Authenticator, Authy, or 1Password to generate codes.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Key className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Security key</h4>
              <p className="text-sm text-zinc-600">
                Use a YubiKey or other FIDO2/WebAuthn hardware key.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up authenticator app</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Security</strong></li>
            <li>Click <strong>Enable 2FA</strong></li>
            <li>Select <strong>Authenticator app</strong></li>
            <li>Scan the QR code with your authenticator app</li>
            <li>Enter the 6-digit code to verify</li>
            <li>Save your backup codes securely</li>
          </ol>

          <ProTip>
            Store your backup codes in a password manager or safe place. They're your only 
            way back into your account if you lose access to your authenticator.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up security key</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Security</strong></li>
            <li>Click <strong>Add security key</strong></li>
            <li>Insert your security key when prompted</li>
            <li>Touch the key to register it</li>
            <li>Name your key (e.g., "Office YubiKey")</li>
          </ol>
          <p className="text-zinc-600 mb-4">
            You can register multiple security keys for backup purposes.
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Backup codes</h2>
          <p className="text-zinc-600 mb-4">
            When you enable 2FA, you receive 10 single-use backup codes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Each code can only be used once</li>
            <li>Use them if you lose access to your authenticator</li>
            <li>Generate new codes anytime (invalidates old ones)</li>
            <li>Store them securely—treat them like passwords</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Signing in with 2FA</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Enter your email and password as usual</li>
            <li>When prompted, enter your 6-digit code or touch your security key</li>
            <li>Optionally, check "Trust this device" to skip 2FA for 30 days</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Disabling 2FA</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Go to Settings → Security</li>
            <li>Click <strong>Disable 2FA</strong></li>
            <li>Enter your password to confirm</li>
            <li>2FA is removed from your account</li>
          </ol>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Enterprise:</strong> Workspace admins can require 2FA for all team 
              members on Business and Enterprise plans.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default TwoFactorAuth;
