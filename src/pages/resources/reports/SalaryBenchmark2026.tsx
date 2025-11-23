import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, Globe, Users, CheckCircle2, Database, Building2 } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DataSourcesBadges } from "@/components/reports/DataSourcesBadges";
import { GeolocationDetector } from "@/components/reports/GeolocationDetector";
import { MegaTrendsSection } from "@/components/reports/MegaTrendsSection";
import { MarketingSalarySection } from "@/components/reports/MarketingSalarySection";
import { SalesSalarySection } from "@/components/reports/SalesSalarySection";
import { RevOpsMarkOpsSection } from "@/components/reports/RevOpsMarkOpsSection";
import { RegionalDeepDives } from "@/components/reports/RegionalDeepDives";
import { SkillDemandAnalysis } from "@/components/reports/SkillDemandAnalysis";
import { NegotiationBlueprint } from "@/components/reports/NegotiationBlueprint";
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

  // LinkedIn Post Card Placeholder Component
  const LinkedInPostCard = ({ postNumber }: { postNumber: number }) => (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card className="bg-[hsl(184,92%,18%)]/5 border-[hsl(184,92%,18%)]/20 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          💬 Share this insight on LinkedIn
        </p>
        <p className="text-lg font-semibold text-foreground mb-4">
          LinkedIn Post Card #{postNumber}
        </p>
        <Button variant="outline" size="sm" className="border-[hsl(184,92%,18%)] text-[hsl(184,92%,18%)]">
          Share on LinkedIn
        </Button>
      </Card>
    </div>
  );

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

      {/* CTA #2: After Executive Summary */}
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

      {/* SECTION 1: MegaTrendsSection */}
      <MegaTrendsSection />

      {/* CTA #3: After Mega-Trends */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(184,92%,18%)]/5 to-[hsl(18,100%,51%)]/5 border-2 border-[hsl(184,92%,18%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            Ready to Check Your True Market Value?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Use our advanced salary calculator to see exactly where you stand based on role, skills, location, and company size.
          </p>
          <Button size="lg" className="bg-[hsl(184,92%,18%)] hover:bg-[hsl(184,92%,18%)]/90 text-white">
            Check Your True Market Value
          </Button>
        </Card>
      </div>

      {/* SECTION 2: Marketing Salary Benchmarks */}
      <MarketingSalarySection />

      {/* LinkedIn Post Card #2 */}
      <LinkedInPostCard postNumber={2} />

      {/* CTA #6: After Marketing */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/5 to-white border-2 border-[hsl(18,100%,51%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            See How Your Role Stacks Up
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Compare your current compensation against global benchmarks and discover your skill gaps.
          </p>
          <Button size="lg" className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white">
            Get My Personalized Report
          </Button>
        </Card>
      </div>

      {/* SECTION 3: Sales Salary Benchmarks */}
      <SalesSalarySection />

      {/* LinkedIn Post Card #3 */}
      <LinkedInPostCard postNumber={3} />

      {/* SECTION 4: RevOps & MarkOps Benchmarks */}
      <RevOpsMarkOpsSection />

      {/* LinkedIn Post Card #4 */}
      <LinkedInPostCard postNumber={4} />

      {/* SECTION 5: Regional Deep Dives */}
      <RegionalDeepDives />

      {/* CTA #4: After Regional Deep Dives */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(184,92%,18%)]/5 to-white border-2 border-[hsl(184,92%,18%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            Compare Your Salary Globally
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            See how your compensation compares across 15+ countries and 100+ cities with our interactive calculator.
          </p>
          <Button size="lg" className="bg-[hsl(184,92%,18%)] hover:bg-[hsl(184,92%,18%)]/90 text-white">
            Compare My Salary Globally
          </Button>
        </Card>
      </div>

      {/* LinkedIn Post Card #5 */}
      <LinkedInPostCard postNumber={5} />

      {/* SECTION 6: Skill Demand Analysis */}
      <SkillDemandAnalysis />

      {/* CTA #7: After Skill Demand */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/5 to-white border-2 border-[hsl(18,100%,51%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            Highlight Your Missing Skills
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Get a personalized skill gap analysis showing which high-value skills you should learn next.
          </p>
          <Button size="lg" className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white">
            Show Me My Skill Gaps
          </Button>
        </Card>
      </div>

      {/* LinkedIn Post Card #6 */}
      <LinkedInPostCard postNumber={6} />

      {/* SECTION 7: Negotiation Blueprint */}
      <NegotiationBlueprint />

      {/* SECTION 8: Enhanced Salary Calculator */}
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
          
          {/* CTA #5: Calculator Save Results */}
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

      {/* CTA #11: Final Push */}
      <div className="max-w-[1280px] mx-auto px-8 py-16">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/10 to-[hsl(184,92%,18%)]/10 border-2 border-[hsl(18,100%,51%)]/30 p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Get Your Personal GTM Career Report
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-[700px] mx-auto">
            Everything in this report, personalized for your exact role, location, experience, and career goals. Plus quarterly updates as new data becomes available.
          </p>
          <Button size="lg" className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white text-lg px-8 py-6">
            Get My Personal Report
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Used by 10,000+ GTM professionals to negotiate higher salaries
          </p>
        </Card>
      </div>

      {/* CTA #12: Sticky Side Button - Always Visible */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white shadow-2xl">
          <Download className="mr-2 h-5 w-5" />
          Download Report
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default SalaryBenchmark2026;