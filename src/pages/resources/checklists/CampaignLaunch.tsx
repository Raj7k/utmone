import { ChecklistLayout } from "@/components/resources/ChecklistLayout";
import { ActionChecklist } from "@/components/resources/ActionChecklist";

const strategyChecks = [
  { id: "strategy-1", text: "Campaign objective clearly defined and measurable" },
  { id: "strategy-2", text: "Primary target audience defined with specific criteria" },
  { id: "strategy-3", text: "Messaging consistent across all channels and touchpoints" },
  { id: "strategy-4", text: "Offer validated with target audience (pricing, value prop, urgency)" },
];

const creativeChecks = [
  { id: "creative-1", text: "Ad copy finalized and approved by stakeholders" },
  { id: "creative-2", text: "Creative variants produced for A/B testing" },
  { id: "creative-3", text: "Landing page final with clear CTA and mobile optimization" },
  { id: "creative-4", text: "Device tests complete (desktop, mobile, tablet)" },
];

const trackingChecks = [
  { id: "tracking-1", text: "UTMs generated correctly using approved taxonomy" },
  { id: "tracking-2", text: "Naming follows standard convention (source_medium-campaign-audience-objective-variant)" },
  { id: "tracking-3", text: "QA review completed with end-to-end click testing" },
  { id: "tracking-4", text: "Conversion tracking events validated in analytics platform" },
];

const opsChecks = [
  { id: "ops-1", text: "CRM routing rules tested for lead assignment" },
  { id: "ops-2", text: "Lead fields mapped correctly from form to CRM" },
  { id: "ops-3", text: "Lifecycle triggers working (welcome emails, nurture sequences)" },
];

const goLiveChecks = [
  { id: "golive-1", text: "Campaigns scheduled with correct start date/time" },
  { id: "golive-2", text: "Budgets locked and billing verified" },
  { id: "golive-3", text: "Notifications set for key stakeholders" },
  { id: "golive-4", text: "Backup creatives ready in case of performance issues" },
];

const postLaunchChecks = [
  { id: "postlaunch-1", text: "Monitoring window set for first 72 hours" },
  { id: "postlaunch-2", text: "Dashboards refreshed to include new campaign data" },
  { id: "postlaunch-3", text: "Early signals captured (click-through rate, cost per click)" },
  { id: "postlaunch-4", text: "Experiment documented with hypothesis and success criteria" },
  { id: "postlaunch-5", text: "Team debriefed on early learnings and next steps" },
];

const relatedResources = [
  { title: "Campaign Brief Template", href: "/resources/templates/campaign-brief-template" },
  { title: "UTM Template", href: "/resources/templates/utm-template" },
  { title: "Event-Led Growth Playbook", href: "/resources/playbooks/event-led-growth-playbook" },
  { title: "UTM Guide", href: "/resources/guides/utm-guide" },
  { title: "Tracking Architecture Guide", href: "/resources/guides/tracking-architecture" },
];

export default function CampaignLaunch() {
  return (
    <ChecklistLayout
      title="Campaign Launch — Pre-Flight Checklist"
      description="End-to-end checklist for launching any marketing campaign across digital, offline, PLG, community, or event-led growth. Ensures creative, tracking, governance, analytics, and operations alignment."
      totalItems={20}
      estimatedTime="~90 minutes"
      frequency="Per-campaign"
      relatedResources={relatedResources}
      storageKey="campaign-launch-checklist"
    >
      <div className="space-y-8">
        {/* Overview */}
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            Campaign Launch Timeline
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Use this checklist systematically as you build your campaign. Complete each phase 
            before moving to the next to avoid launch-day surprises.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>T-7 Days</div>
              <h3 className="font-semibold text-foreground mb-2">Strategy + Creative</h3>
              <p className="text-sm text-muted-foreground">
                Finalize messaging, audience targeting, and all creative assets
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>T-3 Days</div>
              <h3 className="font-semibold text-foreground mb-2">Tracking + Ops</h3>
              <p className="text-sm text-muted-foreground">
                Set up UTMs, test tracking, configure CRM routing rules
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>T-1 Day</div>
              <h3 className="font-semibold text-foreground mb-2">Go-Live Checks</h3>
              <p className="text-sm text-muted-foreground">
                Final QA, schedule campaigns, set up monitoring dashboards
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>Launch Day</div>
              <h3 className="font-semibold text-foreground mb-2">Monitor Live</h3>
              <p className="text-sm text-muted-foreground">
                Watch real-time metrics, ready to pause or adjust if needed
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>T+72 Hours</div>
              <h3 className="font-semibold text-foreground mb-2">Early Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Capture early signals, document learnings, adjust if needed
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(59,130,246,1)' }}>T+7 Days</div>
              <h3 className="font-semibold text-foreground mb-2">Full Review</h3>
              <p className="text-sm text-muted-foreground">
                Complete performance analysis, share learnings with team
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 mb-8">
            <h3 className="font-semibold text-foreground mb-2">⚠️ Pre-Launch Requirement</h3>
            <p className="text-sm text-muted-foreground">
              You must complete 100% of items (20/20) before launching. Missing critical items 
              like tracking validation or CRM routing can corrupt your entire campaign data.
            </p>
          </div>
        </div>

        {/* Checklists */}
        <ActionChecklist
          title="01 — Strategy Checks"
          items={strategyChecks}
          storageKey="campaign-launch-strategy"
        />

        <ActionChecklist
          title="02 — Creative Checks"
          items={creativeChecks}
          storageKey="campaign-launch-creative"
        />

        <ActionChecklist
          title="03 — Tracking Checks"
          items={trackingChecks}
          storageKey="campaign-launch-tracking"
        />

        <ActionChecklist
          title="04 — Ops & CRM Checks"
          items={opsChecks}
          storageKey="campaign-launch-ops"
        />

        <ActionChecklist
          title="05 — Go-Live Checks"
          items={goLiveChecks}
          storageKey="campaign-launch-golive"
        />

        <ActionChecklist
          title="06 — Post-Launch Checks"
          items={postLaunchChecks}
          storageKey="campaign-launch-postlaunch"
        />

        {/* Post-Launch Actions */}
        <div className="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            What to Monitor in First 72 Hours
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hour 1-6: Technical Validation</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Clicks registering correctly in analytics</li>
                <li>• UTM parameters flowing through</li>
                <li>• Landing page loading without errors</li>
                <li>• CRM leads routing to correct owners</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hour 6-24: Early Performance</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Click-through rate vs historical benchmark</li>
                <li>• Cost per click within expected range</li>
                <li>• Landing page conversion rate tracking</li>
                <li>• Quality score (for paid search)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hour 24-72: Optimization Window</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Best-performing ad variants identified</li>
                <li>• Underperforming creatives paused or adjusted</li>
                <li>• Budget reallocation to top performers</li>
                <li>• Conversion tracking validated end-to-end</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ChecklistLayout>
  );
}
