import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { TrendingUp, Calculator, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalaryComparisonCard } from "@/components/tools/SalaryComparisonCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { salaryBenchmarks, getSalaryForRole, getAdjustedSalary } from "@/lib/salaryData";

const JobOfferAnalyzer = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    baseSalary: "",
    equity: "",
    bonus: "",
    location: "",
    companySize: ""
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!formData.role || !formData.baseSalary) {
      toast({
        title: "missing information",
        description: "please fill in role and base salary",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const salaryData = getSalaryForRole(formData.role);
      const marketMedian = getAdjustedSalary(
        salaryData!.baseCompensation.p50,
        formData.location,
        formData.companySize
      );

      const { data, error } = await supabase.functions.invoke('analyze-job-offer', {
        body: {
          offerDetails: formData,
          marketData: {
            median: marketMedian,
            p75: salaryData!.baseCompensation.p75,
            p90: salaryData!.baseCompensation.p90
          }
        }
      });

      if (error) throw error;
      setAnalysis(data);
      
      toast({
        title: "analysis complete",
        description: "your personalized offer analysis is ready"
      });
    } catch (error: any) {
      toast({
        title: "analysis failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const salaryData = formData.role ? getSalaryForRole(formData.role) : null;
  const marketMedian = salaryData && formData.location && formData.companySize 
    ? getAdjustedSalary(salaryData.baseCompensation.p50, formData.location, formData.companySize)
    : 0;

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Job Offer Analyzer",
          "applicationCategory": "FinanceApplication",
          "description": "Comprehensively evaluate job offers with AI-powered analysis and market benchmark comparison",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "operatingSystem": "Web Browser",
          "author": { "@type": "Organization", "name": "utm.one" }
        })}
      </script>
      <ToolLayout
      title="Job Offer Analyzer"
      description="evaluate job offers against market benchmarks with AI insights"
      icon={TrendingUp}
      relatedTools={[
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator },
        { title: "AI Salary Negotiation Coach", href: "/resources/tools/salary-negotiation-coach", icon: MessageSquare }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="lowercase">offer details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {salaryBenchmarks.map((role) => (
                    <SelectItem key={role.role} value={role.role}>{role.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Base Salary ($)</Label>
              <Input
                type="number"
                placeholder="95000"
                value={formData.baseSalary}
                onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Annual Equity Value ($)</Label>
              <Input
                type="number"
                placeholder="20000"
                value={formData.equity}
                onChange={(e) => setFormData({...formData, equity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Bonus (%)</Label>
              <Input
                type="number"
                placeholder="15"
                value={formData.bonus}
                onChange={(e) => setFormData({...formData, bonus: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Offer
          </Button>
        </CardContent>
      </Card>

      {formData.baseSalary && marketMedian > 0 && (
        <div className="mt-8">
          <SalaryComparisonCard
            title="offer vs market"
            current={parseInt(formData.baseSalary)}
            market={marketMedian}
          />
        </div>
      )}

      {analysis && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="lowercase">ai analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">{analysis.analysis || "Analysis will appear here..."}</p>
            </div>
          </CardContent>
        </Card>
      )}
      </ToolLayout>
    </>
  );
};

export default JobOfferAnalyzer;