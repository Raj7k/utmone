import { ChecklistLayout } from "@/components/resources/ChecklistLayout";
import { ActionChecklist } from "@/components/resources/ActionChecklist";

const syntaxChecks = [
  { id: "syntax-1", text: "All UTM parameters are lowercase (no uppercase letters)" },
  { id: "syntax-2", text: "No spaces in any UTM values (use hyphens or underscores)" },
  { id: "syntax-3", text: "Hyphens used correctly to separate logical groups" },
  { id: "syntax-4", text: "Underscores used for word grouping within segments" },
  { id: "syntax-5", text: "Only approved parameters used (source, medium, campaign, content, term)" },
];

const sourceMediumChecks = [
  { id: "source-1", text: "utm_source values match approved taxonomy (google, facebook, linkedin, etc.)" },
  { id: "source-2", text: "utm_medium values match approved taxonomy (cpc, email, social, organic, etc.)" },
  { id: "source-3", text: "No free-typed or invented source/medium values" },
  { id: "source-4", text: "No variations like 'fb / FB / FbPaid / MetaAds' for same platform" },
];

const campaignNamingChecks = [
  { id: "campaign-1", text: "Campaign names follow pattern: source_medium-campaign-audience-objective-variant" },
  { id: "campaign-2", text: "Campaign names are human-readable and descriptive" },
  { id: "campaign-3", text: "Correct versioning format used (v1, v2, v3)" },
  { id: "campaign-4", text: "No duplicate campaign names across different initiatives" },
];

const contentTermChecks = [
  { id: "content-1", text: "utm_content reflects creative variant or A/B test identifier" },
  { id: "content-2", text: "utm_term used only for paid search keywords (not misused)" },
  { id: "content-3", text: "No random IDs or meaningless codes in content/term fields" },
];

const linkIntegrityChecks = [
  { id: "integrity-1", text: "All destination URLs resolve correctly (no 404s)" },
  { id: "integrity-2", text: "Redirect rules tested and working as expected" },
  { id: "integrity-3", text: "QR codes resolve with UTM parameters intact" },
];

const governanceChecks = [
  { id: "governance-1", text: "Links created using approved UTM generator/builder tool" },
  { id: "governance-2", text: "All links logged in centralized UTM database/spreadsheet" },
  { id: "governance-3", text: "Weekly spot-check audits completed and documented" },
  { id: "governance-4", text: "Monthly deep audit completed with findings report" },
];

const relatedResources = [
  { title: "UTM Guide", href: "/resources/guides/utm-guide" },
  { title: "UTM Template", href: "/resources/templates/utm-template" },
  { title: "Audit Checklist Template", href: "/resources/templates/audit-checklist-template" },
  { title: "UTM Governance Playbook", href: "/resources/playbooks/utm-governance-playbook" },
  { title: "Clean-Track Framework", href: "/resources/frameworks/clean-track-model" },
];

export default function UTMAudit() {
  return (
    <ChecklistLayout
      title="UTM Audit — Link Health Check"
      description="Complete operational audit for validating UTMs across all channels. Designed for growth, marketing ops, revenue ops, and BI teams."
      totalItems={23}
      estimatedTime="~45 minutes"
      frequency="Monthly recommended"
      relatedResources={relatedResources}
      storageKey="utm-audit-checklist"
    >
      <div className="space-y-8">
        {/* Overview */}
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            What This Checklist Covers
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This checklist validates UTM structure, syntax, governance compliance, and reporting mapping 
            across all your marketing channels. Use it monthly to catch drift before it becomes a data crisis.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2">Who Should Use This</h3>
              <p className="text-sm text-muted-foreground">
                Growth teams, marketing ops, revenue ops, BI analysts, campaign managers
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2">When to Run It</h3>
              <p className="text-sm text-muted-foreground">
                Monthly deep audit, weekly spot checks for high-volume campaigns
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2">Success Target</h3>
              <p className="text-sm text-muted-foreground">
                Aim for 90%+ completion (21/23 items) to maintain data quality
              </p>
            </div>
          </div>
        </div>

        {/* Checklists */}
        <ActionChecklist
          title="01 — Syntax Checks"
          items={syntaxChecks}
          storageKey="utm-audit-syntax"
        />

        <ActionChecklist
          title="02 — Source/Medium Checks"
          items={sourceMediumChecks}
          storageKey="utm-audit-source-medium"
        />

        <ActionChecklist
          title="03 — Campaign Naming Checks"
          items={campaignNamingChecks}
          storageKey="utm-audit-campaign-naming"
        />

        <ActionChecklist
          title="04 — Content/Term Checks"
          items={contentTermChecks}
          storageKey="utm-audit-content-term"
        />

        <ActionChecklist
          title="05 — Link Integrity"
          items={linkIntegrityChecks}
          storageKey="utm-audit-link-integrity"
        />

        <ActionChecklist
          title="06 — Governance Checks"
          items={governanceChecks}
          storageKey="utm-audit-governance"
        />

        {/* What to Do With Results */}
        <div className="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            What to Do With Results
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Export failed items:</strong> Create a task list of 
              all unchecked items and assign owners for fixes.
            </p>
            <p>
              <strong className="text-foreground">Schedule fixes:</strong> Block time with relevant 
              teams to address critical issues within 2 weeks.
            </p>
            <p>
              <strong className="text-foreground">Document learnings:</strong> Note common failure 
              patterns and update your UTM taxonomy to prevent future drift.
            </p>
            <p>
              <strong className="text-foreground">Track improvement:</strong> Run this audit monthly 
              and track your completion score over time.
            </p>
          </div>
        </div>
      </div>
    </ChecklistLayout>
  );
}
