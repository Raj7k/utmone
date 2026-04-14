import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FormTrackingWizard } from "@/components/tracking/FormTrackingWizard";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackingPixelCardProps {
  workspaceId: string;
}

export function TrackingPixelCard({ workspaceId }: TrackingPixelCardProps) {
  const [copied, setCopied] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [showFormTracking, setShowFormTracking] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pixel config - auto-created by database trigger on workspace creation
  const { data: pixelConfig, isLoading } = useQuery({
    queryKey: ['pixel-config', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('pixel_configs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Add domain mutation
  const addDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      if (!pixelConfig) throw new Error('Pixel not found');

      const currentDomains = pixelConfig.domain_whitelist || [];
      const { error } = await supabaseFrom('pixel_configs')
        .update({ domain_whitelist: [...currentDomains, domain] })
        .eq('id', pixelConfig.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixel-config', workspaceId] });
      setNewDomain("");
      toast({
        title: "Domain added",
        description: "Domain has been added to whitelist.",
      });
    },
  });

  // Remove domain mutation
  const removeDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      if (!pixelConfig) throw new Error('Pixel not found');

      const currentDomains = pixelConfig.domain_whitelist || [];
      const { error } = await supabaseFrom('pixel_configs')
        .update({ domain_whitelist: currentDomains.filter((d: string) => d !== domain) })
        .eq('id', pixelConfig.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixel-config', workspaceId] });
      toast({
        title: "Domain removed",
        description: "Domain has been removed from whitelist.",
      });
    },
  });

  const getPixelSnippet = (pixelId: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `<!-- utm.one Pixel -->
<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');

// Track custom events:
// utmone('track', 'lead');
// utmone('track', 'purchase', { revenue: 99.99 });

// Identify users (on login/signup success):
// utmone('identify', 'user@email.com', 'User Name');
</script>`;
  };

  const copySnippet = () => {
    if (!pixelConfig) return;
    navigator.clipboard.writeText(getPixelSnippet(pixelConfig.pixel_id));
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

  if (!pixelConfig) {
    return (
      <Card className="p-6 bg-system-background border-separator">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="h-5 w-5 text-system-blue" />
          <h3 className="text-title-2 font-display font-semibold text-label">Tracking Pixel</h3>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-system-orange mx-auto mb-3" />
          <p className="text-body-apple text-secondary-label">
            Unable to load pixel configuration. Please refresh the page.
          </p>
        </div>
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
        <Badge variant="outline" className="bg-system-green/10 text-system-green border-system-green/20">
          Active
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Pixel ID */}
        <div>
          <Label className="text-subheadline-apple text-label mb-2">Pixel ID</Label>
          <code className="block px-3 py-2 bg-fill-tertiary rounded-md text-body font-mono text-label">
            {pixelConfig.pixel_id}
          </code>
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
            {getPixelSnippet(pixelConfig.pixel_id)}
          </pre>
          <p className="text-caption-1 text-secondary-label mt-2">
            Paste this code in your website's <code className="font-mono">&lt;head&gt;</code> tag
          </p>
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
              onClick={() => addDomainMutation.mutate(newDomain)}
              disabled={!newDomain || addDomainMutation.isPending}
              size="sm"
            >
              Add
            </Button>
          </div>

          {pixelConfig.domain_whitelist && pixelConfig.domain_whitelist.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pixelConfig.domain_whitelist.map((domain: string) => (
                <Badge 
                  key={domain} 
                  variant="outline" 
                  className="gap-1 cursor-pointer hover:bg-destructive/10"
                  onClick={() => removeDomainMutation.mutate(domain)}
                >
                  {domain}
                  <span className="text-xs">×</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-caption-1 text-tertiary-label italic">
              All domains allowed
            </p>
          )}
        </div>

        {/* Usage Examples */}
        <div className="space-y-3">
          <div className="p-4 bg-system-blue/5 rounded-lg border border-system-blue/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-system-blue flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-caption-1 font-medium text-label">Track Conversions</p>
                <code className="text-caption-2 font-mono text-secondary-label block">
                  utmone('track', 'purchase', &#123; revenue: 99.99 &#125;);
                </code>
              </div>
            </div>
          </div>

          <div className="p-4 bg-system-green/5 rounded-lg border border-system-green/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-system-green flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-caption-1 font-medium text-label">Identify Users</p>
                <p className="text-caption-2 text-secondary-label mb-2">
                  Call on login success or thank you pages:
                </p>
                <code className="text-caption-2 font-mono text-secondary-label block">
                  utmone('identify', 'user@email.com', 'User Name');
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Form Tracking Toggle */}
        <div className="pt-4 border-t border-separator">
          <Button
            variant="ghost"
            className="w-full justify-between text-left"
            onClick={() => setShowFormTracking(!showFormTracking)}
          >
            <span className="text-subheadline-apple font-medium text-label">
              Form Conversion Tracking
            </span>
            {showFormTracking ? (
              <ChevronUp className="h-4 w-4 text-secondary-label" />
            ) : (
              <ChevronDown className="h-4 w-4 text-secondary-label" />
            )}
          </Button>
          
          {showFormTracking && pixelConfig && (
            <div className="mt-4">
              <FormTrackingWizard pixelId={pixelConfig.pixel_id} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
