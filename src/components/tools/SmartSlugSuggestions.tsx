/**
 * Smart Slug Suggestions Component
 * Displays AI-powered slug suggestions with readability scores
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp } from "lucide-react";

interface SlugSuggestion {
  slug: string;
  type: 'Shortest' | 'Descriptive' | 'Urgent';
  description: string;
  icon: string;
  score: {
    total: number;
    breakdown: {
      length: number;
      readability: number;
      complexity: number;
      conversion: number;
    };
  };
}

interface SmartSlugSuggestionsProps {
  suggestions: SlugSuggestion[];
  onSelect: (slug: string) => void;
  currentSlug?: string;
}

export const SmartSlugSuggestions = ({ 
  suggestions, 
  onSelect, 
  currentSlug 
}: SmartSlugSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  };

  return (
    <Card className="p-4 space-y-3 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
      <div className="flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4" />
        <span>AI-Optimized Slug Suggestions</span>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const isActive = currentSlug === suggestion.slug;
          
          return (
            <button
              key={suggestion.type}
              onClick={() => onSelect(suggestion.slug)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isActive
                  ? 'border-violet-400 dark:border-violet-600 bg-violet-100 dark:bg-violet-900/40'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{suggestion.icon}</span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {suggestion.type}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.description}
                    </Badge>
                  </div>
                  
                  <div className="font-mono text-sm text-violet-600 dark:text-violet-400 mb-2 truncate">
                    utm.one/{suggestion.slug}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-xs ${getScoreBadge(suggestion.score.total)}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Score: {suggestion.score.total}/100
                    </Badge>
                    
                    {suggestion.score.breakdown.conversion > 0 && (
                      <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                        🎯 High Conversion
                      </Badge>
                    )}
                  </div>
                </div>

                {isActive && (
                  <Badge className="bg-violet-500 text-white">
                    Selected
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
        💡 Scores based on length, readability, and conversion psychology
      </p>
    </Card>
  );
};
