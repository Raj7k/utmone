import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { Image, CheckCircle } from "lucide-react";

const QRLogos = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "Adding Logos" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Adding Logos & Images to QR Codes</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Place your logo in the center of any QR code for instant brand recognition. We automatically adjust error correction to ensure your code stays scannable.
        </p>

        <FeatureAvailability
          feature="Logo QR Codes"
          availability={{ free: false, starter: true, growth: true, business: true, enterprise: true }}
        />

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Logo requirements</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 border border-zinc-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900 m-0">Format</p>
              <p className="text-sm text-zinc-600 m-0">PNG, JPG, SVG, or WebP</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 border border-zinc-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900 m-0">Size</p>
              <p className="text-sm text-zinc-600 m-0">Up to 5MB, minimum 100x100px</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 border border-zinc-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900 m-0">Aspect ratio</p>
              <p className="text-sm text-zinc-600 m-0">Square logos work best (1:1)</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 border border-zinc-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900 m-0">Background</p>
              <p className="text-sm text-zinc-600 m-0">Transparent or solid white recommended</p>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Logo sizing</h2>
        
        <p className="text-zinc-600 mb-4">
          Your logo can cover up to 30% of the QR code area. Larger logos require higher error correction:
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Logo Size</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Error Correction</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-zinc-200">10% (small)</td>
                <td className="p-3 border border-zinc-200">Level M (15%)</td>
                <td className="p-3 border border-zinc-200">Subtle branding</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">20% (medium)</td>
                <td className="p-3 border border-zinc-200">Level Q (25%)</td>
                <td className="p-3 border border-zinc-200">Balanced visibility</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">30% (large)</td>
                <td className="p-3 border border-zinc-200">Level H (30%)</td>
                <td className="p-3 border border-zinc-200">Maximum brand impact</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ProTip>
          We automatically set error correction based on your logo size. Larger logos = higher error correction = denser QR patterns. For print, we recommend medium (20%) logos.
        </ProTip>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Adding a logo</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Open the QR code editor for any link</li>
          <li>Click <strong>Add Logo</strong></li>
          <li>Upload your logo file or drag and drop</li>
          <li>Adjust size using the slider</li>
          <li>Preview scannability with our tester</li>
          <li>Download your branded QR code</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "QR customization options", href: "/help/articles/qr-customization" },
          { title: "AI Stamp Studio", href: "/help/articles/ai-stamp-studio" },
          { title: "Print specifications", href: "/help/articles/qr-print-specs" },
        ]}
      />
    </HelpLayout>
  );
};

export default QRLogos;
