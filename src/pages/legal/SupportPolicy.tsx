import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

const SupportPolicy = () => {
  return (
    <>
      <SEO
        title="support policy — utm.one"
        description="learn about utm.one's support channels, response times, and coverage for different plan tiers"
        canonical="https://utm.one/legal/support"
      />
      <Navigation />
      <FloatingNavigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
          {/* Header */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
              support policy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              utm.one provides support to help you use the platform smoothly.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Support Channels */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">1. support channels</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  email support:{" "}
                  <a href="mailto:support@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                    support@utm.one
                  </a>
                </p>
                <p>
                  priority support (business plans):{" "}
                  <a href="mailto:business-support@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                    business-support@utm.one
                  </a>
                </p>
                <p>
                  security issues:{" "}
                  <a href="mailto:security@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                    security@utm.one
                  </a>
                </p>
                <p>
                  abuse reports:{" "}
                  <a href="mailto:abuse@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                    abuse@utm.one
                  </a>
                </p>
              </div>
            </section>

            {/* Response Times */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">2. response times</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• free plan → 48–72 hours</li>
                <li>• pro plan → 24–48 hours</li>
                <li>• business → same business day</li>
                <li>• enterprise → SLA available on request</li>
              </ul>
            </section>

            {/* What We Support */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">3. what we support</h2>
              <p className="text-muted-foreground">we help with:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• link creation</li>
                <li>• UTMs</li>
                <li>• QR codes</li>
                <li>• analytics</li>
                <li>• partner program setup</li>
                <li>• clean-track configuration</li>
                <li>• integrations</li>
                <li>• API usage</li>
                <li>• billing inquiries</li>
              </ul>
            </section>

            {/* What We Cannot Support */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">4. what we cannot support</h2>
              <p className="text-muted-foreground">we do not provide:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• marketing strategy advice</li>
                <li>• campaign setup</li>
                <li>• debugging your website</li>
                <li>• custom analytics implementations</li>
                <li>• SEO consulting</li>
              </ul>
            </section>

            {/* Availability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">5. availability</h2>
              <p className="text-muted-foreground">
                support is available: monday–friday, 10am–6pm IST (excluding holidays)
              </p>
            </section>

            {/* Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">6. updates</h2>
              <p className="text-muted-foreground">
                this policy evolves as the product grows.
              </p>
            </section>
          </div>

          {/* Last Updated */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              last updated: 25 november 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SupportPolicy;
