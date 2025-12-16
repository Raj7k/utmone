import { Card } from "@/components/ui/card";
import { ShoppingCart, FileText, UserPlus, Target, Rocket, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type EventType = 'purchase' | 'lead' | 'signup' | 'trial_start' | 'custom';

interface EventTypeSelectorProps {
  selected: EventType | null;
  onSelect: (type: EventType) => void;
}

const eventTypes: { type: EventType; label: string; description: string; example: string; icon: React.ElementType; color: string }[] = [
  {
    type: 'purchase',
    label: 'Purchase',
    description: 'Someone paid you money',
    example: 'Order total ($99.99)',
    icon: ShoppingCart,
    color: 'text-green-600 bg-green-500/10 border-green-500/20',
  },
  {
    type: 'lead',
    label: 'Lead / Form',
    description: 'Contact form, demo request',
    example: 'Estimated deal value ($500) or $0',
    icon: FileText,
    color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  },
  {
    type: 'signup',
    label: 'Signup',
    description: 'Account created',
    example: 'Plan price or $0 for free',
    icon: UserPlus,
    color: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
  },
  {
    type: 'trial_start',
    label: 'Trial Start',
    description: 'Free trial began',
    example: 'Expected conversion value',
    icon: Rocket,
    color: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
  },
  {
    type: 'custom',
    label: 'Custom Goal',
    description: 'Download, video, button click',
    example: 'Optional value or $0',
    icon: Target,
    color: 'text-slate-600 bg-slate-500/10 border-slate-500/20',
  },
];

export function EventTypeSelector({ selected, onSelect }: EventTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {eventTypes.map(({ type, label, description, example, icon: Icon, color }) => (
        <Card
          key={type}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-md border-2",
            selected === type 
              ? "border-primary ring-2 ring-primary/20" 
              : "border-transparent hover:border-muted-foreground/20"
          )}
          onClick={() => onSelect(type)}
        >
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", color.split(' ').slice(1).join(' '))}>
              <Icon className={cn("h-5 w-5", color.split(' ')[0])} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              <p className="text-xs text-muted-foreground/70 mt-1 truncate">
                💰 {example}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function EventTypeQuickReference() {
  return (
    <Card className="p-4 bg-muted/30">
      <h4 className="text-sm font-medium text-foreground mb-3">quick reference: when to use each event</h4>
      <div className="space-y-2">
        {eventTypes.slice(0, 4).map(({ type, label, description, icon: Icon, color }) => (
          <div key={type} className="flex items-center gap-3 text-sm">
            <div className={cn("p-1.5 rounded", color.split(' ').slice(1).join(' '))}>
              <Icon className={cn("h-3.5 w-3.5", color.split(' ')[0])} />
            </div>
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{type}</code>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">{description}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
