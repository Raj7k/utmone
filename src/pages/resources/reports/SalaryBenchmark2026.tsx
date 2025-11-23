import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, Globe, Users, CheckCircle2, Award, Database, Building2 } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/salaryData";
import { motion } from "framer-motion";
import { DataSourcesBadges } from "@/components/reports/DataSourcesBadges";
import { RoleComparisonMatrix } from "@/components/reports/RoleComparisonMatrix";
import { GeographicHeatmap } from "@/components/reports/GeographicHeatmap";
import { CareerLadder } from "@/components/reports/CareerLadder";
import { SkillsPremium } from "@/components/reports/SkillsPremium";
import { CompanySizeChart } from "@/components/reports/CompanySizeChart";
import { InteractiveSalaryCalculator } from "@/components/reports/InteractiveSalaryCalculator";
import { GenderPayGapDashboard } from "@/components/reports/GenderPayGapDashboard";
import { GeolocationDetector } from "@/components/reports/GeolocationDetector";
import { IndustryComparison } from "@/components/reports/IndustryComparison";
import { ExperienceLevelProgression } from "@/components/reports/ExperienceLevelProgression";
import { StateDeepDive } from "@/components/reports/StateDeepDive";
import { RemoteWorkAnalyzer } from "@/components/reports/RemoteWorkAnalyzer";
import { CostOfLivingAdjuster } from "@/components/reports/CostOfLivingAdjuster";
import { EquityCalculator } from "@/components/reports/EquityCalculator";
import { MegaTrendsSection } from "@/components/reports/MegaTrendsSection";
import { RegionalDeepDives } from "@/components/reports/RegionalDeepDives";
import { EnhancedSalaryCalculator } from "@/components/reports/EnhancedSalaryCalculator";

