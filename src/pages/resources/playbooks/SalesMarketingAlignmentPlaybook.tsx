import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Table, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { LeadScoringCalculator } from "@/components/resources/LeadScoringCalculator";
import { MetricsDashboard } from "@/components/resources/MetricsDashboard";
import { RoadmapTimeline } from "@/components/resources/RoadmapTimeline";
import { WeeklySyncTimer } from "@/components/resources/WeeklySyncTimer";
import { SLAgreementCard } from "@/components/resources/SLAgreementCard";
import { RoleChecklistTabs } from "@/components/resources/RoleChecklistTabs";
import { ProblemSolutionMatcher } from "@/components/resources/ProblemSolutionMatcher";
import { DownloadOptions } from "@/components/resources/DownloadOptions";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { motion } from "framer-motion";
import { ComparisonCard } from "@/components/analytics/ComparisonCard";
import { Helmet } from "react-helmet";

const SalesMarketingAlignmentPlaybook = () => {
  const steps = [
    { number: 1, title: "The Big Ideas" },
    { number: 2, title: "Lead Scoring" },
    { number: 3, title: "Lead Journey" },
    { number: 4, title: "The SLA" },
    { number: 5, title: "Sacred Metrics" },
    { number: 6, title: "Quick Start" },
    { number: 7, title: "Weekly Sync" },
    { number: 8, title: "90-Day Roadmap" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sales & Marketing Alignment Playbook — 90-Day Implementation | utm.one</title>
        <meta name="description" content="Complete 90-day playbook to align sales and marketing teams. Includes interactive lead scoring calculator, metrics dashboard, weekly sync timer, SLA agreement, and role-specific checklists. Plain English, zero confusion." />
        <meta name="keywords" content="sales marketing alignment, MQL SQL definition, lead scoring calculator, sales SLA, marketing operations, revenue alignment, B2B sales process" />
        <link rel="canonical" href="https://utm.one/resources/playbooks/sales-marketing-alignment" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Sales & Marketing Alignment Playbook — The Simple Version" />
        <meta property="og:description" content="90-day implementation plan to align sales and marketing with interactive tools, calculators, and templates. No theory, just action." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://utm.one/resources/playbooks/sales-marketing-alignment" />
        
        {/* Schema.org structured data for HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Sales & Marketing Alignment Playbook",
            "description": "90-day implementation plan to align sales and marketing teams with zero confusion",
            "totalTime": "P90D",
            "tool": [
              "Lead Scoring Calculator",
              "Metrics Dashboard",
              "Weekly Sync Timer",
              "SLA Agreement Template"
            ],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Week 1: Agree on definitions",
                "text": "1-hour meeting with sales & marketing leaders to define MQL and SQL criteria",
                "position": 1
              },
              {
                "@type": "HowToStep",
                "name": "Week 2: Set up automation",
                "text": "Configure CRM routing, alerts, and lead scoring automation",
                "position": 2
              },
              {
                "@type": "HowToStep",
                "name": "Week 3: Soft launch",
                "text": "Test process with 25% of leads before full rollout",
                "position": 3
              },
              {
                "@type": "HowToStep",
                "name": "Week 4: Full launch",
                "text": "Go live with 100% of leads and celebrate first wins",
                "position": 4
              }
            ]
          })}
        </script>
        
        {/* Schema.org for Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Sales & Marketing Alignment Playbook — The Simple Version",
            "description": "Complete 90-day implementation plan with interactive calculators, checklists, and templates for aligning sales and marketing teams",
            "author": {
              "@type": "Organization",
              "name": "utm.one"
            },
            "publisher": {
              "@type": "Organization",
              "name": "utm.one",
              "logo": {
                "@type": "ImageObject",
                "url": "https://utm.one/logo.png"
              }
            },
            "datePublished": "2024-01-15",
            "dateModified": "2024-01-15"
          })}
        </script>
        
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Resources",
                "item": "https://utm.one/resources"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Playbooks",
                "item": "https://utm.one/resources/playbooks"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Sales & Marketing Alignment",
                "item": "https://utm.one/resources/playbooks/sales-marketing-alignment"
              }
            ]
          })}
        </script>
      </Helmet>
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <span>/</span>
            <Link to="/resources/playbooks" className="hover:text-foreground transition-colors">Playbooks</Link>
            <span>/</span>
            <span className="text-foreground">Sales & Marketing Alignment</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">22-page playbook</Badge>
            <Badge variant="outline">Interactive tools</Badge>
            <Badge variant="outline">90-day plan</Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase mb-6">
            sales & marketing alignment playbook
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mb-8">
            90-day implementation plan to align sales and marketing with zero confusion. includes interactive calculators, checklists, and templates.
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span>30 min read</span>
            <span>Updated January 2025</span>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-12 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <PlaybookSteps steps={steps} currentStep={1} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8 space-y-20">
          
          {/* What You're Getting */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                what you're getting
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
                a 22-page, plain-english playbook that includes interactive tools, step-by-step checklists, and downloadable templates. 
                no theory, no fluff—just what you need to implement in 90 days.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {[
                  { value: "90", label: "days to full alignment" },
                  { value: "7", label: "metrics to track" },
                  { value: "15", label: "min weekly sync" },
                  { value: "160%", label: "revenue growth target" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl border border-white/20"
                    style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.1))' }}
                  >
                    <p className="text-4xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ProgressiveReveal>

          {/* The Three Big Ideas */}
          <ProgressiveReveal>
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                the three big ideas (start here)
              </h2>
              <div className="space-y-4">
                {[
                  {
                    number: "01",
                    title: "Agree on what \"qualified\" means",
                    description: "write it down, stop guessing. define MQL and SQL with specific point thresholds (30+ points = MQL). no more \"feels like a good lead\" conversations."
                  },
                  {
                    number: "02",
                    title: "Speed wins",
                    description: "faster response = higher close rates. target: < 1 hour from MQL to first contact. every hour of delay cuts close rate by 10-15%."
                  },
                  {
                    number: "03",
                    title: "Measure everything",
                    description: "track 7 numbers, that's it. lead volume, MQL rate, MQL-to-SQL rate, response time, sales cycle, win rate, monthly pipeline. if all 7 are green, you're winning."
                  }
                ].map((idea, i) => (
                  <motion.div
                    key={idea.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-white/20 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="absolute top-6 right-6 text-7xl font-extrabold text-foreground/5 pointer-events-none">
                      {idea.number}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-3">
                        {idea.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {idea.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ProgressiveReveal>

          {/* Lead Scoring Calculator */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                simple lead scoring (takes 5 minutes to set up)
              </h2>
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-muted/20 border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fit Score (35 points max)</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Company size, industry, job title</li>
                        <li>• Are they your ICP?</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Engagement Score (65 points max)</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Form fills, webinars, email opens</li>
                        <li>• Are they interested?</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-border space-y-2">
                    <p className="text-sm"><strong className="text-foreground">MQL =</strong> 30+ points</p>
                    <p className="text-sm"><strong className="text-foreground">SQL =</strong> 30+ points + Sales rep called them</p>
                  </div>
                </div>
              </div>
              <LeadScoringCalculator />
            </div>
          </ProgressiveReveal>

          {/* Lead Journey */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                the lead journey (5 easy stages)
              </h2>
              <div className="space-y-4">
                {[
                  { stage: "1", title: "Someone finds you", timeline: "Days 1-3", who: "Marketing", success: "Lead enters CRM with complete profile" },
                  { stage: "2", title: "Nurture phase", timeline: "Days 4-14", who: "Marketing", success: "Engagement score increases to 20+" },
                  { stage: "3", title: "MQL handoff to Sales", timeline: "Days 15-16", who: "Marketing → Sales", success: "Alert sent, rep assigned, context provided" },
                  { stage: "4", title: "Sales qualifies them", timeline: "Days 17-21", who: "Sales", success: "First call completed, SQL status set" },
                  { stage: "5", title: "Demo & close", timeline: "Days 22-90", who: "Sales", success: "Deal closed, revenue recognized" },
                ].map((stage, i) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-6 rounded-xl border-l-4 border-white/50"
                    style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.05), transparent)' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
                        {stage.stage}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{stage.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{stage.timeline}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Who:</span>{" "}
                            <span className="text-foreground font-medium">{stage.who}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Success:</span>{" "}
                            <span className="text-foreground">{stage.success}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ProgressiveReveal>

          {/* The SLA */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                the SLA (handshake agreement)
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
                print it. sign it. put it on the wall. this creates accountability when both teams commit publicly to these promises.
              </p>
              <SLAgreementCard />
            </div>
          </ProgressiveReveal>

          {/* Sacred Metrics */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                the 7 sacred metrics you track
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
                if all 7 are green, you're winning. if any turns red, you know exactly what to fix.
              </p>
              <MetricsDashboard />
            </div>
          </ProgressiveReveal>

          {/* 30-Day Quick Start */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                30-day quick start
              </h2>
              <div className="space-y-4">
                {[
                  { week: "Week 1", task: "Agree on definitions", detail: "1 meeting, 1 hour with sales & marketing leaders" },
                  { week: "Week 2", task: "Set up automation in your CRM", detail: "ops person, 1 day to configure routing and alerts" },
                  { week: "Week 3", task: "Soft launch with 25% of leads", detail: "test it with a subset before full rollout" },
                  { week: "Week 4", task: "Full launch + celebrate first wins", detail: "go live with 100% of leads, track early successes" },
                ].map((week, i) => (
                  <motion.div
                    key={week.week}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="px-3 py-1 rounded-lg font-semibold text-sm flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
                        {week.week}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{week.task}</h3>
                        <p className="text-sm text-muted-foreground">{week.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ProgressiveReveal>

          {/* Weekly Sync */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                weekly 15-minute sync
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
                same time every tuesday at 10am. use the interactive timer to keep it tight and productive.
              </p>
              <WeeklySyncTimer />
            </div>
          </ProgressiveReveal>

          {/* Role-Specific Checklists */}
          <ProgressiveReveal>
            <RoleChecklistTabs />
          </ProgressiveReveal>

          {/* Common Problems */}
          <ProgressiveReveal>
            <ProblemSolutionMatcher />
          </ProgressiveReveal>

          {/* Downloadable Templates */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                three print-and-keep templates
              </h2>
              <DownloadOptions
                title="Download All Templates"
                options={[
                  {
                    label: "MQL Qualification Checklist",
                    format: "PDF",
                    icon: CheckSquare,
                    onClick: () => window.open("#", "_blank")
                  },
                  {
                    label: "Discovery Call Script",
                    format: "PDF / DOCX",
                    icon: FileText,
                    onClick: () => window.open("#", "_blank")
                  },
                  {
                    label: "Weekly Sync Agenda",
                    format: "Markdown / Slack",
                    icon: Table,
                    onClick: () => window.open("#", "_blank")
                  },
                ]}
              />
            </div>
          </ProgressiveReveal>

          {/* 90-Day Roadmap */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                90-day roadmap
              </h2>
              <RoadmapTimeline />
            </div>
          </ProgressiveReveal>

          {/* Comparison */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                the comparison
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
                why this simple version beats complex frameworks
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-green-500/5 border-2 border-green-500/50">
                  <h3 className="text-xl font-bold text-foreground mb-4">✅ Simple Playbook (This One)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>22 pages, plain English</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>90 days to full implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>7 metrics, easy to track</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Works for all roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Interactive tools included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Copy-paste templates ready</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-muted/20 border-2 border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">⚠️ Deep Framework</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>40+ pages, needs analysts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>90+ days to see results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>20+ metrics, overwhelming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Requires specialized knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Theory-heavy, hard to apply</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Needs custom tool development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ProgressiveReveal>

          {/* Why This Version is Better */}
          <ProgressiveReveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                why this version is better than theory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "written for humans, not analysts",
                    points: ["no jargon", "plain english examples", "copy-paste ready"]
                  },
                  {
                    title: "immediately actionable",
                    points: ["week-by-week timeline", "checklists for each role", "real templates you can use today"]
                  },
                  {
                    title: "fixes the biggest problem first",
                    points: ["slow response → week 2 automation", "don't know what's qualified → week 1 definition", "teams don't talk → tuesday sync"]
                  },
                  {
                    title: "works with your current tools",
                    points: ["salesforce, hubspot, pipedrive, any CRM", "no new software needed", "no IT project required"]
                  },
                ].map((benefit, i) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-card border border-border/50"
                  >
                    <h3 className="font-semibold text-lg mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>✅ {benefit.title}</h3>
                    <ul className="space-y-2">
                      {benefit.points.map((point, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-foreground">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </ProgressiveReveal>

          {/* Next Steps */}
          <ProgressiveReveal>
            <div className="p-8 rounded-2xl border-2 border-white/20" style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                next steps
              </h2>
              <ol className="space-y-3 text-lg mb-8">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>1</span>
                  <span>Schedule 1 hour with your sales leader + marketing leader</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>2</span>
                  <span>Walk through Week 1 together (define MQL/SQL)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>3</span>
                  <span>Set the Tuesday 10am sync on everyone's calendar for 13 weeks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>4</span>
                  <span>Report back in 90 days on your 7 metrics</span>
                </li>
              </ol>
              <div className="p-6 rounded-xl bg-background/50 border border-border">
                <p className="text-xl font-bold text-foreground mb-2">you're now 90 days away from:</p>
                <ul className="space-y-2">
                  {["faster response times", "better lead quality", "more aligned teams", "higher revenue"].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-lg">
                      <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }}></span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-2xl font-bold mt-6" style={{ color: 'rgba(255,255,255,0.9)' }}>go build it.</p>
              </div>
            </div>
          </ProgressiveReveal>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SalesMarketingAlignmentPlaybook;
