import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";
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
import { useAIAnalyzeUrl } from "@/hooks/useAIAnalyzeUrl";
import { AISuggestionsPanel } from "./AISuggestionsPanel";

import { getCachedWorkspaceId, useAppSession } from "@/contexts/AppSessionContext";

export const QuickCreateTile = () => {
  const [url, setUrl] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeData, setUpgradeData] = useState<any>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [utmApplied, setUtmApplied] = useState(false);
  const [appliedUtm, setAppliedUtm] = useState<{
    campaign?: string;
    content?: string;
    term?: string;
  }>({});
  
  const { currentWorkspace } = useWorkspace();
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";
  const { id: currentPlanId } = useCurrentPlan();
  const queryClient = useQueryClient();
  const { trackFirstLink } = useActivationTracking();
  
  const {
    isAnalyzing,
    suggestions,
    analyzeUrl,
    regenerateUrl,
    clearSuggestions,
  } = useAIAnalyzeUrl();

  // Trigger AI analysis when URL changes (with debounce in hook)
  useEffect(() => {
    if (url) {
      try {
        new URL(url);
        analyzeUrl(url);
      } catch {
        // Invalid URL, don't analyze
      }
    } else {
      clearSuggestions();
      setSelectedSlug(null);
      setUtmApplied(false);
      setAppliedUtm({});
    }
  }, [url, analyzeUrl, clearSuggestions]);

  const handleSelectSlug = (slug: string) => {
    setSelectedSlug(slug === selectedSlug ? null : slug);
  };

  const handleApplyUtm = () => {
    if (suggestions) {
      setAppliedUtm({
        campaign: suggestions.utm_campaign,
        content: suggestions.utm_content,
        term: suggestions.utm_term,
      });
      setUtmApplied(true);
      toast.success("UTM parameters applied");
    }
  };

  const handleRegenerate = () => {
    if (url) {
      regenerateUrl(url);
      setSelectedSlug(null);
    }
  };

  const { user } = useAppSession();

  const createLinkMutation = useMutation({
    mutationFn: async (destinationUrl: string) => {
      if (!currentWorkspace?.id) throw new Error("No workspace selected");
      if (!user) throw new Error("Not authenticated");

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

      // Use AI-selected slug or generate from URL
      const slug = selectedSlug || 
        new URL(destinationUrl).pathname.split('/').filter(Boolean).join('-').substring(0, 20) || 
        Math.random().toString(36).substring(2, 8);

      // Build final URL with UTM if applied
      let finalUrl = destinationUrl;
      if (utmApplied && Object.keys(appliedUtm).length > 0) {
        const urlObj = new URL(destinationUrl);
        if (appliedUtm.campaign) urlObj.searchParams.set('utm_campaign', appliedUtm.campaign);
        if (appliedUtm.content) urlObj.searchParams.set('utm_content', appliedUtm.content);
        if (appliedUtm.term) urlObj.searchParams.set('utm_term', appliedUtm.term);
        finalUrl = urlObj.toString();
      }

      const { data, error } = await supabase
        .from("links")
        .insert([{
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          destination_url: destinationUrl,
          final_url: finalUrl,
          slug: slug,
          title: destinationUrl,
          utm_campaign: utmApplied ? appliedUtm.campaign : undefined,
          utm_content: utmApplied ? appliedUtm.content : undefined,
          utm_term: utmApplied ? appliedUtm.term : undefined,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      trackFirstLink();
      await queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      await queryClient.refetchQueries({ queryKey: ["onboarding-progress"] });
      
      toast.success("Link created", {
        description: `Your short link is ready: ${data.short_url}`,
      });
      setUrl("");
      setSelectedSlug(null);
      setUtmApplied(false);
      setAppliedUtm({});
      clearSuggestions();
      
      queryClient.invalidateQueries({ queryKey: ["recent-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["links-count"] });
      
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
      new URL(url);
      createLinkMutation.mutate(url);
    } catch {
      toast.error("Invalid URL", {
        description: "Please enter a valid URL starting with http:// or https://",
      });
    }
  };

  if (!effectiveWorkspaceId) {
    return <BentoTileSkeleton variant="small" />;
  }

  return (
    <>
      <div data-tour="quick-create" className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="url"
                placeholder="Paste URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 pr-8"
                disabled={createLinkMutation.isPending}
              />
              {isAnalyzing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
              )}
            </div>
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

        {/* AI Suggestions Panel */}
        {suggestions && (
          <AISuggestionsPanel
            suggestions={suggestions}
            isAnalyzing={isAnalyzing}
            onSelectSlug={handleSelectSlug}
            onApplyUtm={handleApplyUtm}
            onRegenerate={handleRegenerate}
            selectedSlug={selectedSlug}
            utmApplied={utmApplied}
          />
        )}

        {/* Recent Tags - only show when no suggestions */}
        {!suggestions && (
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 text-xs rounded-full cursor-pointer transition-colors bg-muted text-muted-foreground hover:bg-accent">
              campaign
            </span>
            <span className="px-2 py-1 text-xs rounded-full cursor-pointer transition-colors bg-muted text-muted-foreground hover:bg-accent">
              social
            </span>
            <span className="px-2 py-1 text-xs rounded-full cursor-pointer transition-colors bg-muted text-muted-foreground hover:bg-accent">
              email
            </span>
          </div>
        )}
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        {...upgradeData}
      />
    </>
  );
};
