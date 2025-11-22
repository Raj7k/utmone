import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const IntegrationsManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [segmentWriteKey, setSegmentWriteKey] = useState("");

  const connectHubSpot = async () => {
    setLoading('hubspot');
    try {
      const { data, error } = await supabase.functions.invoke('hubspot-oauth', {
        body: {},
        method: 'GET',
      });

      if (error) throw error;

      // Open OAuth popup
      const popup = window.open(data.authUrl, 'HubSpot OAuth', 'width=600,height=700');
      
      // Listen for completion message
      window.addEventListener('message', (event) => {
        if (event.data.type === 'hubspot-connected') {
          popup?.close();
          toast({
            title: "HubSpot Connected",
            description: "Your HubSpot account has been connected successfully.",
          });
          setLoading(null);
        }
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  const connectSalesforce = async () => {
    setLoading('salesforce');
    try {
      const { data, error } = await supabase.functions.invoke('salesforce-oauth', {
        body: {},
        method: 'GET',
      });

      if (error) throw error;

      // Open OAuth popup
      const popup = window.open(data.authUrl, 'Salesforce OAuth', 'width=600,height=700');
      
      // Listen for completion message
      window.addEventListener('message', (event) => {
        if (event.data.type === 'salesforce-connected') {
          popup?.close();
          toast({
            title: "Salesforce Connected",
            description: "Your Salesforce account has been connected successfully.",
          });
          setLoading(null);
        }
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  const configureSegment = async () => {
    if (!segmentWriteKey.trim()) {
      toast({
        title: "Write Key Required",
        description: "Please enter your Segment write key.",
        variant: "destructive",
      });
      return;
    }

    setLoading('segment');
    try {
      const { error } = await supabase.functions.invoke('segment-integration', {
        body: { action: 'configure', writeKey: segmentWriteKey },
      });

      if (error) throw error;

      toast({
        title: "Segment Configured",
        description: "Your Segment write key has been saved successfully.",
      });
      setSegmentWriteKey("");
    } catch (error: any) {
      toast({
        title: "Configuration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>HubSpot</CardTitle>
          <CardDescription>
            Sync link clicks to HubSpot contact timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connectHubSpot} 
            disabled={loading === 'hubspot'}
          >
            {loading === 'hubspot' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect HubSpot
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salesforce</CardTitle>
          <CardDescription>
            Create tasks in Salesforce for link clicks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={connectSalesforce} 
            disabled={loading === 'salesforce'}
          >
            {loading === 'salesforce' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect Salesforce
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segment CDP</CardTitle>
          <CardDescription>
            Stream link click events to your Segment data warehouse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="segment-write-key">Write Key</Label>
            <Input
              id="segment-write-key"
              type="password"
              placeholder="Enter your Segment write key"
              value={segmentWriteKey}
              onChange={(e) => setSegmentWriteKey(e.target.value)}
            />
          </div>
          <Button 
            onClick={configureSegment} 
            disabled={loading === 'segment'}
          >
            {loading === 'segment' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
