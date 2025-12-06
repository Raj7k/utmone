import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ActionChecklistProps {
  items: ChecklistItem[];
  storageKey: string;
  title?: string;
  className?: string;
}

export const ActionChecklist = ({ items, storageKey, title = "Action Items", className }: ActionChecklistProps) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setCompleted(new Set(JSON.parse(stored)));
    }
  }, [storageKey]);

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
    localStorage.setItem(storageKey, JSON.stringify([...newCompleted]));
  };

  const markAllComplete = () => {
    const allIds = new Set(items.map(item => item.id));
    setCompleted(allIds);
    localStorage.setItem(storageKey, JSON.stringify([...allIds]));
  };

  const resetAll = () => {
    setCompleted(new Set());
    localStorage.removeItem(storageKey);
  };

  const progress = (completed.size / items.length) * 100;

  return (
    <div className={cn("my-8 rounded-2xl border border-border/50 overflow-hidden bg-card", className)}>
      {/* Header */}
      <div className="px-6 py-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {completed.size} of {items.length} completed ({Math.round(progress)}%)
          </p>
        </div>
        <div className="flex gap-2">
          {completed.size < items.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllComplete}
              className="text-xs"
            >
              Mark All Complete
            </Button>
          )}
          {completed.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAll}
              className="text-xs"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div 
          className="h-full transition-all duration-500 bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="p-6 space-y-3">
        {items.map((item) => {
          const isCompleted = completed.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-start gap-3 text-left hover:bg-muted/20 p-3 rounded-lg transition-colors group"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground group-hover:text-white flex-shrink-0 mt-0.5 transition-colors" />
              )}
              <span className={cn(
                "text-sm transition-colors",
                isCompleted ? "text-muted-foreground line-through" : "text-foreground"
              )}>
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};