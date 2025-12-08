import { Navigation } from "@/components/landing/Navigation";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLAN_CONFIG } from "@/lib/planConfig";

const LifetimeDeal = () => {
  const navigate = useNavigate();
  const growthPlan = PLAN_CONFIG.growth;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-section bg-background">
        <div className="max-w-[900px] mx-auto px-8">
          <AnimatedSection className="text-center space-y-6">
            <div className="inline-block px-4 py-1 text-small-text font-semibold rounded-full bg-white/10 text-white/80">
              🔥 limited to first 500 customers
            </div>
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-balance">
                pay once.<br />use forever.
              </h1>
            </div>
            <p className="text-body-text text-secondary-label max-w-[640px] mx-auto">
              get lifetime access to growth features for a one-time payment of $299. no recurring fees. no limits on time.
            </p>
            <div className="pt-4">
              <Button size="lg" onClick={() => navigate('/early-access')}>
                claim your lifetime deal
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-group bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <AnimatedSection>
            <h2 className="text-heading-2 font-display text-center font-bold mb-12">
              what you get forever
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-heading-3 font-display font-semibold mb-2">1,000 links/month</h2>
                  <p className="text-small-text text-secondary-label">
                    create up to 1,000 short links every month
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-heading-3 font-display font-semibold mb-2">3 custom domains</h2>
                  <p className="text-small-text text-secondary-label">
                    connect up to 3 custom branded domains
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-heading-3 font-display font-semibold mb-2">100k clicks/month</h2>
                  <p className="text-small-text text-secondary-label">
                    track up to 100,000 clicks monthly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-heading-3 font-display font-semibold mb-2">1-year analytics</h2>
                  <p className="text-small-text text-secondary-label">
                    365 days of historical analytics data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-heading-3 font-display font-semibold mb-2">5 team members</h2>
                  <p className="text-small-text text-secondary-label">
                    invite up to 5 team members
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-heading-3 font-display font-semibold mb-2">geo-targeting</h2>
                  <p className="text-small-text text-secondary-label">
                    redirect visitors based on location
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Limited */}
      <section className="py-group bg-background">
        <div className="max-w-[720px] mx-auto px-8">
          <AnimatedSection>
            <h2 className="text-heading-2 font-display text-center font-bold mb-6">
              why only 500 spots?
            </h2>
            <div className="space-y-4 text-body-text text-secondary-label">
              <p>
                we're limiting this offer to our first 500 customers to build a sustainable business while rewarding early believers.
              </p>
              <p>
                lifetime deals are incredibly generous, and we want to make sure we can continue providing excellent service and features to everyone who joins us early.
              </p>
              <p>
                once these 500 spots are gone, this offer closes forever. standard monthly pricing will be the only option.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-group bg-background">
        <div className="max-w-[720px] mx-auto px-8">
          <AnimatedSection>
            <div className="text-center space-y-6">
              <h2 className="text-heading-2 font-display font-bold">
                ready to claim your spot?
              </h2>
              <div className="text-5xl font-bold text-foreground">
                $299 once
              </div>
              <p className="text-body-text text-white/60">
                join others who've already claimed their lifetime access
              </p>
              <Button size="lg" onClick={() => navigate('/early-access')}>
                get lifetime access now
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <span className="text-micro-text text-secondary-label">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LifetimeDeal;