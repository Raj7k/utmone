import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, Download, Share2, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import confetti from "canvas-confetti";
import { formatCurrency } from "@/lib/salaryData";

// Section 8 Formula Implementation
interface GlobalBase {
  role: string;
  baseUSD: number;
}

const globalBaseSalaries: GlobalBase[] = [
  { role: "Product Marketing Manager", baseUSD: 70000 },
  { role: "Demand Generation Manager", baseUSD: 65000 },
  { role: "Growth Marketing Manager", baseUSD: 68000 },
  { role: "Content Strategist", baseUSD: 45000 },
  { role: "Brand Manager", baseUSD: 55000 },
  { role: "Marketing Operations Manager", baseUSD: 75000 },
  { role: "Revenue Operations Manager", baseUSD: 80000 },
  { role: "SDR / BDR", baseUSD: 28000 },
  { role: "Account Executive (AE)", baseUSD: 60000 },
  { role: "Enterprise AE", baseUSD: 95000 },
  { role: "Sales Manager", baseUSD: 85000 },
];

const regionMultipliers: Record<string, { min: number; max: number }> = {
  "United States": { min: 1.6, max: 2.1 },
  "Europe (UK, DACH, Nordics)": { min: 1.2, max: 1.4 },
  "Australia / Singapore / Japan": { min: 1.3, max: 1.5 },
  "India": { min: 0.35, max: 0.55 },
  "LATAM": { min: 0.40, max: 0.60 },
  "MENA": { min: 0.45, max: 0.75 },
  "Eastern Europe": { min: 0.60, max: 0.80 },
};

const experienceMultipliers: Record<string, number> = {
  "0-2 years": 0.70,
  "2-5 years": 0.90,
  "5-8 years": 1.20,
  "8-12 years": 1.45,
  "12+ years": 1.80,
};

const companySizeMultipliers: Record<string, number> = {
  "0-50": 0.82,
  "51-200": 0.97,
  "201-1,000": 1.10,
  "1,000-10,000": 1.30,
  "10,000+": 1.60,
};

const industryMultipliers: Record<string, { min: number; max: number }> = {
  "SaaS": { min: 1.2, max: 1.5 },
  "Fintech": { min: 1.3, max: 1.6 },
  "Healthcare": { min: 1.1, max: 1.4 },
  "Manufacturing": { min: 0.9, max: 1.1 },
  "Consumer / E-commerce": { min: 0.8, max: 1.1 },
  "Edtech": { min: 0.85, max: 1.05 },
  "IT Services": { min: 0.95, max: 1.15 },
};

interface Skill {
  name: string;
  premium: number;
}

const highPremiumSkills: Skill[] = [
  { name: "AI Workflow Automation", premium: 0.15 },
  { name: "SQL / Data Querying", premium: 0.12 },
  { name: "Salesforce / HubSpot / Marketo Mastery", premium: 0.15 },
  { name: "Multi-touch Attribution", premium: 0.12 },
  { name: "GTM Strategy (PMM)", premium: 0.18 },
  { name: "Revenue Forecasting (RevOps)", premium: 0.12 },
  { name: "ABM Strategy", premium: 0.10 },
  { name: "Lifecycle Automation", premium: 0.10 },
];

const midPremiumSkills: Skill[] = [
  { name: "CRO & Experimentation", premium: 0.06 },
  { name: "Paid Performance Optimization", premium: 0.07 },
  { name: "Analytics (GA4, Mixpanel)", premium: 0.05 },
  { name: "A/B Testing", premium: 0.05 },
  { name: "Multi-region Selling", premium: 0.06 },
];

