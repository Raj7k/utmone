import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface DomainEditDialogProps {
  domain: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DomainEditDialog({ domain, open, onOpenChange }: DomainEditDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Parse existing domain_settings or use defaults
  const settings = domain?.domain_settings || {};
  const [pathPrefix, setPathPrefix] = useState(settings.path_prefix || "");
  const [fallbackUrl, setFallbackUrl] = useState(settings.fallback_url || "");
  const [redirectType, setRedirectType] = useState(settings.redirect_type || "302");
  const [defaultUtmSource, setDefaultUtmSource] = useState(settings.default_utm_source || "");
  const [defaultUtmMedium, setDefaultUtmMedium] = useState(settings.default_utm_medium || "");
  const [defaultUtmCampaign, setDefaultUtmCampaign] = useState(settings.default_utm_campaign || "");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedSettings = {
        path_prefix: pathPrefix.trim(),
        fallback_url: fallbackUrl.trim(),
        redirect_type: redirectType,
        default_utm_source: defaultUtmSource.trim(),
        default_utm_medium: defaultUtmMedium.trim(),
        default_utm_campaign: defaultUtmCampaign.trim(),
      };

      const { error } = await supabase
        .from("domains")
        .update({ domain_settings: updatedSettings })
        .eq("id", domain.id);

      if (error) throw error;

      toast({
        title: "Domain updated",
        description: "Your domain settings have been saved.",
      });

      queryClient.invalidateQueries({ queryKey: ["workspace-domains"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>edit domain settings</DialogTitle>
          <DialogDescription>
            configure advanced settings for {domain?.domain}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Path Prefix */}
          <div className="space-y-2">
            <Label htmlFor="pathPrefix">path prefix (optional)</Label>
            <Input
              id="pathPrefix"
              placeholder="e.g., /go/ or /u/"
              value={pathPrefix}
              onChange={(e) => setPathPrefix(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              adds a path before the slug. example: domain.com/go/slug
            </p>
          </div>

          {/* Fallback URL */}
          <div className="space-y-2">
            <Label htmlFor="fallbackUrl">fallback url (optional)</Label>
            <Input
              id="fallbackUrl"
              placeholder="https://yourdomain.com"
              value={fallbackUrl}
              onChange={(e) => setFallbackUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              where to redirect when a short link doesn't exist
            </p>
          </div>

          {/* Redirect Type */}
          <div className="space-y-2">
            <Label htmlFor="redirectType">redirect type</Label>
            <Select value={redirectType} onValueChange={setRedirectType}>
              <SelectTrigger id="redirectType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="302">302 (temporary)</SelectItem>
                <SelectItem value="301">301 (permanent)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              301 is cached by browsers, 302 allows tracking changes
            </p>
          </div>

          {/* Default UTM Parameters */}
          <div className="space-y-4">
            <div>
              <Label className="text-base">default utm parameters (optional)</Label>
              <p className="text-xs text-muted-foreground mt-1">
                these values will be pre-filled when creating links with this domain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultUtmSource">utm_source</Label>
                <Input
                  id="defaultUtmSource"
                  placeholder="e.g., newsletter"
                  value={defaultUtmSource}
                  onChange={(e) => setDefaultUtmSource(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultUtmMedium">utm_medium</Label>
                <Input
                  id="defaultUtmMedium"
                  placeholder="e.g., email"
                  value={defaultUtmMedium}
                  onChange={(e) => setDefaultUtmMedium(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="defaultUtmCampaign">utm_campaign</Label>
                <Input
                  id="defaultUtmCampaign"
                  placeholder="e.g., spring-sale-2025"
                  value={defaultUtmCampaign}
                  onChange={(e) => setDefaultUtmCampaign(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
