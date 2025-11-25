import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Key, Link2, BarChart3, Zap, ExternalLink, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function APIDocumentation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-b from-label to-label/60 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-secondary-label text-lg">
              Integrate utm.one into your applications with our RESTful API and GraphQL endpoint
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/docs/playground">
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Try Playground
              </Button>
            </Link>
            <Link to="/docs/sdks">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View SDKs
              </Button>
            </Link>
          </div>
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
            <Tabs defaultValue="curl">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.utm.one/v1/links \\
  -H "x-api-key: utm_your_api_key_here"`}</code>
                </pre>
              </TabsContent>
              <TabsContent value="js">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`fetch('https://api.utm.one/v1/links', {
  headers: {
    'x-api-key': 'utm_your_api_key_here'
  }
});`}</code>
                </pre>
              </TabsContent>
              <TabsContent value="python">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import requests

response = requests.get(
    'https://api.utm.one/v1/links',
    headers={'x-api-key': 'utm_your_api_key_here'}
)`}</code>
                </pre>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-secondary-label">
              You can generate API keys in your Settings → Developer page
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
                <CardDescription>Create a new short link with UTM parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="curl">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`curl -X POST https://api.utm.one/v1/links \\
  -H "x-api-key: utm_your_key" \\
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
                  <TabsContent value="js">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`const response = await fetch('https://api.utm.one/v1/links', {
  method: 'POST',
  headers: {
    'x-api-key': 'utm_your_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Summer Campaign',
    destination_url: 'https://example.com/summer',
    slug: 'summer-2024',
    utm_source: 'facebook',
    utm_medium: 'social',
    utm_campaign: 'summer-launch'
  })
});

const link = await response.json();`}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="python">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`import requests

response = requests.post(
    'https://api.utm.one/v1/links',
    headers={'x-api-key': 'utm_your_key'},
    json={
        'title': 'Summer Campaign',
        'destination_url': 'https://example.com/summer',
        'slug': 'summer-2024',
        'utm_source': 'facebook',
        'utm_medium': 'social',
        'utm_campaign': 'summer-launch'
    }
)

link = response.json()`}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
                <div>
                  <p className="text-sm font-medium mb-2">Response (201 Created)</p>
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
                  <CardTitle>List Links</CardTitle>
                  <Badge variant="secondary">GET /v1/links</Badge>
                </div>
                <CardDescription>Get paginated list of all links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Query Parameters</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-2 py-1 rounded">page</code>
                      <span className="text-secondary-label">Page number (default: 1)</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-2 py-1 rounded">per_page</code>
                      <span className="text-secondary-label">Items per page (default: 50, max: 100)</span>
                    </div>
                  </div>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.utm.one/v1/links?page=1&per_page=50 \\
  -H "x-api-key: utm_your_key"`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Get Link</CardTitle>
                  <Badge variant="secondary">GET /v1/links/:id</Badge>
                </div>
                <CardDescription>Retrieve details of a specific link</CardDescription>
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
                  <CardTitle>Update Link</CardTitle>
                  <Badge>PATCH /v1/links/:id</Badge>
                </div>
                <CardDescription>Update link title or destination URL</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl -X PATCH https://api.utm.one/v1/links/uuid \\
  -H "x-api-key: utm_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Updated Title"}'`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Delete Link</CardTitle>
                  <Badge variant="destructive">DELETE /v1/links/:id</Badge>
                </div>
                <CardDescription>Permanently delete a link</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl -X DELETE https://api.utm.one/v1/links/uuid \\
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
                <CardDescription>Retrieve comprehensive analytics for a link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Query Parameters</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-2 py-1 rounded">date_range</code>
                      <span className="text-secondary-label">last-7-days, last-30-days, last-90-days, all-time</span>
                    </div>
                  </div>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.utm.one/v1/links/uuid/analytics?date_range=last-30-days \\
  -H "x-api-key: utm_your_key"`}</code>
                </pre>
                <div>
                  <p className="text-sm font-medium mb-2">Response (200 OK)</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "data": {
    "total_clicks": 1234,
    "unique_clicks": 892,
    "devices": {
      "mobile": 558,
      "desktop": 520,
      "tablet": 156
    },
    "countries": {
      "US": 342,
      "UK": 156,
      "CA": 98
    },
    "browsers": {
      "Chrome": 645,
      "Safari": 312,
      "Firefox": 277
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

        <div className="grid md:grid-cols-2 gap-6">
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
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-secondary-label">
                  Rate limit headers are included in all responses:
                </p>
                <pre className="bg-muted p-2 rounded text-xs mt-2">
                  <code>{`X-RateLimit-Limit: 600
X-RateLimit-Remaining: 598
X-RateLimit-Reset: 1640995200`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
              <CardDescription>Common error responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <Badge variant="destructive" className="mb-1">400</Badge>
                  <p className="text-secondary-label">Bad Request - Invalid parameters</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">401</Badge>
                  <p className="text-secondary-label">Unauthorized - Invalid API key</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">404</Badge>
                  <p className="text-secondary-label">Not Found - Resource doesn't exist</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">429</Badge>
                  <p className="text-secondary-label">Rate Limited - Too many requests</p>
                </div>
                <div>
                  <Badge variant="destructive" className="mb-1">500</Badge>
                  <p className="text-secondary-label">Server Error - Internal error</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>Tools and documentation to help you integrate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/openapi.json" download>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  OpenAPI Spec
                </Button>
              </a>
              <a href="/utm-one.postman_collection.json" download>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Postman Collection
                </Button>
              </a>
              <Link to="/docs/sdks">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Official SDKs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
