import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
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
    },
    {
      icon: Users,
      title: "agencies",
      href: "/solutions/agencies",
      description: "multi-client workspaces with white-label reporting",
    },
    {
      icon: Rocket,
      title: "startups",
      href: "/solutions/startups",
      description: "investor-ready analytics that scale from MVP to Series B",
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
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Solutions by Segment & Role - utm.one"
        description="Explore utm.one solutions by company segment (Enterprise, Agencies, Startups) or by role (Marketing, Sales, Ops, Dev, RevOps, Partners, Reporting)."
        canonical="/solutions"
      />

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
              <p className="text-xl md:text-2xl lowercase max-w-3xl mx-auto text-white/60">
                utm.one adapts to your company size, team structure, and role—governance that scales, analytics that don't lie.
              </p>
            </motion.div>
          </div>
        </section>

        {/* By Segment */}
        <section className="py-24 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4 text-white/90">
                by segment
              </h2>
              <p className="text-lg lowercase max-w-2xl text-white/60">
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
                    className="group block p-8 rounded-2xl transition-all duration-300 bg-zinc-900/40 backdrop-blur-[20px] border border-white/10 hover:border-white/20 hover:shadow-[0_25px_50px_-12px_hsl(0_0%_0%_/_0.5)]"
                  >
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-white/10">
                      <solution.icon className="w-8 h-8 text-white/80" />
                    </div>
                    <h3 className="text-2xl font-display font-bold lowercase mb-3 transition-colors text-white/90">
                      {solution.title}
                    </h3>
                    <p className="lowercase text-white/60">
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
              <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4 text-white/90">
                by role
              </h2>
              <p className="text-lg lowercase max-w-2xl text-white/60">
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
                    className="group block p-6 rounded-xl transition-all duration-300 bg-zinc-900/40 backdrop-blur-[20px] border border-white/10 hover:border-white/20 hover:bg-zinc-900/60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors bg-white/10">
                        <solution.icon className="w-6 h-6 text-white/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-display font-bold lowercase mb-2 transition-colors text-white/90">
                          {solution.title}
                        </h3>
                        <p className="text-sm lowercase text-white/60">
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
    </MainLayout>
  );
};

export default Solutions;
