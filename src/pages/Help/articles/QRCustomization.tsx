import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ProTip } from "@/components/help/ProTip";
import { Palette } from "lucide-react";

const QRCustomization = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "Customization" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">QR Code Customization</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Transform generic black-and-white QR codes into branded assets. Change colors, round corners, adjust patterns, and create QR codes that match your brand identity.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Available customizations</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Foreground color</h3>
            <p className="text-sm text-zinc-600 m-0">
              Change the color of the QR code pattern. Use your brand's primary color for instant recognition.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Background color</h3>
            <p className="text-sm text-zinc-600 m-0">
              Set a background color or keep it transparent for overlays. Ensure high contrast for scannability.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Corner radius</h3>
            <p className="text-sm text-zinc-600 m-0">
              Round the corners of QR modules for a softer, more modern look. Adjustable from 0% to 50%.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Module style</h3>
            <p className="text-sm text-zinc-600 m-0">
              Choose between square, rounded, or dot patterns for the QR code modules.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Eye style</h3>
            <p className="text-sm text-zinc-600 m-0">
              Customize the three corner "eyes" separately. Square, rounded, or circle options available.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Error correction</h3>
            <p className="text-sm text-zinc-600 m-0">
              Set error correction level (L, M, Q, H). Higher levels allow more damage tolerance but create denser codes.
            </p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Color contrast guidelines</h2>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-amber-800 m-0">
            <strong>Important:</strong> Maintain at least a 4:1 contrast ratio between foreground and background colors. Low contrast QR codes may not scan reliably.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-lg bg-zinc-900 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded"></div>
            </div>
            <p className="text-xs text-emerald-600 font-medium m-0">✓ Good contrast</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-lg bg-blue-600 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded"></div>
            </div>
            <p className="text-xs text-emerald-600 font-medium m-0">✓ Good contrast</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-lg bg-yellow-200 flex items-center justify-center">
              <div className="w-12 h-12 bg-yellow-400 rounded"></div>
            </div>
            <p className="text-xs text-rose-600 font-medium m-0">✗ Poor contrast</p>
          </div>
        </div>

        <ProTip>
          Use our built-in contrast checker when customizing colors. We'll warn you if your color combination might cause scanning issues.
        </ProTip>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Customizing a QR code</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Create or open an existing link</li>
          <li>Click the <strong>QR Code</strong> tab</li>
          <li>Use the color pickers to set foreground and background</li>
          <li>Adjust corner radius and module style</li>
          <li>Preview changes in real-time</li>
          <li>Download or save your customized QR code</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "Adding logos to QR codes", href: "/help/articles/qr-logos" },
          { title: "QR reliability scoring", href: "/help/articles/qr-reliability" },
          { title: "Export formats", href: "/help/articles/qr-export" },
        ]}
      />
    </HelpLayout>
  );
};

export default QRCustomization;
