import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function SDKExamples() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create a Link</CardTitle>
            <Badge>SDK Method</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="js">
            <TabsList>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>

            <TabsContent value="js">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import { UTMOne } from '@utmone/sdk';

const client = new UTMOne({
  apiKey: 'utm_your_api_key'
});

const link = await client.links.create({
  title: 'Summer Campaign',
  destination_url: 'https://example.com/summer',
  slug: 'summer-2024',
  utm_source: 'facebook',
  utm_medium: 'social',
  utm_campaign: 'summer-launch'
});

console.log(link.short_url);
// https://utm.click/summer-2024`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="python">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`from utmone import UTMOne

client = UTMOne(api_key='utm_your_api_key')

link = client.links.create(
    title='Summer Campaign',
    destination_url='https://example.com/summer',
    slug='summer-2024',
    utm_source='facebook',
    utm_medium='social',
    utm_campaign='summer-launch'
)

print(link.short_url)
# https://utm.click/summer-2024`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="curl">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`curl -X POST https://api.utm.one/v1/links \\
  -H "x-api-key: utm_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Summer Campaign",
    "destination_url": "https://example.com/summer",
    "slug": "summer-2024",
    "utm_source": "facebook",
    "utm_medium": "social",
    "utm_campaign": "summer-launch"
  }'`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get Link Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="js">
            <TabsList>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>

            <TabsContent value="js">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`const analytics = await client.links.getAnalytics('link-id', {
  dateRange: 'last-30-days'
});

console.log(\`Total clicks: \${analytics.total_clicks}\`);
console.log(\`Devices:\`, analytics.devices);`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="python">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`analytics = client.links.get_analytics(
    'link-id',
    date_range='last-30-days'
)

print(f"Total clicks: {analytics.total_clicks}")
print(f"Devices: {analytics.devices}")`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="curl">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`curl https://api.utm.one/v1/links/link-id/analytics \\
  -H "x-api-key: utm_your_api_key"`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Handle Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="js">
            <TabsList>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>

            <TabsContent value="js">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import express from 'express';
import { UTMOne } from '@utmone/sdk';

const app = express();
app.use(express.json());

const client = new UTMOne({
  apiKey: 'utm_your_api_key',
  webhookSecret: 'your_webhook_secret'
});

app.post('/webhooks/utmone', (req, res) => {
  const event = client.webhooks.verify(
    req.body,
    req.headers['x-webhook-signature']
  );

  switch (event.type) {
    case 'link.clicked':
      console.log('Link clicked:', event.data.link_id);
      break;
    case 'link.created':
      console.log('Link created:', event.data.short_url);
      break;
  }

  res.json({ received: true });
});

app.listen(3000);`}</code>
              </pre>
            </TabsContent>

            <TabsContent value="python">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`from flask import Flask, request
from utmone import UTMOne

app = Flask(__name__)
client = UTMOne(
    api_key='utm_your_api_key',
    webhook_secret='your_webhook_secret'
)

@app.route('/webhooks/utmone', methods=['POST'])
def handle_webhook():
    event = client.webhooks.verify(
        request.get_data(),
        request.headers.get('X-Webhook-Signature')
    )
    
    if event.type == 'link.clicked':
        print(f"Link clicked: {event.data.link_id}")
    elif event.type == 'link.created':
        print(f"Link created: {event.data.short_url}")
    
    return {'received': True}

if __name__ == '__main__':
    app.run(port=3000)`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
