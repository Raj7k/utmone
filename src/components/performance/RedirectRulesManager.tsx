import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/hooks/workspace";
import { useRedirectRules } from "@/hooks/useRedirectRules";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowRight, Trash2, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function RedirectRulesManager() {
  const { currentWorkspace } = useWorkspace();
  const { rules, isLoading, createRule, updateRule, deleteRule } = useRedirectRules(currentWorkspace?.id || "");
  const [open, setOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("geo");
  const [destinationUrl, setDestinationUrl] = useState("");

  const handleCreate = () => {
    createRule.mutate({
      workspace_id: currentWorkspace?.id || "",
      rule_name: ruleName,
      rule_type: ruleType,
      conditions: {},
      destination_url: destinationUrl,
      priority: 0,
      is_active: true,
    });
    setOpen(false);
    setRuleName("");
    setDestinationUrl("");
  };

  const toggleRule = (ruleId: string, currentStatus: boolean) => {
    updateRule.mutate({
      ruleId,
      updates: { is_active: !currentStatus },
    });
  };

  const getRuleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      geo: "Geographic",
      device: "Device Type",
      time: "Time-based",
      performance: "Performance",
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Smart Redirect Rules
            </CardTitle>
            <CardDescription>
              Create conditional redirects based on user context
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Redirect Rule</DialogTitle>
                <DialogDescription>
                  Define conditional logic for smart redirects
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="US Mobile Users"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select value={ruleType} onValueChange={setRuleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geo">Geographic Location</SelectItem>
                      <SelectItem value="device">Device Type</SelectItem>
                      <SelectItem value="time">Time-based</SelectItem>
                      <SelectItem value="performance">Performance-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Destination URL</Label>
                  <Input
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://example.com/mobile"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!ruleName || !destinationUrl}>
                  Create Rule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No redirect rules yet. Create smart rules to optimize user experience.
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {rule.rule_name}
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {getRuleTypeLabel(rule.rule_type)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        <ArrowRight className="h-3 w-3" />
                        {rule.destination_url.substring(0, 50)}...
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => toggleRule(rule.id, rule.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRule.mutate(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <Badge variant="outline">
                      Priority: {rule.priority}
                    </Badge>
                    <span className="text-muted-foreground">
                      {rule.match_count} matches
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
