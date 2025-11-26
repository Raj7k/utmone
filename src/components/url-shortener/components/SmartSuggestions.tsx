import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmartSuggestionsProps {
  suggestions: any[];
}

export const SmartSuggestions = ({ suggestions }: SmartSuggestionsProps) => {
  const recommendedSuggestion = suggestions.find(s => s.recommended);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        smart suggestions
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all ${
              suggestion.recommended
                ? 'border-primary bg-primary/10'
                : 'border-gray-700 bg-gray-800/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {suggestion.action}
                  </span>
                  {suggestion.recommended && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium">
                      recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
