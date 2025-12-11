import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ProTip } from "@/components/help/ProTip";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";

const QRPrintSpecs = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "Print Specifications" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">QR Code Print Specifications</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Minimum sizes, safe zones, material recommendations, and testing guidelines for printed QR codes that always scan. Follow these specs to avoid failed prints.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Minimum sizes</h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Scan Distance</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Minimum Size</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-zinc-200">6 inches (15cm)</td>
                <td className="p-3 border border-zinc-200">0.75" × 0.75" (2cm)</td>
                <td className="p-3 border border-zinc-200">Business cards, product labels</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">12 inches (30cm)</td>
                <td className="p-3 border border-zinc-200">1" × 1" (2.5cm)</td>
                <td className="p-3 border border-zinc-200">Flyers, brochures, menus</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">3 feet (1m)</td>
                <td className="p-3 border border-zinc-200">3" × 3" (7.5cm)</td>
                <td className="p-3 border border-zinc-200">Posters, event signage</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">10 feet (3m)</td>
                <td className="p-3 border border-zinc-200">10" × 10" (25cm)</td>
                <td className="p-3 border border-zinc-200">Banners, trade show displays</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">30 feet (10m)</td>
                <td className="p-3 border border-zinc-200">30" × 30" (75cm)</td>
                <td className="p-3 border border-zinc-200">Billboards, building signage</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 m-0">
              <strong>Rule of thumb:</strong> QR code size should be at least 1/10th of the expected scan distance. Scanning from 3 feet away? Make the code at least 3.6 inches.
            </p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Safe zones</h2>
        
        <p className="text-zinc-600 mb-4">
          Always include a "quiet zone" of white space around your QR code:
        </p>

        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-8">
          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-zinc-900 m-0">Minimum quiet zone: 4 modules</p>
            <p className="text-sm text-zinc-600 m-0">The white border around your QR code should be at least 4 "squares" wide on all sides. utm.one adds this automatically.</p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Material recommendations</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 m-0 mb-2">✓ Good materials</h3>
            <ul className="text-sm text-emerald-800 m-0 space-y-1">
              <li>Matte paper (reduces glare)</li>
              <li>Uncoated cardstock</li>
              <li>Vinyl stickers (matte finish)</li>
              <li>Cotton fabric</li>
            </ul>
          </div>

          <div className="border border-rose-200 bg-rose-50 rounded-lg p-4">
            <h3 className="font-semibold text-rose-900 m-0 mb-2">✗ Problematic materials</h3>
            <ul className="text-sm text-rose-800 m-0 space-y-1">
              <li>Glossy/reflective surfaces</li>
              <li>Metallic finishes</li>
              <li>Textured surfaces (embossed)</li>
              <li>Dark or transparent substrates</li>
            </ul>
          </div>
        </div>

        <ProTip>
          Always print a test QR code and scan it with multiple phones before running your full print job. Test in the lighting conditions where it will be used.
        </ProTip>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Pre-print checklist</h2>
        
        <ul className="space-y-2 text-zinc-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Run reliability test (score 70+ recommended)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Verify minimum size for scan distance</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Check color contrast (4:1 minimum)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Include quiet zone on all sides</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Export at appropriate resolution</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Print test and scan with 3+ different phones</span>
          </li>
        </ul>
      </article>

      <RelatedArticles
        articles={[
          { title: "QR reliability scoring", href: "/help/articles/qr-reliability" },
          { title: "Export formats", href: "/help/articles/qr-export" },
          { title: "QR customization", href: "/help/articles/qr-customization" },
        ]}
      />
    </HelpLayout>
  );
};

export default QRPrintSpecs;
