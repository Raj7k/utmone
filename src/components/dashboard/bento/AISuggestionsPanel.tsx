import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AISuggestions } from "@/hooks/useAIAnalyzeUrl";

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
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="pt-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>ai suggestions</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isAnalyzing}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isAnalyzing ? "animate-spin" : ""}`} />
            regenerate
          </Button>
        </div>

        {/* Slug Suggestions */}
        {suggestions.vanity_slugs?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">suggested slugs</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.vanity_slugs.slice(0, 4).map((slug) => (
                <button
                  key={slug}
                  onClick={() => onSelectSlug(slug)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    selectedSlug === slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-foreground border-border hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {selectedSlug === slug && <Check className="h-3 w-3 inline mr-1" />}
                  /{slug}
                </button>
              ))}
            </div>
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
    </motion.div>
  );
};
