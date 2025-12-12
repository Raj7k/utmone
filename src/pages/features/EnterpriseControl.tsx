import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { motion } from "framer-motion";
import { Shield, Users, GitBranch, UserCheck, Clock, FileText, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const EnterpriseControl = () => {
  const carouselItems = [
    {
      title: "Role-Based Access",
      description: "Granular permissions for editors, approvers, and admins with workspace-level control.",
      icon: Users,
    },
    {
      title: "Approval Workflows",
      description: "Multi-level review chains. Editors create, reviewers approve, admins deploy.",
      icon: GitBranch,
    },
    {
      title: "Complete Audit Trail",
      description: "Every modification logged with who, what, when, and why. Compliance-ready.",
      icon: FileText,
    },
    {
      title: "Link Ownership",
      description: "Clear accountability with assigned owners. Know who's responsible for every link.",
      icon: UserCheck,
    },
    {
      title: "Change History",
      description: "Track every edit, rollback when needed. Full version control for your links.",
      icon: Clock,
    },
    {
      title: "Workspace Governance",
      description: "Set naming rules, UTM standards, and approval requirements at the org level.",
      icon: Shield,
    },
  ];

  const stats = [
    { value: "100%", label: "Audit Coverage", suffix: "" },
    { value: "5", label: "Role Levels", suffix: "" },
    { value: "<2", label: "Min Approval Time", suffix: "min" },
    { value: "0", label: "Compliance Gaps", suffix: "" },
  ];

  const beforeAfterItems = [
    { feature: "Link Creation", before: "Anyone creates anything", after: "Controlled by role permissions" },
    { feature: "UTM Standards", before: "Inconsistent naming", after: "Enforced governance rules" },
    { feature: "Change Tracking", before: "No visibility", after: "Complete audit log" },
    { feature: "Approval Process", before: "No review", after: "Multi-level workflows" },
    { feature: "Team Velocity", before: "Slow due to manual checks", after: "Fast with automated guardrails" },
  ];

  const capabilities = [
    {
      icon: Users,
      title: "Team Management",
      features: ["Invite members", "Assign roles", "Workspace isolation", "SSO integration"],
    },
    {
      icon: GitBranch,
      title: "Approval Chains",
      features: ["Multi-level review", "Slack notifications", "Email alerts", "Auto-escalation"],
    },
    {
      icon: Shield,
      title: "Security Controls",
      features: ["2FA enforcement", "IP allowlisting", "Session management", "API key rotation"],
    },
    {
      icon: FileText,
      title: "Compliance",
      features: ["SOC 2 ready", "GDPR compliant", "Audit exports", "Retention policies"],
    },
  ];

  return (
    <FeatureLayout
      title="Enterprise Control - Governance Without Friction - utm.one"
      description="Control over links, UTMs, permissions, and audit trails — without slowing your team down."
      canonical="https://utm.one/features/governance"
      keywords={["enterprise link management", "governance", "team permissions", "audit trails"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Enterprise Control", url: "https://utm.one/features/governance" },
      ]}
    >
      <FeatureHero
        headlineLine1="governance without"
        headlineLine2="slowing your team."
        subheadline="Control links, UTMs, permissions, and metadata — with guardrails that are invisible to your team."
      />

      <FeatureCarouselSection
        headline="Enterprise-Grade Control"
        subheadline="Everything enterprises need. Nothing they don't."
        items={carouselItems}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="From Chaos to Control"
        subheadline="See the transformation"
        items={beforeAfterItems}
      />

      <FeatureShowcase
        headline="Approval Workflow"
        subheadline="Review and approve before anything goes live"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: appleEase }}
            className="relative"
          >
            <div className="bg-muted/30 rounded-2xl p-6 border border-border h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Editor Creates</h3>
              <p className="text-sm text-muted-foreground">
                Team members create links with all required fields and UTM parameters.
              </p>
              <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Pending approval</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: appleEase }}
            className="relative"
          >
            <div className="bg-muted/30 rounded-2xl p-6 border border-border h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Reviewer Approves</h3>
              <p className="text-sm text-muted-foreground">
                Designated reviewers verify links meet brand and governance standards.
              </p>
              <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3 text-primary" />
                  <span>Under review</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: appleEase }}
            className="relative"
          >
            <div className="bg-muted/30 rounded-2xl p-6 border border-border h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Admin Deploys</h3>
              <p className="text-sm text-muted-foreground">
                Approved links go live. Full audit trail recorded automatically.
              </p>
              <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-xs text-primary">
                  <CheckCircle className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </FeatureShowcase>

      <FeatureBentoGrid
        headline="Built for Enterprise Scale"
        subheadline="Every capability your security team will love"
        capabilities={capabilities}
      />

      <FeatureShowcase
        headline="Complete Audit Trail"
        subheadline="Every action logged. Every change tracked."
        background="muted"
      >
        <div className="bg-background/50 rounded-xl border border-border overflow-hidden">
          {/* Audit log mockup */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Audit Log</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {[
              { action: "Link created", user: "sarah@company.com", time: "2 min ago", icon: "+" },
              { action: "Approved by reviewer", user: "mike@company.com", time: "5 min ago", icon: "✓" },
              { action: "UTM updated", user: "sarah@company.com", time: "1 hour ago", icon: "~" },
              { action: "Permission changed", user: "admin@company.com", time: "2 hours ago", icon: "⚙" },
            ].map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: appleEase }}
                className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                    {log.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="Ready for Enterprise Control?"
        subheadline="Give your team governance without friction."
        primaryCTA={{ label: "Book a Demo", href: "/book-demo" }}
        secondaryCTA={{ label: "See Pricing", href: "/pricing" }}
      />
    </FeatureLayout>
  );
};

export default EnterpriseControl;
