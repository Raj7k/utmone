import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Lock } from "lucide-react";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";

export const QRGeneratorBasic = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#1A1A1A");

  const downloadPNG = async () => {
    if (!url) {
      toast({ title: "Enter URL", description: "Please enter a URL to generate QR code", variant: "destructive" });
      return;
    }

    try {
      const dataUrl = await QRCodeLib.toDataURL(url, {
        width: 1024,
        margin: 2,
        color: { dark: color, light: "#FFFFFF" },
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.png";
      link.click();
      
      toast({ title: "Downloaded", description: "QR code downloaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download QR code", variant: "destructive" });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-sm border-slate-200">
      <div className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <Label>URL to encode</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="h-10"
          />
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <Label>QR Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#1A1A1A"
              className="h-10"
            />
          </div>
        </div>

        {/* QR Preview with Watermark */}
        {url && (
          <div className="space-y-3">
            <Label>Preview</Label>
            <div className="relative bg-white p-6 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
              <QRCode
                value={url}
                size={200}
                fgColor={color}
                bgColor="#FFFFFF"
                level="H"
              />
              {/* utm.one watermark */}
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-secondary-label border border-slate-200">
                powered by utm.one
              </div>
            </div>

            <Button onClick={downloadPNG} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
          </div>
        )}

        {/* Pro Features Nudge */}
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-secondary-label mb-3">Unlock with Pro:</p>
          <div className="grid md:grid-cols-2 gap-2 text-xs text-secondary-label">
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Remove utm.one watermark</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>SVG & PDF export</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Custom logo upload</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Gradient colors</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
