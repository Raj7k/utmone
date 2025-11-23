import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TrendingUp, TrendingDown, Target, Database, Sparkles } from "lucide-react";

const highValueSkills = [
  { skill: "AI & Automation Orchestration", premium: "20-45%", category: "Strategic", icon: Bot },
  { skill: "Salesforce Architecture", premium: "+38%", category: "Systems", icon: Database },
  { skill: "Attribution Modeling (MTA / AI-based)", premium: "+35%", category: "Strategic", icon: Target },
  { skill: "GTM Strategy (PMM / DG / Growth)", premium: "27-42%", category: "Strategic", icon: Sparkles },
  { skill: "SQL + BI Tool Proficiency", premium: "22-35%", category: "Execution", icon: Database },
  { skill: "Lifecycle / CRM Architecture", premium: "20-28%", category: "Execution", icon: Target },
  { skill: "Revenue Forecasting & Capacity Planning", premium: "25-30%", category: "Strategic", icon: TrendingUp }
];

const decliningSkills = [
  { skill: "Basic Content Writing", reason: "AI drafts 80% of content, freelancers flood market" },
  { skill: "Basic Graphic Design", reason: "Canva + AI tools = massive supply increase" },
  { skill: "Pure Social Media Management", reason: "Posting ≠ marketing. Strategy still valuable." },
  { skill: "Basic Video Editing", reason: "AI editing tools shrinking demand" },
  { skill: "Manual Reporting", reason: "Dashboards auto-generate reports" },
  { skill: "SEO (Content)", reason: "Content SEO commoditizing fastest. Technical SEO still valuable." }
];

const marketingSkills = [
  { skill: "AI-powered content & campaign creation", description: "Persona-level personalization, multi-channel journeys" },
  { skill: "Product Marketing", description: "Aligns product → market → revenue, reduces sales confusion" },
  { skill: "Lifecycle/CRM Automation", description: "Deep demand across SaaS, D2C, fintech, marketplaces" },
  { skill: "Marketing Ops", description: "Companies want people who 'run the machine', not just campaigns" },
  { skill: "Attribution Modeling", description: "Multi-touch attribution (MTA) rare, high premiums" },
  { skill: "Growth Experimentation", description: "Rapid, data-driven testing impacts revenue" },
  { skill: "Data & SQL Literacy", description: "Marketers who can pull queries earn 18-35% more" },
  { skill: "ABM Strategy", description: "Enterprise pipeline engine, skyrocketing demand" },
  { skill: "Paid Media Optimization", description: "Performance marketers with creative + data mix" },
  { skill: "Category Creation", description: "Rarest and most strategic skill, highest ceiling" }
];

const salesSkills = [
  { skill: "AI-assisted personalization", description: "Custom outreach, call prep, objection handling, business case automation" },
  { skill: "Multi-threading Skills", description: "Enterprise buying = committees, navigate 8-12 stakeholders" },
  { skill: "MEDDICC / Challenger", description: "Still the most powerful differentiator" },
  { skill: "Pipeline Hygiene & Forecasting", description: "More important post-2023 budget tightening" },
  { skill: "Industry Deep Expertise", description: "Security, data, healthcare, logistics, fintech, government" },
  { skill: "ROI-first demo skills", description: "Sell business value > product features" },
  { skill: "Multi-region selling", description: "NA + EMEA or NA + APAC rare" },
  { skill: "Pricing & Negotiation", description: "Directly tied to deal size, direct comp impact" },
  { skill: "Strategic Account Planning", description: "Retention-heavy markets" },
  { skill: "Social Selling", description: "LinkedIn mastery increasingly necessary for trust-building" }
];

const revopsSkills = [
  { skill: "Salesforce Architecture", description: "Highest paid non-sales skill in GTM" },
  { skill: "Forecasting Models", description: "Running revenue predictability = premium" },
  { skill: "Data Warehousing", description: "Snowflake, Redshift huge need" },
  { skill: "Attribution Modeling", description: "Weighted, algorithmic huge comp lift" },
  { skill: "Lead Scoring", description: "AI or heuristic, direct pipeline quality impact" },
  { skill: "Territory & Capacity Planning", description: "Board-level strategic capability" },
  { skill: "Revenue Intelligence Platforms", description: "Gong, Clari AI-assisted RevOps huge hiring velocity" },
  { skill: "Compensation Plan Design", description: "Commission → revenue → CFO involvement" },
  { skill: "GTM Stack Integration", description: "RevOps becomes architects" },
  { skill: "SQL & Automation", description: "Foundational skill for Ops" }
];