export const EnhancedSalaryCalculator = () => {
  const [role, setRole] = useState("Product Marketing Manager");
  const [region, setRegion] = useState("United States");
  const [experience, setExperience] = useState("5-8 years");
  const [companySize, setCompanySize] = useState("201-1,000");
  const [industry, setIndustry] = useState("SaaS");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentSalary, setCurrentSalary] = useState("");
  
  const [result, setResult] = useState<{
    baseSalary: number;
    salaryRange: { min: number; max: number };
    oteRange?: { min: number; max: number };
    confidenceScore: number;
    skillGaps: string[];
    percentile?: number;
  } | null>(null);

  const calculateSalary = () => {
    const baseData = globalBaseSalaries.find(r => r.role === role);
    if (!baseData) return;

    const globalBase = baseData.baseUSD;
    const regionMult = (regionMultipliers[region].min + regionMultipliers[region].max) / 2;
    const expMult = experienceMultipliers[experience];
    const sizeMult = companySizeMultipliers[companySize];
    const industryMult = (industryMultipliers[industry].min + industryMultipliers[industry].max) / 2;
    
    const skillMult = selectedSkills.reduce((sum, skillName) => {
      const skill = [...highPremiumSkills, ...midPremiumSkills].find(s => s.name === skillName);
      return sum + (skill?.premium || 0);
    }, 0);

    const finalSalary = globalBase * regionMult * expMult * sizeMult * industryMult * (1 + skillMult);

    const isSalesRole = role.includes("AE") || role.includes("SDR") || role.includes("Sales Manager");
    const oteMultiplier = role.includes("Enterprise") ? 2.5 : 2.0;

    const allSkills = [...highPremiumSkills, ...midPremiumSkills];
    const missingHighValueSkills = highPremiumSkills
      .filter(skill => !selectedSkills.includes(skill.name))
      .slice(0, 3)
      .map(s => s.name);

    const confidenceScore = 0.75 + (selectedSkills.length * 0.02);

    const percentile = currentSalary ? calculatePercentile(parseInt(currentSalary), finalSalary) : undefined;

    setResult({
      baseSalary: Math.round(finalSalary),
      salaryRange: {
        min: Math.round(finalSalary * 0.90),
        max: Math.round(finalSalary * 1.15)
      },
      oteRange: isSalesRole ? {
        min: Math.round(finalSalary * (oteMultiplier * 0.9)),
        max: Math.round(finalSalary * (oteMultiplier * 1.2))
      } : undefined,
      confidenceScore: Math.min(0.95, confidenceScore),
      skillGaps: missingHighValueSkills,
      percentile
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const calculatePercentile = (userSalary: number, estimated: number): number => {
    if (userSalary < estimated * 0.7) return 25;
    if (userSalary < estimated * 0.9) return 40;
    if (userSalary < estimated * 1.0) return 50;
    if (userSalary < estimated * 1.15) return 65;
    if (userSalary < estimated * 1.3) return 75;
    return 90;
  };

  const toggleSkill = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blazeOrange/10">
            <Calculator className="h-6 w-6 text-blazeOrange" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Enhanced Global Salary Calculator</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Based on Section 8 Formula: Global Base × Region × Experience × Company Size × Industry × (1 + Skills)
            </p>
          </div>
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
                {globalBaseSalaries.map(r => (
                  <SelectItem key={r.role} value={r.role}>{r.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(regionMultipliers).map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(experienceMultipliers).map(e => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
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
                {Object.keys(companySizeMultipliers).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(industryMultipliers).map(i => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
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

        <div className="space-y-4">
          <Label className="text-lg">Select Your Skills (High Premium)</Label>
          <div className="grid md:grid-cols-2 gap-3">
            {highPremiumSkills.map(skill => (
              <div key={skill.name} className="flex items-center space-x-2">
                <Checkbox 
                  id={skill.name} 
                  checked={selectedSkills.includes(skill.name)}
                  onCheckedChange={() => toggleSkill(skill.name)}
                />
                <label htmlFor={skill.name} className="text-sm cursor-pointer flex-1">
                  {skill.name}
                  <Badge className="ml-2 bg-blazeOrange text-xs">+{(skill.premium * 100).toFixed(0)}%</Badge>
                </label>
              </div>
            ))}
          </div>

          <Label className="text-base text-muted-foreground">Mid Premium Skills</Label>
          <div className="grid md:grid-cols-2 gap-3">
            {midPremiumSkills.map(skill => (
              <div key={skill.name} className="flex items-center space-x-2">
                <Checkbox 
                  id={skill.name} 
                  checked={selectedSkills.includes(skill.name)}
                  onCheckedChange={() => toggleSkill(skill.name)}
                />
                <label htmlFor={skill.name} className="text-sm cursor-pointer flex-1">
                  {skill.name}
                  <Badge className="ml-2 bg-deepSea text-xs">+{(skill.premium * 100).toFixed(0)}%</Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={calculateSalary} 
          size="lg" 
          className="w-full bg-blazeOrange hover:bg-blazeOrange/90"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          Calculate My Global Salary
        </Button>

        {result && (
          <div className="space-y-6 pt-6 border-t border-border">
            <div className="text-center space-y-3">
              <div className="text-sm text-muted-foreground">Estimated Base Salary</div>
              <div className="text-5xl font-display font-extrabold text-blazeOrange">
                {formatCurrency(result.baseSalary)}
              </div>
              <div className="text-sm text-muted-foreground">
                Range: {formatCurrency(result.salaryRange.min)} - {formatCurrency(result.salaryRange.max)}
              </div>
              {result.oteRange && (
                <div className="mt-2 p-3 bg-deepSea/10 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">OTE (On-Target Earnings)</div>
                  <div className="text-2xl font-display font-bold text-deepSea">
                    {formatCurrency(result.oteRange.min)} - {formatCurrency(result.oteRange.max)}
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Confidence Score</div>
                <div className="text-3xl font-display font-bold">
                  {(result.confidenceScore * 100).toFixed(0)}%
                </div>
              </div>

              {result.percentile && (
                <div className="text-center p-4 bg-deepSea/10 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Your Percentile</div>
                  <Badge variant="default" className="text-xl px-4 py-2 bg-deepSea">
                    {result.percentile}th
                  </Badge>
                </div>
              )}
            </div>

            {result.skillGaps.length > 0 && (
              <div className="p-4 bg-blazeOrange/5 border border-blazeOrange/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blazeOrange mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">Skills You're Missing (High Value)</h4>
                    <ul className="space-y-1">
                      {result.skillGaps.map(skill => (
                        <li key={skill} className="text-sm text-muted-foreground">
                          • {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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