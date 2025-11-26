import { Card } from "@/components/ui/card";
import { Brain, MessageCircle, PlusCircle, RefreshCw } from "lucide-react";

type DuplicateStrategy = 'SMART' | 'ASK' | 'ALWAYS_NEW' | 'USE_EXISTING';

interface StrategySelectorProps {
  strategy: DuplicateStrategy;
  onStrategyChange: (strategy: DuplicateStrategy) => void;
}

const strategies = [
  {
    id: 'SMART' as DuplicateStrategy,
    icon: Brain,
    label: 'smart mode',
    description: 'AI decides best action',
    color: 'from-primary to-primary/60',
  },
  {
    id: 'ASK' as DuplicateStrategy,
    icon: MessageCircle,
    label: 'ask me',
    description: 'review each duplicate',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'ALWAYS_NEW' as DuplicateStrategy,
    icon: PlusCircle,
    label: 'always new',
    description: 'create new version',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'USE_EXISTING' as DuplicateStrategy,
    icon: RefreshCw,
    label: 'use existing',
    description: 'reuse best performer',
    color: 'from-blue-500 to-blue-600',
  },
];

export const StrategySelector = ({ strategy, onStrategyChange }: StrategySelectorProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {strategies.map((s) => {
        const Icon = s.icon;
        const isActive = strategy === s.id;
        
        return (
          <button
            key={s.id}
            onClick={() => onStrategyChange(s.id)}
            className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
              isActive
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-border bg-background hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
            }`}
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${s.color} mb-2`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">
              {s.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {s.description}
            </div>
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};
