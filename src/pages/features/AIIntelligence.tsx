import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Brain, TrendingUp, GitBranch, AlertTriangle, MessageSquare, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { AIControlDeck } from "@/components/ai/AIControlDeck";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQSchema } from "@/components/seo/SchemaMarkup";

const aiLayers = [
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Pattern recognition and trend forecasting before you spend another dollar.",
    features: ["Campaign performance forecasting", "Budget optimization suggestions", "Trend detection"],
  },
  {
    icon: GitBranch,
    title: "Attribution Graph",
    description: "Multi-touch attribution that traces every dollar to its source.",
    features: ["Revenue mapping", "Cross-channel attribution", "Customer journey analysis"],
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    description: "Real-time monitoring catches issues before they cost you.",
    features: ["Traffic spike alerts", "Drop detection", "Automated notifications"],
  },
  {
    icon: MessageSquare,
    title: "Smart Insights",
    description: "Natural language queries for instant campaign intelligence.",
    features: ["Ask anything interface", "Contextual recommendations", "Performance summaries"],
  },
];

const stats = [
  { value: "99.9%", label: "accuracy" },
  { value: "<2s", label: "insights" },
  { value: "4", label: "AI layers" },
  { value: "0", label: "API keys" },
];

const faqs = [
  {
    question: "How does the AI learn from my data?",
    answer: "Our AI analyzes your campaign patterns, click behavior, and conversion data to build models specific to your business. All learning happens within your workspace—your data is never shared or used to train external models.",
  },
  {
    question: "What if I don't have much historical data?",
    answer: "The AI starts working from day one. Even with minimal data, it provides industry benchmarks and basic predictions. As you accumulate more data, predictions become increasingly accurate and personalized.",
  },
  {
    question: "Is my data used to train external models?",
    answer: "Absolutely not. Your data stays within your workspace. We don't aggregate customer data or use it for any purpose other than providing insights specifically to you.",
  },
  {
    question: "How accurate are the predictions?",
    answer: "Prediction accuracy depends on data volume and pattern consistency. Most customers see 85-95% accuracy on 7-day forecasts after 30 days of data. We always show confidence intervals so you know how reliable each prediction is.",
  },
  {
    question: "Does this require API keys or complex setup?",
    answer: "No setup required. AI Intelligence works out of the box as soon as you start creating links. No API keys, no configuration, no technical knowledge needed.",
  },
];

const AIIntelligence = () => {
  return (
    <div className="dark marketing-root min-h-screen flex flex-col relative overflow-hidden bg-background">
      <Helmet>
        <title>AI Intelligence | utm.one</title>
        <meta name="description" content="Four AI layers working behind the scenes. Predictive analytics, attribution mapping, anomaly detection, and smart insights—no prompt needed." />
      </Helmet>
      <FAQSchema questions={faqs} />

      {/* Noise Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Center Axis */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none z-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <Navigation />
      <FloatingNavigation />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20">
          <RetroGradientMesh />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
            {/* Badge */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/30 backdrop-blur-sm">
                <Brain className="w-4 h-4 text-foreground" />
                <span className="text-sm text-muted-foreground">AI Intelligence</span>
              </div>
            </motion.div>

            {/* Headlines */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 hero-gradient">
                smarter decisions.
                <br />
                while you sleep.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                four AI layers working behind the scenes. no prompt needed.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/early-access">get early access</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/product">see product</Link>
              </Button>
            </motion.div>

            {/* Control Deck */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AIControlDeck />
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-20 border-y border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-display font-bold hero-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Four AI Layers */}
        <section className="py-32">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold hero-gradient mb-4">
                four layers. one intelligence.
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                each layer works together to transform raw data into actionable insights.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {aiLayers.map((layer, i) => (
                <motion.div
                  key={layer.title}
                  className="group relative p-8 rounded-2xl border border-border bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                      <layer.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {layer.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {layer.description}
                      </p>
                      <ul className="space-y-2">
                        {layer.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-foreground" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Comparison */}
        <section className="py-32 bg-muted/10">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold hero-gradient mb-4">
                before vs. after
              </h2>
              <p className="text-xl text-muted-foreground">
                see what changes when AI works for you.
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-border overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Feature</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Before</th>
                    <th className="text-left p-4 text-foreground font-medium">With utm.one AI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Campaign insights", before: "manual reports", after: "real-time AI" },
                    { feature: "Attribution", before: "last-click only", after: "multi-touch models" },
                    { feature: "Anomaly detection", before: "missed entirely", after: "instant alerts" },
                    { feature: "Forecasting", before: "gut feelings", after: "data-driven predictions" },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-border last:border-0">
                      <td className="p-4 text-foreground">{row.feature}</td>
                      <td className="p-4 text-muted-foreground">{row.before}</td>
                      <td className="p-4 text-foreground font-medium">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-32">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold hero-gradient mb-4">
                frequently asked
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-border rounded-xl px-6 bg-card/20"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:no-underline py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-muted/20 to-transparent" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold hero-gradient mb-6">
                ready for smarter marketing?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                no API keys. no setup. just intelligence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="rounded-full px-10">
                  <Link to="/early-access">
                    get early access
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-10">
                  <Link to="/demo">book a demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AIIntelligence;
