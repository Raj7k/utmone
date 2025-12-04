import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

const SupportPolicy = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="support policy — utm.one"
        description="learn about utm.one's support channels, response times, and coverage for different plan tiers"
        canonical="https://utm.one/legal/support"
      />
      <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
        <div className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-white">support policy</h1>
          <p className="text-lg text-white/60 leading-relaxed">utm.one provides support to help you use the platform smoothly.</p>
        </div>

        <div className="space-y-12 text-white/60">
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">1. support channels</h2>
            <div className="space-y-3">
              <p>email support: <a href="mailto:support@utm.one" className="transition-colors" style={{ color: 'rgba(59,130,246,1)' }}>support@utm.one</a></p>
              <p>security issues: <a href="mailto:security@utm.one" className="transition-colors" style={{ color: 'rgba(59,130,246,1)' }}>security@utm.one</a></p>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">2. response times</h2>
            <ul className="space-y-2">
              <li>• free plan → 48–72 hours</li>
              <li>• pro plan → 24–48 hours</li>
              <li>• business → same business day</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">last updated: 25 november 2025</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SupportPolicy;