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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useVerifyDomain } from "@/hooks/useVerifyDomain";
import { Loader2, Copy, Check, CheckCircle2, HelpCircle, AlertCircle } from "lucide-react";

interface DomainEditDialogProps {
  domain: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DomainEditDialog({ domain, open, onOpenChange }: DomainEditDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const verifyDomainMutation = useVerifyDomain();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);

  // Parse existing domain_settings or use defaults
  const settings = domain?.domain_settings || {};
  const [pathPrefix, setPathPrefix] = useState(settings.path_prefix || "");
  const [fallbackUrl, setFallbackUrl] = useState(settings.fallback_url || "");
  const [redirectType, setRedirectType] = useState(settings.redirect_type || "302");
  const [defaultUtmSource, setDefaultUtmSource] = useState(settings.default_utm_source || "");
  const [defaultUtmMedium, setDefaultUtmMedium] = useState(settings.default_utm_medium || "");
  const [defaultUtmCampaign, setDefaultUtmCampaign] = useState(settings.default_utm_campaign || "");

  const isVerified = domain?.is_verified;
  const verificationCode = domain?.verification_code;

  const handleCopy = async (text: string, type: 'txt' | 'cname') => {
    await navigator.clipboard.writeText(text);
    if (type === 'txt') {
      setCopiedTxt(true);
      setTimeout(() => setCopiedTxt(false), 2000);
    } else {
      setCopiedCname(true);
      setTimeout(() => setCopiedCname(false), 2000);
    }
  };

  const handleVerify = () => {
    verifyDomainMutation.mutate(domain.id);
  };

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>edit domain settings</DialogTitle>
          <DialogDescription>
            configure advanced settings for {domain?.domain}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* DNS Verification Section - Only show for unverified domains */}
          {!isVerified && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">domain not verified</span>
              </div>

              <p className="text-sm text-muted-foreground">
                add these DNS records to your domain registrar to verify ownership:
              </p>

              {/* TXT Record */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">TXT Record</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={`_utm-verification.${domain?.domain}`}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(`_utm-verification.${domain?.domain}`, 'txt')}
                        >
                          {copiedTxt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={verificationCode || ""}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(verificationCode || "", 'txt')}
                        >
                          {copiedTxt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CNAME Record */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide">CNAME Record (optional for go.utm.one)</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value="@"
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy("@", 'cname')}
                        >
                          {copiedCname ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value="go.utm.one"
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy("go.utm.one", 'cname')}
                        >
                          {copiedCname ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleVerify}
                disabled={verifyDomainMutation.isPending}
                className="w-full"
              >
                {verifyDomainMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                verify domain
              </Button>
            </div>
          )}

          {/* Verified Badge */}
          {isVerified && (
            <div className="flex items-center gap-2 p-3 border border-green-500/20 rounded-lg bg-green-500/10">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">domain verified ✓</span>
            </div>
          )}
          {/* Path Prefix */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="pathPrefix">path prefix (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      adds a path segment before the slug. useful for organizing links by category or team.
                      example: domain.com/go/slug or domain.com/team/slug
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="fallbackUrl">fallback url (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      when someone visits a short link that doesn't exist (404), redirect them here instead.
                      great for sending users to your homepage or a custom 404 page instead of showing an error.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="redirectType">redirect type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      <strong>302 (temporary):</strong> recommended for most cases. allows analytics tracking and lets you change destinations later.
                      <br/><br/>
                      <strong>301 (permanent):</strong> better for SEO if the destination never changes. browsers cache it, so analytics may be incomplete.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center gap-2">
              <Label className="text-base">default utm parameters (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      set default UTM values for this domain. they'll automatically pre-fill when creating new links,
                      saving time and ensuring consistency across your team's campaigns.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground">
              these values will be pre-filled when creating links with this domain
            </p>

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
