import { Link } from "react-router-dom";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { Building2, Users, Rocket, TrendingUp, Code, UserPlus, BarChart3, GitBranch, Target } from "lucide-react";
import { motion } from "framer-motion";

const Solutions = () => {
  const segmentSolutions = [
    {
      icon: Building2,
      title: "enterprise",
      href: "/solutions/enterprise",
      description: "governance, attribution, and zero broken links for scaled teams",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: Users,
      title: "agencies",
      href: "/solutions/agencies",
      description: "multi-client workspaces with white-label reporting",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Rocket,
      title: "startups",
      href: "/solutions/startups",
      description: "investor-ready analytics that scale from MVP to Series B",
      color: "from-purple-500/20 to-purple-500/5"
    }
  ];

  const roleSolutions = [
    {
      icon: TrendingUp,
      title: "marketers",
      href: "/solutions/marketers",
      description: "campaign tracking that actually works"
    },
    {
      icon: Target,
      title: "sales",
      href: "/solutions/sales",
      description: "clear attribution from click to close"
    },
    {
      icon: BarChart3,
      title: "marketing ops",
      href: "/solutions/marketing-ops",
      description: "governance without friction"
    },
    {
      icon: Code,
      title: "developers",
      href: "/solutions/developers",
      description: "APIs built for speed and reliability"
    },
    {
      icon: GitBranch,
      title: "revops",
      href: "/solutions/revops",
      description: "unified data across the revenue stack"
    },
    {
      icon: UserPlus,
      title: "partner managers",
      href: "/solutions/partner-managers",
      description: "zero-effort partner attribution"
    },
    {
      icon: BarChart3,
      title: "reporting team",
      href: "/solutions/reporting-team",
      description: "dashboards that don't lie"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Solutions by Segment & Role - utm.one"
        description="Explore utm.one solutions by company segment (Enterprise, Agencies, Startups) or by role (Marketing, Sales, Ops, Dev, RevOps, Partners, Reporting)."
        canonical="/solutions"
      />
      
      <Navigation />
      <FloatingNavigation />

      <main className="relative">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="max-w-text-content mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold lowercase mb-6 hero-gradient">
                find your solution
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground lowercase max-w-3xl mx-auto">
                utm.one adapts to your company size, team structure, and role—governance that scales, analytics that don't lie.
              </p>
            </motion.div>
          </div>
        </section>

        {/* By Segment */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">
                by segment
              </h2>
              <p className="text-lg text-muted-foreground lowercase max-w-2xl">
                choose the solution built for your company type
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {segmentSolutions.map((solution, index) => (
                <motion.div
                  key={solution.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={solution.href}
                    className="group block p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <solution.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold lowercase mb-3 text-foreground group-hover:text-primary transition-colors">
                      {solution.title}
                    </h3>
                    <p className="text-muted-foreground lowercase">
                      {solution.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* By Role */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">
                by role
              </h2>
              <p className="text-lg text-muted-foreground lowercase max-w-2xl">
                see how utm.one solves your specific challenges
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roleSolutions.map((solution, index) => (
                <motion.div
                  key={solution.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    to={solution.href}
                    className="group block p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <solution.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-display font-bold lowercase mb-2 text-foreground group-hover:text-primary transition-colors">
                          {solution.title}
                        </h3>
                        <p className="text-sm text-muted-foreground lowercase">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Solutions;
