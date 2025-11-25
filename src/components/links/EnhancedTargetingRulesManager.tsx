import { useState } from 'react';
import { Plus, Trash2, GripVertical, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTargetingRules, TargetingRule } from '@/hooks/useTargetingRules';
import { countries, devicePresets, osPresets, browserPresets, languagePresets } from '@/lib/countryData';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TargetingRulesManagerProps {
  linkId: string;
}

function SortableRuleCard({ rule, onToggle, onDelete }: { 
  rule: TargetingRule; 
  onToggle: (checked: boolean) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: rule.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-secondary-label mt-1" />
            </button>
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
                → <span className="font-mono text-primary">{rule.redirect_url}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={rule.is_active} onCheckedChange={onToggle} />
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EnhancedTargetingRulesManager({ linkId }: TargetingRulesManagerProps) {
  const { rules, isLoading, createRule, updateRule, deleteRule } = useTargetingRules(linkId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'country' as TargetingRule['rule_type'],
    condition: 'in' as TargetingRule['condition'],
    value: '',
    redirect_url: '',
    priority: 0,
  });
  const [countrySearch, setCountrySearch] = useState('');
  const [testData, setTestData] = useState({
    country: 'US',
    device: 'desktop',
    os: 'Windows',
    browser: 'Chrome',
    language: 'en'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!rules || active.id === over.id) return;

    const oldIndex = rules.findIndex((r) => r.id === active.id);
    const newIndex = rules.findIndex((r) => r.id === over.id);
    const newRules = arrayMove(rules, oldIndex, newIndex);

    // Update priorities
    newRules.forEach((rule, index) => {
      updateRule({ id: rule.id, priority: newRules.length - index });
    });
  };

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

  const addPresetValue = (preset: string) => {
    const currentValues = formData.value.split(',').map(v => v.trim()).filter(Boolean);
    if (!currentValues.includes(preset)) {
      setFormData({ ...formData, value: [...currentValues, preset].join(', ') });
    }
  };

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const getPresets = () => {
    switch (formData.rule_type) {
      case 'device': return devicePresets;
      case 'os': return osPresets;
      case 'browser': return browserPresets;
      case 'language': return languagePresets;
      default: return [];
    }
  };

  // Helper function for test simulator
  const evaluateCondition = (actual: string, condition: string, expected: string[]): boolean => {
    switch (condition) {
      case 'equals':
      case 'in':
        return expected.includes(actual);
      case 'not_in':
        return !expected.includes(actual);
      case 'contains':
        return expected.some(val => actual.toLowerCase().includes(val.toLowerCase()));
      default:
        return false;
    }
  };

  if (isLoading) {
    return <div className="text-sm text-secondary-label">Loading rules...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-label">
          Redirect users to different URLs based on location, device, or browser
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsTestDialogOpen(true)}>
            <TestTube className="w-4 h-4 mr-2" />
            Test Rules
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Targeting Rule</DialogTitle>
                <DialogDescription>
                  Define conditions that redirect users to specific URLs
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rule_name">Rule Name</Label>
                  <Input
                    id="rule_name"
                    value={formData.rule_name}
                    onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                    placeholder="e.g., US Mobile Users"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rule_type">Target By</Label>
                    <Select
                      value={formData.rule_type}
                      onValueChange={(value) => setFormData({ ...formData, rule_type: value as TargetingRule['rule_type'], value: '' })}
                    >
                      <SelectTrigger id="rule_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="device">Device</SelectItem>
                        <SelectItem value="os">Operating System</SelectItem>
                        <SelectItem value="browser">Browser</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value as TargetingRule['condition'] })}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Is One Of</SelectItem>
                        <SelectItem value="not_in">Is Not One Of</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.rule_type === 'country' && (
                  <div>
                    <Label>Country Picker</Label>
                    <Input
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                      {filteredCountries.map((country) => (
                        <Button
                          key={country.code}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => addPresetValue(country.code)}
                        >
                          {country.code} - {country.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.rule_type !== 'country' && getPresets().length > 0 && (
                  <div>
                    <Label>Quick Presets</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getPresets().map((preset) => (
                        <Badge
                          key={preset}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => addPresetValue(preset)}
                        >
                          + {preset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="value">Values (comma separated)</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., US, CA, UK"
                  />
                </div>
                <div>
                  <Label htmlFor="redirect_url">Redirect URL</Label>
                  <Input
                    id="redirect_url"
                    type="url"
                    value={formData.redirect_url}
                    onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                    placeholder="https://example.com/us-landing"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit}>Create Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {rules && rules.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rules.map(r => r.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {rules.map((rule) => (
                <SortableRuleCard
                  key={rule.id}
                  rule={rule}
                  onToggle={(checked) => updateRule({ id: rule.id, is_active: checked })}
                  onDelete={() => deleteRule(rule.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-secondary-label">
              No targeting rules yet. Create your first rule to redirect users based on their location or device.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test Targeting Rules</DialogTitle>
            <DialogDescription>
              Simulate user scenarios to see which rule would match
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-country">Country</Label>
                <Select value={testData.country} onValueChange={(value) => setTestData({ ...testData, country: value })}>
                  <SelectTrigger id="test-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.slice(0, 20).map(c => (
                      <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test-device">Device</Label>
                <Select value={testData.device} onValueChange={(value) => setTestData({ ...testData, device: value })}>
                  <SelectTrigger id="test-device">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {devicePresets.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test-os">Operating System</Label>
                <Select value={testData.os} onValueChange={(value) => setTestData({ ...testData, os: value })}>
                  <SelectTrigger id="test-os">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {osPresets.map(os => (
                      <SelectItem key={os} value={os}>{os}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test-browser">Browser</Label>
                <Select value={testData.browser} onValueChange={(value) => setTestData({ ...testData, browser: value })}>
                  <SelectTrigger id="test-browser">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {browserPresets.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test-language">Language</Label>
                <Select value={testData.language} onValueChange={(value) => setTestData({ ...testData, language: value })}>
                  <SelectTrigger id="test-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languagePresets.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {rules && rules.length > 0 && (() => {
              const matchingRule = rules.find(rule => {
                if (!rule.is_active) return false;
                let matches = false;
                switch (rule.rule_type) {
                  case 'country':
                    matches = evaluateCondition(testData.country, rule.condition, rule.value);
                    break;
                  case 'device':
                    matches = evaluateCondition(testData.device, rule.condition, rule.value);
                    break;
                  case 'os':
                    matches = evaluateCondition(testData.os, rule.condition, rule.value);
                    break;
                  case 'browser':
                    matches = evaluateCondition(testData.browser, rule.condition, rule.value);
                    break;
                  case 'language':
                    matches = evaluateCondition(testData.language, rule.condition, rule.value);
                    break;
                }
                return matches;
              });

              return (
                <Card className={matchingRule ? 'border-primary' : ''}>
                  <CardContent className="p-4">
                    {matchingRule ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Match Found</Badge>
                          <span className="font-medium">{matchingRule.rule_name}</span>
                        </div>
                        <div className="text-sm text-secondary-label">
                          User would be redirected to:
                        </div>
                        <div className="text-sm font-mono text-primary break-all">
                          {matchingRule.redirect_url}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-secondary-label">
                        No rules match these conditions. User would see the default link destination.
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
