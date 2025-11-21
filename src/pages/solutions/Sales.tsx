import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode, Monitor, MessageSquare } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";

const Sales = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-foreground font-extrabold tracking-tight text-balance">
              Share faster. Share cleaner.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one gives sales simple, branded short links without the complexity of utms.
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

      {/* The Sales Truth */}
      <section className="py-32 bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="text-center space-y-12">
            <AnimatedHeadline>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground font-extrabold tracking-tight leading-[1.1]">
                Sales shouldn&apos;t worry about tracking.
                <br />
                They should focus on conversations.
              </h2>
            </AnimatedHeadline>
            <div className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed space-y-6">
              <p>every touchpoint—booth, demo, follow-up—should just work.</p>
              <p className="text-foreground font-medium">utm.one removes the friction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sales Teams Choose utm.one */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-5xl text-foreground font-bold tracking-tight text-center mb-16">
            Why sales teams choose utm.one
          </h2>
          
          <div className="space-y-8 max-w-[800px] mx-auto">
            <FeatureCard
              number="01"
              title="one-click short links"
              description="professional, on-brand urls for: demos, proposals, decks, follow-ups."
              delay={0}
            />
            
            <FeatureCard
              number="02"
              title="qr codes ready for booths"
              description="clean, beautiful, instantly usable on screens, slides, and stands."
              delay={100}
            />
            
            <FeatureCard
              number="03"
              title="templates that think for you"
              description="utms are pre-set by marketing. sales just clicks 'generate.'"
              delay={200}
            />
            
            <FeatureCard
              number="04"
              title="simple insights"
              description="know which links are working — without touching analytics."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[1100px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl text-foreground font-bold tracking-tight text-center mb-16">
            Designed for moments that matter
          </h2>
          
          {/* Use Case Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
            <WorkflowStep
              icon={QrCode}
              title="At the booth"
              description="QR codes on screens, slides, and stands"
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
              delay={0}
            />
            
            <WorkflowStep
              icon={Monitor}
              title="During demo"
              description="Share branded link in real-time"
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
              delay={100}
            />
            
            <WorkflowStep
              icon={MessageSquare}
              title="Follow-up"
              description="Drop clean link in chat or email"
              bgColor="bg-green-50"
              iconColor="text-green-600"
              delay={200}
            />
          </div>
          
          {/* Supporting Text */}
          <p className="text-center text-body text-muted-foreground max-w-[640px] mx-auto">
            utm.one makes every touchpoint clean and reliable.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <AnimatedHeadline delay={100}>
              <h2 className="text-h1 text-foreground font-bold tracking-tight">
                Sales moves faster with simple, consistent links.
              </h2>
            </AnimatedHeadline>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-foreground text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]">
                  see how sales uses utm.one
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
              <Link to="/solutions/marketers" className="text-foreground hover:underline">
                see how marketing creates these links →
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

export default Sales;
