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
    <AnimatedSection className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase px-2">
            built-in intelligence
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            AI-powered insights without the complexity
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: AI Chat Mockup - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border-b border-border">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground text-xs lowercase">utm.one assistant</div>
                <div className="text-[10px] text-muted-foreground">clean track intelligence</div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-3 space-y-3 max-h-[300px]">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-3 py-1.5 max-w-[80%]">
                  <p className="text-xs">Which campaign performed best?</p>
                </div>
              </div>
              
              {/* AI Response */}
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-xl rounded-tl-sm px-3 py-2 space-y-2">
                  <p className="text-xs text-foreground">
                    <strong>Nike Q4 Launch</strong> drove most conversions:
                  </p>
                  <div className="space-y-1">
                    {[
                      { label: "Clicks", value: "24,847" },
                      { label: "Conversion", value: "4.8%" },
                      { label: "Revenue", value: "$128,200" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{stat.label}</span>
                        <span className="font-semibold text-foreground">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-primary pt-1">
                    <TrendingUp className="w-3 h-3" />
                    32% higher than average
                  </div>
                </div>
              </motion.div>
              
              {/* AI Alert Response */}
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-xl rounded-tl-sm px-3 py-2 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-[11px] font-medium">1 anomaly detected</span>
                  </div>
                  <p className="text-[11px] text-foreground">
                    Traffic from <strong>Tesla email</strong> dropped 45% yesterday.
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
                <MessageSquare className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Ask anything about your links...</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Feature Cards - Compact */}
          <div className="space-y-4">
            {[
              {
                icon: Zap,
                title: "instant links",
                description: "AI generates title, slug, and UTM parameters from any URL in seconds."
              },
              {
                icon: Brain,
                title: "fast insights",
                description: "Natural language analytics summaries and anomaly detection."
              },
              {
                icon: FileSearch,
                title: "onelink validator",
                description: "Intelligent duplicate detection and version management."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1 lowercase">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            <div className="pt-2">
              <Link 
                to="/features/predictive-analytics"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase text-sm"
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
