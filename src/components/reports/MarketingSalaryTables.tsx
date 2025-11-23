import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const b2bMarketingData = [
  {
    role: "Product Marketing Manager (PMM)",
    levels: [
      { level: "Associate", us: "$75-95K", ukeu: "$45-60K", india: "$12-18K", apac: "$30-45K", latam: "$10-16K", mena: "$20-30K" },
      { level: "Manager", us: "$115-150K", ukeu: "$65-90K", india: "$22-35K", apac: "$45-70K", latam: "$16-26K", mena: "$28-40K" },
      { level: "Senior Manager", us: "$140-180K", ukeu: "$80-110K", india: "$30-45K", apac: "$55-85K", latam: "$20-30K", mena: "$35-50K" },
      { level: "Director", us: "$175-240K", ukeu: "$100-140K", india: "$40-60K", apac: "$80-120K", latam: "$25-40K", mena: "$50-70K" },
      { level: "VP", us: "$240-340K", ukeu: "$140-190K", india: "$55-85K", apac: "$110-160K", latam: "$35-55K", mena: "$70-100K" }
    ],
    growth: "high",
    aiImpact: "low"
  },
  {
    role: "Demand Generation",
    levels: [
      { level: "Manager", us: "$105-135K", ukeu: "$60-85K", india: "$18-30K", apac: "$40-60K", latam: "$14-22K", mena: "$25-35K" },
      { level: "Senior Manager", us: "$130-165K", ukeu: "$75-105K", india: "$25-38K", apac: "$45-70K", latam: "$16-26K", mena: "$28-40K" },
      { level: "Director", us: "$150-210K", ukeu: "$90-130K", india: "$30-45K", apac: "$55-85K", latam: "$18-30K", mena: "$35-50K" },
      { level: "Head/VP", us: "$200-300K", ukeu: "$120-180K", india: "$45-65K", apac: "$75-120K", latam: "$25-40K", mena: "$50-70K" }
    ],
    growth: "high",
    aiImpact: "medium"
  },
  {
    role: "Growth Marketing",
    levels: [
      { level: "IC/Manager", us: "$110-150K", ukeu: "$60-90K", india: "$18-32K", apac: "$40-65K", latam: "$15-24K", mena: "$25-38K" },
      { level: "Senior Manager", us: "$135-170K", ukeu: "$75-110K", india: "$22-38K", apac: "$45-75K", latam: "$17-26K", mena: "$30-42K" },
      { level: "Head/Director", us: "$160-220K", ukeu: "$90-140K", india: "$30-50K", apac: "$60-100K", latam: "$22-32K", mena: "$40-55K" }
    ],
    growth: "high",
    aiImpact: "medium"
  },
  {
    role: "Content Marketing",
    levels: [
      { level: "Writer/Strategist", us: "$65-95K", ukeu: "$40-60K", india: "$8-15K", apac: "$20-35K", latam: "$8-14K", mena: "$12-22K" },
      { level: "Senior Writer", us: "$80-115K", ukeu: "$50-75K", india: "$12-20K", apac: "$25-40K", latam: "$10-18K", mena: "$15-28K" },
      { level: "Content Lead", us: "$110-140K", ukeu: "$60-90K", india: "$18-30K", apac: "$30-50K", latam: "$12-20K", mena: "$18-30K" }
    ],
    growth: "declining",
    aiImpact: "high"
  },
  {
    role: "Marketing Operations",
    levels: [
      { level: "Manager", us: "$115-160K", ukeu: "$70-110K", india: "$22-40K", apac: "$75-120K", latam: "$20-40K", mena: "$25-55K" },
      { level: "Senior Manager", us: "$130-175K", ukeu: "$90-135K", india: "$28-50K", apac: "$90-145K", latam: "$25-45K", mena: "$30-60K" },
      { level: "Director", us: "$160-220K", ukeu: "$110-160K", india: "$40-75K", apac: "$130-200K", latam: "$35-60K", mena: "$50-90K" }
    ],
    growth: "high",
    aiImpact: "low"
  }
];

