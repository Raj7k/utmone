import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
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

const articles = [
  {
    title: "Creating QR codes",
    description: "Generate a QR code for any short link with one click. Every QR code automatically inherits the link's UTM parameters and tracking.",
    href: "/help/qr#create",
    icon: QrCode,
  },
  {
    title: "Customization options",
    description: "Change colors, add your logo, round corners, adjust error correction. Create QR codes that match your brand identity.",
    href: "/help/qr#customize",
    icon: Palette,
  },
  {
    title: "Adding logos & images",
    description: "Upload your logo to display in the center of the QR code. We automatically adjust error correction to ensure scannability.",
    href: "/help/qr#logos",
    icon: Image,
    tier: "starter",
  },
  {
    title: "Export formats",
    description: "Download as PNG (web), SVG (scalable), or PDF (print). Choose resolution up to 4096px for large format printing.",
    href: "/help/qr#export",
    icon: Download,
  },
  {
    title: "QR reliability scoring",
    description: "Our scanner tests your QR code against blur, lighting, and angle variations. Get a reliability score before you print.",
    href: "/help/qr#reliability",
    icon: CheckCircle,
  },
  {
    title: "AI Stamp Studio",
    description: "Transform your brand logo into vintage travel stamp-style QR codes using generative AI. Business and Enterprise plans only.",
    href: "/help/qr#stamp-studio",
    icon: Sparkles,
    tier: "business",
    isNew: true,
  },
  {
    title: "Bulk QR generation",
    description: "Generate QR codes for hundreds of links at once. Download as a ZIP file with consistent naming for easy organization.",
    href: "/help/qr#bulk",
    icon: Layers,
  },
  {
    title: "Print specifications",
    description: "Minimum sizes, safe zones, material recommendations, and testing guidelines for printed QR codes that always scan.",
    href: "/help/qr#print",
    icon: FileText,
  },
];

const QRCodes = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">QR Codes</h1>
        <p className="text-lg text-zinc-500">
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
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Core features</h2>
        <div className="space-y-4">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              icon={article.icon}
              tier={article.tier as any}
            />
          ))}
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Advanced features</h2>
        <div className="space-y-4">
          {articles.slice(4).map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              icon={article.icon}
              tier={article.tier as any}
              isNew={article.isNew}
            />
          ))}
        </div>
      </div>

      <FeatureAvailability
        feature="QR Code Generator"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Creating short links", href: "/help/links#create" },
          { title: "Event Halo for trade shows", href: "/help/events#event-halo" },
          { title: "One-Tap Scanner", href: "/help/events#one-tap" },
        ]}
      />
    </HelpLayout>
  );
};

export default QRCodes;
