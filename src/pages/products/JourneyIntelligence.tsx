import { Helmet } from "react-helmet";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductHeroSimplified } from "@/components/product/ProductHeroSimplified";
import { ProductPainStory } from "@/components/product/ProductPainStory";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { motion } from "framer-motion";
import { Network, Users, DollarSign, Eye, Clock, Shield, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function JourneyIntelligence() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one Journey Intelligence",
    "applicationCategory": "BusinessApplication",
    "description": "See the full picture. Clean-Track journey mapping reveals every touchpoint that drives revenue.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Journey Intelligence - See Every Touchpoint | utm.one</title>
        <meta name="description" content="Stop losing 60% of attribution to Direct/None. Clean-Track journey intelligence maps every visitor touchpoint that drives revenue." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <MainLayout showAnnouncement={false}>
        {/* Hero */}
        <ProductHeroSimplified
          headline="see the full picture. not just the last click."
          subheadline="know which touchpoints actually drive revenue."
          primaryCTA={{ text: "see your journey graph", to: "/early-access" }}
          secondaryCTA={{ text: "read methodology", to: "/resources/guides/bayesian-testing" }}
        />

        {/* Pain Story */}
        <ProductPainStory
          scenario="the budget cut meeting"
          story="Marketing got 100 leads last month. But when you show the CEO which campaigns drove them, GA4 says 'Direct/None' for 60%. Now leadership wants to cut the podcast budget because it 'doesn't convert.' But you know listeners become buyers. You just can't prove it."
          visual={
            <div className="bg-destructive/10 rounded-lg p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded border border-white/10">
                  <span className="text-sm font-mono text-white">Direct / None</span>
                  <span className="text-sm font-semibold text-destructive">60 leads (60%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded border border-white/10">
                  <span className="text-sm font-mono text-white">Google / Organic</span>
                  <span className="text-sm font-semibold text-white">25 leads (25%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded border border-white/10">
                  <span className="text-sm font-mono text-white">LinkedIn / Paid</span>
                  <span className="text-sm font-semibold text-white">15 leads (15%)</span>
                </div>
              </div>
              <p className="text-xs text-center text-white/60 mt-4">
                typical ga4 attribution report — 60% unattributed
              </p>
            </div>
          }
        />

        {/* Before vs After */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <ContentComparison
              beforeTitle="last-click only"
              afterTitle="clean-track journeys"
              beforeContent={
                <div className="space-y-4">
                  <div className="text-center text-2xl font-bold text-destructive mb-4">
                    60% unattributed
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Can't see the full journey</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Last click gets all credit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Anonymous visitors stay anonymous</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Can't prove podcast ROI</span>
                    </div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-4">
                  <div className="text-center text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-4">
                    100% journeys mapped
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      <span>✓</span>
                      <span>Every touchpoint visible</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      <span>✓</span>
                      <span>Credit distributed fairly</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      <span>✓</span>
                      <span>Visitor memory reconnects them</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      <span>✓</span>
                      <span>Prove every channel's ROI</span>
                    </div>
                  </div>
                </div>
              }
              caption="same traffic. complete visibility."
            />
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white brand-lowercase mb-4">
                what you get with journey intelligence
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                powered by clean-track journey mapping
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Network className="w-6 h-6" />,
                  title: "see every touchpoint",
                  description: "journey mapping shows podcast → blog → webinar → demo → close. complete path to revenue."
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "recognize returning visitors",
                  description: "visitor memory remembers anonymous visitor from 3 weeks ago and reconnects their history."
                },
                {
                  icon: <DollarSign className="w-6 h-6" />,
                  title: "know your page values",
                  description: "which urls drive revenue? pricing page worth $45/visit. about page $0.50."
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "prove your roi",
                  description: "revenue attribution shows which campaigns actually drive closed deals, not just clicks."
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "first-party only",
                  description: "gdpr compliant. no third-party cookies. identity stitched from user-consented form fills."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "works with ga4",
                  description: "enhances ga4, doesn't replace it. send enriched journey data to google analytics."
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
                from anonymous to attributed
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                { step: "1", label: "click", desc: "visitor arrives anonymously" },
                { step: "2", label: "visit", desc: "browse product pages" },
                { step: "3", label: "return", desc: "come back from email" },
                { step: "4", label: "convert", desc: "fill demo form" },
                { step: "5", label: "attribute", desc: "full journey mapped" }
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

        {/* Growth Loop - ROI Calculator */}
        <ROICalculator />

        {/* Feature Cards */}
        <section className="py-24 md:py-32 bg-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "attribution graph",
                  description: "visual journey maps showing every touchpoint in the funnel",
                  link: "/features/attribution-graph"
                },
                {
                  title: "identity resolution",
                  description: "reconnect anonymous visitors to known users",
                  link: "/features/identity-resolution"
                },
                {
                  title: "analytics",
                  description: "revenue attribution, page values, and conversion tracking",
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
                  q: "what attribution models do you use?",
                  a: "we use intelligent attribution based on touchpoint influence. every channel gets credit for its actual contribution to the journey, not just the last click."
                },
                {
                  q: "is identity resolution gdpr compliant?",
                  a: "yes. we use first-party cookies only and stitch identities based on user-consented actions like form fills. we never share identity graphs between customers."
                },
                {
                  q: "how accurate is visitor recognition?",
                  a: "85-90% accuracy for returning visitors based on browser fingerprinting + ip + user agent. 100% accuracy after email/form submission."
                },
                {
                  q: "does this work with ga4?",
                  a: "yes. utm.one enhances ga4, doesn't replace it. we send enriched journey data with proper utm parameters to google analytics."
                },
                {
                  q: "how long is visitor history stored?",
                  a: "90 days default, configurable up to 365 days on enterprise plans. after that, we aggregate to summary stats."
                },
                {
                  q: "can i export journey data?",
                  a: "yes. csv/xlsx export or direct warehouse sync to snowflake/bigquery via our data pipeline product."
                },
                {
                  q: "what's the difference from ga4 attribution?",
                  a: "ga4 uses last-click by default. we map the full journey including anonymous visits before conversion, giving complete visibility."
                },
                {
                  q: "do you support offline conversions?",
                  a: "yes. upload crm deals with email/phone match and we'll retroactively attribute them to the correct journey touchpoints."
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
              ready to see the full customer journey?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              stop losing 60% of attribution to direct/none
            </p>
            <Button asChild size="lg" variant="marketing">
              <Link to="/early-access">see your journey graph</Link>
            </Button>
          </div>
        </section>

      </MainLayout>
    </>
  );
}