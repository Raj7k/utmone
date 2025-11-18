import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UTMBuilder } from "./UTMBuilder";
import { Card } from "@/components/ui/card";
import { Link2, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const linkFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  destination_url: z.string().url("Must be a valid URL"),
  domain: z.string().min(1, "Domain is required"),
  path: z.string().min(1, "Path is required"),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  utm_source: z.string().min(1, "Source is required"),
  utm_medium: z.string().min(1, "Medium is required"),
  utm_campaign: z.string().min(1, "Campaign is required"),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  expires_at: z.string().optional(),
  max_clicks: z.number().min(1).optional(),
  fallback_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  redirect_type: z.enum(["301", "302"]).default("302"),
  custom_expiry_message: z.string().max(200).optional(),
});

type LinkFormData = z.infer<typeof linkFormSchema>;

interface LinkFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export const LinkForm = ({ workspaceId, onSuccess }: LinkFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [shortUrl, setShortUrl] = useState("");
  const [finalUrl, setFinalUrl] = useState("");

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      domain: "keka.com",
      path: "go",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      redirect_type: "302",
    },
  });

  const values = form.watch();

  useEffect(() => {
    // Generate preview URLs
    const slug = values.slug || "your-slug";
    const domain = values.domain || "keka.com";
    const path = values.path || "go";
    
    setShortUrl(`https://${domain}/${path}/${slug}`);

    if (values.destination_url) {
      try {
        const url = new URL(values.destination_url);
        const params = new URLSearchParams();
        
        if (values.utm_source) params.set("utm_source", values.utm_source);
        if (values.utm_medium) params.set("utm_medium", values.utm_medium);
        if (values.utm_campaign) params.set("utm_campaign", values.utm_campaign);
        if (values.utm_term) params.set("utm_term", values.utm_term);
        if (values.utm_content) params.set("utm_content", values.utm_content);

        const finalUrlString = `${url.origin}${url.pathname}${url.search ? url.search + "&" : "?"}${params.toString()}`;
        setFinalUrl(finalUrlString);
      } catch {
        setFinalUrl("");
      }
    }
  }, [values]);

  const createLinkMutation = useMutation({
    mutationFn: async (data: LinkFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = data.slug || Math.random().toString(36).substring(2, 8);
      const shortUrlFinal = `https://${data.domain}/${data.path}/${slug}`;
      
      const url = new URL(data.destination_url);
      const params = new URLSearchParams();
      params.set("utm_source", data.utm_source);
      params.set("utm_medium", data.utm_medium);
      params.set("utm_campaign", data.utm_campaign);
      if (data.utm_term) params.set("utm_term", data.utm_term);
      if (data.utm_content) params.set("utm_content", data.utm_content);

      const finalUrlFinal = `${url.origin}${url.pathname}${url.search ? url.search + "&" : "?"}${params.toString()}`;

      const { data: link, error } = await supabase
        .from("links")
        .insert({
          workspace_id: workspaceId,
          created_by: user.id,
          title: data.title,
          description: data.description,
          destination_url: data.destination_url,
          domain: data.domain,
          path: data.path,
          slug,
          short_url: shortUrlFinal,
          final_url: finalUrlFinal,
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign,
          utm_term: data.utm_term,
          utm_content: data.utm_content,
          expires_at: data.expires_at || null,
          max_clicks: data.max_clicks || null,
          fallback_url: data.fallback_url || null,
          redirect_type: data.redirect_type,
          custom_expiry_message: data.custom_expiry_message || null,
        })
        .select()
        .single();

      if (error) throw error;
      return link;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast({
        title: "Link created",
        description: "Your short link has been created successfully.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LinkFormData) => {
    createLinkMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Link Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Summer Campaign Landing Page"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Internal notes about this link"
            rows={2}
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination_url">Destination URL *</Label>
          <Input
            id="destination_url"
            type="url"
            placeholder="https://example.com/landing-page"
            {...form.register("destination_url")}
          />
          {form.formState.errors.destination_url && (
            <p className="text-sm text-destructive">{form.formState.errors.destination_url.message}</p>
          )}
        </div>
      </div>

      {/* Short URL Configuration */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">Short URL Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Select
              value={form.watch("domain")}
              onValueChange={(value) => form.setValue("domain", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keka.com">keka.com</SelectItem>
                <SelectItem value="go.keka.com">go.keka.com</SelectItem>
                <SelectItem value="events.keka.com">events.keka.com</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Path *</Label>
            <Select
              value={form.watch("path")}
              onValueChange={(value) => form.setValue("path", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="go">go</SelectItem>
                <SelectItem value="u">u</SelectItem>
                <SelectItem value="l">l</SelectItem>
                <SelectItem value="hr">hr</SelectItem>
                <SelectItem value="psa">psa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Custom Slug</Label>
            <Input
              id="slug"
              placeholder="auto-generated"
              {...form.register("slug")}
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* UTM Builder */}
      <UTMBuilder form={form} workspaceId={workspaceId} />

      {/* Expiration & Advanced Settings */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">Expiration & Advanced Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expires_at">Expire At Date/Time</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              {...form.register("expires_at")}
            />
            <p className="text-xs text-muted-foreground">Link will expire at this date/time</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_clicks">Max Clicks</Label>
            <Input
              id="max_clicks"
              type="number"
              min="1"
              placeholder="Unlimited"
              {...form.register("max_clicks", { valueAsNumber: true })}
            />
            {form.formState.errors.max_clicks && (
              <p className="text-sm text-destructive">{form.formState.errors.max_clicks.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Link expires after this many clicks</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fallback_url">Fallback URL (After Expiry)</Label>
          <Input
            id="fallback_url"
            type="url"
            placeholder="https://example.com/expired"
            {...form.register("fallback_url")}
          />
          {form.formState.errors.fallback_url && (
            <p className="text-sm text-destructive">{form.formState.errors.fallback_url.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Redirect to this URL when link expires (optional)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom_expiry_message">Custom Expiry Message</Label>
          <Textarea
            id="custom_expiry_message"
            placeholder="This link has expired. Please contact us for access."
            rows={2}
            {...form.register("custom_expiry_message")}
          />
          {form.formState.errors.custom_expiry_message && (
            <p className="text-sm text-destructive">{form.formState.errors.custom_expiry_message.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Show this message when link expires (if no fallback URL)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirect_type">Redirect Type</Label>
          <Select
            value={form.watch("redirect_type")}
            onValueChange={(value) => form.setValue("redirect_type", value as "301" | "302")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="302">302 (Temporary)</SelectItem>
              <SelectItem value="301">301 (Permanent)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Use 302 for campaigns, 301 for permanent redirects</p>
        </div>
      </div>

      {/* URL Preview */}
      <Card className="p-4 space-y-3 bg-muted/50 border-border">
        <h3 className="font-serif text-lg font-semibold text-foreground">Preview</h3>
        
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Short URL</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-background rounded-md border border-border font-mono text-sm text-foreground truncate">
              {shortUrl}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(shortUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {finalUrl && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Final URL (with UTM)</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-background rounded-md border border-border font-mono text-xs text-foreground truncate">
                {finalUrl}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(finalUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={createLinkMutation.isPending}
        >
          <Link2 className="h-4 w-4 mr-2" />
          {createLinkMutation.isPending ? "Creating..." : "Create Link"}
        </Button>
      </div>
    </form>
  );
};
