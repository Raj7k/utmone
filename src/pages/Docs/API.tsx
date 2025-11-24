import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Key, Link2, BarChart3, Zap } from "lucide-react";

export default function APIDocumentation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-b from-label to-label/60 bg-clip-text text-transparent">API Documentation</h1>
          <p className="text-secondary-label text-lg">
            Integrate utm.one into your applications with our RESTful API
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <CardTitle>Authentication</CardTitle>
            </div>
            <CardDescription>All API requests require an API key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Include your API key in the request header:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`curl https://api.utm.one/v1/links \\
  -H "x-api-key: utm_your_api_key_here"`}</code>
            </pre>
            <p className="text-xs text-secondary-label">
              You can generate API keys in your Settings → API Keys page
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="links" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links">
              <Link2 className="h-4 w-4 mr-2" />
              Links
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="events">
              <Zap className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Link</CardTitle>
                  <Badge>POST /v1/links</Badge>
                </div>
                <CardDescription>Create a new short link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Request Body</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "title": "Summer Campaign",
  "destination_url": "https://example.com/summer",
  "domain": "utm.one",
  "path": "go",
  "slug": "summer-2024",
  "utm_source": "facebook",
  "utm_medium": "social",
  "utm_campaign": "summer-launch"
}`}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Response</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "data": {
    "id": "uuid",
    "short_url": "https://utm.one/go/summer-2024",
    "final_url": "https://example.com/summer?utm_source=...",
    "created_at": "2024-01-15T10:00:00Z"
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Get Link</CardTitle>
                  <Badge variant="secondary">GET /v1/links/:id</Badge>
                </div>
                <CardDescription>Retrieve link details</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.utm.one/v1/links/uuid \\
  -H "x-api-key: utm_your_key"`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>List Links</CardTitle>
                  <Badge variant="secondary">GET /v1/links</Badge>
                </div>
                <CardDescription>List all links with pagination</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.utm.one/v1/links?page=1&per_page=50 \\
  -H "x-api-key: utm_your_key"`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Get Link Analytics</CardTitle>
                  <Badge variant="secondary">GET /v1/links/:id/analytics</Badge>
                </div>
                <CardDescription>Retrieve analytics data for a link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.utm.one/v1/links/uuid/analytics \\
  -H "x-api-key: utm_your_key"`}</code>
                </pre>
                <div>
                  <p className="text-sm font-medium mb-2">Response</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "data": {
    "total_clicks": 1234,
    "unique_clicks": 892,
    "devices": {
      "mobile": 45.2,
      "desktop": 42.1,
      "tablet": 12.7
    },
    "countries": {
      "US": 342,
      "UK": 156,
      "CA": 98
    }
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Track Conversion Event</CardTitle>
                  <Badge>POST /v1/events</Badge>
                </div>
                <CardDescription>Track conversion events for attribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Request Body</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "link_id": "uuid",
  "event_type": "purchase",
  "event_value": 49.99,
  "currency": "USD",
  "metadata": {
    "order_id": "ORD-123",
    "product": "Premium Plan"
  }
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>API request limits by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-label">Free:</span>
                <span className="font-medium">100 requests/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-label">Pro:</span>
                <span className="font-medium">600 requests/minute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-label">Business:</span>
                <span className="font-medium">1200 requests/minute</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