export const MarketingSalaryTables = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Global Marketing Salary Benchmarks
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Comprehensive salary data across 6 regions and 15+ marketing roles. All figures in USD equivalent for consistency.
          </p>
        </div>

        <Tabs defaultValue="b2b" className="space-y-8">
          <TabsList className="grid w-full max-w-[600px] mx-auto grid-cols-3">
            <TabsTrigger value="b2b">B2B Marketing</TabsTrigger>
            <TabsTrigger value="b2c">B2C Marketing</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="b2b" className="space-y-8">
            {b2bMarketingData.map((roleData, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{roleData.role}</CardTitle>
                      <CardDescription className="mt-2">
                        Global compensation across all seniority levels
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {roleData.growth === "high" && (
                        <Badge className="bg-[hsl(184,92%,18%)] text-white gap-1">
                          <TrendingUp className="w-4 h-4" />
                          High Growth
                        </Badge>
                      )}
                      {roleData.growth === "declining" && (
                        <Badge variant="destructive" className="gap-1">
                          <TrendingDown className="w-4 h-4" />
                          At Risk
                        </Badge>
                      )}
                      {roleData.aiImpact === "high" && (
                        <Badge variant="outline" className="border-[hsl(18,100%,51%)] text-[hsl(18,100%,51%)]">
                          High AI Impact
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Level</TableHead>
                          <TableHead className="text-right">US</TableHead>
                          <TableHead className="text-right">UK/EU</TableHead>
                          <TableHead className="text-right">India</TableHead>
                          <TableHead className="text-right">APAC</TableHead>
                          <TableHead className="text-right">LATAM</TableHead>
                          <TableHead className="text-right">MENA</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roleData.levels.map((level, levelIdx) => (
                          <TableRow key={levelIdx}>
                            <TableCell className="font-medium">{level.level}</TableCell>
                            <TableCell className="text-right font-mono">{level.us}</TableCell>
                            <TableCell className="text-right font-mono">{level.ukeu}</TableCell>
                            <TableCell className="text-right font-mono">{level.india}</TableCell>
                            <TableCell className="text-right font-mono">{level.apac}</TableCell>
                            <TableCell className="text-right font-mono">{level.latam}</TableCell>
                            <TableCell className="text-right font-mono">{level.mena}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="b2c">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">B2C Marketing Roles</CardTitle>
                <CardDescription>
                  B2C compensation is typically 10-30% lower than B2B except for Performance Marketing and CRM/Lifecycle roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Performance Marketing (Meta/Google Ads)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Level</TableHead>
                          <TableHead className="text-right">US</TableHead>
                          <TableHead className="text-right">UK/EU</TableHead>
                          <TableHead className="text-right">India</TableHead>
                          <TableHead className="text-right">APAC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Specialist</TableCell>
                          <TableCell className="text-right font-mono">$70-95K</TableCell>
                          <TableCell className="text-right font-mono">$40-60K</TableCell>
                          <TableCell className="text-right font-mono">$8-18K</TableCell>
                          <TableCell className="text-right font-mono">$20-35K</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Manager</TableCell>
                          <TableCell className="text-right font-mono">$95-135K</TableCell>
                          <TableCell className="text-right font-mono">$55-80K</TableCell>
                          <TableCell className="text-right font-mono">$15-25K</TableCell>
                          <TableCell className="text-right font-mono">$30-50K</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Director</TableCell>
                          <TableCell className="text-right font-mono">$140-180K</TableCell>
                          <TableCell className="text-right font-mono">$75-115K</TableCell>
                          <TableCell className="text-right font-mono">$22-35K</TableCell>
                          <TableCell className="text-right font-mono">$40-65K</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Lifecycle / CRM Marketing</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Level</TableHead>
                          <TableHead className="text-right">US</TableHead>
                          <TableHead className="text-right">UK/EU</TableHead>
                          <TableHead className="text-right">India</TableHead>
                          <TableHead className="text-right">APAC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Manager</TableCell>
                          <TableCell className="text-right font-mono">$95-125K</TableCell>
                          <TableCell className="text-right font-mono">$55-80K</TableCell>
                          <TableCell className="text-right font-mono">$12-22K</TableCell>
                          <TableCell className="text-right font-mono">$28-45K</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Senior Manager</TableCell>
                          <TableCell className="text-right font-mono">$115-150K</TableCell>
                          <TableCell className="text-right font-mono">$65-95K</TableCell>
                          <TableCell className="text-right font-mono">$18-30K</TableCell>
                          <TableCell className="text-right font-mono">$30-50K</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
                <CardHeader>
                  <CardTitle className="text-[hsl(184,92%,18%)]">High Growth Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[hsl(184,92%,18%)] mt-0.5" />
                    <div>
                      <p className="font-semibold">Product Marketing</p>
                      <p className="text-sm text-muted-foreground">Highest-paid marketing role globally, AI hasn't commoditized positioning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[hsl(184,92%,18%)] mt-0.5" />
                    <div>
                      <p className="font-semibold">Demand Generation</p>
                      <p className="text-sm text-muted-foreground">Pipeline-accountable role with direct CAC impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-[hsl(184,92%,18%)] mt-0.5" />
                    <div>
                      <p className="font-semibold">Marketing Operations</p>
                      <p className="text-sm text-muted-foreground">18-30% salary premiums due to scarcity and automation skills</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-destructive/10 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">At-Risk Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-semibold">Content Writing</p>
                      <p className="text-sm text-muted-foreground">AI automation causing downward salary pressure, strategy still valuable</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-semibold">Social Media Management</p>
                      <p className="text-sm text-muted-foreground">Highly saturated market with AI + freelancer competition</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-semibold">Basic SEO</p>
                      <p className="text-sm text-muted-foreground">Content SEO commoditizing, technical SEO still has value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-[hsl(18,100%,51%)]/10 border-[hsl(18,100%,51%)]/20">
                <CardHeader>
                  <CardTitle className="text-[hsl(18,100%,51%)]">Skill-Based Salary Multipliers</CardTitle>
                  <CardDescription>Skills that add the highest compensation premiums across all marketing roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">AI-assisted campaign execution</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+42%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Marketing automation platforms</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+38%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Attribution modeling</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+35%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">SQL, Python, data querying</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+32%</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Product storytelling</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+27%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">GTM planning frameworks</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+18%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cross-regional market experience</span>
                        <Badge className="bg-[hsl(18,100%,51%)] text-white">+10-15%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
