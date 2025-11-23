import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Layout, CheckSquare, Network, Image, BookMarked, GraduationCap, Calculator, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getResourceCount, getNewResources } from "@/lib/resourceRegistry";

const Resources = () => {
  const newResources = getNewResources();
  
  const categories = [
    {
      name: "guides",
      title: "Guides",
      description: "long-form, canonical content on utm architecture, tracking, and analytics",
      icon: BookOpen,
      path: "/resources/guides",
      count: getResourceCount("guides")
    },
    {
      name: "playbooks",
      title: "Playbooks",
      description: "tactical, step-by-step workflows for utm governance, analytics, and campaign execution",
      icon: FileText,
      path: "/resources/playbooks",
      count: getResourceCount("playbooks")
    },
    {
      name: "templates",
      title: "Templates",
      description: "copy/paste templates for utm setup, naming conventions, and reporting",
      icon: Layout,
      path: "/resources/templates",
      count: getResourceCount("templates")
    },
    {
      name: "checklists",
      title: "Checklists",
      description: "actionable checklists for utm audits, campaign launches, and analytics health",
      icon: CheckSquare,
      path: "/resources/checklists",
      count: getResourceCount("checklists")
    },
    {
      name: "frameworks",
      title: "Frameworks",
      description: "proprietary mental models for clean tracking, minimal analytics, and utm governance",
      icon: Network,
      path: "/resources/frameworks",
      count: getResourceCount("frameworks")
    },
    {
      name: "examples",
      title: "Examples",
      description: "real-world utm examples, before/after tracking, and dashboard visualizations",
      icon: Image,
      path: "/resources/examples",
      count: getResourceCount("examples")
    },
    {
      name: "glossary",
      title: "Glossary",
      description: "canonical definitions for utm, taxonomy, attribution, and campaign structure",
      icon: BookMarked,
      path: "/resources/glossary",
      count: getResourceCount("glossary")
    },
    {
      name: "tools",
      title: "Tools",
      description: "interactive calculators for salary negotiation, career planning, and team budgeting",
      icon: Calculator,
      path: "/resources/tools",
      count: getResourceCount("tools")
    },
    {
      name: "reports",
      title: "Reports",
      description: "data-driven research reports on salaries, market trends, and industry benchmarks",
      icon: BarChart3,
      path: "/resources/reports",
      count: getResourceCount("reports"),
      badge: "FEATURED"
    },
    {
      name: "academy",
      title: "Academy",
      description: "micro lessons on utm, analytics, frameworks, and naming conventions",
      icon: GraduationCap,
      path: "/resources/academy",
      count: "4 lessons"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-balance">
                Resources
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              A knowledge system for clean tracking, UTM governance, and analytics clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const hasNewBadge = newResources.some(r => r.category === category.name);
              const isFeatured = category.badge === "FEATURED";
              
              return (
                <Link
                  key={category.name}
                  to={category.path}
                  className="group block p-6 rounded-2xl border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {(hasNewBadge || isFeatured) && (
                      <Badge variant={isFeatured ? "default" : "secondary"} className={isFeatured ? "animate-pulse" : ""}>
                        {isFeatured ? "FEATURED" : "NEW"}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-display font-semibold text-foreground">
                      {category.title}
                    </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {category.count}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;