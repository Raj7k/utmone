import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { notify } from "@/lib/notify";

interface FirstRunExperienceProps {
  onLinkCreated: () => void;
}

export const FirstRunExperience = ({ onLinkCreated }: FirstRunExperienceProps) => {
  const [url, setUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [previewSlug, setPreviewSlug] = useState("");
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceContext();

  // Generate preview slug as user types
  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.length > 10) {
      // Generate a random-ish preview slug
      const randomPart = Math.random().toString(36).substring(2, 8);
      setPreviewSlug(randomPart);
    } else {
      setPreviewSlug("");
    }
  };

  const handleCreateLink = async () => {
    if (!url || !currentWorkspace?.id) return;

    // Basic URL validation
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
      const { data: { user } } = await supabase.auth.getUser();
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
          short_url: `utm.one/${slug}`,
          status: 'active',
        });

      if (error) throw error;

      onLinkCreated();
    } catch (error) {
      console.error('Error creating link:', error);
      notify.error("couldn't create link. please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url) {
      handleCreateLink();
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3"
        >
          create your first link
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground mb-8"
        >
          paste any URL and see the magic happen
        </motion.p>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="url"
              placeholder="paste your URL here..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 pl-12 pr-4 text-lg rounded-2xl border-border bg-card focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>

          {/* Preview */}
          {previewSlug && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-muted/50 rounded-xl p-4 text-left"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">your short link</p>
              <p className="text-lg font-mono text-foreground">
                utm.one/<span className="text-primary">{previewSlug}</span>
              </p>
            </motion.div>
          )}

          {/* CTA Button */}
          <Button
            onClick={handleCreateLink}
            disabled={!url || isCreating}
            size="lg"
            className="w-full h-14 text-lg rounded-2xl"
          >
            {isCreating ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                creating...
              </>
            ) : (
              <>
                create link
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {/* Demo suggestion */}
          <p className="text-sm text-muted-foreground">
            try with{" "}
            <button
              onClick={() => handleUrlChange("https://google.com")}
              className="text-primary hover:underline"
            >
              google.com
            </button>
            {" "}or any URL you like
          </p>
        </motion.div>

        {/* Skip option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate('/dashboard/links')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            or explore the dashboard first →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};