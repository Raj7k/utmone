import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Target, DollarSign, TrendingUp, Shield, MessageSquare, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalloutBox } from "./CalloutBox";

const negotiationScripts = [
  {
    id: 1,
    title: "Initial Salary Negotiation (Before Offer Stage)",
    scenario: "Getting their range first",
    script: `"Before we move forward, can you share the budgeted range for this role so we're aligned from the beginning?"`,
    note: "Always get their range first — this is power."
  },
  {
    id: 2,
    title: "Responding to a Low Range",
    scenario: "When their range is below market",
    script: `"Thanks for sharing that. Based on my research and current market data for roles requiring AI-driven automation, CRM architecture, and GTM alignment, a competitive range would be closer to [your target range]. Is there flexibility to move the range in that direction?"`,
    note: "Anchor with data, not emotion."
  },
  {
    id: 3,
    title: "After Receiving the Offer (Anchoring Higher)",
    scenario: "Counter-offer with speed incentive",
    script: `"Thank you for the offer — I'm excited about the opportunity. Based on market data and my experience in [skill areas], I was expecting something closer to [X]. If you could meet me at [X] I'd be happy to sign immediately."`,
    note: "Fast hiring is a business priority — use it as leverage."
  },
  {
    id: 4,
    title: "When They Say 'We Don't Negotiate'",
    scenario: "Fixed base, explore alternatives",
    script: `"I understand. In that case, can we explore adjustments in total compensation such as signing bonus, equity refresh, or annual bonus uplift?"`,
    note: "Companies who can't raise base will often give signing bonus to close the deal."
  },
  {
    id: 5,
    title: "For Remote Roles",
    scenario: "Leverage cost savings argument",
    script: `"Remote work allows me to operate at peak productivity. Given the cost savings on office overhead, could we revisit the compensation package to reflect a market-aligned number of [X]?"`,
    note: "Remote = cost savings for company, use it."
  },
  {
    id: 6,
    title: "Negotiating Equity",
    scenario: "Exploring equity bands",
    script: `"Given the growth trajectory and my impact on cross-functional revenue systems, I'd like to discuss equity. What would be the appropriate equity band for someone driving impact in this role?"`,
    note: "This nudges them into sharing the real band."
  },
  {
    id: 7,
    title: "For Promotion Negotiation",
    scenario: "Internal promotion alignment",
    script: `"I've taken on [new responsibilities] which align with [next level's competencies]. Based on market benchmarks, the appropriate compensation for this scope is [X]. Can we discuss aligning my title and compensation with the work I'm already doing?"`,
    note: "You're already doing the work — get paid for it."
  },
  {
    id: 8,
    title: "When You Have Another Offer",
    scenario: "Multiple offers, high leverage",
    script: `"I'm in a fortunate position with interest from multiple companies. [Company] is my first choice, and I'd like to make this work. If we can align the offer with [desired range], I'm ready to accept today."`,
    note: "This is extremely high leverage — use wisely."
  }
];

const regionalDifferences = [
  { region: "United States", expectation: "Expected", uplift: "10-20%", note: "Companies often leave 10-20% room. Show alternatives for improvement." },
  { region: "Europe", expectation: "More rigid", uplift: "5-10%", note: "More rigid compensation bands. Equity uncommon except in UK/Fintech." },
  { region: "India", expectation: "Accepted", uplift: "20-30%", note: "High mobility makes negotiation more accepted. 20-30% uplift when switching roles common." },
  { region: "APAC", expectation: "Flexible", uplift: "Varies", note: "Singapore/Australia more flexible. Japan negotiation is subtle; titles matter more." },
  { region: "LATAM", expectation: "Common", uplift: "Variable", note: "USD compensation dominates. Negotiation often includes benefits + bonuses." },
  { region: "MENA", expectation: "Expected", uplift: "Variable", note: "Cash-heavy packages. Negotiation in housing, allowances, bonuses." }
];

