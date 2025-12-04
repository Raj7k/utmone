import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Bell, Archive, Zap, Save, Settings } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SettingsPanelUltimateProps {
  workspaceId: string;
}

export const SettingsPanelUltimate = ({ workspaceId }: SettingsPanelUltimateProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    compareUTM: true,
    compareCampaign: true,
    compareSchedule: false,
    autoVersion: true,
    suggestAlternatives: true,
    trackLineage: true,
    mergeAnalytics: false,
    smartRouting: false,
    abTestMode: false,
    maxVersions: 10,
    archiveOld: true,
    notifyOnDuplicate: true,
    autoArchiveDays: 90,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for persistence
      localStorage.setItem(`duplicate-settings-${workspaceId}`, JSON.stringify(settings));

      toast({
        title: 'settings saved',
        description: 'your duplicate handling preferences have been updated',
      });
    } catch (error: any) {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Duplicate Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title-2 flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Shield className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            Duplicate Detection
          </CardTitle>
          <CardDescription>
            configure how the system identifies and handles duplicate urls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="compare-utm" className="text-sm font-semibold">
                Compare UTM Parameters
              </Label>
              <p className="text-xs text-secondary-label">different utm = different url</p>
            </div>
            <Switch
              id="compare-utm"
              checked={settings.compareUTM}
              onCheckedChange={(checked) => setSettings({ ...settings, compareUTM: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="compare-campaign" className="text-sm font-semibold">
                Compare Campaign Context
              </Label>
              <p className="text-xs text-secondary-label">different campaign = new version</p>
            </div>
            <Switch
              id="compare-campaign"
              checked={settings.compareCampaign}
              onCheckedChange={(checked) => setSettings({ ...settings, compareCampaign: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="compare-schedule" className="text-sm font-semibold">
                Compare Schedule
              </Label>
              <p className="text-xs text-secondary-label">different schedule = new version</p>
            </div>
            <Switch
              id="compare-schedule"
              checked={settings.compareSchedule}
              onCheckedChange={(checked) => setSettings({ ...settings, compareSchedule: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Version Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title-2 flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Settings className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            Version Management
          </CardTitle>
          <CardDescription>
            control how versions are created and managed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="auto-version" className="text-sm font-semibold">
                Auto-Increment Versions
              </Label>
              <p className="text-xs text-secondary-label">automatically create v1, v2, v3...</p>
            </div>
            <Switch
              id="auto-version"
              checked={settings.autoVersion}
              onCheckedChange={(checked) => setSettings({ ...settings, autoVersion: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="suggest-alternatives" className="text-sm font-semibold">
                Show Alternative Links
              </Label>
              <p className="text-xs text-secondary-label">suggest existing alternatives</p>
            </div>
            <Switch
              id="suggest-alternatives"
              checked={settings.suggestAlternatives}
              onCheckedChange={(checked) => setSettings({ ...settings, suggestAlternatives: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="track-lineage" className="text-sm font-semibold">
                Track Parent-Child Relationships
              </Label>
              <p className="text-xs text-secondary-label">maintain version history tree</p>
            </div>
            <Switch
              id="track-lineage"
              checked={settings.trackLineage}
              onCheckedChange={(checked) => setSettings({ ...settings, trackLineage: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="max-versions" className="text-sm font-semibold">
              Maximum Versions per URL
            </Label>
            <Input
              id="max-versions"
              type="number"
              min={1}
              max={50}
              value={settings.maxVersions}
              onChange={(e) => setSettings({ ...settings, maxVersions: parseInt(e.target.value) })}
            />
            <p className="text-xs text-secondary-label">limit version count (1-50)</p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title-2 flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Zap className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            Advanced Features
            <Badge variant="secondary" className="text-xs ml-2">experimental</Badge>
          </CardTitle>
          <CardDescription>
            cutting-edge features for power users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="merge-analytics" className="text-sm font-semibold">
                Merge Analytics
              </Label>
              <p className="text-xs text-secondary-label">combine stats for same destination</p>
            </div>
            <Switch
              id="merge-analytics"
              checked={settings.mergeAnalytics}
              onCheckedChange={(checked) => setSettings({ ...settings, mergeAnalytics: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="smart-routing" className="text-sm font-semibold">
                Smart Routing
              </Label>
              <p className="text-xs text-secondary-label">route to best performer automatically</p>
            </div>
            <Switch
              id="smart-routing"
              checked={settings.smartRouting}
              onCheckedChange={(checked) => setSettings({ ...settings, smartRouting: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="ab-test-mode" className="text-sm font-semibold">
                A/B Test Mode
              </Label>
              <p className="text-xs text-secondary-label">create test variants automatically</p>
            </div>
            <Switch
              id="ab-test-mode"
              checked={settings.abTestMode}
              onCheckedChange={(checked) => setSettings({ ...settings, abTestMode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto-Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title-2 flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Archive className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            Auto-Archive
          </CardTitle>
          <CardDescription>
            automatically archive old or underperforming versions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="archive-old" className="text-sm font-semibold">
                Auto-Archive Old Versions
              </Label>
              <p className="text-xs text-secondary-label">archive inactive versions automatically</p>
            </div>
            <Switch
              id="archive-old"
              checked={settings.archiveOld}
              onCheckedChange={(checked) => setSettings({ ...settings, archiveOld: checked })}
            />
          </div>

          {settings.archiveOld && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="archive-days" className="text-sm font-semibold">
                  Archive After Days
                </Label>
                <Input
                  id="archive-days"
                  type="number"
                  min={30}
                  max={365}
                  value={settings.autoArchiveDays}
                  onChange={(e) => setSettings({ ...settings, autoArchiveDays: parseInt(e.target.value) })}
                />
                <p className="text-xs text-secondary-label">archive versions older than X days</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title-2 flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Bell className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            Notifications
          </CardTitle>
          <CardDescription>
            get notified about important events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="notify-duplicate" className="text-sm font-semibold">
                Notify on Duplicate Detection
              </Label>
              <p className="text-xs text-secondary-label">alert when duplicates are found</p>
            </div>
            <Switch
              id="notify-duplicate"
              checked={settings.notifyOnDuplicate}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyOnDuplicate: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6"
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
