import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

const Subprocessors = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="subprocessors — utm.one"
        description="list of third-party service providers utm.one uses to operate the platform"
        canonical="https://utm.one/legal/subprocessors"
      />
      <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
        <div className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-white">subprocessors list</h1>
          <p className="text-lg text-white/60 leading-relaxed">utm.one uses third-party providers ("subprocessors") to run the platform.</p>
        </div>

        <div className="space-y-12 text-white/60">
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">infrastructure</h2>
            <p>AWS / GCP / Azure — hosting, databases</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">email</h2>
            <p>sendgrid / postmark — transactional email</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-white">payment</h2>
            <p>stripe — billing & subscription management</p>
          </section>
          <section className="space-y-4 pt-8 border-t border-white/10">
            <p>we update this list when subprocessors change. email <a href="mailto:privacy@utm.one" className="text-primary hover:text-primary/80 transition-colors">privacy@utm.one</a></p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40">last updated: 25 november 2025</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subprocessors;