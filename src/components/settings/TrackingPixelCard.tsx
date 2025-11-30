import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackingPixelCardProps {
  workspaceId: string;
}

export function TrackingPixelCard({ workspaceId }: TrackingPixelCardProps) {
  const [copied, setCopied] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pixel configs
  const { data: pixelConfigs, isLoading } = useQuery({
    queryKey: ['pixel-configs', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pixel_configs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create pixel mutation
  const createPixelMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const pixelId = `utm_${Math.random().toString(36).substring(2, 10)}`;
      
      const { error } = await supabase
        .from('pixel_configs')
        .insert({
          workspace_id: workspaceId,
          pixel_id: pixelId,
          created_by: user.id,
          domain_whitelist: [],
        });

      if (error) throw error;
      return pixelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixel-configs', workspaceId] });
      toast({
        title: "Pixel created",
        description: "Your tracking pixel has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add domain mutation
  const addDomainMutation = useMutation({
    mutationFn: async ({ pixelId, domain }: { pixelId: string; domain: string }) => {
      const pixel = pixelConfigs?.find(p => p.pixel_id === pixelId);
      if (!pixel) throw new Error('Pixel not found');

      const currentDomains = pixel.domain_whitelist || [];
      const { error } = await supabase
        .from('pixel_configs')
        .update({ domain_whitelist: [...currentDomains, domain] })
        .eq('id', pixel.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixel-configs', workspaceId] });
      setNewDomain("");
      toast({
        title: "Domain added",
        description: "Domain has been added to whitelist.",
      });
    },
  });

  const activePixel = pixelConfigs?.[0];

  const getPixelSnippet = (pixelId: string) => {
    return `<!-- utm.one Pixel -->
<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${window.location.origin}/functions/v1/pixel.js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');

// Track custom events:
// utmone('track', 'lead');
// utmone('track', 'purchase', { revenue: 99.99 });
</script>`;
  };

  const copySnippet = () => {
    if (!activePixel) return;
    navigator.clipboard.writeText(getPixelSnippet(activePixel.pixel_id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Tracking code copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-system-background border-separator">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-system-blue" />
          <h3 className="text-title-2 font-display font-semibold text-label">Tracking Pixel</h3>
        </div>
        {!activePixel && (
          <Button
            onClick={() => createPixelMutation.mutate()}
            disabled={createPixelMutation.isPending}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Pixel
          </Button>
        )}
      </div>

      {!activePixel ? (
        <div className="text-center py-8">
          <Code2 className="h-12 w-12 text-tertiary-label mx-auto mb-3" />
          <p className="text-body-apple text-secondary-label mb-4">
            Track conversions on your website with the utm.one pixel
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pixel ID */}
          <div>
            <Label className="text-subheadline-apple text-label mb-2">Pixel ID</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-fill-tertiary rounded-md text-body font-mono text-label">
                {activePixel.pixel_id}
              </code>
              <Badge variant="outline" className="bg-system-green/10 text-system-green border-system-green/20">
                Active
              </Badge>
            </div>
          </div>

          {/* Installation Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-subheadline-apple text-label">Installation Code</Label>
              <Button
                variant="system-tertiary"
                size="sm"
                onClick={copySnippet}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 bg-fill-tertiary rounded-lg overflow-x-auto text-caption-1 font-mono text-label">
              {getPixelSnippet(activePixel.pixel_id)}
            </pre>
          </div>

          {/* Domain Whitelist */}
          <div>
            <Label className="text-subheadline-apple text-label mb-2">Domain Whitelist</Label>
            <p className="text-caption-1 text-secondary-label mb-3">
              Only allow tracking from specific domains (optional)
            </p>
            
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => addDomainMutation.mutate({ pixelId: activePixel.pixel_id, domain: newDomain })}
                disabled={!newDomain || addDomainMutation.isPending}
                size="sm"
              >
                Add
              </Button>
            </div>

            {activePixel.domain_whitelist && activePixel.domain_whitelist.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activePixel.domain_whitelist.map((domain) => (
                  <Badge key={domain} variant="outline" className="gap-1">
                    {domain}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-caption-1 text-tertiary-label italic">
                All domains allowed
              </p>
            )}
          </div>

          {/* Usage Example */}
          <div className="p-4 bg-system-blue/5 rounded-lg border border-system-blue/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-system-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-caption-1 font-medium text-label mb-1">Usage Example</p>
                <code className="text-caption-2 font-mono text-secondary-label block">
                  utmone('track', 'purchase', &#123; revenue: 99.99 &#125;);
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}