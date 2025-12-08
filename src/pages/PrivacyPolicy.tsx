import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

export default function PrivacyPolicy() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="Privacy Policy - utm.one"
        description="Learn how utm.one collects, uses, and protects your data. Comprehensive privacy policy covering data collection, user rights, and GDPR compliance."
        canonical="https://utm.one/privacy-policy"
        keywords={["privacy policy", "data protection", "GDPR", "user privacy", "utm.one"]}
      />
      <div className="max-w-text-content mx-auto px-8 py-24">
        <h1 className="text-5xl md:text-6xl font-display font-bold hero-gradient mb-8 lowercase">
          privacy policy
        </h1>
        
        <p className="text-lg text-white/60 leading-relaxed mb-12">
          utm.one ("we", "us", "our") provides tools to create, manage, and analyze links, UTMs, QR codes, metadata, and partner attribution.
          we are committed to protecting your privacy and building a product you can trust.
        </p>
        
        <div className="prose prose-lg max-w-none space-y-12">
          <section>
            <h2 className="text-3xl font-display font-bold text-white mb-4 lowercase">1. what we collect</h2>
            <p className="text-white/60 leading-relaxed mb-4">we collect only what's needed to run the product.</p>
            <h3 className="text-xl font-display font-semibold text-white mb-3 mt-6 lowercase">1.1 account information</h3>
            <ul className="list-disc pl-6 space-y-2 text-white/60">
              <li>name</li>
              <li>email address</li>
              <li>password (hashed and salted)</li>
              <li>workspace details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-display font-bold text-white mb-4 lowercase">2. how we use your data</h2>
            <ul className="list-disc pl-6 space-y-2 text-white/60">
              <li>operate and improve the product</li>
              <li>generate analytics for your workspace</li>
              <li>ensure platform safety</li>
              <li>send transactional emails</li>
            </ul>
            <p className="text-white/60 leading-relaxed mt-4 font-medium">
              we do not sell your data. we do not use your data for ads.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-display font-bold text-white mb-4 lowercase">3. your rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-white/60">
              <li>access your data</li>
              <li>correct your data</li>
              <li>delete your data</li>
              <li>export your data</li>
            </ul>
            <p className="text-white/60 leading-relaxed mt-4">
              email <a href="mailto:privacy@utm.one" className="hover:opacity-80 font-medium text-white/80">privacy@utm.one</a> for any requests.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-display font-bold text-white mb-4 lowercase">4. contact</h2>
            <p className="text-white/60 leading-relaxed">
              for privacy questions: <a href="mailto:privacy@utm.one" className="hover:opacity-80 font-medium text-white/80">privacy@utm.one</a>
            </p>
          </section>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/40 lowercase">last updated: 25 november 2025</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}