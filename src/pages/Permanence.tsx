import { Shield, GitBranch, Server, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

const Permanence = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Permanence Guarantee - utm.one"
        description="A legal commitment that your links work forever. utm.one ensures your short links remain functional in perpetuity."
        canonical="https://utm.one/permanence"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
            <Shield className="w-4 h-4" />
            Permanence Guarantee
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 hero-gradient">
            your links will never break
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            A legal commitment that your links work forever, even if utm.one shuts down.
          </p>
        </div>
      </section>

      {/* The Guarantee */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-12 text-foreground text-center">
            The Guarantee
          </h2>
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-lg leading-relaxed mb-6">
              We, utm.one, legally commit to ensuring your short links remain functional in perpetuity. This is not marketing language—it is a binding guarantee backed by three technical safeguards.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              In the event utm.one ceases operations, we will:
            </p>
            <ol className="space-y-4 text-lg">
              <li><strong>Release your data</strong> - Complete link database export (JSON/CSV) with all UTM parameters, click analytics, and redirect mappings</li>
              <li><strong>Open-source the redirect engine</strong> - Full Docker image of utm.one's redirect service for self-hosting on your infrastructure</li>
              <li><strong>Maintain redirects for 365 days</strong> - Minimum 1-year redirect service post-shutdown to give you migration time</li>
            </ol>
            <p className="text-lg leading-relaxed mt-6">
              This guarantee is enforceable under contract law in the jurisdiction of your workspace registration.
            </p>
          </div>
        </div>
      </section>

      {/* Three Safeguards */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-16 text-foreground text-center">
            Three Technical Safeguards
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <GitBranch className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
                Auto-Backup to GitHub
              </h2>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Nightly automated backups of your entire link database to your private GitHub repository. You own the data.
              </p>
              <Link to="/settings/backups">
                <Button variant="outline" className="w-full">
                  Configure Backup
                </Button>
              </Link>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Server className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
                Self-Hosting Option
              </h2>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Deploy utm.one's redirect engine on your own infrastructure using Docker. Zero vendor lock-in.
              </p>
              <a href="https://github.com/utm-one/self-hosted" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  View Docker Setup
                </Button>
              </a>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <CheckCircle2 className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
                Legal Commitment
              </h2>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Contractual obligation to maintain redirects for 365 days post-shutdown and release all source code.
              </p>
              <Link to="/legal/permanence-terms">
                <Button variant="outline" className="w-full">
                  Read Legal Terms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl font-bold mb-12 text-foreground text-center">
            Why This Matters
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                1
              </div>
              <div>
                <h2 className="font-display text-xl font-bold mb-2 text-foreground">
                  Campaigns Outlive Platforms
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Your QR codes on packaging, print ads, and conference materials can't be updated. Links must work for years.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                2
              </div>
              <div>
                <h2 className="font-display text-xl font-bold mb-2 text-foreground">
                  Trust Requires Transparency
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Other shorteners can disappear overnight. We publish our shutdown plan before you need it.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                3
              </div>
              <div>
                <h2 className="font-display text-xl font-bold mb-2 text-foreground">
                  Enterprise Requires Accountability
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Legal teams demand enforceable SLAs. This guarantee passes procurement review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-6 text-foreground">
            Build on a Foundation You Can Trust
          </h2>
          <p className="text-xl mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Start creating links that outlast platforms.
          </p>
          <Link to="/early-access">
            <Button size="lg" className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform">
              Get Early Access
            </Button>
          </Link>
        </div>
      </section>
    </div>
    </MainLayout>
  );
};

export default Permanence;
