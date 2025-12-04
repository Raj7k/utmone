import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Users, Database, LineChart } from "lucide-react";
import { FrameworkPrinciple } from "@/components/resources/FrameworkPrinciple";
import { ImplementationRoadmap } from "@/components/resources/ImplementationRoadmap";
import { ActionChecklist } from "@/components/resources/ActionChecklist";

const MinimalAnalyticsStack = () => {
  const principles = [
    {
      number: 1,
      title: "Decisions before tools",
      description: "Decide which decisions you want to support before picking vendors. Tools serve questions, not the other way around."
    },
    {
      number: 2,
      title: "Fewer surfaces, deeper usage",
      description: "It is better to fully use 3 tools than superficially use 9. Depth beats breadth in analytics infrastructure."
    },
    {
      number: 3,
      title: "One source of truth per question",
      description: "Each core question (e.g., 'What is our MRR?') should have a single trusted location. No competing dashboards."
    },
    {
      number: 4,
      title: "No vanity dashboards",
      description: "Every dashboard must have an owner, a purpose, and a review cadence. If no one checks it weekly, delete it."
    }
  ];

  const layers = [
    {
      icon: <Activity className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />,
      number: "01",
      title: "Product & Web Analytics",
      description: "GA4, Plausible, PostHog, Mixpanel. Track user behavior and website performance.",
      examples: "visitor → signup → activation"
    },
    {
      icon: <Users className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />,
      number: "02",
      title: "CRM / Revenue System",
      description: "HubSpot, Pipedrive, Salesforce, Close. Manage leads, opportunities, and customer relationships.",
      examples: "lead → opportunity → customer"
    },
    {
      icon: <Database className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />,
      number: "03",
      title: "Data Warehouse (optional early)",
      description: "BigQuery, Snowflake, Redshift. Centralized storage for cross-tool analysis.",
      examples: "optional for 0-50 employees"
    },
    {
      icon: <LineChart className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />,
      number: "04",
      title: "Reporting / BI",
      description: "Looker, Metabase, Mode, Power BI, internal dashboards. Visualize and share insights.",
      examples: "3-5 core dashboards only"
    }
  ];

  const roadmap = [
    {
      phase: "Week 1",
      duration: "selection",
      title: "Tool selection",
      tasks: [
        "Map your customer lifecycle stages",
        "Identify one tool per stage",
        "Document tool responsibilities",
        "Get team alignment on choices"
      ]
    },
    {
      phase: "Weeks 2-4",
      duration: "integration",
      title: "Integration",
      tasks: [
        "Align identifiers across systems",
        "Define core event names",
        "Set up data pipelines",
        "Test end-to-end data flow"
      ]
    },
    {
      phase: "Weeks 5-6",
      duration: "dashboards",
      title: "Dashboard build",
      tasks: [
        "Design 3-5 core dashboards only",
        "Growth: signups, trials, customers",
        "Revenue: MRR, churn, LTV",
        "Product: activation, retention"
      ]
    },
    {
      phase: "Weeks 7-8",
      duration: "operationalize",
      title: "Operating rhythm",
      tasks: [
        "Set weekly review cadence",
        "Assign dashboard owners",
        "Schedule monthly deep dives",
        "Plan quarterly stack audits"
      ]
    }
  ];

  const dashboards = [
    {
      name: "Growth Dashboard",
      metrics: "signups, trials, new customers, CAC",
      cadence: "reviewed weekly"
    },
    {
      name: "Revenue Dashboard",
      metrics: "MRR, churn rate, LTV, expansion revenue",
      cadence: "reviewed weekly"
    },
    {
      name: "Product Usage Dashboard",
      metrics: "activation rate, feature adoption, retention",
      cadence: "reviewed bi-weekly"
    },
    {
      name: "Marketing Efficiency Dashboard",
      metrics: "CAC by channel, ROAS, payback period",
      cadence: "reviewed monthly"
    },
    {
      name: "Support/Health Dashboard",
      metrics: "NPS, support tickets, response time",
      cadence: "optional, monthly"
    }
  ];

  const antiPatterns = [
    {
      pattern: "Tool sprawl (>10 analytics tools)",
      why: "Creates data silos, increases cost, fragments insights",
      fix: "Consolidate to 3-5 core tools that talk to each other"
    },
    {
      pattern: "Data hoarding (tracking everything)",
      why: "Slows queries, increases storage costs, creates noise",
      fix: "Only track metrics tied to active decisions"
    },
    {
      pattern: "Dashboard farms (>20 dashboards)",
      why: "No one knows which dashboard is source of truth",
      fix: "Delete dashboards not checked in 30 days, keep 3-5 core"
    },
    {
      pattern: "No tool ownership",
      why: "Data quality degrades, integrations break unnoticed",
      fix: "Assign one owner per tool with quarterly review responsibility"
    }
  ];

  const checklistItems = [
    { id: "1", text: "Customer lifecycle is mapped out (visitor → lead → customer → retained)" },
    { id: "2", text: "One tool assigned per lifecycle stage" },
    { id: "3", text: "Tool responsibilities are documented" },
    { id: "4", text: "Identifiers (user IDs, emails) align across systems" },
    { id: "5", text: "Core events are defined and tracked consistently" },
    { id: "6", text: "Data flows automatically (no manual exports required)" },
    { id: "7", text: "3-5 core dashboards exist (not 30)" },
    { id: "8", text: "Each dashboard has an owner and review cadence" },
    { id: "9", text: "Weekly/monthly review rhythm is established" },
    { id: "10", text: "Quarterly stack audit is scheduled" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources/frameworks"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to frameworks
          </Link>
          
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
              system design framework
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase">
              minimal analytics stack
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              four-layer framework for building analytics infrastructure that provides clarity without overwhelming teams.
            </p>
          </div>
        </div>
      </section>

      {/* Framework Principles */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            framework principles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <FrameworkPrinciple
                key={index}
                number={principle.number}
                title={principle.title}
                description={principle.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Stack Layers */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            the four stack layers
          </h2>
          
          <div className="space-y-6">
            {layers.map((layer, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border/50 hover:border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    {layer.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl font-extrabold" style={{ color: 'rgba(59,130,246,0.1)' }}>
                        {layer.number}
                      </span>
                      <h3 className="text-2xl font-display font-semibold text-foreground">
                        {layer.title}
                      </h3>
                    </div>
                    <p className="text-base text-muted-foreground mb-2">
                      {layer.description}
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(59,130,246,1)' }}>
                      {layer.examples}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Design */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
            dashboard design: 3–5 only
          </h2>
          <p className="text-base text-muted-foreground mb-12">
            Create a small set of dashboards that actually get used, not 30 that nobody checks.
          </p>
          
          <div className="space-y-4">
            {dashboards.map((dashboard, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {dashboard.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dashboard.metrics}
                    </p>
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(59,130,246,1)' }}>
                    {dashboard.cadence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Roadmap */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <ImplementationRoadmap phases={roadmap} />
        </div>
      </section>

      {/* Anti-Patterns */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            anti-patterns to avoid
          </h2>
          
          <div className="space-y-6">
            {antiPatterns.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  ❌ {item.pattern}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Why it breaks:</strong> {item.why}
                </p>
                <p className="text-sm" style={{ color: 'rgba(59,130,246,1)' }}>
                  <strong>Fix:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Checklist */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
            is your stack actually minimal?
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            You need 8 of 10 to confidently say your stack is minimal and effective.
          </p>
          
          <ActionChecklist
            items={checklistItems}
            storageKey="minimal-stack-checklist"
            className="max-w-[720px]"
          />
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-20 bg-muted/20 border-t border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-2xl font-display font-semibold text-foreground mb-8">
            related resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/resources/guides/simple-analytics"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Simple Analytics Guide</h3>
              <p className="text-sm text-muted-foreground">Learn how to build analytics that clarify rather than confuse</p>
            </Link>
            
            <Link
              to="/resources/guides/tracking-architecture"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Tracking Architecture Guide</h3>
              <p className="text-sm text-muted-foreground">Design tracking systems that connect across tools</p>
            </Link>
            
            <Link
              to="/resources/playbooks/startup-analytics-playbook"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Startup Analytics Playbook</h3>
              <p className="text-sm text-muted-foreground">Tactical implementation for 0-100 person companies</p>
            </Link>
            
            <Link
              to="/resources/frameworks/clean-track-model"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Clean-Track Framework</h3>
              <p className="text-sm text-muted-foreground">Ensure data quality feeds your minimal stack</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <span className="text-[13px] text-muted-foreground">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinimalAnalyticsStack;
