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
          <h1 className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase px-2">
            clean-track intelligence
          </h1>
          <p className="text-base sm:text-lg px-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            AI-powered insights built on mathematical models from MIT and Harvard scientists
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: AI Chat Mockup - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl shadow-lg overflow-hidden"
            style={{ background: 'rgba(24,24,27,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blazeOrange flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-xs lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>clean-track AI</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>MIT & Harvard algorithms</div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-3 space-y-3 max-h-[300px]">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-3 py-1.5 max-w-[80%]">
                  <p className="text-xs">Which Nike campaign performed best?</p>
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
                  <Brain className="w-3 h-3 text-primary" />
                </div>
                <div className="rounded-xl rounded-tl-sm px-3 py-2 space-y-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    <strong>Nike Q4 Launch</strong> drove most conversions:
                  </p>
                  <div className="space-y-1">
                    {[
                      { label: "Clicks", value: "24,847" },
                      { label: "Conversion", value: "4.8%" },
                      { label: "Revenue", value: "$128,200" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex justify-between text-[11px]">
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</span>
                        <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-primary pt-1">
                    <TrendingUp className="w-3 h-3" />
                    Clean-Track confidence: 94%
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
                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                </div>
                <div className="bg-amber-500/10 rounded-xl rounded-tl-sm px-3 py-2 space-y-1.5 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <span className="text-[11px] font-medium">1 anomaly detected</span>
                  </div>
                  <p className="text-[11px] text-foreground">
                    Traffic from <strong>Tesla email</strong> dropped 45% yesterday.
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Chat Input */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <MessageSquare className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.5)' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Ask anything about your links...</span>
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
                title: "predictive insights",
                description: "Know which campaigns will work before launch — powered by Clean-Track algorithms."
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
                  className="rounded-xl p-4 transition-all"
                  style={{ 
                    background: 'rgba(24,24,27,0.6)', 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold mb-1 lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>{feature.title}</h2>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.description}</p>
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
                explore clean-track intelligence
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
