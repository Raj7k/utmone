import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Webhook, Database, Zap } from "lucide-react";

export default function DataPipeline() {
  return (
    <FeatureLayout
      title="Data Pipeline - Your Data, Your Warehouse | utm.one"
      description="Stream raw event data directly to your Snowflake, BigQuery, or S3 bucket. Built for teams that need custom modeling."
      canonical="https://utm.one/products/data-pipeline"
      keywords={["data pipeline", "webhook", "data warehouse", "snowflake", "bigquery", "s3 export"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "data pipeline", url: "/products/data-pipeline" },
      ]}
    >
      {/* Hero Section */}
      <FeatureSection background="white" className="min-h-[70vh] flex items-center">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight brand-lowercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            your data, in your warehouse
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Bypass the dashboard. Stream raw, granular click-stream data directly to your Snowflake, BigQuery, or S3 bucket. Built for teams that need to build their own models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/docs/api">
              <Button size="lg" variant="marketing" className="text-lg px-8">
                read API docs
              </Button>
            </Link>
            <Link to="/docs/api#schema">
              <Button size="lg" variant="outline" className="text-lg px-8">
                view schema
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>

      {/* Feature Grid */}
      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 brand-lowercase">
            the "unreal" tech
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Webhook className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              real-time webhooks
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Sub-second event streaming."
            </p>
            <p className="text-foreground/70">
              Receive a JSON payload for every <code>link.clicked</code>, <code>lead.identified</code>, or <code>qr.scanned</code> event in &lt; 200ms. Perfect for triggering instant sales alerts in Slack or HubSpot.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Database className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              warehouse sync (BYOD)
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Daily dumps to S3/Snowflake."
            </p>
            <p className="text-foreground/70">
              We automatically batch and export your entire <code>analytics_events</code> table every night to your private S3 bucket in Apache Parquet or CSV format.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              adaptive rate limiting
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Scale without the crash."
            </p>
            <p className="text-foreground/70">
              Our API gateway uses Adaptive Throttling based on system load. We guarantee 99.99% availability for enterprise keys even during traffic spikes.
            </p>
          </div>
        </div>
      </FeatureSection>

      {/* Data Schema Example */}
      <FeatureSection background="white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 brand-lowercase">
              the data schema
            </h2>
            <p className="text-lg text-muted-foreground">
              Clean, predictable JSON with everything you need for custom attribution models.
            </p>
          </div>
          
          <div className="p-6 bg-zinc-900 rounded-xl overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm">
{`{
  "event_id": "evt_abc123xyz",
  "timestamp": "2025-12-01T15:30:00Z",
  "event_type": "link.clicked",
  "visitor_id": "vis_anonymous_582",
  "identity_id": "user_sarah_nike",
  "link_id": "lnk_pricing_page",
  "utm_source": "linkedin",
  "utm_medium": "paid_social",
  "utm_campaign": "q4_enterprise_push",
  "utm_term": "link_management",
  "utm_content": "carousel_variant_a",
  "device_type": "mobile",
  "browser": "chrome",
  "os": "ios",
  "country": "US",
  "city": "New York",
  "referrer": "https://linkedin.com"
}`}
            </pre>
          </div>
        </div>
      </FeatureSection>

      {/* FAQ Section */}
      <FeatureSection background="muted">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 brand-lowercase">
            frequently asked questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">What is the data schema for the export?</h3>
              <p className="text-muted-foreground">
                We provide a flat JSON schema including <code>visitor_id</code>, <code>timestamp</code>, <code>user_agent</code>, <code>geo_location</code>, <code>utm_parameters</code>, and <code>identity_id</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">How fast are the webhooks?</h3>
              <p className="text-muted-foreground">
                We use an asynchronous queue (Edge Functions) to dispatch webhooks. 99% of events are delivered within 500ms of the user click.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Can I filter which events to receive?</h3>
              <p className="text-muted-foreground">
                Yes. In your webhook configuration, you can subscribe to specific event types: <code>link.clicked</code>, <code>link.created</code>, <code>qr.scanned</code>, <code>conversion.tracked</code>, etc.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">What integrations do you support?</h3>
              <p className="text-muted-foreground">
                We have native integrations with Snowflake, BigQuery, Redshift, S3, Google Cloud Storage, Azure Blob, and Postgres. Custom destinations can be configured via webhooks.
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <FeatureSection background="white">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold brand-lowercase">
            ready for freedom & scale?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join developers and data engineers who trust utm.one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/docs/api">
              <Button size="lg" variant="marketing">
                read docs
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                book a demo
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
}
