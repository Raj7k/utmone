import { SEO } from "@/components/seo/SEO";
import { MainLayout } from "@/components/layout/MainLayout";

const TermsLegal = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="Terms of Service - utm.one"
        description="Terms of Service and User Agreement for utm.one short link and UTM management platform."
        canonical="https://utm.one/legal/terms"
        keywords={["terms of service", "user agreement", "legal terms", "utm.one"]}
      />
        
      <main className="flex-1">
          <div className="max-w-text-content mx-auto px-8 py-24">
            <h1 className="text-5xl md:text-6xl font-display font-bold hero-gradient mb-8 lowercase">
              terms of service
            </h1>
            
            <p className="text-lg text-white/60 leading-relaxed mb-12">
              welcome to utm.one. by using utm.one, you agree to these terms.
            </p>
            
            <p className="text-base text-white/60 leading-relaxed mb-12">
              please read them carefully.
            </p>
            
            <div className="prose prose-lg prose-invert max-w-none space-y-12">
              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4 lowercase">1. using utm.one</h2>
                <p className="text-white/60 leading-relaxed mb-3">
                  you must:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>be at least 16 years old</li>
                  <li>provide accurate account information</li>
                  <li>comply with applicable laws</li>
                  <li>not abuse or misuse our platform</li>
                </ul>
                
                <p className="text-muted-foreground leading-relaxed mb-3 mt-6">
                  you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>attempt to bypass rate limits</li>
                  <li>use utm.one for phishing or harmful redirects</li>
                  <li>share accounts</li>
                  <li>reverse engineer the platform</li>
                  <li>store or distribute unlawful content</li>
                </ul>
                
                <p className="text-muted-foreground leading-relaxed mt-6">
                  we reserve the right to suspend accounts for security, abuse, or legal reasons.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">2. your content</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  you own the content you create using utm.one:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>links</li>
                  <li>slugs</li>
                  <li>UTMs</li>
                  <li>QR codes</li>
                  <li>metadata</li>
                  <li>partner data</li>
                  <li>Clean-Track rules</li>
                </ul>
                
                <p className="text-muted-foreground leading-relaxed mt-6">
                  by using our service, you grant us permission to store, process, and display this content to operate the platform.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mt-6 mb-3">
                  you are responsible for ensuring your links do not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>violate copyright</li>
                  <li>lead to malware</li>
                  <li>mislead users</li>
                  <li>violate privacy laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">3. subscriptions & billing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  paid plans renew automatically unless canceled. refunds may be granted at our discretion.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  prices may change, but we'll notify you before they do.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">4. uptime & service level</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  we aim for high availability but cannot guarantee uninterrupted service.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-3 mt-6">
                  we are not liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>outages</li>
                  <li>data loss caused by you</li>
                  <li>third-party failures</li>
                  <li>unavailability due to maintenance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">5. limitation of liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  to the maximum extent allowed by law:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>utm.one is provided "as is"</li>
                  <li>we are not liable for indirect or consequential damages</li>
                  <li>our total liability is limited to the amount you paid in the last 12 months</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">6. acceptable use</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  you may not use utm.one to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>shorten links to harmful or illegal content</li>
                  <li>conduct fraud, scams, or phishing</li>
                  <li>distribute malware</li>
                  <li>impersonate others</li>
                  <li>disrupt or overload our systems</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-6">
                  we may suspend or terminate accounts that violate these rules.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">7. termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  you may close your account at any time. we may terminate accounts that violate these terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-6 mb-3">
                  once terminated:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>your personal data is deleted</li>
                  <li>your links may continue to work (if you set permanence rules)</li>
                  <li>backups may persist briefly for system safety</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">8. governing law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  these terms are governed by the laws of india unless your local laws require otherwise.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">9. changes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  we may update these terms as our product evolves. we'll notify you of significant changes.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">10. contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  for terms-related questions:<br />
                  <a href="mailto:legal@utm.one" className="font-medium text-primary hover:underline">legal@utm.one</a>
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  for abuse reports:<br />
                  <a href="mailto:abuse@utm.one" className="font-medium text-primary hover:underline">abuse@utm.one</a>
                </p>
              </section>

              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground lowercase">
                  last updated: 25 november 2025
                </p>
              </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default TermsLegal;
