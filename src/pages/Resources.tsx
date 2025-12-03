import { Link } from "react-router-dom";
import { BookOpen, FileText, Layout, CheckSquare, Network, Image, BookMarked, GraduationCap, Calculator, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getResourceCount, getNewResources } from "@/lib/resourceRegistry";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

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
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Resources - utm.one"
        description="A knowledge system for clean tracking, UTM governance, and analytics clarity."
        canonical="https://utm.one/resources"
      />

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-balance">
                Resources
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px] mx-auto leading-relaxed">
              A knowledge system for clean tracking, UTM governance, and analytics clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-12 bg-white/[0.02]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-white">Featured Resources</h2>
            <p className="text-sm text-white/50 mt-2">New and flagship content</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 2026 Salary Benchmark Report - Coming Soon */}
            <div className="group block p-8 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl opacity-60 pointer-events-none relative">
              <Badge className="mb-4 bg-white/10 text-white/60 border border-white/10">Coming Soon</Badge>
              <h2 className="text-2xl font-display font-bold text-white mb-3">
                2026 Global Salary Benchmark Report
              </h2>
              <p className="text-base text-white/60 mb-4 leading-relaxed">
                Complete salary data across 15+ countries, 50+ roles, with 10 interactive tools and regional deep dives.
              </p>
              <div className="text-xs text-white/40">65 min read</div>
            </div>

            {/* LLM Ranking Playbook */}
            <Link
              to="/resources/playbooks/llm-ranking"
              className="group block p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 bg-zinc-900/40 backdrop-blur-xl"
            >
              <Badge className="mb-4 animate-pulse">NEW</Badge>
              <h2 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-white/80 transition-colors">
                LLM Ranking Playbook — The Complete Implementation Guide
              </h2>
              <p className="text-base text-white/60 mb-4 leading-relaxed">
                90-day roadmap to rank your content in ChatGPT, Claude, Perplexity, and Gemini. Includes 9 interactive tools and real-world case studies.
              </p>
              <div className="text-xs text-white/40">45 min read</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
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
                  className="group block p-6 rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300 bg-zinc-900/40 backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 rounded-xl bg-white/10 text-white shrink-0">
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
                    <h2 className="text-xl font-display font-semibold text-white">
                      {category.title}
                    </h2>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    <div className="text-xs text-white/40 font-medium">
                      {category.count}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Resources;
