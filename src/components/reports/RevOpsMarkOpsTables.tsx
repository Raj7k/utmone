import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp } from "lucide-react";

export const RevOpsMarkOpsTables = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Rocket className="w-8 h-8 text-[hsl(18,100%,51%)]" />
            <Badge className="bg-[hsl(18,100%,51%)] text-white text-sm">
              Fastest Growing Functions
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            RevOps & MarkOps Global Salary Benchmarks
          </h2>
          <p className="text-xl text-muted-foreground max-w-[900px] mx-auto">
            Revenue Operations and Marketing Operations have transitioned from niche back-office functions to strategic revenue drivers. Compensation growth: US +22% YoY, Europe +18%, India +32%, LATAM +27%.
          </p>
        </div>

        <div className="mb-8 p-6 bg-[hsl(184,92%,18%)]/10 rounded-2xl border border-[hsl(184,92%,18%)]/20">
          <h3 className="text-lg font-semibold text-[hsl(184,92%,18%)] mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Why RevOps & MarkOps Earn 18-42% More
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">1. Hard Skills → High Scarcity</p>
              <p className="text-muted-foreground">Technical expertise + business acumen + system design + analytical depth = rare combination</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">2. Direct Revenue Linkage</p>
              <p className="text-muted-foreground">Impacts pipeline velocity, quota attainment, CAC, retention, forecast accuracy</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">3. AI Upskill = Salary Multiplier</p>
              <p className="text-muted-foreground">AI-enabled Ops professionals earn 25-35% more globally by becoming force multipliers</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="revops" className="space-y-8">
          <TabsList className="grid w-full max-w-[400px] mx-auto grid-cols-2">
            <TabsTrigger value="revops">Revenue Operations</TabsTrigger>
            <TabsTrigger value="markops">Marketing Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="revops" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Global RevOps Salary Ranges</CardTitle>
                <CardDescription>
                  Revenue Operations: The "financial controller" of the entire GTM engine. Fastest-growing compensation of any GTM role except PMM and Enterprise AE.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Level</TableHead>
                        <TableHead className="text-right">US</TableHead>
                        <TableHead className="text-right">UK/EU</TableHead>
                        <TableHead className="text-right">India</TableHead>
                        <TableHead className="text-right">APAC</TableHead>
                        <TableHead className="text-right">LATAM</TableHead>
                        <TableHead className="text-right">MENA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">RevOps Specialist</TableCell>
                        <TableCell className="text-right font-mono">$75K-$105K</TableCell>
                        <TableCell className="text-right font-mono">$50K-$75K</TableCell>
                        <TableCell className="text-right font-mono">$15K-$28K</TableCell>
                        <TableCell className="text-right font-mono">$55K-$95K</TableCell>
                        <TableCell className="text-right font-mono">$18K-$35K</TableCell>
                        <TableCell className="text-right font-mono">$22K-$45K</TableCell>
                      </TableRow>
                      <TableRow className="bg-[hsl(18,100%,51%)]/5">
                        <TableCell className="font-semibold">Revenue Operations Manager</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$110K-$145K</TableCell>
                        <TableCell className="text-right font-mono">$70K-$110K</TableCell>
                        <TableCell className="text-right font-mono">$25K-$50K</TableCell>
                        <TableCell className="text-right font-mono">$75K-$120K</TableCell>
                        <TableCell className="text-right font-mono">$25K-$50K</TableCell>
                        <TableCell className="text-right font-mono">$30K-$60K</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Senior RevOps Manager</TableCell>
                        <TableCell className="text-right font-mono">$130K-$170K</TableCell>
                        <TableCell className="text-right font-mono">$90K-$135K</TableCell>
                        <TableCell className="text-right font-mono">$35K-$65K</TableCell>
                        <TableCell className="text-right font-mono">$100K-$150K</TableCell>
                        <TableCell className="text-right font-mono">$30K-$60K</TableCell>
                        <TableCell className="text-right font-mono">$35K-$70K</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Director of Revenue Operations</TableCell>
                        <TableCell className="text-right font-mono">$160K-$230K</TableCell>
                        <TableCell className="text-right font-mono">$110K-$160K</TableCell>
                        <TableCell className="text-right font-mono">$45K-$85K</TableCell>
                        <TableCell className="text-right font-mono">$140K-$200K</TableCell>
                        <TableCell className="text-right font-mono">$40K-$75K</TableCell>
                        <TableCell className="text-right font-mono">$50K-$100K</TableCell>
                      </TableRow>
                      <TableRow className="bg-[hsl(184,92%,18%)]/10">
                        <TableCell className="font-semibold">VP Revenue Operations</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(184,92%,18%)] font-bold">$220K-$330K</TableCell>
                        <TableCell className="text-right font-mono">$150K-$240K</TableCell>
                        <TableCell className="text-right font-mono">$70K-$120K</TableCell>
                        <TableCell className="text-right font-mono">$180K-$260K</TableCell>
                        <TableCell className="text-right font-mono">$60K-$100K</TableCell>
                        <TableCell className="text-right font-mono">$80K-$140K</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm font-semibold mb-2">India Growth Leader</p>
                    <p className="text-xs text-muted-foreground">India has fastest YoY salary growth. RevOps specialists often earn more than Marketing Managers. AI skills add 17% uplift.</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm font-semibold mb-2">CRO Pipeline</p>
                    <p className="text-xs text-muted-foreground">One of the fastest-growing C-suite pipelines after PMM. Companies with ARR <$10M rarely hire VPs; sweet spot is Series B → Series E.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
              <CardHeader>
                <CardTitle className="text-[hsl(18,100%,51%)]">Top Skills Commanding Highest RevOps Premiums</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">SQL and Data Querying</span>
                    <Badge className="bg-[hsl(18,100%,51%)] text-white">+42%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">CRM Architecture (Salesforce)</span>
                    <Badge className="bg-[hsl(18,100%,51%)] text-white">+38%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">Attribution Modeling</span>
                    <Badge className="bg-[hsl(18,100%,51%)] text-white">+32%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">AI Workflow Automation</span>
                    <Badge className="bg-[hsl(18,100%,51%)] text-white">+27%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">GTM Strategy Alignment</span>
                    <Badge className="bg-[hsl(18,100%,51%)] text-white">+22%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">Forecasting Accuracy</span>
                    <Badge className="bg-[hsl(18,100%,51%)] text-white">+18%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markops" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Global Marketing Operations Salary Ranges</CardTitle>
                <CardDescription>
                  Marketing Operations: The technical backbone of B2B marketing. Workload rising faster than teams are growing → salary inflation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[250px]">Level</TableHead>
                        <TableHead className="text-right">US</TableHead>
                        <TableHead className="text-right">UK/EU</TableHead>
                        <TableHead className="text-right">India</TableHead>
                        <TableHead className="text-right">APAC</TableHead>
                        <TableHead className="text-right">LATAM</TableHead>
                        <TableHead className="text-right">MENA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">Marketing Operations Specialist</TableCell>
                        <TableCell className="text-right font-mono">$70K-$105K</TableCell>
                        <TableCell className="text-right font-mono">$45K-$70K</TableCell>
                        <TableCell className="text-right font-mono">$12K-$22K</TableCell>
                        <TableCell className="text-right font-mono">$50K-$80K</TableCell>
                        <TableCell className="text-right font-mono">$15K-$30K</TableCell>
                        <TableCell className="text-right font-mono">$20K-$40K</TableCell>
                      </TableRow>
                      <TableRow className="bg-[hsl(18,100%,51%)]/5">
                        <TableCell className="font-semibold">Marketing Automation Manager</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$95K-$140K</TableCell>
                        <TableCell className="text-right font-mono">$60K-$95K</TableCell>
                        <TableCell className="text-right font-mono">$18K-$30K</TableCell>
                        <TableCell className="text-right font-mono">$60K-$100K</TableCell>
                        <TableCell className="text-right font-mono">$18K-$32K</TableCell>
                        <TableCell className="text-right font-mono">$25K-$45K</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Marketing Operations Manager</TableCell>
                        <TableCell className="text-right font-mono">$115K-$160K</TableCell>
                        <TableCell className="text-right font-mono">$70K-$110K</TableCell>
                        <TableCell className="text-right font-mono">$22K-$40K</TableCell>
                        <TableCell className="text-right font-mono">$75K-$120K</TableCell>
                        <TableCell className="text-right font-mono">$20K-$40K</TableCell>
                        <TableCell className="text-right font-mono">$25K-$55K</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Senior Marketing Operations Manager</TableCell>
                        <TableCell className="text-right font-mono">$130K-$175K</TableCell>
                        <TableCell className="text-right font-mono">$90K-$135K</TableCell>
                        <TableCell className="text-right font-mono">$28K-$50K</TableCell>
                        <TableCell className="text-right font-mono">$90K-$145K</TableCell>
                        <TableCell className="text-right font-mono">$25K-$45K</TableCell>
                        <TableCell className="text-right font-mono">$30K-$60K</TableCell>
                      </TableRow>
                      <TableRow className="bg-[hsl(184,92%,18%)]/10">
                        <TableCell className="font-semibold">Director of Marketing Operations</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(184,92%,18%)] font-bold">$160K-$220K</TableCell>
                        <TableCell className="text-right font-mono">$110K-$160K</TableCell>
                        <TableCell className="text-right font-mono">$40K-$75K</TableCell>
                        <TableCell className="text-right font-mono">$130K-$200K</TableCell>
                        <TableCell className="text-right font-mono">$35K-$60K</TableCell>
                        <TableCell className="text-right font-mono">$50K-$90K</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong className="text-foreground">Platform Premiums:</strong> HubSpot, Marketo, Pardot, Braze, Klaviyo, Segment, Zapier/Make, SQL expertise all increase pay. Directors who own Revenue Architecture earn ~20% more globally. MarkOps increasingly overlaps with RevOps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
              <CardHeader>
                <CardTitle className="text-[hsl(184,92%,18%)]">Top Skills Commanding Highest MarkOps Premiums</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">Marketing Automation Mastery</span>
                    <Badge className="bg-[hsl(184,92%,18%)] text-white">+38%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">Journey & Workflow Automation</span>
                    <Badge className="bg-[hsl(184,92%,18%)] text-white">+35%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">Attribution Setup & Maintenance</span>
                    <Badge className="bg-[hsl(184,92%,18%)] text-white">+35%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">SQL & BI Tool Fluency</span>
                    <Badge className="bg-[hsl(184,92%,18%)] text-white">+22-35%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">AI-driven Segmentation</span>
                    <Badge className="bg-[hsl(184,92%,18%)] text-white">+20-28%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <span className="font-medium">Reporting Automation</span>
                    <Badge className="bg-[hsl(184,92%,18%)] text-white">+18%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RevOps vs MarkOps: Side-by-Side Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>RevOps</TableHead>
                        <TableHead>MarkOps</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Primary Focus</TableCell>
                        <TableCell>Revenue engine</TableCell>
                        <TableCell>Marketing engine</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Skill Set</TableCell>
                        <TableCell>CRM + data + forecasting</TableCell>
                        <TableCell>Automation + workflows + attribution</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">AI Adoption</TableCell>
                        <TableCell>Very high</TableCell>
                        <TableCell>High</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Impact on Pipeline</TableCell>
                        <TableCell>Direct</TableCell>
                        <TableCell>Indirect → Direct</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">3-Year Salary Growth</TableCell>
                        <TableCell className="text-[hsl(184,92%,18%)] font-bold">+22%</TableCell>
                        <TableCell className="text-[hsl(184,92%,18%)] font-bold">+17%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Promotion Path</TableCell>
                        <TableCell>CRO, GM, COO</TableCell>
                        <TableCell>VP Marketing, RevOps</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
