import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Webhook, FileText, CheckCircle2, AlertCircle, Layers, Terminal, Zap, GitBranch, Database } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { HeroFloatingShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { PainPointCard } from "@/components/solutions/PainPointCard";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { WorkflowTimeline } from "@/components/solutions/WorkflowTimeline";

const Developers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 bg-gradient-to-br from-background via-wildSand/30 to-background overflow-hidden">
        <HeroFloatingShapes />
        <HeroGlow />
        <DiagonalAccent position="top-left" />
        <DiagonalAccent position="bottom-right" />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter">
              <span className="bg-gradient-to-br from-blazeOrange via-foreground to-deepSea bg-clip-text text-transparent">
                A Clean API for a Cleaner Stack
              </span>
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
      <section className="relative py-24 bg-wildSand overflow-hidden">
        <DotPattern />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
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
      <section className="py-24 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
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

      {/* Fold 4: Mapped Features */}
      <section className="py-24 bg-gradient-to-b from-wildSand/50 to-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
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
      <section className="py-32 bg-mirage">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-6">
              Your Workflow, Simplified
            </h2>
            <p className="text-xl text-white/70">
              A link system that fits into your infra
            </p>
          </div>
          
          <WorkflowTimeline
            steps={[
              { icon: Terminal, label: "Build" },
              { icon: Zap, label: "Test" },
              { icon: GitBranch, label: "Ship" },
            ]}
          />
        </div>
      </section>

      {/* Fold 6: CTA */}
      <section className="py-32 bg-gradient-to-br from-blazeOrange/10 to-deepSea/10">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Ready to Build with utm.one?
            </h2>
            <p className="text-xl text-muted-foreground max-w-[640px] mx-auto">
              Join developer teams who trust utm.one for reliable APIs and clean data.
            </p>
            <div className="pt-4">
              <Link to="/early-access">
                <Button size="lg" className="bg-blazeOrange hover:bg-blazeOrange/90 text-white text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02]">
                  Explore utm.one for Developers
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Developers;
