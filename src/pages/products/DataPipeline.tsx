import { Helmet } from "react-helmet";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductHeroSimplified } from "@/components/product/ProductHeroSimplified";
import { ProductPainStory } from "@/components/product/ProductPainStory";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { DataMaturityQuiz } from "@/components/product/DataMaturityQuiz";
import { motion } from "framer-motion";
import { Zap, Database, TrendingUp, FileCode, Shield, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DataPipeline() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one Data Pipeline",
    "applicationCategory": "DeveloperTool",
    "description": "Your data, in your warehouse. Stream click-stream data to Snowflake, BigQuery, or S3 with Clean-Track schema guarantee.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Data Pipeline - Your Warehouse, Your Rules | utm.one</title>
        <meta name="description" content="Stream raw click-stream data to your Snowflake, BigQuery, or S3. Real-time webhooks and nightly dumps with Clean-Track schema guarantee." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <MainLayout showAnnouncement={false}>
        {/* Hero */}
        <ProductHeroSimplified
          headline="your data. your warehouse. your rules."
          subheadline="stream every click to snowflake, bigquery, or s3."
          primaryCTA={{ text: "read api docs", to: "/docs/api" }}
          secondaryCTA={{ text: "view schema", to: "/docs/api" }}
        />

        {/* Pain Story */}
        <ProductPainStory
          scenario="the model that was always wrong"
          story="Your data science team built a conversion model. But it's trained on dashboard exports with 3-day delays and missing fields. Every insight is a week late. Every prediction is wrong. The board wants real-time predictions, but your data pipeline is duct tape and cron jobs."
          visual={
            <div className="bg-destructive/10 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-muted-foreground">last_export.csv</span>
                <span className="text-destructive font-semibold">3 days old</span>
              </div>
              <div className="bg-card rounded p-3 border border-border space-y-1 font-mono text-xs">
                <div className="text-muted-foreground">visitor_id, click_timestamp</div>
                <div className="text-destructive line-through">utm_source, utm_medium</div>
                <div className="text-muted-foreground">// missing 8 critical fields</div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                incomplete schema • manual exports • 72-hour lag
              </p>
            </div>
          }
        />

        {/* Before vs After */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <ContentComparison
              beforeTitle="manual exports"
              afterTitle="clean-track pipeline"
              beforeContent={
                <div className="space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Manual CSV exports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>3-day delay</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Missing fields</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>No schema guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Can't build models</span>
                    </div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Real-time streaming (&lt; 200ms)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Instant availability</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Complete schema</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Guaranteed format</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Build your own models</span>
                    </div>
                  </div>
                </div>
              }
              caption="same clicks. real-time insights."
            />
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase mb-4">
                what you get with data pipeline
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                powered by clean-track schema guarantee
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "real-time webhooks",
                  description: "receive json payload for every click in < 200ms. perfect for triggering instant alerts."
                },
                {
                  icon: <Database className="w-6 h-6" />,
                  title: "nightly warehouse sync",
                  description: "automatic batch export to your s3 bucket in parquet or csv format."
                },
                {
                  icon: <FileCode className="w-6 h-6" />,
                  title: "complete schema",
                  description: "every field guaranteed: visitor_id, timestamp, user_agent, geo, utms, identity_id."
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "parquet or csv format",
                  description: "optimized parquet for analytics engines, csv for spreadsheet tools."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "99.99% uptime guarantee",
                  description: "api gateway uses adaptive throttling. enterprise keys never get rate limited."
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "build your own models",
                  description: "train ml models on raw click data. no dashboard limitations."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full transition-colors hover:border-white/20">
                    <div className="w-12 h-12 rounded-xl bg-white/5 text-white flex items-center justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white brand-lowercase mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase mb-4">
                from click to warehouse in real-time
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                { step: "1", label: "click", desc: "user clicks short link" },
                { step: "2", label: "stream", desc: "json payload sent < 200ms" },
                { step: "3", label: "warehouse", desc: "lands in snowflake/s3" },
                { step: "4", label: "model", desc: "train ml predictions" },
                { step: "5", label: "insight", desc: "real-time decisions" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-display font-semibold text-white brand-lowercase mb-1">
                    {item.label}
                  </h4>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Loop - Data Maturity Quiz */}
        <DataMaturityQuiz />

        {/* Feature Cards */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "api documentation",
                  description: "complete rest api docs with schema definitions and examples",
                  link: "/docs/api"
                },
                {
                  title: "integrations",
                  description: "native connectors for snowflake, bigquery, s3, and webhooks",
                  link: "/features/integrations"
                },
                {
                  title: "analytics",
                  description: "validate your data quality before exporting to warehouse",
                  link: "/features/analytics"
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 transition-colors group cursor-pointer hover:border-white/20">
                  <Link to={feature.link}>
                    <h3 className="text-xl font-display font-semibold text-white brand-lowercase mb-2 transition-colors group-hover:text-white/80">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4">{feature.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span>learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 brand-lowercase">
              frequently asked questions
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  q: "what is the data schema for the export?",
                  a: "flat json schema including visitor_id, timestamp, user_agent, geo_location (country/city/lat/lon), all 5 utm parameters, identity_id, referrer, device type, browser, os."
                },
                {
                  q: "how fast are the webhooks?",
                  a: "we use async edge functions to dispatch webhooks. 99% of events delivered within 500ms of user click."
                },
                {
                  q: "what warehouses do you support?",
                  a: "snowflake, bigquery, redshift, databricks, s3 (parquet/csv), azure blob storage, google cloud storage."
                },
                {
                  q: "can i backfill historical data?",
                  a: "yes. request historical dump via api. we store raw events for 90 days (configurable up to 365 days on enterprise)."
                },
                {
                  q: "what's the rate limit?",
                  a: "10,000 events/hour on free, 100k/hour on pro, unlimited on enterprise with adaptive throttling."
                },
                {
                  q: "do you guarantee schema stability?",
                  a: "yes. schema is versioned. breaking changes require new api version. your pipelines won't break unexpectedly."
                },
                {
                  q: "can i filter which events get sent?",
                  a: "yes. set filters by domain, campaign, utm source, or custom rules. only send relevant events to warehouse."
                },
                {
                  q: "what about gdpr and data retention?",
                  a: "configurable retention: granular data for X days, aggregates longer. automatic pii redaction available."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-white brand-lowercase">
                    {faq.q}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase">
              ready to own your click-stream data?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              stop relying on manual exports and delayed dashboards
            </p>
            <Button asChild size="lg" variant="marketing">
              <Link to="/docs/api">read api documentation</Link>
            </Button>
          </div>
        </section>

      </MainLayout>
    </>
  );
}
