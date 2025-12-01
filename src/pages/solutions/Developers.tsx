import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Webhook, FileText, CheckCircle2, AlertCircle, Layers, Terminal, Zap, GitBranch, Database } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { HeroFloatingShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { PainPointCard } from "@/components/solutions/PainPointCard";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";

const Developers = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Developers"
        description="A clean API for a cleaner stack. utm.one gives developers reliable APIs, fast performance, clean metadata, and control over link structure."
        canonical="https://utm.one/solutions/developers"
        keywords={['developer API', 'link shortener API', 'REST API', 'GraphQL API', 'webhooks', 'developer tools']}
      />
      <WebPageSchema 
        name="utm.one for Developers"
        description="A clean API for a cleaner stack. utm.one gives developers reliable APIs, fast performance, clean metadata, and control over link structure."
        url="https://utm.one/solutions/developers"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Developers', url: 'https://utm.one/solutions/developers' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 bg-gradient-to-br from-background via-wildSand/30 to-background overflow-hidden">
        <HeroFloatingShapes />
        <HeroGlow />
        <DiagonalAccent position="top-left" />
        <DiagonalAccent position="bottom-right" />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              A Clean API for a Cleaner Stack
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives developers reliable APIs, fast performance, clean metadata, and control over link structure.
            </p>
            <div className="pt-4">
              <Link to="/early-access">
                <Button size="lg" className="bg-blazeOrange hover:bg-blazeOrange/90 text-white text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02]">
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Real Pain */}
      <section className="relative py-24 md:py-32 bg-wildSand overflow-hidden">
        <DotPattern />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              The Real Pain
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Developers shouldn't fight the tools they integrate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PainPointCard icon={AlertCircle} text="Rate limits" delay={0} />
            <PainPointCard icon={AlertCircle} text="Broken redirects" delay={0.1} />
            <PainPointCard icon={AlertCircle} text="Inconsistent slugs" delay={0.2} />
            <PainPointCard icon={AlertCircle} text="Messy metadata" delay={0.3} />
            <PainPointCard icon={AlertCircle} text="No ownership" delay={0.4} />
            <PainPointCard icon={AlertCircle} text="Poor docs" delay={0.5} />
          </div>
        </div>
      </section>

      {/* Fold 3: What You Get */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              What You Get
            </h2>
            <p className="text-xl text-muted-foreground">
              Fast. Predictable. Developer-friendly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "GraphQL + REST APIs",
              "600 req/min on free tier",
              "Webhooks for everything",
              "Interactive playground",
              "Metadata endpoints",
              "Semantic slug generation",
              "Transparent error handling",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-deepSea flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Response Examples Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground lowercase">
              API response examples
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Predictable structure, every single time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2 lowercase">type-safe responses</h3>
                  <p className="text-muted-foreground">
                    TypeScript definitions for every endpoint—autocomplete in your IDE, zero guessing
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2 lowercase">predictable errors</h3>
                  <p className="text-muted-foreground">
                    Clear error codes and human-readable messages—no cryptic server errors
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2 lowercase">rate limit headers</h3>
                  <p className="text-muted-foreground">
                    X-RateLimit headers in every response so you never hit unexpected throttles
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 font-mono text-sm">
              <div className="text-green-400 mb-2">// POST /api/v1/links</div>
              <div className="text-slate-300">{`{`}</div>
              <div className="text-slate-300 pl-4">{`"success": true,`}</div>
              <div className="text-slate-300 pl-4">{`"data": {`}</div>
              <div className="text-slate-300 pl-8">{`"short_url": "utm.one/abc123",`}</div>
              <div className="text-slate-300 pl-8">{`"slug": "abc123",`}</div>
              <div className="text-slate-300 pl-8">{`"original_url": "https://example.com",`}</div>
              <div className="text-slate-300 pl-8">{`"clicks": 0,`}</div>
              <div className="text-slate-300 pl-8">{`"created_at": "2025-12-01T12:00:00Z"`}</div>
              <div className="text-slate-300 pl-4">{`},`}</div>
              <div className="text-slate-300 pl-4">{`"rate_limit": {`}</div>
              <div className="text-slate-300 pl-8">{`"remaining": 599,`}</div>
              <div className="text-slate-300 pl-8">{`"reset_at": "2025-12-01T13:00:00Z"`}</div>
              <div className="text-slate-300 pl-4">{`}`}</div>
              <div className="text-slate-300">{`}`}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 4: Mapped Features */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-wildSand/50 to-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              Built for Developers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Code}
              title="Short Links API"
              description="Create, edit, manage links programmatically"
              color="blazeOrange"
              delay={0}
            />
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track API"
              description="Validate UTMs before saving"
              color="deepSea"
              delay={0.1}
            />
            <FeatureMappedCard
              icon={Database}
              title="LLM Metadata API"
              description="Add structured meaning for AI"
              color="primary"
              delay={0.2}
            />
            <FeatureMappedCard
              icon={Code}
              title="QR API"
              description="Generate QR via code"
              color="blazeOrange"
              delay={0.3}
            />
            <FeatureMappedCard
              icon={Webhook}
              title="Webhooks"
              description="Listen to clicks, scans, conversions"
              color="deepSea"
              delay={0.4}
            />
            <FeatureMappedCard
              icon={FileText}
              title="Docs"
              description="Copy-paste examples in 8 languages"
              color="primary"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Fold 5: Workflow */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-6 lowercase">
              Your Workflow, Simplified
            </h2>
            <p className="text-xl text-white/70">
              A link system that fits into your infra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 relative max-w-4xl mx-auto">
            {[
              { icon: Terminal, label: "Build", step: "01" },
              { icon: Zap, label: "Test", step: "02" },
              { icon: GitBranch, label: "Ship", step: "03" },
            ].map((workflow, index) => (
              <div key={index} className="relative">
                <InteractiveWorkflowCard
                  icon={workflow.icon}
                  label={workflow.label}
                  stepNumber={workflow.step}
                  delay={index * 0.15}
                />
                <AnimatedConnectingLine index={index} total={3} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="Ready to Build with utm.one?"
        subheadline="Join developer teams who trust utm.one for reliable APIs and clean data."
        primaryCTA="Explore utm.one for Developers"
      />

      <Footer />
    </div>
  );
};

export default Developers;
