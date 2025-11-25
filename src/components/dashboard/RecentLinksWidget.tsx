import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LinkPreviewCard } from "../LinkPreviewCard";
import { TrustBadge } from "../TrustBadge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RecentLinksWidgetProps {
  workspaceId: string;
}

export const RecentLinksWidget = ({ workspaceId }: RecentLinksWidgetProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: recentLinks, isLoading } = useQuery({
    queryKey: ["recent-links", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <Card variant="grouped">
        <CardContent className="py-8">
          <p className="text-secondary-label text-center">loading recent links…</p>
        </CardContent>
      </Card>
    );
  }

  if (!recentLinks || recentLinks.length === 0) {
    return null;
  }

  return (
    <Card variant="grouped">
      <CardHeader>
        <CardTitle className="text-title-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-system-blue" />
          Recent Links
        </CardTitle>
        <CardDescription>Your recently created short links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-start justify-between gap-4 p-3 rounded-lg border border-separator bg-system-background hover:bg-fill-tertiary transition-apple cursor-pointer"
              onClick={() => navigate(`/links/${link.id}`)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-body-apple font-medium text-label truncate">
                    {link.title}
                  </h4>
                  <span className="text-caption-1 text-tertiary-label whitespace-nowrap">
                    {formatDistanceToNow(new Date(link.created_at || ""), { addSuffix: true })}
                  </span>
                </div>
                
                <LinkPreviewCard linkId={link.id} destinationUrl={link.destination_url}>
                  <div className="text-caption-1 text-system-blue hover:underline cursor-help truncate">
                    {link.short_url}
                  </div>
                </LinkPreviewCard>

                <div className="flex items-center gap-1 mt-2">
                  {link.destination_url?.startsWith('https://') && (
                    <TrustBadge variant="ssl-secure" size="sm" />
                  )}
                  {link.security_status === 'safe' && (
                    <TrustBadge variant="scanned-safe" size="sm" />
                  )}
                  {link.security_status === 'threats_detected' && (
                    <TrustBadge variant="threats-detected" size="sm" />
                  )}
                  {link.security_status === 'not_scanned' && (
                    <TrustBadge variant="not-scanned" size="sm" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(link.short_url || "");
                  }}
                  aria-label="Copy short URL"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(link.short_url || "", "_blank");
                  }}
                  aria-label="Open short URL"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="system-secondary"
          className="w-full mt-4"
          onClick={() => navigate("/links")}
        >
          view all links
        </Button>
      </CardContent>
    </Card>
  );
};
