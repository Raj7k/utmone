import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle } from "lucide-react";

const BadgeImport = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/events" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Upload className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Badge import</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Import badge scan data from event organizers or other scanning tools.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">When to use badge import</h2>
          <p className="text-zinc-600 mb-4">
            Use badge import when you have lead data from:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Event organizer lead retrieval exports</li>
            <li>Hardware badge scanners (rental devices)</li>
            <li>Attendee lists from the event</li>
            <li>Third-party scanning apps</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Import process</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Open your event in utm.one</li>
            <li>Go to the <strong>Leads</strong> tab</li>
            <li>Click <strong>Import</strong></li>
            <li>Upload your CSV or Excel file</li>
            <li>Map columns to utm.one fields</li>
            <li>Review and confirm import</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">File format</h2>
          <div className="flex items-start gap-3 mb-4">
            <FileSpreadsheet className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                We accept CSV and Excel (.xlsx) files. Your file should include columns for:
              </p>
            </div>
          </div>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Required columns</h4>
            <ul className="text-sm text-zinc-600 space-y-1 mb-4">
              <li>• Email (or First Name + Last Name + Company)</li>
            </ul>
            <h4 className="font-medium text-zinc-900 mb-3">Optional columns</h4>
            <ul className="text-sm text-zinc-600 space-y-1">
              <li>• First name</li>
              <li>• Last name</li>
              <li>• Company</li>
              <li>• Title/Role</li>
              <li>• Phone</li>
              <li>• LinkedIn URL</li>
              <li>• Notes</li>
              <li>• Scan timestamp</li>
            </ul>
          </div>

          <ProTip>
            Download our sample template before importing. It shows the exact format we expect 
            and makes column mapping automatic.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Column mapping</h2>
          <p className="text-zinc-600 mb-4">
            After uploading, you'll map your file's columns to utm.one fields:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 w-32">Your column:</span>
                <span className="bg-zinc-100 px-2 py-1 rounded">Email Address</span>
                <span className="text-zinc-400">→</span>
                <span className="bg-amber-100 px-2 py-1 rounded">Email</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 w-32">Your column:</span>
                <span className="bg-zinc-100 px-2 py-1 rounded">Full Name</span>
                <span className="text-zinc-400">→</span>
                <span className="bg-amber-100 px-2 py-1 rounded">Name</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Deduplication</h2>
          <p className="text-zinc-600 mb-4">
            utm.one automatically deduplicates imports:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Existing leads (by email) are updated, not duplicated</li>
            <li>Duplicate rows in your file are merged</li>
            <li>You'll see a preview of new vs. updated leads</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Post-import enrichment</h2>
          <p className="text-zinc-600 mb-4">
            After importing, you can bulk-enrich leads:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Auto-enrich option</p>
                <p className="text-sm text-green-700 mt-1">
                  Enable "Enrich after import" to automatically find missing emails and 
                  phone numbers using your connected enrichment provider.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Troubleshooting</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>File too large:</strong> Split into multiple files under 10MB each</li>
            <li><strong>Encoding issues:</strong> Save as UTF-8 CSV</li>
            <li><strong>Missing data:</strong> Ensure required columns have values</li>
            <li><strong>Wrong format:</strong> Use our template as a reference</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default BadgeImport;
