import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy - utm.one"
        description="Learn how utm.one collects, uses, and protects your data. Comprehensive privacy policy covering data collection, user rights, and GDPR compliance."
        canonical="https://utm.one/privacy-policy"
        keywords={["privacy policy", "data protection", "GDPR", "user privacy", "utm.one"]}
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 bg-white">
          <div className="max-w-text-content mx-auto px-8 py-24">
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground mb-8 lowercase">
              privacy policy
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              utm.one ("we", "us", "our") provides tools to create, manage, and analyze links, UTMs, QR codes, metadata, and partner attribution.
              we are committed to protecting your privacy and building a product you can trust.
            </p>
            
            <p className="text-base text-muted-foreground leading-relaxed mb-12">
              this privacy policy explains what we collect, why we collect it, and how you can control your data.
            </p>
            
            <div className="prose prose-lg max-w-none space-y-12">
              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">1. what we collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  we collect only what's needed to run the product.
                </p>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 mt-6 lowercase">1.1 account information</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>name</li>
                  <li>email address</li>
                  <li>password (hashed and salted)</li>
                  <li>workspace details</li>
                  <li>subscription information</li>
                </ul>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 mt-6 lowercase">1.2 link & UTM data</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  when you create links, slugs, UTMs, QR codes, metadata, or Clean-Track rules, we store:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>destination URL</li>
                  <li>UTM parameters</li>
                  <li>link settings</li>
                  <li>qr styles</li>
                  <li>metadata fields</li>
                  <li>partner IDs (if used)</li>
                </ul>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 mt-6 lowercase">1.3 analytics data (optional)</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  when someone clicks or scans a link, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>timestamp</li>
                  <li>device type</li>
                  <li>referrer (when available)</li>
                  <li>approximate location (city-level, not precise)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4 font-medium">
                  we never collect:
                </p>
                <ul className="list-none pl-6 space-y-1 text-muted-foreground">
                  <li>❌ precise GPS</li>
                  <li>❌ cookies for visitors</li>
                  <li>❌ sensitive personal information</li>
                </ul>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 mt-6 lowercase">1.4 logs & security</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  for fraud prevention and platform safety:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>IP address (short-term retention)</li>
                  <li>user agent</li>
                  <li>error logs</li>
                  <li>rate limit logs</li>
                </ul>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3 mt-6 lowercase">1.5 billing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  billing is managed by our payment provider (Stripe). we do not store credit card numbers.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">2. how we use your data</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  we use your data to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>operate and improve the product</li>
                  <li>generate analytics for your workspace</li>
                  <li>run Clean-Track rules</li>
                  <li>power link previews and metadata</li>
                  <li>ensure platform safety</li>
                  <li>send transactional emails (verifications, alerts)</li>
                  <li>process billing</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4 font-medium">
                  we do not sell your data.<br />
                  we do not use your data for ads.<br />
                  we do not train external AI models on your content.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">3. how long we keep your data</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>account data → until you delete your account</li>
                  <li>link & UTM data → until you delete or archive</li>
                  <li>logs → 30–90 days</li>
                  <li>backups → automatically rotated per system policy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">4. who we share data with</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  we share data only with essential subprocessors, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>hosting providers</li>
                  <li>database services</li>
                  <li>payment processors</li>
                  <li>email delivery partners</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  we do not share data with advertisers, data brokers, or third-party marketers.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  a full list of subprocessors is available on request.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">5. your rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  depending on where you live (GDPR, CCPA), you may have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>access your data</li>
                  <li>correct your data</li>
                  <li>delete your data</li>
                  <li>export your data</li>
                  <li>opt out of analytics</li>
                  <li>close your account</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  email <a href="mailto:privacy@utm.one" className="text-primary hover:text-primary/80 font-medium">privacy@utm.one</a> for any of these requests.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">6. cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  utm.one uses minimal cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>session cookies (to keep you logged in)</li>
                  <li>security cookies</li>
                  <li>analytics cookies (for workspace owners only)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  we do not use advertising cookies.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">7. data security</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  we take security seriously:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>encryption at rest and in transit</li>
                  <li>hashed passwords</li>
                  <li>role-based access control</li>
                  <li>internal access restrictions</li>
                  <li>continuous monitoring</li>
                  <li>independent audits (as available)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">8. children</h2>
                <p className="text-muted-foreground leading-relaxed">
                  utm.one is not intended for children under 16.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">9. changes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  we may update this policy as our product evolves. we'll notify you when changes are significant.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4 lowercase">10. contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  for privacy questions:<br />
                  <a href="mailto:privacy@utm.one" className="text-primary hover:text-primary/80 font-medium">privacy@utm.one</a>
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  for data requests:<br />
                  <a href="mailto:dpo@utm.one" className="text-primary hover:text-primary/80 font-medium">dpo@utm.one</a>
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

        <Footer />
      </div>
    </>
  );
}
