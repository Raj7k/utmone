import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

const Subprocessors = () => {
  return (
    <>
      <SEO
        title="subprocessors — utm.one"
        description="list of third-party service providers utm.one uses to operate the platform"
        canonical="https://utm.one/legal/subprocessors"
      />
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
          {/* Header */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
              subprocessors list
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              utm.one uses third-party providers ("subprocessors") to run the platform.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Infrastructure */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">infrastructure</h2>
              <p className="text-muted-foreground">AWS / GCP / Azure — hosting, databases</p>
            </section>

            {/* Analytics */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">analytics</h2>
              <p className="text-muted-foreground">internal analytics services (no third-party tracking)</p>
            </section>

            {/* Email */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">email</h2>
              <p className="text-muted-foreground">sendgrid / postmark — transactional email</p>
            </section>

            {/* Payment */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">payment</h2>
              <p className="text-muted-foreground">stripe — billing & subscription management</p>
            </section>

            {/* Monitoring */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">monitoring</h2>
              <p className="text-muted-foreground">sentry / datadog — error tracking, performance monitoring</p>
            </section>

            {/* Backups */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">backups</h2>
              <p className="text-muted-foreground">cloud backup providers (AWS/GCP/Azure)</p>
            </section>

            {/* Updates Note */}
            <section className="space-y-4 pt-8 border-t border-border/50">
              <p className="text-muted-foreground">
                we update this list when subprocessors change.
                for notifications, email{" "}
                <a href="mailto:privacy@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                  privacy@utm.one
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

export default Subprocessors;
