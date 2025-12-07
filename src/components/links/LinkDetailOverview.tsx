import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Check, Calendar, Settings, FolderTree, Tag, RefreshCw, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState as useReactState } from "react";
import { LinkDetail } from "@/hooks/useLinkDetail";
import { useUpdateLink } from "@/hooks/useUpdateLink";
import { format } from "date-fns";
import { TrustBadge } from "@/components/TrustBadge";
import { generateFieldAriaLabel } from "@/lib/accessibility";
import { cn } from "@/lib/utils";

interface LinkDetailOverviewProps {
  link: LinkDetail;
}

// Parse UTM parameters from a URL
const parseUtmFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return {
      utm_source: urlObj.searchParams.get('utm_source') || '',
      utm_medium: urlObj.searchParams.get('utm_medium') || '',
      utm_campaign: urlObj.searchParams.get('utm_campaign') || '',
      utm_term: urlObj.searchParams.get('utm_term') || '',
      utm_content: urlObj.searchParams.get('utm_content') || '',
    };
  } catch {
    return { utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '' };
  }
};

// Strip UTM params from URL to get base destination
const stripUtmFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString().replace(/\?$/, '');
  } catch {
    return url;
  }
};

export const LinkDetailOverview = ({ link }: LinkDetailOverviewProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isRescanning, setIsRescanning] = useReactState(false);
  const updateLink = useUpdateLink();
  const { toast } = useToast();

  // Parse UTMs from destination URL as fallback when columns are empty
  const parsedUtms = parseUtmFromUrl(link.destination_url);
  const baseDestination = stripUtmFromUrl(link.destination_url);

  const { register, handleSubmit, watch, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      title: link.title,
      description: link.description || "",
      destination_url: baseDestination,
      domain: link.domain,
      path: link.path,
      slug: link.slug,
      status: link.status,
      utm_source: link.utm_source || parsedUtms.utm_source,
      utm_medium: link.utm_medium || parsedUtms.utm_medium,
      utm_campaign: link.utm_campaign || parsedUtms.utm_campaign,
      utm_term: link.utm_term || parsedUtms.utm_term,
      utm_content: link.utm_content || parsedUtms.utm_content,
      og_title: link.og_title || "",
      og_description: link.og_description || "",
      og_image: link.og_image || "",
      redirect_type: link.redirect_type || "302",
      expires_at: link.expires_at || "",
      max_clicks: link.max_clicks || "",
      custom_expiry_message: link.custom_expiry_message || "",
      fallback_url: link.fallback_url || "",
    },
  });

  const watchedFields = watch();

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleRescan = async () => {
    setIsRescanning(true);
    try {
      const { data: scanResult } = await supabase.functions.invoke("scan-url", {
        body: { url: link.destination_url },
        headers: { 'x-link-id': link.id }
      });

      await supabase.functions.invoke("check-blacklist", {
        body: { url: link.destination_url },
        headers: { 'x-link-id': link.id }
      });

      toast({
        title: "re-scan complete",
        description: scanResult?.safe ? "destination is safe ✓" : "potential threats detected",
        variant: scanResult?.safe ? "default" : "destructive",
      });

      // Refresh the page data
      window.location.reload();
    } catch (error) {
      toast({
        title: "re-scan failed",
        description: "please try again later",
        variant: "destructive",
      });
    } finally {
      setIsRescanning(false);
    }
  };

  const onSubmit = (data: any) => {
    updateLink.mutate({
      linkId: link.id,
      ...data,
      max_clicks: data.max_clicks ? Number(data.max_clicks) : null,
      expires_at: data.expires_at || null,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_term: data.utm_term || null,
      utm_content: data.utm_content || null,
      og_title: data.og_title || null,
      og_description: data.og_description || null,
      og_image: data.og_image || null,
      custom_expiry_message: data.custom_expiry_message || null,
      fallback_url: data.fallback_url || null,
    });
  };

  const computedFinalUrl = () => {
    // Strip any existing UTM params from destination to avoid duplication
    const dest = stripUtmFromUrl(watchedFields.destination_url);
    const params = new URLSearchParams();
    if (watchedFields.utm_source) params.append("utm_source", watchedFields.utm_source);
    if (watchedFields.utm_medium) params.append("utm_medium", watchedFields.utm_medium);
    if (watchedFields.utm_campaign) params.append("utm_campaign", watchedFields.utm_campaign);
    if (watchedFields.utm_term) params.append("utm_term", watchedFields.utm_term);
    if (watchedFields.utm_content) params.append("utm_content", watchedFields.utm_content);
    const separator = dest.includes('?') ? '&' : '?';
    return params.toString() ? `${dest}${separator}${params.toString()}` : dest;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Link details form">
      {/* URLs Section */}
      <Card>
        <CardHeader>
          <CardTitle>URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-secondary-label">Short URL</Label>
            <div className="flex items-center gap-2 mt-1">
              <code 
                className="flex-1 px-3 py-2 bg-fill-tertiary rounded-md font-mono text-sm"
                aria-label={`Short URL: ${link.short_url}`}
              >
                {link.short_url}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(link.short_url || "", "short")}
                aria-label="Copy short URL to clipboard"
              >
                {copiedUrl === "short" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(link.short_url || "", "_blank")}
                aria-label="Open short URL in new tab"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex gap-2 mt-3 flex-wrap items-center">
              {link.destination_url?.startsWith('https://') && (
                <TrustBadge variant="ssl-secure" size="sm" />
              )}
              {link.security_status === 'safe' && (
                <TrustBadge variant="scanned-safe" size="sm" />
              )}
              {link.security_status === 'threats_detected' && (
                <TrustBadge variant="threats-detected" size="sm" />
              )}
              {link.security_status === 'not_scanned' && (
                <TrustBadge variant="not-scanned" size="sm" />
              )}
              <TrustBadge variant="utm-verified" size="sm" />
              
              {!link.expires_at && (
                <Badge variant="outline" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Permanent Link
                </Badge>
              )}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRescan}
                disabled={isRescanning}
                className="ml-auto"
              >
                <RefreshCw className={cn("h-3 w-3 mr-1", isRescanning && "animate-spin")} />
                {isRescanning ? "scanning…" : "re-scan"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="destination_url" aria-label={generateFieldAriaLabel("Destination URL", true, "The full URL where this short link redirects to")}>
              Destination URL
            </Label>
            <Input 
              id="destination_url" 
              {...register("destination_url")} 
              className="font-mono text-sm"
              aria-required="true"
              aria-describedby="destination-url-hint"
            />
            <p id="destination-url-hint" className="text-xs text-secondary-label mt-1 sr-only">
              Enter the complete URL including https://
            </p>
          </div>

          <div>
            <Label className="text-sm text-secondary-label">Final URL (with UTMs)</Label>
            <div className="flex items-center gap-2 mt-1">
              <code 
                className="flex-1 px-3 py-2 bg-fill-tertiary rounded-md font-mono text-xs break-all"
                aria-label={`Final URL with UTM parameters: ${computedFinalUrl()}`}
              >
                {computedFinalUrl()}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(computedFinalUrl(), "final")}
                aria-label="Copy final URL with UTM parameters to clipboard"
              >
                {copiedUrl === "final" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* UTM Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>UTM Parameters</CardTitle>
          <CardDescription>Campaign tracking parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="utm_source">Source</Label>
              <Input id="utm_source" {...register("utm_source")} placeholder="e.g., google, newsletter" />
            </div>
            <div>
              <Label htmlFor="utm_medium">Medium</Label>
              <Input id="utm_medium" {...register("utm_medium")} placeholder="e.g., cpc, email" />
            </div>
            <div>
              <Label htmlFor="utm_campaign">Campaign</Label>
              <Input id="utm_campaign" {...register("utm_campaign")} placeholder="e.g., summer_sale" />
            </div>
            <div>
              <Label htmlFor="utm_term">Term</Label>
              <Input id="utm_term" {...register("utm_term")} placeholder="e.g., running+shoes" />
            </div>
          </div>
          <div>
            <Label htmlFor="utm_content">Content</Label>
            <Input id="utm_content" {...register("utm_content")} placeholder="e.g., logolink, textlink" />
          </div>
        </CardContent>
      </Card>

      {/* Link Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Link Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" {...register("domain")} readOnly className="bg-fill-tertiary" />
            </div>
            <div>
              <Label htmlFor="path">Path</Label>
              <Input id="path" {...register("path")} placeholder="go" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={watchedFields.status} onValueChange={(value) => setValue("status", value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="redirect_type">Redirect Type</Label>
              <Select value={watchedFields.redirect_type} onValueChange={(value) => setValue("redirect_type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="302">302 Temporary</SelectItem>
                  <SelectItem value="301">301 Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="max_clicks">Max Clicks</Label>
              <Input id="max_clicks" type="number" {...register("max_clicks")} placeholder="Unlimited" />
            </div>
          </div>

          <div>
            <Label htmlFor="expires_at">Expires At</Label>
            <Input id="expires_at" type="datetime-local" {...register("expires_at")} />
          </div>

          <div>
            <Label htmlFor="fallback_url">Fallback URL</Label>
            <Input id="fallback_url" {...register("fallback_url")} placeholder="Where to redirect after expiry" />
          </div>

          <div>
            <Label htmlFor="custom_expiry_message">Custom Expiry Message</Label>
            <Textarea id="custom_expiry_message" {...register("custom_expiry_message")} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Open Graph Preview</CardTitle>
          <CardDescription>Social media preview settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="og_title">OG Title (max 60 chars)</Label>
            <Input id="og_title" {...register("og_title")} maxLength={60} />
          </div>
          <div>
            <Label htmlFor="og_description">OG Description (max 160 chars)</Label>
            <Textarea id="og_description" {...register("og_description")} maxLength={160} rows={2} />
          </div>
          <div>
            <Label htmlFor="og_image">OG Image URL</Label>
            <Input id="og_image" {...register("og_image")} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-label">Created by:</span>
            <span>{link.owner.full_name || link.owner.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-label">Created at:</span>
            <span>{link.created_at ? format(new Date(link.created_at), "PPP p") : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-label">Last updated:</span>
            <span>{link.updated_at ? format(new Date(link.updated_at), "PPP p") : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-label">Total clicks:</span>
            <span>{link.total_clicks || 0} ({link.unique_clicks || 0} unique)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-label">Last clicked:</span>
            <span>{link.last_clicked_at ? format(new Date(link.last_clicked_at), "PPP p") : "Never"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end" role="group" aria-label="Form actions">
        <Button 
          type="submit" 
          disabled={!isDirty || updateLink.isPending}
          aria-label={updateLink.isPending ? "Saving changes" : "Save changes to link"}
        >
          {updateLink.isPending ? "saving…" : "save"}
        </Button>
      </div>
    </form>
  );
};
