import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Server, Globe } from "lucide-react";

const DataPrivacy = () => {
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
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Data & privacy</h1>
          </div>
          <p className="text-lg text-zinc-600">
            How utm.one protects your data and respects user privacy.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Data collection</h2>
          <p className="text-zinc-600 mb-4">
            utm.one collects only the data necessary to provide our services:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-zinc-900 mb-2">Account data</p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Email address</li>
                  <li>• Name (optional)</li>
                  <li>• Company name (optional)</li>
                  <li>• Billing information</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900 mb-2">Analytics data</p>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Click timestamps</li>
                  <li>• Country/city (from IP)</li>
                  <li>• Device type</li>
                  <li>• Referrer URL</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What we don't collect</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>No personal identifiers of link clickers (by default)</li>
            <li>No browsing history beyond the link click</li>
            <li>No cross-site tracking</li>
            <li>No data selling to third parties</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Data encryption</h2>
          <div className="flex items-start gap-3 mb-4">
            <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                All data is encrypted at rest and in transit:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>In transit:</strong> TLS 1.3 for all connections</li>
            <li><strong>At rest:</strong> AES-256 encryption for stored data</li>
            <li><strong>Sensitive fields:</strong> Additional field-level encryption for tokens and secrets</li>
          </ul>

          <ProTip>
            Your API keys and integration tokens are encrypted with AES-256 before storage. 
            Even if our database were compromised, these values would be unreadable.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Data location</h2>
          <div className="flex items-start gap-3 mb-4">
            <Server className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Your data is stored in secure, SOC 2 compliant data centers:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Primary: United States (AWS us-east-1)</li>
            <li>EU customers: Europe (AWS eu-west-1) on Enterprise plan</li>
            <li>Backups: Encrypted and stored in separate regions</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Compliance</h2>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Globe className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">GDPR</h4>
              <p className="text-sm text-zinc-600">
                Full compliance with EU data protection regulations.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Shield className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">CCPA</h4>
              <p className="text-sm text-zinc-600">
                California Consumer Privacy Act compliant.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Your rights</h2>
          <p className="text-zinc-600 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Rectify:</strong> Correct inaccurate data</li>
            <li><strong>Delete:</strong> Request deletion of your data</li>
            <li><strong>Port:</strong> Export your data in a standard format</li>
            <li><strong>Object:</strong> Opt out of certain data processing</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Data deletion</h2>
          <p className="text-zinc-600 mb-4">
            When you delete your account:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Links are disabled immediately</li>
            <li>Personal data deleted within 30 days</li>
            <li>Analytics data anonymized or deleted</li>
            <li>Backups purged within 90 days</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Questions?</strong> Contact our Data Protection Officer at dpo@utm.one 
              for any privacy-related inquiries.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default DataPrivacy;
