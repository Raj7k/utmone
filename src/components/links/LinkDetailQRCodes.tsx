import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import { Download, Trash2, QrCode } from "lucide-react";
import { format } from "date-fns";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface LinkDetailQRCodesProps {
  linkId: string;
  shortUrl: string;
}

export const LinkDetailQRCodes = ({ linkId, shortUrl }: LinkDetailQRCodesProps) => {
  const { data: qrCodes, isLoading, refetch } = useQuery({
    queryKey: ["qr-codes", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("link_id", linkId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch click counts per QR variant
  const { data: qrClickStats } = useQuery({
    queryKey: ["qr-click-stats", linkId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('link_clicks')
        .select("qr_code_id")
        .eq("link_id", linkId)
        .not("qr_code_id", "is", null);

      if (error) throw error;

      // Count clicks per QR code
      const clickCounts = data.reduce((acc, click) => {
        const qrId = click.qr_code_id!;
        acc[qrId] = (acc[qrId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return clickCounts;
    },
  });

  if (isLoading)
    return <div className="p-8 text-center text-secondary-label">loading qr codes…</div>;

  if (!qrCodes || qrCodes.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <QrCode className="h-16 w-16 mx-auto text-secondary-label" />
        <p className="text-secondary-label">No QR codes generated yet.</p>
        <QRCodeDialog linkId={linkId} shortUrl={shortUrl} trigger={
          <Button>
            <QrCode className="h-4 w-4 mr-2" />
            Generate First QR Code
          </Button>
        } />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-display font-semibold">{qrCodes.length} QR Code{qrCodes.length !== 1 ? 's' : ''}</h3>
        <QRCodeDialog linkId={linkId} shortUrl={shortUrl} trigger={
          <Button>
            <QrCode className="h-4 w-4 mr-2" />
            Generate New QR Code
          </Button>
        } />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qrCodes.map((qr) => (
          <Card key={qr.id}>
            <CardHeader>
              <CardTitle className="text-base">{qr.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qr.svg_url && (
                <div className="aspect-square bg-white p-4 rounded-md border">
                  <OptimizedImage src={qr.svg_url} alt={qr.name} className="w-full h-full" aspectRatio="1/1" />
                </div>
              )}
              
              <div className="text-sm space-y-1">
                {qr.variant_name && (
                  <div className="text-secondary-label">Variant: {qr.variant_name}</div>
                )}
                <div className="text-secondary-label">
                  Created: {format(new Date(qr.created_at || ""), "PPP")}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium mt-2">
                  <span className="text-primary">
                    {qrClickStats?.[qr.id] || 0} clicks
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {qr.png_url && (
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={qr.png_url} download>
                      <Download className="h-4 w-4 mr-1" />
                      PNG
                    </a>
                  </Button>
                )}
                {qr.svg_url && (
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={qr.svg_url} download>
                      <Download className="h-4 w-4 mr-1" />
                      SVG
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
