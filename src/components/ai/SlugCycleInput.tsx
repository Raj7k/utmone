import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SlugCycleInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  onRegenerate?: () => void;
  slugAvailable?: boolean | null;
  domain?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SlugCycleInput({
  value,
  onChange,
  suggestions,
  isLoading = false,
  onRegenerate,
  slugAvailable,
  domain = "utm.one",
  placeholder = "my-link",
  disabled = false,
}: SlugCycleInputProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [hasUsedAI, setHasUsedAI] = useState(false);

  // Reset index when suggestions change
  useEffect(() => {
    setCurrentIndex(-1);
  }, [suggestions.join(',')]);

  const handleCycle = () => {
    if (suggestions.length === 0) {
      // No suggestions, trigger regenerate
      onRegenerate?.();
      return;
    }

    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= suggestions.length) {
      // Cycled through all, regenerate new ones
      setCurrentIndex(-1);
      onRegenerate?.();
    } else {
      // Cycle to next suggestion
      setCurrentIndex(nextIndex);
      onChange(suggestions[nextIndex]);
      setHasUsedAI(true);
    }
  };

  const cycleLabel = suggestions.length === 0
    ? "generate ai slugs"
    : currentIndex >= suggestions.length - 1
    ? "regenerate"
    : `${currentIndex + 2}/${suggestions.length}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {domain}/
      </span>
      <div className="flex-1 relative">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHasUsedAI(false);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-20",
            hasUsedAI && "border-primary/50"
          )}
        />
        
        {/* Availability indicator */}
        {value && value.length >= 3 && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            {slugAvailable === true && (
              <CheckCircle2 className="h-4 w-4 text-system-green" />
            )}
            {slugAvailable === false && (
              <AlertCircle className="h-4 w-4 text-system-red" />
            )}
          </div>
        )}
        
        {/* AI Wand button inside input */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCycle}
                disabled={disabled || isLoading}
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2",
                  "hover:bg-primary/10 hover:text-primary",
                  isLoading && "opacity-50"
                )}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wand"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Wand2 className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>{cycleLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* AI badge when using AI slug */}
      <AnimatePresence>
        {hasUsedAI && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-xs text-primary flex items-center gap-1"
          >
            ✨
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
