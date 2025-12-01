import { Dna, TrendingUp, Copy, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUTMEvolution } from "@/hooks/useUTMEvolution";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface EvolutionaryUTMSuggestionsProps {
  workspaceId: string;
  onApplyPattern: (pattern: { source: string; medium: string; campaign: string; term?: string; content?: string }) => void;
}

export function EvolutionaryUTMSuggestions({ workspaceId, onApplyPattern }: EvolutionaryUTMSuggestionsProps) {
  const { data: patterns, isLoading } = useUTMEvolution(workspaceId);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <Card className="p-4 border-muted">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-muted-foreground">evolved utm patterns</h3>
          </div>
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              need at least 5 conversions with utm parameters to evolve patterns using genetic algorithm
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-primary/20 bg-primary/5">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Dna className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">evolved utm patterns</h3>
          <span className="text-xs text-muted-foreground ml-auto">
            gen {patterns[0]?.generation}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          optimized using genetic algorithm on conversion data
        </p>

        <div className="space-y-2">
          {patterns.map((pattern, index) => (
            <Card key={index} className="p-3 bg-card hover:bg-accent/50 transition-colors">
              <div className="space-y-3">
                {/* Pattern details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">source:</span>
                    <span className="text-sm font-mono">{pattern.pattern.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">medium:</span>
                    <span className="text-sm font-mono">{pattern.pattern.medium}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">campaign:</span>
                    <span className="text-sm font-mono">{pattern.pattern.campaign}</span>
                  </div>
                  {pattern.pattern.term && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">term:</span>
                      <span className="text-sm font-mono">{pattern.pattern.term}</span>
                    </div>
                  )}
                  {pattern.pattern.content && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">content:</span>
                      <span className="text-sm font-mono">{pattern.pattern.content}</span>
                    </div>
                  )}
                </div>

                {/* Performance metrics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">
                      cvr: <span className="font-medium text-foreground">
                        {(pattern.expectedConversionRate * 100).toFixed(2)}%
                      </span>
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    confidence: {Math.round(pattern.confidence * 100)}%
                  </div>
                </div>

                {/* Apply button */}
                <Button
                  onClick={() => {
                    onApplyPattern(pattern.pattern);
                    toast.success('evolved pattern applied');
                  }}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  apply pattern
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground italic">
          patterns evolved using crossover, mutation, and tournament selection over {patterns[0]?.generation} generations
        </p>
      </div>
    </Card>
  );
}
