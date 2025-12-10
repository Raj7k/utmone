import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Users, Building2, Shield, BarChart3, Lock, GitBranch } from "lucide-react";
import { formatText, preserveAcronyms as p } from "@/utils/textFormatter";
import { motion } from "framer-motion";

const Workspaces = () => {
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

  const workflowSteps = [
    {
      icon: Building2,
      title: "Create Client Workspace",
      description: "Set up a new isolated workspace for each client with branded domain.",
    },
    {
      icon: Users,
      title: "Invite Team Members",
      description: "Add client team members with granular role permissions (Admin, Editor, Viewer).",
    },
    {
      icon: Shield,
      title: "Configure Branding",
      description: "Upload client logo, set brand colors, configure custom domain.",
    },
    {
      icon: GitBranch,
      title: "Transfer Ownership",
      description: "When ready, hand off full workspace ownership to client.",
    },
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
      {/* Hero with RetroGradientMesh */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="container px-6 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
              {formatText("one agency.")}
              <br />
              {formatText("infinite clients.")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Manage every client in isolated workspaces with custom branding, permissions, and analytics rollup.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 text-primary">
              get started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <FeatureSection background="default">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            {formatText("The Agency Multi-Client Problem")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-8 text-left">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
              <p className="text-lg text-secondary-label leading-relaxed mb-4">
                <strong className="text-destructive">Before:</strong> Agencies manage client links in one giant workspace.
              </p>
              <ul className="space-y-2 text-secondary-label">
                <li>❌ Client A sees Client B's links</li>
                <li>❌ Analytics mixed together</li>
                <li>❌ Can't hand off workspace ownership</li>
                <li>❌ No per-client branding</li>
              </ul>
            </div>
            <div className="border rounded-xl p-8 bg-primary/5 border-primary/20">
              <p className="text-lg text-label leading-relaxed mb-4">
                <strong className="text-primary">After:</strong> Each client gets isolated workspace.
              </p>
              <ul className="space-y-2 text-label">
                <li>✓ Complete data isolation via RLS</li>
                <li>✓ Client-specific branded domains</li>
                <li>✓ Transfer ownership when ready</li>
                <li>✓ Roll up analytics across all clients</li>
              </ul>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* Capabilities Grid */}
      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            {formatText("What You Get")}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} {...capability} delay={index * 0.1} />
          ))}
        </div>
      </FeatureSection>

      {/* Workflow Timeline */}
      <section className="py-24 md:py-32 bg-mirage relative overflow-hidden">
        <div className="container px-6 mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-white">
            {formatText("How It Works")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {workflowSteps.map((step, index) => (
              <WorkflowStep key={index} {...step} delay={index * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="container px-6 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {formatText("manage every client in one place.")}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start with isolated workspaces, custom branding, and full data separation.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 text-primary">
              get started
            </Button>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default Workspaces;
