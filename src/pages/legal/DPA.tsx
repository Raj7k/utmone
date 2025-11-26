import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

const DPA = () => {
  return (
    <>
      <SEO
        title="data processing agreement — utm.one"
        description="GDPR-compliant data processing agreement outlining how utm.one processes personal data on your behalf"
        canonical="https://utm.one/legal/dpa"
      />
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
          {/* Header */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
              data processing agreement
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              this data processing agreement ("DPA") governs how utm.one processes personal data on your behalf.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Roles */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">1. roles</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• customer = data controller</li>
                <li>• utm.one = data processor</li>
              </ul>
            </section>

            {/* Purpose */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">2. purpose</h2>
              <p className="text-muted-foreground">we process data solely to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• operate the platform</li>
                <li>• provide analytics to you</li>
                <li>• manage your workspace</li>
                <li>• ensure security</li>
                <li>• provide support</li>
                <li>• comply with law</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                we do not process your data for advertising or profiling.
              </p>
            </section>

            {/* Instructions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">3. instructions</h2>
              <p className="text-muted-foreground">
                we only process data under your documented instructions, including:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• link creation</li>
                <li>• UTM generation</li>
                <li>• QR code generation</li>
                <li>• metadata handling</li>
                <li>• clean-track enforcement</li>
                <li>• analytics</li>
                <li>• partner attribution</li>
              </ul>
            </section>

            {/* Confidentiality */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">4. confidentiality</h2>
              <p className="text-muted-foreground">
                all personnel handling data are bound by confidentiality obligations.
              </p>
            </section>

            {/* Security Measures */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">5. security measures</h2>
              <p className="text-muted-foreground">we implement:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• encryption at rest and in transit</li>
                <li>• access control</li>
                <li>• continuous monitoring</li>
                <li>• incident response</li>
                <li>• regular backups</li>
                <li>• data isolation</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                details available in our{" "}
                <a href="/legal/data-security" className="text-primary hover:text-primary/80 transition-colors">
                  data & security page
                </a>
                .
              </p>
            </section>

            {/* Subprocessors */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">6. subprocessors</h2>
              <p className="text-muted-foreground">
                we may use approved subprocessors listed in our{" "}
                <a href="/legal/subprocessors" className="text-primary hover:text-primary/80 transition-colors">
                  public subprocessor page
                </a>
                . you will be notified of changes.
              </p>
            </section>

            {/* International Transfers */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">7. international transfers</h2>
              <p className="text-muted-foreground">transfers may occur using:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• SCCs (standard contractual clauses)</li>
                <li>• adequacy decisions</li>
                <li>• other lawful mechanisms</li>
              </ul>
            </section>

            {/* Data Subject Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">8. data subject rights</h2>
              <p className="text-muted-foreground">we assist you in responding to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• access</li>
                <li>• correction</li>
                <li>• deletion</li>
                <li>• export</li>
                <li>• objections</li>
              </ul>
            </section>

            {/* Deletion */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">9. deletion</h2>
              <p className="text-muted-foreground">upon account termination:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• all personal data is deleted</li>
                <li>• backups removed automatically per rotation cycle</li>
                <li>• logs removed after 30–90 days</li>
              </ul>
            </section>

            {/* Audits */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">10. audits</h2>
              <p className="text-muted-foreground">
                enterprise customers may request data protection information.
                third-party audits may require separate agreements.
              </p>
            </section>

            {/* Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">11. liability</h2>
              <p className="text-muted-foreground">
                liability governed by your{" "}
                <a href="/legal/terms" className="text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </a>{" "}
                agreement.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">12. contact</h2>
              <p className="text-muted-foreground">
                <a href="mailto:dpo@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                  dpo@utm.one
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

export default DPA;
