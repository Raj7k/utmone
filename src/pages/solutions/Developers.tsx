import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";

const Developers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-hero text-foreground font-extrabold tracking-tight text-balance">
              A Clean API For A Cleaner Stack.
            </h1>
            <p className="text-body text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one integrates your links, analytics, and events into any system you already use.
            </p>
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
      <section className="py-24 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            Why Developers Choose utm.one
          </h2>
          
          <div className="space-y-16">
            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                consistent restful api
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                create, update, track links programmatically.<br />
                fully documented.<br />
                versioned.<br />
                fast.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                webhooks that actually work
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                real-time click events.<br />
                easy to subscribe.<br />
                easy to pipe into warehouses.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                export-ready data
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                bigquery, snowflake, databricks, redshift —<br />
                all supported through clean exports.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                predictable performance
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                100ms redirects.<br />
                safe, governed structure.<br />
                no surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            Built For Integration, Not Isolation
          </h2>
          <div className="text-center space-y-6">
            <p className="text-body text-muted-foreground max-w-[640px] mx-auto">
              internal dashboards<br />
              custom attribution models<br />
              slack alerts<br />
              hubspot workflows<br />
              custom flows for campaigns
              <br /><br />
              everything works because the data is clean from the start.
            </p>
          </div>
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
