import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Eye, 
  Globe, 
  ArrowRight,
  Infinity as InfinityIcon,
  Database,
  GitBranch,
  Shield,
  Clock,
  Keyboard
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export const TrustSection = () => {
  return (
    <AnimatedSection className="py-16 md:py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold obsidian-platinum-text">
            built for trust & permanence
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-muted-foreground font-sans">
            links that include everyone and outlive your tools
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Accessibility Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="obsidian-glass rounded-2xl p-6 space-y-4 relative overflow-hidden group"
          >
            {/* Animated background on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)'
              }}
            />

            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-foreground/10 relative">
                <Eye className="w-5 h-5 text-foreground/80" />
                {/* Animated scan line */}
                <motion.div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground/90">
                  accessibility first
                </h2>
                <p className="text-xs text-muted-foreground font-sans">
                  WCAG AAA certified platform
                </p>
              </div>
            </div>

            {/* Semantic URL Example with typing animation */}
            <div className="relative rounded-xl p-4 space-y-2 bg-foreground/[0.03]">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-destructive">✗</span>
                <span className="font-mono text-muted-foreground">bit.ly/3xK9mzQ</span>
              </div>
              <motion.div 
                className="flex items-center gap-2 text-xs"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <CheckCircle2 className="w-3 h-3 text-foreground/80" />
                <span className="font-mono text-foreground/90">utm.one/nike-product-demo</span>
              </motion.div>
              <p className="text-[10px] text-muted-foreground/60 font-sans">
                Screen readers speak meaningful URLs
              </p>
            </div>

            {/* Features with staggered animation */}
            <div className="relative grid grid-cols-2 gap-3">
              {[
                { icon: Eye, label: "Screen reader ready" },
                { icon: Keyboard, label: "Keyboard navigation" },
                { icon: Globe, label: "Semantic slugs" },
                { icon: CheckCircle2, label: "High contrast" },
              ].map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div 
                    key={feature.label} 
                    className="flex items-center gap-2 text-xs text-foreground/70 font-sans"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <FeatureIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span>{feature.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <Link 
              to="/features/accessibility"
              className="relative inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 text-muted-foreground font-sans"
            >
              learn more
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>

          {/* Permanence Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="obsidian-glass rounded-2xl p-6 space-y-4 relative overflow-hidden group"
          >
            {/* Animated background on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)'
              }}
            />

            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-foreground/10 relative">
                <Shield className="w-5 h-5 text-foreground/80" />
                {/* Pulsing protection ring */}
                <motion.div
                  className="absolute inset-0 rounded-lg border border-foreground/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground/90">
                  link immunity
                </h2>
                <p className="text-xs text-muted-foreground font-sans">
                  your links outlive your tools
                </p>
              </div>
            </div>

            {/* Mini Timeline with animated indicators */}
            <div className="relative rounded-xl p-4 space-y-2 bg-foreground/[0.03]">
              {[
                { year: "2025", event: "Tool A shuts down", status: "broken" },
                { year: "2027", event: "Your utm.one link", status: "active" },
                { year: "2030", event: "Still working", status: "active" },
              ].map((item, idx) => (
                <motion.div 
                  key={item.year} 
                  className="flex items-center gap-2 text-xs font-sans"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * idx }}
                >
                  <div className="relative">
                    <Clock className={`w-3 h-3 ${item.status === "active" ? 'text-foreground/80' : 'text-destructive/60'}`} />
                    {item.status === "active" && (
                      <motion.div
                        className="absolute -inset-1 rounded-full bg-foreground/20"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                      />
                    )}
                  </div>
                  <span className="font-mono text-muted-foreground">{item.year}</span>
                  <span className={item.status === "active" ? 'text-foreground/90' : 'text-destructive/80'}>
                    {item.event}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Features with staggered animation */}
            <div className="relative grid grid-cols-2 gap-3">
              {[
                { icon: InfinityIcon, label: "Permanent redirects" },
                { icon: Database, label: "Self-hosted option" },
                { icon: GitBranch, label: "Auto backups" },
                { icon: Shield, label: "Always working" },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={feature.label} 
                    className="flex items-center gap-2 text-xs text-foreground/70 font-sans"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span>{feature.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <Link 
              to="/features/link-immunity"
              className="relative inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 text-muted-foreground font-sans"
            >
              learn more
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};
