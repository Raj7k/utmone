import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Brain, 
  FileSearch, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export const IntelligenceShowcase = () => {
  return (
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="hero-gradient text-2xl sm:text-3xl md:text-4xl font-display font-bold lowercase px-2">
            built-in intelligence
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
            AI-powered insights without the complexity
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: AI Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm lowercase">utm.one assistant</div>
                <div className="text-xs text-muted-foreground">powered by clean track intelligence</div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-4 space-y-4 max-h-[400px]">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                  <p className="text-sm">Which campaign performed best last month?</p>
                </div>
              </div>
              
              {/* AI Response */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 space-y-3">
                  <p className="text-sm text-foreground">
                    Your <strong>Q4 Product Launch</strong> campaign drove the most conversions:
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "Total clicks", value: "12,847" },
                      { label: "Conversion rate", value: "4.2%" },
                      { label: "Revenue attributed", value: "$48,200" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{stat.label}</span>
                        <span className="font-semibold text-foreground">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary pt-2">
                    <TrendingUp className="w-3 h-3" />
                    32% higher than average campaign
                  </div>
                </div>
              </motion.div>
              
              {/* Another User Message */}
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                  <p className="text-sm">Any issues I should know about?</p>
                </div>
              </motion.div>
              
              {/* AI Alert Response */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">1 anomaly detected</span>
                  </div>
                  <p className="text-sm text-foreground">
                    Traffic from <strong>email-nurture</strong> dropped 45% yesterday. Possible broken link or deliverability issue.
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ask anything about your links...</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Feature Cards */}
          <div className="space-y-6">
            {[
              {
                icon: Zap,
                title: "instant links",
                description: "AI generates title, slug, and UTM parameters from any URL in seconds. Paste a URL, get a complete, validated link."
              },
              {
                icon: Brain,
                title: "fast insights",
                description: "Natural language analytics summaries and anomaly detection. Ask questions, get answers — no SQL required."
              },
              {
                icon: FileSearch,
                title: "onelink validator",
                description: "Intelligent duplicate detection and version management. Never create redundant links or break existing campaigns."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 lowercase">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            <div className="pt-4">
              <Link 
                to="/features/predictive-analytics"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
              >
                explore clean track intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
