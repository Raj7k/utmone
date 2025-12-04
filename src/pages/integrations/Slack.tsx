import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bell, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SlackIntegration() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleTestNotification = async () => {
    if (!webhookUrl) {
      toast({ title: 'Please enter your Slack webhook URL', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '✨ Test notification from utm.one',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*utm.one* is now connected! You\'ll receive notifications here.',
              },
            },
          ],
        }),
      });

      setIsConnected(true);
      toast({ title: 'Test notification sent to Slack' });
    } catch (error) {
      toast({ title: 'Connection test failed', variant: 'destructive' });
    }
  };

  return (
    <div className="container max-w-4xl py-16 space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-accent rounded-full">
            <MessageSquare className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 hero-gradient">
          Slack Integration
        </h1>
        <p className="text-xl text-secondary-label">
          Get real-time notifications and create links from Slack
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Configure your Slack webhook</CardDescription>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Slack Webhook URL</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="https://hooks.slack.com/services/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button onClick={handleTestNotification}>Test</Button>
            </div>
            <p className="text-sm text-secondary-label mt-2">
              Create an incoming webhook in your Slack workspace settings
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5" style={{ color: 'rgba(59,130,246,1)' }} />
              <CardTitle>Slash Commands</CardTitle>
            </div>
            <CardDescription>Create links directly from Slack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-accent rounded-lg font-mono text-sm">
              /utm shorten https://example.com
            </div>
            <p className="text-sm text-secondary-label">
              Creates a short link and shares it in the channel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" style={{ color: 'rgba(59,130,246,1)' }} />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Stay informed about link performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Link milestones</span>
              <p className="text-secondary-label">Get notified at 100, 1K, 10K clicks</p>
            </div>
            <div className="text-sm">
              <span className="font-medium">Daily summaries</span>
              <p className="text-secondary-label">Morning reports of top performing links</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h4>1. Create Incoming Webhook</h4>
          <ol>
            <li>Go to your Slack workspace settings</li>
            <li>Navigate to "Incoming Webhooks"</li>
            <li>Click "Add New Webhook to Workspace"</li>
            <li>Select the channel for notifications</li>
            <li>Copy the webhook URL</li>
          </ol>

          <h4>2. Configure Slash Command (Optional)</h4>
          <ol>
            <li>Go to "Slash Commands" in Slack settings</li>
            <li>Click "Create New Command"</li>
            <li>Set command to <code>/utm</code></li>
            <li>Set request URL to: <code>{import.meta.env.VITE_SUPABASE_URL}/functions/v1/slack-integration</code></li>
            <li>Save and install to workspace</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
