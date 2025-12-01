import { ArrowLeft, Beaker, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet";

export default function BayesianTesting() {
  return (
    <>
      <Helmet>
        <title>bayesian a/b testing | utm.one</title>
        <meta
          name="description"
          content="Learn how utm.one uses Bayesian statistics and Monte Carlo methods to determine winning variants with statistical confidence."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
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
                bayesian a/b testing
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
                what is bayesian testing?
              </h2>
              <p className="text-lg text-muted-foreground">
                Instead of just counting clicks, we calculate the <strong>probability</strong> 
                that one variant is truly better than another using Bayesian statistics.
              </p>
              <p className="text-lg text-muted-foreground">
                Traditional A/B testing says "Variant B won." Bayesian testing says 
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
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">beta distributions</h3>
                    <p className="text-muted-foreground mt-1">
                      Each variant's conversion rate is modeled as a Beta distribution. 
                      As data comes in, the distribution narrows (uncertainty reduces).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
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
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
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
                why bayesian beats traditional testing
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
                      bayesian testing (utm.one)
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    landing page optimization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Test two different landing pages. Know with 95%+ confidence which one converts better.
                  </p>
                </Card>

                <Card className="p-6 border-border/50">
                  <Trophy className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    campaign messaging
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Compare two ad copy variations. Stop the test as soon as we detect a winner.
                  </p>
                </Card>
              </div>
            </div>

            {/* The Science */}
            <Card className="p-8 bg-mirage border-border/50">
              <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Beaker className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    the mathematics behind it
                  </h2>
                  <p className="text-white/80 mb-4">
                    utm.one implements Chapter 21 (Monte Carlo Methods) from 
                    <em> Algorithms for Optimization</em> by Kochenderfer & Wheeler.
                  </p>
                  <p className="text-white/80">
                    Each variant's conversion rate follows a <strong>Beta distribution</strong>: 
                    Beta(α = 1 + conversions, β = 1 + non-conversions). We sample 10,000 times 
                    from both distributions and count how often B &gt; A. That ratio is your 
                    probability of B winning.
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button asChild size="lg">
                <Link to="/dashboard/experiments">
                  <Beaker className="h-4 w-4 mr-2" />
                  go to the lab
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}