import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Infinity, 
  Database, 
  GitBranch, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export const PermanenceShowcase = () => {
  return (
    <AnimatedSection className="py-16 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase">
            your links outlive your tools
          </h1>
          <p className="text-base sm:text-lg px-2 text-white-50">
            Platform shutdowns shouldn't break the web
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Timeline Visual - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl p-5 bg-zinc-900/40 backdrop-blur-xl border border-white-08"
          >
            <h4 className="font-semibold lowercase mb-4 flex items-center gap-2 text-sm text-white-90">
              <Clock className="w-4 h-4 text-white-70" />
              link survival timeline
            </h4>
            
            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-white/[0.08]" />
              
              <div className="space-y-3">
                {[
                  { year: "2024", event: "Link created", status: "active", icon: CheckCircle2 },
                  { year: "2025", event: "Tool A shuts down", status: "broken", icon: AlertTriangle, desc: "bit.ly/abc → 404" },
                  { year: "2026", event: "Tool B acquired", status: "broken", icon: AlertTriangle, desc: "Links broken" },
                  { year: "2027", event: "Your utm.one link", status: "active", icon: Shield, desc: "Still working ✓" },
                  { year: "2030", event: "10 years later", status: "active", icon: Infinity, desc: "Permanent" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const isActive = item.status === "active";
                  
                  return (
                    <motion.div
                      key={item.year}
                      className="flex items-start gap-3 relative"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                          isActive 
                            ? 'bg-white-15 text-white-90' 
                            : 'bg-red-500/10 text-red-500/80 border border-red-500/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-white-50">{item.year}</span>
                          <span 
                            className={`font-medium text-sm ${isActive ? 'text-white-90' : 'text-red-500/80'}`}
                          >
                            {item.event}
                          </span>
                        </div>
                        {item.desc && (
                          <div 
                            className={`text-xs mt-0.5 ${isActive ? 'text-white-70' : 'text-white-50'}`}
                          >
                            {item.desc}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
          
          {/* Right: Features - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: Infinity,
                title: "Permanent Redirects",
                description: "Your links keep working, always. We maintain redirects even if you cancel."
              },
              {
                icon: Database,
                title: "Self-Hosted Option",
                description: "Run utm.one locally, keep full control. Export everything, host anywhere."
              },
              {
                icon: GitBranch,
                title: "Link Backups",
                description: "Auto-backup to GitHub or storage. Daily exports of all links and analytics."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="rounded-xl p-4 transition-all hover:scale-[1.02] bg-zinc-900/40 backdrop-blur-xl border border-white-08"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white/10"
                  >
                    <Icon className="w-5 h-5 text-white-80" />
                  </div>
                  <h3 className="text-sm font-semibold mb-2 lowercase text-white-90">{feature.title}</h3>
                  <p className="text-xs text-white-50">{feature.description}</p>
                </motion.div>
              );
            })}
            
            <p className="text-lg font-semibold lowercase text-center lg:text-left pt-2 text-white-80">
              Reliability is a feature, not a nice-to-have.
            </p>
            
            <Link 
              to="/features/link-immunity"
              className="inline-flex items-center gap-2 font-medium transition-colors lowercase text-sm hover:opacity-80 text-white-70"
            >
              learn about link immunity
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};