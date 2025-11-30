import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Lock, ArrowRight, Sparkles } from "lucide-react";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export const QRGeneratorBasic = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#1A1A1A");
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR with embedded utm.one branding
  useEffect(() => {
    if (!url || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate QR code with high error correction (allows 30% logo overlay)
    QRCodeLib.toCanvas(canvas, url, {
      width: 400,
      margin: 2,
      color: { dark: color, light: "#FFFFFF" },
      errorCorrectionLevel: 'H',
    }, (error) => {
      if (error) {
        console.error('QR generation error:', error);
        return;
      }

      // Draw utm.one branding in center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const logoSize = 80;

      // White background circle for logo
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
      ctx.fill();

      // utm.one text
      ctx.fillStyle = color;
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('utm.one', centerX, centerY);
    });
  }, [url, color]);

  const downloadPNG = async () => {
    if (!url || !canvasRef.current) {
      toast({ title: "Enter URL", description: "Please enter a URL to generate QR code", variant: "destructive" });
      return;
    }

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code-utm-one.png";
      link.click();
      
      toast({ title: "Downloaded", description: "QR code with utm.one branding downloaded" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download QR code", variant: "destructive" });
    }
  };

  const handleInitialGenerate = () => {
    if (!url) {
      toast({ title: "Enter URL", description: "Please enter a URL to generate QR code", variant: "destructive" });
      return;
    }
    try {
      new URL(url);
      setIsExpanded(true);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" });
    }
  };

  // Step 1: Minimal inline input + button
  if (!isExpanded) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="paste your url to generate qr code..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-base"
            />
            <Button
              onClick={handleInitialGenerate}
              disabled={!url}
              size="lg"
              className="h-12 px-6"
            >
              generate qr
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        <p className="text-sm text-secondary-label text-center mt-6">
          create branded qr codes instantly.{" "}
          <a href="/pricing" className="text-primary hover:underline">
            upgrade to pro
          </a>{" "}
          to remove watermark and add custom logos
        </p>
      </div>
    );
  }

  // Step 2: Expanded full tool
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="qr-url">destination url</Label>
              <Input
                id="qr-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="h-11"
              />
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label htmlFor="qr-color">qr code color</Label>
              <div className="flex gap-3">
                <Input
                  id="qr-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 h-11 cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#1A1A1A"
                  className="flex-1 h-11"
                />
              </div>
              <p className="text-xs text-muted-foreground">choose your brand color</p>
            </div>

            {/* QR Preview with Internal Branding */}
            {url && (
              <div className="space-y-4">
                <Label>preview with utm.one branding</Label>
                <div className="bg-muted/20 p-8 rounded-xl border border-border/40 flex justify-center">
                  <canvas 
                    ref={canvasRef} 
                    className="rounded-lg"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>

                <Button onClick={downloadPNG} size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  download qr code
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  utm.one branding is embedded inside the qr code
                </p>
              </div>
            )}

            {/* Pro Features Nudge */}
            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Sparkles className="h-4 w-4" />
                <span>unlock pro features</span>
              </div>
              <div className="space-y-2 text-sm text-secondary-label">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>remove branding</strong> — clean qr for your brand</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>custom logo</strong> — add your logo to qr center</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>scan analytics</strong> — track who scanned where</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>bulk qr codes</strong> — generate hundreds at once</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-sm text-secondary-label text-center mt-6">
          utm.one branding is included in free tier.{" "}
          <a href="/pricing" className="text-primary hover:underline">
            upgrade to pro
          </a>{" "}
          for white-label qr codes and advanced features
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
