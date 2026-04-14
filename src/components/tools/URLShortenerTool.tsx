import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateSlugFromTitle } from "@/lib/slugify";
import { useLinkWebhooks } from "@/hooks/useLinkWebhooks";
import { LinkSuccessCard } from "@/components/shared/LinkSuccessCard";
import { DestinationRotator } from "@/components/links/DestinationRotator";
import { Destination } from "@/hooks/useSmartRotator";
import type { Json } from "@/integrations/supabase/types";
import { useAIAnalyzeUrl } from "@/hooks/useAIAnalyzeUrl";
import { LinkQualityScore } from "@/components/ai/LinkQualityScore";
import { SlugCycleInput } from "@/components/ai/SlugCycleInput";
import { motion, AnimatePresence } from "framer-motion";
import { DomainSelectorWithAdd } from "@/components/domains/DomainSelectorWithAdd";

const shortenerSchema = z.object({
  url: z.string().url("enter a valid url"),
  title: z.string().min(1, "title is required"),
  slug: z.string().min(3, "slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "only lowercase letters, numbers, and hyphens"),
  expires_at: z.string().optional(),
  max_clicks: z.number().min(1, "must be at least 1").max(10000000, "cannot exceed 10 million").optional().or(z.literal(NaN)),
  fallback_url: z.string().url().optional().or(z.literal("")),
});

type ShortenerFormData = z.infer<typeof shortenerSchema>;

interface URLShortenerToolProps {
  workspaceId: string;
  initialURL?: string;
  onGenerateQR?: (shortUrl: string) => void;
}

export const URLShortenerTool = ({ workspaceId, initialURL, onGenerateQR }: URLShortenerToolProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { triggerWebhook } = useLinkWebhooks(workspaceId);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [shortURL, setShortURL] = useState<string>("");
  const [createdLinkId, setCreatedLinkId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("utm.click");
  
  // Feature 4: Smart Link Rotator state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [smartRotate, setSmartRotate] = useState<boolean>(false);
  const [contextualRouting, setContextualRouting] = useState<boolean>(false);
  
  // AI Analysis
  const { isAnalyzing, suggestions: aiSuggestions, analyzeUrl, regenerateUrl } = useAIAnalyzeUrl();
  const [usedAISlug, setUsedAISlug] = useState(false);
  const [currentAnalyzedUrl, setCurrentAnalyzedUrl] = useState<string>("");

  // Domain selection is now handled by DomainSelectorWithAdd component

  const form = useForm<ShortenerFormData>({
    resolver: zodResolver(shortenerSchema),
    defaultValues: {
      url: initialURL || "",
      title: "",
      slug: "",
    },
  });

  const values = form.watch();

  // Auto-generate slug from title AND trigger AI analysis on URL change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title) {
        const generatedSlug = generateSlugFromTitle(value.title);
        form.setValue("slug", generatedSlug);
      }
      
      // Trigger AI analysis when URL changes (typed or pasted)
      if (name === "url" && value.url) {
        try {
          new URL(value.url);
          if (value.url !== currentAnalyzedUrl) {
            setCurrentAnalyzedUrl(value.url);
            analyzeUrl(value.url);
          }
        } catch {
          // Invalid URL, skip analysis
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, analyzeUrl, currentAnalyzedUrl]);

  // Handle URL paste for immediate AI analysis (faster than watch debounce)
  const handleUrlPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData('text');
    
    try {
      new URL(pastedUrl);
      setCurrentAnalyzedUrl(pastedUrl);
      analyzeUrl(pastedUrl);
    } catch {
      // Invalid URL
    }
  };

  // Wand button works with current URL in form (not just previously analyzed)
  const handleRegenerateSlugSuggestions = () => {
    const url = form.getValues("url");
    if (url) {
      try {
        new URL(url);
        setCurrentAnalyzedUrl(url);
        regenerateUrl(url);
      } catch {
        // Invalid URL - show toast
        toast({
          title: "enter a valid url first",
          description: "paste or type a url to generate ai slugs",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "enter a url first",
        description: "paste or type a url to generate ai slugs",
        variant: "destructive",
      });
    }
  };

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (values.slug && values.slug.length >= 3) {
        const { data } = await (supabase as any)
          .from("links")
          .select("id")
          .eq("domain", selectedDomain)
          .eq("path", "")
          .eq("slug", values.slug)
          .maybeSingle();

        setSlugAvailable(!data);
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [values.slug, selectedDomain]);


  const createLinkMutation = useMutation({
    mutationFn: async (data: ShortenerFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

      const { data: link, error } = await supabase
        .from("links")
        .insert([{
          workspace_id: workspaceId,
          created_by: user.id,
          title: data.title,
          slug: data.slug,
          destination_url: data.url,
          final_url: data.url,
          domain: selectedDomain,
          path: "",
          expires_at: data.expires_at || null,
          max_clicks: data.max_clicks || null,
          fallback_url: data.fallback_url || null,
          destinations: destinations.length > 0 ? (destinations as unknown as Json) : null,
          smart_rotate: destinations.length >= 2 ? smartRotate : false,
          contextual_routing: destinations.length >= 2 ? contextualRouting : false,
          routing_strategy: contextualRouting ? 'contextual' : 'global',
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Trigger webhook for link.created
      try {
        await triggerWebhook('link.created', {
          link_id: link.id,
          title: link.title,
          short_url: `https://${link.domain}/${link.slug}`,
          destination_url: link.destination_url,
          created_at: link.created_at,
        });
      } catch (webhookError) {
        console.error('Webhook trigger failed:', webhookError);
      }
      
      return link;
    },
    onSuccess: (link) => {
      setIsSubmitting(false);
      const url = `https://${link.domain}/${link.slug}`;
      setShortURL(url);
      setCreatedLinkId(link.id);
      // Invalidate links-count to disable demo mode
      queryClient.invalidateQueries({ queryKey: ["links-count"] });
      notify.success("link created successfully!");
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ShortenerFormData) => {
    // Prevent double-submission - guard entire async operation
    if (isSubmitting || createLinkMutation.isPending) return;
    
    if (!slugAvailable) {
      toast({
        title: "slug unavailable",
        description: "this slug is already in use",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Final slug check before submission
      const { data: existing } = await (supabase as any)
        .from("links")
        .select("id")
        .eq("domain", selectedDomain)
        .eq("path", "")
        .eq("slug", data.slug)
        .maybeSingle();
      
      if (existing) {
        setSlugAvailable(false);
        toast({
          title: "slug unavailable",
          description: "this slug was just taken",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      createLinkMutation.mutate(data);
    } catch {
      setIsSubmitting(false);
    }
  };

  const isCustomSlug = values.slug && values.slug.length >= 3 && !/^[a-z0-9]{8}$/.test(values.slug);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-green-600" />
            <CardTitle>URL Shortener</CardTitle>
          </div>
          <LinkQualityScore
            customSlug={isCustomSlug}
            hasAISuggestions={usedAISlug}
          />
        </div>
        <CardDescription>Create short, memorable links with AI-powered slug suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <Label htmlFor="url">Destination URL *</Label>
            <div className="relative mt-1.5">
              <Input
                id="url"
                placeholder="https://example.com/long/url — paste for AI slugs ✨"
                {...form.register("url")}
                onPaste={handleUrlPaste}
              />
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {form.formState.errors.url && (
              <p className="text-xs text-system-red mt-1">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Link Title *</Label>
            <Input
              id="title"
              placeholder="Summer Sale Campaign"
              {...form.register("title")}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="domain">Domain</Label>
            <DomainSelectorWithAdd
              value={selectedDomain}
              onChange={setSelectedDomain}
              workspaceId={workspaceId}
            />
          </div>

          <div>
            <Label htmlFor="slug">Custom Slug *</Label>
            <div className="mt-1.5">
              <SlugCycleInput
                value={values.slug}
                onChange={(slug) => {
                  form.setValue("slug", slug);
                  setUsedAISlug(true);
                }}
                suggestions={aiSuggestions?.vanity_slugs || []}
                isLoading={isAnalyzing}
                onRegenerate={handleRegenerateSlugSuggestions}
                slugAvailable={slugAvailable}
                domain={selectedDomain}
                placeholder="my-link"
              />
            </div>
            {form.formState.errors.slug && (
              <p className="text-xs text-system-red mt-1">
                {form.formState.errors.slug.message}
              </p>
            )}
            {slugAvailable === false && (
              <p className="text-xs text-system-red mt-1">
                this slug is already taken
              </p>
            )}
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="advanced">
              <AccordionTrigger className="text-sm">Advanced Options</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    {...form.register("expires_at")}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="max_clicks">Max Clicks (optional)</Label>
                  <Input
                    id="max_clicks"
                    type="number"
                    placeholder="1000"
                    {...form.register("max_clicks", { valueAsNumber: true })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="fallback_url">Fallback URL (optional)</Label>
                  <Input
                    id="fallback_url"
                    placeholder="https://example.com/expired"
                    {...form.register("fallback_url")}
                    className="mt-1.5"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="destinations">
              <AccordionTrigger className="text-sm">
                Multiple Destinations (A/B Testing)
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <DestinationRotator
                  destinations={destinations}
                  onChange={setDestinations}
                  smartRotate={smartRotate}
                  onSmartRotateChange={setSmartRotate}
                  contextualRouting={contextualRouting}
                  onContextualRoutingChange={setContextualRouting}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createLinkMutation.isPending || !slugAvailable}
          >
            {isSubmitting || createLinkMutation.isPending ? "Creating..." : "Create Short Link"}
          </Button>

          {shortURL && (
            <LinkSuccessCard
              url={shortURL}
              linkId={createdLinkId}
              variant="shortened"
              onGenerateQR={onGenerateQR ? () => onGenerateQR(shortURL) : undefined}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
};
