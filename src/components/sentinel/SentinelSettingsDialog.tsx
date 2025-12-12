import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Package, Activity, Bot, Wrench, Loader2 } from "lucide-react";
import { useSentinelConfig, useUpdateSentinelConfig, SentinelConfig } from "@/hooks/useSentinelConfig";
import { notify } from "@/lib/notify";

interface SentinelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkId: string;
}

export function SentinelSettingsDialog({ open, onOpenChange, linkId }: SentinelSettingsDialogProps) {
  const { data, isLoading } = useSentinelConfig(linkId);
  const updateConfig = useUpdateSentinelConfig();
  
  const [enabled, setEnabled] = useState(false);
  const [config, setConfig] = useState<SentinelConfig>({});

  useEffect(() => {
    if (data) {
      setEnabled(data.sentinel_enabled);
      setConfig(data.sentinel_config || {});
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        linkId,
        sentinel_enabled: enabled,
        sentinel_config: config,
      });
      notify.success("sentinel settings saved.");
      onOpenChange(false);
    } catch (error) {
      notify.error("failed to save sentinel settings.");
    }
  };

  const updateInventoryConfig = (updates: Partial<SentinelConfig['inventory_check']>) => {
    setConfig(prev => ({
      ...prev,
      inventory_check: { ...prev.inventory_check, enabled: prev.inventory_check?.enabled ?? false, ...updates },
    }));
  };

  const updateHealthConfig = (updates: Partial<SentinelConfig['health_preflight']>) => {
    setConfig(prev => ({
      ...prev,
      health_preflight: { ...prev.health_preflight, enabled: prev.health_preflight?.enabled ?? false, ...updates },
    }));
  };

  const updateAiBotConfig = (updates: Partial<SentinelConfig['ai_bot_mode']>) => {
    setConfig(prev => ({
      ...prev,
      ai_bot_mode: { ...prev.ai_bot_mode, enabled: prev.ai_bot_mode?.enabled ?? false, ...updates },
    }));
  };

  const updateAutoHealConfig = (updates: Partial<SentinelConfig['auto_heal']>) => {
    setConfig(prev => ({
      ...prev,
      auto_heal: { ...prev.auto_heal, enabled: prev.auto_heal?.enabled ?? false, ...updates },
    }));
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            sentinel mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <Label className="text-base font-medium">enable sentinel</Label>
              <p className="text-sm text-muted-foreground mt-1">
                protect this link with intelligent preflight checks
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="inventory" className="text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  stock
                </TabsTrigger>
                <TabsTrigger value="health" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  health
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  AI bots
                </TabsTrigger>
                <TabsTrigger value="heal" className="text-xs">
                  <Wrench className="h-3 w-3 mr-1" />
                  auto-heal
                </TabsTrigger>
              </TabsList>

              {/* Inventory Check Tab */}
              <TabsContent value="inventory" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>stock-aware routing</Label>
                    <p className="text-xs text-muted-foreground">redirect when product is out of stock</p>
                  </div>
                  <Switch
                    checked={config.inventory_check?.enabled ?? false}
                    onCheckedChange={(checked) => updateInventoryConfig({ enabled: checked })}
                  />
                </div>
                
                {config.inventory_check?.enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku">shopify SKU</Label>
                      <Input
                        id="sku"
                        placeholder="e.g., PROD-001"
                        value={config.inventory_check?.shopify_sku ?? ''}
                        onChange={(e) => updateInventoryConfig({ shopify_sku: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold">minimum stock threshold</Label>
                      <Input
                        id="threshold"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={config.inventory_check?.threshold ?? 0}
                        onChange={(e) => updateInventoryConfig({ threshold: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fallback">fallback URL</Label>
                      <Input
                        id="fallback"
                        placeholder="https://example.com/similar-products"
                        value={config.inventory_check?.fallback_url ?? ''}
                        onChange={(e) => updateInventoryConfig({ fallback_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">where to redirect when out of stock</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Health Check Tab */}
              <TabsContent value="health" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>destination health check</Label>
                    <p className="text-xs text-muted-foreground">verify destination is reachable before redirect</p>
                  </div>
                  <Switch
                    checked={config.health_preflight?.enabled ?? false}
                    onCheckedChange={(checked) => updateHealthConfig({ enabled: checked })}
                  />
                </div>
                
                {config.health_preflight?.enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="timeout">timeout (ms)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        min={100}
                        max={10000}
                        placeholder="3000"
                        value={config.health_preflight?.timeout_ms ?? 3000}
                        onChange={(e) => updateHealthConfig({ timeout_ms: parseInt(e.target.value) || 3000 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="health-fallback">fallback URL</Label>
                      <Input
                        id="health-fallback"
                        placeholder="https://example.com/maintenance"
                        value={config.health_preflight?.fallback_url ?? ''}
                        onChange={(e) => updateHealthConfig({ fallback_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">where to redirect if destination is down</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* AI Bot Tab */}
              <TabsContent value="ai" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI bot detection</Label>
                    <p className="text-xs text-muted-foreground">serve structured data to AI crawlers</p>
                  </div>
                  <Switch
                    checked={config.ai_bot_mode?.enabled ?? false}
                    onCheckedChange={(checked) => updateAiBotConfig({ enabled: checked })}
                  />
                </div>
                
                {config.ai_bot_mode?.enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="json-payload">JSON payload for AI bots</Label>
                      <textarea
                        id="json-payload"
                        className="w-full h-32 p-3 rounded-md border border-border bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder='{"product": "...", "price": "...", "description": "..."}'
                        value={JSON.stringify(config.ai_bot_mode?.json_payload ?? {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            updateAiBotConfig({ json_payload: parsed });
                          } catch {
                            // Allow invalid JSON while typing
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">structured data returned to GPT, Claude, Perplexity</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Auto-Heal Tab */}
              <TabsContent value="heal" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>auto-heal broken links</Label>
                    <p className="text-xs text-muted-foreground">automatically find replacement URLs via sitemap</p>
                  </div>
                  <Switch
                    checked={config.auto_heal?.enabled ?? false}
                    onCheckedChange={(checked) => updateAutoHealConfig({ enabled: checked })}
                  />
                </div>
                
                {config.auto_heal?.enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="sitemap">sitemap URL</Label>
                      <Input
                        id="sitemap"
                        placeholder="https://example.com/sitemap.xml"
                        value={config.auto_heal?.sitemap_url ?? ''}
                        onChange={(e) => updateAutoHealConfig({ sitemap_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">used to find the best replacement page</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button onClick={handleSave} disabled={updateConfig.isPending}>
            {updateConfig.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            save settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
