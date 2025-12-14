import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { LinkSuccessCard } from "@/components/shared/LinkSuccessCard";
import { SmartUTMCombobox } from "@/components/shared/SmartUTMCombobox";
import { useWorkspace } from "@/hooks/workspace";
import { useAIAnalyzeUrl } from "@/hooks/useAIAnalyzeUrl";
import { AIFilledBadge } from "@/components/ai/AIFilledBadge";
import { LinkQualityScore } from "@/components/ai/LinkQualityScore";
import { UTMFieldSkeleton } from "@/components/ai/UTMFieldSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { isAnalyzing, suggestions, analyzeUrl, regenerateUrl, isAIPowered } = useAIAnalyzeUrl();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  
  // Track which fields were AI-filled
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());

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

  const values = form.watch();

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    form.setValue("utm_source", template.values.utm_source);
    form.setValue("utm_medium", template.values.utm_medium);
    setAiFilledFields(new Set()); // Clear AI badges when using template
  };

  const handleUrlPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData('text');
    
    // Validate URL before analyzing
    try {
      new URL(pastedUrl);
      setCurrentUrl(pastedUrl);
      analyzeUrl(pastedUrl);
    } catch {
      // Invalid URL, skip analysis
    }
  };

  const handleRegenerate = () => {
    if (currentUrl) {
      setAiFilledFields(new Set()); // Clear badges to allow re-application
      regenerateUrl(currentUrl);
    }
  };

  // Apply AI suggestions when they arrive
  const applySuggestions = () => {
    if (!suggestions) return;
    
    const newAiFields = new Set<string>();
    
    if (suggestions.utm_campaign && !values.utm_campaign) {
      form.setValue("utm_campaign", suggestions.utm_campaign);
      newAiFields.add("utm_campaign");
    }
    if (suggestions.utm_content && !values.utm_content) {
      form.setValue("utm_content", suggestions.utm_content);
      newAiFields.add("utm_content");
    }
    if (suggestions.utm_term && !values.utm_term) {
      form.setValue("utm_term", suggestions.utm_term);
      newAiFields.add("utm_term");
    }
    // Also apply source/medium if detected
    if (suggestions.utm_source && !values.utm_source) {
      form.setValue("utm_source", suggestions.utm_source);
      newAiFields.add("utm_source");
    }
    if (suggestions.utm_medium && !values.utm_medium) {
      form.setValue("utm_medium", suggestions.utm_medium);
      newAiFields.add("utm_medium");
    }
    
    setAiFilledFields(newAiFields);
  };

  // Auto-apply suggestions when they arrive
  if (suggestions && !isAnalyzing && aiFilledFields.size === 0) {
    applySuggestions();
  }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>UTM Builder</CardTitle>
          </div>
          <LinkQualityScore
            utmSource={values.utm_source}
            utmMedium={values.utm_medium}
            utmCampaign={values.utm_campaign}
            utmTerm={values.utm_term}
            utmContent={values.utm_content}
            hasAISuggestions={aiFilledFields.size > 0}
          />
        </div>
        <CardDescription>
          Paste a URL and AI will auto-fill your UTM parameters
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

          {/* URL Input with AI Analysis */}
          <div className="relative">
            <Label htmlFor="url">Destination URL *</Label>
            <div className="relative mt-1.5">
              <Input
                id="url"
                placeholder="https://example.com/page — paste to auto-analyze ✨"
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
            {isAIPowered && suggestions && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mt-1"
              >
                <p className="text-xs text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {suggestions.context}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 gap-1 text-xs text-primary hover:text-primary"
                        onClick={handleRegenerate}
                        disabled={isAnalyzing}
                      >
                        <RefreshCw className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>regenerate</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>get different AI suggestions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
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
                    onChange={(value) => {
                      form.setValue("utm_source", value);
                      setAiFilledFields(prev => {
                        const next = new Set(prev);
                        next.delete("utm_source");
                        return next;
                      });
                    }}
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
                    onChange={(value) => {
                      form.setValue("utm_medium", value);
                      setAiFilledFields(prev => {
                        const next = new Set(prev);
                        next.delete("utm_medium");
                        return next;
                      });
                    }}
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

            <div className="relative">
              <Label htmlFor="utm_campaign">Campaign *</Label>
              <UTMFieldSkeleton isLoading={isAnalyzing && !values.utm_campaign}>
                <div className="relative">
                  <Input
                    id="utm_campaign"
                    placeholder="summer-sale-2024"
                    {...form.register("utm_campaign")}
                    className="mt-1.5 pr-10"
                    onChange={(e) => {
                      form.setValue("utm_campaign", e.target.value);
                      setAiFilledFields(prev => {
                        const next = new Set(prev);
                        next.delete("utm_campaign");
                        return next;
                      });
                    }}
                  />
                  <AIFilledBadge show={aiFilledFields.has("utm_campaign")} />
                </div>
              </UTMFieldSkeleton>
            </div>

            <div className="relative">
              <Label htmlFor="utm_term">Term (optional)</Label>
              <UTMFieldSkeleton isLoading={isAnalyzing && !values.utm_term}>
                <div className="relative">
                  <Input
                    id="utm_term"
                    placeholder="running+shoes"
                    {...form.register("utm_term")}
                    className="mt-1.5 pr-10"
                    onChange={(e) => {
                      form.setValue("utm_term", e.target.value);
                      setAiFilledFields(prev => {
                        const next = new Set(prev);
                        next.delete("utm_term");
                        return next;
                      });
                    }}
                  />
                  <AIFilledBadge show={aiFilledFields.has("utm_term")} />
                </div>
              </UTMFieldSkeleton>
            </div>

            <div className="md:col-span-2 relative">
              <Label htmlFor="utm_content">Content (optional)</Label>
              <UTMFieldSkeleton isLoading={isAnalyzing && !values.utm_content}>
                <div className="relative">
                  <Input
                    id="utm_content"
                    placeholder="banner-ad-top"
                    {...form.register("utm_content")}
                    className="mt-1.5 pr-10"
                    onChange={(e) => {
                      form.setValue("utm_content", e.target.value);
                      setAiFilledFields(prev => {
                        const next = new Set(prev);
                        next.delete("utm_content");
                        return next;
                      });
                    }}
                  />
                  <AIFilledBadge show={aiFilledFields.has("utm_content")} />
                </div>
              </UTMFieldSkeleton>
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
