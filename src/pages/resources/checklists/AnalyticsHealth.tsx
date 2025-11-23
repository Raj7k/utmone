import { ChecklistLayout } from "@/components/resources/ChecklistLayout";
import { ActionChecklist } from "@/components/resources/ActionChecklist";

const trackingChecks = [
  { id: "tracking-1", text: "Core events tracked (signup_completed, trial_started, purchase_completed)" },
  { id: "tracking-2", text: "Event definitions consistent across all analytics tools" },
  { id: "tracking-3", text: "UTM parameters flowing correctly into analytics platform" },
  { id: "tracking-4", text: "UTM-to-source mapping accurate and documented" },
];

const toolChecks = [
  { id: "tool-1", text: "Product analytics platform configured and receiving events" },
  { id: "tool-2", text: "CRM field mapping clean with no orphaned or duplicate fields" },
  { id: "tool-3", text: "Web analytics (GA4 or similar) operational with correct property setup" },
  { id: "tool-4", text: "BI tool pulling correct fields from analytics and CRM sources" },
];

const dataQualityChecks = [
  { id: "quality-1", text: "No double-counting of events across tools" },
  { id: "quality-2", text: "No missing user identifiers or anonymous session gaps" },
  { id: "quality-3", text: "Events fire exactly once per user action (no duplicates)" },
  { id: "quality-4", text: "Historical data stable with no unexplained spikes or drops" },
];

const dashboardChecks = [
  { id: "dashboard-1", text: "Growth dashboard shows accurate acquisition and activation metrics" },
  { id: "dashboard-2", text: "Revenue dashboard mapping correct to actual financial data" },
  { id: "dashboard-3", text: "Product usage dashboards consistent across all views" },
  { id: "dashboard-4", text: "No 'rogue dashboards' with conflicting definitions or outdated logic" },
];

const decisionChecks = [
  { id: "decision-1", text: "Weekly data review meetings happening on consistent schedule" },
  { id: "decision-2", text: "Dashboards directly tied to decisions (not just vanity metrics)" },
  { id: "decision-3", text: "No vanity metrics tracked without actionable insight" },
  { id: "decision-4", text: "Experiment logs maintained with hypothesis, results, and learnings" },
  { id: "decision-5", text: "Attribution models documented and understood by stakeholders" },
];

const relatedResources = [
  { title: "Minimal Analytics Stack Framework", href: "/resources/frameworks/minimal-analytics-stack" },
  { title: "Tracking Architecture Guide", href: "/resources/guides/tracking-architecture" },
  { title: "Simple Analytics Guide", href: "/resources/guides/simple-analytics" },
  { title: "Startup Analytics Playbook", href: "/resources/playbooks/startup-analytics-playbook" },
  { title: "Dashboard Examples", href: "/resources/examples/dashboard-examples" },
];

export default function AnalyticsHealth() {
  return (
    <ChecklistLayout
      title="Analytics Health — System Validation"
      description="Validates the health of your analytics system across tracking, tools, events, dashboards, and decision workflows. Designed for modern SaaS, product-led, or B2B teams."
      totalItems={21}
      estimatedTime="~60 minutes"
      frequency="Monthly recommended"
      relatedResources={relatedResources}
      storageKey="analytics-health-checklist"
    >
      <div className="space-y-8">
        {/* Overview */}
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            What This Checklist Covers
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This checklist validates your entire analytics system health—from event tracking to 
            decision workflows. Use it monthly to catch data quality issues before they corrupt insights.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2">Health Score Guide</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>90-100%: Excellent (production-ready)</li>
                <li>75-89%: Good (minor fixes needed)</li>
                <li>60-74%: Needs attention (data reliability at risk)</li>
                <li>&lt;60%: Critical issues (immediate action required)</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2">Common Failure Patterns</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>UTMs not flowing to analytics (tool integration broken)</li>
                <li>Double-counting events across platforms</li>
                <li>Dashboards with conflicting definitions</li>
                <li>Missing attribution model documentation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Checklists */}
        <ActionChecklist
          title="01 — Tracking Checks"
          items={trackingChecks}
          storageKey="analytics-health-tracking"
        />

        <ActionChecklist
          title="02 — Tool Checks"
          items={toolChecks}
          storageKey="analytics-health-tools"
        />

        <ActionChecklist
          title="03 — Data Quality Checks"
          items={dataQualityChecks}
          storageKey="analytics-health-quality"
        />

        <ActionChecklist
          title="04 — Dashboard Checks"
          items={dashboardChecks}
          storageKey="analytics-health-dashboards"
        />

        <ActionChecklist
          title="05 — Decision Workflow Checks"
          items={decisionChecks}
          storageKey="analytics-health-decisions"
        />

        {/* What to Do With Results */}
        <div className="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            Common Issues & Quick Fixes
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Issue: Events firing multiple times
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Fix:</strong> Add event deduplication logic using unique transaction IDs. 
                Check for multiple analytics snippets on the same page.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Issue: UTMs not showing in analytics
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Fix:</strong> Verify UTM parameters are lowercase and properly formatted. 
                Check if URL redirects are stripping parameters. Test UTM flow end-to-end.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Issue: Dashboards showing conflicting numbers
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Fix:</strong> Audit all dashboard queries for consistent date ranges, filters, 
                and metric definitions. Create single source of truth dashboard.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Issue: Missing attribution data
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Fix:</strong> Document your attribution model (first-touch, last-touch, multi-touch). 
                Ensure all touchpoints are being captured with proper UTMs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ChecklistLayout>
  );
}
