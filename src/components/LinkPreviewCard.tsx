import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Shield, ShieldAlert, Lock, Globe } from "lucide-react";
import { TrustBadge } from "./TrustBadge";

interface LinkPreviewCardProps {
  linkId: string;
  destinationUrl: string;
  children: React.ReactNode;
}

export const LinkPreviewCard = ({ linkId, destinationUrl, children }: LinkPreviewCardProps) => {
  const { data: preview, isLoading } = useQuery({
    queryKey: ['link-preview', linkId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-link-preview', {
        body: { linkId, destinationUrl },
      });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-96" 
        side="top"
        aria-label="Link preview information"
      >
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
          </div>
        ) : preview ? (
          <div className="space-y-3">
            {/* Destination URL with favicon */}
            <div className="flex items-start gap-2">
              {preview.favicon_url && (
                <img 
                  src={preview.favicon_url} 
                  alt=""
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-secondary-label truncate" title={destinationUrl}>
                  {destinationUrl}
                </p>
                {preview.page_title && (
                  <p className="text-sm font-medium mt-1">{preview.page_title}</p>
                )}
              </div>
            </div>

            {/* OG Image */}
            {preview.og_image_url && (
              <img 
                src={preview.og_image_url} 
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}

            {/* Security indicators */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {preview.is_ssl_secure && (
                <TrustBadge variant="ssl-secure" size="sm" />
              )}
              {preview.is_safe ? (
                <TrustBadge variant="scanned-safe" size="sm" />
              ) : (
                <TrustBadge variant="threats-detected" size="sm" />
              )}
              <TrustBadge variant="utm-verified" size="sm" />
            </div>
          </div>
        ) : (
          <div className="text-sm text-secondary-label">
            preview not available
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
