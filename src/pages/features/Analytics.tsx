import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  ArrowRight,
  Zap,
  Check,
  Minus
} from "lucide-react";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { AttributionComparisonChart } from "@/components/features/AttributionComparisonChart";
import { ForecastingPreview } from "@/components/features/ForecastingPreview";
import { JourneyFlowPreview } from "@/components/features/JourneyFlowPreview";
import { AICommandCenterPreview } from "@/components/features/AICommandCenterPreview";

const FeatureItem = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="p-5 rounded-xl bg-zinc-900/40 backdrop-blur-sm border border-white/10 hover:bg-zinc-900/60 transition-colors"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white/80" />
      </div>
      <div>
        <h4 className="font-display font-semibold text-white lowercase mb-1">{title}</h4>
        <p className="text-sm text-white/60 leading-relaxed">{description}</p>
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
    <>
      <Helmet>
        <title>Revenue Intelligence | utm.one</title>
        <meta
          name="description"
          content="Stop counting clicks. Start measuring revenue. Multi-touch attribution, customer journey visualization, predictive forecasting, and AI-powered insights."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-8">
              <Zap className="w-4 h-4" />
              revenue intelligence platform
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 lowercase">
              from clicks to revenue.
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              utm.one doesn't just count clicks. it shows which touchpoints actually drive revenue—across devices, channels, and time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-white/90">
                <Link to="/early-access">start free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/book-demo">book a demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horror Story Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-8">
          <HorrorStorySection
            title="the attribution black hole"
            description="Your LinkedIn campaign drove 10,000 clicks. Your paid search drove 5,000. The CFO asks: 'Which one actually made us money?' You open GA4. It shows last-click attribution. But the customer saw LinkedIn first, got an email, attended a webinar, then searched your brand on Google. Who gets credit? GA4 says Google. The truth? It was a team effort. Without multi-touch attribution, you're flying blind."
            stats={[
              { value: "72%", label: "of marketers can't prove ROI" },
              { value: "$2.1M", label: "avg. wasted on wrong channels" },
              { value: "3.2", label: "avg touchpoints before conversion" },
            ]}
          />
        </div>
      </section>

      {/* Section 1: Attribution (Mockup Left) */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <AttributionComparisonChart />
            </motion.div>
            
            {/* Features */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="text-sm text-white/50 uppercase tracking-wider">attribution</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mt-2">
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
        </div>
      </section>

      {/* Section 2: Journey (Mockup Right) */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features */}
            <div className="space-y-4 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="text-sm text-white/50 uppercase tracking-wider">journey</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mt-2">
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
            
            {/* Mockup */}
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
        </div>
      </section>

      {/* Section 3: Predictions (Mockup Left) */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ForecastingPreview />
            </motion.div>
            
            {/* Features */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="text-sm text-white/50 uppercase tracking-wider">predictions</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mt-2">
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
        </div>
      </section>

      {/* Section 4: AI Intelligence (Mockup Right) */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features */}
            <div className="space-y-4 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="text-sm text-white/50 uppercase tracking-wider">ai intelligence</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mt-2">
                  ask, don't dig.
                </h2>
              </motion.div>
              
              <FeatureItem
                icon={MessageSquare}
                title="ai command center"
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
            
            {/* Mockup */}
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
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mb-4">
              revenue intelligence comparison.
            </h2>
            <p className="text-lg text-white/60">
              See how utm.one stacks up against basic analytics tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/40 backdrop-blur-sm"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60 font-medium">Feature</th>
                  <th className="text-center p-4 text-white/60 font-medium">GA4</th>
                  <th className="text-center p-4 text-white/60 font-medium">Bitly</th>
                  <th className="text-center p-4 text-white font-semibold">utm.one</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-white/80">{row.feature}</td>
                    <td className="text-center p-4">
                      {row.ga4 === true ? (
                        <Check className="w-4 h-4 text-white/80 mx-auto" />
                      ) : row.ga4 === "limited" ? (
                        <span className="text-white/40 text-xs">limited</span>
                      ) : (
                        <Minus className="w-4 h-4 text-white/20 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row.bitly === true ? (
                        <Check className="w-4 h-4 text-white/80 mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-white/20 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-4 h-4 text-white mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6">
          <RoleSpecificFAQ
            role="Revenue Intelligence"
            faqs={faqs}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mb-6">
              see your revenue story.
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Stop guessing which channels work. Get the complete picture of your marketing ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-white/90">
                <Link to="/early-access" className="flex items-center gap-2">
                  start free <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/book-demo">book a demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Analytics;
