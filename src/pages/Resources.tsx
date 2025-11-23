import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Layout, CheckSquare, Network, Image, BookMarked, GraduationCap, Calculator } from "lucide-react";
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
              <h1 className="hero-gradient text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-balance lowercase">
                resources
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              a knowledge system for clean tracking, utm governance, and analytics clarity.
            </p>
          </div>
        </div>
      </section>

      {/* New This Month Section */}
      {newResources.length > 0 && (
        <section className="py-16 bg-muted/20 border-y border-border/50">
          <div className="max-w-[1280px] mx-auto px-8">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-8 lowercase">
              new this month
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newResources.map((resource) => (
                <Link
                  key={resource.slug}
                  to={`/resources/${resource.category}/${resource.slug}`}
                  className="bg-card rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <Badge className="mb-4 bg-primary text-primary-foreground animate-pulse">NEW</Badge>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2 lowercase">
                    {resource.title}
                  </h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {resource.category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.path}
                  className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col h-full space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-display font-semibold text-foreground lowercase">
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
