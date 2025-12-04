import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspace";
import { formatDistanceToNow } from "date-fns";

export const BentoRecentLinksTile = () => {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const { data: recentLinks, isLoading } = useQuery({
    queryKey: ["recent-links", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Copied", {
      description: "URL copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <h3 className="text-title-3 font-display">Recent Links</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recentLinks || recentLinks.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <h3 className="text-title-3 font-display">Recent Links</h3>
        </div>
        <p className="text-body-apple text-tertiary-label text-center py-8">
          You don't have any links yet. Create your first one above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
        <h3 className="text-title-3 font-display">Recent Links</h3>
      </div>

      <div className="space-y-1">
        {recentLinks.map((link) => (
          <div
            key={link.id}
            className="group flex items-center justify-between gap-3 py-2 px-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/links/${link.id}`)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-body-apple font-medium text-label truncate">
                {link.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-caption-2 text-system-blue truncate">
                  {link.short_url}
                </p>
                <span className="text-caption-2 text-tertiary-label">•</span>
                <span className="text-caption-2 text-tertiary-label whitespace-nowrap">
                  {link.total_clicks || 0} clicks
                </span>
                <span className="text-caption-2 text-tertiary-label">•</span>
                <span className="text-caption-2 text-tertiary-label whitespace-nowrap">
                  {formatDistanceToNow(new Date(link.created_at || ""), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => copyToClipboard(link.short_url || "", e)}
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
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
