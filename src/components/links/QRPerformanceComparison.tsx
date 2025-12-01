import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { ABTestDecisionEngine } from "@/components/links/ABTestDecisionEngine";

interface QRPerformanceComparisonProps {
  linkId: string;
}

export const QRPerformanceComparison = ({ linkId }: QRPerformanceComparisonProps) => {
  const { data: qrPerformance, isLoading } = useQuery({
    queryKey: ["qr-performance", linkId],
    queryFn: async () => {
      // Fetch QR codes
      const { data: qrCodes, error: qrError } = await supabase
        .from("qr_codes")
        .select("id, name, variant_name, created_at")
        .eq("link_id", linkId)
        .order("created_at", { ascending: false });

      if (qrError) throw qrError;

      // Fetch clicks per QR code
      const { data: clicks, error: clicksError } = await supabase
        .from("link_clicks")
        .select("qr_code_id, is_unique, device_type, country")
        .eq("link_id", linkId)
        .not("qr_code_id", "is", null);

      if (clicksError) throw clicksError;

      // Calculate stats per QR code
      const stats = qrCodes.map((qr) => {
        const qrClicks = clicks.filter((c) => c.qr_code_id === qr.id);
        const uniqueClicks = qrClicks.filter((c) => c.is_unique).length;
        const devices = qrClicks.reduce((acc, c) => {
          if (c.device_type) {
            acc[c.device_type] = (acc[c.device_type] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        const topDevice = Object.entries(devices).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
        
        const countries = qrClicks.reduce((acc, c) => {
          if (c.country) {
            acc[c.country] = (acc[c.country] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        const topCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        return {
          ...qr,
          totalClicks: qrClicks.length,
          uniqueClicks,
          ctr: qrClicks.length > 0 ? ((uniqueClicks / qrClicks.length) * 100).toFixed(1) : "0",
          topDevice,
          topCountry,
        };
      });

      // Sort by total clicks
      stats.sort((a, b) => b.totalClicks - a.totalClicks);

      return stats;
    },
  });

    return <div className="p-8 text-center text-secondary-label">loading qr performance…</div>;

  if (!qrPerformance || qrPerformance.length === 0) {
    return (
      <div className="p-8 text-center text-secondary-label">
        No QR codes to compare. Generate QR codes to see performance metrics.
      </div>
    );
  }

  const maxClicks = Math.max(...qrPerformance.map((q) => q.totalClicks), 1);

  const variants = qrPerformance.map(qr => ({
    id: qr.id,
    name: qr.name,
    clicks: qr.totalClicks,
    conversions: 0, // Would need conversion tracking
  }));

  return (
    <div className="space-y-6 p-6">
      {variants.length >= 2 && <ABTestDecisionEngine variants={variants} />}
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-display font-semibold">QR Code Performance Comparison</h3>
        <Badge variant="secondary">{qrPerformance.length} variants</Badge>
      </div>

      <div className="space-y-4">
        {qrPerformance.map((qr, index) => (
          <Card key={qr.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && qr.totalClicks > 0 && (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  )}
                  <CardTitle className="text-base">{qr.name}</CardTitle>
                  {qr.variant_name && (
                    <Badge variant="outline" className="text-xs">
                      {qr.variant_name}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{qr.totalClicks}</div>
                  <div className="text-xs text-secondary-label">total clicks</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={(qr.totalClicks / maxClicks) * 100} className="h-2" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-secondary-label">Unique Clicks</div>
                  <div className="font-medium">{qr.uniqueClicks}</div>
                </div>
                <div>
                  <div className="text-secondary-label">Unique Rate</div>
                  <div className="font-medium">{qr.ctr}%</div>
                </div>
                <div>
                  <div className="text-secondary-label">Top Device</div>
                  <div className="font-medium capitalize">{qr.topDevice}</div>
                </div>
                <div>
                  <div className="text-secondary-label">Top Country</div>
                  <div className="font-medium">{qr.topCountry}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
