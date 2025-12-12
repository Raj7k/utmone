import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import {
  QrCode,
  Palette,
  Image,
  Download,
  CheckCircle,
  Sparkles,
  Layers,
  FileText,
} from "lucide-react";

const QRCodes = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">QR Codes</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Generate beautiful, branded QR codes that convert. Every scan is tracked with full analytics.
        </p>
      </div>

      {/* QR Preview */}
      <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center">
              <QrCode className="h-32 w-32 text-zinc-900" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Branded QR codes that build trust</h2>
            <p className="text-zinc-300 mb-4">
              Every QR code links to your custom domain—not a generic shortener. When customers scan, they see your brand, building confidence before they even click.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">Custom colors</div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">Logo embedding</div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">Full analytics</div>
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm">Print-ready export</div>
            </div>
          </div>
        </div>
      </div>

      <ProTip>
        Always test your QR code at the final print size before production. Our reliability scorer simulates real-world scanning conditions.
      </ProTip>

      {/* Core Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Core features</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Creating QR codes"
            description="Generate a QR code for any short link with one click."
            icon={QrCode}
          >
            <h3>How to create a QR code</h3>
            <ol>
              <li>Create or select an existing short link</li>
              <li>Click the QR code icon</li>
              <li>Customize colors and styling (optional)</li>
              <li>Download in your preferred format</li>
            </ol>
            <h3>What's included</h3>
            <ul>
              <li>Full click analytics for every scan</li>
              <li>UTM parameter tracking</li>
              <li>Device and location data</li>
              <li>Real-time scan monitoring</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Customization options"
            description="Change colors, add your logo, round corners, adjust error correction."
            icon={Palette}
          >
            <h3>Available customizations</h3>
            <ul>
              <li><strong>Colors</strong> — Foreground and background colors</li>
              <li><strong>Corner radius</strong> — Square, rounded, or fully circular modules</li>
              <li><strong>Module style</strong> — Classic squares, dots, or custom shapes</li>
              <li><strong>Eye style</strong> — Customize the three corner patterns</li>
              <li><strong>Error correction</strong> — Low (7%), Medium (15%), Quartile (25%), High (30%)</li>
            </ul>
            <h3>Color contrast guidelines</h3>
            <p>Ensure at least 3:1 contrast ratio between foreground and background for reliable scanning. Dark colors on light backgrounds work best.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Adding logos & images"
            description="Upload your logo to display in the center of the QR code."
            icon={Image}
            tier="starter"
          >
            <h3>Logo requirements</h3>
            <ul>
              <li><strong>Format</strong> — PNG, JPG, or SVG</li>
              <li><strong>Size</strong> — Maximum 10MB</li>
              <li><strong>Aspect ratio</strong> — Square works best (1:1)</li>
              <li><strong>Background</strong> — Transparent or matching QR background</li>
            </ul>
            <h3>Logo sizing</h3>
            <p>Logos should cover no more than 20% of the QR code area. We automatically adjust error correction to ensure scannability.</p>
            <h3>Adding a logo</h3>
            <ol>
              <li>Open the QR customization panel</li>
              <li>Click "Add Logo"</li>
              <li>Upload your image</li>
              <li>Adjust size and position</li>
              <li>Preview and download</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="Export formats"
            description="Download as PNG, SVG, or PDF at high resolution."
            icon={Download}
          >
            <h3>Available formats</h3>
            <ul>
              <li><strong>PNG</strong> — Best for web and digital use. Supports transparency.</li>
              <li><strong>SVG</strong> — Vector format, scales infinitely without quality loss. Best for print.</li>
              <li><strong>PDF</strong> — Print-ready format with embedded vectors.</li>
            </ul>
            <h3>Resolution options</h3>
            <p>Choose resolution up to 4096px for large format printing. For most uses, 1024px is sufficient.</p>
          </ExpandableArticle>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Advanced features</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="QR reliability scoring"
            description="Test your QR code against blur, lighting, and angle variations."
            icon={CheckCircle}
          >
            <h3>What we test</h3>
            <ul>
              <li><strong>Blur resistance</strong> — Can it be read when slightly out of focus?</li>
              <li><strong>Angle tolerance</strong> — Scanning from different angles</li>
              <li><strong>Lighting conditions</strong> — Low light, bright light, shadows</li>
              <li><strong>Distance</strong> — Minimum and maximum scan distances</li>
              <li><strong>Damage simulation</strong> — Partial obstruction or wear</li>
            </ul>
            <h3>Score ranges</h3>
            <p><strong>90-100</strong> — Excellent, reliable in all conditions</p>
            <p><strong>70-89</strong> — Good, may have issues in edge cases</p>
            <p><strong>Below 70</strong> — Consider adjusting design for better scannability</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="AI Stamp Studio"
            description="Transform your logo into vintage travel stamp-style QR codes."
            icon={Sparkles}
            tier="business"
            isNew
          >
            <h3>What is AI Stamp Studio?</h3>
            <p>AI Stamp Studio uses generative AI to create unique, artistic QR codes that look like vintage travel stamps, seals, or badges—while remaining fully scannable.</p>
            <h3>How it works</h3>
            <ol>
              <li>Upload your logo or brand image</li>
              <li>Select a style (vintage stamp, seal, badge, etc.)</li>
              <li>AI generates multiple design options</li>
              <li>Each design is tested for scannability</li>
              <li>Download your favorite</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="Bulk QR generation"
            description="Generate QR codes for hundreds of links at once."
            icon={Layers}
          >
            <h3>How to bulk generate</h3>
            <ol>
              <li>Select multiple links from your dashboard</li>
              <li>Click "Generate QR Codes"</li>
              <li>Choose style and format settings</li>
              <li>Download as a ZIP file</li>
            </ol>
            <p>Files are named consistently for easy organization.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Print specifications"
            description="Minimum sizes, safe zones, and material recommendations."
            icon={FileText}
          >
            <h3>Minimum sizes</h3>
            <ul>
              <li><strong>Business cards</strong> — At least 2cm × 2cm (0.8in × 0.8in)</li>
              <li><strong>Posters</strong> — At least 3cm × 3cm (1.2in × 1.2in) at normal viewing distance</li>
              <li><strong>Billboards</strong> — Scale based on viewing distance (rule: 1cm per meter of distance)</li>
            </ul>
            <h3>Safe zones</h3>
            <p>Always include a quiet zone (white space) around the QR code equal to at least 4 modules wide.</p>
            <h3>Material tips</h3>
            <ul>
              <li>Avoid glossy surfaces that create glare</li>
              <li>Matte finishes scan more reliably</li>
              <li>Test on the actual material before mass printing</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      <FeatureAvailability
        feature="QR Code Generator"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />
    </HelpLayout>
  );
};

export default QRCodes;
