import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Sparkles } from "lucide-react";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { HowToUse } from "@/components/tools/HowToUse";

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
      description: "The webpage your QR code will link to"
    },
    {
      title: "Customize colors",
      description: "Match your brand with custom QR and background colors"
    },
    {
      title: "Download PNG",
      description: "Get your QR code (upgrade for SVG/PDF and watermark removal)"
    }
  ];

  return (
    <MarketingLayout
      title="Free QR Code Generator - Create Branded QR Codes | utm.one"
      description="Create branded QR codes instantly with custom colors. Free QR generator with PNG export. No signup required."
    >
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              free qr code generator
            </h1>
            <p className="text-lg text-secondary-label max-w-2xl mx-auto">
              create branded qr codes instantly. no signup required.
            </p>
          </div>

          {/* How To Use */}
          <div className="max-w-4xl mx-auto mb-12">
            <HowToUse steps={steps} />
          </div>

          {/* Tool */}
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
                    <span className="text-primary">🔒</span>
                    <span>Remove utm.one watermark</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">🔒</span>
                    <span>SVG & PDF export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">🔒</span>
                    <span>Custom logo upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">🔒</span>
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
              <Link to="/pricing" className="text-primary hover:underline">
                Upgrade to Pro
              </Link>{" "}
              to remove watermarks and access advanced features.
            </p>
          </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
