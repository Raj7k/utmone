import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, ArrowLeft, Shuffle, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateSlugFromTitle } from "@/lib/slugify";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLinkWebhooks } from "@/hooks/useLinkWebhooks";

const shortenerSchema = z.object({
  title: z.string().min(1, "title is required").max(100),
  slug: z.string().min(3, "slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "only lowercase letters, numbers, and hyphens"),
  expires_at: z.string().optional(),
  max_clicks: z.number().optional(),
  fallback_url: z.string().url().optional().or(z.literal("")),
});

type ShortenerFormData = z.infer<typeof shortenerSchema>;

interface Step2ShortenerProps {
  workspaceId: string;
  utmUrl: string;
  originalUrl: string;
  onComplete: (linkId: string, shortUrl: string) => void;
  onBack: () => void;
}

export const Step2Shortener = ({
  workspaceId,
  utmUrl,
  onComplete,
  onBack,
}: Step2ShortenerProps) => {
  const { toast } = useToast();
  const { triggerWebhook } = useLinkWebhooks(workspaceId);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("utm.click");

  // Fetch verified domains for this workspace + system-level defaults
  const { data: verifiedDomains } = useQuery({
    queryKey: ["verified-domains", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("id, domain, workspace_id")
        .eq("is_verified", true)
        .or(`workspace_id.eq.${workspaceId},is_system_domain.eq.true`)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      // Filter out utm.one (main website) and return only shortener domains
      return (data || []).filter(d => d.domain !== 'utm.one');
    },
  });

  const form = useForm<ShortenerFormData>({
    resolver: zodResolver(shortenerSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const values = form.watch();

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title) {
        const generatedSlug = generateSlugFromTitle(value.title);
        form.setValue("slug", generatedSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (values.slug && values.slug.length >= 3) {
        const { data } = await supabase
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

  const generateRandomSlug = () => {
    const randomSlug = Math.random().toString(36).substring(2, 10);
    form.setValue("slug", randomSlug);
  };

  const createLinkMutation = useMutation({
    mutationFn: async (data: ShortenerFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

      const { data: link, error } = await supabase
        .from("links")
        .insert({
          workspace_id: workspaceId,
          created_by: user.id,
          title: data.title,
          slug: data.slug,
          destination_url: utmUrl,
          final_url: utmUrl,
          domain: selectedDomain,
          path: "",
          expires_at: data.expires_at || null,
          max_clicks: data.max_clicks || null,
          fallback_url: data.fallback_url || null,
        })
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
      const shortUrl = `https://${link.domain}/${link.slug}`;
      toast({
        title: "link created",
        description: "your short link is ready",
      });
      onComplete(link.id, shortUrl);
    },
    onError: (error: Error) => {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ShortenerFormData) => {
    if (!slugAvailable) {
      toast({
        title: "slug unavailable",
        description: "this slug is already in use",
        variant: "destructive",
      });
      return;
    }
    createLinkMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="text-title-2 font-semibold heading">shorten your url</h2>
        </div>
        <p className="text-body-apple text-secondary-label">
          create a short, memorable link
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <Label className="text-xs text-secondary-label">utm url from step 1</Label>
        <p className="text-sm font-mono text-label mt-1 break-all">{utmUrl}</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">link title *</Label>
          <Input
            id="title"
            placeholder="summer campaign 2024"
            {...form.register("title")}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="domain">domain</Label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full mt-1.5 h-10 px-3 rounded-md border border-input bg-background"
          >
            {verifiedDomains?.map((d) => (
              <option key={d.id} value={d.domain}>
                {d.domain}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="slug">custom slug *</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-body-apple text-secondary-label">{selectedDomain}/</span>
            <div className="flex-1 relative">
              <Input
                id="slug"
                placeholder="my-link"
                {...form.register("slug")}
              />
              {values.slug && values.slug.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {slugAvailable === true && (
                    <CheckCircle2 className="h-4 w-4 text-system-green" />
                  )}
                  {slugAvailable === false && (
                    <AlertCircle className="h-4 w-4 text-system-red" />
                  )}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={generateRandomSlug}
              title="generate random slug"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
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
            <AccordionTrigger className="text-sm">advanced options</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="expires_at">expiry date (optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  {...form.register("expires_at")}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="max_clicks">max clicks (optional)</Label>
                <Input
                  id="max_clicks"
                  type="number"
                  placeholder="1000"
                  {...form.register("max_clicks", { valueAsNumber: true })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="fallback_url">fallback url (optional)</Label>
                <Input
                  id="fallback_url"
                  placeholder="https://example.com/expired"
                  {...form.register("fallback_url")}
                  className="mt-1.5"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={createLinkMutation.isPending || !slugAvailable}
        >
          {createLinkMutation.isPending ? "creating..." : "create short link"}
        </Button>
      </div>
    </form>
  );
};
