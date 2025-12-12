import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { Users, Building2, Shield, BarChart3, Lock, GitBranch } from "lucide-react";

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

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="The Multi-Client Problem"
        subheadline="Agencies need complete client isolation—not shared folders"
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Workspace Features"
        subheadline="Everything agencies need to manage multiple clients"
        items={capabilities}
      />

      <FeatureShowcase
        headline="How Workspaces Work"
        subheadline="Simple workflow from setup to handoff"
        background="muted"
      >
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Create Workspace", desc: "Set up isolated environment for each client" },
            { step: "2", title: "Configure Branding", desc: "Add client logo, colors, and custom domain" },
            { step: "3", title: "Invite Team", desc: "Add client team members with role permissions" },
            { step: "4", title: "Transfer Ownership", desc: "Hand off full workspace ownership when ready" },
          ].map((item) => (
            <div key={item.step} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                {item.step}
              </div>
              <h3 className="font-sans font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="manage every client in one place."
        subheadline="Start with isolated workspaces, custom branding, and full data separation."
      />
    </FeatureLayout>
  );
};

export default Workspaces;
