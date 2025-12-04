import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Info, ShoppingCart, Navigation, GitCompare } from "lucide-react";

interface IntentAnalysis {
  query: string;
  primaryIntent: "informational" | "transactional" | "navigational" | "comparative";
  confidence: number;
  contentGaps: string[];
  suggestions: string[];
}

export const QueryIntentMatcher = () => {
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<IntentAnalysis | null>(null);

  const analyzeQuery = async () => {
    setAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate intent detection
    let primaryIntent: IntentAnalysis["primaryIntent"] = "informational";
    let confidence = 75;
    let contentGaps: string[] = [];
    let suggestions: string[] = [];
    
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("buy") || lowerQuery.includes("price") || lowerQuery.includes("signup")) {
      primaryIntent = "transactional";
      confidence = 90;
      contentGaps = ["Missing clear CTA above fold", "No pricing comparison", "Unclear value proposition"];
      suggestions = [
        "Add 'Get Started' CTA in first 100 words",
        "Include pricing table or 'Request Demo' form",
        "Highlight ROI and immediate benefits"
      ];
    } else if (lowerQuery.includes("vs") || lowerQuery.includes("compare") || lowerQuery.includes("difference")) {
      primaryIntent = "comparative";
      confidence = 95;
      contentGaps = ["Missing comparison table", "No feature-by-feature breakdown", "Unclear winner/recommendation"];
      suggestions = [
        "Create side-by-side comparison table",
        "Add 'Which is better for X?' section",
        "Include pros/cons for each option",
        "State clear recommendation at the end"
      ];
    } else if (lowerQuery.includes("login") || lowerQuery.includes("dashboard") || lowerQuery.includes("account")) {
      primaryIntent = "navigational";
      confidence = 85;
      contentGaps = ["Missing clear navigation links", "No quick access menu"];
      suggestions = [
        "Add prominent 'Login' link in header",
        "Create navigation shortcuts section",
        "Include breadcrumb trail"
      ];
    } else {
      primaryIntent = "informational";
      confidence = 80;
      contentGaps = ["Definition not in first paragraph", "Missing examples", "No step-by-step explanation"];
      suggestions = [
        "Lead with clear definition in first sentence",
        "Add 'What is X?' section at top",
        "Include 3-5 real-world examples",
        "Create FAQ section answering common sub-questions"
      ];
    }
    
    setResults({
      query,
      primaryIntent,
      confidence,
      contentGaps,
      suggestions
    });
    setAnalyzing(false);
  };

  const intentConfig = {
    informational: {
      icon: Info,
      color: "bg-blue-500",
      label: "Informational",
      description: "User wants to learn or understand something"
    },
    transactional: {
      icon: ShoppingCart,
      color: "bg-green-500",
      label: "Transactional",
      description: "User wants to buy, sign up, or take action"
    },
    navigational: {
      icon: Navigation,
      color: "bg-purple-500",
      label: "Navigational",
      description: "User wants to find a specific page or resource"
    },
    comparative: {
      icon: GitCompare,
      color: "bg-orange-500",
      label: "Comparative",
      description: "User wants to compare options (X vs Y)"
    }
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Query Intent Matcher
        </h3>
        <p className="text-sm text-muted-foreground">
          Analyze if your content matches the search intent behind target queries
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Target Query
          </label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'what are utm parameters' or 'bitly vs rebrandly'"
            onKeyDown={(e) => e.key === "Enter" && analyzeQuery()}
          />
        </div>

        <Button 
          onClick={analyzeQuery}
          disabled={!query || analyzing}
          className="w-full"
        >
          <Search className="w-4 h-4 mr-2" />
          {analyzing ? "Analyzing Intent..." : "Analyze Query Intent"}
        </Button>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">Primary Intent</span>
                <Badge variant="outline">{results.confidence}% confidence</Badge>
              </div>
              
              {Object.entries(intentConfig).map(([key, config]) => {
                const Icon = config.icon;
                const isActive = key === results.primaryIntent;
                
                return (
                  <div 
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
                      isActive ? 'border' : 'bg-muted/20'
                    }`}
                    style={isActive ? { background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' } : undefined}
                  >
                    <div className={`w-10 h-10 rounded-full ${isActive ? config.color : 'bg-muted'} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                    {isActive && <Badge>Match</Badge>}
                  </div>
                );
              })}
            </div>

            {results.contentGaps.length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Content Gaps Detected</p>
                <ul className="space-y-1">
                  {results.contentGaps.map((gap, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-red-500 flex-shrink-0">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.suggestions.length > 0 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Optimization Suggestions</p>
                <ul className="space-y-1">
                  {results.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
