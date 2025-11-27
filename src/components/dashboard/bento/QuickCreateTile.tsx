import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkFeatureAccess } from "@/lib/checkFeatureAccess";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { PlanTier } from "@/lib/planConfig";

export const QuickCreateTile = () => {
  const [url, setUrl] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeData, setUpgradeData] = useState<any>(null);
  const { currentWorkspace } = useWorkspace();
  const { id: currentPlanId } = useCurrentPlan();
  const queryClient = useQueryClient();

  const createLinkMutation = useMutation({
    mutationFn: async (destinationUrl: string) => {
      if (!currentWorkspace?.id) throw new Error("No workspace selected");

      // Check feature access (uses localStorage-based simulation if active)
      const simulatedPlan = localStorage.getItem('SIMULATED_PLAN') as PlanTier | null;
      const accessCheck = await checkFeatureAccess(
        currentWorkspace.id, 
        'create_link',
        simulatedPlan || undefined
      );
      
      if (!accessCheck.allowed) {
        setUpgradeData({
          feature: 'create_link',
          currentUsage: accessCheck.currentUsage,
          limit: accessCheck.limit,
          upgradeToTier: accessCheck.upgradeRequired,
          reason: accessCheck.reason,
        });
        setShowUpgrade(true);
        throw new Error(accessCheck.reason || "Upgrade required");
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate slug from URL
      const urlObj = new URL(destinationUrl);
      const slug = urlObj.pathname.split('/').filter(Boolean).join('-').substring(0, 20) || 
                   Math.random().toString(36).substring(2, 8);

      const { data, error } = await supabase
        .from("links")
        .insert([{
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          destination_url: destinationUrl,
          final_url: destinationUrl,
          slug: slug,
          title: destinationUrl,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Link created", {
        description: `Your short link is ready: ${data.short_url}`,
      });
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["recent-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error: any) => {
      if (!error.message.includes("Upgrade")) {
        toast.error("Failed to create link", {
          description: error.message,
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      new URL(url); // Validate URL
      createLinkMutation.mutate(url);
    } catch {
      toast.error("Invalid URL", {
        description: "Please enter a valid URL starting with http:// or https://",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-display">Quick Create</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="url"
            placeholder="Paste your URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-body-apple"
            disabled={createLinkMutation.isPending}
          />
          
          <Button
            type="submit"
            className="w-full h-12"
            disabled={!url || createLinkMutation.isPending}
          >
            {createLinkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Shorten"
            )}
          </Button>
        </form>

        <p className="text-caption-2 text-tertiary-label mt-3 text-center">
          Paste any URL to create a short link instantly
        </p>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        {...upgradeData}
      />
    </>
  );
};
