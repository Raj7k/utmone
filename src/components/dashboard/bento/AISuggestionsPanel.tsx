// PHASE 23: Removed framer-motion - using pure CSS animations
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AISuggestions } from "@/hooks/useAIAnalyzeUrl";
import { SlugCycleInput } from "@/components/ai/SlugCycleInput";

interface AISuggestionsPanelProps {
  suggestions: AISuggestions;
  isAnalyzing: boolean;
  onSelectSlug: (slug: string) => void;
  onApplyUtm: () => void;
  onRegenerate: () => void;
  selectedSlug: string | null;
  utmApplied: boolean;
}

export const AISuggestionsPanel = ({
  suggestions,
  isAnalyzing,
  onSelectSlug,
  onApplyUtm,
  onRegenerate,
  selectedSlug,
  utmApplied,
}: AISuggestionsPanelProps) => {
  const hasUtm = suggestions.utm_campaign || suggestions.utm_content || suggestions.utm_term;

  return (
    <div className="overflow-hidden animate-fade-in">
      <div className="pt-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>ai suggestions</span>
          </div>
        </div>

        {/* Slug Input with AI Cycling */}
        {suggestions.vanity_slugs?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">vanity slug</span>
            <SlugCycleInput
              value={selectedSlug || ""}
              onChange={onSelectSlug}
              suggestions={suggestions.vanity_slugs}
              isLoading={isAnalyzing}
              onRegenerate={onRegenerate}
              domain="utm.click"
              placeholder="my-link"
            />
          </div>
        )}

        {/* UTM Preview */}
        {hasUtm && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">utm parameters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onApplyUtm}
                disabled={utmApplied}
                className="h-6 px-2 text-xs"
              >
                {utmApplied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    applied
                  </>
                ) : (
                  "apply"
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.utm_campaign && (
                <span className="px-2 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground border border-border">
                  campaign={suggestions.utm_campaign}
                </span>
              )}
              {suggestions.utm_content && (
                <span className="px-2 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground border border-border">
                  content={suggestions.utm_content}
                </span>
              )}
              {suggestions.utm_term && (
                <span className="px-2 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground border border-border">
                  term={suggestions.utm_term}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
