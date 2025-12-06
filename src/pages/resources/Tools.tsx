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
import { SEO } from "@/components/seo/SEO";
import { MainLayout } from "@/components/layout/MainLayout";

const Tools = () => {
  const tools = [
    {
      slug: "salary-negotiation-coach",
      title: "AI Salary Negotiation Coach",
      description: "conversational ai that generates personalized negotiation scripts, leverage points, and practice scenarios based on real salary benchmarks",
      icon: MessageSquare,
      comingSoon: false
    },
    {
      slug: "market-value-calculator",
      title: "Market Value Calculator",
      description: "real-time percentile ranking with 5-10 year career projections and skills premium recommendations",
      icon: TrendingUp,
      comingSoon: false
    },
    {
      slug: "career-path-optimizer",
      title: "Career Path Optimizer",
      description: "analyzes your current role and suggests optimal next moves with salary impact, timeline, and required skills",
      icon: Route,
      comingSoon: false
    },
    {
      slug: "job-offer-analyzer",
      title: "Job Offer Decision Matrix",
      description: "compares offers to market benchmarks, adjusts for cost of living, and generates ai-powered pros/cons analysis",
      icon: FileCheck,
      comingSoon: false
    },
    {
      slug: "team-budget-optimizer",
      title: "Team Budget Optimizer",
      description: "suggests optimal team composition, seniority trade-offs, and geographic arbitrage opportunities for hiring managers",
      icon: Users,
      comingSoon: false
    },
    {
      slug: "ai-vs-human-roi",
      title: "AI vs. Human ROI Calculator",
      description: "shows which roles are at risk, ai skills premium, and break-even analysis for tool investments vs. headcount",
      icon: Bot,
      comingSoon: false
    },
    {
      slug: "compensation-transparency",
      title: "Compensation Transparency Generator",
      description: "creates salary bands, pay equity analysis, and 'we pay fair' badges for companies committed to transparency",
      icon: Shield,
      comingSoon: false
    },
    {
      slug: "linkedin-reality-check",
      title: "LinkedIn Reality Check",
      description: "paste job descriptions to see if salary ranges are competitive and identify unrealistic 'unicorn' requirements",
      icon: Search,
      comingSoon: false
    }
  ];

  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Interactive Tools - Salary & Career Calculators"
        description="Interactive calculators for salary negotiation, career planning, market value assessment, and team budgeting. Backed by real GTM salary data."
        canonical="https://utm.one/resources/tools"
        keywords={['salary calculator', 'career planning tools', 'market value calculator', 'negotiation coach', 'team budget tools']}
      />

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-balance">
                Tools
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px] mx-auto leading-relaxed">
              Interactive calculators for salary negotiation, career planning, and team budgeting. Backed by real market data.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  to={`/resources/tools/${tool.slug}`}
                  className="group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="animate-pulse bg-primary text-primary-foreground">NEW</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-display font-semibold text-white">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Sources Stats Grid */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold mb-2 lowercase text-white">
              backed by real data
            </h2>
            <p className="text-white/60">
              All tools powered by our 2026 Global Salary Benchmark Report
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Survey Respondents", value: "20,000+" },
              { label: "SHRM Data Points", value: "500K+" },
              { label: "Salary Records", value: "2M+" },
              { label: "Job Postings", value: "50,000+" },
              { label: "Countries", value: "15+" },
              { label: "Roles Covered", value: "50+" }
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Tools;