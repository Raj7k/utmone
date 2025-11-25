import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Link2, MousePointerClick, QrCode as QrCodeIcon, TrendingUp, ArrowUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function GlanceableMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1);

      const workspaceId = workspaces?.[0]?.id;
      if (!workspaceId) return null;

      // Use explicit any type to avoid TypeScript deep instantiation error
      const db = supabase as any;

      // Fetch data and count manually
      const { data: linksData } = await db
        .from("links")
        .select("id, total_clicks, unique_clicks, total_conversions, conversion_rate")
        .eq("workspace_id", workspaceId);

      const { data: qrData } = await db
        .from("qr_codes")
        .select("id, link_id")
        .in("link_id", linksData?.map((l: any) => l.id) || []);
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: recentLinksData } = await db
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId)
        .gte("created_at", thirtyDaysAgo);

      // Fetch clicks from current period (last 30 days)
      const { data: currentPeriodClicks } = await db
        .from("link_clicks")
        .select("id", { count: 'exact', head: true })
        .in("link_id", linksData?.map((l: any) => l.id) || [])
        .gte("clicked_at", thirtyDaysAgo);

      // Fetch clicks from previous period (30-60 days ago)
      const { data: previousPeriodClicks } = await db
        .from("link_clicks")
        .select("id", { count: 'exact', head: true })
        .in("link_id", linksData?.map((l: any) => l.id) || [])
        .gte("clicked_at", sixtyDaysAgo)
        .lt("clicked_at", thirtyDaysAgo);

      const links = linksData || [];
      const totalLinks = links.length;
      const totalQRCodes = qrData?.length || 0;
      const recentLinksCount = recentLinksData?.length || 0;

      
      let totalClicks = 0;
      let totalUniqueClicks = 0;
      let totalConversions = 0;
      let sumConversionRate = 0;

      for (const link of links) {
        totalClicks += link.total_clicks || 0;
        totalUniqueClicks += link.unique_clicks || 0;
        totalConversions += link.total_conversions || 0;
        sumConversionRate += link.conversion_rate || 0;
      }

      const avgConversionRate = links.length > 0 ? sumConversionRate / links.length : 0;
      
      // Calculate real growth percentage
      const currentClicks = (currentPeriodClicks as any)?.count || 0;
      const previousClicks = (previousPeriodClicks as any)?.count || 0;
      const clicksChange = previousClicks > 0 
        ? ((currentClicks - previousClicks) / previousClicks) * 100 
        : 0;

      return {
        totalLinks,
        totalClicks,
        totalUniqueClicks,
        totalConversions,
        avgConversionRate,
        totalQRCodes,
        recentLinksCount,
        clicksChange,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Total Links</p>
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{metrics.totalLinks.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{metrics.recentLinksCount} this month</p>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
          <MousePointerClick className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{metrics.totalClicks.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{metrics.totalUniqueClicks.toLocaleString()} unique</p>
            {metrics.clicksChange > 0 && (
              <span className="flex items-center text-xs font-medium text-green-600">
                <ArrowUp className="h-3 w-3" />
                {metrics.clicksChange.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">QR Codes</p>
          <QrCodeIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{metrics.totalQRCodes.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Branded codes</p>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{metrics.avgConversionRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">{metrics.totalConversions} conversions</p>
        </div>
      </Card>
    </div>
  );
}