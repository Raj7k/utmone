import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTargetingRules, TargetingRule } from '@/hooks/useTargetingRules';

interface TargetingRulesManagerProps {
  linkId: string;
}

export function TargetingRulesManager({ linkId }: TargetingRulesManagerProps) {
  const { rules, isLoading, createRule, updateRule, deleteRule } = useTargetingRules(linkId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'country' as TargetingRule['rule_type'],
    condition: 'in' as TargetingRule['condition'],
    value: '',
    redirect_url: '',
    priority: 0,
  });

  const handleSubmit = () => {
    const valueArray = formData.value.split(',').map(v => v.trim()).filter(Boolean);
    
    createRule({
      link_id: linkId,
      rule_name: formData.rule_name,
      rule_type: formData.rule_type,
      condition: formData.condition,
      value: valueArray,
      redirect_url: formData.redirect_url,
      priority: formData.priority,
      is_active: true,
    });

    setIsDialogOpen(false);
    setFormData({
      rule_name: '',
      rule_type: 'country',
      condition: 'in',
      value: '',
      redirect_url: '',
      priority: 0,
    });
  };

  const getRuleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      country: 'Country',
      device: 'Device',
      os: 'Operating System',
      browser: 'Browser',
      language: 'Language',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return <div className="text-sm text-secondary-label">loading rules...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-label">
          redirect users to different URLs based on location, device, or browser
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              add rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>create targeting rule</DialogTitle>
              <DialogDescription>
                define conditions that redirect users to specific URLs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rule_name">rule name</Label>
                <Input
                  id="rule_name"
                  value={formData.rule_name}
                  onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                  placeholder="e.g., US mobile users"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule_type">target by</Label>
                  <Select
                    value={formData.rule_type}
                    onValueChange={(value) => setFormData({ ...formData, rule_type: value as TargetingRule['rule_type'] })}
                  >
                    <SelectTrigger id="rule_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="country">country</SelectItem>
                      <SelectItem value="device">device</SelectItem>
                      <SelectItem value="os">operating system</SelectItem>
                      <SelectItem value="browser">browser</SelectItem>
                      <SelectItem value="language">language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value as TargetingRule['condition'] })}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">is one of</SelectItem>
                      <SelectItem value="not_in">is not one of</SelectItem>
                      <SelectItem value="contains">contains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="value">values (comma separated)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., US, CA, UK"
                />
                <p className="text-xs text-secondary-label mt-1">
                  for countries use 2-letter codes (US, CA, UK). for devices use mobile, desktop, tablet
                </p>
              </div>
              <div>
                <Label htmlFor="redirect_url">redirect URL</Label>
                <Input
                  id="redirect_url"
                  type="url"
                  value={formData.redirect_url}
                  onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                  placeholder="https://example.com/us-landing"
                />
              </div>
              <div>
                <Label htmlFor="priority">priority (higher = evaluated first)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>create rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {rules && rules.length > 0 ? (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-secondary-label mt-1" />
                  <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.rule_name}</h4>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'active' : 'inactive'}
                        </Badge>
                      <Badge variant="outline">priority: {rule.priority}</Badge>
                    </div>
                    <div className="text-sm text-secondary-label">
                      if {getRuleTypeLabel(rule.rule_type).toLowerCase()} {rule.condition.replace('_', ' ')} <span className="font-mono">{rule.value.join(', ')}</span>
                    </div>
                      <div className="text-sm">
                        → <span className="font-mono" style={{ color: 'rgba(59,130,246,1)' }}>{rule.redirect_url}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={(checked) =>
                        updateRule({ id: rule.id, is_active: checked })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-secondary-label">
              no targeting rules yet. create your first rule to redirect users based on their location or device.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
