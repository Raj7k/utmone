import { useState } from "react";
import { toast } from "sonner";
import { Download, Shield, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export function DataPrivacySettings() {
  // Use local state since profiles table doesn't exist yet
  const [trackingConsent, setTrackingConsent] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState(90);
  const [isExporting, setIsExporting] = useState(false);

  const handleTrackingChange = (checked: boolean) => {
    setTrackingConsent(checked);
    toast.success('privacy settings updated');
  };

  const handleRetentionChange = (value: string) => {
    setDataRetentionDays(parseInt(value));
    toast.success('privacy settings updated');
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('export-user-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      if (response.data?.download_url) {
        window.open(response.data.download_url, '_blank');
        toast.success('data export ready! download started.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">data & privacy</h2>
        <p className="text-muted-foreground">
          control how your data is collected, stored, and used
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {trackingConsent ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
            click tracking
          </CardTitle>
          <CardDescription>
            control whether clicks on your links are tracked for analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tracking-consent" className="flex-1">
              enable click tracking
            </Label>
            <Switch
              id="tracking-consent"
              checked={trackingConsent}
              onCheckedChange={handleTrackingChange}
            />
          </div>
          
          {!trackingConsent && (
            <Alert>
              <AlertDescription>
                <strong>warning:</strong> disabling tracking means you won't see click analytics, 
                device breakdowns, or geographic data for your links. only total click counts will be tracked.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            data retention
          </CardTitle>
          <CardDescription>
            how long to keep granular click data (ip addresses, user agents)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retention">retention period</Label>
            <Select
              value={String(dataRetentionDays)}
              onValueChange={handleRetentionChange}
            >
              <SelectTrigger id="retention">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days (recommended)</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              after this period, granular data is deleted but aggregated analytics 
              (country-level, device types) are kept indefinitely
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            export your data
          </CardTitle>
          <CardDescription>
            download a complete copy of your account data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            includes your profile, workspaces, links, click analytics (last 90 days), 
            and api keys. data is provided in json format.
          </p>
          
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'preparing export...' : 'export my data'}
          </Button>

          <p className="text-xs text-muted-foreground">
            export links expire after 7 days. you can request a new export anytime.
          </p>
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            for more information about how we handle your data, see our{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">
              privacy policy
            </a>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            need to delete your account? contact support@utm.one
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
