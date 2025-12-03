import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Eye, 
  Globe, 
  ArrowRight,
  Accessibility,
  Monitor,
  Keyboard
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export const AccessibilityShowcase = () => {
  return (
    <AnimatedSection className="py-16 md:py-24" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase">
            links that include everyone
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
            Finally — a link system government, education, nonprofit, and public institutions can use confidently.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Semantic URL Comparison */}
            <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 className="font-semibold text-foreground lowercase flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-primary" />
                semantic slugs
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-destructive text-sm">✗</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground">random slug</div>
                    <div className="font-mono text-xs text-foreground bg-muted/50 rounded px-2 py-1">
                      bit.ly/3xK9mzQ
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground">semantic slug</div>
                    <div className="font-mono text-xs text-primary bg-primary/10 rounded px-2 py-1 border border-primary/20">
                      utm.one/nike-product-demo
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Screen readers speak the URL. Make it meaningful.
              </p>
            </div>
            
            {/* Screen Reader Mockup */}
            <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 className="font-semibold text-foreground lowercase flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-primary" />
                screen reader ready
              </h4>
              <div className="bg-foreground rounded-lg p-3 font-mono text-[11px] text-background space-y-1">
                <div className="text-primary-foreground/60">// NVDA output</div>
                <div>Link: "Visit Tesla product demo"</div>
                <div className="text-primary-foreground/60">URL: utm.one/tesla-product-demo</div>
                <div>Button: "Copy link to clipboard"</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: CheckCircle2,
                title: "WCAG AAA Certified",
                description: "Full accessibility compliance for dashboards, links, and QR codes."
              },
              {
                icon: Eye,
                title: "Screen Reader Ready",
                description: "Semantic HTML, ARIA labels, and keyboard-first navigation."
              },
              {
                icon: Globe,
                title: "Semantic Slugs",
                description: "Generate descriptive, readable URLs automatically from page titles."
              },
              {
                icon: Keyboard,
                title: "Keyboard Navigation",
                description: "Full keyboard support with visible focus indicators."
              },
              {
                icon: Monitor,
                title: "High Contrast Support",
                description: "Works seamlessly with system high contrast modes."
              },
              {
                icon: Accessibility,
                title: "Alt Text for QR",
                description: "QR codes include proper alternative text for screen readers."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground lowercase text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
            
            <div className="pt-2">
              <Link 
                to="/features/accessibility" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase text-sm"
              >
                learn more about accessibility
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};
