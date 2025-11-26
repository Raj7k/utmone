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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-foreground">
            utm.one
          </Link>
          <Link to="/early-access">
            <Button variant="default" size="sm">
              Get Early Access
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Free QR Code Generator
          </h1>
          <p className="text-lg text-secondary-label max-w-2xl mx-auto">
            Create branded QR Codes instantly. No signup required.
          </p>
        </div>

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
      </main>
    </div>
  );
}
