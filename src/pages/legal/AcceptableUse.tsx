import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

const AcceptableUse = () => {
  return (
    <>
      <SEO
        title="acceptable use policy — utm.one"
        description="guidelines for responsible and lawful use of utm.one's link management platform"
        canonical="https://utm.one/legal/acceptable-use"
      />
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
          {/* Header */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
              acceptable use policy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              to keep utm.one safe and reliable, you agree not to misuse the service.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Prohibited Use */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">1. prohibited use</h2>
              <p className="text-muted-foreground">you must not use utm.one to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• create or distribute links to malware</li>
                <li>• perform phishing, fraud, or impersonation</li>
                <li>• shorten links to illegal content</li>
                <li>• violate IP rights or copyrights</li>
                <li>• engage in harassment or abuse</li>
                <li>• scrape or overload our systems</li>
                <li>• bypass rate limits or security controls</li>
                <li>• misrepresent your identity</li>
                <li>• violate privacy laws</li>
                <li>• use bots to artificially inflate clicks</li>
              </ul>
            </section>

            {/* Platform Integrity */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">2. platform integrity</h2>
              <p className="text-muted-foreground">you must not:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• reverse engineer the platform</li>
                <li>• attempt unauthorized access</li>
                <li>• modify our code</li>
                <li>• scan our infrastructure</li>
                <li>• distribute harmful code</li>
                <li>• interfere with other users' access</li>
              </ul>
            </section>

            {/* Partner Program Usage */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">3. partner program usage</h2>
              <p className="text-muted-foreground">when using partner tools, you must:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• give accurate partner information</li>
                <li>• avoid misleading or deceptive practices</li>
                <li>• comply with local marketing & disclosure laws</li>
              </ul>
            </section>

            {/* Enforcement */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">4. enforcement</h2>
              <p className="text-muted-foreground">
                we may suspend or terminate accounts violating this policy.
                serious violations may be reported to authorities.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">5. contact</h2>
              <p className="text-muted-foreground">
                report abuse or violations:{" "}
                <a href="mailto:abuse@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                  abuse@utm.one
                </a>
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

export default AcceptableUse;
