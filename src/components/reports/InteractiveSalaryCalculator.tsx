import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, Download, Share2, TrendingUp } from "lucide-react";
import { formatCurrency, getSalaryForRole, getAdjustedSalary, getPercentile } from "@/lib/salaryData";
import { getIndustryMultiplier } from "@/lib/salaryData/industries";
import { Badge } from "@/components/ui/badge";
import { triggerConfetti } from "@/components/lazy/LazyConfetti";

export const InteractiveSalaryCalculator = () => {
  const [role, setRole] = useState("Marketing Manager");
  const [location, setLocation] = useState("Austin, TX");
  const [experience, setExperience] = useState("5");
  const [industry, setIndustry] = useState("Technology/SaaS");
  const [companySize, setCompanySize] = useState("Medium");
  const [currentSalary, setCurrentSalary] = useState("");
  
  const [result, setResult] = useState<{
    estimatedSalary: number;
    percentile: number;
    range: { min: number; max: number };
  } | null>(null);

  const calculateSalary = () => {
    const roleData = getSalaryForRole(role);
    if (!roleData) return;

    const baseSalary = roleData.baseCompensation.p50;
    const industryMult = getIndustryMultiplier(industry);
    const adjustedSalary = getAdjustedSalary(baseSalary * industryMult, location, companySize);
    
    const percentile = currentSalary ? getPercentile(parseInt(currentSalary), role) : 50;
    
    setResult({
      estimatedSalary: adjustedSalary,
      percentile,
      range: {
        min: Math.round(adjustedSalary * 0.9),
        max: Math.round(adjustedSalary * 1.15)
      }
    });

    triggerConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blazeOrange/10">
            <Calculator className="h-6 w-6 text-blazeOrange" />
          </div>
          <CardTitle className="text-2xl font-display">Interactive Salary Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                <SelectItem value="Senior Marketing Manager">Senior Marketing Manager</SelectItem>
                <SelectItem value="Marketing Director">Marketing Director</SelectItem>
                <SelectItem value="Marketing Operations Manager">Marketing Operations Manager</SelectItem>
                <SelectItem value="Sales Operations Manager">Sales Operations Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                <SelectItem value="Remote (US)">Remote (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Years Experience</Label>
            <Input 
              type="number" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)}
              min="0"
              max="30"
            />
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology/SaaS">Technology/SaaS</SelectItem>
                <SelectItem value="Financial Services">Financial Services</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="E-commerce/Retail">E-commerce/Retail</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Startup">Startup (1-50)</SelectItem>
                <SelectItem value="Small">Small (51-200)</SelectItem>
                <SelectItem value="Medium">Medium (201-500)</SelectItem>
                <SelectItem value="Large">Large (501-2000)</SelectItem>
                <SelectItem value="Enterprise">Enterprise (2000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Current Salary (Optional)</Label>
            <Input 
              type="number" 
              placeholder="e.g., 95000"
              value={currentSalary} 
              onChange={(e) => setCurrentSalary(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={calculateSalary} 
          size="lg" 
          className="w-full bg-blazeOrange hover:bg-blazeOrange/90"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          Calculate My Salary
        </Button>

        {result && (
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="text-center space-y-2">
              <div className="text-sm text-secondary-label">Estimated Salary</div>
              <div className="text-5xl font-display font-bold text-blazeOrange">
                {formatCurrency(result.estimatedSalary)}
              </div>
              <div className="text-sm text-secondary-label">
                Range: {formatCurrency(result.range.min)} - {formatCurrency(result.range.max)}
              </div>
            </div>

            {currentSalary && (
              <div className="text-center p-4 bg-deepSea/10 rounded-lg">
                <div className="text-sm text-secondary-label mb-1">Your Percentile</div>
                <Badge variant="default" className="text-lg px-4 py-2 bg-deepSea">
                  {result.percentile.toFixed(0)}th Percentile
                </Badge>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share Result
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
