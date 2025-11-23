import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SalesSalaryTables = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Global Sales Salary Benchmarks
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Base salary + OTE across SDR, AE, Enterprise Sales, and Sales Leadership roles. All figures in USD.
          </p>
        </div>

        <Alert className="mb-8 border-[hsl(18,100%,51%)]/20 bg-[hsl(18,100%,51%)]/10">
          <AlertCircle className="h-5 w-5 text-[hsl(18,100%,51%)]" />
          <AlertDescription className="text-foreground">
            <strong>Sales compensation volatility is at historic highs.</strong> SDRs: ±10-15% variation, AEs: ±15-22%, Enterprise AEs: ±20-40%. OTE ranges vary 2-6× based on deal size, territory, quota, and stage of company.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="sdr" className="space-y-8">
          <TabsList className="grid w-full max-w-[800px] mx-auto grid-cols-4">
            <TabsTrigger value="sdr">SDR/BDR</TabsTrigger>
            <TabsTrigger value="ae">Account Executive</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise AE</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
          </TabsList>

          <TabsContent value="sdr">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">SDR / BDR (Sales/Business Development Representative)</CardTitle>
                <CardDescription>
                  Pipeline generators focused on outbound & inbound qualification. Base + Variable compensation structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Region</TableHead>
                        <TableHead className="text-right">Base Range</TableHead>
                        <TableHead className="text-right">Typical OTE</TableHead>
                        <TableHead className="min-w-[250px]">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">US</TableCell>
                        <TableCell className="text-right font-mono">$50K-$70K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$80K-$105K</TableCell>
                        <TableCell className="text-sm">Tech hubs (SF, NY) at upper end; SMB at lower</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">UK / Western Europe</TableCell>
                        <TableCell className="text-right font-mono">$40K-$55K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$65K-$85K</TableCell>
                        <TableCell className="text-sm">London, Dublin pay premium vs. rest</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">India</TableCell>
                        <TableCell className="text-right font-mono">$8K-$16K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$12K-$22K</TableCell>
                        <TableCell className="text-sm">High growth in SaaS; ₹10-14L for strong roles</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">APAC (SG, AU, HK)</TableCell>
                        <TableCell className="text-right font-mono">$35K-$55K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$55K-$80K</TableCell>
                        <TableCell className="text-sm">Cost-of-living & English fluency premiums</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">LATAM</TableCell>
                        <TableCell className="text-right font-mono">$12K-$25K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$18K-$35K</TableCell>
                        <TableCell className="text-sm">Often remote roles selling into US/EU markets</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">MENA</TableCell>
                        <TableCell className="text-right font-mono">$20K-$35K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$30K-$50K</TableCell>
                        <TableCell className="text-sm">Enterprise + government verticals</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">AI Impact:</strong> Automation threatens low-skill outbound SDRs. SDRs who orchestrate AI (sequence design, personalization, testing) earn +10-22% premiums. India & LATAM SDRs see highest relative YoY growth due to global hiring.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ae">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Account Executive (AE)</CardTitle>
                <CardDescription>
                  Full sales cycle ownership from discovery to close. OTE typically 2× base in mid-market, 2-3× at enterprise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Region</TableHead>
                        <TableHead className="text-right">Base Range</TableHead>
                        <TableHead className="text-right">Typical OTE</TableHead>
                        <TableHead className="min-w-[250px]">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">US</TableCell>
                        <TableCell className="text-right font-mono">$80K-$120K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$160K-$260K</TableCell>
                        <TableCell className="text-sm">Enterprise SaaS & complex B2B at higher end</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">UK / Western Europe</TableCell>
                        <TableCell className="text-right font-mono">$55K-$90K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$110K-$180K</TableCell>
                        <TableCell className="text-sm">Well-funded SaaS and fintech pay at upper end</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">India</TableCell>
                        <TableCell className="text-right font-mono">$18K-$40K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$30K-$70K</TableCell>
                        <TableCell className="text-sm">Tech/SaaS targeting global markets pay more</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">APAC (SG, AU, HK)</TableCell>
                        <TableCell className="text-right font-mono">$60K-$100K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$120K-$200K</TableCell>
                        <TableCell className="text-sm">Enterprise & regional roles for global SaaS</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">LATAM</TableCell>
                        <TableCell className="text-right font-mono">$20K-$45K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$35K-$85K</TableCell>
                        <TableCell className="text-sm">Many remote AEs sell into US SMB/mid-market</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">MENA</TableCell>
                        <TableCell className="text-right font-mono">$30K-$65K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$60K-$120K</TableCell>
                        <TableCell className="text-sm">Strong in IT services, telco, government accounts</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise / Strategic AE</CardTitle>
                <CardDescription>
                  6-7 figure deals with 6-18 month cycles. Commands highest IC packages outside C-level roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Region</TableHead>
                        <TableHead className="text-right">Base Range</TableHead>
                        <TableHead className="text-right">Typical OTE</TableHead>
                        <TableHead className="min-w-[300px]">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-[hsl(18,100%,51%)]/5">
                        <TableCell className="font-semibold">US</TableCell>
                        <TableCell className="text-right font-mono">$110K-$160K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$220K-$400K+</TableCell>
                        <TableCell className="text-sm">Big-brand SaaS (infra, security, ERP) easily top $350K OTE</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">UK / Western Europe</TableCell>
                        <TableCell className="text-right font-mono">$80K-$130K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$160K-$260K</TableCell>
                        <TableCell className="text-sm">DACH, UK, Nordics lead in enterprise SaaS pay</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">India</TableCell>
                        <TableCell className="text-right font-mono">$30K-$55K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$55K-$110K</TableCell>
                        <TableCell className="text-sm">India-based AEs closing global enterprise business</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">APAC (SG, AU, JP)</TableCell>
                        <TableCell className="text-right font-mono">$80K-$140K</TableCell>
                        <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$160K-$280K</TableCell>
                        <TableCell className="text-sm">Japan often pays highest local base, strict hiring criteria</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 bg-[hsl(18,100%,51%)]/10 rounded-lg border border-[hsl(18,100%,51%)]/20">
                  <p className="text-sm">
                    <strong className="text-foreground">Winner-Takes-Most:</strong> Top performers can make 2-4× the median. Under-performers may earn only base due to missed quotas. Equity is common at growth-stage startups; rare but large in late-stage/public companies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Sales Management Hierarchy</CardTitle>
                  <CardDescription>
                    Frontline managers through VP Sales/CRO. Pay becomes more stable (higher base, lower upside multiple) at leadership levels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        Frontline Sales Manager
                        <Badge variant="outline">Managing SDRs/AEs</Badge>
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead className="text-right">Base Range</TableHead>
                            <TableHead className="text-right">Typical OTE</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>US</TableCell>
                            <TableCell className="text-right font-mono">$110K-$150K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$180K-$260K</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>UK/EU</TableCell>
                            <TableCell className="text-right font-mono">$75K-$120K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$120K-$190K</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>India</TableCell>
                            <TableCell className="text-right font-mono">$22K-$45K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$35K-$70K</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        Director of Sales
                        <Badge variant="outline">Regional/Segment Owner</Badge>
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead className="text-right">Base Range</TableHead>
                            <TableHead className="text-right">Typical OTE</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>US</TableCell>
                            <TableCell className="text-right font-mono">$140K-$200K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$250K-$400K</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>UK/EU</TableCell>
                            <TableCell className="text-right font-mono">$100K-$160K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$180K-$300K</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>India</TableCell>
                            <TableCell className="text-right font-mono">$40K-$75K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$70K-$130K</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        VP Sales / CRO
                        <Badge className="bg-[hsl(184,92%,18%)] text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Highest Comp
                        </Badge>
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead className="text-right">Base Range</TableHead>
                            <TableHead className="text-right">Typical OTE</TableHead>
                            <TableHead className="text-right">Equity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-[hsl(18,100%,51%)]/5">
                            <TableCell className="font-semibold">US</TableCell>
                            <TableCell className="text-right font-mono">$190K-$300K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)] font-bold">$350K-$700K+</TableCell>
                            <TableCell className="text-right text-sm">0.2%-2%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>UK/EU</TableCell>
                            <TableCell className="text-right font-mono">$150K-$250K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$300K-$550K</TableCell>
                            <TableCell className="text-right text-sm">0.1%-1.2%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>India</TableCell>
                            <TableCell className="text-right font-mono">$60K-$120K</TableCell>
                            <TableCell className="text-right font-mono text-[hsl(18,100%,51%)]">$120K-$250K</TableCell>
                            <TableCell className="text-right text-sm">ESOP/Founder-level</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(184,92%,18%)]/10 border-[hsl(184,92%,18%)]/20">
                <CardHeader>
                  <CardTitle className="text-[hsl(184,92%,18%)]">Skills Commanding Highest Premiums</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="font-medium">MEDDIC/MEDDICC expertise</span>
                      <Badge className="bg-[hsl(184,92%,18%)] text-white">+25-30%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="font-medium">AI-assisted selling mastery</span>
                      <Badge className="bg-[hsl(184,92%,18%)] text-white">+20-25%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="font-medium">Multi-region selling</span>
                      <Badge className="bg-[hsl(184,92%,18%)] text-white">+18-22%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="font-medium">Data literacy & RevOps collaboration</span>
                      <Badge className="bg-[hsl(184,92%,18%)] text-white">+15-25%</Badge>
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
