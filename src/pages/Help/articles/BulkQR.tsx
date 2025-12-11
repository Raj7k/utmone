import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Layers, Download, FileArchive } from "lucide-react";

const BulkQR = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "Bulk Generation" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Bulk QR Code Generation</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Generate QR codes for hundreds of links at once. Download as a ZIP file with consistent naming for easy organization. Perfect for events, product packaging, and large campaigns.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">How bulk generation works</h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Select links</h3>
              <p className="text-sm text-zinc-600 m-0">Choose multiple links from your dashboard using checkboxes, or select an entire campaign.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Configure settings</h3>
              <p className="text-sm text-zinc-600 m-0">Set QR style, colors, format (PNG/SVG), and resolution. All codes will use the same settings.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Generate ZIP</h3>
              <p className="text-sm text-zinc-600 m-0">Click generate and we'll create all QR codes, package them into a ZIP file.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">4</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Download</h3>
              <p className="text-sm text-zinc-600 m-0">Download the ZIP with all QR codes named consistently (by slug or link ID).</p>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">File naming options</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 m-0 mb-2">By slug</h3>
            <code className="text-xs bg-zinc-100 px-2 py-1 rounded block">product-launch.png</code>
            <code className="text-xs bg-zinc-100 px-2 py-1 rounded block mt-1">webinar-signup.png</code>
            <p className="text-sm text-zinc-500 mt-2 m-0">Human-readable, matches your link slugs</p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 m-0 mb-2">By link ID</h3>
            <code className="text-xs bg-zinc-100 px-2 py-1 rounded block">abc123.png</code>
            <code className="text-xs bg-zinc-100 px-2 py-1 rounded block mt-1">def456.png</code>
            <p className="text-sm text-zinc-500 mt-2 m-0">Unique IDs, useful for automation</p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Limits</h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Plan</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Max per batch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-zinc-200">Free</td>
                <td className="p-3 border border-zinc-200">10 QR codes</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">Starter</td>
                <td className="p-3 border border-zinc-200">50 QR codes</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">Growth</td>
                <td className="p-3 border border-zinc-200">200 QR codes</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">Business</td>
                <td className="p-3 border border-zinc-200">500 QR codes</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">Enterprise</td>
                <td className="p-3 border border-zinc-200">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Generating bulk QR codes</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Go to <strong>Links</strong> in your dashboard</li>
          <li>Select multiple links using checkboxes</li>
          <li>Click <strong>Bulk Actions → Generate QR Codes</strong></li>
          <li>Configure format, resolution, and naming</li>
          <li>Click <strong>Generate ZIP</strong></li>
          <li>Download when ready (usually under 30 seconds)</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "Bulk link creation", href: "/help/articles/bulk-creation" },
          { title: "Export formats", href: "/help/articles/qr-export" },
          { title: "Campaigns & folders", href: "/help/articles/campaigns-folders" },
        ]}
      />
    </HelpLayout>
  );
};

export default BulkQR;
