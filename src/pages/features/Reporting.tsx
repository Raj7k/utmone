import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/StaticFeatureHero";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/StaticFeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/StaticFeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { FileDown, FileSpreadsheet, Mail, Calendar, BarChart2, FileText } from "lucide-react";

const Reporting = () => {
  const stats = [
    { value: "1-click", label: "PDF Export" },
    { value: "∞", label: "Custom Ranges" },
    { value: "Auto", label: "Scheduled Reports" },
    { value: "White", label: "Label Branding" },
  ];

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
      description: "Export data for any time period (last 7 days, quarter, custom).",
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

  const comparisonItems = [
    { feature: "Report creation", before: "Hours in spreadsheets", after: "One-click export" },
    { feature: "Client branding", before: "Manual logo insertion", after: "Auto white-label templates" },
    { feature: "Report delivery", before: "Manual email sends", after: "Scheduled automation" },
    { feature: "Data access", before: "Copy from dashboards", after: "Direct CSV/PDF download" },
    { feature: "Report consistency", before: "Different every time", after: "Standardized templates" },
    { feature: "Executive summaries", before: "Built from scratch", after: "One-click KPI reports" },
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
      <FeatureHero
        headline="reporting without spreadsheet hell."
        subheadline="One-click PDF exports, white-label client reports, and scheduled email delivery. Stop wasting hours on manual reporting."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "see templates", href: "#templates" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="End the Reporting Pain"
        subheadline="From hours of manual work to one-click automation"
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Reporting Features"
        subheadline="Everything you need for professional analytics reporting"
        items={capabilities}
      />

      <FeatureShowcase
        headline="Report Types"
        subheadline="Choose the right report for your audience"
        background="muted"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-sans font-semibold text-foreground mb-2">Executive Summary</h3>
            <p className="text-muted-foreground text-sm mb-4">High-level KPIs for C-suite. Total clicks, top campaigns, conversion trends.</p>
            <div className="text-xs text-primary">Best for: Executives, Board Updates</div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <BarChart2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-sans font-semibold text-foreground mb-2">Campaign Report</h3>
            <p className="text-muted-foreground text-sm mb-4">Detailed performance by campaign, source, medium. Geographic and device breakdown.</p>
            <div className="text-xs text-primary">Best for: Marketing Teams, Clients</div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <FileSpreadsheet className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-sans font-semibold text-foreground mb-2">Raw Data Export</h3>
            <p className="text-muted-foreground text-sm mb-4">Full click-level CSV with all dimensions. Import to BI tools or Excel.</p>
            <div className="text-xs text-primary">Best for: Analysts, Data Teams</div>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="reporting that actually scales."
        subheadline="Start exporting white-label reports in seconds, not hours."
      />
    </FeatureLayout>
  );
};

export default Reporting;
