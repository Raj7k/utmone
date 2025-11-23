import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Users, Link2 } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Footer } from "@/components/landing/Footer";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { FlowConnector } from "@/components/landing/FlowConnector";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";

const MarketingOps = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-balance">
                Governance, without the friction.
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one gives ops full control over domains, templates, rules, and roles.
            </p>
            <div className="pt-4">
              <Link to="/pricing">
                <Button size="lg" className="bg-foreground text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]">
                  get early access
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Ops Truth */}
      <section className="py-32 bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="text-center space-y-12">
            <AnimatedHeadline>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground font-extrabold tracking-tight leading-[1.1]">
                Marketing systems fail when rules don&apos;t exist.
                <br />
                Or when they exist but no one follows them.
              </h2>
            </AnimatedHeadline>
            <div className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed space-y-6">
              <p className="text-foreground font-medium">utm.one enforces standards automatically.</p>
              <p>no chaos. no bureaucracy. just clean governance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ops Teams Choose utm.one */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight text-center mb-16">
            Why ops teams choose utm.one
          </h2>
          
          <div className="space-y-8 max-w-[800px] mx-auto">
            <FeatureCard
              number="01"
              title="domain-level control"
              description="manage branded domains and subpaths like: keka.com/go/, events.keka.com/r/. everything governed from one place."
              delay={0}
            />
            
            <FeatureCard
              number="02"
              title="enforced utm consistency"
              description="create naming rules. set allowed values. define templates. utm hygiene becomes automatic."
              delay={100}
            />
            
            <FeatureCard
              number="03"
              title="role-based access"
              description="super admin → workspace admin → editor → viewer. each user sees exactly what they should."
              delay={200}
            />
            
            <FeatureCard
              number="04"
              title="audit logs for everything"
              description="track who changed what — and when. every edit has a fingerprint."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[1100px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold tracking-tight text-center mb-16">
            Enterprise calm
          </h2>
          
          {/* Governance Pyramid */}
          <div className="flex flex-col items-center gap-8 mb-12">
            {/* Top Level - Governance */}
            <WorkflowStep
              icon={Shield}
              title="One control plane"
              description="Single governance layer for all operations"
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
              delay={0}
            />
            
            <FlowConnector direction="vertical" />
            
            {/* Managed Entities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full max-w-[900px]">
              <WorkflowStep
                icon={Globe}
                title="Multiple countries"
                description="Consistent rules across regions"
                bgColor="bg-blue-50"
                iconColor="text-blue-600"
                delay={100}
              />
              
              <WorkflowStep
                icon={Users}
                title="Multiple teams"
                description="Aligned workflows for all"
                bgColor="bg-green-50"
                iconColor="text-green-600"
                delay={200}
              />
              
              <WorkflowStep
                icon={Link2}
                title="Multiple domains"
                description="Centralized domain management"
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
                delay={300}
              />
            </div>
          </div>
          
          {/* Supporting Text */}
          <p className="text-center text-body text-muted-foreground max-w-[640px] mx-auto">
            all operating under one clean governance layer.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <AnimatedHeadline delay={100}>
              <h2 className="text-h1 font-display text-foreground font-bold tracking-tight">
                Clarity needs structure. utm.one gives you both.
              </h2>
            </AnimatedHeadline>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-foreground text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]">
                  see ops controls
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center">
            <p className="text-body text-muted-foreground">
              <Link to="/solutions/developers" className="text-foreground hover:underline">
                developers can integrate everything via api →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketingOps;
