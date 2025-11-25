import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { TrustBadge } from "./TrustBadge";
import { SwipeableCard } from "./mobile/SwipeableCard";

interface Link {
  id: string;
  title: string;
  short_url: string | null;
  destination_url: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  domain: string;
  total_clicks: number | null;
  clicks_last_30_days: number;
  status: string | null;
  created_at: string | null;
  security_status: any;
  expires_at: string | null;
  owner?: { full_name: string | null; email: string | null };
}

interface EnhancedLinksTableMobileProps {
  links: Link[];
}

export const EnhancedLinksTableMobile = ({ links }: EnhancedLinksTableMobileProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "URL copied to clipboard" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-system-green/10 text-system-green border-system-green/20">Active</Badge>;
      case "paused":
        return <Badge className="bg-system-orange/10 text-system-orange border-system-orange/20">Paused</Badge>;
      case "archived":
        return <Badge className="bg-system-gray/10 text-system-gray border-system-gray/20">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-3 md:hidden pb-20">
      {links.map((link) => (
        <SwipeableCard
          key={link.id}
          onSwipeRight={() => copyToClipboard(link.short_url || "")}
          onSwipeLeft={() => {
            // Delete logic would go here
            toast({ 
              title: "Delete", 
              description: "Swipe to delete functionality coming soon",
              variant: "destructive" 
            });
          }}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate cursor-pointer hover:underline" onClick={() => navigate(`/links/${link.id}`)}>
                  {link.title}
                </h3>
                <p className="text-xs text-secondary-label truncate">{link.destination_url}</p>
              </div>
              {getStatusBadge(link.status || "active")}
            </div>

            <div className="flex items-center gap-2 mb-3 bg-muted/30 p-2 rounded-md">
              <p className="text-sm font-mono truncate flex-1">{link.short_url}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(link.short_url || "")}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(link.short_url || "", "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1 flex-wrap mb-3">
              {link.destination_url?.startsWith("https://") && <TrustBadge variant="ssl-secure" size="sm" />}
              {link.security_status === "safe" && <TrustBadge variant="scanned-safe" size="sm" />}
            </div>

            <div className="flex items-center justify-between text-sm mb-3">
              <div>
                <span className="font-semibold">{link.total_clicks || 0}</span>
                <span className="text-secondary-label ml-1">clicks</span>
              </div>
              <div className="text-xs text-tertiary-label">
                {formatDistanceToNow(new Date(link.created_at || ""), { addSuffix: true })}
              </div>
            </div>

            {expandedCard === link.id && (
              <div className="space-y-2 pt-3 border-t">
                <div>
                  <p className="text-xs text-secondary-label">UTM</p>
                  <p className="text-sm">{link.utm_source} / {link.utm_medium} / {link.utm_campaign}</p>
                </div>
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/links/${link.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Card>
        </SwipeableCard>
      ))}
    </div>
  );
};
