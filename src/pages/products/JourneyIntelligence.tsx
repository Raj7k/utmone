import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeroGlobe } from "@/components/premium/HeroGlobe";
import { Network, User, TrendingUp } from "lucide-react";

export default function JourneyIntelligence() {
  return (
    <FeatureLayout
      title="Journey Intelligence - Bayesian Attribution | utm.one"
      description="Stop tracking clicks. Start engineering journeys. Understand the true causal impact of every touchpoint."
      canonical="https://utm.one/products/journey-intelligence"
      keywords={["customer journey", "bayesian attribution", "multi-touch attribution", "identity resolution", "markov decision process"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "journey intelligence", url: "/products/journey-intelligence" },
      ]}
    >
      {/* Hero Section with Globe */}
      <FeatureSection background="white" className="min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/95 z-0" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-60">
          <HeroGlobe />
        </div>
        <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight brand-lowercase text-white">
            stop tracking clicks. start engineering journeys.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl">
            Most tools lie to you with "Last Click" attribution. We use Bayesian Inference and Identity Stitching to reveal the true causal impact of every channel—from the first anonymous blog read to the final signed contract.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard/attribution">
              <Button size="lg" variant="marketing" className="text-lg px-8">
                see your journey graph
              </Button>
            </Link>
            <Link to="/features/attribution-graph">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                read methodology
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>

      {/* Problem/Solution Block */}
      <FeatureSection background="muted">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-display font-bold mb-4 brand-lowercase">
              the lie of "last click"
            </h2>
            <p className="text-muted-foreground text-lg">
              Standard analytics give 100% of the credit to the last link a user clicked. This ignores the 10 other touchpoints that actually built the trust. It's like giving a gold medal to the goalkeeper and ignoring the rest of the team.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold mb-4 brand-lowercase">
              the "unreal" truth
            </h2>
            <p className="text-muted-foreground text-lg">
              We treat your customer journey as a <strong>Probabilistic Graph</strong>. By tracking the "Hidden States" of your users, we can mathematically prove which channels are driving revenue and which are just noise.
            </p>
          </div>
        </div>
      </FeatureSection>

      {/* Feature Grid: The 3 Engines */}
      <FeatureSection background="white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 brand-lowercase">
            the 3 engines
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Engine 1 */}
          <div className="p-8 rounded-2xl bg-card border">
            <User className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              identity resolution (the "stitch")
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "De-anonymize your traffic."
            </p>
            <p className="text-foreground/70 mb-4">
              We don't just track cookies; we resolve identities. Our <strong>Time-Travel Stitching</strong> engine remembers that "Anonymous Visitor 582" who read your blog 3 weeks ago is actually <strong>Sarah from Nike</strong>. When she finally signs up, we backfill her history instantly.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Powered by: Sequential State Estimation
            </p>
          </div>

          {/* Engine 2 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Network className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              bayesian attribution (the "why")
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "See the invisible influence."
            </p>
            <p className="text-foreground/70 mb-4">
              Forget "Linear" or "Time Decay" models. We use <strong>Bayesian Networks</strong> to calculate the true "Lift" of every channel. See exactly how a LinkedIn impression <em>causes</em> a Direct search three days later.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Powered by: Structure Learning & Causal Inference
            </p>
          </div>

          {/* Engine 3 */}
          <div className="p-8 rounded-2xl bg-card border">
            <TrendingUp className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              journey valuation (the "value")
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Know the dollar value of every page."
            </p>
            <p className="text-foreground/70 mb-4">
              Not all pages are equal. We model your site as a <strong>Markov Decision Process (MDP)</strong>. We calculate the "State Value" ($V$) of every URL.
            </p>
            <p className="text-sm text-primary font-semibold">
              Insight: "Your Pricing Page is worth $45.00 per visit. Your 'About Us' page is worth $0.50." Know exactly where to route traffic.
            </p>
          </div>
        </div>
      </FeatureSection>

      {/* Golden Path Visualization */}
      <FeatureSection background="muted">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold brand-lowercase">
            find your most profitable route
          </h2>
          <p className="text-xl text-muted-foreground">
            Using <strong>Pareto Optimization</strong>, we analyze millions of paths to find the "Efficient Frontier"—the specific sequence of touchpoints that yields the highest Lifetime Value (LTV) in the shortest time.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-xl bg-green-500/10 border-2 border-green-500">
              <div className="text-sm font-semibold text-green-600 mb-2">GOLD PATH</div>
              <p className="text-lg">LinkedIn Ad → Webinar → Pricing → <strong>Sale ($5,000)</strong></p>
            </div>
            <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500">
              <div className="text-sm font-semibold text-red-600 mb-2">RED PATH</div>
              <p className="text-lg">Google Search → Blog → Twitter → <strong>Churn ($0)</strong></p>
            </div>
          </div>

          <div className="p-6 bg-card border rounded-xl mt-8">
            <p className="text-lg italic text-muted-foreground">
              "utm.one didn't just show us our traffic. It showed us that our 'boring' whitepaper was actually the primary driver for 40% of our enterprise deals."
            </p>
            <p className="mt-4 font-semibold">— Head of Growth, SaaS Corp.</p>
          </div>
        </div>
      </FeatureSection>

      {/* Technical FAQ */}
      <FeatureSection background="white">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 brand-lowercase">
            frequently asked questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">How does utm.one handle cross-device tracking?</h3>
              <p className="text-muted-foreground">
                We use a deterministic "Identity Stitching" method. When a user identifies themselves (e.g., via a form fill or login) on a new device, we link that session's visitor_id to their global user_id, merging the journey graphs across mobile and desktop.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">What attribution models do you support?</h3>
              <p className="text-muted-foreground">
                We support standard models (Linear, First-Touch, Last-Touch) and advanced <strong>Algorithmic Models</strong> (Bayesian Lift and Markov Chains) that assign credit based on removal effects and conversion probability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Is this GDPR/CCPA compliant?</h3>
              <p className="text-muted-foreground">
                Yes. Our Identity Resolution is first-party only. We do not share data between customers. You own your identity graph. We also provide "Right to be Forgotten" endpoints that purge a user's entire history from the graph.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Can I export the raw journey data?</h3>
              <p className="text-muted-foreground">
                Yes. Enterprise plans include <strong>Data Warehouse Sync</strong> (Snowflake, BigQuery, S3). You can export the full journey_events table for internal analysis.
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <FeatureSection background="muted">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold brand-lowercase">
            ready to see who your users really are?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the best marketing teams using Scientific Attribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" variant="marketing">
                start free trial
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                book a demo
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
}
