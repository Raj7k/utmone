import { memo, useCallback, useState } from "react";
import { EnhancedLink } from "@/hooks/useEnhancedLinks";
import { LinkHealthScore } from "./LinkHealthScore";
import { LinkInsightBadge } from "./LinkInsightBadge";
import { SentinelBadge } from "@/components/sentinel/SentinelBadge";
import { SentinelSettingsDialog } from "@/components/sentinel/SentinelSettingsDialog";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, BarChart3, ExternalLink, MoreHorizontal, Shield } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface LinkCardProps {
  link: EnhancedLink;
}

export const LinkCard = memo(({ link }: LinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sentinelDialogOpen, setSentinelDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSentinelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSentinelDialogOpen(true);
  }, []);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(link.short_url);
    toast.success("Link copied to clipboard");
  }, [link.short_url]);

  const handleQR = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/links/${link.id}?tab=qr`);
  }, [navigate, link.id]);

  const handleAnalytics = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/links/${link.id}?tab=analytics`);
  }, [navigate, link.id]);

  const handleCardClick = useCallback(() => {
    navigate(`/dashboard/links/${link.id}`);
  }, [navigate, link.id]);

  const handleVisitDestination = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link.destination_url, "_blank");
  }, [link.destination_url]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Header with Health Score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Mini Health Ring */}
          <LinkHealthScore linkId={link.id} compact />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground truncate mb-1">
              {link.title || "untitled link"}
            </h3>
            <p className="text-sm font-mono truncate text-primary">
              {link.short_url}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleQR}>
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleVisitDestination}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Destination
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSentinelClick}>
              <Shield className="h-4 w-4 mr-2" />
              Sentinel Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Destination URL */}
      <p className="text-xs text-muted-foreground mb-3 truncate">
        → {link.destination_url}
      </p>

      {/* Stats & Insights */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-display font-bold text-foreground">
              {(link.total_clicks || 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">total clicks</p>
          </div>
          <div>
            <p className="text-lg font-display font-semibold text-foreground">
              {link.clicks_last_30_days.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">last 30 days</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SentinelBadge 
            enabled={!!(link as any).sentinel_enabled} 
            onClick={handleSentinelClick} 
          />
          <LinkInsightBadge linkId={link.id} />
        </div>
      </div>

      {/* Sentinel Settings Dialog */}
      <SentinelSettingsDialog
        open={sentinelDialogOpen}
        onOpenChange={setSentinelDialogOpen}
        linkId={link.id}
      />

      {/* UTM Tags */}
      {(link.utm_source || link.utm_medium || link.utm_campaign) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {link.utm_source && (
            <Badge variant="secondary" className="text-xs">
              source: {link.utm_source}
            </Badge>
          )}
          {link.utm_medium && (
            <Badge variant="secondary" className="text-xs">
              medium: {link.utm_medium}
            </Badge>
          )}
          {link.utm_campaign && (
            <Badge variant="secondary" className="text-xs">
              campaign: {link.utm_campaign}
            </Badge>
          )}
        </div>
      )}

      {/* Quick Actions (on hover) */}
      {isHovered && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleQR}
          >
            <QrCode className="h-4 w-4 mr-2" />
            qr
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleAnalytics}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            analytics
          </Button>
        </div>
      )}
    </div>
  );
});

LinkCard.displayName = "LinkCard";
