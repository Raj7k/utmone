import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft, Layers, Shield, GitBranch, BarChart3 } from "lucide-react";
import { FrameworkPrinciple } from "@/components/resources/FrameworkPrinciple";
import { ImplementationRoadmap } from "@/components/resources/ImplementationRoadmap";
import { ActionChecklist } from "@/components/resources/ActionChecklist";

const CleanTrackModel = () => {
  const layers = [
    {
      icon: <Layers className="w-6 h-6 text-primary" />,
      number: "01",
      title: "Syntax & Structure",
      description: "UTM parameters, formatting rules, lowercase enforcement, special character handling."
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      number: "02",
      title: "Naming Rules",
      description: "Taxonomy, allowed values, conventions, channel-specific templates."
    },
    {
      icon: <GitBranch className="w-6 h-6 text-primary" />,
      number: "03",
      title: "Governance Process",
      description: "Approval workflows, enforcement mechanisms, violation monitoring."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      number: "04",
      title: "Reporting Standards",
      description: "How data flows to dashboards, aggregation rules, attribution logic."
    }
  ];

  const roadmap = [
    {
      phase: "Week 1-2",
      duration: "audit",
      title: "Audit current state",
      tasks: [
        "Export all existing links and UTMs",
        "Identify inconsistencies and patterns",
        "Document current pain points",
        "Define success criteria"
      ]
    },
    {
      phase: "Week 3-4",
      duration: "design",
      title: "Design taxonomy",
      tasks: [
        "Define allowed values per UTM parameter",
        "Create channel-specific templates",
        "Document naming conventions",
        "Get stakeholder sign-off"
      ]
    },
    {
      phase: "Week 5-6",
      duration: "implement",
      title: "Implement enforcement",
      tasks: [
        "Set up utm.one with governance rules",
        "Train team on new standards",
        "Migrate existing links",
        "Enable validation and monitoring"
      ]
    },
    {
      phase: "Week 7-8",
      duration: "operationalize",
      title: "Build reporting",
      tasks: [
        "Connect analytics tools",
        "Build 3-5 core dashboards",
        "Set up automated alerts",
        "Schedule quarterly audits"
      ]
    }
  ];

  const checklistItems = [
    { id: "1", text: "All 5 UTM parameters are consistently used" },
    { id: "2", text: "Taxonomy document exists and is accessible" },
    { id: "3", text: "Governance tool (utm.one) enforces rules automatically" },
    { id: "4", text: "Team trained on Clean-Track standards" },
    { id: "5", text: "Dashboards use clean data without manual cleanup" },
    { id: "6", text: "Monthly audit process is scheduled" },
    { id: "7", text: "New campaign launches follow Clean-Track workflow" },
    { id: "8", text: "Attribution models rely on Clean-Track data" },
    { id: "9", text: "Cross-functional teams (marketing, sales, ops) aligned" },
    { id: "10", text: "Quarterly reviews assess framework health" }
  ];

  const antiPatterns = [
    {
      pattern: "Random UTM values",
      why: "Creates thousands of unique combinations, makes aggregation impossible",
      fix: "Define allowed values taxonomy upfront"
    },
    {
      pattern: "Inconsistent casing",
      why: "'Facebook' vs 'facebook' creates duplicate segments",
      fix: "Enforce lowercase at creation time"
    },
    {
      pattern: "No governance tool",
      why: "Spreadsheets don't prevent mistakes, only document them",
      fix: "Use utm.one or similar enforcement system"
    },
    {
      pattern: "Too many utm_content values",
      why: "Defeats purpose of structured tracking",
      fix: "Limit to asset types (banner, video, text) not creative IDs"
    }
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
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              mental model framework
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase">
              clean-track model
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              four-layer framework for building tracking systems that scale without breaking under complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Framework Summary */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
              the problem this framework solves
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">
                  before: broken tracking
                </h3>
                <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                  <li>• Everyone creates UTMs differently</li>
                  <li>• No enforced naming standards</li>
                  <li>• Attribution reports are guesswork</li>
                  <li>• Dashboards require manual cleanup</li>
                  <li>• Campaign performance is unclear</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">
                  after: clean-track system
                </h3>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li>• Consistent UTM structure across teams</li>
                  <li>• Automated enforcement prevents errors</li>
                  <li>• Attribution is trustworthy</li>
                  <li>• Dashboards work without cleanup</li>
                  <li>• Campaign ROI is clear</li>
                </ul>
              </div>
            </div>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              The Clean-Track Framework is the foundation of reliable, scalable campaign tracking across UTMs, 
              naming conventions, attribution, and analytics systems. It is the operating system behind clean data, 
              accurate dashboards, and trustworthy reporting.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Layers */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            the four layers
          </h2>
          
          <div className="space-y-6">
            {layers.map((layer, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {layer.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl font-extrabold text-primary/10">
                        {layer.number}
                      </span>
                      <h3 className="text-2xl font-display font-semibold text-foreground">
                        {layer.title}
                      </h3>
                    </div>
                    <p className="text-base text-muted-foreground">
                      {layer.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Roadmap */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <ImplementationRoadmap phases={roadmap} />
        </div>
      </section>

      {/* Failure Modes */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            failure modes & anti-patterns
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
                <p className="text-sm text-primary">
                  <strong>Fix:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Checklist */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
            is clean-track actually live?
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            You need 8 of 10 to confidently say Clean-Track is operational.
          </p>
          
          <ActionChecklist
            items={checklistItems}
            storageKey="clean-track-checklist"
            className="max-w-[720px]"
          />
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-2xl font-display font-semibold text-foreground mb-8">
            related resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/resources/guides/utm-guide"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">UTM Guide</h3>
              <p className="text-sm text-muted-foreground">Learn UTM fundamentals and best practices</p>
            </Link>
            
            <Link
              to="/resources/playbooks/utm-governance-playbook"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">UTM Governance Playbook</h3>
              <p className="text-sm text-muted-foreground">Tactical steps for implementing governance</p>
            </Link>
            
            <Link
              to="/resources/templates/naming-taxonomy-template"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Naming Taxonomy Template</h3>
              <p className="text-sm text-muted-foreground">Pre-built taxonomy structure to customize</p>
            </Link>
            
            <Link
              to="/resources/templates/audit-checklist-template"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Audit Checklist Template</h3>
              <p className="text-sm text-muted-foreground">Validate your tracking health</p>
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

export default CleanTrackModel;
