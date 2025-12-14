import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Loader2, Link as LinkIcon } from "lucide-react";
import { notify } from "@/lib/notify";
import { motion } from "framer-motion";
import { DomainSelectorWithAdd } from "@/components/domains/DomainSelectorWithAdd";
import { useAppSession } from "@/contexts/AppSessionContext";

interface SalesLinkCreatorProps {
  onSuccess: (linkData: { shortUrl: string; prospectName: string; id: string }) => void;
  onCancel?: () => void;
}

export const SalesLinkCreator = ({ onSuccess, onCancel }: SalesLinkCreatorProps) => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const { user } = useAppSession();
  
  const [destinationUrl, setDestinationUrl] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("utm.click");
  const [alertOnClick, setAlertOnClick] = useState(true);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  // Auto-generate slug from prospect name
  useEffect(() => {
    if (prospectName) {
      const generatedSlug = prospectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 20);
      setSlug(generatedSlug);
      setSlugError(null);
    }
  }, [prospectName]);

  // Debounced slug availability check
  useEffect(() => {
    if (!slug || !currentWorkspace) return;
    
    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      try {
        const { data } = await supabase
          .from("links")
          .select("id")
          .eq("slug", slug)
          .eq("workspace_id", currentWorkspace.id)
          .maybeSingle();
        
        if (data) {
          setSlugError("this slug is already in use");
        } else {
          setSlugError(null);
        }
      } catch {
        // Ignore errors
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, currentWorkspace]);

  const createLinkMutation = useMutation({
    mutationFn: async () => {
      if (!user || !currentWorkspace) throw new Error("Not authenticated");

      // Final slug check before insert
      const { data: existing } = await supabase
        .from("links")
        .select("id")
        .eq("slug", slug)
        .eq("workspace_id", currentWorkspace.id)
        .maybeSingle();

      if (existing) {
        throw new Error("this short link already exists. please try a different slug.");
      }

      const domain = selectedDomain;
      const fullDestinationUrl = destinationUrl.startsWith("http") ? destinationUrl : `https://${destinationUrl}`;
      const shortUrl = `https://${domain}/${slug}`;

      const { data, error } = await supabase
        .from("links")
        .insert([{
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          destination_url: fullDestinationUrl,
          final_url: fullDestinationUrl,
          title: prospectName,
          slug,
          domain,
          link_type: "sales",
          prospect_name: prospectName,
          alert_on_click: alertOnClick,
          status: "active",
        }])
        .select()
        .single();

      if (error) throw error;
      return { ...data, domain };
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["sales-links"] });
      queryClient.invalidateQueries({ queryKey: ["sales-activity"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      
      onSuccess({
        shortUrl: `${data.domain}/${data.slug}`,
        prospectName: data.prospect_name || data.title,
        id: data.id,
      });
    },
    onError: (error: Error) => {
      notify.error(error.message || "failed to create link");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationUrl || !prospectName || !slug || slugError) return;
    createLinkMutation.mutate();
  };

  const isValid = destinationUrl && prospectName && slug && !slugError && !isCheckingSlug;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Destination URL */}
      <div className="space-y-2">
        <Label htmlFor="destination" className="text-sm font-medium">
          destination url
        </Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="destination"
            type="url"
            placeholder="https://docs.google.com/presentation/..."
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
        <p className="text-xs text-muted-foreground">
          link to your proposal, deck, quote, or any document
        </p>
      </div>

      {/* Prospect Name */}
      <div className="space-y-2">
        <Label htmlFor="prospect" className="text-sm font-medium">
          prospect name
        </Label>
        <Input
          id="prospect"
          placeholder="e.g., Acme Corp, John Smith"
          value={prospectName}
          onChange={(e) => setProspectName(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          used to identify this link in your dashboard
        </p>
      </div>

      {/* Domain */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">domain</Label>
        <DomainSelectorWithAdd
          value={selectedDomain}
          onChange={setSelectedDomain}
          workspaceId={currentWorkspace?.id || ""}
          className="mt-0"
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-sm font-medium">
          short link
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">{selectedDomain}/</span>
          <Input
            id="slug"
            placeholder="acme-proposal"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              setSlugError(null);
            }}
            className={slugError ? "border-destructive" : ""}
          />
        </div>
        {isCheckingSlug && (
          <p className="text-xs text-muted-foreground">checking availability...</p>
        )}
        {slugError && (
          <p className="text-xs text-destructive">{slugError}</p>
        )}
      </div>

      {/* Alert Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">alert me on click</p>
            <p className="text-xs text-muted-foreground">
              get notified when prospect views
            </p>
          </div>
        </div>
        <Switch
          checked={alertOnClick}
          onCheckedChange={setAlertOnClick}
        />
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!isValid || createLinkMutation.isPending}
          className="flex-1 gap-2"
        >
          {createLinkMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              creating...
            </>
          ) : (
            "create sales link"
          )}
        </Button>
      </div>
    </form>
  );
};
