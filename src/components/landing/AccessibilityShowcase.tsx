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
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="hero-gradient text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 md:mb-6 lowercase">
            links that include everyone
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Finally — a link system government, education, nonprofit, and public institutions can use confidently.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Semantic URL Comparison */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <h4 className="font-semibold text-foreground lowercase flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                semantic slugs
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-destructive text-lg">✗</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">random slug</div>
                    <div className="font-mono text-sm text-foreground bg-muted/50 rounded px-2 py-1">
                      bit.ly/3xK9mzQ
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">semantic slug</div>
                    <div className="font-mono text-sm text-primary bg-primary/10 rounded px-2 py-1 border border-primary/20">
                      utm.one/acme-product-demo
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Screen readers speak the URL. Make it meaningful.
              </p>
            </div>
            
            {/* Screen Reader Mockup */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <h4 className="font-semibold text-foreground lowercase flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                screen reader ready
              </h4>
              <div className="bg-foreground rounded-lg p-4 font-mono text-xs text-background space-y-2">
                <div className="text-primary-foreground/60">// NVDA output</div>
                <div>Link: "Visit ACME product demo"</div>
                <div className="text-primary-foreground/60">URL: utm.one/acme-product-demo</div>
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
            className="space-y-6"
          >
            {[
              {
                icon: CheckCircle2,
                title: "WCAG AAA Certified",
                description: "Full accessibility compliance for dashboards, links, and QR codes. Tested with NVDA, VoiceOver, and JAWS."
              },
              {
                icon: Eye,
                title: "Screen Reader Ready",
                description: "Semantic HTML, ARIA labels, and keyboard-first navigation throughout. Every element is properly announced."
              },
              {
                icon: Globe,
                title: "Semantic Slugs",
                description: "Generate descriptive, readable URLs automatically from page titles. No more cryptic random strings."
              },
              {
                icon: Keyboard,
                title: "Keyboard Navigation",
                description: "Full keyboard support with visible focus indicators. Tab through every action without a mouse."
              },
              {
                icon: Monitor,
                title: "High Contrast Support",
                description: "Works seamlessly with system high contrast modes and respects user preferences."
              },
              {
                icon: Accessibility,
                title: "Alt Text for QR",
                description: "QR codes include proper alternative text describing the destination for screen reader users."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground lowercase">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
            
            <div className="pt-4">
              <Link 
                to="/features/accessibility" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
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
