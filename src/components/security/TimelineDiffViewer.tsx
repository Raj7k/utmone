import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ArrowRight } from "lucide-react";

interface TimelineDiffViewerProps {
  changes: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
}

export const TimelineDiffViewer = ({ changes }: TimelineDiffViewerProps) => {
  const before = changes.before || {};
  const after = changes.after || {};

  // Get all unique keys
  const allKeys = new Set([
    ...Object.keys(before),
    ...Object.keys(after)
  ]);

  const diffs = Array.from(allKeys).map(key => {
    const oldValue = before[key];
    const newValue = after[key];
    const isDifferent = JSON.stringify(oldValue) !== JSON.stringify(newValue);

    return {
      key,
      oldValue,
      newValue,
      isDifferent,
      isAdded: oldValue === undefined && newValue !== undefined,
      isRemoved: oldValue !== undefined && newValue === undefined,
    };
  }).filter(d => d.isDifferent); // Only show changed fields

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '∅';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  };

  if (diffs.length === 0) {
    return (
      <div className="text-center py-6 text-secondary-label text-body-apple">
        no changes detected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-subheadline-apple font-medium text-label">Changes</h3>
        <Badge variant="outline" className="text-xs">
          {diffs.length} field{diffs.length !== 1 ? 's' : ''} modified
        </Badge>
      </div>

      <ScrollArea className="h-[300px] rounded-lg border border-border bg-muted/30">
        <div className="p-4 space-y-4">
          {diffs.map(({ key, oldValue, newValue, isAdded, isRemoved }) => (
            <div key={key} className="space-y-2">
              {/* Field name */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {key}
                </Badge>
                {isAdded && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    added
                  </Badge>
                )}
                {isRemoved && (
                  <Badge className="bg-destructive/10 text-destructive text-xs">
                    <Minus className="w-3 h-3 mr-1" />
                    removed
                  </Badge>
                )}
              </div>

              {/* Side-by-side diff */}
              <div className="grid grid-cols-2 gap-2">
                {/* Before */}
                <div className={`p-3 rounded-lg border ${
                  isAdded 
                    ? 'opacity-30 bg-card' 
                    : isRemoved 
                    ? 'bg-destructive/5 border-destructive/20' 
                    : 'bg-card border-border'
                }`}>
                  <div className="text-caption-1-apple text-tertiary-label mb-1 flex items-center gap-1">
                    {isRemoved && <Minus className="w-3 h-3" />}
                    before
                  </div>
                  <pre className="font-mono text-xs text-label whitespace-pre-wrap break-all">
                    {formatValue(oldValue)}
                  </pre>
                </div>

                {/* After */}
                <div className={`p-3 rounded-lg border ${
                  isRemoved 
                    ? 'opacity-30 bg-card' 
                    : isAdded 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-card border-border'
                }`}>
                  <div className="text-caption-1-apple text-tertiary-label mb-1 flex items-center gap-1">
                    {isAdded && <Plus className="w-3 h-3" />}
                    after
                  </div>
                  <pre className="font-mono text-xs text-label whitespace-pre-wrap break-all">
                    {formatValue(newValue)}
                  </pre>
                </div>
              </div>

              {/* Visual arrow for modified fields */}
              {!isAdded && !isRemoved && (
                <div className="flex items-center justify-center py-1">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
