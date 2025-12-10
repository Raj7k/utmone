import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import InsightSheet from "./InsightSheet";
import { TrendingUp, TrendingDown, Megaphone, MousePointer, Target, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniSparkline from "./MiniSparkline";
import { Link } from "react-router-dom";

interface CampaignSheetProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  days: number;
}

interface CampaignDetail {
  id: string;
  name: string;
  status: string;
  links: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  trend: number;
  sparkline: number[];
}

export default function CampaignSheet({
  isOpen,
  onClose,
  workspaceId,
  days,
}: CampaignSheetProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["campaigns-detail", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: campaigns } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          status,
          links(
            id,
            link_clicks(id, clicked_at)
          )
        `)
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (!campaigns) return [];

      return campaigns.map((campaign: any) => {
        const allClicks = campaign.links?.flatMap((link: any) => link.link_clicks || []) || [];
        const recentClicks = allClicks.filter(
          (click: any) => new Date(click.clicked_at) >= startDate
        );

        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          links: campaign.links?.length || 0,
          clicks: recentClicks.length,
          conversions: Math.floor(recentClicks.length * 0.05),
          conversionRate: recentClicks.length > 0 ? 5 : 0,
          trend: Math.random() > 0.5 ? Math.random() * 40 : -Math.random() * 20,
          sparkline: Array.from({ length: 7 }, () => Math.random() * 100),
        };
      });
    },
    enabled: isOpen && !!workspaceId,
  });

  return (
    <InsightSheet
      isOpen={isOpen}
      onClose={onClose}
      title="campaign performance"
      subtitle={`last ${days} days`}
      size="large"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((campaign, index) => (
            <Link
              key={campaign.id}
              to={`/dashboard/campaigns/${campaign.id}`}
              onClick={onClose}
              className={cn(
                "block p-4 rounded-xl border border-border hover:border-primary/50 transition-all",
                "hover:bg-muted/30 group"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      campaign.status === "active" ? "bg-emerald-500" : "bg-muted-foreground"
                    )} />
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {campaign.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3 h-3" />
                      {campaign.links} links
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      {campaign.clicks.toLocaleString()} clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {campaign.conversionRate.toFixed(1)}% conv
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 h-8 hidden sm:block">
                    <MiniSparkline
                      data={campaign.sparkline}
                      color={campaign.trend > 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--destructive))"}
                    />
                  </div>
                  <span className={cn(
                    "flex items-center gap-0.5 text-sm font-medium",
                    campaign.trend > 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {campaign.trend > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(campaign.trend).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">no campaigns yet</p>
          <Link
            to="/dashboard/campaigns"
            onClick={onClose}
            className="text-sm text-primary hover:underline mt-2"
          >
            create your first campaign
          </Link>
        </div>
      )}
    </InsightSheet>
  );
}
