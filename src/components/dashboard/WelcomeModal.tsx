// PHASE 23: Removed framer-motion - using pure CSS animations
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Sparkles, ArrowRight, Zap, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { useQuery } from "@tanstack/react-query";
import { useAppSession } from "@/contexts/AppSessionContext";

interface WelcomeModalProps {
  userName?: string;
  onLinkCreated?: () => void;
}

export function WelcomeModal({ userName, onLinkCreated }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const { currentWorkspace, user } = useAppSession();
  const userId = user?.id;
  
  const { data: profile } = useQuery({
    queryKey: ["welcome-modal-check", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("profiles")
        .select("has_seen_welcome_modal")
        .eq("id", userId)
        .single();
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (profile && !profile.has_seen_welcome_modal) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleClose = async () => {
    setIsOpen(false);
    
    if (userId) {
      await supabase
        .from("profiles")
        .update({ has_seen_welcome_modal: true })
        .eq("id", userId);
    }
  };

  const handleCreateLink = async () => {
    if (!url || !currentWorkspace?.id) return;

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }

    try {
      new URL(finalUrl);
    } catch {
      notify.error("please enter a valid URL");
      return;
    }

    setIsCreating(true);

    try {
      if (!user) {
        notify.error("please sign in to create links");
        return;
      }

      const slug = Math.random().toString(36).substring(2, 8);
      
      const { error } = await supabase
        .from('links')
        .insert({
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          destination_url: finalUrl,
          final_url: finalUrl,
          slug,
          title: new URL(finalUrl).hostname,
          status: 'active',
        });

      if (error) throw error;

      setCreatedSlug(slug);
      setIsSuccess(true);
      onLinkCreated?.();

      // Close after showing success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating link:', error);
      notify.error("couldn't create link. please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://utm.one/${createdSlug}`);
      notify.success("copied!");
    } catch {
      notify.error("couldn't copy");
    }
  };

  const firstName = userName?.split(" ")[0] || "there";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border">
        <div className="p-8 space-y-6">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-scale-in">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  welcome, {firstName}!
                </h2>
                <p className="text-muted-foreground">
                  let's create your first link together
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="url"
                    placeholder="paste any URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && url && handleCreateLink()}
                    className="h-12 pl-10 rounded-xl"
                    autoFocus
                  />
                </div>

                {url && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm animate-fade-in">
                    <span className="text-muted-foreground">preview: </span>
                    <span className="font-mono text-foreground">utm.one/</span>
                    <span className="font-mono text-primary">abc123</span>
                  </div>
                )}

                <Button
                  onClick={handleCreateLink}
                  disabled={!url || isCreating}
                  className="w-full h-12"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      creating...
                    </>
                  ) : (
                    <>
                      create my first link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Skip */}
              <div className="text-center">
                <button
                  onClick={handleClose}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  skip for now →
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-4 animate-fade-in animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">
                  link created!
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  your first link is ready
                </p>
              </div>

              <div 
                onClick={handleCopy}
                className="bg-muted/50 rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
              >
                <p className="font-mono text-primary text-lg">
                  utm.one/{createdSlug}
                </p>
                <p className="text-xs text-muted-foreground mt-1">click to copy</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
