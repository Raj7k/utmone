import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Zap, MessageSquare, Boxes, BarChart3, Database, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IntegrationsSettings() {
  const integrations = [
    {
      name: 'Google Tag Manager',
      icon: Code2,
      description: 'Send events to GTM dataLayer for advanced tracking',
      status: 'available',
      setupUrl: '/integrations/gtm',
    },
    {
      name: 'Zapier',
      icon: Zap,
      description: 'Connect to 5,000+ apps with automation workflows',
      status: 'available',
      setupUrl: '/integrations/zapier',
    },
    {
      name: 'Slack',
      icon: MessageSquare,
      description: 'Get notifications and create links from Slack',
      status: 'available',
      setupUrl: '/integrations/slack',
    },
    {
      name: 'HubSpot',
      icon: Boxes,
      description: 'Sync link clicks to contact timelines',
      status: 'available',
      setupUrl: '/settings',
      section: 'integrations',
    },
    {
      name: 'Salesforce',
      icon: BarChart3,
      description: 'Create tasks for link interactions',
      status: 'available',
      setupUrl: '/settings',
      section: 'integrations',
    },
    {
      name: 'Segment CDP',
      icon: Database,
      description: 'Stream events to your data warehouse',
      status: 'available',
      setupUrl: '/settings',
      section: 'integrations',
    },
  ];

  return (
    <div className="container max-w-4xl py-16 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-b from-label to-label/60 bg-clip-text text-transparent">
          Integrations
        </h1>
        <p className="text-xl text-secondary-label">
          Connect utm.one with your favorite tools
        </p>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent rounded-lg">
                    <integration.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                  {integration.status === 'connected' ? 'Connected' : 'Available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={integration.setupUrl}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Delivery Logs</CardTitle>
          <CardDescription>View recent webhook deliveries and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-secondary-label">
            <p>No webhook deliveries yet</p>
            <p className="text-sm">Webhook logs will appear here once you configure integrations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
