import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Target, DollarSign, TrendingUp, Shield, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <section className="py-20 bg-muted/20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Salary Negotiation Blueprint + Scripts
          </h2>
          <p className="text-xl text-muted-foreground max-w-[900px] mx-auto">
            Everything you need to negotiate a higher salary — regardless of role, region, or seniority. Copy-paste scripts, proven frameworks, regional differences, and equity negotiation tactics.
          </p>
        </div>

        <Alert className="mb-12 bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
          <Target className="h-5 w-5 text-[hsl(18,100%,51%)]" />
          <AlertDescription className="text-foreground">
            <strong>The Single Most Important Rule:</strong> You do not get paid for your current value. You get paid for the future value you represent. Your job is to demonstrate "future value → higher salary."
          </AlertDescription>
        </Alert>

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
                  <p className="text-sm text-muted-foreground">
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
                <div key={script.id} className="p-6 bg-muted/30 rounded-lg border border-border/50 hover:border-[hsl(184,92%,18%)]/50 transition-colors">
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
      </div>
    </section>
  );
};
