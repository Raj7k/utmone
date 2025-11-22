import { Navigation } from "@/components/landing/Navigation";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLAN_CONFIG } from "@/lib/planConfig";

const LifetimeDeal = () => {
  const navigate = useNavigate();
  const lifetimePlan = PLAN_CONFIG.lifetime;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-section bg-background">
        <div className="max-w-[900px] mx-auto px-8">
          <AnimatedSection className="text-center space-y-6">
            <div className="inline-block px-4 py-1 bg-primary/20 text-primary text-small-text font-semibold rounded-full">
              🔥 limited to first 500 customers
            </div>
            <h1 className="text-heading-1 text-foreground font-extrabold tracking-tight">
              pay once.<br />use forever.
            </h1>
            <p className="text-body-text text-muted-foreground max-w-[640px] mx-auto">
              get lifetime access to pro features for a one-time payment of $299. no recurring fees. no limits on time.
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
            <h2 className="text-heading-2 text-center font-bold mb-12">
              what you get forever
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-heading-3 font-semibold mb-2">1,000 links/month</h3>
                  <p className="text-small-text text-muted-foreground">
                    create up to 1,000 short links every month
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-heading-3 font-semibold mb-2">unlimited domains</h3>
                  <p className="text-small-text text-muted-foreground">
                    connect as many custom domains as you need
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-heading-3 font-semibold mb-2">100k clicks/month</h3>
                  <p className="text-small-text text-muted-foreground">
                    track up to 100,000 clicks monthly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-heading-3 font-semibold mb-2">1-year analytics</h3>
                  <p className="text-small-text text-muted-foreground">
                    365 days of historical analytics data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-heading-3 font-semibold mb-2">unlimited team members</h3>
                  <p className="text-small-text text-muted-foreground">
                    invite your entire team at no extra cost
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border">
                <Check className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-heading-3 font-semibold mb-2">priority support</h3>
                  <p className="text-small-text text-muted-foreground">
                    get help faster with priority email support
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
            <h2 className="text-heading-2 text-center font-bold mb-6">
              why only 500 spots?
            </h2>
            <div className="space-y-4 text-body-text text-muted-foreground">
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

      {/* Guarantee */}
      <section className="py-group bg-muted/20">
        <div className="max-w-[720px] mx-auto px-8">
          <AnimatedSection>
            <div className="text-center space-y-6 p-12 bg-card rounded-2xl border border-border">
              <h2 className="text-heading-2 font-bold">
                our permanence guarantee
              </h2>
              <p className="text-body-text text-muted-foreground">
                even if utm.one shuts down in the future, we guarantee your links will continue working. we'll redirect them to an open-source service before closing.
              </p>
              <p className="text-body-text text-muted-foreground">
                your investment is protected. your links are permanent.
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
              <h2 className="text-heading-2 font-bold">
                ready to claim your spot?
              </h2>
              <div className="text-5xl font-bold text-foreground">
                $299 once
              </div>
              <p className="text-body-text text-muted-foreground">
                join {Math.floor(Math.random() * 50 + 1)} others who've already claimed their lifetime access
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
            <span className="text-micro-text text-muted-foreground">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LifetimeDeal;
