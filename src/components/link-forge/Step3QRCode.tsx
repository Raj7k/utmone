import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, ArrowLeft, Download } from "lucide-react";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActivationTracking } from "@/hooks/useActivationTracking";

interface Step3QRCodeProps {
  linkId: string;
  shortUrl: string;
  onBack: () => void;
}

export const Step3QRCode = ({ linkId, shortUrl, onBack }: Step3QRCodeProps) => {
  const queryClient = useQueryClient();
  const { trackFirstQR } = useActivationTracking();
  const [qrSize, setQrSize] = useState("256");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [qrImageUrl, setQrImageUrl] = useState("");

  const generateQRMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

      // Generate QR code using QR Server API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(shortUrl)}&color=${qrColor.replace('#', '')}&bgcolor=${qrBgColor.replace('#', '')}`;

      setQrImageUrl(qrApiUrl);

      // Fetch link to get workspace_id
      const { data: linkData } = await supabase
        .from("links")
        .select("workspace_id")
        .eq("id", linkId)
        .single();

      // Save QR code to database
      const { data, error } = await supabase
        .from("qr_codes")
        .insert({
          link_id: linkId,
          created_by: user.id,
          name: `qr-${Date.now()}`,
          image_url: qrApiUrl,
          workspace_id: linkData?.workspace_id,
          settings: {
            size: parseInt(qrSize),
            color: qrColor,
            bgColor: qrBgColor,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      // Track first QR for onboarding
      trackFirstQR();
      
      // Invalidate and refetch queries immediately
      await queryClient.invalidateQueries({ queryKey: ["qr-codes"] });
      await queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      await queryClient.refetchQueries({ queryKey: ["onboarding-progress"] });
      
      notify.success("qr code generated", { description: "your qr code is ready to download" });
    },
    onError: (error: Error) => {
      notify.error("error", { description: error.message });
    },
  });

  const downloadQR = () => {
    if (qrImageUrl) {
      const link = document.createElement("a");
      link.href = qrImageUrl;
      link.download = "qrcode.png";
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="h-5 w-5 text-primary" />
          <h2 className="text-title-2 font-semibold heading">generate qr code</h2>
        </div>
        <p className="text-body-apple text-secondary-label">
          create a branded qr code for offline campaigns
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <Label className="text-xs text-secondary-label">short url</Label>
        <p className="text-sm font-mono text-label mt-1">{shortUrl}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="qr_size">qr size</Label>
          <Select value={qrSize} onValueChange={setQrSize}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">small (128px)</SelectItem>
              <SelectItem value="256">medium (256px)</SelectItem>
              <SelectItem value="512">large (512px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="qr_color">qr color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer"
            />
            <Input
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="qr_bg">background color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <input
              type="color"
              value={qrBgColor}
              onChange={(e) => setQrBgColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer"
            />
            <Input
              value={qrBgColor}
              onChange={(e) => setQrBgColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {!qrImageUrl && (
        <Button
          type="button"
          className="w-full"
          onClick={() => generateQRMutation.mutate()}
          disabled={generateQRMutation.isPending}
        >
          {generateQRMutation.isPending ? "generating..." : "generate qr code"}
        </Button>
      )}

      {qrImageUrl && (
        <div className="space-y-4">
          <div className="flex justify-center p-6 bg-white rounded-lg">
            <img
              src={qrImageUrl}
              alt="qr code"
              style={{ width: `${qrSize}px`, height: `${qrSize}px` }}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              back
            </Button>
            <Button onClick={downloadQR} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              download qr
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
