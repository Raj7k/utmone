import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Sparkles, Palette, BarChart3, Image, Zap } from "lucide-react";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { HowToUse } from "@/components/tools/HowToUse";
import { ToolHero } from "@/components/tools/ToolHero";
import { FreeVsProTable } from "@/components/tools/FreeVsProTable";
import { LockedFeaturePreview } from "@/components/tools/LockedFeaturePreview";
import { ToolUseCases } from "@/components/tools/ToolUseCases";

export default function QRGenerator() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  const handleDownload = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate QR Code",
        variant: "destructive",
      });
      return;
    }

    try {
      const pngDataUrl = await QRCodeLib.toDataURL(url, {
        width: 1024,
        margin: 2,
        color: { dark: color, light: bgColor },
      });
      
      const link = document.createElement("a");
      link.href = pngDataUrl;
      link.download = "utm-one-qr.png";
      link.click();

      toast({
        title: "QR Code Downloaded",
        description: "Your QR Code has been saved",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Couldn't generate QR Code",
        variant: "destructive",
      });
    }
  };

  const steps = [
    {
      title: "Enter your destination URL",
      description: "Any webpage you want to link to"
    },
    {
      title: "Customize colors (optional)",
      description: "Choose QR code and background colors"
    },
    {
      title: "Download as PNG",
      description: "Your QR code is ready to use"
    }
  ];

  const freeVsProFeatures = [
    { name: "Generate QR codes instantly", free: true, pro: true },
    { name: "Custom colors", free: true, pro: true },
    { name: "PNG export", free: true, pro: true },
    { name: "Remove utm.one watermark", free: false, pro: true },
    { name: "SVG & PDF export (print-ready)", free: false, pro: true },
    { name: "Custom logo upload", free: false, pro: true },
    { name: "Gradient colors", free: false, pro: true },
    { name: "Advanced module shapes", free: false, pro: true },
    { name: "Scan analytics", free: false, pro: true },
  ];

  const useCases = [
    {
      icon: Palette,
      title: "event marketers",
      description: "Print branded QR codes on standees, badges, and posters that match your brand colors.",
      example: "Scannable codes on conference swag"
    },
    {
      icon: BarChart3,
      title: "growth teams",
      description: "Track offline-to-online attribution by adding QR codes to print ads and billboards.",
      example: "Billboard scans → GA4 conversion tracking"
    },
    {
      icon: Image,
      title: "product teams",
      description: "Embed QR codes on product packaging for warranty registration and user guides.",
      example: "Scan to register product or download manual"
    },
    {
      icon: Zap,
      title: "restaurants & retail",
      description: "Create menu QR codes or payment links that customers can scan instantly.",
      example: "Contactless menus and payment links"
    }
  ];

  const toolContent = (
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Customization */}
            <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="url">Destination URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">QR Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bgColor">Background</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Unlock Pro features</span>
                </div>
                <div className="space-y-2 text-sm text-secondary-label">
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>🔒</span>
                    <span>Remove utm.one watermark</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>🔒</span>
                    <span>SVG & PDF export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>🔒</span>
                    <span>Custom logo upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>🔒</span>
                    <span>Gradient colors</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right: Preview */}
          <div className="flex flex-col items-center justify-center">
            <Card className="p-8 w-full max-w-md">
              <div className="bg-white p-8 rounded-lg flex items-center justify-center relative">
                {url ? (
                  <>
                    <QRCode
                      value={url}
                      size={256}
                      fgColor={color}
                      bgColor={bgColor}
                      level="H"
                    />
                    {/* utm.one watermark */}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground font-medium border border-border/20">
                      utm.one
                    </div>
                  </>
                ) : (
                  <div className="w-64 h-64 bg-muted/20 rounded-lg flex items-center justify-center text-secondary-label">
                    Enter URL to preview
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleDownload}
                  disabled={!url}
                  className="w-full"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>

                <Link to="/early-access" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Remove branding →
                  </Button>
                </Link>
              </div>
            </Card>

            <p className="text-sm text-secondary-label text-center mt-6 max-w-md">
              Free QR Codes include utm.one branding.{" "}
              <Link to="/pricing" className="hover:underline" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Upgrade to Pro
              </Link>{" "}
              to remove watermarks and access advanced features.
            </p>
          </div>
    </div>
  );

  return (
    <MarketingLayout
      title="Free QR Code Generator - Create Custom QR Codes | utm.one"
      description="Generate custom QR codes instantly. Free QR code generator with color customization and PNG download. No signup required."
    >
      {/* Hero with Tool */}
      <ToolHero
        title="create qr codes that convert."
        description="generate custom qr codes instantly with color customization. no signup required."
      >
        {toolContent}
      </ToolHero>

      {/* How To Use */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <HowToUse steps={steps} />
        </div>
      </section>

      {/* Free vs Pro Comparison */}
      <FreeVsProTable features={freeVsProFeatures} />

      {/* Locked Feature Preview */}
      <LockedFeaturePreview
        title="branded qr codes without watermarks"
        description="Pro users can remove the utm.one watermark, upload custom logos, export as SVG/PDF for print-ready quality, use gradient colors, and track scans with analytics."
      />

      {/* Use Cases */}
      <ToolUseCases useCases={useCases} />

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            ready for more?
          </h2>
          <p className="text-body text-secondary-label mb-8">
            upgrade to pro and unlock watermark removal, SVG/PDF export, custom logos, and scan analytics.
          </p>
          <Link to="/pricing">
            <Button size="lg" variant="marketing">
              see pro features →
            </Button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
