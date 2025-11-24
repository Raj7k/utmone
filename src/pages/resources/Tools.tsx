import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  TrendingUp, 
  Route, 
  FileCheck, 
  Users, 
  Bot, 
  Shield, 
  Search 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Tools = () => {
  const tools = [
    {
      slug: "salary-negotiation-coach",
      title: "AI Salary Negotiation Coach",
      description: "conversational ai that generates personalized negotiation scripts, leverage points, and practice scenarios based on real salary benchmarks",
      icon: MessageSquare,
      viralHook: "people share their negotiation wins",
      comingSoon: false
    },
    {
      slug: "market-value-calculator",
      title: "Market Value Calculator",
      description: "real-time percentile ranking with 5-10 year career projections and skills premium recommendations",
      icon: TrendingUp,
      viralHook: "shareable market value cards for linkedin",
      comingSoon: false
    },
    {
      slug: "career-path-optimizer",
      title: "Career Path Optimizer",
      description: "analyzes your current role and suggests optimal next moves with salary impact, timeline, and required skills",
      icon: Route,
      viralHook: "personalized career roadmaps",
      comingSoon: false
    },
    {
      slug: "job-offer-analyzer",
      title: "Job Offer Decision Matrix",
      description: "compares offers to market benchmarks, adjusts for cost of living, and generates ai-powered pros/cons analysis",
      icon: FileCheck,
      viralHook: "anonymous 'rate my offer' community",
      comingSoon: false
    },
    {
      slug: "team-budget-optimizer",
      title: "Team Budget Optimizer",
      description: "suggests optimal team composition, seniority trade-offs, and geographic arbitrage opportunities for hiring managers",
      icon: Users,
      viralHook: "shareable team structure visualizations",
      comingSoon: false
    },
    {
      slug: "ai-vs-human-roi",
      title: "AI vs. Human ROI Calculator",
      description: "shows which roles are at risk, ai skills premium, and break-even analysis for tool investments vs. headcount",
      icon: Bot,
      viralHook: "controversial insights about ai replacement",
      comingSoon: false
    },
    {
      slug: "compensation-transparency",
      title: "Compensation Transparency Generator",
      description: "creates salary bands, pay equity analysis, and 'we pay fair' badges for companies committed to transparency",
      icon: Shield,
      viralHook: "public transparency commitments",
      comingSoon: false
    },
    {
      slug: "linkedin-reality-check",
      title: "LinkedIn Reality Check",
      description: "paste job descriptions to see if salary ranges are competitive and identify unrealistic 'unicorn' requirements",
      icon: Search,
      viralHook: "screenshot-worthy reality checks",
      comingSoon: false
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
                Tools
              </h1>
            </div>
            <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
              Interactive calculators for salary negotiation, career planning, and team budgeting. Backed by real market data.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  to={`/resources/tools/${tool.slug}`}
                  className="group bg-card rounded-2xl p-8 border border-separator hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-primary text-primary-foreground animate-pulse">NEW</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-display font-semibold text-label">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-secondary-label leading-relaxed">
                        {tool.description}
                      </p>
                      <p className="text-xs text-primary/60 italic pt-2">
                        Viral hook: {tool.viralHook}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Sources Note */}
      <section className="py-12 bg-muted/20 border-y border-separator">
        <div className="max-w-[980px] mx-auto px-8 text-center">
          <p className="text-sm text-secondary-label">
            All salary data sourced from 2026 Global Marketing & Sales Operations Benchmark Report
            <br />
            <span className="text-xs">Updated quarterly • Covering 2,000+ roles across 50+ markets</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tools;
