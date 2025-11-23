import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Layout, CheckSquare, Network, Image, BookMarked, GraduationCap } from "lucide-react";

const Resources = () => {
  const categories = [
    {
      name: "guides",
      title: "Guides",
      description: "long-form, canonical content on utm architecture, tracking, and analytics",
      icon: BookOpen,
      path: "/resources/guides",
      count: "6 guides"
    },
    {
      name: "playbooks",
      title: "Playbooks",
      description: "tactical, step-by-step workflows for utm governance, analytics, and campaign execution",
      icon: FileText,
      path: "/resources/playbooks",
      count: "4 playbooks"
    },
    {
      name: "templates",
      title: "Templates",
      description: "copy/paste templates for utm setup, naming conventions, and reporting",
      icon: Layout,
      path: "/resources/templates",
      count: "4 templates"
    },
    {
      name: "checklists",
      title: "Checklists",
      description: "actionable checklists for utm audits, campaign launches, and analytics health",
      icon: CheckSquare,
      path: "/resources/checklists",
      count: "4 checklists"
    },
    {
      name: "frameworks",
      title: "Frameworks",
      description: "proprietary mental models for clean tracking, minimal analytics, and utm governance",
      icon: Network,
      path: "/resources/frameworks",
      count: "3 frameworks"
    },
    {
      name: "examples",
      title: "Examples",
      description: "real-world utm examples, before/after tracking, and dashboard visualizations",
      icon: Image,
      path: "/resources/examples",
      count: "4 examples"
    },
    {
      name: "glossary",
      title: "Glossary",
      description: "canonical definitions for utm, taxonomy, attribution, and campaign structure",
      icon: BookMarked,
      path: "/resources/glossary",
      count: "6 terms"
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
      <section className="py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-balance">
                resources
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              a knowledge system for clean tracking, utm governance, and analytics clarity.
            </p>
          </div>
        </div>
      </section>

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

export default Resources;
