import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Sparkles } from "lucide-react";

interface KeywordAnalysis {
  primaryKeyword: string;
  density: number;
  lsiKeywords: string[];
  entities: string[];
  suggestions: string[];
  warnings: string[];
}

export const SemanticKeywordOptimizer = () => {
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<KeywordAnalysis | null>(null);

  const analyzeKeywords = async () => {
    setAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    // Simulate keyword analysis
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (content.toLowerCase().match(new RegExp(primaryKeyword.toLowerCase(), 'g')) || []).length;
    const density = Math.round((keywordCount / wordCount) * 100 * 10) / 10;
    
    const suggestions: string[] = [];
    const warnings: string[] = [];
    
    if (density < 0.5) {
      warnings.push(`Keyword density too low (${density}%) - aim for 1-2%`);
      suggestions.push(`Mention "${primaryKeyword}" 3-5 more times naturally`);
    } else if (density > 3) {
      warnings.push(`Keyword density too high (${density}%) - risk of keyword stuffing`);
      suggestions.push(`Reduce direct keyword usage, use semantic variants instead`);
    } else {
      suggestions.push(`Keyword density (${density}%) is optimal`);
    }
    
    // Generate LSI keywords based on primary keyword
    const lsiSuggestions = primaryKeyword.toLowerCase().includes("utm") 
      ? ["campaign tracking", "url parameters", "analytics tagging", "link tracking", "source attribution"]
      : primaryKeyword.toLowerCase().includes("link")
      ? ["url shortening", "branded links", "redirect management", "link analytics", "qr codes"]
      : ["related concept", "semantic variant", "contextual term", "industry terminology", "associated phrase"];
    
    suggestions.push("Use these LSI keywords to strengthen topical relevance");
    suggestions.push("Mention key entities (tools, companies, standards) related to your topic");
    
    setResults({
      primaryKeyword,
      density,
      lsiKeywords: lsiSuggestions,
      entities: ["Google Analytics", "GA4", "Urchin", "Google Tag Manager"],
      suggestions,
      warnings
    });
    setAnalyzing(false);
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Semantic Keyword Optimizer
        </h3>
        <p className="text-sm text-muted-foreground">
          Optimize keyword usage with semantic variants and entity mentions for LLM understanding
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Primary Keyword
          </label>
          <Input
            value={primaryKeyword}
            onChange={(e) => setPrimaryKeyword(e.target.value)}
            placeholder="e.g., 'utm parameters'"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Content to Analyze
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here..."
            className="min-h-[150px] text-sm"
          />
        </div>

        <Button 
          onClick={analyzeKeywords}
          disabled={!primaryKeyword || !content || analyzing}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {analyzing ? "Analyzing..." : "Analyze Semantic Keywords"}
        </Button>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Keyword Density</span>
                <Badge variant={results.density >= 1 && results.density <= 2 ? "default" : "outline"}>
                  {results.density}%
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    results.density >= 1 && results.density <= 2 
                      ? 'bg-green-500' 
                      : results.density > 3 
                      ? 'bg-red-500' 
                      : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(results.density * 20, 100)}%` }}
                />
              </div>
            </div>

            {results.warnings.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Warnings</p>
                    <ul className="space-y-1">
                      {results.warnings.map((warning, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm font-medium text-foreground mb-3">LSI Keywords (Semantic Variants)</p>
              <div className="flex flex-wrap gap-2">
                {results.lsiKeywords.map((keyword, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Use these phrases naturally throughout your content to strengthen topical relevance
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm font-medium text-foreground mb-3">Related Entities to Mention</p>
              <div className="flex flex-wrap gap-2">
                {results.entities.map((entity, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {entity}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Mentioning these entities helps LLMs understand your content's context and authority
              </p>
            </div>

            {results.suggestions.length > 0 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Optimization Tips</p>
                    <ul className="space-y-1">
                      {results.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
