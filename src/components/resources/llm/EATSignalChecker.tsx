import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Award, Users, TrendingUp } from "lucide-react";

interface EATScores {
  expertise: number;
  authority: number;
  trustworthiness: number;
  overall: number;
  signals: {
    category: string;
    found: string[];
    missing: string[];
  }[];
}

export const EATSignalChecker = () => {
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<EATScores | null>(null);

  const analyzeEAT = async () => {
    setAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate E-A-T analysis
    const lowerContent = content.toLowerCase();
    
    const expertiseFound: string[] = [];
    const expertiseMissing: string[] = [];
    if (lowerContent.includes("author") || lowerContent.includes("written by")) expertiseFound.push("Author byline present");
    else expertiseMissing.push("Add author byline with credentials");
    if (lowerContent.includes("years") || lowerContent.includes("experience")) expertiseFound.push("Experience mentioned");
    else expertiseMissing.push("Mention author experience/expertise");
    if (lowerContent.includes("data") || lowerContent.includes("study")) expertiseFound.push("Data/research cited");
    else expertiseMissing.push("Include data or research citations");
    
    const authorityFound: string[] = [];
    const authorityMissing: string[] = [];
    if (lowerContent.includes("published") || lowerContent.includes("featured")) authorityFound.push("Publication mentions");
    else authorityMissing.push("Reference prior publications");
    if (lowerContent.includes("company") || lowerContent.includes("organization")) authorityFound.push("Organization affiliation");
    else authorityMissing.push("Add organization/company affiliation");
    if (lowerContent.includes("award") || lowerContent.includes("recognized")) authorityFound.push("Recognition/awards mentioned");
    else authorityMissing.push("Highlight relevant awards or recognition");
    
    const trustFound: string[] = [];
    const trustMissing: string[] = [];
    if (lowerContent.includes("source") || lowerContent.includes("reference")) trustFound.push("External sources cited");
    else trustMissing.push("Cite authoritative external sources");
    if (lowerContent.includes("methodology") || lowerContent.includes("approach")) trustFound.push("Methodology disclosed");
    else trustMissing.push("Explain methodology/approach");
    if (lowerContent.includes("updated") || lowerContent.includes("reviewed")) trustFound.push("Content freshness indicated");
    else trustMissing.push("Add 'Last updated' date");
    
    const expertiseScore = (expertiseFound.length / 3) * 100;
    const authorityScore = (authorityFound.length / 3) * 100;
    const trustScore = (trustFound.length / 3) * 100;
    const overallScore = Math.round((expertiseScore + authorityScore + trustScore) / 3);
    
    setResults({
      expertise: Math.round(expertiseScore),
      authority: Math.round(authorityScore),
      trustworthiness: Math.round(trustScore),
      overall: overallScore,
      signals: [
        {
          category: "Expertise",
          found: expertiseFound,
          missing: expertiseMissing
        },
        {
          category: "Authority",
          found: authorityFound,
          missing: authorityMissing
        },
        {
          category: "Trustworthiness",
          found: trustFound,
          missing: trustMissing
        }
      ]
    });
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const categoryIcons = {
    Expertise: Award,
    Authority: TrendingUp,
    Trustworthiness: Users
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          E-A-T Signal Checker
        </h3>
        <p className="text-sm text-muted-foreground">
          Scan content for Expertise, Authority, and Trustworthiness signals that LLMs use for ranking
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Paste Your Content
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article or landing page content here..."
            className="min-h-[150px] text-sm"
          />
        </div>

        <Button 
          onClick={analyzeEAT}
          disabled={!content || analyzing}
          className="w-full"
        >
          {analyzing ? "Analyzing E-A-T Signals..." : "Check E-A-T Signals"}
        </Button>

        {results && (
          <div className="mt-6 space-y-6">
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">Overall E-A-T Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(results.overall)}`}>
                  {results.overall}/100
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Expertise</span>
                    <span className={`text-sm font-medium ${getScoreColor(results.expertise)}`}>
                      {results.expertise}%
                    </span>
                  </div>
                  <Progress value={results.expertise} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Authority</span>
                    <span className={`text-sm font-medium ${getScoreColor(results.authority)}`}>
                      {results.authority}%
                    </span>
                  </div>
                  <Progress value={results.authority} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Trustworthiness</span>
                    <span className={`text-sm font-medium ${getScoreColor(results.trustworthiness)}`}>
                      {results.trustworthiness}%
                    </span>
                  </div>
                  <Progress value={results.trustworthiness} className="h-2" />
                </div>
              </div>
            </div>

            {results.signals.map((signal, index) => {
              const Icon = categoryIcons[signal.category as keyof typeof categoryIcons];
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <Icon className="w-4 h-4" style={{ color: 'rgba(59,130,246,1)' }} />
                    </div>
                    <h4 className="font-semibold text-foreground">{signal.category}</h4>
                  </div>
                  
                  {signal.found.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-green-600 mb-1">✓ Found</p>
                      <ul className="space-y-0.5">
                        {signal.found.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground ml-4">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {signal.missing.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-600 mb-1">✗ Missing</p>
                      <ul className="space-y-0.5">
                        {signal.missing.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground ml-4">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
