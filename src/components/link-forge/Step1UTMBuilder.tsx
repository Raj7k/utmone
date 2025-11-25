import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Sparkles } from "lucide-react";

const utmSchema = z.object({
  destination_url: z.string().url("enter a valid url"),
  utm_source: z.string().min(1, "source is required"),
  utm_medium: z.string().min(1, "medium is required"),
  utm_campaign: z.string().min(1, "campaign is required"),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

type UTMFormData = z.infer<typeof utmSchema>;

interface Step1UTMBuilderProps {
  workspaceId: string;
  onComplete: (originalUrl: string, utmUrl: string) => void;
}

const suggestions = {
  utm_source: ["google", "facebook", "twitter", "linkedin", "instagram", "newsletter", "youtube"],
  utm_medium: ["cpc", "social", "email", "organic", "referral", "banner", "video"],
  utm_campaign: ["spring-sale", "black-friday", "product-launch", "brand-awareness"],
};

export const Step1UTMBuilder = ({ onComplete }: Step1UTMBuilderProps) => {
  const [finalUrl, setFinalUrl] = useState("");

  const form = useForm<UTMFormData>({
    resolver: zodResolver(utmSchema),
    defaultValues: {
      destination_url: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  });

  const values = form.watch();

  // Generate preview URL
  React.useEffect(() => {
    if (values.destination_url) {
      try {
        const url = new URL(values.destination_url);
        if (values.utm_source) url.searchParams.set("utm_source", values.utm_source);
        if (values.utm_medium) url.searchParams.set("utm_medium", values.utm_medium);
        if (values.utm_campaign) url.searchParams.set("utm_campaign", values.utm_campaign);
        if (values.utm_term) url.searchParams.set("utm_term", values.utm_term);
        if (values.utm_content) url.searchParams.set("utm_content", values.utm_content);
        setFinalUrl(url.toString());
      } catch {
        setFinalUrl("");
      }
    }
  }, [values]);

  const onSubmit = (data: UTMFormData) => {
    const url = new URL(data.destination_url);
    url.searchParams.set("utm_source", data.utm_source);
    url.searchParams.set("utm_medium", data.utm_medium);
    url.searchParams.set("utm_campaign", data.utm_campaign);
    if (data.utm_term) url.searchParams.set("utm_term", data.utm_term);
    if (data.utm_content) url.searchParams.set("utm_content", data.utm_content);

    onComplete(data.destination_url, url.toString());
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-title-2 font-semibold heading">build your utm url</h2>
        </div>
        <p className="text-body-apple text-secondary-label">
          start with your destination url and add tracking parameters
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="destination_url">destination url *</Label>
          <Input
            id="destination_url"
            placeholder="https://example.com/landing-page"
            {...form.register("destination_url")}
            className="mt-1.5"
          />
          {form.formState.errors.destination_url && (
            <p className="text-xs text-system-red mt-1">
              {form.formState.errors.destination_url.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="utm_source">source *</Label>
            <Input
              id="utm_source"
              placeholder="google"
              {...form.register("utm_source")}
              className="mt-1.5"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestions.utm_source.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-apple"
                  onClick={() => form.setValue("utm_source", suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="utm_medium">medium *</Label>
            <Input
              id="utm_medium"
              placeholder="cpc"
              {...form.register("utm_medium")}
              className="mt-1.5"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestions.utm_medium.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-apple"
                  onClick={() => form.setValue("utm_medium", suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="utm_campaign">campaign *</Label>
            <Input
              id="utm_campaign"
              placeholder="summer-sale"
              {...form.register("utm_campaign")}
              className="mt-1.5"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestions.utm_campaign.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-apple"
                  onClick={() => form.setValue("utm_campaign", suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="utm_term">term (optional)</Label>
            <Input
              id="utm_term"
              placeholder="keyword"
              {...form.register("utm_term")}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="utm_content">content (optional)</Label>
            <Input
              id="utm_content"
              placeholder="banner-ad"
              {...form.register("utm_content")}
              className="mt-1.5"
            />
          </div>
        </div>

        {finalUrl && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-xs text-secondary-label">preview</Label>
            <p className="text-sm font-mono text-label mt-1 break-all">{finalUrl}</p>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg">
        <Sparkles className="h-4 w-4 mr-2" />
        generate utm url
      </Button>
    </form>
  );
};
