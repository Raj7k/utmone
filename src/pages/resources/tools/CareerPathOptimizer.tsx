import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { TrendingUp, MessageSquare, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { salaryBenchmarks, getPromotionSalaryJump, formatCurrency } from "@/lib/salaryData";

const CareerPathOptimizer = () => {
  const [currentRole, setCurrentRole] = useState("Marketing Manager");
  
  const nextRoles = salaryBenchmarks.filter(r => 
    (r.level === 'senior' || r.level === 'lead' || r.level === 'director') &&
    r.role !== currentRole
  ).slice(0, 3);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Career Path Optimizer",
          "applicationCategory": "BusinessApplication",
          "description": "Plan your next career move with salary impact analysis and role progression recommendations",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "operatingSystem": "Web Browser",
          "author": { "@type": "Organization", "name": "utm.one" }
        })}
      </script>
      <ToolLayout
      title="Career Path Optimizer"
      description="discover your optimal next move and salary progression timeline"
      icon={TrendingUp}
      relatedTools={[
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator },
        { title: "AI Salary Negotiation Coach", href: "/resources/tools/salary-negotiation-coach", icon: MessageSquare }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="lowercase">your current role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="currentRole">Select Your Role</Label>
            <Select value={currentRole} onValueChange={setCurrentRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {salaryBenchmarks.map((role) => (
                  <SelectItem key={role.role} value={role.role}>
                    {role.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-2xl font-display font-bold mb-6 lowercase">recommended next moves</h3>
        <div className="grid gap-6">
          {nextRoles.map((role, index) => {
            const currentData = salaryBenchmarks.find(r => r.role === currentRole);
            const nextData = salaryBenchmarks.find(r => r.role === role.role);
            const salaryJump = currentData && nextData 
              ? ((nextData.baseCompensation.p50 - currentData.baseCompensation.p50) / currentData.baseCompensation.p50) * 100
              : 0;

            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">{index === 0 ? 'RECOMMENDED' : 'ALTERNATIVE'}</Badge>
                      <CardTitle className="text-xl">{role.role}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-display font-bold text-primary">
                        +{salaryJump.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">salary increase</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">median salary</div>
                      <div className="text-xl font-display font-bold">
                        {formatCurrency(nextData!.baseCompensation.p50)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">typical timeline</div>
                      <div className="text-xl font-display font-bold">
                        2-4 years
                      </div>
                    </div>
                  </div>
                  {role.skills && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">key skills needed</div>
                      <div className="flex flex-wrap gap-2">
                        {role.skills.slice(0, 4).map((skill, idx) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      </ToolLayout>
    </>
  );
};

export default CareerPathOptimizer;