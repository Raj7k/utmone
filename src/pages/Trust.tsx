import { Link } from "react-router-dom";
import { Shield, Lock, Database, Eye, FileCheck, AlertTriangle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { preserveAcronyms as p } from "@/utils/textFormatter";

export default function Trust() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Security & Trust - utm.one"
        description="Enterprise-grade security with field-level encryption, comprehensive audit logs, and GDPR compliance built into utm.one."
        canonical="https://utm.one/trust"
      />
      <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20">
            Security Portal
          </Badge>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 hero-gradient">
            enterprise-grade security, by default.
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/50">
            {p("utm.one is built on zero-trust architecture with field-level encryption, comprehensive audit logs, and GDPR compliance.")}
          </p>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Infrastructure Security */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Shield className="h-12 w-12 mb-4 text-white/80" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                infrastructure security
              </h3>
              <div className="space-y-3 text-white/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>AWS/GCP multi-region deployment with 99.9% uptime SLA</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>SOC 2 Type II compliance in progress</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>DDoS protection and rate limiting on all endpoints</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Automated daily backups with 30-day retention</p>
                </div>
              </div>
            </div>

            {/* Data Encryption */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Lock className="h-12 w-12 mb-4 text-white/80" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                data encryption
              </h3>
              <div className="space-y-3 text-white/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>AES-256 encryption at rest for all sensitive data</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>TLS 1.3 encryption in transit</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Field-level encryption for API tokens and secrets</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Encryption keys stored in hardware security modules</p>
                </div>
              </div>
            </div>

            {/* GDPR Compliance */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Database className="h-12 w-12 mb-4 text-white/80" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">{p("GDPR compliance")}</h3>
              <div className="space-y-3 text-white/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>EU data residency options available</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Right to deletion and data export</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Configurable data retention policies (7-365 days)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Standard Data Processing Agreement available</p>
                </div>
              </div>
            </div>

            {/* Fraud Guard */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <Eye className="h-12 w-12 mb-4 text-white/80" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                fraud guard
              </h3>
              <div className="space-y-3 text-white/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Real-time bot detection and blocking</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>IP-based rate limiting (1000 requests/minute)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Suspicious pattern detection with ML models</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Automated alerting for anomalous traffic</p>
                </div>
              </div>
            </div>

            {/* Link Security */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <FileCheck className="h-12 w-12 mb-4 text-white/80" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                link security
              </h3>
              <div className="space-y-3 text-white/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>SSL/TLS validation on all destination URLs</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>VirusTotal integration for malware scanning</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Google Safe Browsing blacklist checks</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Real-time threat badges on link previews</p>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <AlertTriangle className="h-12 w-12 mb-4 text-white/80" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                audit logs
              </h3>
              <div className="space-y-3 text-white/50">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Comprehensive logging of all admin actions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>Before/after diffs for configuration changes</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>IP address and user agent tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/70" />
                  <p>365-day log retention for compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Links */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-6 hero-gradient">
            security documentation
          </h2>
          <p className="text-lg mb-8 text-white/50">
            For detailed technical documentation, review our comprehensive security policies.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/legal/data-security" className="text-white/80 hover:text-white hover:underline font-medium transition-colors">
              Data & Security Policy →
            </Link>
            <Link to="/legal/dpa" className="text-white/80 hover:text-white hover:underline font-medium transition-colors">
              Data Processing Agreement →
            </Link>
            <Link to="/legal/subprocessors" className="text-white/80 hover:text-white hover:underline font-medium transition-colors">
              Subprocessors List →
            </Link>
            <Link to="/status" className="text-white/80 hover:text-white hover:underline font-medium transition-colors">
              System Status →
            </Link>
          </div>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}