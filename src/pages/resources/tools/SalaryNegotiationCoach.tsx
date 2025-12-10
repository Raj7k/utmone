import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { HowToUse } from "@/components/tools/HowToUse";
import { MessageSquare, Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { salaryBenchmarks, getSalaryForRole, getPercentile, formatCurrency } from "@/lib/salaryData";

const SalaryNegotiationCoach = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    yearsExperience: "",
    location: "",
    companySize: "",
    currentSalary: "",
    offerSalary: ""
  });
  const [scripts, setScripts] = useState<any>(null);

  const handleGenerate = async () => {
    if (!formData.role || !formData.currentSalary) {
      notify.warning("please fill in role and current salary");
      return;
    }

    setIsGenerating(true);
    try {
      const salaryData = getSalaryForRole(formData.role);
      const percentile = getPercentile(parseInt(formData.currentSalary), formData.role);

      const { data, error } = await supabase.functions.invoke('generate-negotiation-script', {
        body: {
          userData: formData,
          marketData: {
            p50: salaryData?.baseCompensation.p50,
            p75: salaryData?.baseCompensation.p75,
            p90: salaryData?.baseCompensation.p90,
            percentile
          }
        }
      });

      if (error) throw error;
      setScripts(data);
      notify.success("scripts generated");
    } catch (error: any) {
      notify.error(error.message || "generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Salary Negotiation Coach",
          "applicationCategory": "FinanceApplication",
          "description": "AI-powered salary negotiation script generator with personalized strategies based on real market data",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "operatingSystem": "Web Browser",
          "author": { "@type": "Organization", "name": "utm.one" }
        })}
      </script>
      <ToolLayout
      title="AI Salary Negotiation Coach"
      description="generate personalized negotiation scripts based on real market data"
      icon={MessageSquare}
      relatedTools={[
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator },
        { title: "Job Offer Analyzer", href: "/resources/tools/job-offer-analyzer", icon: TrendingUp }
      ]}
    >
      <HowToUse steps={[
        { title: "Select your role", description: "Choose your current job title from the dropdown" },
        { title: "Enter your details", description: "Input your current compensation and years of experience" },
        { title: "Add offer details", description: "Include any offer you're evaluating (optional)" },
        { title: "Generate scripts", description: "Click generate to receive AI-powered negotiation language" },
        { title: "Practice & customize", description: "Use the scripts as a starting point and personalize for your situation" }
      ]} />

      <Card>
        <CardHeader>
          <CardTitle>your information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Current Role</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
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
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                placeholder="5"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentSalary">Current Salary ($)</Label>
              <Input
                id="currentSalary"
                type="number"
                placeholder="85000"
                value={formData.currentSalary}
                onChange={(e) => setFormData({...formData, currentSalary: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerSalary">Offer Salary ($ - optional)</Label>
              <Input
                id="offerSalary"
                type="number"
                placeholder="95000"
                value={formData.offerSalary}
                onChange={(e) => setFormData({...formData, offerSalary: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4">
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Negotiation Scripts
          </Button>
        </CardContent>
      </Card>

      {scripts && (
        <div className="space-y-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>opening statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={scripts.opening || "Script will appear here..."} rows={4} readOnly className="font-mono text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>counter-offer phrasing</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={scripts.counteroffer || "Script will appear here..."} rows={4} readOnly className="font-mono text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>response to pushback</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={scripts.pushback || "Script will appear here..."} rows={4} readOnly className="font-mono text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>closing statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={scripts.closing || "Script will appear here..."} rows={3} readOnly className="font-mono text-sm" />
            </CardContent>
          </Card>
        </div>
      )}
      </ToolLayout>
    </>
  );
};

export default SalaryNegotiationCoach;