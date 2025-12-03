import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

const DPA = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="data processing agreement — utm.one"
        description="GDPR-compliant data processing agreement outlining how utm.one processes personal data on your behalf"
        canonical="https://utm.one/legal/dpa"
      />
      <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
        <div className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-white">
            data processing agreement
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            this data processing agreement ("DPA") governs how utm.one processes personal data on your behalf.
          </p>
        </div>

        <div className="space-y-12 text-white/60">
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">1. roles</h2>
            <ul className="space-y-2">
              <li>• customer = data controller</li>
              <li>• utm.one = data processor</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">2. purpose</h2>
            <p>we process data solely to:</p>
            <ul className="space-y-2">
              <li>• operate the platform</li>
              <li>• provide analytics to you</li>
              <li>• manage your workspace</li>
              <li>• ensure security</li>
              <li>• provide support</li>
              <li>• comply with law</li>
            </ul>
            <p className="mt-4">we do not process your data for advertising or profiling.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">3. security measures</h2>
            <p>we implement:</p>
            <ul className="space-y-2">
              <li>• encryption at rest and in transit</li>
              <li>• access control</li>
              <li>• continuous monitoring</li>
              <li>• incident response</li>
              <li>• regular backups</li>
              <li>• data isolation</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">4. contact</h2>
            <p>
              <a href="mailto:dpo@utm.one" className="text-primary hover:text-primary/80 transition-colors">
                dpo@utm.one
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">last updated: 25 november 2025</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default DPA;