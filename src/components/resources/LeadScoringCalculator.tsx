import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Calculator, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScoreBreakdown {
  fit: number;
  engagement: number;
  total: number;
}

export const LeadScoringCalculator = () => {
  const { toast } = useToast();
  const [companySize, setCompanySize] = useState(10);
  const [industry, setIndustry] = useState(10);
  const [jobTitle, setJobTitle] = useState(10);
  const [formFills, setFormFills] = useState(20);
  const [webinars, setWebinars] = useState(25);
  const [emailOpens, setEmailOpens] = useState(15);

  const calculateScores = (): ScoreBreakdown => {
    const fit = companySize + industry + jobTitle;
    const engagement = formFills + webinars + emailOpens;
    return { fit, engagement, total: fit + engagement };
  };

  const scores = calculateScores();

  const getScoreBadge = (score: number) => {
    if (score < 30) return { label: "Not Qualified", variant: "destructive" as const, color: "text-red-600" };
    if (score < 50) return { label: "MQL (30+)", variant: "secondary" as const, color: "text-yellow-600" };
    return { label: "High Quality (50+)", variant: "default" as const, color: "text-green-600" };
  };

  const scoreBadge = getScoreBadge(scores.total);

  const handleSave = () => {
    localStorage.setItem("leadScoringModel", JSON.stringify({
      companySize, industry, jobTitle, formFills, webinars, emailOpens
    }));
    toast({ title: "scoring model saved", description: "your scoring settings have been saved locally." });
  };

  const handleReset = () => {
    setCompanySize(10);
    setIndustry(10);
    setJobTitle(10);
    setFormFills(20);
    setWebinars(25);
    setEmailOpens(15);
  };

  const loadExample = (type: "high" | "low") => {
    if (type === "high") {
      setCompanySize(15);
      setIndustry(15);
      setJobTitle(15);
      setFormFills(25);
      setWebinars(30);
      setEmailOpens(20);
    } else {
      setCompanySize(5);
      setIndustry(5);
      setJobTitle(5);
      setFormFills(10);
      setWebinars(10);
      setEmailOpens(10);
    }
  };

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Calculator className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
          </div>
          <div>
            <CardTitle className="text-2xl">Lead Scoring Calculator</CardTitle>
            <CardDescription>calculate your lead's qualification score in real-time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Fit Score Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fit Score (Max 35 points)</h3>
          <motion.span 
            key={scores.fit}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold"
            style={{ color: 'rgba(59,130,246,1)' }}
          >
              {scores.fit}
            </motion.span>
          </div>
          <Progress value={(scores.fit / 35) * 100} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Company Size (0-15)</Label>
              <Input 
                type="number" 
                min="0" 
                max="15" 
                value={companySize}
                onChange={(e) => setCompanySize(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
              />
            </div>
            <div className="space-y-2">
              <Label>Industry Match (0-10)</Label>
              <Input 
                type="number" 
                min="0" 
                max="10" 
                value={industry}
                onChange={(e) => setIndustry(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
              />
            </div>
            <div className="space-y-2">
              <Label>Job Title (0-10)</Label>
              <Input 
                type="number" 
                min="0" 
                max="10" 
                value={jobTitle}
                onChange={(e) => setJobTitle(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
              />
            </div>
          </div>
        </div>

        {/* Engagement Score Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Engagement Score (Max 65 points)</h3>
          <motion.span 
            key={scores.engagement}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold"
            style={{ color: 'rgba(59,130,246,1)' }}
          >
              {scores.engagement}
            </motion.span>
          </div>
          <Progress value={(scores.engagement / 65) * 100} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Form Fills (0-25)</Label>
              <Input 
                type="number" 
                min="0" 
                max="25" 
                value={formFills}
                onChange={(e) => setFormFills(Math.min(25, Math.max(0, parseInt(e.target.value) || 0)))}
              />
            </div>
            <div className="space-y-2">
              <Label>Webinar Attendance (0-30)</Label>
              <Input 
                type="number" 
                min="0" 
                max="30" 
                value={webinars}
                onChange={(e) => setWebinars(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Opens (0-20)</Label>
              <Input 
                type="number" 
                min="0" 
                max="20" 
                value={emailOpens}
                onChange={(e) => setEmailOpens(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
              />
            </div>
          </div>
        </div>

        {/* Total Score Display */}
        <motion.div 
          key={scores.total}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded-xl bg-muted/20 border-2 border-border"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Score</p>
              <p className="text-5xl font-bold text-foreground">{scores.total}<span className="text-2xl text-muted-foreground">/100</span></p>
            </div>
            <Badge variant={scoreBadge.variant} className="text-base px-4 py-2">
              {scoreBadge.label}
            </Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>• MQL Threshold: 30+ points</p>
            <p>• SQL Threshold: 30+ points + Sales rep called them</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} variant="default">
            <Save className="w-4 h-4 mr-2" />
            Save Model
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={() => loadExample("high")} variant="outline">
            Load High-Quality Example
          </Button>
          <Button onClick={() => loadExample("low")} variant="outline">
            Load Low-Quality Example
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
