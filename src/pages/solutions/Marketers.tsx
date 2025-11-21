import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";

const Marketers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-hero text-foreground font-extrabold tracking-tight text-balance">
              Campaigns Work Better When Links Do.
            </h1>
            <p className="text-body text-muted-foreground max-w-[640px] mx-auto text-balance">
              utm.one brings clarity, consistency, and precision to every link you create.
            </p>
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
      <section className="py-24 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            Why Marketers Choose utm.one
          </h2>
          
          <div className="space-y-16">
            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                perfect utms, every time
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                five fields.<br />
                validated. normalized. consistent by default.<br />
                no more fixing campaigns after launch.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                branded short links
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                your domain.<br />
                your identity.<br />
                your trust — in every channel.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                on-brand qr codes
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                clean, beautiful, and ready for events, webinars, and paid campaigns.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 text-foreground font-semibold">
                clear analytics
              </h3>
              <p className="text-body text-muted-foreground max-w-[640px]">
                see what matters:<br />
                campaigns, clicks, devices, regions.<br />
                no clutter. no noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-h2 text-foreground font-bold tracking-tight text-center mb-16">
            A Workflow Designed For Speed
          </h2>
          <div className="text-center space-y-6">
            <p className="text-body text-muted-foreground max-w-[640px] mx-auto">
              paste your link → choose template → short link + utms + qr generated
              <br /><br />
              all in under 30 seconds.<br />
              no switching tools.<br />
              no broken tracking.
            </p>
          </div>
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
