import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon, Settings, QrCode, BarChart3, Shield, CheckCircle2, AlertCircle, Layers, FileText, Zap, TrendingUp } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { HeroFloatingShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { PainPointCard } from "@/components/solutions/PainPointCard";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";

const Marketers = () => {
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
                Campaigns Work Better When Links Do
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives marketers clean links, clean UTMs, clean QR codes, and clean reporting — all without slowing you down.
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
              Marketing shouldn't require detective work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PainPointCard icon={AlertCircle} text="Scattered links across tools" delay={0} />
            <PainPointCard icon={AlertCircle} text="Broken UTMs ruining attribution" delay={0.1} />
            <PainPointCard icon={AlertCircle} text="Messy dashboards with no clarity" delay={0.2} />
            <PainPointCard icon={AlertCircle} text="Inconsistent naming conventions" delay={0.3} />
            <PainPointCard icon={AlertCircle} text="QR chaos without tracking" delay={0.4} />
            <PainPointCard icon={AlertCircle} text="Stakeholder confusion on performance" delay={0.5} />
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
              Clarity → Trust → Performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Predictable UTMs",
              "Semantic links",
              "Branded QR codes",
              "Clear preview cards",
              "Campaign-level analytics",
              "Clean attribution",
              "Workspace governance that never gets in your way",
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
              Built for Marketing Teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={LinkIcon}
              title="Short Links"
              description="Easy to share, easy to trust"
              color="blazeOrange"
              delay={0}
            />
            <FeatureMappedCard
              icon={Settings}
              title="UTM Builder"
              description="Zero-error parameters"
              color="deepSea"
              delay={0.1}
            />
            <FeatureMappedCard
              icon={QrCode}
              title="QR Generator"
              description="Print-ready and trackable"
              color="primary"
              delay={0.2}
            />
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track"
              description="Every campaign follows the same standard"
              color="blazeOrange"
              delay={0.3}
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="Analytics"
              description="The top metrics that actually matter"
              color="deepSea"
              delay={0.4}
            />
            <FeatureMappedCard
              icon={Shield}
              title="Enterprise Control"
              description="Governance without friction"
              color="primary"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Fold 5: Workflow */}
      <section className="relative py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-6">
              Your Workflow, Simplified
            </h2>
            <p className="text-xl text-white/70">
              All from one clean workspace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {[
              { icon: FileText, label: "Build Campaign", step: "01" },
              { icon: Zap, label: "Generate Links", step: "02" },
              { icon: TrendingUp, label: "Share", step: "03" },
              { icon: BarChart3, label: "Measure", step: "04" },
            ].map((workflow, index) => (
              <div key={index} className="relative">
                <InteractiveWorkflowCard
                  icon={workflow.icon}
                  label={workflow.label}
                  stepNumber={workflow.step}
                  delay={index * 0.15}
                />
                <AnimatedConnectingLine index={index} total={4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="Ready to Transform Your Marketing?"
        subheadline="Join marketing teams who trust utm.one for clean links and clear attribution."
        primaryCTA="Explore utm.one for Marketers"
      />

      <Footer />
    </div>
  );
};

export default Marketers;
