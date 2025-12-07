import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Copy, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkFeatureAccess } from "@/lib/checkFeatureAccess";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { PlanTier } from "@/lib/planConfig";
import { useActivationTracking } from "@/hooks/useActivationTracking";
import { cn } from "@/lib/utils";

export const HeroInput = () => {
  const [url, setUrl] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeData, setUpgradeData] = useState<any>(null);
  const [createdLink, setCreatedLink] = useState<{ short_url: string; slug: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const { trackFirstLink } = useActivationTracking();

  const createLinkMutation = useMutation({
    mutationFn: async (destinationUrl: string) => {
      if (!currentWorkspace?.id) throw new Error("No workspace selected");

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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
      trackFirstLink();
      await queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      setCreatedLink({ short_url: data.short_url || `utm.one/${data.slug}`, slug: data.slug });
      queryClient.invalidateQueries({ queryKey: ["recent-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error: any) => {
      if (!error.message.includes("Upgrade")) {
        toast.error("Failed to create link", { description: error.message });
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

  const handleCopy = async () => {
    if (createdLink) {
      await navigator.clipboard.writeText(createdLink.short_url);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setUrl("");
    setCreatedLink(null);
  };

  if (!currentWorkspace) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {!createdLink ? (
            <motion.form
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="relative"
            >
              <Input
                type="url"
                placeholder="Paste a link to shorten..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={createLinkMutation.isPending}
                className={cn(
                  "h-16 text-lg px-6 pr-32 rounded-2xl",
                  "bg-zinc-900/60 backdrop-blur-xl border-white/10",
                  "text-white placeholder:text-zinc-500",
                  "focus:border-white/20 focus:ring-2 focus:ring-white/10",
                  "transition-all duration-300"
                )}
              />
              
              <AnimatePresence>
                {url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Button
                      type="submit"
                      disabled={createLinkMutation.isPending}
                      className="h-12 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium"
                    >
                      {createLinkMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Shorten"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-16 px-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-white font-medium">{createdLink.short_url}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <a href={createdLink.short_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-zinc-400 hover:text-white hover:bg-white/10 text-xs"
                >
                  Create another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        {...upgradeData}
      />
    </>
  );
};
