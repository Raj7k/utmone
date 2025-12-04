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
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-white/60';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-300';
    if (score >= 60) return 'bg-amber-500/20 text-amber-300';
    return 'bg-white/10 text-white/70';
  };

  return (
    <Card className="p-4 space-y-3 bg-zinc-900/40 backdrop-blur-xl border-white/10">
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(196,181,253,1)' }}>
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
              className="w-full text-left p-3 rounded-lg border transition-all"
              style={isActive 
                ? { borderColor: 'rgba(139,92,246,1)', background: 'rgba(139,92,246,0.2)' }
                : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{suggestion.icon}</span>
                    <span className="font-semibold text-sm text-white">
                      {suggestion.type}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.description}
                    </Badge>
                  </div>
                  
                  <div className="font-mono text-sm mb-2 truncate" style={{ color: 'rgba(167,139,250,1)' }}>
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
                  <Badge className="text-white" style={{ background: 'rgba(139,92,246,1)' }}>
                    Selected
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-white/50 mt-2">
        💡 Scores based on length, readability, and conversion psychology
      </p>
    </Card>
  );
};
