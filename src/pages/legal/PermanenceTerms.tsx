import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";

const PermanenceTerms = () => {
  return (
    <>
      <SEO
        title="Link Permanence Guarantee Terms - utm.one"
        description="Legal terms for utm.one's link permanence guarantee including 365-day redirect commitment and code release obligations."
        canonical="https://utm.one/legal/permanence-terms"
        keywords={["link permanence", "permanence guarantee", "redirect commitment", "utm.one"]}
      />
      <div className="dark min-h-screen flex flex-col" style={{ background: '#050505' }}>
        <Navigation />
        <FloatingNavigation />
        
        <main className="flex-1">
          <div className="max-w-text-content mx-auto px-8 py-24">
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white mb-8">
              Link Permanence Guarantee
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-12">
              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">1. Commitment to Permanence</h2>
                <p className="text-white/60 leading-relaxed">
                  utm.one commits to maintaining the functionality of all short links created through our platform in perpetuity. This guarantee ensures your links will continue to work even if the utm.one service is discontinued.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">2. Service Discontinuation Protocol</h2>
                <p className="text-white/60 leading-relaxed mb-4">
                  In the unlikely event that utm.one ceases operations, we commit to the following actions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-white/60">
                  <li><strong>Data Release:</strong> Full export of all user data (links, destinations, UTM parameters, analytics) in standard formats (CSV, JSON) available for download.</li>
                  <li><strong>Code Open-Sourcing:</strong> Complete redirect engine codebase will be released under MIT license on GitHub, enabling self-hosting.</li>
                  <li><strong>365-Day Redirect Maintenance:</strong> All existing short links will continue to redirect correctly for a minimum of 365 days after service discontinuation announcement.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">3. Automated Backup Option</h2>
                <p className="text-white/60 leading-relaxed">
                  Users can enable automatic nightly backups to their private GitHub repository. This ensures continuous access to link data and enables instant self-hosting capability if needed.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">4. Self-Hosting Rights</h2>
                <p className="text-white/60 leading-relaxed">
                  All utm.one customers retain the right to self-host the redirect engine using Docker. Documentation and deployment guides are provided for all paid tiers.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">5. Domain Ownership</h2>
                <p className="text-white/60 leading-relaxed">
                  Custom domains configured in utm.one remain under user control. Users retain full DNS control and can redirect their domains to self-hosted instances at any time without utm.one involvement.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">6. Notification Requirements</h2>
                <p className="text-white/60 leading-relaxed mb-4">
                  If utm.one decides to discontinue service, we will provide:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-white/60">
                  <li>Minimum 90 days advance notice via email to all active users</li>
                  <li>Detailed migration guide and self-hosting instructions</li>
                  <li>Technical support throughout the 365-day transition period</li>
                  <li>Public announcement on utm.one homepage and status page</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">7. Legal Enforceability</h2>
                <p className="text-white/60 leading-relaxed">
                  This permanence guarantee is a binding commitment. Users may seek legal remedy if utm.one fails to fulfill these obligations during service discontinuation.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">8. Exclusions</h2>
                <p className="text-white/60 leading-relaxed mb-4">
                  This guarantee does not apply to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-white/60">
                  <li>Links flagged for malware, phishing, or illegal content</li>
                  <li>Links from accounts terminated for Terms of Service violations</li>
                  <li>Links that violate third-party intellectual property rights</li>
                  <li>Links explicitly deleted by the user before discontinuation notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold text-white mb-4">9. Questions</h2>
                <p className="text-white/60 leading-relaxed">
                  For questions about the Link Permanence Guarantee, contact <a href="mailto:legal@utm.one" className="font-medium" style={{ color: 'rgba(59,130,246,1)' }}>legal@utm.one</a>
                </p>
              </section>

              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-white/40">
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

export default PermanenceTerms;
