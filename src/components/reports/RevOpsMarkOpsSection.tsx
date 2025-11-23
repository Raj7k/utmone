import { RevOpsMarkOpsTables } from "./RevOpsMarkOpsTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, ArrowRight } from "lucide-react";

export const RevOpsMarkOpsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Opening Narrative */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Rocket className="w-8 h-8 text-[hsl(18,100%,51%)]" />
              <Badge className="bg-[hsl(18,100%,51%)] text-white text-lg px-4 py-2">
                Fastest Growing GTM Functions
              </Badge>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            RevOps & MarkOps Global Salary Benchmarks
          </h2>
          
          <div className="text-lg text-muted-foreground space-y-4 mb-12">
            <p className="lead text-xl">
              <strong className="text-foreground">Revenue Operations (RevOps)</strong> and <strong className="text-foreground">Marketing Operations (MarkOps)</strong> have transitioned from niche back-office functions to strategic revenue drivers. Ten years ago, these roles barely existed. Today, they command some of the highest salaries in GTM.
            </p>
            
            <p>
              <strong className="text-foreground">Compensation growth is staggering:</strong> US RevOps/MarkOps salaries grew +22% YoY (2024-2025). Europe: +18%. India: +32% (fastest globally). LATAM: +27%. Why? Three forces converging simultaneously.
            </p>
          </div>

          {/* The Rise of Operations */}
          <div className="bg-[hsl(184,92%,18%)]/10 rounded-2xl p-8 mb-12 border border-[hsl(184,92%,18%)]/20">
            <h3 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[hsl(184,92%,18%)]" />
              The Rise of Operations: Three Forces
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-lg">1. GTM Complexity Explosion</p>
                <p className="text-sm text-muted-foreground">
                  B2B GTM used to be simple: sales reps, maybe a marketer, a CRM. Today: 15-40 tools (CRM, marketing automation, sales engagement, analytics, ABM, attribution, data warehouse, BI, CPQ, revenue intelligence, forecasting, conversation intelligence). Someone has to make them work together.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-lg">2. Tech Stack Proliferation</p>
                <p className="text-sm text-muted-foreground">
                  Marketing teams can't configure HubSpot workflows. Sales teams can't build Salesforce reports. Leadership can't forecast without clean data. Operations fills this gap—they're the "financial controllers" of the GTM engine, ensuring data accuracy, process consistency, system reliability.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-lg">3. Revenue Accountability Demands</p>
                <p className="text-sm text-muted-foreground">
                  Boards demand predictable revenue, accurate forecasts, attribution clarity. Sales/Marketing can't answer "why did we miss?" without Operations analyzing pipeline velocity, conversion rates, lead quality, CAC trends, retention cohorts. Operations translates GTM chaos into executive clarity.
                </p>
              </div>
            </div>
          </div>

          {/* Why RevOps & MarkOps Earn More */}
          <div className="mb-12">
            <h3 className="text-3xl font-display font-bold mb-6">Why RevOps & MarkOps Earn 18-42% More Than Peers</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Operations professionals earn substantially more than equivalent-level marketing managers, sales managers, or customer success managers. <strong className="text-foreground">Why?</strong>
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">🧠</span>
                      Rare Skill Combination
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>
                      <strong className="text-foreground">Hard Skills:</strong> SQL, Salesforce/HubSpot architecture, API integrations, data modeling, automation workflows, BI tools (Tableau, Looker, PowerBI).
                    </p>
                    <p>
                      <strong className="text-foreground">Business Acumen:</strong> Understanding GTM strategy, pipeline stages, lead scoring, attribution models, forecasting methodology, quota setting.
                    </p>
                    <p>
                      <strong className="text-foreground">System Design:</strong> Architecting multi-tool ecosystems where data flows cleanly from marketing → sales → customer success → finance.
                    </p>
                    <p className="text-foreground font-semibold">This combination is incredibly rare. Most marketers lack technical depth. Most engineers lack business context. Operations bridges both.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">💰</span>
                      Direct Revenue Linkage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>
                      Operations impacts revenue velocity more directly than most GTM roles:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Pipeline velocity (how fast deals move)</li>
                      <li>Quota attainment (accurate forecasting → better territory planning)</li>
                      <li>CAC efficiency (attribution → better spend allocation)</li>
                      <li>Retention rates (clean data → better customer insights)</li>
                      <li>Forecast accuracy (leadership trust → faster decisions)</li>
                    </ul>
                    <p className="text-foreground font-semibold mt-3">When RevOps fixes broken lead routing, pipeline velocity increases 15-30%. When MarkOps builds accurate attribution, CAC drops 20-35%. Measurable revenue impact = higher pay.</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">🤖</span>
                      AI Upskill = Salary Multiplier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground mb-3">
                      <strong className="text-foreground">AI-enabled Operations professionals earn 25-35% more globally</strong> than peers without AI skills. Why? They become force multipliers.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">Traditional MarkOps:</p>
                        <p className="text-muted-foreground">Manually builds email workflows, segments lists, creates reports. Output: 5-10 campaigns/month, 20-30 reports.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">AI-Enabled MarkOps:</p>
                        <p className="text-muted-foreground">Orchestrates AI tools for segmentation, personalization, reporting. Output: 30-50 campaigns/month, 100+ reports, automated anomaly detection.</p>
                      </div>
                    </div>
                    <p className="text-foreground font-semibold mt-4">Result: AI-skilled Ops professionals handle 3-5× workload of peers. Companies pay premium for this leverage.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* RevOps Deep Dive */}
          <h3 className="text-3xl font-display font-bold mb-6">Revenue Operations (RevOps) Deep Dive</h3>
          <div className="space-y-4 text-muted-foreground mb-10">
            <p>
              <strong className="text-foreground">RevOps owns the entire revenue engine:</strong> lead-to-cash process, sales operations, forecasting, pipeline management, territory planning, quota setting, CRM architecture, revenue intelligence tools, analytics, reporting to executive team.
            </p>
            <p>
              <strong className="text-foreground">Core RevOps roles (5 levels):</strong>
            </p>
            <div className="space-y-3 ml-4">
              <div>
                <p className="font-semibold text-foreground">RevOps Specialist ($75K-$105K US)</p>
                <p className="text-sm">Entry-level. Salesforce admin, report building, data hygiene, process documentation. 1-3 years experience.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Revenue Operations Manager ($110K-$145K US)</p>
                <p className="text-sm">Owns CRM architecture, lead routing, sales process optimization, forecasting support. 3-5 years experience.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Senior RevOps Manager ($130K-$170K US)</p>
                <p className="text-sm">Owns revenue tech stack, attribution models, pipeline reporting, quota design. 5-8 years experience.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Director of Revenue Operations ($160K-$230K US)</p>
                <p className="text-sm">Strategic leader. Owns forecasting accuracy, territory planning, GTM alignment, executive reporting. 8-12 years experience.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">VP Revenue Operations ($220K-$330K US)</p>
                <p className="text-sm">C-suite partner. Owns all revenue operations, often includes customer success operations, sometimes marketing operations. Reports to CRO or CEO. 12+ years experience.</p>
              </div>
            </div>
            <p className="mt-6">
              <strong className="text-foreground">India as fastest YoY growth leader (+32%):</strong> Global SaaS companies (US, Europe) hiring remote RevOps teams in India. Bangalore RevOps Managers earning ₹35-50L ($42K-$60K)—higher than many marketing managers (₹20-35L). AI skills add 17% salary uplift in India (highest globally).
            </p>
            <div className="bg-[hsl(18,100%,51%)]/10 rounded-lg p-4 border border-[hsl(18,100%,51%)]/20 mt-6">
              <p className="text-sm">
                <strong className="text-[hsl(18,100%,51%)]">CRO Pipeline:</strong> One of fastest-growing C-suite pipelines after Product Marketing. RevOps professionals increasingly promoted to VP RevOps → CRO. Path: RevOps Manager → Senior Manager → Director → VP RevOps → CRO (10-15 years). Companies with ARR {'<'}$10M rarely hire VPs; sweet spot is Series B → Series E ($10M-$100M ARR).
              </p>
            </div>
          </div>

          {/* MarkOps Deep Dive */}
          <h3 className="text-3xl font-display font-bold mb-6">Marketing Operations (MarkOps) Deep Dive</h3>
          <div className="space-y-4 text-muted-foreground mb-10">
            <p>
              <strong className="text-foreground">MarkOps is the technical backbone of B2B marketing.</strong> They own marketing automation (HubSpot, Marketo, Pardot), email infrastructure, lead scoring, attribution models, campaign reporting, ABM platforms, analytics integrations, data hygiene, GDPR/compliance.
            </p>
            <p>
              <strong className="text-foreground">Workload rising faster than teams are growing</strong> → salary inflation. Average B2B marketing team has 15-40 tools. Most marketing managers can't configure workflows, build attribution models, or troubleshoot integrations. MarkOps fills gap.
            </p>
            <p>
              <strong className="text-foreground">Platform premiums are significant:</strong> MarkOps professionals with deep HubSpot expertise earn 12-18% more. Marketo: 15-22% more. Pardot: 10-15% more. Multi-platform fluency (HubSpot + Salesforce + SQL + BI tools): 25-35% more.
            </p>
            <p>
              <strong className="text-foreground">MarkOps increasingly overlaps with RevOps.</strong> Directors of Marketing Operations often own "Revenue Architecture"—the entire lead-to-cash data flow from marketing through sales. This overlap commands 15-20% premium over pure MarkOps roles.
            </p>
            <div className="bg-[hsl(184,92%,18%)]/10 rounded-lg p-4 border border-[hsl(184,92%,18%)]/20 mt-6">
              <p className="text-sm">
                <strong className="text-[hsl(184,92%,18%)]">Career trajectory accelerating:</strong> MarkOps Manager → Senior Manager → Director of Marketing Operations (5-8 years) → VP Marketing or VP Revenue Operations (8-12 years). MarkOps Directors increasingly hired into VP Marketing roles (not just VP Ops) because they understand revenue mechanics deeply.
              </p>
            </div>
          </div>
        </div>

        {/* Import Existing RevOps/MarkOps Tables */}
        <RevOpsMarkOpsTables />

        {/* Career Mobility */}
        <div className="mt-16 mb-12">
          <h3 className="text-3xl font-display font-bold mb-8">Career Mobility: Operations to Leadership</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[hsl(184,92%,18%)]/20 bg-[hsl(184,92%,18%)]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[hsl(184,92%,18%)]">
                  <TrendingUp className="w-5 h-5" />
                  RevOps → CRO Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Fastest-growing C-suite pipeline.</strong> RevOps professionals promoted to CRO because they understand revenue mechanics at system level—forecasting, pipeline velocity, quota design, territory planning, GTM alignment.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(184,92%,18%)]" />
                    <p><strong className="text-foreground">Step 1:</strong> RevOps Manager → Senior Manager (3-5 years)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(184,92%,18%)]" />
                    <p><strong className="text-foreground">Step 2:</strong> Senior Manager → Director of RevOps (3-4 years)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(184,92%,18%)]" />
                    <p><strong className="text-foreground">Step 3:</strong> Director → VP Revenue Operations (3-5 years)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(184,92%,18%)]" />
                    <p><strong className="text-foreground">Step 4:</strong> VP RevOps → Chief Revenue Officer (3-5 years)</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Total timeline: 10-15 years.</strong> Examples: Clari CRO (ex-RevOps at Salesforce), Gong CRO (ex-RevOps at Oracle), multiple Series C-E startups promoting VP RevOps → CRO.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[hsl(18,100%,51%)]/20 bg-[hsl(18,100%,51%)]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[hsl(18,100%,51%)]">
                  <TrendingUp className="w-5 h-5" />
                  MarkOps → VP Marketing Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">MarkOps increasingly promoted to VP Marketing</strong> (not just VP Ops) because they deeply understand revenue mechanics—attribution, pipeline generation, CAC optimization, campaign ROI.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(18,100%,51%)]" />
                    <p><strong className="text-foreground">Step 1:</strong> MarkOps Manager → Senior Manager (3-4 years)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(18,100%,51%)]" />
                    <p><strong className="text-foreground">Step 2:</strong> Senior Manager → Director of MarkOps (3-5 years)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[hsl(18,100%,51%)]" />
                    <p><strong className="text-foreground">Step 3:</strong> Director MarkOps → VP Marketing or VP RevOps (4-6 years)</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Alternative path: MarkOps → RevOps lateral move (15-22% salary jump).</strong> MarkOps professionals with Salesforce + attribution + forecasting skills increasingly move into RevOps roles for higher compensation.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Operations → COO Transitions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-4">
                  <strong className="text-foreground">Emerging trend: Operations professionals promoted to Chief Operating Officer (COO).</strong> Why? Modern COOs need system-level thinking—how GTM, product, finance, customer success all interconnect. Operations professionals understand these systems deeply.
                </p>
                <p>
                  <strong className="text-foreground">Path:</strong> VP Revenue Operations → SVP Operations → COO (12-18 years total). More common at Series C-E startups scaling rapidly ($50M-$200M ARR) where operational excellence = competitive advantage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Impact on Operations */}
        <div className="mb-12">
          <h3 className="text-3xl font-display font-bold mb-6">AI Impact on Operations: 25-35% Salary Premium</h3>
          <div className="bg-muted/30 rounded-2xl p-8">
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">AI-enabled Operations professionals earn 25-35% more globally.</strong> They transition from manual executors to force multipliers—orchestrating AI tools instead of doing manual work.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-3">AI Skills Commanding Premiums:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge className="bg-[hsl(18,100%,51%)] text-white mt-0.5">+35%</Badge>
                      <span>AI workflow automation (Zapier AI, Make, n8n with GPT integrations)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-[hsl(18,100%,51%)] text-white mt-0.5">+32%</Badge>
                      <span>AI-powered segmentation & personalization (Clay, Common Room, 6sense)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-[hsl(18,100%,51%)] text-white mt-0.5">+28%</Badge>
                      <span>Predictive analytics & anomaly detection (custom models, Prophet, Gong)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-[hsl(18,100%,51%)] text-white mt-0.5">+25%</Badge>
                      <span>Conversational intelligence (Gong, Chorus, Fireflies for ops insights)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-3">Real-World Impact Examples:</p>
                  <div className="space-y-3">
                    <div className="bg-background rounded-lg p-3">
                      <p className="font-semibold text-foreground mb-1">Before AI:</p>
                      <p className="text-xs">MarkOps Manager manually segments 10K leads into 15 lists (8 hours/week). Builds 20 reports monthly (12 hours).</p>
                    </div>
                    <div className="bg-[hsl(184,92%,18%)]/10 rounded-lg p-3 border border-[hsl(184,92%,18%)]/20">
                      <p className="font-semibold text-[hsl(184,92%,18%)] mb-1">After AI:</p>
                      <p className="text-xs">Same manager orchestrates AI segmentation (2 hours/week), auto-generates 100+ reports with anomaly alerts (3 hours). Frees 15 hours/week for strategic work.</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4">
                <strong className="text-foreground">Result:</strong> AI-skilled Ops professionals handle 3-5× workload of peers. Companies pay premium for this leverage. Ops professionals without AI skills risk salary stagnation or displacement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
