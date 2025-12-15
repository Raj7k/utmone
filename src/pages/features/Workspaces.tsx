import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { WorkspaceSwitcherDemo } from "@/components/features/visuals/WorkspaceSwitcherDemo";
import { Users, Building2, Shield, BarChart3, Lock, GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Workspaces = () => {
  const stats = [
    { value: "∞", label: "Client Workspaces" },
    { value: "100%", label: "Data Isolation" },
    { value: "1-click", label: "Ownership Transfer" },
    { value: "RLS", label: "Security Enforced" },
  ];

  const capabilities = [
    {
      icon: Building2,
      title: "Isolated Client Environments",
      description: "Each workspace is completely isolated with separate links, domains, and analytics.",
    },
    {
      icon: Lock,
      title: "Client-Specific Permissions",
      description: "Control exactly what each client can see and do within their workspace.",
    },
    {
      icon: Users,
      title: "Branded Per Client",
      description: "Custom domains, logos, and colors for each client workspace.",
    },
    {
      icon: BarChart3,
      title: "Cross-Workspace Analytics",
      description: "Roll up analytics across all client workspaces from one view.",
    },
    {
      icon: GitBranch,
      title: "Client Handoff",
      description: "Transfer workspace ownership to clients when ready.",
    },
    {
      icon: Shield,
      title: "Data Isolation",
      description: "RLS-enforced data boundaries prevent any cross-workspace leakage.",
    },
  ];

  const comparisonItems = [
    { feature: "Client data access", before: "Client A sees Client B's links", after: "Complete data isolation" },
    { feature: "Analytics", before: "All clients mixed together", after: "Per-client + rollup views" },
    { feature: "Ownership transfer", before: "Not possible", after: "One-click handoff" },
    { feature: "Branding", before: "One brand for all", after: "Custom domain per workspace" },
    { feature: "Permissions", before: "All or nothing", after: "Granular role-based access" },
    { feature: "Security", before: "Trust-based separation", after: "RLS-enforced boundaries" },
  ];

  const workflowSteps = [
    { step: "1", title: "Create Workspace", desc: "Set up isolated environment for each client" },
    { step: "2", title: "Configure Branding", desc: "Add client logo, colors, and custom domain" },
    { step: "3", title: "Invite Team", desc: "Add client team members with role permissions" },
    { step: "4", title: "Transfer Ownership", desc: "Hand off full workspace ownership when ready" },
  ];

  return (
    <FeatureLayout
      title="Multi-Client Workspaces - utm.one"
      description="Manage multiple clients with isolated workspaces, custom branding, and granular permissions."
      canonical="https://utm.one/features/workspaces"
      keywords={["multi-client workspaces", "agency workspace management", "client isolation", "white label"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Workspaces", url: "https://utm.one/features/workspaces" },
      ]}
    >
      <FeatureHero
        headline="one agency. infinite clients."
        subheadline="Manage every client in isolated workspaces with custom branding, permissions, and analytics rollup. Complete data isolation via RLS."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "see pricing", href: "/pricing" }}
      />

      {/* Interactive Demo Widget */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              switch clients instantly
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One click to switch between completely isolated client workspaces
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <WorkspaceSwitcherDemo />
          </motion.div>
        </div>
      </section>

      <FeatureStatsStrip stats={stats} />

      {/* How It Works - Visual Workflow */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              from setup to handoff
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The complete workflow for managing client workspaces
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-xl p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-sans font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-5 w-4 h-4 text-muted-foreground -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureBeforeAfter
        headline="The Multi-Client Problem"
        subheadline="Agencies need complete client isolation—not shared folders"
        items={comparisonItems}
      />

      {/* Security Highlight */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <Shield className="w-4 h-4" />
                Enterprise-Grade Security
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                RLS-enforced isolation
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Unlike folder-based "workspaces" that rely on application logic, utm.one uses Row-Level Security (RLS) 
                at the database level. This means data isolation is cryptographically enforced—not just hoped for.
              </p>
              <ul className="space-y-4">
                {[
                  "Every query automatically scoped to workspace",
                  "Impossible to accidentally expose client data",
                  "Audit trail for all cross-workspace actions",
                  "Compliant with enterprise security requirements",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Security visualization */}
              <div className="relative p-8 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.03]">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                  }} />
                </div>
                
                <div className="space-y-4">
                  {/* Database layers */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40 mb-2">PostgreSQL + RLS</p>
                    <code className="text-xs text-emerald-400 font-mono">
                      SELECT * FROM links WHERE workspace_id = auth.workspace_id()
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-white/40">Automatic scope enforcement</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {["Acme Corp", "Globex", "Initech"].map((client, i) => (
                      <div key={client} className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                        <Lock className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <p className="text-xs text-white/60">{client}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FeatureBentoGrid
        headline="Workspace Features"
        subheadline="Everything agencies need to manage multiple clients"
        items={capabilities}
      />

      <FeatureFinalCTA
        headline="manage every client in one place."
        subheadline="Start with isolated workspaces, custom branding, and full data separation."
      />
    </FeatureLayout>
  );
};

export default Workspaces;