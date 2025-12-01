import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { LinkSuccessCard } from "@/components/shared/LinkSuccessCard";
import { SmartUTMCombobox } from "@/components/shared/SmartUTMCombobox";
import { useWorkspace } from "@/hooks/useWorkspace";

const utmSchema = z.object({
  url: z.string().url("enter a valid url"),
  utm_source: z.string().min(1, "source is required"),
  utm_medium: z.string().min(1, "medium is required"),
  utm_campaign: z.string().min(1, "campaign is required"),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

type UTMFormData = z.infer<typeof utmSchema>;

const quickTemplates = [
  {
    name: "Social Media Post",
    values: { utm_source: "instagram", utm_medium: "social", utm_campaign: "" },
  },
  {
    name: "Email Newsletter",
    values: { utm_source: "newsletter", utm_medium: "email", utm_campaign: "" },
  },
  {
    name: "Paid Search",
    values: { utm_source: "google", utm_medium: "cpc", utm_campaign: "" },
  },
  {
    name: "Partner Referral",
    values: { utm_source: "partner", utm_medium: "referral", utm_campaign: "" },
  },
];

const sourceSuggestions = ["google", "facebook", "twitter", "linkedin", "instagram", "newsletter"];
const mediumSuggestions = ["cpc", "social", "email", "organic", "referral", "banner"];

interface UTMBuilderToolProps {
  onShortenURL?: (url: string) => void;
}

export const UTMBuilderTool = ({ onShortenURL }: UTMBuilderToolProps) => {
  const [generatedURL, setGeneratedURL] = useState<string>("");
  const { currentWorkspace } = useWorkspace();

  const form = useForm<UTMFormData>({
    resolver: zodResolver(utmSchema),
    defaultValues: {
      url: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  });

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    form.setValue("utm_source", template.values.utm_source);
    form.setValue("utm_medium", template.values.utm_medium);
  };

  const generateURL = (data: UTMFormData) => {
    const url = new URL(data.url);
    url.searchParams.set("utm_source", data.utm_source);
    url.searchParams.set("utm_medium", data.utm_medium);
    url.searchParams.set("utm_campaign", data.utm_campaign);
    if (data.utm_term) url.searchParams.set("utm_term", data.utm_term);
    if (data.utm_content) url.searchParams.set("utm_content", data.utm_content);
    
    setGeneratedURL(url.toString());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle>UTM Builder</CardTitle>
        </div>
        <CardDescription>
          Build UTM parameters with quick templates and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(generateURL)} className="space-y-6">
          {/* Quick Templates */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {quickTemplates.map((template) => (
                <Button
                  key={template.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div>
            <Label htmlFor="url">Destination URL *</Label>
            <Input
              id="url"
              placeholder="https://example.com/page"
              {...form.register("url")}
              className="mt-1.5"
            />
            {form.formState.errors.url && (
              <p className="text-xs text-system-red mt-1">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>

          {/* UTM Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="utm_source">source *</Label>
              <div className="mt-1.5">
                {currentWorkspace ? (
                  <SmartUTMCombobox
                    workspaceId={currentWorkspace.id}
                    fieldType="utm_source"
                    value={form.watch("utm_source")}
                    onChange={(value) => form.setValue("utm_source", value)}
                    placeholder="select or type source"
                    staticSuggestions={sourceSuggestions}
                  />
                ) : (
                  <Input
                    id="utm_source"
                    placeholder="google, facebook, newsletter"
                    {...form.register("utm_source")}
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="utm_medium">medium *</Label>
              <div className="mt-1.5">
                {currentWorkspace ? (
                  <SmartUTMCombobox
                    workspaceId={currentWorkspace.id}
                    fieldType="utm_medium"
                    value={form.watch("utm_medium")}
                    onChange={(value) => form.setValue("utm_medium", value)}
                    placeholder="select or type medium"
                    staticSuggestions={mediumSuggestions}
                  />
                ) : (
                  <Input
                    id="utm_medium"
                    placeholder="cpc, social, email"
                    {...form.register("utm_medium")}
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="utm_campaign">Campaign *</Label>
              <Input
                id="utm_campaign"
                placeholder="summer-sale-2024"
                {...form.register("utm_campaign")}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="utm_term">Term (optional)</Label>
              <Input
                id="utm_term"
                placeholder="running+shoes"
                {...form.register("utm_term")}
                className="mt-1.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="utm_content">Content (optional)</Label>
              <Input
                id="utm_content"
                placeholder="banner-ad-top"
                {...form.register("utm_content")}
                className="mt-1.5"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Generate UTM URL
          </Button>

          {/* Success Card */}
          {generatedURL && (
            <LinkSuccessCard
              url={generatedURL}
              variant="utm"
              onShorten={onShortenURL ? () => onShortenURL(generatedURL) : undefined}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
};
