import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, Mail, Calendar, BarChart2, FileText } from "lucide-react";
import { formatText, preserveAcronyms as p } from "@/utils/textFormatter";
import { motion } from "framer-motion";

const Reporting = () => {
  const capabilities = [
    {
      icon: FileDown,
      title: "One-Click PDF/CSV Export",
      description: "Export all analytics data instantly in multiple formats.",
    },
    {
      icon: FileText,
      title: "White-Label Client Reports",
      description: "Branded PDF reports with your agency logo and colors.",
    },
    {
      icon: Mail,
      title: "Scheduled Email Reports",
      description: "Automate weekly/monthly reports sent to stakeholders.",
    },
    {
      icon: Calendar,
      title: "Custom Date Ranges",
      description: "Export data for any time period (last 7 days, last quarter, custom).",
    },
    {
      icon: BarChart2,
      title: "Executive Dashboards",
      description: "High-level KPI summary reports for C-suite stakeholders.",
    },
    {
      icon: FileSpreadsheet,
      title: "Raw Data Downloads",
      description: "Full click-level CSV exports for custom analysis in Excel.",
    },
  ];

  const workflowSteps = [
    {
      icon: FileText,
      title: "Select Report Type",
      description: "Choose from Executive Summary, Campaign Report, or Full Analytics Export.",
    },
    {
      icon: Calendar,
      title: "Configure Date Range",
      description: "Pick last 7 days, last 30 days, quarter, or custom range.",
    },
    {
      icon: BarChart2,
      title: "Apply Branding",
      description: "Add your logo, colors, and agency branding for white-label client reports.",
    },
    {
      icon: FileDown,
      title: "Download or Schedule",
      description: "Export instantly or schedule automatic weekly/monthly email delivery.",
    },
  ];

  return (
    <FeatureLayout
      title="Analytics Reporting & Exports - utm.one"
      description="One-click PDF/CSV exports, white-label client reports, and scheduled email reports."
      canonical="https://utm.one/features/reporting"
      keywords={["analytics reporting", "pdf export", "csv export", "white label reports", "scheduled reports"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Reporting", url: "https://utm.one/features/reporting" },
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 lowercase">
              {formatText("reporting without")}
              <br />
              {formatText("spreadsheet hell.")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              One-click PDF exports, white-label client reports, and scheduled email delivery.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 lowercase text-primary">
              get started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <FeatureSection background="default">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            {formatText("The Client Reporting Problem")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-8 text-left">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8">
              <p className="text-lg text-secondary-label leading-relaxed mb-4">
                <strong className="text-destructive">Before:</strong> Spend hours every week copying data into spreadsheets.
              </p>
              <ul className="space-y-2 text-secondary-label">
                <li>❌ Manual data entry from analytics dashboards</li>
                <li>❌ Formatting reports in PowerPoint/Excel</li>
                <li>❌ Sending updated reports to clients manually</li>
                <li>❌ No consistent report template</li>
              </ul>
            </div>
            <div className="rounded-xl p-8 bg-primary/5 border border-primary/20">
              <p className="text-lg text-label leading-relaxed mb-4">
                <strong className="text-primary">After:</strong> One-click exports and automated scheduled reports.
              </p>
              <ul className="space-y-2 text-label">
                <li>✓ Click "Export" → PDF/CSV ready in seconds</li>
                <li>✓ White-label branding applied automatically</li>
                <li>✓ Schedule weekly reports sent via email</li>
                <li>✓ Executive summary + full data exports</li>
              </ul>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* Capabilities Grid */}
      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-white lowercase">
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
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 lowercase">
              {formatText("reporting that actually scales.")}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start exporting white-label reports in seconds, not hours.
            </p>
            <Button size="lg" className="bg-white hover:bg-white/90 lowercase text-primary">
              get started
            </Button>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default Reporting;
