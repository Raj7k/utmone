import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";

const MarketingOps = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-hero text-foreground font-extrabold tracking-tight text-balance">
              Governance, Without The Friction.
            </h1>
            <p className="text-body text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one gives ops full control over domains, templates, rules, and roles.
            </p>
          </div>
        </div>
      </section>

      {/* The Ops Truth */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <p className="text-body text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              marketing systems fail when rules don&apos;t exist —<br />
              or when they exist but no one follows them.
              <br /><br />
              utm.one enforces standards automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Why Ops Teams Choose utm.one */}
      <section className="py-24 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            Why Ops Teams Choose utm.one
          </h2>
          
          <div className="space-y-16">
            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                domain-level control
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                manage branded domains and subpaths like:<br />
                keka.com/go/<br />
                events.keka.com/r/
                <br /><br />
                everything governed from one place.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                enforced utm consistency
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                create naming rules.<br />
                set allowed values.<br />
                define templates.<br />
                utm hygiene becomes automatic.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                role-based access
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                super admin → workspace admin → editor → viewer<br />
                each user sees exactly what they should.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                audit logs for everything
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                track who changed what — and when.<br />
                every edit has a fingerprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            Designed For Enterprise Calm
          </h2>
          <div className="text-center space-y-6">
            <p className="text-body text-muted-foreground max-w-[640px] mx-auto">
              multiple countries.<br />
              multiple teams.<br />
              multiple domains.
              <br /><br />
              all operating under one clean governance layer.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h1 text-foreground font-bold tracking-tight">
              Clarity Needs Structure. utm.one Gives You Both.
            </h2>
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

export default MarketingOps;
