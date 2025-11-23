import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, Globe, Users, CheckCircle2, Database, Building2, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ReportNavigation } from "@/components/reports/ReportNavigation";
import { ReportTableOfContents } from "@/components/reports/ReportTableOfContents";
import { ProgressIndicator } from "@/components/reports/ProgressIndicator";
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
import { Section8Narrative } from "@/components/reports/Section8Narrative";
import { LinkedInPostCard1 } from "@/components/reports/linkedin-cards/LinkedInPostCard1";
import { LinkedInPostCard2 } from "@/components/reports/linkedin-cards/LinkedInPostCard2";
import { LinkedInPostCard3 } from "@/components/reports/linkedin-cards/LinkedInPostCard3";
import { LinkedInPostCard4 } from "@/components/reports/linkedin-cards/LinkedInPostCard4";
import { LinkedInPostCard5 } from "@/components/reports/linkedin-cards/LinkedInPostCard5";
import { LinkedInPostCard6 } from "@/components/reports/linkedin-cards/LinkedInPostCard6";
import { LinkedInPostCard7 } from "@/components/reports/linkedin-cards/LinkedInPostCard7";
import { WalkAwayCalculator } from "@/components/reports/tools/WalkAwayCalculator";
import { CounterOfferAnalyzer } from "@/components/reports/tools/CounterOfferAnalyzer";
import { SkillsROICalculator } from "@/components/reports/tools/SkillsROICalculator";
import { InteractiveWorldMap } from "@/components/reports/visualizations/InteractiveWorldMap";
import { USStateMap } from "@/components/reports/visualizations/USStateMap";
import { IndiaStateMap } from "@/components/reports/visualizations/IndiaStateMap";
import { Footer } from "@/components/landing/Footer";
import { WhyThisReportSection } from "@/components/reports/WhyThisReportSection";
import { MethodologySection } from "@/components/reports/MethodologySection";
import { PDFDownloadSection } from "@/components/reports/PDFDownloadSection";
import { ScrollReveal } from "@/components/reports/ScrollReveal";
import { AnimatedCounter } from "@/components/reports/AnimatedCounter";
import { PersonalizedReportModal } from "@/components/reports/modals/PersonalizedReportModal";
import { ReportModeProvider, useReportMode } from "@/contexts/ReportModeContext";
import { ModeToggle } from "@/components/reports/ModeToggle";
import { TeamBudgetOptimizer } from "@/components/reports/tools/TeamBudgetOptimizer";
import { HiringCompetitivenessDashboard } from "@/components/reports/tools/HiringCompetitivenessDashboard";
import { RetentionRiskCalculator } from "@/components/reports/tools/RetentionRiskCalculator";
import { TeamSkillsGapAnalyzer } from "@/components/reports/tools/TeamSkillsGapAnalyzer";
import { BrandQuote } from "@/components/reports/BrandQuote";

