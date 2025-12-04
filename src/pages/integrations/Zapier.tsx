import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function ZapierIntegration() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleCopyWebhook = () => {
    const webhook = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zapier-webhook`;
    navigator.clipboard.writeText(webhook);
    toast({ title: 'Webhook URL copied' });
  };

  const handleTestConnection = async () => {
    if (!webhookUrl) {
      toast({ title: 'Please enter your Zapier webhook URL', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'test',
          timestamp: new Date().toISOString(),
        }),
      });

      setIsConnected(true);
      toast({ title: 'Test event sent to Zapier' });
    } catch (error) {
      toast({ title: 'Connection test failed', variant: 'destructive' });
    }
  };

  const zapTemplates = [
    {
      title: 'New Link Created → Send Slack Message',
      description: 'Get notified in Slack when a new short link is created',
      url: 'https://zapier.com',
    },
    {
      title: 'Link Clicked → Add to Google Sheets',
      description: 'Log every link click to a spreadsheet for analysis',
      url: 'https://zapier.com',
    },
    {
      title: 'High Traffic Link → Email Alert',
      description: 'Receive an email when a link reaches 1000+ clicks',
      url: 'https://zapier.com',
    },
    {
      title: 'QR Code Generated → Save to Dropbox',
      description: 'Automatically backup QR codes to cloud storage',
      url: 'https://zapier.com',
    },
  ];

  return (
    <div className="container max-w-4xl py-16 space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-accent rounded-full">
            <Zap className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 hero-gradient">
          Zapier Integration
        </h1>
        <p className="text-xl text-secondary-label">
          Connect utm.one to 5,000+ apps with Zapier automation
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Configure your Zapier webhook</CardDescription>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Zapier Webhook URL</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button onClick={handleTestConnection}>Test Connection</Button>
            </div>
            <p className="text-sm text-secondary-label mt-2">
              Create a Zap with a "Webhooks by Zapier" trigger to get your webhook URL
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Triggers</CardTitle>
          <CardDescription>Events that can start your Zaps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Link Created</h4>
              <p className="text-sm text-secondary-label">Triggers when a new short link is created</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Link Clicked</h4>
              <p className="text-sm text-secondary-label">Triggers when someone clicks your short link</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Conversion Tracked</h4>
              <p className="text-sm text-secondary-label">Triggers when a conversion event is recorded</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zap Templates</CardTitle>
          <CardDescription>Popular workflows to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {zapTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium">{template.title}</h4>
                <p className="text-sm text-secondary-label">{template.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href={template.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Use Template
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol>
            <li>Go to <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(59,130,246,1)' }}>Zapier.com</a> and create a new Zap</li>
            <li>Choose "Webhooks by Zapier" as your trigger app</li>
            <li>Select "Catch Hook" as the trigger event</li>
            <li>Copy the webhook URL provided by Zapier</li>
            <li>Paste it above and test the connection</li>
            <li>Complete your Zap by choosing an action app (Slack, Google Sheets, etc.)</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
