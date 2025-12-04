import { SEO } from "@/components/seo/SEO";
import { MainLayout } from "@/components/layout/MainLayout";

const DataSecurity = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="data & security — utm.one"
        description="learn how utm.one protects your data with industry-leading security practices, encryption, and compliance standards"
        canonical="https://utm.one/legal/data-security"
      />
      <main className="min-h-screen">
        <div className="max-w-text-content mx-auto px-8 py-24 md:py-32">
          {/* Header */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-white">
              data & security
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              your data is important. we treat it with the level of care and protection it deserves.
              this page explains how we secure your information when you use utm.one.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Infrastructure */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">1. infrastructure</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• hosted on industry-leading cloud providers (AWS / GCP / Azure equivalent)</li>
                <li>• multi-zone redundancy</li>
                <li>• encrypted traffic via HTTPS/TLS 1.2+</li>
                <li>• encrypted data at rest (AES-256)</li>
                <li>• ddos protection and bot mitigation</li>
              </ul>
            </section>

            {/* Application Security */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">2. application security</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• hashed and salted passwords</li>
                <li>• role-based access control</li>
                <li>• strict rate limiting</li>
                <li>• input sanitization</li>
                <li>• secure redirect validation</li>
                <li>• anti-phishing link scanning</li>
                <li>• signature checking for metadata</li>
              </ul>
            </section>

            {/* Data Isolation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">3. data isolation</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• workspace-level isolation for links, UTMs, QR codes, metadata, and partner data</li>
                <li>• strict permission boundaries</li>
                <li>• audit logs for key changes</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">4. data retention</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• account data → until deleted</li>
                <li>• link data → until you delete or expire links</li>
                <li>• analytics → configurable retention</li>
                <li>• logs → 30–90 days</li>
                <li>• backups → 7–30 day rotating schedule</li>
              </ul>
            </section>

            {/* Incident Response */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">5. incident response</h2>
              <p className="text-muted-foreground">
                we monitor platform health continuously.
                if a breach is detected:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• contain the incident</li>
                <li>• investigate impact</li>
                <li>• notify affected users (per law)</li>
                <li>• provide updates</li>
                <li>• take corrective actions</li>
              </ul>
              <p className="text-muted-foreground">
                we comply with global notification laws (GDPR, CCPA).
              </p>
            </section>

            {/* Compliance */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">6. compliance</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• GDPR-ready</li>
                <li>• CCPA-friendly</li>
                <li>• SOC 2-aligned (in progress)</li>
                <li>• DPIA templates available for enterprise customers</li>
              </ul>
            </section>

            {/* User Responsibility */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">7. user responsibility</h2>
              <p className="text-muted-foreground">you agree to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• use strong passwords</li>
                <li>• protect API keys</li>
                <li>• avoid linking to malicious destinations</li>
                <li>• comply with your local laws</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">8. contact</h2>
              <p className="text-muted-foreground">
                for security reports or disclosures:{" "}
                <a href="mailto:security@utm.one" className="transition-colors" style={{ color: 'rgba(59,130,246,1)' }}>
                  security@utm.one
                </a>
              </p>
              <p className="text-muted-foreground">
                for enterprise compliance needs:{" "}
                <a href="mailto:compliance@utm.one" className="transition-colors" style={{ color: 'rgba(59,130,246,1)' }}>
                  compliance@utm.one
                </a>
              </p>
            </section>
          </div>

          {/* Last Updated */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              last updated: 25 november 2025
            </p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default DataSecurity;
