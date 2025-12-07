import { EnhancedLink } from "@/hooks/useEnhancedLinks";
import { LinkHealthScore } from "./LinkHealthScore";
import { LinkInsightBadge } from "./LinkInsightBadge";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, BarChart3, ExternalLink, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface LinkCardProps {
  link: EnhancedLink;
}

export const LinkCard = ({ link }: LinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(link.short_url);
    toast.success("Link copied to clipboard");
  };

  const handleQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/links/${link.id}?tab=qr`);
  };

  const handleAnalytics = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/links/${link.id}?tab=analytics`);
  };

  const handleCardClick = () => {
    navigate(`/links/${link.id}`);
  };

  return (
    <div
      className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              window.open(link.destination_url, "_blank");
            }}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Destination
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

        <LinkInsightBadge linkId={link.id} />
      </div>

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
};
