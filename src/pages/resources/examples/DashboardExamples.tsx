import { useState, useMemo } from "react";
import { ExampleLayout } from "@/components/resources/ExampleLayout";
import { ExampleSearch } from "@/components/resources/ExampleSearch";
import { ExampleFilter } from "@/components/resources/ExampleFilter";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface DashboardExample {
  title: string;
  category: string;
  sections: string[];
  metrics: string[];
  usage: string;
  bestFor: string;
  context: string;
}

const dashboards: DashboardExample[] = [
  {
    title: "Growth Dashboard",
    category: "Growth",
    sections: ["Acquisition (by channel, by campaign)", "Activation", "CAC", "Trial → Customer Funnel", "Conversion Timeline"],
    metrics: ["Signups", "Trials", "Customers", "Conversion Rate", "Time to Convert"],
    usage: "Weekly growth review meetings",
    bestFor: "0-100 person companies",
    context: "SaaS"
  },
  {
    title: "Product Usage Dashboard",
    category: "Product",
    sections: ["Active Users (DAU, WAU, MAU)", "Feature Adoption (top 10 features)", "Onboarding Completion (step-by-step funnel)", "Habit Metrics (frequency, recency)"],
    metrics: ["Active users", "Feature usage %", "Onboarding completion %", "Return rate"],
    usage: "Weekly product review",
    bestFor: "Product teams, 10-500 person companies",
    context: "Product-Led"
  },
  {
    title: "Revenue Dashboard",
    category: "Revenue",
    sections: ["MRR (Monthly Recurring Revenue)", "NRR (Net Revenue Retention)", "Expansion (upsell, cross-sell)", "Contraction (downgrades, churn)", "Cohort Retention"],
    metrics: ["MRR", "NRR %", "Churn %", "Expansion revenue"],
    usage: "Monthly finance review",
    bestFor: "SaaS companies, all stages",
    context: "Finance"
  },
  {
    title: "Marketing Efficiency Dashboard",
    category: "Marketing",
    sections: ["CAC by Channel", "ROAS (Return on Ad Spend)", "Payback Period", "LTV:CAC Ratio"],
    metrics: ["CAC", "ROAS", "Payback months", "LTV"],
    usage: "Monthly marketing review",
    bestFor: "Marketing ops, 50+ person companies",
    context: "Performance Marketing"
  },
  {
    title: "Executive Dashboard",
    category: "Executive",
    sections: ["North Star Metric (primary KPI)", "Growth Rate (MoM, YoY)", "Unit Economics (CAC, LTV, margin)", "Runway (months of cash)"],
    metrics: ["North star", "Growth %", "CAC", "LTV", "Runway"],
    usage: "Monthly board meetings",
    bestFor: "Executives, all stages",
    context: "Leadership"
  },
];

const DashboardCard = ({ dashboard }: { dashboard: DashboardExample }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-display font-semibold mb-2">{dashboard.title}</h3>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">{dashboard.context}</Badge>
            <Badge variant="outline" className="text-xs">{dashboard.category}</Badge>
          </div>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Sections */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Sections</h4>
        <div className="space-y-2">
          {dashboard.sections.map((section, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs font-mono text-primary mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-sm text-foreground">{section}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Key Metrics</h4>
        <div className="flex flex-wrap gap-2">
          {dashboard.metrics.map((metric, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">{metric}</Badge>
          ))}
        </div>
      </div>

      {/* Usage & Best For */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Usage</p>
          <p className="text-sm font-medium">{dashboard.usage}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Best for</p>
          <p className="text-sm font-medium">{dashboard.bestFor}</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardExamples() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    dashboards.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    
    return [
      { label: "All", value: "all", count: dashboards.length },
      { label: "Growth", value: "Growth", count: counts["Growth"] || 0 },
      { label: "Product", value: "Product", count: counts["Product"] || 0 },
      { label: "Revenue", value: "Revenue", count: counts["Revenue"] || 0 },
      { label: "Marketing", value: "Marketing", count: counts["Marketing"] || 0 },
      { label: "Executive", value: "Executive", count: counts["Executive"] || 0 },
    ];
  }, []);

  const filteredDashboards = useMemo(() => {
    return dashboards.filter((dashboard) => {
      const matchesCategory = activeCategory === "all" || dashboard.category === activeCategory;
      const matchesSearch = searchQuery === "" || 
        dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dashboard.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dashboard.metrics.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <ExampleLayout
      title="Dashboard Examples Library"
      description="Practical dashboard structures for SaaS, B2B, and multi-channel marketing environments."
      totalCount={`${dashboards.length}+ dashboards`}
      relatedResources={[
        { title: "Minimal Analytics Stack Framework", href: "/resources/frameworks/minimal-analytics-stack" },
        { title: "Startup Analytics Playbook", href: "/resources/playbooks/startup-analytics" },
        { title: "Growth Analytics Guide", href: "/resources/guides/growth-analytics" },
        { title: "Simple Analytics Guide", href: "/resources/guides/simple-analytics" },
      ]}
    >
      {/* Filter Bar */}
      <div className="space-y-6 mb-12">
        <ExampleSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="search dashboards..."
        />
        <ExampleFilter
          categories={categories}
          activeCategory={activeCategory}
          onFilterChange={setActiveCategory}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          showing {filteredDashboards.length} {filteredDashboards.length === 1 ? "dashboard" : "dashboards"}
        </p>
      </div>

      {/* Dashboards Grid */}
      <div className="grid gap-8">
        {filteredDashboards.map((dashboard, index) => (
          <DashboardCard key={index} dashboard={dashboard} />
        ))}
      </div>

      {/* No Results */}
      {filteredDashboards.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">no dashboards found matching your filters.</p>
        </div>
      )}
    </ExampleLayout>
  );
}
