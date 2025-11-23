import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, MapPin, Building2, Sparkles } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { SalaryFilters } from "@/components/tools/SalaryFilters";
import { SalaryBarChart } from "@/components/tools/SalaryBarChart";
import { SalaryDistributionChart } from "@/components/tools/SalaryDistributionChart";
import { getSalaryForRole, formatCurrency } from "@/lib/salaryData";
import { motion } from "framer-motion";

const SalaryBenchmark2025 = () => {
  const [selectedRole, setSelectedRole] = useState("Marketing Manager");
  
  const salaryData = getSalaryForRole(selectedRole);
  
  const keyFindings = [
    { 
      label: "avg salary jump", 
      value: "+33.5%", 
      description: "from Manager to Senior Manager"
    },
    { 
      label: "SF premium", 
      value: "+40%", 
      description: "vs remote roles"
    },
    { 
      label: "median marketing mgr", 
      value: "$95K", 
      description: "across all US markets"
    },
    { 
      label: "top skill premium", 
      value: "+$15K", 
      description: "AI/ML expertise"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border/50">
        <div className="max-w-[1280px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/resources" className="hover:text-foreground transition-apple">
              resources
            </Link>
            <span>/</span>
            <Link to="/resources/reports" className="hover:text-foreground transition-apple">
              reports
            </Link>
            <span>/</span>
            <span className="text-foreground">2025 salary benchmark</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white to-muted/20">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            className="text-center space-y-6 max-w-[900px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="default" className="animate-pulse">FEATURED REPORT</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase">
              2025 global marketing & sales operations salary benchmark report
            </h1>
            <p className="text-xl text-muted-foreground">
              comprehensive salary data across 20+ roles, 50+ markets, and 1,000+ companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="default">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
              <Link to="/resources/tools">
                <Button size="lg" variant="outline">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Use Salary Tools
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 lowercase">
            key findings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFindings.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl font-display font-extrabold text-primary mb-2">
                      {finding.value}
                    </div>
                    <CardTitle className="text-lg font-medium lowercase">
                      {finding.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {finding.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Salary Explorer */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 lowercase">
              interactive salary explorer
            </h2>
            <p className="text-lg text-muted-foreground">
              explore salary data by role, location, company size, and experience
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-8">
              <SalaryFilters onFilterChange={(filters) => setSelectedRole(filters.role)} />
              
              {salaryData && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-display font-bold mb-6 text-foreground">
                        salary percentiles
                      </h3>
                      <SalaryBarChart
                        role={selectedRole}
                        p10={salaryData.baseCompensation.p10}
                        p25={salaryData.baseCompensation.p25}
                        p50={salaryData.baseCompensation.p50}
                        p75={salaryData.baseCompensation.p75}
                        p90={salaryData.baseCompensation.p90}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold mb-6 text-foreground">
                        salary distribution
                      </h3>
                      <SalaryDistributionChart
                        p10={salaryData.baseCompensation.p10}
                        p25={salaryData.baseCompensation.p25}
                        p50={salaryData.baseCompensation.p50}
                        p75={salaryData.baseCompensation.p75}
                        p90={salaryData.baseCompensation.p90}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground lowercase">
                          median base salary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-display font-bold text-foreground">
                          {formatCurrency(salaryData.baseCompensation.p50)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground lowercase">
                          total comp (w/ equity)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-display font-bold text-foreground">
                          {formatCurrency(salaryData.totalComp.p50)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground lowercase">
                          years experience
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-display font-bold text-foreground">
                          {salaryData.experienceYears}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8 lowercase">
            methodology
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This report aggregates salary data from 1,000+ companies across marketing and sales operations roles. 
                  Data sources include self-reported compensation, verified job postings, and industry surveys.
                </p>
                <p>
                  All salary figures represent base compensation unless otherwise specified. Total compensation includes 
                  estimated equity value over 4-year vesting periods.
                </p>
                <p className="text-sm">
                  <strong>Last Updated:</strong> January 2025 | <strong>Sample Size:</strong> 1,247 responses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA to Tools */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-[640px] mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            take action with salary tools
          </h2>
          <p className="text-lg text-muted-foreground">
            use our interactive tools for personalized salary negotiation, career planning, and team budgeting
          </p>
          <Link to="/resources/tools">
            <Button size="lg" variant="default">
              Explore Salary Tools
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SalaryBenchmark2025;