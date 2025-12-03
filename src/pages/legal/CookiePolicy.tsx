import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

const CookiePolicy = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="cookie policy — utm.one"
        description="learn about the minimal cookies utm.one uses for essential functionality, security, and workspace analytics"
        canonical="https://utm.one/legal/cookies"
      />
      <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
        {/* Header */}
        <div className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-white">
            cookie policy
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            utm.one uses minimal cookies to operate the service.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Types of Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">1. types of cookies we use</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">strictly necessary cookies</h3>
                <p className="text-white/60">
                  used for login, sessions, and workspace access.
                  without these, the product won't work.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">security cookies</h3>
                <p className="text-white/60">
                  used for fraud detection, abuse prevention, and rate limiting.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">analytics cookies</h3>
                <p className="text-white/60">
                  used only to give workspace owners insights into link performance.
                  these do not track your visitors across other websites.
                </p>
              </div>
            </div>
          </section>

          {/* What We Don't Use */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">2. what we don't use</h2>
            <p className="text-white/60">we do not use:</p>
            <ul className="space-y-2 text-white/60">
              <li>❌ advertising cookies</li>
              <li>❌ third-party tracking cookies</li>
              <li>❌ behavioral ads</li>
              <li>❌ cross-site trackers</li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">3. managing cookies</h2>
            <p className="text-white/60">
              you can disable cookies in your browser, but some features may not work.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">4. contact</h2>
            <p className="text-white/60">
              questions?{" "}
              <a href="mailto:privacy@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                privacy@utm.one
              </a>
            </p>
          </section>
        </div>

        {/* Last Updated */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">
            last updated: 25 november 2025
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicy;