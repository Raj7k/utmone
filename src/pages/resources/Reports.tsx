import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, TrendingUp, ArrowRight } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { getResourcesByCategory } from "@/lib/resourceRegistry";

const Reports = () => {
  const reports = getResourcesByCategory('reports');

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-separator">
        <div className="max-w-[1280px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-secondary-label">
            <Link to="/resources" className="hover:text-label transition-apple">
              resources
            </Link>
            <span>/</span>
            <span className="text-label">Reports</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-label">
              Reports
            </h1>
            <p className="text-xl text-secondary-label max-w-[640px] mx-auto">
              Data-driven research reports on salaries, market trends, and industry benchmarks
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-16 bg-white">
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
                  <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                        {report.badge && (
                          <Badge variant={report.badge === 'FEATURED' ? 'default' : 'secondary'} className="animate-pulse">
                            {report.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                        {report.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        Comprehensive salary data across 30+ roles, 15+ countries, 100+ cities, and 8 industries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Explore Report
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                      <div className="mt-6 pt-6 border-t border-border/50">
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-display font-bold text-foreground">30+</div>
                            <div className="text-sm text-secondary-label">Roles</div>
                          </div>
                          <div>
                            <div className="text-2xl font-display font-bold text-foreground">15+</div>
                            <div className="text-sm text-secondary-label">Countries</div>
                          </div>
                          <div>
                            <div className="text-2xl font-display font-bold text-foreground">100+</div>
                            <div className="text-sm text-secondary-label">Cities</div>
                          </div>
                          <div>
                            <div className="text-2xl font-display font-bold text-foreground">50K+</div>
                            <div className="text-sm text-secondary-label">Job Postings</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[640px] mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-label">
            Want More Insights?
          </h2>
          <p className="text-lg text-secondary-label">
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

      <Footer />
    </div>
  );
};

export default Reports;