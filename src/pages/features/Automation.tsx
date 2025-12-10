import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Zap, Webhook, RefreshCw, Calendar, Code, Workflow } from "lucide-react";
import { formatText } from "@/utils/textFormatter";
import { motion } from "framer-motion";

const Automation = () => {
  const capabilities = [
    {
      icon: Zap,
      title: "Zapier/Make Integration",
      description: "Trigger actions in 5,000+ apps when links are created or clicked.",
    },
    {
      icon: Webhook,
      title: "Webhook Triggers",
      description: "Send real-time HTTP callbacks to your endpoints on every click.",
    },
    {
      icon: RefreshCw,
      title: "Bulk Operations",
      description: "Update UTM params, archive links, or change destinations in bulk.",
    },
    {
      icon: Calendar,
      title: "Scheduled Link Creation",
      description: "Auto-generate campaign links at specific dates/times.",
    },
    {
      icon: Code,
      title: "Auto-UTM Rules",
      description: "Define templates that auto-populate UTM params based on patterns.",
    },
    {
      icon: Workflow,
      title: "Campaign Workflows",
      description: "Chain actions: create link → generate QR → send Slack alert.",
    },
  ];

  const workflowSteps = [
    {
      icon: Zap,
      title: "Connect Integration",
      description: "Link utm.one to Zapier, Make, or configure webhook endpoints.",
    },
    {
      icon: Webhook,
      title: "Define Trigger",
      description: "Choose when automation runs (link created, link clicked, daily schedule).",
    },
    {
      icon: Workflow,
      title: "Configure Actions",
      description: "Set what happens (send to Slack, create task in Asana, log to CRM).",
    },
    {
      icon: RefreshCw,
      title: "Test & Activate",
      description: "Run test events, verify webhooks, then activate workflow.",
    },
  ];

  return (
    <FeatureLayout
      title="Automation & Integrations - utm.one"
      description="Zapier, webhooks, bulk operations, scheduled link creation, and auto-UTM rules."
      canonical="https://utm.one/features/automation"
      keywords={["automation", "zapier integration", "webhooks", "bulk operations", "workflow automation"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Automation", url: "https://utm.one/features/automation" },
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
              {formatText("automation that")}
              <br />
              {formatText("just works.")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Zapier, webhooks, bulk operations, and scheduled workflows. Stop repeating yourself.
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
            {formatText("The Manual Work Problem")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-8 text-left">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
              <p className="text-lg text-secondary-label leading-relaxed mb-4">
                <strong className="text-destructive">Before:</strong> Repeat the same tasks every campaign.
              </p>
              <ul className="space-y-2 text-secondary-label">
                <li>❌ Manually create links one-by-one</li>
                <li>❌ Copy/paste UTM params into spreadsheets</li>
                <li>❌ Send Slack alerts manually when traffic spikes</li>
                <li>❌ Update hundreds of links when campaign changes</li>
              </ul>
            </div>
            <div className="border rounded-xl p-8 bg-primary/5 border-primary/20">
              <p className="text-lg text-label leading-relaxed mb-4">
                <strong className="text-primary">After:</strong> Workflows run automatically.
              </p>
              <ul className="space-y-2 text-label">
                <li>✓ Zapier creates links when campaign launches</li>
                <li>✓ Webhooks log clicks to your CRM in real-time</li>
                <li>✓ Bulk update 500 links in seconds</li>
                <li>✓ Slack alerts fire when traffic anomalies detected</li>
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

      {/* Use Case Examples */}
      <FeatureSection background="default">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            {formatText("Popular Automation Workflows")}
          </h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-display font-semibold mb-2 text-label">Campaign Launch Automation</h3>
            <p className="text-secondary-label mb-4">When new campaign added to Airtable → Create 20 branded links with pre-filled UTMs → Send to Slack.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Zapier</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Airtable</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Slack</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-display font-semibold mb-2 text-label">Real-Time CRM Updates</h3>
            <p className="text-secondary-label mb-4">When high-value prospect clicks link → Send webhook to HubSpot → Create task for sales rep.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Webhooks</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">HubSpot</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-display font-semibold mb-2 text-label">Weekly Report Delivery</h3>
            <p className="text-secondary-label mb-4">Every Monday at 9am → Export analytics → Send white-label PDF to clients via email.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Scheduled</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Email</span>
            </div>
          </div>
        </div>
      </FeatureSection>

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
              {formatText("stop repeating yourself.")}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Connect utm.one to Zapier, webhooks, and 5,000+ apps to automate everything.
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

export default Automation;
