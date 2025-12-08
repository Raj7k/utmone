import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { ForecastingPreview } from "@/components/features/ForecastingPreview";
import { UseCasesGrid } from "@/components/features/UseCasesGrid";
import { CTAButton } from "@/components/ui/CTAButton";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  GitBranch, 
  Sparkles, 
  Network, 
  Globe, 
  Zap, 
  Brain, 
  Target, 
  LineChart, 
  Timer, 
  Clock, 
  Eye, 
  DollarSign, 
  Activity,
  Workflow,
  CheckCircle,
  X
} from "lucide-react";

const Analytics = () => {
  const useCases = [
    {
      title: "which channel actually drives revenue?",
      scenario: "Your LinkedIn campaign drove 10,000 clicks. Your paid search drove 5,000 clicks. CFO asks: 'Which one actually made us money?' You open GA4. It says... nothing useful.",
      solution: "utm.one's multi-touch attribution shows LinkedIn influenced 40% of your deals but search closed 60%. You allocate budget accordingly. CFO gets a real answer."
    },
    {
      title: "did that webinar influence the deal?",
      scenario: "Your enterprise deal just closed. Sales takes credit. Marketing says the webinar mattered. Leadership asks for proof. You have none.",
      solution: "Customer journey visualization shows the prospect clicked your webinar link, then 3 follow-up emails, then the demo request. Marketing proves the influence chain."
    },
    {
      title: "why did conversions drop on Thursday?",
      scenario: "Your conversion rate dropped 30% on Thursday. Panic. You dig through GA4 for 2 hours. You find nothing. You file a support ticket. It takes 3 days.",
      solution: "AI Command Center surfaces the anomaly: 'Broken redirect on utm_source=newsletter link since Thursday 9am'. You fix it in 5 minutes."
    },
    {
      title: "what's the optimal touchpoint sequence?",
      scenario: "Some prospects convert after 3 touches. Others need 15. You have no idea what the optimal sequence looks like. You guess and hope.",
      solution: "Golden Path Analysis shows: LinkedIn post → Email → Webinar → Demo → Close has 3x higher conversion than any other sequence. You optimize accordingly."
    }
  ];

  const faqs = [
    {
      question: "How is this different from GA4 attribution?",
      answer: "GA4 uses last-click attribution by default and struggles with cross-domain tracking. utm.one offers multi-touch attribution (linear, time-decay, position-based), cross-device identity stitching, and revenue mapping—all on link-level data you control. Think of it as 'GA4 + attribution intelligence + revenue visibility'."
    },
    {
      question: "Can I import offline conversions?",
      answer: "Yes. Upload CRM exports (Salesforce, HubSpot) or use our API to push offline events. utm.one stitches offline conversions back to the original link clicks, giving you true ROI visibility across online and offline touchpoints."
    },
    {
      question: "Does it work cross-device?",
      answer: "Yes. Our Probabilistic Identity Graph detects when the same person clicks from mobile, then converts from desktop. You'll see the full journey, not fragmented sessions."
    },
    {
      question: "What attribution models are supported?",
      answer: "Linear (equal credit), Time-Decay (recent touchpoints weighted higher), Position-Based (first/last get more credit), and First/Last Touch. You can compare models side-by-side to see how each affects your channel ROI calculations."
    },
    {
      question: "How accurate are traffic predictions?",
      answer: "85-90% confidence within the predicted range. We show confidence intervals (e.g., ±150 clicks) so you know the uncertainty. After 30 days of data, predictions stabilize at high accuracy."
    },
    {
      question: "Can I see which links drive revenue, not just clicks?",
      answer: "Absolutely. Connect your conversion events (form fills, purchases, sign-ups) and utm.one maps revenue back to the links that influenced it. You'll see 'this link drove $50K in influenced pipeline' instead of just '1,000 clicks'."
    },
    {
      question: "What if I don't have much data yet?",
      answer: "Start with basic click analytics and forecasting. As you accumulate data, advanced features (attribution, identity graph, AI insights) unlock automatically. The system adapts to your data volume."
    },
    {
      question: "Does this replace my existing analytics tools?",
      answer: "No—it complements them. Keep GA4 for site-wide analytics. Use utm.one for campaign-level attribution, link performance, and revenue intelligence. They work together, not either/or."
    }
  ];

  const comparisonData = [
    { feature: "Multi-touch attribution", ga4: false, bitly: false, utmOne: true },
    { feature: "Cross-device identity graph", ga4: false, bitly: false, utmOne: true },
    { feature: "Revenue mapping to links", ga4: false, bitly: false, utmOne: true },
    { feature: "Traffic forecasting", ga4: false, bitly: false, utmOne: true },
    { feature: "Click heatmaps (hour/day)", ga4: true, bitly: false, utmOne: true },
    { feature: "AI-generated insights", ga4: false, bitly: false, utmOne: true },
    { feature: "Customer journey visualization", ga4: true, bitly: false, utmOne: true },
    { feature: "Anomaly detection alerts", ga4: false, bitly: false, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="Revenue Intelligence - See Which Links Drive Money | utm.one"
      description="utm.one doesn't just count clicks. It shows which touchpoints actually drive revenue—across devices, channels, and time. Multi-touch attribution, AI insights, and predictive analytics."
      canonical="https://utm.one/features/analytics"
      keywords={["revenue attribution", "multi-touch attribution", "marketing analytics", "link analytics", "campaign ROI", "customer journey analytics"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Analytics", url: "https://utm.one/features/analytics" },
      ]}
    >
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative max-w-[980px] mx-auto px-8 z-10 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold hero-gradient lowercase mb-6">
            from clicks to revenue.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            utm.one doesn't just count clicks. it shows which touchpoints actually drive revenue—across devices, channels, and time.
          </p>
          <CTAButton href="/early-access" variant="primary" pulse>get early access</CTAButton>
        </div>
      </section>

      {/* Horror Story Section */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <HorrorStorySection
            title="attribution is broken"
            description="Your LinkedIn campaign drove 10,000 clicks. Your paid search drove 5,000 clicks. CFO asks: 'Which one actually made us money?' You open GA4. It credits last-click only. It can't see cross-device journeys. It doesn't know about offline conversions. You make a presentation with incomplete data. Budget decisions become politics, not science. Millions in marketing spend—allocated on guesswork."
            stats={[
              { label: "Marketers can't prove ROI", value: "72%" },
              { label: "Lost to attribution gaps", value: "$150B/yr" },
              { label: "Campaigns with wrong credit", value: "60%" }
            ]}
          />
        </div>
      </section>

      {/* Revenue Intelligence Feature Grid */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">
              revenue intelligence, not link counting
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              every feature exists to answer one question: "which marketing touched this revenue?"
            </p>
          </div>

          {/* Attribution Row */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold lowercase">attribution</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard 
                icon={GitBranch} 
                title="Multi-Touch Attribution" 
                description="Linear, time-decay, position-based models. Compare side-by-side to see true channel value."
              />
              <FeatureCard 
                icon={Globe} 
                title="Cross-Device Identity Graph" 
                description="Stitch mobile clicks to desktop conversions. See the full journey, not fragments."
              />
              <FeatureCard 
                icon={Target} 
                title="Topic Attribution" 
                description="Which content themes drive revenue? AI-powered content fingerprinting shows patterns."
              />
            </div>
          </div>

          {/* Journey Row */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Workflow className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold lowercase">journey</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard 
                icon={Activity} 
                title="Customer Journey Visualization" 
                description="Sankey diagrams showing how prospects flow through touchpoints to conversion."
              />
              <FeatureCard 
                icon={BarChart3} 
                title="Conversion Funnels" 
                description="Stage-by-stage drop-off analysis. See where you're losing people."
              />
              <FeatureCard 
                icon={Zap} 
                title="Golden Path Analysis" 
                description="Which touchpoint sequence has the highest conversion rate? Find and replicate it."
              />
            </div>
          </div>

          {/* Predictions Row */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold lowercase">predictions</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard 
                icon={LineChart} 
                title="Traffic Forecasting" 
                description="7-day predictions with confidence intervals. Plan capacity and campaigns around real data."
              />
              <FeatureCard 
                icon={Clock} 
                title="Best Time Analysis" 
                description="Click heatmaps by hour and day. Know exactly when your audience is active."
              />
              <FeatureCard 
                icon={Timer} 
                title="Lift Analysis" 
                description="Identify demand creators vs churn drivers. Focus on what actually moves the needle."
              />
            </div>
          </div>

          {/* AI Row */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold lowercase">ai intelligence</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard 
                icon={Sparkles} 
                title="AI Command Center" 
                description="Natural language questions → instant answers. 'Which campaign has the best ROI this quarter?'"
              />
              <FeatureCard 
                icon={Eye} 
                title="Smart Insights" 
                description="Auto-generated recommendations. The system spots opportunities before you do."
              />
              <FeatureCard 
                icon={Activity} 
                title="Anomaly Detection" 
                description="Pulse Watchdog alerts you when traffic spikes or drops. Never miss a viral moment or broken link."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Forecasting Preview */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">see the future</h2>
            <p className="text-xl text-muted-foreground">7-day traffic forecasting with confidence intervals</p>
          </div>
          <ForecastingPreview />
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">real problems we solve</h2>
            <p className="text-xl text-muted-foreground">not theoretical—these happen every week</p>
          </div>
          <UseCasesGrid useCases={useCases} />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">revenue intelligence vs. basic analytics</h2>
            <p className="text-xl text-muted-foreground">utm.one goes beyond counting clicks</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-display font-semibold text-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-display font-semibold text-muted-foreground">GA4</th>
                  <th className="text-center py-4 px-4 font-display font-semibold text-muted-foreground">Bitly</th>
                  <th className="text-center py-4 px-4 font-display font-semibold text-primary">utm.one</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {row.ga4 ? (
                        <CheckCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.bitly ? (
                        <CheckCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.utmOne ? (
                        <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">built for your role</h2>
          </div>
          <PersonaCalloutCards callouts={[
            { 
              icon: Users, 
              title: "for marketers", 
              benefit: "Prove your campaigns drive revenue, not just clicks. Show the CFO real ROI data." 
            },
            { 
              icon: DollarSign, 
              title: "for sales", 
              benefit: "See which marketing touches influenced your deals. Know which content resonates with prospects." 
            },
            { 
              icon: Briefcase, 
              title: "for ops & revops", 
              benefit: "Clean attribution data flowing into your CRM. No more manual spreadsheet reconciliation." 
            },
            { 
              icon: GitBranch, 
              title: "for cmos", 
              benefit: "Board-ready revenue attribution reports. Justify budget allocation with data, not intuition." 
            }
          ]} />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="revenue teams" faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/20">
        <div className="relative max-w-[980px] mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-6">
            see your revenue story
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            stop guessing which marketing works. start knowing.
          </p>
          <CTAButton href="/book-demo" variant="primary" pulse>book a demo</CTAButton>
        </div>
      </section>
    </FeatureLayout>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-primary" />
        <h4 className="font-display font-semibold text-foreground lowercase">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default Analytics;
