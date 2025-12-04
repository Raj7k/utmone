import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getResourcesByCategory } from "@/lib/resourceRegistry";
import { MainLayout } from "@/components/layout/MainLayout";

const Reports = () => {
  const reports = getResourcesByCategory('reports');

  return (
    <MainLayout showAnnouncement={false}>
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Link to="/resources" className="hover:text-white transition-colors">
              resources
            </Link>
            <span>/</span>
            <span className="text-white">Reports</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold hero-gradient">
              Reports
            </h1>
            <p className="text-xl text-white/60 max-w-[640px] mx-auto">
              Data-driven research reports on salaries, market trends, and industry benchmarks
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid gap-8">
            {reports.map((report, index) => (
              <motion.div
                key={report.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/resources/reports/${report.slug}`}>
                  <div className="group bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] p-8">
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/10" style={{ color: 'rgba(59,130,246,1)' }}>
                          <TrendingUp className="h-8 w-8" />
                        </div>
                        {report.badge && (
                          <Badge variant={report.badge === 'FEATURED' ? 'default' : 'secondary'} className="animate-pulse">
                            {report.badge}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-2xl font-display font-bold text-white group-hover:text-white/80 transition-colors">
                        {report.title}
                      </h2>
                      <p className="text-base mt-2 text-white/60">
                        Comprehensive salary data across 30+ roles, 15+ countries, 100+ cities, and 8 industries
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1">
                          Explore Report
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-display font-bold text-white">30+</div>
                            <div className="text-sm text-white/60">Roles</div>
                          </div>
                          <div>
                            <div className="text-2xl font-display font-bold text-white">15+</div>
                            <div className="text-sm text-white/60">Countries</div>
                          </div>
                          <div>
                            <div className="text-2xl font-display font-bold text-white">100+</div>
                            <div className="text-sm text-white/60">Cities</div>
                          </div>
                          <div>
                            <div className="text-2xl font-display font-bold text-white">50K+</div>
                            <div className="text-sm text-white/60">Job Postings</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/[0.02]">
        <div className="max-w-[640px] mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Want More Insights?
          </h2>
          <p className="text-lg text-white/60">
            Explore our interactive salary tools for personalized analysis and negotiation support
          </p>
          <Link to="/resources/tools">
            <Button size="lg" variant="default" className="mt-4">
              View Salary Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Reports;