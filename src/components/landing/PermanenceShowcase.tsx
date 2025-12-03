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
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="hero-gradient text-2xl sm:text-3xl md:text-4xl font-display font-bold lowercase">
            your links outlive your tools
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
            Platform shutdowns shouldn't break the web
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Timeline Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border p-6 md:p-8"
          >
            <h4 className="font-semibold text-foreground lowercase mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              link survival timeline
            </h4>
            
            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {[
                  { year: "2024", event: "Link created", status: "active", icon: CheckCircle2 },
                  { year: "2025", event: "Tool A shuts down", status: "broken", icon: AlertTriangle, desc: "bit.ly/abc → 404" },
                  { year: "2026", event: "Tool B acquired", status: "broken", icon: AlertTriangle, desc: "Links migrated, broken" },
                  { year: "2027", event: "Your utm.one link", status: "active", icon: Shield, desc: "Still working ✓" },
                  { year: "2030", event: "10 years later", status: "active", icon: Infinity, desc: "Permanent redirect" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const isActive = item.status === "active";
                  
                  return (
                    <motion.div
                      key={item.year}
                      className="flex items-start gap-4 relative"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center relative z-10
                        ${isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">{item.year}</span>
                          <span className={`font-semibold ${isActive ? "text-foreground" : "text-destructive"}`}>
                            {item.event}
                          </span>
                        </div>
                        {item.desc && (
                          <div className={`text-sm mt-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
          
          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: Infinity,
                title: "Permanent Redirects",
                description: "Your links keep working, always. We maintain redirects even if you cancel — your audience shouldn't pay for business decisions."
              },
              {
                icon: Database,
                title: "Self-Hosted Option",
                description: "Run utm.one locally, keep full control. Export everything, host anywhere. Your data, your infrastructure, your rules."
              },
              {
                icon: GitBranch,
                title: "Link Backups",
                description: "Auto-backup to your GitHub or storage. Daily exports of all links, redirects, and analytics. Never locked in."
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
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 lowercase">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
            
            <p className="text-xl font-semibold text-primary lowercase text-center lg:text-left pt-4">
              Reliability is a feature, not a nice-to-have.
            </p>
            
            <Link 
              to="/features/link-immunity"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
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
