import { ArrowLeft, Beaker, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";

export default function BayesianTesting() {
  return (
    <>
      <Helmet>
        <title>clean track testing™ | utm.one</title>
        <meta
          name="description"
          content="Learn how utm.one uses Clean Track Intelligence™ and probabilistic methods to determine winning variants with statistical confidence."
        />
      </Helmet>

      <ResourcesLayout>
        {/* Hero */}
        <section className="relative py-24 md:py-32">
          <div className="container max-w-text-content mx-auto px-4">
            <Link to="/resources/guides">
              <Button variant="ghost" size="sm" className="mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                back to guides
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Beaker className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground hero-gradient">
                clean track testing™
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground">
              scientific experimentation with statistical confidence
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-muted/20">
          <div className="container max-w-text-content mx-auto px-4 space-y-12">
            {/* What Is It */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                what is clean track testing™?
              </h2>
              <p className="text-lg text-muted-foreground">
                Instead of just counting clicks, we calculate the <strong>probability</strong> 
                that one variant is truly better than another using probabilistic statistics.
              </p>
              <p className="text-lg text-muted-foreground">
                Traditional A/B testing says "Variant B won." Clean Track Testing™ says 
                "Variant B has a <strong>98.7% chance</strong> of beating Variant A."
              </p>
            </div>

            {/* How It Works */}
            <Card className="p-8 border-border/50">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
                how it works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold bg-primary/10 text-primary">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">probability distributions</h3>
                    <p className="text-muted-foreground mt-1">
                      Each variant's conversion rate is modeled as a probability distribution. 
                      As data comes in, the distribution narrows (uncertainty reduces).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold bg-primary/10 text-primary">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">monte carlo simulation</h3>
                    <p className="text-muted-foreground mt-1">
                      We run 10,000 simulations sampling from both distributions. 
                      Count how many times B beats A. That's your probability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-bold bg-primary/10 text-primary">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">statistical confidence</h3>
                    <p className="text-muted-foreground mt-1">
                      When probability &gt; 95%, we declare a winner. 
                      No more guessing. Pure statistical rigor.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Why It Matters */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                why clean track testing™ beats traditional testing
              </h2>
              
              <Card className="p-6 bg-card border-border/50 not-prose">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      traditional a/b testing
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>❌ Fixed sample size required upfront</li>
                      <li>❌ Can't peek at results early</li>
                      <li>❌ Binary outcome: "winner" or "no difference"</li>
                      <li>❌ Doesn't quantify confidence</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      clean track testing™ (utm.one)
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✅ Continuous monitoring, stop anytime</li>
                      <li>✅ Real-time probability updates</li>
                      <li>✅ Quantified confidence: "97.3% certain"</li>
                      <li>✅ Actionable insights throughout</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Use Cases */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                when to use the lab
              </h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                <Card className="p-6 border-border/50">
                  <TrendingUp className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">landing page tests</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Test headline variations, CTAs, images. Know which version truly converts better.
                  </p>
                </Card>
                <Card className="p-6 border-border/50">
                  <Trophy className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">campaign optimization</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Test ad creatives, audiences, offers. Allocate budget to proven winners.
                  </p>
                </Card>
              </div>
            </div>

            {/* CTA */}
            <Card className="p-8 text-center bg-primary/5 border-primary/20">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                ready to experiment smarter?
              </h2>
              <p className="text-muted-foreground mb-6">
                Start running statistically rigorous tests with Clean Track Intelligence™.
              </p>
              <Link to="/signup">
                <Button size="lg">
                  get started free
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
}
