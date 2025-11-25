import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";

interface AnalysisResult {
  score: number;
  headingHierarchy: { valid: boolean; message: string };
  chunkSize: { valid: boolean; message: string; avgWords: number };
  semanticHTML: { valid: boolean; message: string };
  fixes: string[];
}

export const ContentStructureAnalyzer = () => {
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyzeContent = async () => {
    setAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate analysis
    const hasH1 = content.toLowerCase().includes("# ") || content.toLowerCase().includes("<h1");
    const hasH2 = content.toLowerCase().includes("## ") || content.toLowerCase().includes("<h2");
    const wordCount = content.split(/\s+/).length;
    const paragraphs = content.split("\n\n").length;
    const avgWordsPerSection = Math.round(wordCount / Math.max(paragraphs, 1));
    
    const analysisResults: AnalysisResult = {
      score: hasH1 && hasH2 && avgWordsPerSection >= 150 ? 85 : 60,
      headingHierarchy: {
        valid: hasH1 && hasH2,
        message: hasH1 && hasH2 
          ? "Clear H1 and H2 structure detected" 
          : "Missing proper heading hierarchy"
      },
      chunkSize: {
        valid: avgWordsPerSection >= 150 && avgWordsPerSection <= 500,
        message: avgWordsPerSection >= 150 && avgWordsPerSection <= 500
          ? "Optimal chunk size for LLM retrieval"
          : avgWordsPerSection < 150
            ? "Sections too short - aim for 250-500 words per section"
            : "Sections too long - break into smaller chunks",
        avgWords: avgWordsPerSection
      },
      semanticHTML: {
        valid: content.includes("<article") || content.includes("<section"),
        message: content.includes("<article") || content.includes("<section")
          ? "Semantic HTML detected"
          : "Add <article> and <section> tags for better structure"
      },
      fixes: []
    };
    
    if (!hasH1) analysisResults.fixes.push("Add a single H1 tag as the main page title");
    if (!hasH2) analysisResults.fixes.push("Use H2 tags to break content into logical sections");
    if (avgWordsPerSection < 150) analysisResults.fixes.push("Expand sections to 250-500 words for optimal LLM chunking");
    if (avgWordsPerSection > 500) analysisResults.fixes.push("Break long sections into smaller subsections with H3 tags");
    if (!content.includes("<article") && !content.includes("<section")) {
      analysisResults.fixes.push("Wrap content in <article> tag and use <section> for major blocks");
    }
    
    setResults(analysisResults);
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Content Structure Analyzer
        </h3>
        <p className="text-sm text-muted-foreground">
          Analyze your content structure for optimal LLM retrieval and chunking
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Paste Your Content (HTML or Markdown)
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <Button 
          onClick={analyzeContent}
          disabled={!content || analyzing}
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          {analyzing ? "Analyzing..." : "Analyze Structure"}
        </Button>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-foreground">Structure Score</span>
              <span className={`text-3xl font-bold ${getScoreColor(results.score)}`}>
                {results.score}/100
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                {results.headingHierarchy.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Heading Hierarchy</p>
                  <p className="text-xs text-muted-foreground">{results.headingHierarchy.message}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                {results.chunkSize.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Chunk Size (avg {results.chunkSize.avgWords} words/section)
                  </p>
                  <p className="text-xs text-muted-foreground">{results.chunkSize.message}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                {results.semanticHTML.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Semantic HTML</p>
                  <p className="text-xs text-muted-foreground">{results.semanticHTML.message}</p>
                </div>
              </div>
            </div>

            {results.fixes.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Recommended Fixes</p>
                <ul className="space-y-1">
                  {results.fixes.map((fix, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-500 flex-shrink-0">•</span>
                      <span>{fix}</span>
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
