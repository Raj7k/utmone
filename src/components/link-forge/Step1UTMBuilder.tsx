import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Sparkles, RefreshCw } from "lucide-react";
import { SmartUTMCombobox } from "@/components/shared/SmartUTMCombobox";
import { useAIAnalyzeUrl } from "@/hooks/useAIAnalyzeUrl";
import { AIFilledBadge } from "@/components/ai/AIFilledBadge";
import { LinkQualityScore } from "@/components/ai/LinkQualityScore";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export const Step1UTMBuilder = ({ workspaceId, onComplete }: Step1UTMBuilderProps) => {
  const [finalUrl, setFinalUrl] = useState("");
  const { isAnalyzing, suggestions: aiSuggestions, analyzeUrl, regenerateUrl, isAIPowered } = useAIAnalyzeUrl();
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [currentUrl, setCurrentUrl] = useState<string>("");

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

  // Handle URL paste for AI analysis
  const handleUrlPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData('text');
    
    try {
      new URL(pastedUrl);
      setCurrentUrl(pastedUrl);
      analyzeUrl(pastedUrl);
    } catch {
      // Invalid URL
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
    if (!aiSuggestions) return;
    
    const newAiFields = new Set<string>();
    
    if (aiSuggestions.utm_campaign && !values.utm_campaign) {
      form.setValue("utm_campaign", aiSuggestions.utm_campaign);
      newAiFields.add("utm_campaign");
    }
    if (aiSuggestions.utm_content && !values.utm_content) {
      form.setValue("utm_content", aiSuggestions.utm_content);
      newAiFields.add("utm_content");
    }
    if (aiSuggestions.utm_term && !values.utm_term) {
      form.setValue("utm_term", aiSuggestions.utm_term);
      newAiFields.add("utm_term");
    }
    
    setAiFilledFields(newAiFields);
  };

  // Auto-apply suggestions when they arrive
  if (aiSuggestions && !isAnalyzing && aiFilledFields.size === 0) {
    applySuggestions();
  }

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-title-2 font-semibold heading">build your utm url</h2>
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
        <p className="text-body-apple text-secondary-label">
          paste a url and ai will auto-fill your tracking parameters
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="destination_url">destination url *</Label>
          <div className="relative mt-1.5">
            <Input
              id="destination_url"
              placeholder="https://example.com/landing-page — paste to auto-analyze ✨"
              {...form.register("destination_url")}
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
          {form.formState.errors.destination_url && (
            <p className="text-xs text-system-red mt-1">
              {form.formState.errors.destination_url.message}
            </p>
          )}
          {isAIPowered && aiSuggestions && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mt-1"
            >
              <p className="text-xs text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {aiSuggestions.context}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="utm_source">source *</Label>
            <div className="mt-1.5">
              <SmartUTMCombobox
                workspaceId={workspaceId}
                fieldType="utm_source"
                value={form.watch("utm_source")}
                onChange={(value) => form.setValue("utm_source", value)}
                placeholder="select or type source"
                staticSuggestions={suggestions.utm_source}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="utm_medium">medium *</Label>
            <div className="mt-1.5">
              <SmartUTMCombobox
                workspaceId={workspaceId}
                fieldType="utm_medium"
                value={form.watch("utm_medium")}
                onChange={(value) => form.setValue("utm_medium", value)}
                placeholder="select or type medium"
                staticSuggestions={suggestions.utm_medium}
              />
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="utm_campaign">campaign *</Label>
            <div className="relative">
              <Input
                id="utm_campaign"
                placeholder="summer-sale"
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
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestions.utm_campaign.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-white/10 transition-apple"
                  onClick={() => {
                    form.setValue("utm_campaign", suggestion);
                    setAiFilledFields(prev => {
                      const next = new Set(prev);
                      next.delete("utm_campaign");
                      return next;
                    });
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="utm_term">term (optional)</Label>
            <div className="relative">
              <Input
                id="utm_term"
                placeholder="keyword"
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
          </div>

          <div className="relative">
            <Label htmlFor="utm_content">content (optional)</Label>
            <div className="relative">
              <Input
                id="utm_content"
                placeholder="banner-ad"
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
