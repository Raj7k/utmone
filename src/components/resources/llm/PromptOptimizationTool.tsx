import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface GeneratedPrompts {
  topic: string;
  informational: string[];
  comparative: string[];
  toolSeeking: string[];
  howTo: string[];
}

export const PromptOptimizationTool = () => {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [prompts, setPrompts] = useState<GeneratedPrompts | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const generatePrompts = async () => {
    setGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const topicLower = topic.toLowerCase();
    
    setPrompts({
      topic,
      informational: [
        `What are ${topic}?`,
        `Explain ${topic} in simple terms`,
        `${topic} definition and examples`,
        `Why do I need ${topic}?`
      ],
      comparative: [
        `${topic} vs alternatives - which is better?`,
        `Compare ${topic} to traditional methods`,
        `Pros and cons of ${topic}`,
        `${topic} versus other tracking methods`
      ],
      toolSeeking: [
        `Show me a ${topic} calculator`,
        `Best ${topic} generator tool`,
        `Free ${topic} builder online`,
        `${topic} validation tool`
      ],
      howTo: [
        `How do I implement ${topic}?`,
        `Step-by-step guide to ${topic}`,
        `How to set up ${topic} correctly`,
        `${topic} best practices tutorial`
      ]
    });
    
    setGenerating(false);
  };

  const copyPrompt = (prompt: string, index: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Prompt Optimization Tool
        </h3>
        <p className="text-sm text-muted-foreground">
          Generate optimized prompts to test if ChatGPT, Claude, and Perplexity would cite your content
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Your Content Topic
          </label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'UTM parameters' or 'link shortening'"
            onKeyDown={(e) => e.key === "Enter" && generatePrompts()}
          />
        </div>

        <Button 
          onClick={generatePrompts}
          disabled={!topic || generating}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {generating ? "Generating Prompts..." : "Generate Test Prompts"}
        </Button>

        {prompts && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Informational
                </Badge>
                <span className="text-xs text-muted-foreground">
                  User wants to learn or understand
                </span>
              </div>
              <div className="space-y-2">
                {prompts.informational.map((prompt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <span className="text-sm text-foreground">{prompt}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPrompt(prompt, `info-${i}`)}
                    >
                      {copiedIndex === `info-${i}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Comparative
                </Badge>
                <span className="text-xs text-muted-foreground">
                  User wants to compare options
                </span>
              </div>
              <div className="space-y-2">
                {prompts.comparative.map((prompt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <span className="text-sm text-foreground">{prompt}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPrompt(prompt, `comp-${i}`)}
                    >
                      {copiedIndex === `comp-${i}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  Tool-Seeking
                </Badge>
                <span className="text-xs text-muted-foreground">
                  User wants a calculator/tool
                </span>
              </div>
              <div className="space-y-2">
                {prompts.toolSeeking.map((prompt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <span className="text-sm text-foreground">{prompt}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPrompt(prompt, `tool-${i}`)}
                    >
                      {copiedIndex === `tool-${i}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  How-To
                </Badge>
                <span className="text-xs text-muted-foreground">
                  User wants step-by-step guidance
                </span>
              </div>
              <div className="space-y-2">
                {prompts.howTo.map((prompt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <span className="text-sm text-foreground">{prompt}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPrompt(prompt, `howto-${i}`)}
                    >
                      {copiedIndex === `howto-${i}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-foreground mb-2">
                <strong>How to Use:</strong>
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>1. Copy each prompt and test it in ChatGPT, Claude, or Perplexity</li>
                <li>2. Check if your content is cited in the AI's response</li>
                <li>3. If not cited, optimize your content structure and E-A-T signals</li>
                <li>4. Retest after optimization to measure improvement</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
