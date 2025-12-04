import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface WorkflowStep {
  number: number;
  title: string;
  description: string;
  aiTools: string[];
  humanInput: string;
  timeEstimate: string;
  examplePrompt: string;
}

const steps: WorkflowStep[] = [
  {
    number: 1,
    title: "Ideation & Research",
    description: "Use AI to enrich content ideas and gather research. Start with a content goal, then leverage AI for market research, competitor analysis, and data gathering.",
    aiTools: ["ChatGPT", "Perplexity", "BuzzSumo", "Google Gemini"],
    humanInput: "Define content goals, validate research accuracy, identify unique angles",
    timeEstimate: "30-60 min",
    examplePrompt: "Find recent statistics on [topic] with sources. What are the top 5 content pieces ranking for [keyword]?"
  },
  {
    number: 2,
    title: "Outlining & Structuring",
    description: "Create content structure with AI assistance. Build comprehensive outlines that organize research into logical flow with clear sections and hierarchy.",
    aiTools: ["ChatGPT", "Claude", "Jasper"],
    humanInput: "Refine structure, ensure brand alignment, add proprietary insights",
    timeEstimate: "15-30 min",
    examplePrompt: "Create a detailed outline for a [content type] on [topic] targeting [audience]. Include 5 main sections with 3-4 subsections each."
  },
  {
    number: 3,
    title: "Draft Creation",
    description: "Generate initial drafts rapidly using AI. Let AI handle the heavy lifting of first-draft writing while you focus on strategic direction.",
    aiTools: ["ChatGPT", "Jasper", "Claude", "Writesonic"],
    humanInput: "Provide voice guidelines, brand examples, key messaging",
    timeEstimate: "30-90 min",
    examplePrompt: "Write the [section name] section in a [tone] tone. Include [specific data points]. Target length: [word count] words."
  },
  {
    number: 4,
    title: "Editing & Human Enrichment",
    description: "Transform AI drafts into authentic content. Add personal stories, expert insights, and brand voice. This is where human creativity shines.",
    aiTools: ["Grammarly", "LanguageTool"],
    humanInput: "Add unique POV, real examples, emotional hooks, fact-check everything",
    timeEstimate: "60-120 min",
    examplePrompt: "Review this section for clarity and tone. Suggest 3 ways to make it more engaging and less generic."
  },
  {
    number: 5,
    title: "SEO Optimization",
    description: "Optimize content for search visibility using AI-powered analysis. Ensure coverage of key topics without sacrificing readability.",
    aiTools: ["Surfer SEO", "Frase", "MarketMuse"],
    humanInput: "Balance SEO requirements with reader experience, avoid keyword stuffing",
    timeEstimate: "20-45 min",
    examplePrompt: "Analyze this content for [target keyword]. What topics or subtopics am I missing?"
  },
  {
    number: 6,
    title: "Visuals & Media Generation",
    description: "Create compelling visuals to enhance your content. Use AI to generate images, charts, and graphics that support your narrative.",
    aiTools: ["Midjourney", "DALL-E 3", "Canva AI", "Leonardo.ai"],
    humanInput: "Art direction, brand consistency, visual hierarchy",
    timeEstimate: "30-60 min",
    examplePrompt: "Create a hero image for [topic] in [style]. Aspect ratio 16:9. Professional, modern aesthetic."
  },
  {
    number: 7,
    title: "Personalization & Distribution",
    description: "Adapt content for different channels and audiences. Create variations optimized for each platform and segment.",
    aiTools: ["ChatGPT", "Jasper", "Zapier", "Make"],
    humanInput: "Channel strategy, audience segmentation, timing decisions",
    timeEstimate: "30-60 min",
    examplePrompt: "Adapt this blog post into 5 LinkedIn posts, 3 Twitter threads, and 1 email newsletter summary."
  },
  {
    number: 8,
    title: "Monitoring & Optimization",
    description: "Track performance and refine your approach. Use AI to analyze what's working and continuously improve your content strategy.",
    aiTools: ["Google Analytics 4", "Amplitude", "BuzzSumo"],
    humanInput: "Strategic insights, A/B test decisions, content iteration",
    timeEstimate: "Ongoing",
    examplePrompt: "Analyze performance data for [content piece]. What patterns emerge? What should we do differently next time?"
  }
];

const STORAGE_KEY = "utm-one-ai-workflow-progress";

export const WorkflowVisualizer = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  const toggleStep = (stepNumber: number) => {
    const newCompleted = completedSteps.includes(stepNumber)
      ? completedSteps.filter(n => n !== stepNumber)
      : [...completedSteps, stepNumber];
    
    setCompletedSteps(newCompleted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCompleted));
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              {completedSteps.length} of {steps.length} steps completed
            </p>
          </div>
          <div className="text-3xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>
            {Math.round(progress)}%
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isExpanded = expandedStep === step.number;

          return (
            <Card
              key={step.number}
              className={`overflow-hidden transition-all duration-300 ${
                isCompleted ? '' : ''
              }`}
              style={isCompleted ? { borderColor: 'rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.05)' } : undefined}
            >
              {/* Step Header */}
              <div
                className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedStep(isExpanded ? null : step.number)}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(step.number);
                    }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'text-white'
                        : 'border-muted-foreground/30 hover:border-white/30'
                    }`}
                    style={isCompleted ? { background: 'rgba(59,130,246,1)', borderColor: 'rgba(59,130,246,1)' } : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{step.timeEstimate}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 space-y-4 border-t border-border/50 pt-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">AI Tools to Use:</h4>
                        <div className="flex flex-wrap gap-2">
                          {step.aiTools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 text-xs rounded-full"
                              style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Human Input Required:</h4>
                        <p className="text-sm text-muted-foreground">{step.humanInput}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Example Prompt:</h4>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <code className="text-sm text-foreground/90">{step.examplePrompt}</code>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
};