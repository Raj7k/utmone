import { useState } from "react";
import { AlertTriangle, Check, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Pitfall {
  warning: string;
  description: string;
  solution: string;
  impact: "high" | "medium" | "low";
}

const pitfalls: Pitfall[] = [
  {
    warning: "Content Mills 2.0",
    description: "Publishing dozens of AI-generated articles daily. This dilutes brand quality and risks search engine penalties for thin content.",
    solution: "Focus on valuable content over volume. Publish fewer, higher-quality pieces that showcase expertise and unique perspective.",
    impact: "high"
  },
  {
    warning: "Unedited AI Text",
    description: "Publishing AI output without human review. Results in factual errors, off-tone phrasing, and potentially problematic language.",
    solution: "Always have human editors review for accuracy, tone, and brand safety. Treat AI as first draft, not final copy.",
    impact: "high"
  },
  {
    warning: "Skipping Fact-Checks",
    description: "AI confidently outputs false information. One incorrect stat can destroy credibility with discerning audiences.",
    solution: "Verify every data point and claim with reliable sources. Develop a systematic fact-checking process.",
    impact: "high"
  },
  {
    warning: "Generic AI Voice",
    description: "Content sounds formulaic and robotic with overused phrases like 'delve into', 'unlock potential', 'game-changer'.",
    solution: "Customize outputs to match brand voice. Add human flair, break grammar rules occasionally, use humor/slang when appropriate.",
    impact: "medium"
  },
  {
    warning: "Tool Overload",
    description: "Trying every new AI tool leads to workflow chaos and subscription fatigue without clear ROI improvement.",
    solution: "Build a solid core toolkit. Evaluate new tools carefully in small pilots before full adoption. Focus on effectiveness, not novelty.",
    impact: "medium"
  },
  {
    warning: "Ignoring Human Touch",
    description: "Removing human creativity from the process. Content lacks personal stories, unique insights, and authentic voice.",
    solution: "Use AI for heavy lifting, but inject human stories, expert insights, and brand personality. Make work only your company could make.",
    impact: "high"
  },
  {
    warning: "Static Playbook",
    description: "Never updating your AI strategy as capabilities evolve. Competitors improve while you stay stagnant.",
    solution: "Review processes quarterly. Experiment with new features. Stay informed about AI capabilities and adjust workflows accordingly.",
    impact: "low"
  }
];

const impactColors = {
  high: "border-red-500/50 bg-red-50 dark:bg-red-950/20",
  medium: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20",
  low: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/20"
};

export const PitfallWarningCards = () => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleCard = (index: number) => {
    setFlippedCards(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {pitfalls.map((pitfall, index) => {
        const isFlipped = flippedCards.includes(index);

        return (
          <motion.div
            key={index}
            className="perspective-1000"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className="relative h-64 cursor-pointer"
              onClick={() => toggleCard(index)}
            >
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Card
                      className={`h-full p-6 border-2 ${impactColors[pitfall.impact]} flex flex-col items-center justify-center text-center space-y-4 hover:shadow-lg transition-shadow`}
                    >
                      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{pitfall.warning}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pitfall.description}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        Click to see the solution
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Card className="h-full p-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-500/50 flex flex-col items-center justify-center text-center space-y-4 hover:shadow-lg transition-shadow">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                          The Fix
                        </h3>
                        <p className="text-sm text-foreground/90">
                          {pitfall.solution}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        Click to see the warning
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};