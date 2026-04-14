import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseFrom } from '@/lib/supabaseHelper';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, ArrowRight, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { notify } from '@/lib/notify';
import { CRMSetupGuide } from './CRMSetupGuide';

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
  { id: 'salesforce', name: 'Salesforce', description: 'enterprise CRM' },
  { id: 'pipedrive', name: 'Pipedrive', description: 'sales pipeline' },
];

const CONDITIONS = [
  { id: 'always', name: 'Always', description: 'send all registrations' },
  { id: 'has_phone', name: 'Has Phone', description: 'only if phone was enriched' },
  { id: 'has_title', name: 'Has Title', description: 'only if job title was found' },
  { id: 'title_contains', name: 'Title Contains', description: 'job title matches text' },
];

export function RoutingRulesEditor({ flowId, rules: initialRules }: RoutingRulesEditorProps) {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceContext();
  const [rules, setRules] = useState<RoutingRule[]>(initialRules);
  const [hasChanges, setHasChanges] = useState(false);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);

  // Fetch connected integrations to check which CRMs are configured
  const { data: integrations = [] } = useQuery({
    queryKey: ['integrations', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const { data, error } = await supabaseFrom('integrations')
        .select('provider, is_active')
        .eq('workspace_id', currentWorkspace.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  const connectedCRMs = new Set(
    integrations.filter(i => i.is_active).map(i => i.provider)
  );

  const saveRulesMutation = useMutation({
    mutationFn: async (newRules: RoutingRule[]) => {
      const { error } = await supabaseFrom('event_bridge_flows')
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
    // Find first connected CRM or default to first destination
    const defaultDestination = DESTINATIONS.find(d => connectedCRMs.has(d.id))?.id || 'zoho';
    
    const newRule: RoutingRule = {
      id: crypto.randomUUID(),
      destination: defaultDestination,
      condition: 'always',
    };
    setRules([...rules, newRule]);
    setHasChanges(true);
  };

  const updateRule = (id: string, updates: Partial<RoutingRule>) => {
    // Check if destination is connected
    if (updates.destination && !connectedCRMs.has(updates.destination)) {
      notify.banner.warning(`${DESTINATIONS.find(d => d.id === updates.destination)?.name} is not connected. Please set it up first.`);
      setSetupDialogOpen(true);
      return;
    }
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
    setHasChanges(true);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Validate all destinations are connected
    const unconnectedDestinations = rules.filter(r => !connectedCRMs.has(r.destination));
    if (unconnectedDestinations.length > 0) {
      const names = unconnectedDestinations.map(r => 
        DESTINATIONS.find(d => d.id === r.destination)?.name
      ).join(', ');
      notify.error(`Please connect ${names} before saving`);
      return;
    }
    saveRulesMutation.mutate(rules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">routing rules</h4>
        <div className="flex gap-2">
          <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                configure CRMs
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>CRM Integration Setup</DialogTitle>
              </DialogHeader>
              <CRMSetupGuide onComplete={() => {
                setSetupDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ['integrations'] });
              }} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={addRule}>
            <Plus className="h-4 w-4 mr-1" />
            add rule
          </Button>
        </div>
      </div>

      {/* Connection Status Summary */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
        {DESTINATIONS.map(dest => {
          const isConnected = connectedCRMs.has(dest.id);
          return (
            <Badge 
              key={dest.id} 
              variant={isConnected ? "default" : "outline"}
              className={isConnected ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "text-muted-foreground"}
            >
              {isConnected ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              {dest.name}
            </Badge>
          );
        })}
      </div>

      {rules.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          no routing rules configured. add a rule to sync registrations to your CRM.
        </p>
      ) : (
        <div className="space-y-3">
          {rules.map((rule, index) => {
            const isDestinationConnected = connectedCRMs.has(rule.destination);
            return (
              <div
                key={rule.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isDestinationConnected 
                    ? 'bg-background border-border' 
                    : 'bg-destructive/5 border-destructive/20'
                }`}
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
                    <SelectTrigger className={`h-9 ${!isDestinationConnected ? 'border-destructive' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATIONS.map((d) => {
                        const connected = connectedCRMs.has(d.id);
                        return (
                          <SelectItem key={d.id} value={d.id}>
                            <div className="flex items-center gap-2">
                              {connected ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-muted-foreground" />
                              )}
                              <div>
                                <div className="font-medium">{d.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {connected ? d.description : 'not connected'}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {!isDestinationConnected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSetupDialogOpen(true)}
                    className="shrink-0 text-amber-500 hover:text-amber-400"
                  >
                    setup
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(rule.id)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
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
