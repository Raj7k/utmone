import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon, Sparkles, Zap } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { FlowConnector } from "@/components/landing/FlowConnector";

const Marketers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-foreground font-extrabold tracking-tight text-balance">
              Campaigns Work Better When Links Do.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one brings clarity, consistency, and precision to every link you create.
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

      {/* The Marketing Truth */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <p className="text-body text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              when utms break, attribution breaks.
              <br />
              when links drift, data drifts.
              <br />
              and when data drifts, decisions suffer.
              <br /><br />
              utm.one fixes this at the source.
            </p>
          </div>
        </div>
      </section>

      {/* Why Marketers Choose utm.one */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-5xl text-foreground font-bold tracking-tight text-center mb-16">
            Why Marketers Choose utm.one
          </h2>
          
          <div className="space-y-8 max-w-[800px] mx-auto">
            <FeatureCard
              number="01"
              title="perfect utms, every time"
              description="five fields. validated. normalized. consistent by default. no more fixing campaigns after launch."
              delay={0}
            />
            
            <FeatureCard
              number="02"
              title="branded short links"
              description="your domain. your identity. your trust — in every channel."
              delay={100}
            />
            
            <FeatureCard
              number="03"
              title="on-brand qr codes"
              description="clean, beautiful, and ready for events, webinars, and paid campaigns."
              delay={200}
            />
            
            <FeatureCard
              number="04"
              title="clear analytics"
              description="see what matters: campaigns, clicks, devices, regions. no clutter. no noise."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[1100px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            A Workflow Designed For Speed
          </h2>
          
          {/* Linear Flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 mb-12">
            <WorkflowStep
              icon={LinkIcon}
              title="Paste Your Link"
              description="Drop any destination URL"
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
              delay={0}
            />
            
            <FlowConnector direction="horizontal" />
            
            <WorkflowStep
              icon={Sparkles}
              title="Choose Template"
              description="UTMs auto-populated from template"
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
              delay={100}
            />
            
            <FlowConnector direction="horizontal" />
            
            <WorkflowStep
              icon={Zap}
              title="Generated"
              description="Short link + UTMs + QR code ready"
              bgColor="bg-green-50"
              iconColor="text-green-600"
              delay={200}
            />
          </div>
          
          {/* Supporting Text */}
          <p className="text-center text-body text-muted-foreground max-w-[640px] mx-auto">
            all in under 30 seconds.<br />
            no switching tools.<br />
            no broken tracking.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h1 text-foreground font-bold tracking-tight">
              Clean Links Lead To Better Campaigns.
            </h2>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-foreground text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]">
                  see how marketers use utm.one
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
              <Link to="/solutions/sales" className="text-foreground hover:underline">
                sales also moves faster with clean links →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <span className="text-[13px] text-muted-foreground">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketers;
