import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { genderPayGapByRole, genderPayGapByIndustry } from "@/lib/salaryData/genderGap";
import { formatCurrency } from "@/lib/salaryData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const GenderPayGapDashboard = () => {
  const [selectedRole, setSelectedRole] = useState("all");
  
  const roleData = selectedRole === "all" 
    ? genderPayGapByRole 
    : genderPayGapByRole.filter(d => d.role === selectedRole);

  const chartData = roleData.map(d => ({
    name: d.role.split(' ').slice(-2).join(' '),
    Male: d.maleMedian,
    Female: d.femaleMedian,
    gap: d.gapPercentage
  }));

  return (
    <div className="space-y-8">
      <Card className="border-2 border-mirage/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-mirage/10">
                <Users className="h-6 w-6 text-mirage" />
              </div>
              <div>
                <CardTitle className="text-2xl font-display">Gender Pay Gap Analysis</CardTitle>
                <CardDescription className="mt-2">
                  Median salary comparison across gender by role and industry
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-mirage text-mirage">
              2026 Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by Role:</span>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {genderPayGapByRole.map(d => (
                  <SelectItem key={d.role} value={d.role}>{d.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" tickFormatter={(val) => `$${val / 1000}K`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Legend />
                <Bar dataKey="Male" fill="hsl(217 91% 60%)" name="Male Median" />
                <Bar dataKey="Female" fill="hsl(184 92% 18%)" name="Female Median" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
            {roleData.map(d => (
              <Card key={d.role} className="border-mirage/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{d.role}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pay Gap</span>
                    <Badge variant={d.gapPercentage > 6 ? "destructive" : "secondary"}>
                      {d.gapPercentage}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gap Amount</span>
                    <span className="font-medium">{formatCurrency(d.gapAmount)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                    Sample: {d.sampleSize.male + d.sampleSize.female} respondents
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Breakdown */}
      <Card className="border-2 border-mirage/20">
        <CardHeader>
          <CardTitle className="text-xl font-display">Pay Gap by Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {genderPayGapByIndustry.map(ind => (
              <div key={ind.industry} className="flex items-center justify-between p-4 rounded-lg bg-wildSand/50 hover:bg-wildSand transition-apple">
                <div className="space-y-1">
                  <div className="font-medium">{ind.industry}</div>
                  <div className="text-sm text-muted-foreground">
                    Male: {formatCurrency(ind.maleAvg)} / Female: {formatCurrency(ind.femaleAvg)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={ind.gapPercentage > 6 ? "destructive" : "secondary"} className="text-base px-3 py-1">
                    {ind.gapPercentage}%
                  </Badge>
                  {ind.gapPercentage > 6 ? (
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-mirage/5 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-mirage mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Methodology Note:</strong> Gender pay gap calculated as 
              the percentage difference between male and female median salaries for equivalent roles and experience levels. 
              Data represents 20,247 survey respondents who self-identified gender.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
