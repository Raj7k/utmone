import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AISlugSuggestionsProps {
  slugs: string[];
  onSelect: (slug: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  currentSlug?: string;
}

export function AISlugSuggestions({ 
  slugs, 
  onSelect, 
  onRefresh, 
  isLoading = false,
  currentSlug = ''
}: AISlugSuggestionsProps) {
  if (slugs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-3 bg-primary/5 border border-primary/20 rounded-lg mt-2"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-primary">
          <Sparkles className="h-3 w-3" />
          <span>ai suggestions</span>
        </div>
        {onRefresh && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {slugs.map((slug, index) => (
            <motion.button
              key={slug}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(slug)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                currentSlug === slug
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              /{slug}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
