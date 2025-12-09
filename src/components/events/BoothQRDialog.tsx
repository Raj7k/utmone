import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, FileImage, FileCode, FileText, Copy, Check, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeLib from "qrcode";

interface BoothQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  city: string;
}

const RESOLUTION_PRESETS = [
  { value: "256", label: "256px", description: "Preview" },
  { value: "512", label: "512px", description: "Digital / Social" },
  { value: "1024", label: "1024px", description: "Print Standard" },
  { value: "2048", label: "2048px", description: "Print Large" },
  { value: "4096", label: "4096px", description: "Print XL" },
];

export const BoothQRDialog = ({ open, onOpenChange, eventId, eventName, city }: BoothQRDialogProps) => {
  const { toast } = useToast();
  const [resolution, setResolution] = useState("1024");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const boothUrl = `https://utm.one/e/${eventId}?utm_source=event&utm_medium=booth&utm_campaign=${encodeURIComponent(eventName.toLowerCase().replace(/\s+/g, '-'))}`;
  const sanitizedEventName = eventName.replace(/[^a-zA-Z0-9]/g, '_');

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(boothUrl);
    setCopied(true);
    toast({ title: "url copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPNG = async () => {
    setIsDownloading("png");
    try {
      const dataUrl = await QRCodeLib.toDataURL(boothUrl, {
        width: parseInt(resolution),
        margin: 2,
        color: { dark: primaryColor, light: "#FFFFFF" },
        errorCorrectionLevel: "H",
      });
      const link = document.createElement("a");
      link.download = `booth-qr-${sanitizedEventName}-${resolution}px.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "png downloaded" });
    } catch (error) {
      toast({ title: "download failed", variant: "destructive" });
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadSVG = async () => {
    setIsDownloading("svg");
    try {
      const svgString = await QRCodeLib.toString(boothUrl, {
        type: "svg",
        width: parseInt(resolution),
        margin: 2,
        color: { dark: primaryColor, light: "#FFFFFF" },
        errorCorrectionLevel: "H",
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `booth-qr-${sanitizedEventName}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: "svg downloaded" });
    } catch (error) {
      toast({ title: "download failed", variant: "destructive" });
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading("pdf");
    try {
      const canvas = document.createElement("canvas");
      const size = parseInt(resolution);
      canvas.width = size;
      canvas.height = size;
      await QRCodeLib.toCanvas(canvas, boothUrl, {
        width: size,
        margin: 2,
        color: { dark: primaryColor, light: "#FFFFFF" },
        errorCorrectionLevel: "H",
      });
      const dataUrl = canvas.toDataURL("image/png");
      
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`<!DOCTYPE html><html><head><title>Booth QR - ${eventName}</title><style>@page{size:letter;margin:0.5in}body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:system-ui,sans-serif}.container{text-align:center}img{max-width:6in;height:auto}h1{font-size:24px;margin-bottom:8px}p{color:#666;font-size:14px;margin:4px 0}.url{font-size:10px;color:#999;word-break:break-all;max-width:6in;margin-top:16px}</style></head><body><div class="container"><h1>${eventName}</h1><p>${city}</p><img src="${dataUrl}" alt="Booth QR Code"/><p class="url">${boothUrl}</p></div></body></html>`);
        iframeDoc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 250);
      }
      toast({ title: "pdf print dialog opened" });
    } catch (error) {
      toast({ title: "pdf generation failed", variant: "destructive" });
    } finally {
      setIsDownloading(null);
    }
  };

  const isPrintReady = parseInt(resolution) >= 1024;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-[150]" />
      <DialogContent className="max-w-xl bg-card border-border z-[200] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">booth qr code</DialogTitle>
          <DialogDescription>download high-resolution qr code for {eventName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* QR Preview */}
          <div className="flex justify-center p-8 bg-white rounded-xl border border-border">
            <div className="relative">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(boothUrl)}&color=${primaryColor.replace('#', '')}`}
                alt="Booth QR Code"
                className="w-48 h-48"
              />
              {isPrintReady && (
                <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full shadow-lg">
                  <Printer className="h-3 w-3" />
                  print ready
                </div>
              )}
            </div>
          </div>

          {/* URL Display */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">tracking url</Label>
            <div className="flex gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg text-xs font-mono truncate border border-border">
                {boothUrl}
              </code>
              <Button variant="outline" size="icon" onClick={handleCopyUrl} className="flex-shrink-0">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">resolution</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-[250]">
                {RESOLUTION_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value} className="cursor-pointer">
                    <span className="font-medium">{preset.label}</span>
                    <span className="text-muted-foreground ml-2">— {preset.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* QR Color */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">qr color</Label>
            <div className="flex gap-3">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-14 h-10 p-1 cursor-pointer rounded-lg"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Download Format Buttons */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">download format</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={downloadPNG}
                disabled={isDownloading === "png"}
                className="flex flex-col items-center gap-1.5 h-auto py-4"
                variant="outline"
              >
                <FileImage className="h-5 w-5" />
                <span className="text-sm font-medium">PNG</span>
                <span className="text-[10px] text-muted-foreground">{resolution}px</span>
              </Button>
              <Button
                onClick={downloadSVG}
                disabled={isDownloading === "svg"}
                className="flex flex-col items-center gap-1.5 h-auto py-4"
                variant="outline"
              >
                <FileCode className="h-5 w-5" />
                <span className="text-sm font-medium">SVG</span>
                <span className="text-[10px] text-muted-foreground">vector</span>
              </Button>
              <Button
                onClick={downloadPDF}
                disabled={isDownloading === "pdf"}
                className="flex flex-col items-center gap-1.5 h-auto py-4"
                variant="outline"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">PDF</span>
                <span className="text-[10px] text-muted-foreground">print</span>
              </Button>
            </div>
          </div>

          {/* Primary Download Button */}
          <Button onClick={downloadPNG} className="w-full gap-2 h-12" disabled={!!isDownloading}>
            <Download className="h-4 w-4" />
            download {resolution}px png
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
