import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UTMBuilder } from "./UTMBuilder";
import { useWorkspaceDomains, usePrimaryDomain } from "@/hooks/useDomains";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DomainBadge } from "./DomainBadge";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { OGVariantManager } from "./OGVariantManager";
import { OGVariantAnalytics } from "./OGVariantAnalytics";
import { TargetingRulesManager } from "./links/TargetingRulesManager";
import { Link2, Copy, ExternalLink, AlertCircle as AlertCircleIcon, Shuffle, BarChart3, Eye, Settings, Sparkles, Target, Lock } from "lucide-react";
import { useLinkWebhooks } from "@/hooks/useLinkWebhooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { generateSlugFromTitle } from "@/lib/slugify";
import { suggestUTMSource, suggestUTMMedium, generateUTMCampaignFromTitle } from "@/lib/utmHelpers";
import { Turnstile } from "@marsidev/react-turnstile";

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
  og_title: z.string().max(60).optional(),
  og_description: z.string().max(160).optional(),
  og_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  password: z.string().min(6).optional().or(z.literal("")),
  password_hint: z.string().max(100).optional(),
});

type LinkFormData = z.infer<typeof linkFormSchema>;

interface LinkFormProps {
  workspaceId: string;
  onSuccess?: (linkId: string, shortUrl: string) => void;
}

