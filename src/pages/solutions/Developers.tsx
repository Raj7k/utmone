import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, BarChart3, MessageCircle, Workflow, Database } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";

const Developers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-foreground font-extrabold tracking-tight text-balance">
              A Clean API For A Cleaner Stack.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one integrates your links, analytics, and events into any system you already use.
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

      {/* The Engineering Truth */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <p className="text-body text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              complex link systems break silently.<br />
              apis differ.<br />
              redirects slow down.<br />
              analytics drift.
              <br /><br />
              utm.one gives engineers predictable, reliable link infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Why Developers Choose utm.one */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-5xl text-foreground font-bold tracking-tight text-center mb-16">
            Why Developers Choose utm.one
          </h2>
          
          <div className="space-y-8 max-w-[800px] mx-auto">
            <FeatureCard
              number="01"
              title="consistent restful api"
              description="create, update, track links programmatically. fully documented. versioned. fast."
              delay={0}
            />
            
            <FeatureCard
              number="02"
              title="webhooks that actually work"
              description="real-time click events. easy to subscribe. easy to pipe into warehouses."
              delay={100}
            />
            
            <FeatureCard
              number="03"
              title="export-ready data"
              description="bigquery, snowflake, databricks, redshift — all supported through clean exports."
              delay={200}
            />
            
            <FeatureCard
              number="04"
              title="predictable performance"
              description="100ms redirects. safe, governed structure. no surprises."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[1100px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            Built For Integration
          </h2>
          
          {/* Hub and Spoke Layout */}
          <div className="flex flex-col items-center gap-12 mb-12">
            {/* Center Hub */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-foreground/5 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105">
                <Box className="w-10 h-10 md:w-12 md:h-12 text-foreground" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">utm.one API</h3>
              <p className="text-sm text-muted-foreground">Clean API foundation</p>
            </div>
            
            {/* Connected Systems */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 w-full max-w-[1000px]">
              <WorkflowStep
                icon={BarChart3}
                title="Dashboards"
                description="Pull clean analytics data"
                bgColor="bg-blue-50"
                iconColor="text-blue-600"
                delay={0}
              />
              
              <WorkflowStep
                icon={MessageCircle}
                title="Slack Alerts"
                description="Reliable notifications"
                bgColor="bg-purple-50"
                iconColor="text-purple-600"
                delay={100}
              />
              
              <WorkflowStep
                icon={Workflow}
                title="HubSpot"
                description="Perfect workflow sync"
                bgColor="bg-orange-50"
                iconColor="text-orange-600"
                delay={200}
              />
              
              <WorkflowStep
                icon={Database}
                title="Warehouses"
                description="Export-ready data"
                bgColor="bg-green-50"
                iconColor="text-green-600"
                delay={300}
              />
            </div>
          </div>
          
          {/* Supporting Text */}
          <p className="text-center text-body text-muted-foreground max-w-[640px] mx-auto">
            everything works because the data is clean from the start.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h1 text-foreground font-bold tracking-tight">
              utm.one Gives Teams A Single, Reliable Foundation For Link Data.
            </h2>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-foreground text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]">
                  view developer docs
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
                see how <Link to="/solutions/marketing-ops" className="text-foreground hover:underline">ops</Link> governs domains and roles →
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

export default Developers;
