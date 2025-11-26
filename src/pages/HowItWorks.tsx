import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Link as LinkIcon, 
  Sparkles, 
  Zap, 
  QrCode, 
  BarChart3, 
  Users,
  User,
  Cpu,
  Bot,
  Search,
  Eye,
  FileText,
  Shield,
  Lock,
  CheckCircle,
  Globe,
  Type,
  Accessibility,
  Keyboard,
  History,
  Archive,
  GitBranch,
  Server,
  Target,
  Code,
  Handshake,
  LineChart,
  ArrowRight
} from "lucide-react";
import { FlowStepCard } from "@/components/how-it-works/FlowStepCard";
import { MetadataCard } from "@/components/how-it-works/MetadataCard";
import { TrustFeatureCard } from "@/components/how-it-works/TrustFeatureCard";
import { AccessibilityFeatureCard } from "@/components/how-it-works/AccessibilityFeatureCard";
import { PermanenceFeatureCard } from "@/components/how-it-works/PermanenceFeatureCard";
import { RoleCard } from "@/components/how-it-works/RoleCard";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Fold 1: Hero */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-wildSand via-background to-background overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-2 h-32 bg-gradient-to-b from-primary to-transparent rounded-full blur-sm opacity-50" />
        <div className="absolute bottom-20 right-10 w-2 h-32 bg-gradient-to-t from-deepSea to-transparent rounded-full blur-sm opacity-50" />
        
        <div className="container max-w-[980px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8 text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient">
              How utm.one works
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[800px] mx-auto">
              A simple system that helps you create links people trust, data you can rely on, and structure your entire GTM engine can follow.
            </p>
            <div className="pt-4">
              <Link to="/early-access">
                <Button size="lg" className="bg-blazeOrange hover:bg-blazeOrange/90 text-white">
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fold 2: The Idea */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container max-w-[900px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-8 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              Everything starts with one clean link
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p>
                utm.one takes the moment you create a link —<br />
                the first moment —<br />
                and turns it into a clean, governed, trustworthy action.
              </p>
              <p className="pt-4">
                not after the campaign.<br />
                not during reporting.<br />
                right at creation.
              </p>
              <p className="pt-8 font-medium text-foreground">
                clean links → clean UTMs → clean QR → clean analytics → clean decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fold 3: The utm.one Flow */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="container max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4">
              The utm.one flow
            </h2>
            <p className="text-lg text-white/70">
              Simple, visual, effective
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FlowStepCard
              number="01"
              title="You create a link"
              description="Simple, branded, semantic. Safe to click. Easy to trust."
              icon={LinkIcon}
              delay={0}
            />
            <FlowStepCard
              number="02"
              title="Clean-track applies your rules"
              description="Syntax → naming → metadata → permissions → preview. The messy part becomes impossible to mess up."
              icon={Sparkles}
              delay={0.1}
            />
            <FlowStepCard
              number="03"
              title="UTMs are generated automatically"
              description="No mistakes. No duplicates. No broken parameters."
              icon={Zap}
              delay={0.2}
            />
            <FlowStepCard
              number="04"
              title="A QR code is generated (if you need it)"
              description="Consistent, branded, and connected to the same link."
              icon={QrCode}
              delay={0.3}
            />
            <FlowStepCard
              number="05"
              title="Analytics start working immediately"
              description="Clear metrics, simple charts, clean attribution."
              icon={BarChart3}
              delay={0.4}
            />
            <FlowStepCard
              number="06"
              title="Your team stays in sync"
              description="Every link follows the same standard across marketing, sales, ops, partners, and developers."
              icon={Users}
              delay={0.5}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center text-lg text-white/80 font-medium"
          >
            One system, many workflows — all aligned.
          </motion.p>
        </div>
      </section>

      {/* Fold 4: What Happens Inside Each Link */}
      <section className="py-24 md:py-32 bg-wildSand">
        <div className="container max-w-[1000px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              Every link carries meaning
            </h2>
            <p className="text-lg text-muted-foreground">
              utm.one adds structured metadata that:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            <MetadataCard title="humans can understand" icon={User} delay={0} />
            <MetadataCard title="machines can read" icon={Cpu} delay={0.1} />
            <MetadataCard title="screen readers can announce" icon={Accessibility} delay={0.2} />
            <MetadataCard title="AI models can interpret" icon={Bot} delay={0.3} />
            <MetadataCard title="search engines can classify" icon={Search} delay={0.4} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center text-lg text-foreground font-medium"
          >
            Your link becomes more than a link —<br />
            it becomes a reliable unit of meaning.
          </motion.p>
        </div>
      </section>

      {/* Fold 5: Trust, by Design */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container max-w-[1000px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              You see where the link goes before you click
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <TrustFeatureCard title="full destination preview" icon={Eye} delay={0} />
            <TrustFeatureCard title="site favicon + title" icon={FileText} delay={0.1} />
            <TrustFeatureCard title="safety scan" icon={Shield} delay={0.2} />
            <TrustFeatureCard title="blacklist status" icon={Lock} delay={0.3} />
            <TrustFeatureCard title="SSL validation" icon={CheckCircle} delay={0.4} />
            <TrustFeatureCard title="permanent redirect guarantee" icon={Globe} delay={0.5} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center text-lg text-foreground font-medium"
          >
            Your audience clicks with confidence<br />
            because the link is honest.
          </motion.p>
        </div>
      </section>

      {/* Fold 6: Accessibility Built In */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-deepSea/10 to-wildSand">
        <div className="container max-w-[1000px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              Links that include everyone
            </h2>
            <p className="text-lg text-muted-foreground">
              utm.one makes link creation accessible by default:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <AccessibilityFeatureCard title="semantic slugs" icon={Type} delay={0} />
            <AccessibilityFeatureCard title="descriptive aria labels" icon={Accessibility} delay={0.1} />
            <AccessibilityFeatureCard title="WCAG AAA dashboard" icon={CheckCircle} delay={0.2} />
            <AccessibilityFeatureCard title="keyboard-first navigation" icon={Keyboard} delay={0.3} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-center text-lg text-foreground font-medium"
          >
            A link should never exclude someone.
          </motion.p>
        </div>
      </section>

      {/* Fold 7: Permanence */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="container max-w-[1000px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-6">
              Your links last forever
            </h2>
            <div className="space-y-2 text-lg text-white/70">
              <p>platforms shut down</p>
              <p>urls break</p>
              <p>marketing stacks change</p>
              <p className="text-white font-medium pt-2">your links shouldn't.</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <PermanenceFeatureCard title="permanent redirect paths" icon={History} delay={0} />
            <PermanenceFeatureCard title="exportable link history" icon={Archive} delay={0.1} />
            <PermanenceFeatureCard title="GitHub backup integration" icon={GitBranch} delay={0.2} />
            <PermanenceFeatureCard title="optional self-hosting" icon={Server} delay={0.3} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-center text-lg text-white/80 font-medium"
          >
            Your content stays reachable<br />
            no matter what changes.
          </motion.p>
        </div>
      </section>

      {/* Fold 8: Consistency Across Your Org */}
      <section className="py-24 md:py-32 bg-wildSand">
        <div className="container max-w-[1000px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              Everyone follows the same standard
            </h2>
            <p className="text-lg text-muted-foreground">
              utm.one removes the guesswork:
            </p>
          </motion.div>

          <div className="space-y-3 mb-12 max-w-[700px] mx-auto">
            {[
              "sales uses the same UTM structure as marketing",
              "ops gets predictable reporting",
              "developers get reliable metadata",
              "partner managers get fixed attribution",
              "agencies get workspaces that scale"
            ].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white border border-border/50"
              >
                <p className="text-base text-foreground">{text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center text-lg text-foreground font-medium"
          >
            Clean-track ensures the same discipline everywhere.
          </motion.p>
        </div>
      </section>

      {/* Fold 9: Analytics Without Overwhelm */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container max-w-[1000px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              See only what matters
            </h2>
            <p className="text-lg text-muted-foreground">
              utm.one gives you clarity, not dashboards that fight you.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {[
              { label: "clicks", icon: Target },
              { label: "sources", icon: Globe },
              { label: "campaigns", icon: Sparkles },
              { label: "partners", icon: Handshake },
              { label: "QR performance", icon: QrCode }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <item.icon className="w-8 h-8 text-primary" strokeWidth={2} />
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center space-y-4"
          >
            <p className="text-base text-muted-foreground">
              AI summaries highlight what you should pay attention to
            </p>
            <p className="text-lg text-foreground font-medium">
              no clutter / no fatigue / analytics that feel human.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fold 10: Where It All Comes Together */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-blazeOrange/5 via-deepSea/5 to-background">
        <div className="container max-w-[1000px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground mb-6">
              One workspace, many roles
            </h2>
            <p className="text-lg text-muted-foreground">
              utm.one works the same way across your teams:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <RoleCard
              title="Marketers"
              description="build campaigns"
              icon={Target}
              delay={0}
            />
            <RoleCard
              title="Sales"
              description="share cleaner links"
              icon={Handshake}
              delay={0.1}
            />
            <RoleCard
              title="Ops"
              description="govern tracking"
              icon={Shield}
              delay={0.2}
            />
            <RoleCard
              title="Developers"
              description="integrate via API"
              icon={Code}
              delay={0.3}
            />
            <RoleCard
              title="Partner Teams"
              description="distribute links with confidence"
              icon={Users}
              delay={0.4}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center text-lg text-foreground font-medium"
          >
            one system / one standard / one source of truth.
          </motion.p>
        </div>
      </section>

      {/* Fold 11: Final CTA */}
      <PremiumCTASection
        headline="See how simple link management can be"
        subheadline="We onboard in batches. Clarity first."
        primaryCTA="Get Early Access"
      />

      <Footer />
    </div>
  );
};

export default HowItWorks;
