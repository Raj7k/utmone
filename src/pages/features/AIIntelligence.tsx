import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Sparkles, GitBranch, Route, ShieldCheck, Zap, LineChart, Target, ArrowRight, Bot, Cpu, Network, TrendingUp } from "lucide-react";
import { FeatureLayout } from "@/components/features/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NeuralMesh } from "@/components/product/visuals/NeuralMesh";
import { AICommandCenterPreview } from "@/components/features/AICommandCenterPreview";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AIIntelligence = () => {
  const aiLayers = [
    {
      icon: LineChart,
      title: "predictive analytics",
      description: "pattern recognition across millions of clicks. forecast campaign performance before you spend.",
      gradient: "from-white/20 to-white/5"
    },
    {
      icon: GitBranch,
      title: "attribution graph",
      description: "revenue mapping across every touchpoint. see exactly which links drive conversions.",
      gradient: "from-white/20 to-white/5"
    },
    {
      icon: Route,
      title: "smart routing",
      description: "geo-targeting and device optimization. send visitors to the right destination automatically.",
      gradient: "from-white/20 to-white/5"
    },
    {
      icon: ShieldCheck,
      title: "link immunity",
      description: "broken link detection and auto-healing. your campaigns never fail silently.",
      gradient: "from-white/20 to-white/5"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "every click captured",
      description: "our pixel ingests click data across all your links, campaigns, and channels in real-time."
    },
    {
      step: "02", 
      title: "AI processes patterns",
      description: "Clean Track Intelligence™ analyzes behavior, detects anomalies, and builds attribution models."
    },
    {
      step: "03",
      title: "insights delivered",
      description: "actionable recommendations surface automatically. no dashboards to decode."
    }
  ];

  const useCases = [
    { icon: TrendingUp, title: "campaign forecasting", description: "predict performance before launch" },
    { icon: Target, title: "revenue attribution", description: "know exactly what drives conversions" },
    { icon: Zap, title: "anomaly detection", description: "catch issues before they cost you" },
    { icon: Network, title: "cross-channel analysis", description: "unified view across all touchpoints" }
  ];

  const faqs = [
    {
      question: "How does the AI learn from my data?",
      answer: "Clean Track Intelligence™ builds models specific to your workspace. It analyzes your historical click patterns, conversion data, and campaign performance to understand what 'normal' looks like for your business. The more data you generate, the smarter it gets."
    },
    {
      question: "What if I don't have much historical data?",
      answer: "The AI starts working immediately with sensible defaults based on industry benchmarks. As you generate clicks and conversions, it continuously refines its models. Most users see meaningful insights within the first week."
    },
    {
      question: "Is my data used to train external models?",
      answer: "Never. Your data stays in your workspace. We don't train shared models on customer data or sell insights to third parties. Your competitive intelligence remains yours alone."
    },
    {
      question: "How accurate are predictions?",
      answer: "We provide confidence intervals, not false precision. When we say a campaign will generate 500-700 clicks, that's a statistically defensible range. We'd rather be honest about uncertainty than misleadingly specific."
    },
    {
      question: "Does this require API keys or complex setup?",
      answer: "No. AI Intelligence is built into utm.one—no external APIs, no configuration, no prompt engineering. Install our pixel, create links, and insights start flowing automatically."
    },
    {
      question: "What's the difference between this and Google Analytics?",
      answer: "Google Analytics shows you what happened. utm.one's AI tells you what it means and what to do about it. We surface actionable recommendations, not just data dashboards you have to interpret yourself."
    }
  ];

  return (
    <FeatureLayout
      title="AI Intelligence - Smarter Decisions While You Sleep | utm.one"
      description="Four AI layers built into every link. Predictive analytics, attribution graphs, smart routing, and link immunity—no setup required."
      canonical="https://utm.one/intelligence"
      keywords={["AI analytics", "predictive analytics", "attribution AI", "smart routing", "link intelligence", "marketing AI"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "AI Intelligence", url: "https://utm.one/intelligence" }
      ]}
    >
      <FAQSchema questions={faqs} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <RetroGradientMesh />
        
        <div className="container relative z-10 px-4 md:px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm text-white/70">no api keys. no setup.</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
                smarter decisions.<br />
                <span className="text-white/60">while you sleep.</span>
              </h1>
              
              <p className="text-xl text-white/60 max-w-lg">
                four AI layers built into every link. mathematical models working behind the scenes so you can focus on what matters.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                  <Link to="/signup">get early access</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/features">explore features</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: NeuralMesh Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden">
                <NeuralMesh />
              </div>
              
              {/* Floating stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 top-1/4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="text-2xl font-mono text-white">+47%</div>
                <div className="text-xs text-white/50">conversion lift</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -right-4 bottom-1/4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="text-2xl font-mono text-white">2.3s</div>
                <div className="text-xs text-white/50">avg insight time</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four AI Layers Section */}
      <section className="py-24 bg-black">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-4">
              four layers of intelligence
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              every link you create is powered by AI working in the background
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiLayers.map((layer, index) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden bg-zinc-900/50 border-white/10 p-6 h-full group hover:border-white/20 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${layer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <layer.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-sans text-lg font-semibold text-white">{layer.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{layer.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Command Center Preview */}
      <section className="py-24 bg-zinc-950">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-white">
                ask anything. get answers.
              </h2>
              <p className="text-xl text-white/60">
                natural language queries to your data. no SQL, no exports, no waiting for reports.
              </p>
              <ul className="space-y-4">
                {[
                  "which campaign drove the most revenue last month?",
                  "why did traffic drop on tuesday?",
                  "what's the best time to post for our audience?"
                ].map((query, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <Bot className="w-5 h-5 text-white/40" />
                    <span className="italic">"{query}"</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <AICommandCenterPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-black">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-4">
              how it works
            </h2>
            <p className="text-xl text-white/60">
              intelligence that builds itself
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-8xl font-mono font-bold text-white/5 absolute -top-4 -left-2">
                  {step.step}
                </div>
                <div className="relative pt-12 space-y-4">
                  <h3 className="font-sans text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 text-white/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-zinc-950">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-4">
              what you can do
            </h2>
            <p className="text-xl text-white/60">
              intelligence that drives action
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-white/10 p-6 text-center hover:border-white/20 transition-colors">
                  <useCase.icon className="w-10 h-10 text-white mx-auto mb-4" />
                  <h3 className="font-sans font-semibold text-white mb-2">{useCase.title}</h3>
                  <p className="text-white/60 text-sm">{useCase.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-black">
        <div className="container px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-4">
              frequently asked questions
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-zinc-900/50 border border-white/10 rounded-xl px-6"
              >
                <AccordionTrigger className="text-left text-white hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white">
              ready for smarter marketing?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              no api keys. no setup. just intelligence built into every link.
            </p>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Link to="/signup">get early access <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default AIIntelligence;