export const NegotiationBlueprint = () => {
  return (
    <section id="section-7" className="py-32 bg-background">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-blazeOrange text-white text-base px-4 py-2">Section 07</Badge>
            <Badge variant="outline" className="text-sm">14 min read</Badge>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            Salary Negotiation Blueprint + Scripts
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[900px] mx-auto leading-[1.7]">
            Everything you need to negotiate a higher salary — regardless of role, region, or seniority. Copy-paste scripts, proven frameworks, regional differences, and equity negotiation tactics.
          </p>
        </div>

        <CalloutBox className="mb-12">
          <strong>The Single Most Important Rule:</strong> You do not get paid for your current value. You get paid for the future value you represent. Your job is to demonstrate "future value → higher salary."
        </CalloutBox>

        <CalloutBox className="mb-12">
          <strong>Negotiation Reality:</strong> 82% of professionals who negotiate their offers receive higher compensation. Yet only 37% actually negotiate. The data is clear—asking works, and not asking costs you an average of $7,500-$15,000 per year in lost earnings.
        </CalloutBox>

        {/* 5-Part Framework */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-[hsl(184,92%,18%)]" />
              The 5-Part Salary Negotiation Framework
            </CardTitle>
            <CardDescription>
              Battle-tested method used by FAANG employees, SaaS leaders, and GTM professionals. Works in every region.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Know Your Band</h3>
                  <p className="text-sm text-foreground">
                    Know: market average, your role's regional band, remote equivalent band, internal leveling, company's salary philosophy. Use this report as your baseline.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Decide Your Walk-Away Number</h3>
                  <p className="text-sm text-muted-foreground">
                    Before negotiation begins, know: Ideal number (target), Acceptable number (minimum), Walk-away number (decline below this). Without this, the company anchors you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Anchor High with Logic, Not Emotion</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Anchoring works best with justified rationale. Example:
                  </p>
                  <div className="p-4 bg-muted/50 rounded-lg italic text-sm">
                    "Based on global benchmarks for RevOps Managers with experience in multi-system integration and AI automation, a competitive range would be $130K–$145K. I'd like to anchor at the upper end of that based on my skill set."
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Use the "Value → Ask → Pause" Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    1. State your value → 2. Make your ask → 3. Pause and stay silent. Companies often fill the silence with higher numbers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Always Negotiate Total Compensation</h3>
                  <p className="text-sm text-muted-foreground">
                    Include: Base salary, Variable/commission/OTE, Annual bonus, Joining bonus, Equity, PTO, Remote options, Stipends (home office, internet, learning). Total comp matters more than base.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Negotiation Scripts */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[hsl(184,92%,18%)]" />
              8 Copy-Paste Negotiation Scripts
            </CardTitle>
            <CardDescription>
              Proven scripts for every negotiation scenario. Customize with your specific numbers and skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {negotiationScripts.map((script) => (
                <div key={script.id} className="p-6 bg-muted/30 rounded-lg border border-border/50 hover:border-[hsl(184,92%,18%)]/50 transition-apple">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{script.title}</h3>
                      <p className="text-sm text-muted-foreground">{script.scenario}</p>
                    </div>
                    <Badge variant="outline">Script #{script.id}</Badge>
                  </div>
                  <div className="p-4 bg-background rounded-lg mb-3 italic border-l-4 border-[hsl(18,100%,51%)]">
                    {script.script}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Pro Tip:</strong> {script.note}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What to Negotiate */}
        <Tabs defaultValue="leverage" className="space-y-8">
          <TabsList className="grid w-full max-w-[600px] mx-auto grid-cols-2">
            <TabsTrigger value="leverage">What to Negotiate</TabsTrigger>
            <TabsTrigger value="regional">Regional Differences</TabsTrigger>
          </TabsList>

          <TabsContent value="leverage">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[hsl(184,92%,18%)] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    High Leverage Asks
                  </CardTitle>
                  <CardDescription>Easiest to get</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(184,92%,18%)]">✓</span>
                      <span>Signing bonus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(184,92%,18%)]">✓</span>
                      <span>Remote/hybrid work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(184,92%,18%)]">✓</span>
                      <span>Job title elevation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(184,92%,18%)]">✓</span>
                      <span>Training budget ($1K–$3K)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(184,92%,18%)]">✓</span>
                      <span>Performance bonus uplift</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(184,92%,18%)]">✓</span>
                      <span>Equity refresh</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[hsl(18,100%,51%)]">Medium Leverage Asks</CardTitle>
                  <CardDescription>Requires more justification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(18,100%,51%)]">•</span>
                      <span>Base salary increase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(18,100%,51%)]">•</span>
                      <span>Variable compensation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[hsl(18,100%,51%)]">•</span>
                      <span>Equity percentage</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg text-muted-foreground">Low Leverage Asks</CardTitle>
                  <CardDescription>Hardest to change</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span>×</span>
                      <span>Lowering quotas (sales)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>×</span>
                      <span>Changing comp structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>×</span>
                      <span>Adding direct reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>×</span>
                      <span>Reducing on-call duties</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Regional Negotiation Differences</CardTitle>
                <CardDescription>
                  Negotiation norms, typical uplift ranges, and cultural expectations by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalDifferences.map((region, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{region.region}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{region.expectation}</Badge>
                          <Badge className="bg-[hsl(18,100%,51%)] text-white">{region.uplift}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{region.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Fast Cheatsheet */}
        <Card className="mt-12 bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(18,100%,51%)] flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Fast Negotiation Cheatsheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-3 bg-background rounded-lg text-sm">✓ Never share your number first</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Ask for the band upfront</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Anchor high with professionalism</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Negotiate total comp, not base</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Ask for signing bonus if base is fixed</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Use silence — it's a weapon</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Know your value story</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Back every point with data</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Be willing to walk away</div>
              <div className="p-3 bg-background rounded-lg text-sm">✓ Close fast when you get the number</div>
            </div>
          </CardContent>
        </Card>

        {/* Counter-Offer Strategy */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Counter-Offer Strategy: Do's and Don'ts</CardTitle>
            <CardDescription>
              When and how to counter-offer effectively without burning bridges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert className="bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
                <Target className="h-5 w-5 text-[hsl(184,92%,18%)]" />
                <AlertDescription className="text-foreground">
                  <strong>Golden Rule:</strong> Always counter-offer unless the initial offer exceeds your target by 10%+. Companies expect it.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[hsl(184,92%,18%)] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    DO These Things
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2 p-3 bg-[hsl(180,25%,93%)]/50 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)] mt-0.5">✓</span>
                      <span><strong>Counter within 24-48 hours</strong> — Shows you're decisive and serious</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-[hsl(180,25%,93%)]/50 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)] mt-0.5">✓</span>
                      <span><strong>Bundle requests</strong> — Ask for base + equity + signing bonus simultaneously</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-[hsl(180,25%,93%)]/50 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)] mt-0.5">✓</span>
                      <span><strong>Express enthusiasm first</strong> — "I'm excited about this opportunity AND..."</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-[hsl(180,25%,93%)]/50 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)] mt-0.5">✓</span>
                      <span><strong>Use data, not emotion</strong> — Reference market benchmarks, not personal needs</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-[hsl(180,25%,93%)]/50 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)] mt-0.5">✓</span>
                      <span><strong>Give them an out</strong> — "If you can meet me at X, I'm ready to sign immediately"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-destructive mb-4">DON'T Do These Things</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <span className="text-destructive mt-0.5">×</span>
                      <span><strong>Don't apologize for negotiating</strong> — It signals weakness</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <span className="text-destructive mt-0.5">×</span>
                      <span><strong>Don't give ultimatums unless willing to walk</strong> — Bluffing backfires</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <span className="text-destructive mt-0.5">×</span>
                      <span><strong>Don't negotiate via text/Slack</strong> — Phone or video only for serious asks</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <span className="text-destructive mt-0.5">×</span>
                      <span><strong>Don't counter more than twice</strong> — Beyond that, you're wasting goodwill</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                      <span className="text-destructive mt-0.5">×</span>
                      <span><strong>Don't accept first offer without exploring</strong> — Leaves money on table</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-[hsl(18,100%,51%)]/10 rounded-lg border-2 border-[hsl(18,100%,51%)]/20">
                <h4 className="font-semibold text-[hsl(18,100%,51%)] mb-3">How to Structure Your Counter-Offer</h4>
                <p className="text-sm text-muted-foreground mb-4">Use this 3-part structure every time:</p>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span><strong>Anchor + Justification:</strong> "Based on market data for [skills] + [geography], a competitive range is [X]"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span><strong>Speed Incentive:</strong> "If you can meet me at [X], I'm ready to sign this week"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(18,100%,51%)] text-white flex items-center justify-center text-xs font-bold">3</span>
                    <span><strong>Pause & Listen:</strong> Stop talking. Let them respond. Silence is leverage.</span>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equity Negotiation Deep Dive */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Equity Negotiation Deep Dive</CardTitle>
            <CardDescription>
              Understanding equity structures, asking the right questions, and negotiating effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Understanding Equity Structures */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Understanding Equity Structures</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="font-semibold text-sm mb-2">ISOs (Incentive Stock Options)</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Tax-advantaged if held 2+ years. Only for employees. Subject to AMT (Alternative Minimum Tax) on exercise.
                    </p>
                    <p className="text-xs text-[hsl(184,92%,18%)]">Best for: Long-term employees at startups pre-IPO</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="font-semibold text-sm mb-2">NSOs (Non-Qualified Stock Options)</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Taxed as ordinary income on exercise. Can be granted to contractors. More flexible but higher tax burden.
                    </p>
                    <p className="text-xs text-[hsl(18,100%,51%)]">Best for: Contractors, advisors, or those exercising soon</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="font-semibold text-sm mb-2">RSUs (Restricted Stock Units)</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Taxed as ordinary income on vesting. No exercise required. Common at public companies and late-stage startups.
                    </p>
                    <p className="text-xs text-[hsl(184,92%,18%)]">Best for: Public company offers or Series D+ startups</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="font-semibold text-sm mb-2">Vesting Schedules</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Standard: 4-year vest with 1-year cliff (25% after year 1, then monthly). Accelerated vesting possible on exit.
                    </p>
                    <p className="text-xs text-[hsl(18,100%,51%)]">Negotiate: Shorter cliff, accelerated on acquisition</p>
                  </div>
                </div>
              </div>

              {/* Questions to Ask */}
              <div className="p-6 bg-[hsl(180,25%,93%)]/50 rounded-lg border-2 border-[hsl(184,92%,18%)]/20">
                <h4 className="font-semibold text-[hsl(184,92%,18%)] mb-4">Questions You MUST Ask Before Accepting Equity</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(184,92%,18%)] mt-1">•</span>
                    <div>
                      <strong>"What percentage of the company does this equity grant represent?"</strong>
                      <p className="text-xs text-muted-foreground mt-1">Number of shares is meaningless without knowing total outstanding shares</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(184,92%,18%)] mt-1">•</span>
                    <div>
                      <strong>"What's the current valuation and latest funding round?"</strong>
                      <p className="text-xs text-muted-foreground mt-1">Helps calculate actual dollar value of equity grant</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(184,92%,18%)] mt-1">•</span>
                    <div>
                      <strong>"What's the dilution schedule for the next 2-3 rounds?"</strong>
                      <p className="text-xs text-muted-foreground mt-1">Your 0.5% could become 0.2% after Series B and C</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(184,92%,18%)] mt-1">•</span>
                    <div>
                      <strong>"What happens to unvested equity if I'm terminated?"</strong>
                      <p className="text-xs text-muted-foreground mt-1">Standard: forfeited. Negotiate: partial acceleration on termination without cause</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(184,92%,18%)] mt-1">•</span>
                    <div>
                      <strong>"What's the strike price vs current FMV (Fair Market Value)?"</strong>
                      <p className="text-xs text-muted-foreground mt-1">Determines tax liability on exercise. Lower strike = better</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(184,92%,18%)] mt-1">•</span>
                    <div>
                      <strong>"What's the post-termination exercise window?"</strong>
                      <p className="text-xs text-muted-foreground mt-1">Standard: 90 days. Negotiate: 10 years (extended exercise window)</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Negotiation Tactics */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Equity Negotiation Tactics by Company Stage</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(18,100%,51%)]">
                    <p className="font-semibold text-sm mb-2">Early-Stage (Seed to Series A): Push for More Equity %</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Equity is cheap for company at this stage. 0.05-0.5% can be meaningful. Higher risk = higher equity ask is justified.
                    </p>
                    <p className="text-xs italic">"Given the stage and market risk, I'd need at least 0.3% to make this work for me financially"</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(184,92%,18%)]">
                    <p className="font-semibold text-sm mb-2">Late-Stage (Series C+): Push for RSUs or Cash Equivalent</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Options at high valuations have less upside. RSUs provide guaranteed value. Or negotiate higher base instead.
                    </p>
                    <p className="text-xs italic">"Can we convert some equity to RSUs or increase base compensation to reflect the reduced upside?"</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(18,100%,51%)]">
                    <p className="font-semibold text-sm mb-2">Equity Refresh Negotiation (For Retention)</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      After 2-3 years, original equity may be underwater or fully vested. Negotiate refresh grants annually.
                    </p>
                    <p className="text-xs italic">"My equity is 80% vested. Can we discuss a refresh grant to reflect my continued impact?"</p>
                  </div>
                </div>
              </div>

              {/* When Equity is Worth It */}
              <Alert>
                <Shield className="h-5 w-5" />
                <AlertDescription>
                  <strong>When to prioritize equity vs cash:</strong> Equity is valuable at Series A-B startups with strong product-market fit, experienced founders, and clear path to profitability or exit within 5 years. Avoid equity-heavy compensation at idea-stage startups (too risky) or mature pre-IPO companies (limited upside).
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Remote Work Negotiation */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Remote Work Negotiation Specifics</CardTitle>
            <CardDescription>
              Leveraging cost savings, geographic arbitrage, and remote-first benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 bg-[hsl(18,100%,51%)]/10 rounded-lg border-2 border-[hsl(18,100%,51%)]/20">
                <h4 className="font-semibold text-[hsl(18,100%,51%)] mb-3">The Cost Savings Argument</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Remote work saves companies $15K-$20K annually per employee (real estate, utilities, equipment, food). Use this as leverage.
                </p>
                <div className="p-4 bg-background rounded-lg italic text-sm border-l-4 border-[hsl(18,100%,51%)]">
                  "Remote work allows me to operate at peak productivity while saving the company $15K-$20K annually on real estate and overhead. Can we structure compensation to reflect market-aligned numbers for this role, regardless of my location?"
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Geographic Arbitrage Strategy</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Living in low cost-of-living area while earning high-salary market rates = massive purchasing power advantage.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)]">•</span>
                      <span>Live in Austin, earn SF salary = 40% purchasing power increase</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)]">•</span>
                      <span>Live in Bangalore, earn US remote salary = 3-4x local purchasing power</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(184,92%,18%)]">•</span>
                      <span>Negotiate location-agnostic salary bands upfront</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Remote-Specific Benefits to Negotiate</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(18,100%,51%)]">$</span>
                      <span><strong>Home office stipend:</strong> $1K-$5K one-time for desk, chair, monitor</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(18,100%,51%)]">$</span>
                      <span><strong>Internet/phone reimbursement:</strong> $50-$150/month ongoing</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(18,100%,51%)]">$</span>
                      <span><strong>Co-working space allowance:</strong> $200-$400/month if needed</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-[hsl(18,100%,51%)]">$</span>
                      <span><strong>Travel budget:</strong> Quarterly offsites, annual all-hands travel covered</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Handling Multiple Offers */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Handling Multiple Offers Simultaneously</CardTitle>
            <CardDescription>
              How to leverage competing offers ethically without burning bridges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert className="bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
                <MessageSquare className="h-5 w-5 text-[hsl(184,92%,18%)]" />
                <AlertDescription>
                  <strong>Core Principle:</strong> Always be honest about your timeline. Never lie about having offers you don't have. Transparency builds trust.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(184,92%,18%)]">
                  <h4 className="font-semibold text-sm mb-2">Step 1: Sync Offer Deadlines</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    When you receive offer #1, immediately contact other companies: "I have an offer with a 7-day deadline. Can you expedite your process?"
                  </p>
                  <p className="text-xs italic">"I'm excited about your opportunity, but I have an offer that expires Friday. Can we accelerate to a decision this week?"</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(18,100%,51%)]">
                  <h4 className="font-semibold text-sm mb-2">Step 2: Leverage Without Revealing Details</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Mention you have alternatives without sharing specific numbers. This creates urgency without being manipulative.
                  </p>
                  <p className="text-xs italic">"I'm fortunate to have interest from multiple companies. [Company] is my first choice. Can we discuss aligning the offer?"</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(184,92%,18%)]">
                  <h4 className="font-semibold text-sm mb-2">Step 3: When to Reveal Other Offers</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Only reveal if: (1) You're asked directly, (2) You need to justify your ask, (3) You're in final negotiation and need maximum leverage
                  </p>
                  <p className="text-xs italic">"Company X offered [base + equity]. I'd prefer to work here — can we match or exceed that package?"</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-[hsl(18,100%,51%)]">
                  <h4 className="font-semibold text-sm mb-2">Step 4: Walking Away from Good for Great</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Don't settle for "good enough" when you have better options. Politely decline: "Thank you for the offer. After careful consideration, I'm moving forward with another opportunity that better aligns with my career goals."
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[hsl(18,100%,51%)]/10 rounded-lg border-2 border-[hsl(18,100%,51%)]/20">
                <h4 className="font-semibold text-[hsl(18,100%,51%)] mb-3">Script Variations for Multiple Offers</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold mb-1">Scenario A: You prefer Company A but Company B offered more</p>
                    <p className="text-xs italic">"Company A is my first choice, but Company B offered [X]. If you can match that, I'm ready to accept immediately."</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold mb-1">Scenario B: You're waiting on dream company but have backup offer</p>
                    <p className="text-xs italic">"I have an offer expiring Friday. I'm still very interested in [Dream Company]. Can we expedite to a decision this week?"</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold mb-1">Scenario C: All offers roughly equal, choosing based on culture/role</p>
                    <p className="text-xs italic">"I have offers from [Company B] and [Company C] in similar ranges. The role and team here feel like the best fit. Is there flexibility to move compensation slightly higher to make this an easy yes?"</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Negotiate AI Into Your Role */}
        <Card className="mt-12 bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
          <CardHeader>
            <CardTitle className="text-2xl text-[hsl(18,100%,51%)]">When to Negotiate AI Into Your Role (2025+ Reality)</CardTitle>
            <CardDescription>
              AI proficiency is becoming a standard expectation — negotiate budget, time, and comp for it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                In 2025-2026, AI skills are transitioning from "nice-to-have" to "expected." But most companies haven't formalized AI tool budgets or experimentation time. This is leverage.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">What to Negotiate</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 p-3 bg-background rounded-lg border">
                      <span className="text-[hsl(18,100%,51%)]">$</span>
                      <div>
                        <strong>AI Tools Budget:</strong> $2K-$10K annually
                        <p className="text-xs text-muted-foreground mt-1">ChatGPT Plus, Claude Pro, Perplexity, Midjourney, custom GPTs, API credits</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-background rounded-lg border">
                      <span className="text-[hsl(18,100%,51%)]">⏱</span>
                      <div>
                        <strong>Experimentation Time:</strong> 10-20% of work week
                        <p className="text-xs text-muted-foreground mt-1">Formalize AI optimization projects in job scope</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-background rounded-lg border">
                      <span className="text-[hsl(18,100%,51%)]">💰</span>
                      <div>
                        <strong>Higher Comp for AI Proficiency:</strong> +15-25% premium
                        <p className="text-xs text-muted-foreground mt-1">If you bring demonstrable AI skills, anchor higher</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 p-3 bg-background rounded-lg border">
                      <span className="text-[hsl(18,100%,51%)]">🎓</span>
                      <div>
                        <strong>Learning Budget:</strong> $1K-$3K for AI courses
                        <p className="text-xs text-muted-foreground mt-1">Prompt engineering, LLM fine-tuning, AI agent design</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Example Asks</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-background rounded-lg border-l-4 border-[hsl(184,92%,18%)]">
                      <p className="text-xs font-semibold mb-2">Request 1: AI Tools Budget</p>
                      <p className="text-xs italic">"Can we include a $5K annual AI tools budget in my package? I'll be using ChatGPT, Perplexity, and custom API integrations to 3-5x my output."</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border-l-4 border-[hsl(184,92%,18%)]">
                      <p className="text-xs font-semibold mb-2">Request 2: Formalize AI Work in Scope</p>
                      <p className="text-xs italic">"I'd like to formalize 20% of my time for AI-driven optimization projects. Can we add that to my role definition?"</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border-l-4 border-[hsl(184,92%,18%)]">
                      <p className="text-xs font-semibold mb-2">Request 3: Premium for AI Expertise</p>
                      <p className="text-xs italic">"I bring advanced AI orchestration skills that will accelerate GTM execution. Based on market premiums for AI-native professionals, I'd expect compensation in the [X] range."</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Target className="h-5 w-5" />
                <AlertDescription>
                  <strong>Future-proofing your role:</strong> Negotiate job descriptions that explicitly include "AI-assisted" or "AI-augmented" responsibilities. This protects you from being replaced by AI while positioning you as an AI conductor, not operator.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
