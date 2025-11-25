import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, Shuffle, CheckCircle2, AlertCircle, Copy, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateSlugFromTitle } from "@/lib/slugify";

const shortenerSchema = z.object({
  url: z.string().url("enter a valid url"),
  title: z.string().min(1, "title is required"),
  slug: z.string().min(3, "slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "only lowercase letters, numbers, and hyphens"),
  expires_at: z.string().optional(),
  max_clicks: z.number().optional(),
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
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [shortURL, setShortURL] = useState<string>("");
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
      url: initialURL || "",
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
          destination_url: data.url,
          final_url: data.url,
          domain: selectedDomain,
          path: "",
          expires_at: data.expires_at || null,
          max_clicks: data.max_clicks || null,
          fallback_url: data.fallback_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      return link;
    },
    onSuccess: (link) => {
      const url = `https://${link.domain}/${link.slug}`;
      setShortURL(url);
      toast({
        title: "link created",
        description: "your short link is ready",
      });
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

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortURL);
    toast({
      title: "copied",
      description: "link copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-green-600" />
          <CardTitle>URL Shortener</CardTitle>
        </div>
        <CardDescription>Create short, memorable links with custom slugs</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="url">Destination URL *</Label>
            <Input
              id="url"
              placeholder="https://example.com/long/url/path"
              {...form.register("url")}
              className="mt-1.5"
            />
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
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {verifiedDomains?.map((d) => (
                  <SelectItem key={d.id} value={d.domain}>
                    {d.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="slug">Custom Slug *</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-body-apple text-secondary-label whitespace-nowrap">{selectedDomain}/</span>
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
          </Accordion>

          <Button
            type="submit"
            className="w-full"
            disabled={createLinkMutation.isPending || !slugAvailable}
          >
            {createLinkMutation.isPending ? "Creating..." : "Create Short Link"}
          </Button>

          {shortURL && (
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-xs text-secondary-label">Your Short Link</Label>
                <p className="text-sm font-mono text-label mt-1 break-all">{shortURL}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                {onGenerateQR && (
                  <Button
                    type="button"
                    onClick={() => onGenerateQR(shortURL)}
                    className="flex-1"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
