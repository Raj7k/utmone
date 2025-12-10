import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CTAButton } from "@/components/ui/CTAButton";

import { AttributionComparisonChart } from "@/components/features/AttributionComparisonChart";
import { ForecastingPreview } from "@/components/features/ForecastingPreview";
import { JourneyFlowPreview } from "@/components/features/JourneyFlowPreview";
import { WrongAttributionMockup } from "@/components/features/WrongAttributionMockup";
import { AICommandCenterPreview } from "@/components/features/AICommandCenterPreview";
import { motion } from "framer-motion";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { 
  GitBranch, 
  Smartphone, 
  FileText, 
  Route, 
  Target, 
  Sparkles,
  TrendingUp,
  Clock,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Bell,
  Check,
  Minus,
  Zap,
  AlertTriangle
} from "lucide-react";

const FeatureItem = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="p-5 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-label mb-1">{p(title)}</h3>
        <p className="text-sm text-secondary-label leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Analytics = () => {
  const faqs = [
    {
      question: "How is this different from GA4 attribution?",
      answer: "GA4 primarily uses last-click attribution and struggles with cross-device tracking. utm.one provides true multi-touch attribution with 7 models (linear, time-decay, position-based, etc.), cross-device identity stitching, and revenue mapping—showing you which touchpoints actually drove revenue, not just traffic.",
    },
    {
      question: "Can I import offline conversions?",
      answer: "Yes. Import CRM data, phone calls, in-store purchases, and offline events. We'll match them to digital touchpoints using our identity graph, giving you complete attribution across online and offline channels.",
    },
    {
      question: "Does it work cross-device?",
      answer: "Absolutely. Our probabilistic identity graph stitches together mobile, desktop, tablet, and app sessions—even without login. See the complete customer journey, not fragmented device silos.",
    },
    {
      question: "What attribution models are supported?",
      answer: "Seven models: Last-click, First-click, Linear, Time-decay, Position-based (U-shaped), W-shaped, and Custom weighted. Compare models side-by-side to find what works for your business.",
    },
    {
      question: "How accurate is the traffic forecasting?",
      answer: "Our forecasting uses exponential smoothing with confidence intervals. Typical accuracy is 85-92% for 7-day predictions. You'll see predicted clicks with upper/lower bounds so you can plan campaigns with confidence.",
    },
    {
      question: "Can I ask questions in plain English?",
      answer: "Yes. The AI Command Center understands natural language. Ask 'Which campaign had the best ROI last quarter?' or 'Why did conversions drop on Thursday?' and get instant, data-backed answers.",
    },
  ];

  const comparisonData = [
    { feature: "Multi-touch attribution", ga4: false, bitly: false, utmone: true },
    { feature: "Cross-device identity graph", ga4: false, bitly: false, utmone: true },
    { feature: "Revenue mapping", ga4: false, bitly: false, utmone: true },
    { feature: "Traffic forecasting", ga4: false, bitly: false, utmone: true },
    { feature: "AI-powered insights", ga4: false, bitly: false, utmone: true },
    { feature: "Anomaly detection alerts", ga4: false, bitly: false, utmone: true },
    { feature: "Customer journey visualization", ga4: "limited", bitly: false, utmone: true },
    { feature: "Offline conversion import", ga4: "limited", bitly: false, utmone: true },
  ];

  return (
    <FeatureLayout
      title="Revenue Intelligence | utm.one"
      description="Stop counting clicks. Start measuring revenue. Multi-touch attribution, customer journey visualization, predictive forecasting, and AI-powered insights."
      canonical="https://utm.one/features/analytics"
      keywords={["revenue intelligence", "multi-touch attribution", "marketing analytics", "customer journey", "predictive analytics"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Revenue Intelligence", url: "https://utm.one/features/analytics" },
      ]}
    >
      {/* Hero Section - Reduced padding */}
      <section className="relative pt-8 pb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Zap className="w-4 h-4" />
              revenue intelligence platform
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-label mb-6">
              from clicks to revenue.
            </h1>
            <p className="text-xl md:text-2xl text-secondary-label mb-8 max-w-2xl mx-auto leading-relaxed">
              utm.one doesn't just count clicks. it shows which touchpoints actually drive revenue—across devices, channels, and time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                start free
              </CTAButton>
              <CTAButton href="/book-demo" variant="secondary">
                book a demo
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement - 2-Column Visual Layout */}
      <FeatureSection background="muted" maxWidth="wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy + Stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs uppercase tracking-wider mb-4">
                <AlertTriangle className="w-3 h-3" />
                the problem
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mb-4">
                the attribution black hole.
              </h2>
              <p className="text-lg text-secondary-label leading-relaxed">
                {p("Your LinkedIn campaign drove 10,000 clicks. Paid search drove 5,000. The CFO asks: \"Which one made us money?\" GA4 shows last-click. But the customer saw LinkedIn first, got an email, attended a webinar, then searched your brand.")} <strong className="text-label">Who gets credit?</strong>
              </p>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-card border border-border text-center"
              >
                <div className="text-3xl font-display font-bold text-label mb-1">72%</div>
                <div className="text-xs text-muted-foreground">{p("can't prove ROI")}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-card border border-border text-center"
              >
                <div className="text-3xl font-display font-bold text-label mb-1">$2.1M</div>
                <div className="text-xs text-muted-foreground">wasted yearly</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-card border border-border text-center"
              >
                <div className="text-3xl font-display font-bold text-label mb-1">3.2</div>
                <div className="text-xs text-muted-foreground">avg touchpoints</div>
              </motion.div>
            </div>
          </div>

          {/* Right: Visual Horror Mockup */}
          <WrongAttributionMockup />
        </div>
      </FeatureSection>

      {/* Section 1: Attribution (Mockup Left) */}
      <FeatureSection maxWidth="wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AttributionComparisonChart />
          </motion.div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="text-sm text-secondary-label uppercase tracking-wider">attribution</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mt-2">
                see what actually works.
              </h2>
            </motion.div>
            
            <FeatureItem
              icon={GitBranch}
              title="multi-touch attribution"
              description="7 attribution models (linear, time-decay, position-based) show each touchpoint's true contribution to revenue."
            />
            <FeatureItem
              icon={Smartphone}
              title="cross-device identity graph"
              description="Stitch mobile → desktop → app sessions. See the complete journey, not device fragments."
            />
            <FeatureItem
              icon={FileText}
              title="topic attribution"
              description="Which content themes drive conversions? Fingerprint your content and track what resonates."
            />
          </div>
        </div>
      </FeatureSection>

      {/* Section 2: Journey (Mockup Right) */}
      <FeatureSection background="muted" maxWidth="wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="text-sm text-secondary-label uppercase tracking-wider">journey</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mt-2">
                visualize the path to purchase.
              </h2>
            </motion.div>
            
            <FeatureItem
              icon={Route}
              title="customer journey flow"
              description="Sankey diagrams show how prospects flow through touchpoints to conversion. See drop-offs and golden paths."
            />
            <FeatureItem
              icon={Target}
              title="conversion funnels"
              description="Build custom funnels. Track stage-by-stage conversion rates. Find where you're losing people."
            />
            <FeatureItem
              icon={Sparkles}
              title="golden path analysis"
              description="Discover the optimal touchpoint sequence that converts best. Replicate what works."
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <JourneyFlowPreview />
          </motion.div>
        </div>
      </FeatureSection>

      {/* Section 3: Predictions (Mockup Left) */}
      <FeatureSection maxWidth="wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ForecastingPreview />
          </motion.div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="text-sm text-secondary-label uppercase tracking-wider">predictions</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mt-2">
                know what's coming.
              </h2>
            </motion.div>
            
            <FeatureItem
              icon={TrendingUp}
              title="traffic forecasting"
              description="7-day predictions with 85-92% accuracy. Plan campaigns with confidence intervals, not guesswork."
            />
            <FeatureItem
              icon={Clock}
              title="best time analysis"
              description="Heatmaps show when your audience is most active. Schedule posts and campaigns for peak engagement."
            />
            <FeatureItem
              icon={BarChart3}
              title="lift analysis"
              description="Identify demand creators vs. churn drivers. Know which channels lift conversions and which cannibalize."
            />
          </div>
        </div>
      </FeatureSection>

      {/* Section 4: AI Intelligence (Mockup Right) */}
      <FeatureSection background="muted" maxWidth="wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="text-sm text-secondary-label uppercase tracking-wider">{p("AI intelligence")}</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mt-2">
                ask, don't dig.
              </h2>
            </motion.div>
            
            <FeatureItem
              icon={MessageSquare}
              title="AI command center"
              description="Ask questions in plain English. 'Which campaign had the best ROI?' Get instant, data-backed answers."
            />
            <FeatureItem
              icon={Lightbulb}
              title="smart insights"
              description="Auto-generated recommendations. Surface hidden opportunities. Spot trends before your competitors."
            />
            <FeatureItem
              icon={Bell}
              title="anomaly detection"
              description="Pulse Watchdog monitors your data 24/7. Get alerts when traffic spikes, drops, or behaves unusually."
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <AICommandCenterPreview />
          </motion.div>
        </div>
      </FeatureSection>

      {/* Comparison Table */}
      <FeatureSection>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-label mb-4">
              revenue intelligence comparison.
            </h2>
            <p className="text-lg text-secondary-label">
              See how utm.one stacks up against basic analytics tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border overflow-hidden bg-card"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-secondary-label font-medium">Feature</th>
                  <th className="text-center p-4 text-secondary-label font-medium">GA4</th>
                  <th className="text-center p-4 text-secondary-label font-medium">Bitly</th>
                  <th className="text-center p-4 text-label font-semibold">utm.one</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="p-4 text-label">{row.feature}</td>
                    <td className="text-center p-4">
                      {row.ga4 === true ? (
                        <Check className="w-4 h-4 text-primary mx-auto" />
                      ) : row.ga4 === "limited" ? (
                        <span className="text-muted-foreground text-xs">limited</span>
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row.bitly === true ? (
                        <Check className="w-4 h-4 text-primary mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-4 h-4 text-primary mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </FeatureSection>

      {/* FAQ */}
      <FeatureSection background="muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase mb-8 text-center">
            revenue intelligence faq
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <h3 className="font-display font-semibold text-label mb-2 lowercase">{faq.question}</h3>
                <p className="text-secondary-label text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FeatureSection>

      {/* CTA */}
      <FeatureSection>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            start measuring what matters
          </h2>
          <p className="text-lg text-secondary-label mb-8">
            Stop guessing. Start knowing. See exactly which marketing efforts drive revenue.
          </p>
          <CTAButton href="/early-access" variant="primary" trustBadge="Free to start · No credit card">
            Start Free →
          </CTAButton>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default Analytics;
