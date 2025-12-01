import { Link } from "react-router-dom";
import { Shield, Lock, Database, Eye, FileCheck, AlertTriangle, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

export default function Trust() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Security & Trust - utm.one"
        description="Enterprise-grade security with field-level encryption, comprehensive audit logs, and GDPR compliance built into utm.one."
        canonical="https://utm.one/trust"
      />
      <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border/40 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Security Portal
          </Badge>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 brand-lowercase">
            enterprise-grade security, by default.
          </h1>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            utm.one is built on zero-trust architecture with field-level encryption, comprehensive audit logs, and GDPR compliance.
          </p>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Infrastructure Security */}
            <Card className="p-8">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 brand-lowercase">
                infrastructure security
              </h3>
              <div className="space-y-3 text-secondary-label">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>AWS/GCP multi-region deployment with 99.9% uptime SLA</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>SOC 2 Type II compliance in progress</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>DDoS protection and rate limiting on all endpoints</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Automated daily backups with 30-day retention</p>
                </div>
              </div>
            </Card>

            {/* Data Encryption */}
            <Card className="p-8">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 brand-lowercase">
                data encryption
              </h3>
              <div className="space-y-3 text-secondary-label">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>AES-256 encryption at rest for all sensitive data</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>TLS 1.3 encryption in transit</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Field-level encryption for API tokens and secrets</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Encryption keys stored in hardware security modules</p>
                </div>
              </div>
            </Card>

            {/* GDPR Compliance */}
            <Card className="p-8">
              <Database className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 brand-lowercase">
                gdpr compliance
              </h3>
              <div className="space-y-3 text-secondary-label">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>EU data residency options available</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Right to deletion and data export</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Configurable data retention policies (7-365 days)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Standard Data Processing Agreement available</p>
                </div>
              </div>
            </Card>

            {/* Fraud Guard */}
            <Card className="p-8">
              <Eye className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 brand-lowercase">
                fraud guard
              </h3>
              <div className="space-y-3 text-secondary-label">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Real-time bot detection and blocking</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>IP-based rate limiting (1000 requests/minute)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Suspicious pattern detection with ML models</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Automated alerting for anomalous traffic</p>
                </div>
              </div>
            </Card>

            {/* Link Security */}
            <Card className="p-8">
              <FileCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 brand-lowercase">
                link security
              </h3>
              <div className="space-y-3 text-secondary-label">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>SSL/TLS validation on all destination URLs</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>VirusTotal integration for malware scanning</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Google Safe Browsing blacklist checks</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Real-time threat badges on link previews</p>
                </div>
              </div>
            </Card>

            {/* Audit Logs */}
            <Card className="p-8">
              <AlertTriangle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-4 brand-lowercase">
                audit logs
              </h3>
              <div className="space-y-3 text-secondary-label">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Comprehensive logging of all admin actions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Before/after diffs for configuration changes</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>IP address and user agent tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>365-day log retention for compliance</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Documentation Links */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6 brand-lowercase">
            security documentation
          </h2>
          <p className="text-lg text-secondary-label mb-8">
            For detailed technical documentation, review our comprehensive security policies.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/legal/data-security" className="text-primary hover:underline font-medium">
              Data & Security Policy →
            </Link>
            <Link to="/legal/dpa" className="text-primary hover:underline font-medium">
              Data Processing Agreement →
            </Link>
            <Link to="/legal/subprocessors" className="text-primary hover:underline font-medium">
              Subprocessors List →
            </Link>
            <Link to="/status" className="text-primary hover:underline font-medium">
              System Status →
            </Link>
          </div>
        </div>
      </section>
    </div>
    </MainLayout>
  );
}
