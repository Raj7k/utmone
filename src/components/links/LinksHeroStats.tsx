import { TrendingUp, TrendingDown, Link as LinkIcon, BarChart3, Trophy } from "lucide-react";
import { useLinksHeroStats } from "@/hooks/useLinksHeroStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface LinksHeroStatsProps {
  workspaceId: string;
}

export const LinksHeroStats = ({ workspaceId }: LinksHeroStatsProps) => {
  const { data, isLoading } = useLinksHeroStats(workspaceId);

  const handleCopyTopLink = () => {
    if (data?.topPerformer?.shortUrl) {
      navigator.clipboard.writeText(data.topPerformer.shortUrl);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Active Links */}
      <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">active links</p>
            <p className="text-3xl font-display font-bold text-foreground">{data.totalActiveLinks}</p>
          </div>
        </div>
      </div>

      {/* This Week's Clicks */}
      <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">this week's clicks</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-display font-bold text-foreground">
                {data.thisWeekClicks.toLocaleString()}
              </p>
              {data.clickTrend !== 0 && (
                <span className={`flex items-center text-sm font-medium ${
                  data.clickTrend > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {data.clickTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(data.clickTrend)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">top performer</p>
            {data.topPerformer ? (
              <>
                <p className="text-sm font-medium text-foreground truncate">
                  {data.topPerformer.title || data.topPerformer.shortUrl}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {data.topPerformer.totalClicks.toLocaleString()} clicks
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleCopyTopLink}
                  >
                    copy
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">no links yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
