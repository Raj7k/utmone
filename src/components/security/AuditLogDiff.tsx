import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";

interface AuditLogDiffProps {
  oldValues: any;
  newValues: any;
}

export const AuditLogDiff = ({ oldValues, newValues }: AuditLogDiffProps) => {
  // Get all unique keys from both objects
  const allKeys = new Set([
    ...Object.keys(oldValues || {}),
    ...Object.keys(newValues || {})
  ]);

  const changes = Array.from(allKeys).map(key => {
    const oldValue = oldValues?.[key];
    const newValue = newValues?.[key];
    const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

    return {
      key,
      oldValue,
      newValue,
      hasChanged,
      isAdded: oldValue === undefined && newValue !== undefined,
      isRemoved: oldValue !== undefined && newValue === undefined,
    };
  });

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  return (
    <ScrollArea className="h-[400px] rounded-lg border border-border">
      <div className="p-4 space-y-4">
        {changes.length === 0 && (
          <div className="text-center py-8 text-secondary-label">
            no changes recorded
          </div>
        )}

        {changes.map(({ key, oldValue, newValue, hasChanged, isAdded, isRemoved }) => (
          <div key={key} className="space-y-2">
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
              {hasChanged && !isAdded && !isRemoved && (
                <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
                  modified
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Old Value */}
              <div className="space-y-1">
                <div className="text-caption-1-apple text-tertiary-label">before</div>
                <div className={`p-3 rounded-lg border font-mono text-xs ${
                  isAdded ? 'opacity-30' : ''
                } ${isRemoved ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30 border-border'}`}>
                  <pre className="whitespace-pre-wrap break-all">
                    {formatValue(oldValue)}
                  </pre>
                </div>
              </div>

              {/* New Value */}
              <div className="space-y-1">
                <div className="text-caption-1-apple text-tertiary-label">after</div>
                <div className={`p-3 rounded-lg border font-mono text-xs ${
                  isRemoved ? 'opacity-30' : ''
                } ${isAdded ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-muted/30 border-border'}`}>
                  <pre className="whitespace-pre-wrap break-all">
                    {formatValue(newValue)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
