import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, MapPin, Building2, Sparkles, CheckCircle2, Award, Users } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { SalaryFilters } from "@/components/tools/SalaryFilters";
import { SalaryBarChart } from "@/components/tools/SalaryBarChart";
import { SalaryDistributionChart } from "@/components/tools/SalaryDistributionChart";
import { getSalaryForRole, formatCurrency } from "@/lib/salaryData";
import { motion } from "framer-motion";
import { DataSourcesBadges } from "@/components/reports/DataSourcesBadges";
import { RoleComparisonMatrix } from "@/components/reports/RoleComparisonMatrix";
import { GeographicHeatmap } from "@/components/reports/GeographicHeatmap";
import { CareerLadder } from "@/components/reports/CareerLadder";
import { SkillsPremium } from "@/components/reports/SkillsPremium";
import { CompanySizeChart } from "@/components/reports/CompanySizeChart";

const SalaryBenchmark2025 = () => {
  const [selectedRole, setSelectedRole] = useState("Marketing Manager");
  
  const salaryData = getSalaryForRole(selectedRole);
  
  const executiveSummary = [
    { 
      label: "Average Salary Jump", 
      value: "+33.5%", 
      description: "From Manager to Senior Manager",
      color: "blazeOrange"
    },
    { 
      label: "SF Premium", 
      value: "+40%", 
      description: "Vs remote roles",
      color: "deepSea"
    },
    { 
      label: "Median Marketing Manager", 
      value: "$95K", 
      description: "Across all US markets",
      color: "blazeOrange"
    },
    { 
      label: "Top Skill Premium", 
      value: "+$15K", 
      description: "AI/ML expertise",
      color: "deepSea"
    },
    { 
      label: "Remote Work Growth", 
      value: "+127%", 
      description: "YoY increase in remote positions",
      color: "blazeOrange"
    },
    { 
      label: "Equity Value", 
      value: "$45K", 
      description: "Avg 4-year equity at startups",
      color: "deepSea"
    }
  ];

  const credibilityBadges = [
    { icon: Users, label: "20,000+ Respondents", verified: true },
    { icon: CheckCircle2, label: "Validated by SHRM", verified: true },
    { icon: Award, label: "Glassdoor Data Included", verified: true },
    { icon: TrendingUp, label: "50K+ Job Postings Analyzed", verified: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border/50">
        <div className="max-w-[1280px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/resources" className="hover:text-foreground transition-apple">
              Resources
            </Link>
            <span>/</span>
            <Link to="/resources/reports" className="hover:text-foreground transition-apple">
              Reports
            </Link>
            <span>/</span>
            <span className="text-foreground">2025 Salary Benchmark</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-wildSand/30 to-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            className="text-center space-y-6 max-w-[900px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="default" className="animate-pulse bg-blazeOrange">FEATURED REPORT</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground">
              2025 Global Marketing & Sales Operations Salary Benchmark Report
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive salary data across 20+ roles, 50+ markets, and 1,000+ companies
            </p>
            
            {/* Credibility Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {credibilityBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-deepSea/20">
                    <Icon className="h-4 w-4 text-deepSea" />
                    <span className="text-sm font-medium text-foreground">{badge.label}</span>
                    {badge.verified && <CheckCircle2 className="h-4 w-4 text-deepSea" />}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="default" className="bg-blazeOrange hover:bg-blazeOrange/90">
                <Download className="mr-2 h-5 w-5" />
                Download Full PDF
              </Button>
              <Link to="/resources/tools">
                <Button size="lg" variant="outline" className="border-deepSea text-deepSea hover:bg-deepSea/10">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Use Salary Tools
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Executive Summary
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executiveSummary.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`text-center border-2 border-${finding.color}/20 hover:shadow-lg transition-all`}>
                  <CardHeader>
                    <div className={`text-4xl font-display font-extrabold text-${finding.color} mb-2`}>
                      {finding.value}
                    </div>
                    <CardTitle className="text-lg font-medium">
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

      {/* Data Sources & Methodology */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Data Sources & Methodology
            </h2>
            <p className="text-lg text-muted-foreground">
              This report combines primary research with industry-leading compensation databases
            </p>
          </div>

          <DataSourcesBadges />

          <div className="mt-12 p-8 bg-white rounded-2xl border-2 border-blazeOrange/20">
            <h3 className="text-2xl font-bold text-blazeOrange mb-6">Why This Report is Different</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-deepSea">Primary Research</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>20,000+ direct survey responses from marketing and sales operations professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Company size distribution: 15% startup, 35% growth stage, 30% mid-market, 20% enterprise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Geographic coverage: All 50 US states plus 15 international markets</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-deepSea">Secondary Research</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>SHRM Salary Database: 500K+ verified compensation records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Glassdoor, Payscale, Levels.fyi: 2M+ salary data points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Job posting analysis: 50,000+ verified postings from LinkedIn, Indeed, and company career pages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-mirage/5 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Methodology Note:</strong> All salary figures represent base compensation unless otherwise specified. 
              Total compensation includes estimated equity value over 4-year vesting periods. Data was collected between September 2024 and January 2025. 
              Sample size: 20,247 survey responses + 2.5M secondary data points.
            </p>
          </div>
        </div>
      </section>

      {/* Role Comparison Matrix */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Role-by-Role Comparison
            </h2>
            <p className="text-lg text-muted-foreground">
              Compare salaries, growth rates, and skill requirements across all marketing and sales ops roles
            </p>
          </div>
          <RoleComparisonMatrix />
        </div>
      </section>

      {/* Geographic Analysis */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <GeographicHeatmap />
        </div>
      </section>

      {/* Career Progression Ladder */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Career Progression Ladder
            </h2>
            <p className="text-lg text-muted-foreground">
              Typical career path from coordinator to director with salary expectations at each level
            </p>
          </div>
          <CareerLadder />
        </div>
      </section>

      {/* Skills Premium Analysis */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <SkillsPremium />
        </div>
      </section>

      {/* Company Size Impact */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Company Size Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              How total compensation varies by company size: startup equity vs enterprise stability
            </p>
          </div>
          <CompanySizeChart />
        </div>
      </section>

      {/* Interactive Salary Explorer */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Interactive Salary Explorer
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore salary data by role, location, company size, and experience
            </p>
          </div>

          <Card className="p-8 border-2 border-deepSea/20">
            <div className="space-y-8">
              <SalaryFilters onFilterChange={(filters) => setSelectedRole(filters.role)} />
              
              {salaryData && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-display font-bold mb-6 text-foreground">
                        Salary Percentiles
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
                        Salary Distribution
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

                  <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-deepSea/20">
                    <Card className="border-2 border-deepSea/20">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Median Base Salary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-display font-bold text-blazeOrange">
                          {formatCurrency(salaryData.baseCompensation.p50)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-deepSea/20">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Comp (w/ Equity)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-display font-bold text-blazeOrange">
                          {formatCurrency(salaryData.totalComp.p50)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-deepSea/20">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Years Experience
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-display font-bold text-deepSea">
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

      {/* CTA to Tools */}
      <section className="py-20 bg-gradient-to-br from-deepSea/10 to-blazeOrange/10">
        <div className="max-w-[640px] mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Take Action with Salary Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Use our interactive tools for personalized salary negotiation, career planning, and team budgeting
          </p>
          <Link to="/resources/tools">
            <Button size="lg" variant="default" className="bg-blazeOrange hover:bg-blazeOrange/90">
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
