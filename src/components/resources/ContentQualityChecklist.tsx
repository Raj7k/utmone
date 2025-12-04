import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

const checklist: ChecklistItem[] = [
  {
    id: "unique_pov",
    label: "Added unique POV or insights",
    description: "Content includes original perspective, not just AI-generated generic information"
  },
  {
    id: "fact_checked",
    label: "Fact-checked all statistics and claims",
    description: "Verified every data point, stat, and claim with reliable sources"
  },
  {
    id: "brand_voice",
    label: "Adjusted tone to match brand voice",
    description: "Content sounds like your brand, not generic AI writing"
  },
  {
    id: "no_ai_phrases",
    label: "Removed generic AI phrases",
    description: "Eliminated phrases like 'delve into', 'unlock potential', 'game-changer', etc."
  },
  {
    id: "human_stories",
    label: "Included human stories or examples",
    description: "Added real-world examples, case studies, or personal anecdotes"
  },
  {
    id: "clear_cta",
    label: "Has clear call-to-action",
    description: "Content includes specific next steps for readers"
  },
  {
    id: "seo_optimized",
    label: "SEO optimized without keyword stuffing",
    description: "Keywords naturally integrated, meta tags complete, proper headings"
  },
  {
    id: "visuals_added",
    label: "Relevant visuals included",
    description: "Images, charts, or graphics support and enhance the content"
  },
  {
    id: "distribution_planned",
    label: "Cross-channel distribution planned",
    description: "Strategy for sharing across relevant channels (social, email, etc.)"
  },
  {
    id: "analytics_ready",
    label: "Analytics tracking configured",
    description: "UTM parameters, conversion tracking, or other analytics set up"
  }
];

const STORAGE_KEY = "utm-one-content-quality-checklist";

export const ContentQualityChecklist = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleItem = (id: string) => {
    const newCompleted = completed.includes(id)
      ? completed.filter(i => i !== id)
      : [...completed, id];
    
    setCompleted(newCompleted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCompleted));
  };

  const progress = (completed.length / checklist.length) * 100;

  const getReadinessLevel = () => {
    if (progress === 100) return { label: "Ready to Publish", colorStyle: { color: 'rgba(22,163,74,1)' } };
    if (progress >= 70) return { label: "Almost There", colorStyle: { color: 'rgba(59,130,246,1)' } };
    if (progress >= 40) return { label: "In Progress", colorStyle: { color: 'rgba(202,138,4,1)' } };
    return { label: "Needs Work", colorStyle: { color: 'rgba(220,38,38,1)' } };
  };

  const readiness = getReadinessLevel();

  return (
    <Card className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Content Readiness Check</h3>
        <p className="text-muted-foreground">
          Review these items before publishing AI-assisted content
        </p>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Completion Progress</span>
          <span className="text-sm font-semibold" style={readiness.colorStyle}>
            {readiness.label}
          </span>
        </div>
        
        <Progress value={progress} className="h-3" />
        
        <div className="text-center">
          <span className="text-4xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>
            {completed.length}/{checklist.length}
          </span>
          <p className="text-sm text-muted-foreground mt-1">Items completed</p>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item, index) => {
          const isCompleted = completed.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-4 rounded-lg border border-border/50 hover:border-white/30 transition-all duration-200 space-y-2"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'text-white'
                        : 'border-muted-foreground/30'
                    }`}
                    style={isCompleted ? { background: 'rgba(59,130,246,1)', borderColor: 'rgba(59,130,246,1)' } : undefined}
                  >
                    {isCompleted && <Check className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 rounded-lg border-2"
          style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' }}
        >
          <p className="text-lg font-semibold" style={{ color: 'rgba(59,130,246,1)' }}>
            🎉 Content is ready to publish!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            All quality checks completed. Your AI-assisted content maintains human authenticity.
          </p>
        </motion.div>
      )}
    </Card>
  );
};