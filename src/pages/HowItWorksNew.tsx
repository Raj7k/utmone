import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { ProductMockup } from "@/components/product/ProductMockup";
import { AnimatedFlowDiagram } from "@/components/product/AnimatedFlowDiagram";
import { 
  Link as LinkIcon, 
  Sparkles, 
  Zap, 
  QrCode, 
  BarChart3, 
  Users,
  CheckCircle
} from "lucide-react";

const HowItWorks = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="How utm.one Works"
        description="Discover how utm.one creates clean links, structured UTMs, branded QR codes, and reliable analytics — all from one simple system. Learn the utm.one flow."
        canonical="https://utm.one/how-it-works"
        keywords={['how utm.one works', 'link shortener', 'UTM builder', 'QR generator', 'analytics platform']}
      />
      <LLMSchemaGenerator 
        type="howto" 
        data={{
          title: "How utm.one Works",
          description: "Learn how utm.one creates clean links with structured UTMs and branded QR codes",
          steps: [
            { name: "Create a link", description: "Simple, branded, semantic link creation" },
            { name: "Apply Clean-track rules", description: "Automatic syntax and naming validation" },
            { name: "Generate UTMs", description: "Consistent parameters without errors" },
            { name: "Create QR code", description: "Branded QR codes with attribution" },
            { name: "Track analytics", description: "Clear metrics and attribution" },
            { name: "Team synchronization", description: "Unified standards across organization" }
          ]
        }}
      />
      
      {/* Fold 1: Hero */}
      <section className="relative py-32 md:py-40 bg-white overflow-hidden">
        <div className="container max-w-[980px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8 text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient lowercase">
              How utm.one works
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[800px] mx-auto">
              A simple system that helps you create links people trust, data you can rely on, and structure your entire GTM engine can follow.
            </p>
            <CTAButton href="/early-access" variant="primary" trustBadge="Setup in 2 minutes">
              See It In Action →
            </CTAButton>
          </motion.div>
        </div>
      </section>

      {/* Fold 2: The Idea - Enhanced with Split Screen */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-muted/10 via-background to-muted/20 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          {/* Split-Screen Layout */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-16">
            {/* Left: Concept Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
                <span className="text-foreground">Everything starts with </span>
                <span className="hero-gradient">one clean link</span>
              </h2>
              <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  utm.one takes the moment you create a link —<br />
                  <span className="text-foreground font-medium">the first moment</span> —<br />
                  and turns it into a clean, governed, trustworthy action.
                </p>
                <p className="pt-2">
                  not after the campaign.<br />
                  not during reporting.<br />
                  <span className="text-foreground font-semibold">right at creation.</span>
                </p>
              </div>
            </motion.div>

            {/* Right: Clean vs Messy Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Clean Link Example */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-card border border-primary/20 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wide">Clean Link</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-4 font-mono text-sm md:text-base">
                    <span className="text-primary font-semibold">utm.one/webinar</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Simple. Branded. Semantic. Safe to click.
                  </p>
                </div>
              </div>

              {/* Messy Link Example */}
              <div className="relative opacity-60">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Messy Link</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-4 font-mono text-xs break-all">
                    <span className="text-muted-foreground">
                      bit.ly/3xF7kLm?utm_source=email&utm_medium=newsletter&utm_campaign=Q4_2024...
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Cryptic. Unbranded. Impossible to remember.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <AnimatedFlowDiagram />
          </motion.div>
        </div>
      </section>

      {/* Fold 3: The utm.one Flow - Step by Step with Visuals */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground mb-4 lowercase">
              The utm.one flow
            </h2>
            <p className="text-lg text-muted-foreground">
              Six steps. One clean system.
            </p>
          </motion.div>

          {/* Step 1: Create Link */}
          <div className="space-y-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-12 md:gap-16"
            >
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-lg font-display font-bold text-primary">01</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  You create a link
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  Simple, branded, semantic. Safe to click. Easy to trust.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <LinkIcon className="w-5 h-5" />
                  <span>utm.one/webinar</span>
                </div>
              </div>
              <div className="flex-1">
                <ProductMockup type="browser" />
              </div>
            </motion.div>

            {/* Step 2: Clean-track Validation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16"
            >
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-lg font-display font-bold text-primary">02</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  Clean-track applies your rules
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  Syntax → naming → metadata → permissions → preview. The messy part becomes impossible to mess up.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>All validation passed</span>
                </div>
              </div>
              <div className="flex-1">
                <ProductMockup type="utm" />
              </div>
            </motion.div>

            {/* Step 3: Security Scanning */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-12 md:gap-16"
            >
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-lg font-display font-bold text-primary">03</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  Security scanning happens automatically
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  ✓ SSL secured • ✓ Scanned & safe • ✓ No malware. Every link is verified before you share it.
                </p>
              </div>
              <div className="flex-1">
                <ProductMockup type="security" />
              </div>
            </motion.div>

            {/* Step 4: Analytics Start */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16"
            >
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-lg font-display font-bold text-primary">04</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  Analytics start working immediately
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  Clear metrics, simple charts, clean attribution. Full funnel visibility from click to conversion.
                </p>
              </div>
              <div className="flex-1">
                <ProductMockup type="analytics" />
              </div>
            </motion.div>

            {/* Step 5: Team Sync */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-12 md:gap-16"
            >
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-lg font-display font-bold text-primary">05</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                  Your team stays in sync
                </h2>
                <p className="text-lg text-secondary-label leading-relaxed">
                  Every link follows the same standard across marketing, sales, ops, partners, and developers. Full traceability, complete governance.
                </p>
              </div>
              <div className="flex-1">
                <ProductMockup type="governance" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground lowercase">
              Ready to see it in action?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join teams who trust utm.one for their link infrastructure.
            </p>
            <CTAButton href="/early-access" variant="primary">
              Get Early Access →
            </CTAButton>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HowItWorks;
