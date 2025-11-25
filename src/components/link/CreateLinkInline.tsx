import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ExternalLink, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const linkSchema = z.object({
  destination: z.string().url("Enter a valid URL"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface CreateLinkInlineProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export function CreateLinkInline({ workspaceId, onSuccess }: CreateLinkInlineProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple");
  const [selectedDomain, setSelectedDomain] = useState<string>("utm.click");

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      destination: "",
      title: "",
      slug: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
    },
  });

  const generateSlug = async (title: string) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 30);

    // Check if slug exists
    const { data: existing } = await supabase
      .from("links")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("slug", baseSlug)
      .maybeSingle();

    if (!existing) return baseSlug;

    // Add random suffix if exists
    return `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  };

  const onSubmit = async (data: LinkFormData) => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = data.slug || await generateSlug(data.title);

      // Build final URL with UTM params
      let finalUrl = data.destination;
      const utmParams = [];
      if (data.utm_source) utmParams.push(`utm_source=${encodeURIComponent(data.utm_source)}`);
      if (data.utm_medium) utmParams.push(`utm_medium=${encodeURIComponent(data.utm_medium)}`);
      if (data.utm_campaign) utmParams.push(`utm_campaign=${encodeURIComponent(data.utm_campaign)}`);
      
      if (utmParams.length > 0) {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl = `${finalUrl}${separator}${utmParams.join("&")}`;
      }

      const { data: link, error } = await supabase
        .from("links")
        .insert({
          workspace_id: workspaceId,
          created_by: user.id,
          title: data.title,
          slug,
          destination_url: data.destination,
          final_url: finalUrl,
          domain: selectedDomain,
          path: "",
          utm_source: data.utm_source || null,
          utm_medium: data.utm_medium || null,
          utm_campaign: data.utm_campaign || null,
        })
        .select()
        .single();

      if (error) throw error;

      const shortUrl = `https://${selectedDomain}/${slug}`;
      setCreatedLink(shortUrl);
      
      toast({
        title: "Link Created",
        description: "Your short link is ready to share.",
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Failed to Create Link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      toast({
        title: "Copied",
        description: "Link copied to clipboard",
      });
    }
  };

  if (createdLink) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Link Created Successfully!</h3>
            <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
              <code className="flex-1 text-sm truncate">{createdLink}</code>
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <a href={createdLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <Button onClick={() => setCreatedLink(null)} className="w-full">
            Create Another Link
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Create Short Link</h3>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="advanced">With UTMs</TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TabsContent value="simple" className="space-y-4 mt-0">
            <div>
              <Label htmlFor="destination">Destination URL</Label>
              <Input
                id="destination"
                placeholder="https://example.com/page"
                {...form.register("destination")}
              />
              {form.formState.errors.destination && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.destination.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Link Title</Label>
              <Input
                id="title"
                placeholder="My Campaign Link"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="domain">Domain</Label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="utm.click">utm.click</option>
                <option value="go.utm.one">go.utm.one</option>
              </select>
            </div>

            <div>
              <Label htmlFor="slug">Custom Slug (optional)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedDomain}/</span>
                <Input
                  id="slug"
                  placeholder="my-link"
                  {...form.register("slug")}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-0">
            <div>
              <Label htmlFor="destination-adv">Destination URL</Label>
              <Input
                id="destination-adv"
                placeholder="https://example.com/page"
                {...form.register("destination")}
              />
            </div>

            <div>
              <Label htmlFor="title-adv">Link Title</Label>
              <Input
                id="title-adv"
                placeholder="My Campaign Link"
                {...form.register("title")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="utm_source">Source</Label>
                <Input
                  id="utm_source"
                  placeholder="google"
                  {...form.register("utm_source")}
                />
              </div>
              <div>
                <Label htmlFor="utm_medium">Medium</Label>
                <Input
                  id="utm_medium"
                  placeholder="cpc"
                  {...form.register("utm_medium")}
                />
              </div>
              <div>
                <Label htmlFor="utm_campaign">Campaign</Label>
                <Input
                  id="utm_campaign"
                  placeholder="summer-sale"
                  {...form.register("utm_campaign")}
                />
              </div>
            </div>
          </TabsContent>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Short Link"}
          </Button>
        </form>
      </Tabs>
    </Card>
  );
}