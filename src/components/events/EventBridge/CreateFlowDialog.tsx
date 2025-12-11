import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { notify } from '@/lib/notify';
import { Zap, Database, ArrowRight } from 'lucide-react';

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFlowDialog({ open, onOpenChange }: CreateFlowDialogProps) {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [sourceType, setSourceType] = useState('luma');
  const [eventUrl, setEventUrl] = useState('');
  const [enrichmentEnabled, setEnrichmentEnabled] = useState(true);
  const [enrichmentProvider, setEnrichmentProvider] = useState('apollo');
  const [magicLinkEnabled, setMagicLinkEnabled] = useState(true);

  const createFlowMutation = useMutation({
    mutationFn: async () => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');

      const { data, error } = await supabase
        .from('event_bridge_flows')
        .insert({
          workspace_id: currentWorkspace.id,
          name,
          source_type: sourceType,
          source_config: { event_url: eventUrl },
          enrichment_enabled: enrichmentEnabled,
          enrichment_provider: enrichmentEnabled ? enrichmentProvider : null,
          magic_link_enabled: magicLinkEnabled,
          routing_rules: [],
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-bridge-flows'] });
      notify.success('flow created successfully');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      notify.error('failed to create flow');
      console.error('Create flow error:', error);
    },
  });

  const resetForm = () => {
    setName('');
    setSourceType('luma');
    setEventUrl('');
    setEnrichmentEnabled(true);
    setEnrichmentProvider('apollo');
    setMagicLinkEnabled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify.error('please enter a flow name');
      return;
    }
    createFlowMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            create event bridge flow
          </DialogTitle>
          <DialogDescription>
            connect your event platform to your CRM with automatic enrichment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flow Name */}
          <div className="space-y-2">
            <Label htmlFor="name">flow name</Label>
            <Input
              id="name"
              placeholder="e.g., AI Summit 2025 Registrations"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Source Type */}
          <div className="space-y-2">
            <Label>event source</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luma">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Luma
                  </div>
                </SelectItem>
                <SelectItem value="eventbrite">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Eventbrite
                  </div>
                </SelectItem>
                <SelectItem value="generic">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Generic Webhook
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event URL */}
          <div className="space-y-2">
            <Label htmlFor="eventUrl">event URL (optional)</Label>
            <Input
              id="eventUrl"
              placeholder="https://lu.ma/your-event"
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              used for magic link redirects
            </p>
          </div>

          {/* Enrichment */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label>lead enrichment</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  automatically find phone numbers and job titles
                </p>
              </div>
              <Switch
                checked={enrichmentEnabled}
                onCheckedChange={setEnrichmentEnabled}
              />
            </div>

            {enrichmentEnabled && (
              <div className="space-y-2">
                <Label>enrichment provider</Label>
                <Select value={enrichmentProvider} onValueChange={setEnrichmentProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apollo">Apollo.io</SelectItem>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="zoominfo">ZoomInfo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Magic Link */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <Label>attribution magic link</Label>
              <p className="text-xs text-muted-foreground mt-1">
                cookie visitors for future website attribution
              </p>
            </div>
            <Switch
              checked={magicLinkEnabled}
              onCheckedChange={setMagicLinkEnabled}
            />
          </div>

          {/* Flow Preview */}
          <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded bg-primary/10">
                <Database className="h-3 w-3" />
              </div>
              <span>{sourceType === 'luma' ? 'Luma' : sourceType === 'eventbrite' ? 'Eventbrite' : 'Webhook'}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded bg-primary/10">
                <Zap className="h-3 w-3" />
              </div>
              <span>{enrichmentEnabled ? enrichmentProvider : 'skip'}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">configure destinations →</span>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              cancel
            </Button>
            <Button type="submit" disabled={createFlowMutation.isPending}>
              {createFlowMutation.isPending ? 'creating...' : 'create flow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
