import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Github } from "lucide-react";
import { SDKExamples } from "@/components/developer/SDKExamples";

export default function SDKs() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl font-display font-bold hero-gradient">
            SDKs & Libraries
          </h1>
          <p className="text-lg text-secondary-label max-w-2xl">
            Official SDKs and libraries to integrate utm.one into your applications.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    JavaScript / TypeScript SDK
                    <Badge>Official</Badge>
                  </CardTitle>
                  <CardDescription>For Node.js, React, Next.js, and browser applications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    npm
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Installation</p>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>npm install @utmone/sdk</code>
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Quick Start</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { UTMOne } from '@utmone/sdk';

const client = new UTMOne({
  apiKey: process.env.UTM_ONE_API_KEY
});

// Create a short link
const link = await client.links.create({
  title: 'My Campaign',
  destination_url: 'https://example.com',
  utm_source: 'twitter',
  utm_medium: 'social',
  utm_campaign: 'launch'
});

console.log(link.short_url);`}</code>
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-sm font-medium text-secondary-label">Features</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>✓ TypeScript support</li>
                    <li>✓ Promise-based API</li>
                    <li>✓ Automatic retries</li>
                    <li>✓ Webhook verification</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-label">Documentation</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li><a href="/docs/api" className="hover:underline text-primary">API Reference</a></li>
                    <li><a href="/docs/api#examples" className="hover:underline text-primary">Examples</a></li>
                    <li><a href="/docs/api#migration" className="hover:underline text-primary">Migration Guide</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-label">Support</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>Node.js 16+</li>
                    <li>Browsers (ES6+)</li>
                    <li>React 16.8+</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Python SDK
                    <Badge>Official</Badge>
                  </CardTitle>
                  <CardDescription>For Python applications and data science workflows</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    PyPI
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Installation</p>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>pip install utmone</code>
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Quick Start</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`from utmone import UTMOne

client = UTMOne(api_key=os.getenv('UTM_ONE_API_KEY'))

# Create a short link
link = client.links.create(
    title='My Campaign',
    destination_url='https://example.com',
    utm_source='twitter',
    utm_medium='social',
    utm_campaign='launch'
)

print(link.short_url)`}</code>
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-sm font-medium text-secondary-label">Features</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>✓ Type hints</li>
                    <li>✓ Async support</li>
                    <li>✓ Pandas integration</li>
                    <li>✓ Retry logic</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-label">Documentation</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li><a href="/docs/api" className="hover:underline text-primary">API Reference</a></li>
                    <li><a href="/docs/api#examples" className="hover:underline text-primary">Examples</a></li>
                    <li><a href="https://github.com/utmone/python-sdk" target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">Jupyter Notebooks</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-label">Support</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>Python 3.8+</li>
                    <li>Django</li>
                    <li>Flask</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community SDKs</CardTitle>
              <CardDescription>SDKs built by the community for other languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Go SDK</p>
                    <p className="text-sm text-secondary-label">Maintained by @community</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Ruby SDK</p>
                    <p className="text-sm text-secondary-label">Maintained by @community</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">PHP SDK</p>
                    <p className="text-sm text-secondary-label">Maintained by @community</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold">Code Examples</h2>
          <SDKExamples />
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Other Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4" />
                    <span className="font-medium">Postman Collection</span>
                  </div>
                  <p className="text-sm text-secondary-label">Pre-configured API requests for testing</p>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-medium">OpenAPI Spec</span>
                  </div>
                  <p className="text-sm text-secondary-label">Complete API specification in OpenAPI 3.0</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
