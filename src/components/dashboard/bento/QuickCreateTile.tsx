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
import { BentoTileSkeleton } from "./BentoTileSkeleton";
import { useActivationTracking } from "@/hooks/useActivationTracking";

export const QuickCreateTile = () => {
  const [url, setUrl] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeData, setUpgradeData] = useState<any>(null);
  const { currentWorkspace } = useWorkspace();
  const { id: currentPlanId } = useCurrentPlan();
  const queryClient = useQueryClient();
  const { trackFirstLink } = useActivationTracking();

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
    onSuccess: async (data) => {
      // Track first link for onboarding
      trackFirstLink();
      
      // Invalidate and refetch onboarding progress immediately
      await queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      await queryClient.refetchQueries({ queryKey: ["onboarding-progress"] });
      
      toast.success("Link created", {
        description: `Your short link is ready: ${data.short_url}`,
      });
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["recent-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      
      // Auto-scroll to recent links section
      setTimeout(() => {
        const recentLinksSection = document.getElementById("recent-links");
        if (recentLinksSection) {
          recentLinksSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
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

  if (!currentWorkspace) {
    return <BentoTileSkeleton variant="small" />;
  }

  return (
    <>
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-12"
              disabled={createLinkMutation.isPending}
            />
            <Button
              type="submit"
              className="h-12 px-6"
              disabled={!url || createLinkMutation.isPending}
            >
              {createLinkMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Shorten"
              )}
            </Button>
          </div>
        </form>

        {/* Recent Tags */}
        <div className="flex gap-2 mt-3">
          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            campaign
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            social
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            email
          </span>
        </div>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        {...upgradeData}
      />
    </>
  );
};
