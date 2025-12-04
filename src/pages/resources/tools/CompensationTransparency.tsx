import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { HowToUse } from "@/components/tools/HowToUse";
import { Shield, Calculator, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { salaryBenchmarks, getSalaryForRole, formatCurrency } from "@/lib/salaryData";

const CompensationTransparency = () => {
  const [selectedRole, setSelectedRole] = useState("Marketing Manager");
  
  const salaryData = getSalaryForRole(selectedRole);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Compensation Transparency Generator",
          "applicationCategory": "BusinessApplication",
          "description": "Create compliant salary bands and transparency materials with pay equity analysis",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "operatingSystem": "Web Browser",
          "author": { "@type": "Organization", "name": "utm.one" }
        })}
      </script>
      <ToolLayout
      title="Compensation Transparency Generator"
      description="create fair, competitive salary bands and job posting ranges"
      icon={Shield}
      relatedTools={[
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator },
        { title: "Team Budget Optimizer", href: "/resources/tools/team-budget-optimizer", icon: Users }
      ]}
    >
      <HowToUse steps={[
        { title: "Select the role", description: "Choose the job title you want to create salary bands for" },
        { title: "Review recommended bands", description: "See 25th, 50th, and 75th percentile salary ranges" },
        { title: "Copy job posting range", description: "Use the generated salary range text for your job listings" },
        { title: "Get transparency badge", description: "Embed the 'We Pay Fair' badge on your careers page" }
      ]} />

      <Card>
        <CardHeader>
          <CardTitle className="lowercase">generate salary bands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {salaryBenchmarks.map((role) => (
                  <SelectItem key={role.role} value={role.role}>{role.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {salaryData && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="lowercase">recommended salary bands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg border">
                    <Badge variant="outline" className="mb-2">MINIMUM</Badge>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {formatCurrency(salaryData.baseCompensation.p25)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">25th percentile</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border-2 border-white/30" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Badge variant="default" className="mb-2">MIDPOINT</Badge>
                    <div className="text-2xl font-display font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {formatCurrency(salaryData.baseCompensation.p50)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">50th percentile</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Badge variant="outline" className="mb-2">MAXIMUM</Badge>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {formatCurrency(salaryData.baseCompensation.p75)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">75th percentile</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="lowercase">job posting salary range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/50 border font-mono text-sm">
                Salary Range: {formatCurrency(salaryData.baseCompensation.p25)} - {formatCurrency(salaryData.baseCompensation.p75)} based on experience and qualifications
              </div>
              <Button variant="outline" className="w-full mt-4">
                Copy to Clipboard
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/20" style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.1))' }}>
            <CardHeader>
              <CardTitle className="lowercase">"we pay fair" badge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-6 bg-zinc-900/40 rounded-lg border-2 border-white/30">
                <Badge variant="default" className="text-lg px-4 py-2">
                  💰 We Pay Fair
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Powered by utm.one
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Get Embed Code
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      </ToolLayout>
    </>
  );
};

export default CompensationTransparency;