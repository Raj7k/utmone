import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Key, Shield, Usb, CheckCircle } from "lucide-react";

const SecurityKeys = () => {
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
            <h1 className="text-3xl font-display font-bold text-zinc-900">Security keys (WebAuthn)</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Use hardware security keys like YubiKey for phishing-resistant authentication.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Why use security keys?</h2>
          <p className="text-zinc-600 mb-4">
            Security keys provide the strongest protection against account compromise:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Phishing-proof:</strong> Keys are bound to specific domains</li>
            <li><strong>No codes to steal:</strong> Nothing to intercept or copy</li>
            <li><strong>Physical requirement:</strong> Must possess the key to authenticate</li>
            <li><strong>Fast:</strong> Just touch the key—no typing codes</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Supported keys</h2>
          <p className="text-zinc-600 mb-4">
            utm.one supports any FIDO2/WebAuthn compatible security key:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-zinc-900">Hardware keys</p>
                <ul className="text-sm text-zinc-600 mt-2 space-y-1">
                  <li>• YubiKey 5 Series</li>
                  <li>• Google Titan Security Key</li>
                  <li>• Feitian ePass</li>
                  <li>• Solo Keys</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Platform authenticators</p>
                <ul className="text-sm text-zinc-600 mt-2 space-y-1">
                  <li>• Touch ID (Mac)</li>
                  <li>• Face ID (iPhone)</li>
                  <li>• Windows Hello</li>
                  <li>• Android biometrics</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Registering a security key</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Security</strong></li>
            <li>Click <strong>Add security key</strong></li>
            <li>Name your key (e.g., "Primary YubiKey")</li>
            <li>When prompted, insert your key and touch it</li>
            <li>Key is registered and ready to use</li>
          </ol>

          <ProTip>
            Register at least two security keys—keep one as a backup in a safe location. 
            If you lose your only key, you'll need backup codes to recover access.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Using your security key</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Enter your email and password</li>
            <li>When prompted for 2FA, insert your security key</li>
            <li>Touch the key when it blinks</li>
            <li>You're signed in</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Managing keys</h2>
          <p className="text-zinc-600 mb-4">
            View and manage your registered keys in Settings → Security:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>See all registered keys with names and last used dates</li>
            <li>Rename keys for easier identification</li>
            <li>Remove keys you no longer use</li>
            <li>Add new keys at any time</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Domain binding</h2>
          <p className="text-zinc-600 mb-4">
            Security keys are bound to specific domains for phishing protection:
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> A key registered on app.utm.one will only work on 
              app.utm.one. If you access utm.one from different domains (e.g., staging), 
              you may need to register the key on each domain.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Lost your security key?</h2>
          <p className="text-zinc-600 mb-4">
            If you lose access to your security key:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Use your backup security key (if you registered one)</li>
            <li>Or use a backup code from your 2FA setup</li>
            <li>Or contact support with account verification</li>
          </ol>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Enterprise MFA enforcement</p>
                <p className="text-sm text-green-700 mt-1">
                  On Business and Enterprise plans, admins can require all team members 
                  to use security keys for maximum security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default SecurityKeys;