export const LinkForm = ({ workspaceId, onSuccess }: LinkFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { triggerWebhook } = useLinkWebhooks(workspaceId);
  
  const { data: domains, isLoading: domainsLoading } = useWorkspaceDomains(workspaceId);
  const { data: primaryDomain } = usePrimaryDomain(workspaceId);
  const { preferences, updatePreferences, isLoading: preferencesLoading } = useUserPreferences(workspaceId);
  const [isScanning, setIsScanning] = useState(false);
  
  const verifiedDomains = domains?.filter(d => d.is_verified) || [];
  const defaultDomain = primaryDomain?.domain || verifiedDomains[0]?.domain || "utm.one";
  const [shortUrl, setShortUrl] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [createdLinkId, setCreatedLinkId] = useState<string | null>(null);
  const [slugCheckValue, setSlugCheckValue] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugSource, setSlugSource] = useState<"auto" | "manual">("auto");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      domain: preferences?.preferred_domain || preferences?.last_domain || defaultDomain,
      path: preferences?.preferred_path || preferences?.last_path || "go",
      utm_source: preferences?.last_utm_source || "",
      utm_medium: preferences?.last_utm_medium || "",
      utm_campaign: preferences?.last_utm_campaign || "",
      utm_term: "",
      utm_content: "",
      redirect_type: (preferences?.default_redirect_type as "301" | "302") || "302",
    },
  });

  // Update form defaults when preferences load
  useEffect(() => {
    if (preferences && !form.formState.isDirty) {
      form.reset({
        domain: preferences.preferred_domain || preferences.last_domain || defaultDomain,
        path: preferences.preferred_path || preferences.last_path || "go",
        utm_source: preferences.last_utm_source || "",
        utm_medium: preferences.last_utm_medium || "",
        utm_campaign: preferences.last_utm_campaign || "",
        utm_term: "",
        utm_content: "",
        redirect_type: (preferences.default_redirect_type as "301" | "302") || "302",
      });
    }
  }, [preferences, defaultDomain]);

  const values = form.watch();

  // Check if slug is available
  const { data: slugAvailable, refetch: checkSlugAvailability } = useQuery({
    queryKey: ["slug-check", values.domain, values.path, slugCheckValue],
    queryFn: async () => {
      if (!slugCheckValue || slugCheckValue.length < 3) return null;
      
      const { data, error } = await supabase
        .from("links")
        .select("id, title")
        .eq("domain", values.domain)
        .eq("path", values.path)
        .eq("slug", slugCheckValue)
        .maybeSingle();
      
      if (error) throw error;
      return data ? { available: false, existingLink: data } : { available: true };
    },
    enabled: false,
  });

  // Debounced slug check
  const debouncedSlugCheck = useCallback(
    debounce((slug: string, domain: string, path: string) => {
      if (slug && slug.length >= 3) {
        setSlugCheckValue(slug);
        setIsCheckingSlug(true);
        checkSlugAvailability().finally(() => setIsCheckingSlug(false));
      }
    }, 500),
    [checkSlugAvailability]
  );

  // Watch slug changes for validation
  useEffect(() => {
    const slug = values.slug;
    if (slug && slug.length >= 3) {
      debouncedSlugCheck(slug, values.domain, values.path);
    }
  }, [values.slug, values.domain, values.path, debouncedSlugCheck]);

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title && preferences?.auto_generate_slug !== false) {
        const currentSlug = form.getValues("slug");
        // Only auto-generate if slug is empty or was previously auto-generated
        if (!currentSlug || slugSource === "auto") {
          const generatedSlug = generateSlugFromTitle(value.title);
          form.setValue("slug", generatedSlug);
          setSlugSource("auto");
        }
      }
      
      // Detect manual slug edit
      if (name === "slug" && slugSource === "auto") {
        setSlugSource("manual");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, preferences, slugSource]);

  // Smart UTM suggestions based on title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title && preferences?.auto_populate_utm !== false) {
        const currentSource = form.getValues("utm_source");
        const currentMedium = form.getValues("utm_medium");
        const currentCampaign = form.getValues("utm_campaign");
        
        // Only suggest if fields are empty
        if (!currentSource) {
          const suggested = suggestUTMSource(value.title);
          if (suggested) {
            form.setValue("utm_source", suggested);
          } else if (preferences?.last_utm_source) {
            form.setValue("utm_source", preferences.last_utm_source);
          }
        }
        
        if (!currentMedium) {
          const suggested = suggestUTMMedium(value.title, form.getValues("utm_source") || "");
          if (suggested) {
            form.setValue("utm_medium", suggested);
          } else if (preferences?.last_utm_medium) {
            form.setValue("utm_medium", preferences.last_utm_medium);
          }
        }
        
        if (!currentCampaign) {
          const suggested = generateUTMCampaignFromTitle(value.title);
          if (suggested) {
            form.setValue("utm_campaign", suggested);
          } else if (preferences?.last_utm_campaign) {
            form.setValue("utm_campaign", preferences.last_utm_campaign);
          }
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, preferences]);

  // Generate random slug
  const generateRandomSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 10);
    form.setValue("slug", randomSlug);
    setSlugSource("manual");
  };

  useEffect(() => {
    // Generate preview URLs using Supabase edge function URL
    const slug = values.slug || "your-slug";
    const domain = values.domain || "keka.com";
    const path = values.path || "go";
    
    // Use Supabase edge function URL for actual redirects
    const supabaseProjectId = "whgnsmjdubnvbmarnjfx";
    setShortUrl(`https://${supabaseProjectId}.supabase.co/functions/v1/redirect/${path}/${slug}`);

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
      // URL Scanning
      if (data.destination_url) {
        setIsScanning(true);
        try {
          const { data: scanResult, error: scanError } = await supabase.functions.invoke("scan-url", {
            body: { url: data.destination_url },
          });

          if (scanError) throw scanError;

          if (!scanResult.safe && scanResult.threats && scanResult.threats.length > 0) {
            const proceed = window.confirm(
              `⚠️ Security Warning: This URL was flagged by ${scanResult.threats.length} security vendors. Do you want to proceed?`
            );
            if (!proceed) {
              throw new Error("URL scanning failed security check");
            }
          }
        } finally {
          setIsScanning(false);
        }
      }

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

      // Hash password if provided
      let passwordHash = null;
      if (data.password && data.password.length > 0) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data.password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        passwordHash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

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
          og_title: data.og_title || null,
          og_description: data.og_description || null,
          og_image: data.og_image || null,
          password_hash: passwordHash,
          password_hint: data.password_hint || null,
        })
        .select()
        .single();

      if (error) throw error;
      return link;
    },
    onSuccess: async (link) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      setCreatedLinkId(link.id);
      const supabaseProjectId = "whgnsmjdubnvbmarnjfx";
      const generatedShortUrl = `https://${supabaseProjectId}.supabase.co/functions/v1/redirect/${link.path}/${link.slug}`;
      
      // Reset CAPTCHA for next link creation
      setCaptchaToken(null);
      
      // Trigger webhook
      await triggerWebhook("link.created", {
        link_id: link.id,
        title: link.title,
        short_url: generatedShortUrl,
        destination_url: link.destination_url,
        created_at: link.created_at,
      });
      
      onSuccess?.(link.id, generatedShortUrl);
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
    // Verify CAPTCHA before submission
    if (!captchaToken) {
      toast({
        title: "verification required",
        description: "please complete the security verification",
        variant: "destructive",
      });
      return;
    }

    createLinkMutation.mutate(data);
    
    // Save preferences on successful submission
    updatePreferences({
      last_domain: data.domain,
      last_path: data.path,
      last_utm_source: data.utm_source,
      last_utm_medium: data.utm_medium,
      last_utm_campaign: data.utm_campaign,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="multiple" defaultValue={["basic-info"]} className="space-y-4">
          
          {/* Section 1: Basic Information */}
          <AccordionItem value="basic-info" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Link2 className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-semibold">Basic Information</span>
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">title *</Label>
                <Input
                  id="title"
                  placeholder="name your campaign"
                  className="placeholder:text-muted-foreground"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">description</Label>
                <Textarea
                  id="description"
                  placeholder="optional notes"
                  className="placeholder:text-muted-foreground"
                  rows={2}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="destination_url" className="text-sm font-medium">destination url *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-[10px] text-muted-foreground font-medium">?</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-popover border border-border">
                        <p className="text-sm">add the url you want to track</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="destination_url"
                  type="url"
                  placeholder="https://example.com/page"
                  className="placeholder:text-muted-foreground"
                  {...form.register("destination_url")}
                />
                {form.formState.errors.destination_url && (
                  <p className="text-sm text-destructive">{form.formState.errors.destination_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">domain *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="inline-flex items-center justify-center rounded-full w-4 h-4 bg-muted hover:bg-muted/80 transition-colors">
                          <span className="text-[10px] text-muted-foreground font-medium">?</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-popover border border-border">
                        <p className="text-sm">your domain increases trust and click-through rates.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Select
                    value={form.watch("domain")}
                    onValueChange={(value) => form.setValue("domain", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      <SelectItem value="keka.com">keka.com</SelectItem>
                      <SelectItem value="go.keka.com">go.keka.com</SelectItem>
                      <SelectItem value="events.keka.com">events.keka.com</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <span className="text-muted-foreground">/</span>
                  
                  <Select
                    value={form.watch("path")}
                    onValueChange={(value) => form.setValue("path", value)}
                  >
                    <SelectTrigger className="w-[100px]">
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
                  
                  <span className="text-muted-foreground">/</span>
                  
                  <Input
                    id="slug"
                    placeholder="your-slug"
                    className="flex-1 min-w-[150px] placeholder:text-muted-foreground"
                    {...form.register("slug")}
                  />
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={generateRandomSlug}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover border border-border">
                        <p className="text-sm">generate random slug</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {slugSource === "auto" && values.slug && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    <span>Auto-generated from title. Edit to customize.</span>
                  </div>
                )}
                
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                )}
                {isCheckingSlug && (
                  <p className="text-xs text-muted-foreground">Checking availability...</p>
                )}
                {slugAvailable && !slugAvailable.available && values.slug && (
                  <Alert variant="destructive" className="py-2 mt-2">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      This slug is already used by "{slugAvailable.existingLink.title}".
                      <br />
                      Try: {values.slug}-2, {values.slug}-v2, or click the shuffle button
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: UTM Parameters */}
          <AccordionItem value="utm-params" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span className="font-serif text-lg font-semibold">UTM Parameters</span>
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Recommended</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <UTMBuilder form={form} workspaceId={workspaceId} />
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: Social Media Preview */}
          <AccordionItem value="social-preview" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="font-serif text-lg font-semibold">Social Media Preview</span>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">Customize how your link appears when shared on social media platforms</p>
              
              <div className="space-y-2">
                <Label htmlFor="og_title" className="text-sm font-medium">Social Media Title</Label>
                <Input
                  id="og_title"
                  placeholder="Custom title for social media preview (max 60 chars)"
                  className="placeholder:text-muted-foreground"
                  {...form.register("og_title")}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {form.watch("og_title") ? `${form.watch("og_title").length}/60 characters` : "Leave empty to use link title"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description" className="text-sm font-medium">Social Media Description</Label>
                <Textarea
                  id="og_description"
                  placeholder="Custom description for social media preview (max 160 chars)"
                  className="placeholder:text-muted-foreground"
                  {...form.register("og_description")}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {form.watch("og_description") ? `${form.watch("og_description").length}/160 characters` : "Describe what users will find when they click this link"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image" className="text-sm font-medium">Social Media Image URL</Label>
                <Input
                  id="og_image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="placeholder:text-muted-foreground"
                  {...form.register("og_image")}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200×630px for optimal display on Facebook, Twitter, LinkedIn
                </p>
                {form.formState.errors.og_image && (
                  <p className="text-sm text-destructive">{form.formState.errors.og_image.message}</p>
                )}
              </div>

              {form.watch("og_image") && (
                <Card className="p-4 space-y-2">
                  <p className="text-sm font-medium">Image Preview</p>
                  <img 
                    src={form.watch("og_image")} 
                    alt="Social media preview" 
                    className="w-full max-w-2xl rounded border"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/1200x630?text=Invalid+Image+URL";
                    }}
                  />
                </Card>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Advanced Settings */}
          <AccordionItem value="advanced" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-serif text-lg font-semibold">Advanced Settings</span>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expires_at" className="text-sm font-medium">Expire At Date/Time</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    className="placeholder:text-muted-foreground"
                    {...form.register("expires_at")}
                  />
                  <p className="text-xs text-muted-foreground">Link will expire at this date/time</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_clicks" className="text-sm font-medium">Max Clicks</Label>
                  <Input
                    id="max_clicks"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    className="placeholder:text-muted-foreground"
                    {...form.register("max_clicks", { valueAsNumber: true })}
                  />
                  {form.formState.errors.max_clicks && (
                    <p className="text-sm text-destructive">{form.formState.errors.max_clicks.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Link expires after this many clicks</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback_url" className="text-sm font-medium">Fallback URL (After Expiry)</Label>
                <Input
                  id="fallback_url"
                  type="url"
                  placeholder="https://example.com/expired"
                  className="placeholder:text-muted-foreground"
                  {...form.register("fallback_url")}
                />
                {form.formState.errors.fallback_url && (
                  <p className="text-sm text-destructive">{form.formState.errors.fallback_url.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Redirect to this URL when link expires (optional)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom_expiry_message" className="text-sm font-medium">Custom Expiry Message</Label>
                <Textarea
                  id="custom_expiry_message"
                  placeholder="This link has expired. Please contact us for access."
                  className="placeholder:text-muted-foreground"
                  rows={2}
                  {...form.register("custom_expiry_message")}
                />
                {form.formState.errors.custom_expiry_message && (
                  <p className="text-sm text-destructive">{form.formState.errors.custom_expiry_message.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Show this message when link expires (if no fallback URL)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect_type" className="text-sm font-medium">Redirect Type</Label>
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

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Password Protection</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="leave empty for no password"
                    className="placeholder:text-muted-foreground"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">require password before redirect (minimum 6 characters)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_hint" className="text-sm font-medium">Password Hint (optional)</Label>
                  <Input
                    id="password_hint"
                    placeholder="hint for users who forgot password"
                    className="placeholder:text-muted-foreground"
                    {...form.register("password_hint")}
                  />
                  <p className="text-xs text-muted-foreground">shown on password entry page</p>
                </div>
              </div>

            </AccordionContent>
          </AccordionItem>

          {/* Section 5: Geo & Device Targeting */}
          {createdLinkId && (
            <AccordionItem value="targeting" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <span className="font-serif text-lg font-semibold">Geo & Device Targeting</span>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Redirect users to different URLs based on their location or device
                </p>
                <TargetingRulesManager linkId={createdLinkId} />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Section 6: Smart Defaults & Preferences */}
          <AccordionItem value="preferences" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="font-serif text-lg font-semibold">Smart Defaults</span>
                <Badge variant="secondary" className="text-xs">Preferences</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Auto-generate slug from title</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically create URL-friendly slugs from link titles
                  </p>
                </div>
                <Switch
                  checked={preferences?.auto_generate_slug !== false}
                  onCheckedChange={(checked) => updatePreferences({ auto_generate_slug: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Auto-populate UTM parameters</Label>
                  <p className="text-xs text-muted-foreground">
                    Suggest UTM values based on link title and previous patterns
                  </p>
                </div>
                <Switch
                  checked={preferences?.auto_populate_utm !== false}
                  onCheckedChange={(checked) => updatePreferences({ auto_populate_utm: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preferred Domain</Label>
                <Select
                  value={preferences?.preferred_domain || "__none__"}
                  onValueChange={(value) => updatePreferences({ preferred_domain: value === "__none__" ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Use last used domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Use last used domain</SelectItem>
                    {verifiedDomains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.domain}>
                        {domain.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This domain will be pre-selected when creating new links
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Preferred Path</Label>
                <Select
                  value={preferences?.preferred_path || "__none__"}
                  onValueChange={(value) => updatePreferences({ preferred_path: value === "__none__" ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Use last used path" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Use last used path</SelectItem>
                    <SelectItem value="go">go</SelectItem>
                    <SelectItem value="u">u</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="hr">hr</SelectItem>
                    <SelectItem value="psa">psa</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This path will be pre-selected when creating new links
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
        </Accordion>

        {/* URL Preview - Always Visible */}
        <Card className="p-4 space-y-3 bg-muted/50 border-border">
          <h3 className="font-display text-lg font-semibold text-foreground">Preview</h3>
        
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
            <Label className="text-muted-foreground">Final URL (with UTM)</Label>
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

        {/* Security Verification - Always Visible */}
        <Card className="p-4 space-y-3 bg-muted/50 border-border">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display text-lg font-semibold text-foreground">Security Verification</h3>
          </div>
          
          <div className="flex justify-center py-2">
            <Turnstile
              siteKey="0x4AAAAAAAzJqCI7CySY6Tdb"
              onSuccess={(token) => setCaptchaToken(token)}
              onError={() => setCaptchaToken(null)}
              onExpire={() => setCaptchaToken(null)}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">complete verification to create link</p>
        </Card>

        {/* Submit Buttons - Always Visible */}
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
            {createLinkMutation.isPending ? "creating your link…" : "create link"}
          </Button>
        </div>
      </form>

    {/* A/B Testing Variants - Show after link is created */}
    {createdLinkId && (
      <div className="mt-8 space-y-6">
        <div className="border-t pt-6">
          <h2 className="text-2xl font-display font-bold mb-2">A/B Test Variants</h2>
          <p className="text-muted-foreground mb-6">
            Create multiple Open Graph variants to test which preview generates more clicks
          </p>
          <OGVariantManager linkId={createdLinkId} />
        </div>
        
        <div className="border-t pt-6">
          <OGVariantAnalytics linkId={createdLinkId} />
        </div>
      </div>
    )}
    </>
  );
};
