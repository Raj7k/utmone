import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { Sparkles, Palette, Image } from "lucide-react";

const AIStampStudio = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "AI Stamp Studio" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">AI Stamp Studio</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Transform your brand logo into vintage travel stamp-style QR codes using generative AI. Create unique, on-brand QR codes that look like collectible stamps while staying fully scannable.
        </p>

        <FeatureAvailability
          feature="AI Stamp Studio"
          availability={{ free: false, starter: false, growth: false, business: true, enterprise: true }}
        />

        <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-white">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Image className="h-5 w-5" />
              </div>
              <h3 className="font-medium mb-1 text-white">1. Upload logo</h3>
              <p className="text-sm text-zinc-400 m-0">Upload your brand logo in PNG or SVG format</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Palette className="h-5 w-5" />
              </div>
              <h3 className="font-medium mb-1 text-white">2. Extract colors</h3>
              <p className="text-sm text-zinc-400 m-0">AI extracts your 3 dominant brand colors</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-medium mb-1 text-white">3. Generate stamp</h3>
              <p className="text-sm text-zinc-400 m-0">AI creates vintage stamp art around your QR</p>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Stamp styles</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Vintage Travel</h3>
            <p className="text-sm text-zinc-600 m-0">
              Classic postage stamp aesthetic with perforated edges, postal marks, and travel-themed decorations.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Art Deco</h3>
            <p className="text-sm text-zinc-600 m-0">
              Geometric patterns, gold accents, and 1920s-inspired elegance around your QR code.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Modern Minimal</h3>
            <p className="text-sm text-zinc-600 m-0">
              Clean lines, subtle gradients, and contemporary design language.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-900 mb-2">Retro Badge</h3>
            <p className="text-sm text-zinc-600 m-0">
              Circular badge design with ribbons, stars, and vintage certification aesthetics.
            </p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Creating a stamp QR</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Open any link and go to <strong>QR Code → AI Stamp Studio</strong></li>
          <li>Upload your brand logo</li>
          <li>AI extracts your brand colors automatically</li>
          <li>Choose a stamp style</li>
          <li>Click <strong>Generate</strong> and wait ~10 seconds</li>
          <li>Preview, adjust if needed, and download</li>
        </ol>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
          <p className="text-sm text-amber-800 m-0">
            <strong>Note:</strong> Each generation uses AI credits. Business plans include 50 stamp generations/month. Enterprise plans include unlimited generations.
          </p>
        </div>
      </article>

      <RelatedArticles
        articles={[
          { title: "QR customization", href: "/help/articles/qr-customization" },
          { title: "Adding logos", href: "/help/articles/qr-logos" },
          { title: "Print specifications", href: "/help/articles/qr-print-specs" },
        ]}
      />
    </HelpLayout>
  );
};

export default AIStampStudio;
