import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, AlertCircle } from "lucide-react";

export const LLMReadinessScorer = () => {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyzeUrl = async () => {
    setAnalyzing(true);
    
    // Simulate analysis (in production, this would call an edge function)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results based on best practices
    const mockResults = {
      overallScore: Math.floor(Math.random() * 30) + 65, // 65-95
      categories: [
        {
          name: "Heading Hierarchy",
          score: Math.floor(Math.random() * 30) + 70,
          issues: [
            { passed: true, text: "Single H1 detected" },
            { passed: false, text: "H2 sections need better semantic grouping" },
            { passed: true, text: "Proper H3 subdivisions" }
          ]
        },
        {
          name: "Schema Markup",
          score: Math.floor(Math.random() * 30) + 60,
          issues: [
            { passed: false, text: "Missing Article schema" },
            { passed: false, text: "No FAQ schema detected" },
            { passed: true, text: "Breadcrumb schema present" }
          ]
        },
        {
          name: "Content Structure",
          score: Math.floor(Math.random() * 30) + 75,
          issues: [
            { passed: true, text: "Clear section divisions" },
            { passed: true, text: "Logical content flow" },
            { passed: false, text: "Could benefit from more question-format headings" }
          ]
        },
        {
          name: "Question-Answer Formatting",
          score: Math.floor(Math.random() * 30) + 55,
          issues: [
            { passed: false, text: "Few headings phrased as questions" },
            { passed: true, text: "Some direct answer boxes present" },
            { passed: false, text: "Consider adding FAQ section" }
          ]
        },
        {
          name: "Semantic Keywords",
          score: Math.floor(Math.random() * 30) + 80,
          issues: [
            { passed: true, text: "Good keyword density" },
            { passed: true, text: "Natural language usage" },
            { passed: true, text: "Semantic variations covered" }
          ]
        },
        {
          name: "Readability",
          score: Math.floor(Math.random() * 20) + 75,
          issues: [
            { passed: true, text: "Flesch score: 68 (Plain English)" },
            { passed: true, text: "Average sentence length appropriate" },
            { passed: false, text: "Some paragraphs could be broken up" }
          ]
        }
      ]
    };

    setResults(mockResults);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">LLM Readiness Scorer</h4>
        <p className="text-sm text-muted-foreground">
          Analyze your landing page for AI optimization best practices
        </p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="https://example.com/landing-page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={analyzing}
        />
        <Button
          onClick={analyzeUrl}
          disabled={!url || analyzing}
          className="w-full"
        >
          {analyzing ? "Analyzing..." : "Analyze Page"}
        </Button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center p-6 bg-background rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Overall LLM Readiness</p>
            <div className="flex items-center justify-center gap-3">
              <span
                className={`text-5xl font-bold ${
                  results.overallScore >= 80
                    ? "text-green-500"
                    : results.overallScore >= 60
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {results.overallScore}
              </span>
              <span className="text-2xl text-muted-foreground">/ 100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.overallScore >= 80
                ? "Excellent AI optimization"
                : results.overallScore >= 60
                ? "Good, but needs improvement"
                : "Significant optimization needed"}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            {results.categories.map((category: any, index: number) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-foreground">{category.name}</h5>
                  <span
                    className={`text-sm font-medium ${
                      category.score >= 80
                        ? "text-green-500"
                        : category.score >= 60
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {category.score}/100
                  </span>
                </div>
                <div className="space-y-2">
                  {category.issues.map((issue: any, issueIndex: number) => (
                    <div
                      key={issueIndex}
                      className="flex items-start gap-2 p-2 rounded text-sm"
                    >
                      {issue.passed ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      )}
                      <span className="text-muted-foreground">{issue.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-50/50 border border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Top Recommendations:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Add Article and FAQ Schema markup to improve AI discovery</li>
                  <li>Rephrase 3-5 headings as questions matching user queries</li>
                  <li>Create dedicated FAQ section with structured Q&A pairs</li>
                  <li>Improve heading hierarchy with clearer H2/H3 groupings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
