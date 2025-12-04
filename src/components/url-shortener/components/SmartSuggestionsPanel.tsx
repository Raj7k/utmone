import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, GitBranch, Split, Archive, Lightbulb } from 'lucide-react';

interface Suggestion {
  type: 'use-best' | 'create-campaign' | 'ab-test' | 'archive';
  action: string;
  description: string;
  recommended: boolean;
  reasoning: string;
}

interface SmartSuggestionsPanelProps {
  suggestions: Suggestion[];
  onSelectSuggestion: (type: Suggestion['type']) => void;
}

export const SmartSuggestionsPanel = ({ suggestions, onSelectSuggestion }: SmartSuggestionsPanelProps) => {
  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'use-best':
        return TrendingUp;
      case 'create-campaign':
        return GitBranch;
      case 'ab-test':
        return Split;
      case 'archive':
        return Archive;
      default:
        return Lightbulb;
    }
  };

  const getColorStyle = (type: Suggestion['type'], recommended: boolean): React.CSSProperties => {
    if (recommended) {
      return { background: 'linear-gradient(to bottom right, rgba(245,158,11,0.2), rgba(245,158,11,0.1))', borderColor: 'rgba(245,158,11,0.5)' };
    }
    
    switch (type) {
      case 'use-best':
        return { background: 'linear-gradient(to bottom right, rgba(34,197,94,0.1), rgba(34,197,94,0.05))', borderColor: 'rgba(34,197,94,0.2)' };
      case 'create-campaign':
        return { background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', borderColor: 'rgba(255,255,255,0.2)' };
      case 'ab-test':
        return { background: 'linear-gradient(to bottom right, rgba(168,85,247,0.1), rgba(168,85,247,0.05))', borderColor: 'rgba(168,85,247,0.2)' };
      case 'archive':
        return { background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', borderColor: 'rgba(255,255,255,0.2)' };
      default:
        return { background: 'linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.05))', borderColor: 'rgba(255,255,255,0.1)' };
    }
  };

  const recommended = suggestions.find(s => s.recommended);

  return (
    <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          AI-Powered Suggestions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Recommended Action (highlighted) */}
        {recommended && (
          <div className="mb-4">
            <p className="text-xs text-amber-500 font-semibold mb-2 flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5" />
              RECOMMENDED ACTION
            </p>
            <div
              className="p-4 rounded-lg border"
              style={getColorStyle(recommended.type, true)}
            >
              <div className="flex items-start gap-3 mb-3">
                {(() => {
                  const Icon = getIcon(recommended.type);
                  return <Icon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />;
                })()}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{recommended.action}</h4>
                    <Badge className="text-xs bg-amber-500/20 text-amber-500 border-amber-500/30">
                      Best Choice
                    </Badge>
                  </div>
                  <p className="text-xs text-secondary-label mb-2">{recommended.description}</p>
                  <div className="flex items-start gap-2 mt-3 p-2 rounded bg-black/20">
                    <Sparkles className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-secondary-label italic">{recommended.reasoning}</p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => onSelectSuggestion(recommended.type)}
              >
                Apply Recommendation
              </Button>
            </div>
          </div>
        )}

        {/* Alternative Actions */}
        {suggestions.filter(s => !s.recommended).length > 0 && (
          <div>
            <p className="text-xs text-secondary-label font-semibold mb-2">ALTERNATIVE OPTIONS</p>
            <div className="space-y-2">
              {suggestions
                .filter(s => !s.recommended)
                .map((suggestion) => {
                  const Icon = getIcon(suggestion.type);
                  
                  return (
                    <button
                      key={suggestion.type}
                      onClick={() => onSelectSuggestion(suggestion.type)}
                      className="w-full p-3 rounded-lg border text-left hover:scale-[1.02] transition-all"
                      style={getColorStyle(suggestion.type, false)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(59,130,246,1)' }} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground mb-0.5">
                            {suggestion.action}
                          </p>
                          <p className="text-xs text-secondary-label">{suggestion.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* AI Insight Box */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-br border" style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', borderColor: 'rgba(59,130,246,0.2)' }}>
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(59,130,246,1)' }} />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>AI Analysis</p>
              <p className="text-xs text-secondary-label">
                Based on {suggestions.length} factors including click-through rates, campaign context, 
                and version history, our AI recommends the action above for optimal performance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
