import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp } from "lucide-react";
import { VersionCard } from "./VersionCard";
import { AnalysisStats } from "./AnalysisStats";
import { SmartSuggestions } from "./SmartSuggestions";

interface DuplicatePanelProps {
  duplicates: any[];
  analysis: any;
  suggestions: any[];
  strategy: string;
  onSelectExisting: (link: any) => void;
}

export const DuplicatePanel = ({
  duplicates,
  analysis,
  suggestions,
  strategy,
  onSelectExisting,
}: DuplicatePanelProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground mb-1">
            {duplicates.length} existing {duplicates.length === 1 ? 'version' : 'versions'} found
          </div>
          <div className="text-xs text-muted-foreground">
            {strategy === 'SMART' && 'AI will select best action'}
            {strategy === 'ASK' && 'Review and choose an option below'}
            {strategy === 'ALWAYS_NEW' && 'New version will be created'}
            {strategy === 'USE_EXISTING' && 'Best performer will be reused'}
          </div>
        </div>
      </div>

      {analysis && (
        <AnalysisStats analysis={analysis} />
      )}

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          existing versions
        </div>
        {duplicates.map((link) => (
          <VersionCard
            key={link.id}
            link={link}
            isBestPerformer={analysis?.bestPerforming?.id === link.id}
            onSelect={() => onSelectExisting(link)}
          />
        ))}
      </div>

      {suggestions.length > 0 && strategy === 'ASK' && (
        <SmartSuggestions suggestions={suggestions} />
      )}
    </div>
  );
};
