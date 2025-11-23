import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { AlertCircle, Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const LinkedInRealityCheck = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "missing job description",
        description: "please paste a LinkedIn job posting",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        realityScore: 45,
        extractedInfo: {
          role: "Senior Marketing Manager",
          yearsRequired: "10+",
          skillsCount: 12,
          salaryListed: false
        },
        redFlags: [
          "Requires 10+ years experience but title suggests mid-level role",
          "12 required skills for a single position (unrealistic)",
          "No salary range listed (red flag in transparency)",
          "Requests 'unicorn' skill combination rarely found in market"
        ],
        recommendation: "This posting has unrealistic requirements. Consider applying if you have 60% of listed skills."
      });
      setIsAnalyzing(false);
      toast({
        title: "analysis complete",
        description: "job posting reality check finished"
      });
    }, 2000);
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "LinkedIn Reality Check",
          "applicationCategory": "BusinessApplication",
          "description": "Analyze job postings for red flags and reasonableness with AI-powered reality scoring",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "operatingSystem": "Web Browser",
          "author": { "@type": "Organization", "name": "utm.one" }
        })}
      </script>
      <ToolLayout
      title="LinkedIn Reality Check"
      description="analyze job postings for realistic requirements and fair compensation"
      icon={AlertCircle}
      relatedTools={[
        { title: "Job Offer Analyzer", href: "/resources/tools/job-offer-analyzer", icon: TrendingUp },
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator }
      ]}
    >
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Browser extension coming soon. For now, paste job descriptions below for manual analysis.
        </AlertDescription>
      </Alert>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="lowercase">paste job description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDesc">LinkedIn Job Posting</Label>
            <Textarea
              id="jobDesc"
              placeholder="Paste the full job description here..."
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Job Posting
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="lowercase">reality check score</CardTitle>
                <div className="text-right">
                  <div className="text-4xl font-display font-bold text-destructive">
                    {analysis.realityScore}/100
                  </div>
                  <Badge variant="destructive">UNREALISTIC</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{analysis.extractedInfo.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Years Required:</span>
                  <span className="font-medium">{analysis.extractedInfo.yearsRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required Skills:</span>
                  <span className="font-medium">{analysis.extractedInfo.skillsCount} skills</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary Listed:</span>
                  <span className="font-medium">{analysis.extractedInfo.salaryListed ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="lowercase">🚩 red flags detected</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.redFlags.map((flag: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Badge variant="destructive" className="shrink-0 mt-0.5">!</Badge>
                    <span className="text-muted-foreground">{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="lowercase">recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.recommendation}</p>
            </CardContent>
          </Card>
        </div>
      )}
      </ToolLayout>
    </>
  );
};

export default LinkedInRealityCheck;