const SalaryBenchmark2026Content = () => {
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [showPersonalizedModal, setShowPersonalizedModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const { isEmployeeMode, isEmployerMode, mode } = useReportMode();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
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
      {/* Sticky Navigation */}
      <ReportNavigation onScrollToSection={scrollToSection} />
      
      {/* Mode Toggle */}
      <ModeToggle />
      
      {/* Table of Contents (Desktop Only) - Fixed with proper margin */}
      <ReportTableOfContents onScrollToSection={scrollToSection} />
      
      {/* Mode Indicator Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`py-4 text-center font-medium border-y-2 ${
            isEmployeeMode
              ? 'bg-blazeOrange/10 text-blazeOrange border-blazeOrange/20'
              : 'bg-deepSea/10 text-deepSea border-deepSea/20'
          }`}
        >
          {isEmployeeMode ? (
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              <strong>Employee View:</strong> Focused on salary negotiation, career progression, and skill development
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              <strong>Employer View:</strong> Focused on hiring benchmarks, team budgets, and retention strategies
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Main Content Wrapper - Add right margin for sidebar on xl+ screens */}
      <div className="xl:mr-[280px]">

      {/* Breadcrumb */}
      <div className="border-b border-border/50">
        <div className="max-w-[1280px] mx-auto px-8 py-3">
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
      <section className="py-16 bg-gradient-to-br from-wildSand/30 to-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            className="text-center space-y-6 max-w-[1000px] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="default" className="animate-pulse bg-blazeOrange">FEATURED REPORT • 2026 EDITION</Badge>
            
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight">
                The World's First Open-Source GTM Salary Report
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
              Global salary benchmarks, skill trends, and hiring patterns without gates, paywalls, or guesswork. Just clear, transparent data for every GTM professional.
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

            <div className="flex flex-col items-center justify-center gap-3 pt-6">
              <Button
                size="lg"
                onClick={() => setShowPDFModal(true)}
                className="bg-gradient-to-r from-blazeOrange to-blazeOrange/90 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Full Report
              </Button>
              <button 
                onClick={() => scrollToSection('calculator-section')}
                className="text-sm text-muted-foreground hover:text-foreground transition-apple underline"
              >
                Or calculate your salary now →
              </button>
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

      {/* Why This Report Section (2nd Fold) */}
      <WhyThisReportSection />

      {/* Methodology Section (3rd Fold) */}
      <MethodologySection />

      {/* Executive Summary */}
      <section id="executive-summary" className="py-20 bg-white">
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

      {/* CTA #2: After Executive Summary - Mode-Specific */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/5 to-[hsl(184,92%,18%)]/5 border-2 border-[hsl(18,100%,51%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            {isEmployeeMode ? "Curious Where You Stand?" : "Planning Your Next Hire?"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            {isEmployeeMode 
              ? "Get your personalized salary range, skill gaps, and career roadmap based on your exact role, location, and experience."
              : "Get competitive salary benchmarks and team budget recommendations for your next GTM hire."
            }
          </p>
          <Button 
            size="lg" 
            onClick={() => scrollToSection('calculator-section')}
            className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white"
          >
            {isEmployeeMode ? "See What You Should Really Be Earning" : "Build Your Hiring Budget"}
          </Button>
        </Card>
      </div>

      {/* LinkedIn Post Card #1 */}
      <LinkedInPostCard1 />

      {/* BRAND QUOTE #1 */}
      <BrandQuote text="clarity creates confidence" position="center" />

      {/* SECTION 1: MegaTrendsSection */}
      <div id="mega-trends">
        <MegaTrendsSection />
      </div>

      {/* CTA #3: After Mega-Trends - Mode-Specific */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(184,92%,18%)]/5 to-[hsl(18,100%,51%)]/5 border-2 border-[hsl(184,92%,18%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            {isEmployeeMode ? "Ready to Check Your True Market Value?" : "Benchmark Your Team's Compensation"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            {isEmployeeMode
              ? "Use our advanced salary calculator to see exactly where you stand based on role, skills, location, and company size."
              : "Compare your current team salaries against market benchmarks and identify retention risks."
            }
          </p>
          <Button 
            size="lg" 
            onClick={() => scrollToSection('calculator-section')}
            className="bg-[hsl(184,92%,18%)] hover:bg-[hsl(184,92%,18%)]/90 text-white"
          >
            {isEmployeeMode ? "Check Your True Market Value" : "Analyze Team Compensation"}
          </Button>
        </Card>
      </div>

      {/* SECTION 2: Marketing Salary Benchmarks */}
      <div id="marketing-section">
        <MarketingSalarySection />
      </div>

      {/* LinkedIn Post Card #2 */}
      <LinkedInPostCard2 />

      {/* BRAND QUOTE #2 */}
      <BrandQuote text="know your worth" position="center" />

      {/* CTA #6: After Marketing */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/5 to-white border-2 border-[hsl(18,100%,51%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            See How Your Role Stacks Up
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Compare your current compensation against global benchmarks and discover your skill gaps.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowPersonalizedModal(true)}
            className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white"
          >
            Get My Personalized Report
          </Button>
        </Card>
      </div>

      {/* SECTION 3: Sales Salary Benchmarks */}
      <div id="sales-section">
        <SalesSalarySection />
      </div>

      {/* LinkedIn Post Card #3 */}
      <LinkedInPostCard3 />

      {/* BRAND QUOTE #3 */}
      <BrandQuote text="clean data. clear decisions." position="center" />

      {/* SECTION 4: RevOps & MarkOps Benchmarks */}
      <div id="revops-section">
        <RevOpsMarkOpsSection />
      </div>

      {/* LinkedIn Post Card #4 */}
      <LinkedInPostCard4 />

      {/* SECTION 5: Regional Deep Dives */}
      <div id="regional-section">
        <RegionalDeepDives />
      </div>

      {/* CTA #4: After Regional Deep Dives */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(184,92%,18%)]/5 to-white border-2 border-[hsl(184,92%,18%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            Compare Your Salary Globally
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            See how your compensation compares across 15+ countries and 100+ cities with our interactive calculator.
          </p>
          <Button 
            size="lg" 
            onClick={() => scrollToSection('calculator-section')}
            className="bg-[hsl(184,92%,18%)] hover:bg-[hsl(184,92%,18%)]/90 text-white"
          >
            Compare My Salary Globally
          </Button>
        </Card>
      </div>

      {/* LinkedIn Post Card #5 */}
      <LinkedInPostCard5 />

      {/* BRAND QUOTE #4 */}
      <BrandQuote text="location is leverage" position="center" />

      {/* SECTION 6: Skill Demand Analysis */}
      <div id="skill-section">
        <SkillDemandAnalysis />
      </div>

      {/* Skills ROI Calculator Tool */}
      <div className="py-16 bg-wildSand/30">
        <div className="max-w-[1280px] mx-auto px-8">
          <SkillsROICalculator />
        </div>
      </div>

      {/* LinkedIn Post Card #6 */}
      <LinkedInPostCard6 />

      {/* BRAND QUOTE #5 */}
      <BrandQuote text="skills compound" position="center" />

      {/* CTA #7: After Skill Demand */}
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/5 to-white border-2 border-[hsl(18,100%,51%)]/20 p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">
            Highlight Your Missing Skills
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Get a personalized skill gap analysis showing which high-value skills you should learn next.
          </p>
          <Button 
            size="lg" 
            onClick={() => scrollToSection('skill-demand')}
            className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white"
          >
            Show Me My Skill Gaps
          </Button>
        </Card>
      </div>

      {/* SECTION 7: Negotiation Blueprint - Employee Mode Only */}
      {isEmployeeMode && (
        <>
          <NegotiationBlueprint />

          {/* Walk-Away Calculator Tool */}
          <div className="py-16 bg-white">
            <div className="max-w-[1280px] mx-auto px-8">
              <WalkAwayCalculator />
            </div>
          </div>

          {/* Counter-Offer Analyzer Tool */}
          <div className="py-16 bg-wildSand/30">
            <div className="max-w-[1280px] mx-auto px-8">
              <CounterOfferAnalyzer />
            </div>
          </div>
        </>
      )}

      {/* Employer Mode Tools */}
      {isEmployerMode && (
        <>
          {/* Team Budget Optimizer */}
          <div className="py-16 bg-white">
            <div className="max-w-[1280px] mx-auto px-8">
              <TeamBudgetOptimizer />
            </div>
          </div>

          {/* Hiring Competitiveness Dashboard */}
          <div className="py-16 bg-wildSand/30">
            <div className="max-w-[1280px] mx-auto px-8">
              <HiringCompetitivenessDashboard />
            </div>
          </div>

          {/* Retention Risk Calculator */}
          <div className="py-16 bg-white">
            <div className="max-w-[1280px] mx-auto px-8">
              <RetentionRiskCalculator />
            </div>
          </div>

          {/* Team Skills Gap Analyzer */}
          <div className="py-16 bg-wildSand/30">
            <div className="max-w-[1280px] mx-auto px-8">
              <TeamSkillsGapAnalyzer />
            </div>
          </div>
        </>
      )}

      {/* LinkedIn Post Card #7 - Always visible */}
      {isEmployeeMode && <LinkedInPostCard7 />}

      {/* BRAND QUOTE #6 */}
      <BrandQuote text="data-driven careers" position="center" />

      {/* SECTION 8: Enhanced Salary Calculator */}
      <section id="calculator-section" className="py-32 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-deepSea text-white">Section 08</Badge>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Calculate Your Global Salary
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Based on the comprehensive formula with region, experience, company size, industry, and skill multipliers
            </p>
          </div>
          
          {/* Section 8 Narrative Content */}
          <Section8Narrative />
          
          {/* Enhanced Salary Calculator */}
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

      {/* CTA #11: Final Push */}
      <div className="max-w-[1280px] mx-auto px-8 py-16">
        <Card className="bg-gradient-to-br from-[hsl(18,100%,51%)]/10 to-[hsl(184,92%,18%)]/10 border-2 border-[hsl(18,100%,51%)]/30 p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Get Your Personal GTM Career Report
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-[700px] mx-auto">
            Everything in this report, personalized for your exact role, location, experience, and career goals. Plus quarterly updates as new data becomes available.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowPersonalizedModal(true)}
            className="bg-[hsl(18,100%,51%)] hover:bg-[hsl(18,100%,51%)]/90 text-white text-lg px-8 py-6"
          >
            Get My Personal Report
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Used by 10,000+ GTM professionals to negotiate higher salaries
          </p>
        </Card>
      </div>

      {/* PDF Download Section (Moved to Bottom) */}
      <PDFDownloadSection />

      {/* Inline PDF Download Section */}
      <section className="py-20 bg-gradient-to-br from-mirage/5 to-deepSea/5 border-t-2 border-mirage/10">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4 text-mirage">
              Want This Report as PDF?
            </h2>
            <p className="text-lg text-mirage/70 mb-8 max-w-[600px] mx-auto">
              Download the complete 2026 Salary Benchmark with all data tables, charts, and analysis.
            </p>
            <Button
              size="lg"
              onClick={() => setShowPDFModal(true)}
              className="bg-mirage text-white hover:bg-mirage/90 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Full PDF Report
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      </div> {/* Close main content wrapper */}
      
      <PersonalizedReportModal 
        open={showPersonalizedModal} 
        onOpenChange={setShowPersonalizedModal} 
      />
    </div>
  );
};

const SalaryBenchmark2026 = () => {
  return (
    <ReportModeProvider>
      <SalaryBenchmark2026Content />
    </ReportModeProvider>
  );
};

export default SalaryBenchmark2026;