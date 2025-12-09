import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  { value: "256", label: "256px - Preview", description: "Quick preview" },
  { value: "512", label: "512px - Digital", description: "Social media, email" },
  { value: "1024", label: "1024px - Print Standard", description: "Flyers, business cards" },
  { value: "2048", label: "2048px - Print Large", description: "Posters, booth banners" },
  { value: "4096", label: "4096px - Print XL", description: "Large format, standees" },
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
      // Create high-res canvas for PDF
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

      // Create PDF-like page with print dialog
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        const dataUrl = canvas.toDataURL("image/png");
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Booth QR - ${eventName}</title>
              <style>
                @page { size: letter; margin: 0.5in; }
                body { 
                  display: flex; 
                  flex-direction: column; 
                  align-items: center; 
                  justify-content: center; 
                  min-height: 100vh; 
                  margin: 0; 
                  font-family: system-ui, sans-serif;
                }
                .container { text-align: center; }
                img { max-width: 6in; height: auto; }
                h1 { font-size: 24px; margin-bottom: 8px; }
                p { color: #666; font-size: 14px; margin: 4px 0; }
                .url { font-size: 10px; color: #999; word-break: break-all; max-width: 6in; margin-top: 16px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${eventName}</h1>
                <p>${city}</p>
                <img src="${dataUrl}" alt="Booth QR Code" />
                <p class="url">${boothUrl}</p>
              </div>
              <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
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
      <DialogContent className="max-w-lg bg-card border-border z-[100]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">booth qr code</DialogTitle>
          <DialogDescription>
            download high-resolution qr code for {eventName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Preview */}
          <div className="flex justify-center p-6 bg-white rounded-lg border border-border">
            <div id="booth-qr-preview" className="relative">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(boothUrl)}&color=${primaryColor.replace('#', '')}`}
                alt="Booth QR Code"
                className="w-48 h-48"
              />
              {isPrintReady && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  <Printer className="h-3 w-3" />
                  print ready
                </div>
              )}
            </div>
          </div>

          {/* URL Display */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">tracking url</Label>
            <div className="flex gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-xs font-mono truncate">
                {boothUrl}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTION_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex flex-col">
                        <span>{preset.label}</span>
                        <span className="text-xs text-muted-foreground">{preset.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">qr color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
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
          </div>

          {/* Download Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={downloadPNG}
              disabled={isDownloading === "png"}
              className="flex flex-col items-center gap-1 h-auto py-3"
              variant="outline"
            >
              <FileImage className="h-5 w-5" />
              <span className="text-xs">PNG</span>
              <span className="text-[10px] text-muted-foreground">{resolution}px</span>
            </Button>

            <Button
              onClick={downloadSVG}
              disabled={isDownloading === "svg"}
              className="flex flex-col items-center gap-1 h-auto py-3"
              variant="outline"
            >
              <FileCode className="h-5 w-5" />
              <span className="text-xs">SVG</span>
              <span className="text-[10px] text-muted-foreground">vector</span>
            </Button>

            <Button
              onClick={downloadPDF}
              disabled={isDownloading === "pdf"}
              className="flex flex-col items-center gap-1 h-auto py-3"
              variant="outline"
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">PDF</span>
              <span className="text-[10px] text-muted-foreground">print</span>
            </Button>
          </div>

          {/* Download All Button */}
          <Button onClick={downloadPNG} className="w-full gap-2" disabled={!!isDownloading}>
            <Download className="h-4 w-4" />
            download {resolution}px png
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
