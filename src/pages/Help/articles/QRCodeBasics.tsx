import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const QRCodeBasics = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "QR Codes", href: "/help/qr" },
          { label: "Creating Branded QR Codes" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Creating Branded QR Codes</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Generate beautiful, scannable QR codes that match your brand identity. Every QR code 
          includes full analytics and connects to your utm.one short links.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Why Branded QR Codes?</h2>
        <p className="text-zinc-600 mb-4">
          Generic black-and-white QR codes look like afterthoughts. Branded QR codes:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Build trust and increase scan rates by 30%+ according to studies</li>
          <li>Reinforce brand recognition on print materials</li>
          <li>Look professional on business cards, posters, and packaging</li>
          <li>Stand out in crowded environments like trade shows</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Creating Your First QR Code</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Create or Select a Link</h3>
              <p className="text-zinc-600">Every QR code is connected to a utm.one short link. Create a new link or choose an existing one.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Open QR Generator</h3>
              <p className="text-zinc-600">Click the QR icon on any link, or use the dedicated QR Generator from the sidebar.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Customize Design</h3>
              <p className="text-zinc-600">Choose colors, add your logo, select frame styles, and adjust corner patterns.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Download & Use</h3>
              <p className="text-zinc-600">Export in PNG, SVG, or PDF format. Use in print, digital, or anywhere you need.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Customization Options</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Colors</h3>
            <p className="text-zinc-600 text-sm">Foreground and background colors. Supports hex codes, brand colors, and gradients.</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Logo</h3>
            <p className="text-zinc-600 text-sm">Center logo overlay with automatic sizing and contrast adjustment.</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Frames</h3>
            <p className="text-zinc-600 text-sm">Add call-to-action frames like "Scan Me" or custom text.</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Patterns</h3>
            <p className="text-zinc-600 text-sm">Corner and body patterns: squares, dots, rounded, or custom shapes.</p>
          </div>
        </div>

        <ProTip>
          Always test your QR code before printing! Scan it with multiple devices to ensure it works. 
          Complex designs with low contrast may fail to scan.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Export Formats</h2>
        
        <div className="space-y-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">PNG (Recommended for Digital)</h3>
            <p className="text-zinc-600 text-sm">Best for websites, emails, social media. Choose resolution up to 2000x2000px.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">SVG (Recommended for Print)</h3>
            <p className="text-zinc-600 text-sm">Vector format scales infinitely. Perfect for large format printing, billboards, packaging.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">PDF</h3>
            <p className="text-zinc-600 text-sm">Print-ready format with embedded vectors. Ideal for sharing with designers and printers.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Print Size Guidelines</h2>
        <p className="text-zinc-600 mb-4">
          QR codes must be large enough to scan reliably. Here are minimum sizes:
        </p>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left py-2 font-semibold text-zinc-900">Use Case</th>
                <th className="text-left py-2 font-semibold text-zinc-900">Min Size</th>
                <th className="text-left py-2 font-semibold text-zinc-900">Recommended</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600">
              <tr className="border-b border-zinc-100">
                <td className="py-2">Business Card</td>
                <td className="py-2">0.5 inch</td>
                <td className="py-2">0.75 inch</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-2">Flyer / Poster</td>
                <td className="py-2">1 inch</td>
                <td className="py-2">1.5 inch</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-2">Billboard</td>
                <td className="py-2">12 inch</td>
                <td className="py-2">18+ inch</td>
              </tr>
              <tr>
                <td className="py-2">Packaging</td>
                <td className="py-2">0.75 inch</td>
                <td className="py-2">1 inch</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">AI Stamp Studio</h2>
        <p className="text-zinc-600 mb-4">
          Available on Business and Enterprise plans, AI Stamp Studio transforms your QR codes 
          into vintage travel stamp-style designs using generative AI:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Upload your logo to extract brand colors automatically</li>
          <li>AI generates unique stamp artwork matching your brand</li>
          <li>QR code is seamlessly integrated into the stamp design</li>
          <li>Perfect for premium print materials and packaging</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">QR Code Analytics</h2>
        <p className="text-zinc-600 mb-4">
          Every QR code scan is tracked with the same analytics as link clicks:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Total scans and unique scanners</li>
          <li>Device type and operating system</li>
          <li>Geographic location (city, country)</li>
          <li>Time-based patterns (hourly, daily, weekly)</li>
          <li>Scan vs click comparison</li>
        </ul>

        <RelatedArticles
          articles={[
            { title: "QR Code Reliability Scoring", href: "/help/qr/reliability" },
            { title: "AI Stamp Studio", href: "/help/qr/stamp-studio" },
            { title: "Bulk QR Generation", href: "/help/qr/bulk-generate" },
            { title: "Print Specifications", href: "/help/qr/print-specs" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default QRCodeBasics;
