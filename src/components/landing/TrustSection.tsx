import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Eye, 
  Globe, 
  ArrowRight,
  Infinity,
  Database,
  GitBranch,
  Shield,
  Clock,
  Keyboard
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export const TrustSection = () => {
  return (
    <AnimatedSection className="py-16 md:py-24" style={{ background: 'transparent' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-3"
        >
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            built for trust & permanence
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: 'rgba(24, 24, 27, 0.4)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Eye className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold lowercase" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  accessibility first
                </h2>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  WCAG AAA certified platform
                </p>
              </div>
            </div>

            {/* Semantic URL Example */}
            <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-destructive">✗</span>
                <span className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>bit.ly/3xK9mzQ</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                <span className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>utm.one/nike-product-demo</span>
              </div>
              <p className="text-[10px]" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Screen readers speak meaningful URLs
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Eye, label: "Screen reader ready" },
                { icon: Keyboard, label: "Keyboard navigation" },
                { icon: Globe, label: "Semantic slugs" },
                { icon: CheckCircle2, label: "High contrast" },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    <span className="lowercase">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <Link 
              to="/features/accessibility"
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors lowercase hover:opacity-80"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
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
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: 'rgba(24, 24, 27, 0.4)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Shield className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold lowercase" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  link immunity
                </h2>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  your links outlive your tools
                </p>
              </div>
            </div>

            {/* Mini Timeline */}
            <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              {[
                { year: "2025", event: "Tool A shuts down", status: "broken" },
                { year: "2027", event: "Your utm.one link", status: "active" },
                { year: "2030", event: "Still working", status: "active" },
              ].map((item) => (
                <div key={item.year} className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3" style={{ color: item.status === "active" ? 'rgba(255, 255, 255, 0.8)' : 'rgba(239, 68, 68, 0.6)' }} />
                  <span className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{item.year}</span>
                  <span style={{ color: item.status === "active" ? 'rgba(255, 255, 255, 0.9)' : 'rgba(239, 68, 68, 0.8)' }}>
                    {item.event}
                  </span>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Infinity, label: "Permanent redirects" },
                { icon: Database, label: "Self-hosted option" },
                { icon: GitBranch, label: "Auto backups" },
                { icon: Shield, label: "Always working" },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    <span className="lowercase">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <Link 
              to="/features/link-immunity"
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors lowercase hover:opacity-80"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
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
