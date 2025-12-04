import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode as QrCodeIcon, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { useQRHealth } from "@/hooks/useQRHealth";
import { QRHealthGauge } from "@/components/qr/QRHealthGauge";

const qrSchema = z.object({
  url: z.string().url("enter a valid url"),
  size: z.number().min(128).max(1024),
  fgColor: z.string(),
  bgColor: z.string(),
});

type QRFormData = z.infer<typeof qrSchema>;

interface QRCodeToolProps {
  initialURL?: string;
}

export const QRCodeTool = ({ initialURL }: QRCodeToolProps) => {
  const { toast } = useToast();
  const [qrData, setQRData] = useState<QRFormData | null>(null);
  const { calculateHealth, autoFixContrast } = useQRHealth();

  const form = useForm<QRFormData>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      url: initialURL || "",
      size: 256,
      fgColor: "#000000",
      bgColor: "#ffffff",
    },
  });

  const values = form.watch();

  const generateQR = (data: QRFormData) => {
    setQRData(data);
    toast({
      title: "QR code generated",
      description: "your QR code is ready to download",
    });
  };

  const downloadQR = (format: "svg" | "png") => {
    const svg = document.getElementById("qr-code-display");
    if (!svg) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.svg";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = values.size;
        canvas.height = values.size;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = "qr-code.png";
            link.click();
            URL.revokeObjectURL(pngUrl);
          }
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }

    toast({
      title: "downloaded",
      description: `QR code saved as ${format.toUpperCase()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" style={{ color: 'rgba(168,85,247,1)' }} />
          <CardTitle>QR Code Generator</CardTitle>
        </div>
        <CardDescription>Generate branded QR codes for your links</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(generateQR)} className="space-y-6">
          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder="https://utm.one/your-link"
              {...form.register("url")}
              className="mt-1.5"
            />
            {form.formState.errors.url && (
              <p className="text-xs text-system-red mt-1">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="size">Size</Label>
              <Select
                value={values.size.toString()}
                onValueChange={(value) => form.setValue("size", parseInt(value))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128px (Small)</SelectItem>
                  <SelectItem value="256">256px (Medium)</SelectItem>
                  <SelectItem value="512">512px (Large)</SelectItem>
                  <SelectItem value="1024">1024px (X-Large)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fgColor">Foreground Color</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="fgColor"
                  type="color"
                  {...form.register("fgColor")}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={values.fgColor}
                  onChange={(e) => form.setValue("fgColor", e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  id="bgColor"
                  type="color"
                  {...form.register("bgColor")}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  value={values.bgColor}
                  onChange={(e) => form.setValue("bgColor", e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Generate QR Code
          </Button>

          {qrData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* QR Code Preview */}
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-muted/50 rounded-lg">
                  <div id="qr-code-display">
                    <QRCode
                      value={qrData.url}
                      size={Math.min(qrData.size, 256)}
                      fgColor={qrData.fgColor}
                      bgColor={qrData.bgColor}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => downloadQR("png")}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => downloadQR("svg")}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
              </div>

              {/* QR Health Gauge */}
              <div>
                <QRHealthGauge
                  health={calculateHealth(qrData.fgColor, qrData.bgColor, qrData.url)}
                  onAutoFix={() => {
                    const fixedColor = autoFixContrast(qrData.fgColor, qrData.bgColor);
                    form.setValue("fgColor", fixedColor);
                    // Regenerate with fixed color
                    generateQR({ ...qrData, fgColor: fixedColor });
                    toast({
                      title: "Contrast fixed",
                      description: "Foreground color adjusted for optimal scannability",
                    });
                  }}
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
