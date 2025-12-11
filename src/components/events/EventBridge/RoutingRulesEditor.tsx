import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { notify } from '@/lib/notify';

interface RoutingRule {
  id: string;
  destination: string;
  condition: 'always' | 'has_phone' | 'has_title' | 'title_contains';
  condition_value?: string;
}

interface RoutingRulesEditorProps {
  flowId: string;
  rules: RoutingRule[];
}

const DESTINATIONS = [
  { id: 'kylas', name: 'Kylas CRM', description: 'for immediate calling' },
  { id: 'zoho', name: 'Zoho CRM', description: 'for record-keeping' },
  { id: 'hubspot', name: 'HubSpot', description: 'marketing automation' },
];

const CONDITIONS = [
  { id: 'always', name: 'Always', description: 'send all registrations' },
  { id: 'has_phone', name: 'Has Phone', description: 'only if phone was enriched' },
  { id: 'has_title', name: 'Has Title', description: 'only if job title was found' },
  { id: 'title_contains', name: 'Title Contains', description: 'job title matches text' },
];

export function RoutingRulesEditor({ flowId, rules: initialRules }: RoutingRulesEditorProps) {
  const queryClient = useQueryClient();
  const [rules, setRules] = useState<RoutingRule[]>(initialRules);
  const [hasChanges, setHasChanges] = useState(false);

  const saveRulesMutation = useMutation({
    mutationFn: async (newRules: RoutingRule[]) => {
      const { error } = await supabase
        .from('event_bridge_flows')
        .update({ routing_rules: newRules as unknown as any })
        .eq('id', flowId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-bridge-flows'] });
      notify.success('routing rules saved');
      setHasChanges(false);
    },
    onError: () => {
      notify.error('failed to save rules');
    },
  });

  const addRule = () => {
    const newRule: RoutingRule = {
      id: crypto.randomUUID(),
      destination: 'zoho',
      condition: 'always',
    };
    setRules([...rules, newRule]);
    setHasChanges(true);
  };

  const updateRule = (id: string, updates: Partial<RoutingRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
    setHasChanges(true);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveRulesMutation.mutate(rules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">routing rules</h4>
        <Button variant="outline" size="sm" onClick={addRule}>
          <Plus className="h-4 w-4 mr-1" />
          add rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          no routing rules configured. add a rule to sync registrations to your CRM.
        </p>
      ) : (
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
            >
              <Badge variant="outline" className="shrink-0">
                {index + 1}
              </Badge>

              {/* Condition */}
              <div className="flex-1">
                <Select
                  value={rule.condition}
                  onValueChange={(value) => updateRule(rule.id, { condition: value as RoutingRule['condition'] })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Value (for title_contains) */}
              {rule.condition === 'title_contains' && (
                <Input
                  placeholder="e.g., CEO, VP"
                  value={rule.condition_value || ''}
                  onChange={(e) => updateRule(rule.id, { condition_value: e.target.value })}
                  className="w-32 h-9"
                />
              )}

              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

              {/* Destination */}
              <div className="flex-1">
                <Select
                  value={rule.destination}
                  onValueChange={(value) => updateRule(rule.id, { destination: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATIONS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        <div>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(rule.id)}
                className="shrink-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saveRulesMutation.isPending}
            size="sm"
          >
            {saveRulesMutation.isPending ? 'saving...' : 'save rules'}
          </Button>
        </div>
      )}
    </div>
  );
}
