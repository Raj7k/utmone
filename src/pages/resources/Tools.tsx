import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
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
import { SEO } from "@/components/seo/SEO";

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
    <div className="min-h-screen bg-background">
      <SEO 
        title="Interactive Tools - Salary & Career Calculators"
        description="Interactive calculators for salary negotiation, career planning, market value assessment, and team budgeting. Backed by real GTM salary data."
        canonical="https://utm.one/resources/tools"
        keywords={['salary calculator', 'career planning tools', 'market value calculator', 'negotiation coach', 'team budget tools']}
      />
      <Navigation />
      <FloatingNavigation />

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
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Sources Stats Grid */}
      <section className="py-16 bg-muted/20 border-y border-separator">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold mb-2 lowercase">
              backed by real data
            </h2>
            <p className="text-secondary-label">
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
              <div key={stat.label} className="text-center p-4 bg-white rounded-xl border">
                <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-secondary-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tools;
