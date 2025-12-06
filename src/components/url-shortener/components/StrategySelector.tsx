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
    gradient: 'linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--primary)/0.6))',
  },
  {
    id: 'ASK' as DuplicateStrategy,
    icon: MessageCircle,
    label: 'ask me',
    description: 'review each duplicate',
    gradient: 'linear-gradient(to bottom right, rgba(168,85,247,1), rgba(147,51,234,1))',
  },
  {
    id: 'ALWAYS_NEW' as DuplicateStrategy,
    icon: PlusCircle,
    label: 'always new',
    description: 'create new version',
    gradient: 'linear-gradient(to bottom right, rgba(34,197,94,1), rgba(22,163,74,1))',
  },
  {
    id: 'USE_EXISTING' as DuplicateStrategy,
    icon: RefreshCw,
    label: 'use existing',
    description: 'reuse best performer',
    gradient: 'linear-gradient(to bottom right, hsl(var(--primary)), hsl(217 91% 50%))',
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
                ? 'border-white/30 shadow-lg'
                : 'border-white/10 bg-zinc-900/40 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
            }`}
            style={isActive ? { background: 'rgba(255,255,255,0.1)' } : undefined}
          >
            <div className="inline-flex p-2 rounded-lg mb-2" style={{ background: s.gradient }}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">
              {s.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {s.description}
            </div>
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.8)' }} />
            )}
          </button>
        );
      })}
    </div>
  );
};
