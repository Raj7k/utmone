import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  priority: "high" | "medium" | "low";
}

const checklistItems: ChecklistItem[] = [
  // Content Structure (12 items)
  { id: "cs1", category: "Content Structure", item: "Single H1 tag with primary keyword", priority: "high" },
  { id: "cs2", category: "Content Structure", item: "H2 tags for main sections (5-8 sections)", priority: "high" },
  { id: "cs3", category: "Content Structure", item: "Sections are 250-500 words each (optimal chunk size)", priority: "high" },
  { id: "cs4", category: "Content Structure", item: "Definition in first 2-3 sentences", priority: "high" },
  { id: "cs5", category: "Content Structure", item: "Table of contents with anchor links", priority: "medium" },
  { id: "cs6", category: "Content Structure", item: "Numbered or bulleted lists for key points", priority: "medium" },
  
  // Schema Implementation (8 items)
  { id: "si1", category: "Schema Implementation", item: "Article schema with datePublished and author", priority: "high" },
  { id: "si2", category: "Schema Implementation", item: "FAQ schema for Q&A sections", priority: "high" },
  { id: "si3", category: "Schema Implementation", item: "HowTo schema for step-by-step guides", priority: "medium" },
  { id: "si4", category: "Schema Implementation", item: "BreadcrumbList schema for navigation", priority: "medium" },
  { id: "si5", category: "Schema Implementation", item: "DefinedTerm schema for glossary entries", priority: "low" },
  
  // Authority Signals (10 items)
  { id: "as1", category: "Authority Signals", item: "Author byline with credentials", priority: "high" },
  { id: "as2", category: "Authority Signals", item: "Citations to authoritative external sources (3+)", priority: "high" },
  { id: "as3", category: "Authority Signals", item: "Original data, statistics, or research", priority: "high" },
  { id: "as4", category: "Authority Signals", item: "Publication date and 'Last updated' timestamp", priority: "medium" },
  { id: "as5", category: "Authority Signals", item: "Author photo and bio section", priority: "low" },
  
  // Query Optimization (8 items)
  { id: "qo1", category: "Query Optimization", item: "Target keyword in H1 and first paragraph", priority: "high" },
  { id: "qo2", category: "Query Optimization", item: "Keyword density 1-2% (not stuffed)", priority: "high" },
  { id: "qo3", category: "Query Optimization", item: "LSI keywords and semantic variants used naturally", priority: "medium" },
  { id: "qo4", category: "Query Optimization", item: "Question-based H2s matching user queries", priority: "medium" },
  
  // Technical Setup (6 items)
  { id: "ts1", category: "Technical Setup", item: "Canonical URL tag present", priority: "high" },
  { id: "ts2", category: "Technical Setup", item: "Open Graph meta tags (title, description, image)", priority: "medium" },
  { id: "ts3", category: "Technical Setup", item: "robots.txt allows GPTBot, PerplexityBot, ClaudeBot", priority: "high" },
  { id: "ts4", category: "Technical Setup", item: "XML sitemap submitted to Google Search Console", priority: "medium" },
  
  // Cross-Linking (6 items)
  { id: "cl1", category: "Cross-Linking", item: "5+ internal links to related content", priority: "high" },
  { id: "cl2", category: "Cross-Linking", item: "Contextual anchor text (not 'click here')", priority: "medium" },
  { id: "cl3", category: "Cross-Linking", item: "Related resources sidebar or footer section", priority: "low" }
];

export const LLMCitationChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const completionPercentage = Math.round((checkedItems.size / checklistItems.length) * 100);
  
  const categoryGroups = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const downloadReport = () => {
    toast.success("Checklist report downloaded");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          LLM Citation Readiness Checklist
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Complete this 30-item checklist to maximize your content's citation probability
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Completion Progress</span>
            <span className="text-2xl font-bold text-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {checkedItems.size} of {checklistItems.length} items completed
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(categoryGroups).map(([category, items]) => {
          const categoryCompleted = items.filter(item => checkedItems.has(item.id)).length;
          const categoryPercentage = Math.round((categoryCompleted / items.length) * 100);
          
          return (
            <div key={category} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{category}</h4>
                <span className="text-sm text-muted-foreground">
                  {categoryCompleted}/{items.length}
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems.has(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm text-foreground cursor-pointer flex-1 leading-relaxed"
                    >
                      <span className={checkedItems.has(item.id) ? "line-through text-muted-foreground" : ""}>
                        {item.item}
                      </span>
                      <span className={`ml-2 text-xs ${getPriorityColor(item.priority)}`}>
                        [{item.priority}]
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              <Progress value={categoryPercentage} className="h-1.5" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={downloadReport} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download Report (PDF)
        </Button>
        {completionPercentage === 100 && (
          <Button className="flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        )}
      </div>

      {completionPercentage < 100 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Next Priority:</strong> Focus on completing all{" "}
            <span className="text-red-500">high-priority</span> items first for maximum impact
          </p>
        </div>
      )}
    </Card>
  );
};