const markopsSkills = [
  { skill: "Marketing Automation Mastery", description: "Marketo, HubSpot, Braze top pros command US-equivalent globally" },
  { skill: "Journey & Workflow Automation", description: "Cross-channel design rare, high premium" },
  { skill: "Attribution Setup", description: "Critical for CEO/CFO decision-making" },
  { skill: "CRM Sync + Integration", description: "MarkOps is now a data job" },
  { skill: "QA & Compliance Automation", description: "Data hygiene → future predictability" },
  { skill: "Web Analytics & CRO", description: "Site optimization → direct pipeline impact" },
  { skill: "AI-driven segmentation", description: "Demand doubling every year" },
  { skill: "SQL & BI Tool Fluency", description: "Fastest-growing skill in job postings" },
  { skill: "A/B Testing Infrastructure", description: "MarkOps → experimentation backbone" },
  { skill: "Reporting Automation", description: "Data → insights → action → revenue" }
];

export const SkillDemandAnalysis = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Global Skill-Demand Analysis & Salary Premium Drivers
          </h2>
          <p className="text-xl text-muted-foreground max-w-[900px] mx-auto">
            What really moves your salary: the most in-demand skills across Marketing, Sales, RevOps, and MarkOps, how they influence compensation, and which ones create the biggest long-term career leverage.
          </p>
        </div>

        {/* High-Value Skills Overview */}
        <Card className="mb-12 bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(184,92%,18%)] flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              The 7 Skills With Highest Salary Premiums (Across All Functions)
            </CardTitle>
            <CardDescription>
              These skills provide the highest raises, job mobility, and global transferability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highValueSkills.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 bg-background rounded-lg border border-border/50 hover:border-[hsl(184,92%,18%)]/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="w-5 h-5 text-[hsl(184,92%,18%)] mt-0.5" />
                      <Badge className="bg-[hsl(184,92%,18%)] text-white">{item.premium}</Badge>
                    </div>
                    <p className="font-semibold text-sm mb-1">{item.skill}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Declining Skills */}
        <Card className="mb-12 bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive flex items-center gap-2">
              <TrendingDown className="w-6 h-6" />
              Skills Declining in Salary Value (Global)
            </CardTitle>
            <CardDescription>
              Not because they aren't important — but because they're now oversupplied or AI-commoditized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {decliningSkills.map((item, idx) => (
                <div key={idx} className="p-4 bg-background rounded-lg border border-border/50">
                  <p className="font-semibold text-sm mb-1 text-destructive">{item.skill}</p>
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Function-Specific Skills */}
        <Tabs defaultValue="marketing" className="space-y-8">
          <TabsList className="grid w-full max-w-[800px] mx-auto grid-cols-4">
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="revops">RevOps</TabsTrigger>
            <TabsTrigger value="markops">MarkOps</TabsTrigger>
          </TabsList>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Marketing — Top 10 Most In-Demand Skills</CardTitle>
                <CardDescription>Ranked by global hiring velocity and salary impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketingSkills.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{item.skill}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Sales — Top 10 Most In-Demand Skills</CardTitle>
                <CardDescription>Skills that separate top performers from average sellers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesSkills.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{item.skill}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revops">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">RevOps — Top 10 Most In-Demand Skills</CardTitle>
                <CardDescription>Technical and strategic capabilities commanding highest premiums</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revopsSkills.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(184,92%,18%)] text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{item.skill}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markops">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Marketing Ops — Top 10 Most In-Demand Skills</CardTitle>
                <CardDescription>Foundation for modern marketing technology stacks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {markopsSkills.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(184,92%,18%)] text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{item.skill}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Future Skills */}
        <Card className="mt-12 bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(18,100%,51%)]">
              Skills That Will Be Most In-Demand by 2026-2028
            </CardTitle>
            <CardDescription>
              If someone wanted to future-proof their GTM career, these skills deliver exponential advantages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">1. AI-Orchestrated GTM Automation</p>
                <p className="text-sm text-muted-foreground">Future RevOps & MarkOps are AI conductors, not operators</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">2. Full-Funnel Revenue Design</p>
                <p className="text-sm text-muted-foreground">PMM + Growth + Sales + RevOps hybrid roles will emerge</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">3. Zero-click Attribution</p>
                <p className="text-sm text-muted-foreground">GTM moves to dark social, community, content. New measurement models emerge</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">4. LLM Fine-Tuning for GTM</p>
                <p className="text-sm text-muted-foreground">Custom internal GPTs will be biggest competitive winners</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">5. AI Agent Chains</p>
                <p className="text-sm text-muted-foreground">AI agents running summarization, enrichment, scoring, routing, personalization, follow-ups</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">6. Multimodal Content Strategy</p>
                <p className="text-sm text-muted-foreground">Audio, video, AI-animated content, dynamic websites, personalized landing pages</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-semibold mb-2">7. Scientific Marketing</p>
                <p className="text-sm text-muted-foreground">Statistical & causal models, evidence-based measurement = massive leverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