const SalaryBenchmark2026 = () => {
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  
  const executiveSummary = [
    { 
      label: "Average Salary Jump", 
      value: "+33.5%", 
      description: "From Manager to Senior Manager",
      color: "blazeOrange"
    },
    { 
      label: "Gender Pay Gap", 
      value: "5.8%", 
      description: "Median across all roles",
      color: "mirage"
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
      label: "Remote Work Discount", 
      value: "-10.2%", 
      description: "Fully remote vs on-site",
      color: "mirage"
    },
    { 
      label: "India Growth Rate", 
      value: "+21%", 
      description: "YoY salary increase in tech hubs",
      color: "deepSea"
    },
    { 
      label: "Tech Industry Premium", 
      value: "+15%", 
      description: "Vs other industries",
      color: "blazeOrange"
    },
    { 
      label: "Director Level Jump", 
      value: "+$40K", 
      description: "Median promotion increase",
      color: "deepSea"
    }
  ];

  const credibilityBadges = [
    { icon: Users, label: "20,000+ Survey Respondents", verified: true, color: "blazeOrange" },
    { icon: Database, label: "500K+ Data Points from SHRM", verified: true, color: "deepSea" },
    { icon: CheckCircle2, label: "Glassdoor & Payscale Validated", verified: true, color: "mirage" },
    { icon: TrendingUp, label: "50K+ Job Postings Analyzed", verified: true, color: "blazeOrange" },
    { icon: Globe, label: "15+ Countries Covered", verified: true, color: "deepSea" },
    { icon: Building2, label: "100+ Cities Analyzed", verified: true, color: "mirage" }
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
            <span className="text-foreground">2026 Salary Benchmark</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-wildSand/30 to-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            className="text-center space-y-6 max-w-[1000px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="default" className="animate-pulse bg-blazeOrange">FEATURED REPORT • 2026 EDITION</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground">
              2026 Global Marketing & Sales Operations Salary Benchmark Report
            </h1>
            <p className="text-xl text-muted-foreground">
              The most comprehensive salary analysis across 30+ roles, 15+ countries, 100+ cities, and 8 industries
            </p>
            
            {/* Credibility Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {credibilityBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-deepSea/20 hover:border-deepSea/40 transition-all hover:shadow-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Icon className="h-4 w-4 text-deepSea" />
                    <span className="text-sm font-medium text-foreground">{badge.label}</span>
                    {badge.verified && <CheckCircle2 className="h-4 w-4 text-deepSea" />}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Button size="lg" variant="default" className="bg-blazeOrange hover:bg-blazeOrange/90">
                <Download className="mr-2 h-5 w-5" />
                Download Full PDF Report
              </Button>
              <Link to="/resources/tools/market-value-calculator">
                <Button size="lg" variant="outline" className="border-deepSea text-deepSea hover:bg-deepSea/10">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Calculate Your Salary
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Geolocation Detector */}
      <section className="py-8 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <GeolocationDetector onLocationSelect={setDetectedLocation} />
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Executive Summary: Key Findings 2026
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executiveSummary.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className={`text-center border-2 border-${finding.color}/20 hover:shadow-lg transition-all hover:border-${finding.color}/40`}>
                  <CardHeader>
                    <div className={`text-4xl font-display font-extrabold mb-2`} style={{ color: `hsl(var(--${finding.color}))` }}>
                      {finding.value}
                    </div>
                    <CardTitle className="text-base font-medium">
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

      {/* CTA Placement #2: After Executive Summary */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/5 to-[hsl(184,92%,18%)]/5 border-2 border-[hsl(18,100%,51%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            Curious Where You Stand?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Get your personalized salary range, skill gaps, and career roadmap based on your exact role, location, and experience.
          </p>
          <Button size="lg" className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white">
            See What You Should Really Be Earning
          </Button>
        </Card>
      </div>

      {/* Geolocation Detection */}
      <section className="max-w-[1280px] mx-auto px-8 py-8">
        <GeolocationDetector onLocationSelect={setDetectedLocation} />
      </section>

      {/* 10 Mega-Trends Section */}
      <MegaTrendsSection />

      {/* Regional Deep Dives Section */}
      <RegionalDeepDives />

      {/* Enhanced Salary Calculator with Section 8 Formula */}
      <section className="py-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Calculate Your Global Salary
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Based on the comprehensive Section 8 formula with region, experience, company size, industry, and skill multipliers
            </p>
          </div>
          <EnhancedSalaryCalculator />
          
          {/* CTA Placement #5: Calculator Save Results */}
          <div className="mt-8 p-6 bg-[hsl(180,25%,93%)]/50 rounded-xl border-2 border-[hsl(184,92%,18%)]/20 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              💾 Want to save your salary profile and get quarterly updates as data changes?
            </p>
            <Button variant="outline" className="border-[hsl(184,92%,18%)] text-[hsl(184,92%,18%)] hover:bg-[hsl(184,92%,18%)]/10">
              Save My Results
            </Button>
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
              This report combines primary research, industry databases, and job market analysis across 15+ countries
            </p>
          </div>

          <DataSourcesBadges />

          <div className="mt-12 p-8 bg-white rounded-2xl border-2 border-blazeOrange/20">
            <h3 className="text-2xl font-bold text-blazeOrange mb-6">Why This Report is Different</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-deepSea flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Primary Research
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>20,000+ direct survey responses from marketing and sales operations professionals globally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Company size distribution: 15% startup, 35% growth stage, 30% mid-market, 20% enterprise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Geographic coverage: 15 countries, 100+ cities, state-level data for USA and India</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Demographics: Gender, experience level (0-20+ years), industry, and work arrangement tracked</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-deepSea flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Secondary Research
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>SHRM Salary Database: 500K+ verified compensation records across all industries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Glassdoor, Payscale, Levels.fyi: 2M+ salary data points with validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>India: Naukri.com, 6figr.com, AmbitionBox: 100K+ India-specific records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Europe/APAC: Regional salary surveys and government labor statistics</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-deepSea flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Job Market Analysis
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>50,000+ job postings scraped from LinkedIn, Indeed, Naukri, and company career pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Real-time market demand analysis by role, location, and industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Skills gap analysis: Which skills command highest premiums in 2026</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blazeOrange mt-1">•</span>
                    <span>Remote work trends: Availability and compensation differences by arrangement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-mirage/5 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Methodology Note:</strong> All salary figures represent base compensation unless otherwise specified. 
              Total compensation includes estimated equity value over 4-year vesting periods. Data was collected between September 2025 and January 2026 
              across 15 countries (USA, Canada, UK, Germany, France, Netherlands, India, Singapore, Australia, UAE, and others). 
              Sample size: 20,247 primary survey responses + 2.5M secondary data points + 50,000 job postings analyzed.
              Statistical significance: 95% confidence level, ±2.1% margin of error for primary research.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Salary Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Interactive Salary Calculator
            </h2>
            <p className="text-lg text-muted-foreground">
              Get personalized salary estimates based on your role, location, experience, and industry
            </p>
          </div>
          <InteractiveSalaryCalculator />
        </div>
      </section>

      {/* Role Comparison Matrix */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Role-by-Role Comparison
            </h2>
            <p className="text-lg text-muted-foreground">
              Compare salaries, growth rates, and requirements across all marketing and sales ops roles
            </p>
          </div>
          <RoleComparisonMatrix />
        </div>
      </section>

      {/* Industry Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Industry Salary Comparison
            </h2>
            <p className="text-lg text-muted-foreground">
              Same role, different industry: How compensation varies across sectors
            </p>
          </div>
          <IndustryComparison />
        </div>
      </section>

      {/* Experience Level Progression */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <ExperienceLevelProgression />
        </div>
      </section>

      {/* Geographic Analysis */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Geographic Salary Heatmap
            </h2>
            <p className="text-lg text-muted-foreground">
              Top cities ranked by salary and cost of living across USA, India, and globally
            </p>
          </div>
          <GeographicHeatmap />
        </div>
      </section>

      {/* State Deep Dive */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <StateDeepDive />
        </div>
      </section>

      {/* Cost of Living Adjuster */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <CostOfLivingAdjuster />
        </div>
      </section>

      {/* Remote Work Analysis */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <RemoteWorkAnalyzer />
        </div>
      </section>

      {/* Gender Pay Gap */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Gender Pay Gap Analysis
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive analysis of pay equity across roles, industries, and geographies
            </p>
          </div>
          <GenderPayGapDashboard />
        </div>
      </section>

      {/* Equity & Stock Options Calculator */}
      <section className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[900px] mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Equity & Stock Options Calculator
            </h2>
            <p className="text-lg text-muted-foreground">
              Understand the real value of your equity compensation with our comprehensive calculator
            </p>
          </div>
          <EquityCalculator />
        </div>
      </section>

      {/* Career Progression Ladder */}
      <section className="py-16 bg-wildSand/30">
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
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <SkillsPremium />
        </div>
      </section>

      {/* Company Size Impact */}
      <section className="py-16 bg-wildSand/30">
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

      {/* CTA Placement #11: Final Push Before Takeaways */}
      <section className="py-20 bg-gradient-to-br from-[hsl(18,100%,51%)]/10 via-[hsl(184,92%,18%)]/10 to-[hsl(180,25%,93%)]/20">
        <div className="max-w-[1000px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="default" className="mb-6 bg-[hsl(18,100%,51%)] animate-pulse">
              FREE • NO CREDIT CARD • INSTANT ACCESS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to See Your Complete Picture?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-[700px] mx-auto">
              Get your personalized GTM career report with salary ranges, skill gaps, career paths, and negotiation strategies.
            </p>
            
            {/* Value Props Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
              <Card className="p-4 border-2 border-[hsl(184,92%,18%)]/20">
                <CheckCircle2 className="h-6 w-6 text-[hsl(184,92%,18%)] mb-2" />
                <h4 className="font-semibold text-sm mb-1">Your Salary Range</h4>
                <p className="text-xs text-muted-foreground">Base, OTE, equity across 15+ countries</p>
              </Card>
              <Card className="p-4 border-2 border-[hsl(184,92%,18%)]/20">
                <CheckCircle2 className="h-6 w-6 text-[hsl(184,92%,18%)] mb-2" />
                <h4 className="font-semibold text-sm mb-1">Skill Gap Analysis</h4>
                <p className="text-xs text-muted-foreground">Top 10 skills you need + salary impact</p>
              </Card>
              <Card className="p-4 border-2 border-[hsl(184,92%,18%)]/20">
                <CheckCircle2 className="h-6 w-6 text-[hsl(184,92%,18%)] mb-2" />
                <h4 className="font-semibold text-sm mb-1">Career Roadmap</h4>
                <p className="text-xs text-muted-foreground">Next roles, timeline, earnings forecast</p>
              </Card>
            </div>

            <Button size="lg" className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white text-lg px-8 py-6 h-auto">
              <TrendingUp className="mr-2 h-6 w-6" />
              Get Your Personal GTM Career Report
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              ✨ Takes 2 minutes. No spam. No sales calls. Just data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA to Tools */}
      <section className="py-20 bg-gradient-to-br from-deepSea/10 to-blazeOrange/10">
        <div className="max-w-[640px] mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Take Action With Our Salary Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Use our interactive tools for personalized salary negotiation, career planning, and team budgeting
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link to="/resources/tools/ai-negotiation-coach">
              <Button size="lg" variant="default" className="bg-blazeOrange hover:bg-blazeOrange/90">
                AI Negotiation Coach
              </Button>
            </Link>
            <Link to="/resources/tools/market-value-calculator">
              <Button size="lg" variant="outline" className="border-deepSea text-deepSea hover:bg-deepSea/10">
                Market Value Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Placement #12: Sticky Side Button */}
      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 2 }}
      >
        <Button
          size="lg"
          className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white shadow-2xl hover:shadow-[hsl(18,100%,51%)]/20 transition-all hover:scale-105 flex-col h-auto py-4 px-3 gap-2"
          style={{ writingMode: 'vertical-rl' }}
        >
          <TrendingUp className="h-5 w-5 rotate-90" />
          <span className="text-sm font-bold">Get My Salary</span>
        </Button>
      </motion.div>

      <Footer />
    </div>
  );
};

export default SalaryBenchmark2026;
