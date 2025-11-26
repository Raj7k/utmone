import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

const TermsLegal = () => {
  return (
    <>
      <SEO
        title="Terms of Service - utm.one"
        description="Terms of Service and User Agreement for utm.one short link and UTM management platform."
        canonical="https://utm.one/legal/terms"
        keywords={["terms of service", "user agreement", "legal terms", "utm.one"]}
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 bg-white">
          <div className="max-w-text-content mx-auto px-8 py-24">
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-12">
              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using utm.one (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  utm.one provides URL shortening, UTM parameter management, QR code generation, and analytics services. The Service is provided "as is" and may be modified, suspended, or discontinued at any time.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">3. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Violate any laws or regulations</li>
                  <li>Distribute malware, spam, or phishing content</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Abuse, harass, or harm other users</li>
                  <li>Circumvent security measures or rate limits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">4. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized access.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">5. Link Permanence</h2>
                <p className="text-muted-foreground leading-relaxed">
                  utm.one commits to maintaining link functionality in perpetuity. See our <a href="/legal/permanence-terms" className="text-primary hover:text-primary/80 font-medium">Permanence Terms</a> for details on our 365-day redirect guarantee and code release commitments.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are owned by utm.one and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  utm.one shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Questions about these Terms? Contact us at <a href="mailto:legal@utm.one" className="text-primary hover:text-primary/80 font-medium">legal@utm.one</a>
                </p>
              </section>

              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Last updated: January 26, 2025
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsLegal;
