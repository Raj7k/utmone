import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Task {
  id: string;
  phase: "foundation" | "integration" | "optimization";
  day: string;
  title: string;
  description: string;
  timeEstimate: string;
}

const tasks: Task[] = [
  // Foundation (Days 1-30)
  { id: "f1", phase: "foundation", day: "1-3", title: "Audit Current State", description: "Document all existing tracking and data sources", timeEstimate: "4 hours" },
  { id: "f2", phase: "foundation", day: "4-7", title: "Define Attribution Model", description: "Choose model based on your stage and goals", timeEstimate: "2 hours" },
  { id: "f3", phase: "foundation", day: "8-12", title: "Set Up UTM Standards", description: "Create naming conventions and templates", timeEstimate: "6 hours" },
  { id: "f4", phase: "foundation", day: "13-17", title: "Configure CRM Fields", description: "Create custom properties for attribution data", timeEstimate: "8 hours" },
  { id: "f5", phase: "foundation", day: "18-22", title: "Implement Tracking", description: "Deploy UTM tracking across all channels", timeEstimate: "12 hours" },
  { id: "f6", phase: "foundation", day: "23-27", title: "Build Initial Reports", description: "Create attribution dashboards", timeEstimate: "6 hours" },
  { id: "f7", phase: "foundation", day: "28-30", title: "Team Training", description: "Train team on new attribution system", timeEstimate: "4 hours" },
  
  // Integration (Days 31-60)
  { id: "i1", phase: "integration", day: "31-35", title: "Connect Marketing Tools", description: "Integrate ad platforms and marketing automation", timeEstimate: "8 hours" },
  { id: "i2", phase: "integration", day: "36-40", title: "Set Up Workflows", description: "Automate attribution data capture", timeEstimate: "10 hours" },
  { id: "i3", phase: "integration", day: "41-45", title: "Validate Data Accuracy", description: "Test and verify attribution data", timeEstimate: "6 hours" },
  { id: "i4", phase: "integration", day: "46-50", title: "Build Advanced Reports", description: "Create multi-touch attribution reports", timeEstimate: "8 hours" },
  { id: "i5", phase: "integration", day: "51-55", title: "Implement Self-Reported", description: "Add 'How did you hear about us?' forms", timeEstimate: "4 hours" },
  { id: "i6", phase: "integration", day: "56-58", title: "Create Alert System", description: "Set up alerts for data quality issues", timeEstimate: "3 hours" },
  { id: "i7", phase: "integration", day: "59-60", title: "First Monthly Review", description: "Analyze first month of attribution data", timeEstimate: "2 hours" },
  
  // Optimization (Days 61-90)
  { id: "o1", phase: "optimization", day: "61-65", title: "Refine Attribution Model", description: "Adjust weights based on actual data", timeEstimate: "6 hours" },
  { id: "o2", phase: "optimization", day: "66-70", title: "Channel Optimization", description: "Reallocate budget based on attribution", timeEstimate: "4 hours" },
  { id: "o3", phase: "optimization", day: "71-75", title: "Build ROI Models", description: "Create channel-specific ROI calculations", timeEstimate: "8 hours" },
  { id: "o4", phase: "optimization", day: "76-80", title: "Implement Testing", description: "Set up A/B tests with attribution tracking", timeEstimate: "6 hours" },
  { id: "o5", phase: "optimization", day: "81-85", title: "Create Executive Dashboards", description: "Build C-level attribution reports", timeEstimate: "5 hours" },
  { id: "o6", phase: "optimization", day: "86-88", title: "Document Learnings", description: "Create attribution playbook for team", timeEstimate: "3 hours" },
  { id: "o7", phase: "optimization", day: "89-90", title: "90-Day Review", description: "Present results and plan next quarter", timeEstimate: "2 hours" }
];

const phaseConfig = {
  foundation: { label: "Foundation", color: "bg-blue-500" },
  integration: { label: "Integration", color: "bg-purple-500" },
  optimization: { label: "Optimization", color: "bg-green-500" }
};

export const NinetyDayTimeline = () => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("attribution-90day-progress");
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedTasks(data.completed || []);
      setCurrentDay(data.day || 1);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("attribution-90day-progress", JSON.stringify({
      completed: completedTasks,
      day: currentDay
    }));

    // Check if all tasks completed
    if (completedTasks.length === tasks.length && completedTasks.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [completedTasks, currentDay]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getPhaseProgress = (phase: Task["phase"]) => {
    const phaseTasks = tasks.filter(t => t.phase === phase);
    const completed = phaseTasks.filter(t => completedTasks.includes(t.id)).length;
    return Math.round((completed / phaseTasks.length) * 100);
  };

  const foundationProgress = getPhaseProgress("foundation");
  const integrationProgress = getPhaseProgress("integration");
  const optimizationProgress = getPhaseProgress("optimization");

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-card rounded-2xl p-6 border-2 border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              90-Day Implementation Progress
            </h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Day <input
              type="number"
              value={currentDay}
              onChange={(e) => setCurrentDay(Math.min(90, Math.max(1, Number(e.target.value))))}
              className="w-16 text-center bg-muted rounded px-2 py-1 mx-1"
              min={1}
              max={90}
            /> of 90
          </div>
        </div>

        <div className="space-y-3">
          {(["foundation", "integration", "optimization"] as const).map((phase) => {
            const config = phaseConfig[phase];
            const progress = phase === "foundation" ? foundationProgress : 
                           phase === "integration" ? integrationProgress : 
                           optimizationProgress;
            
            return (
              <div key={phase}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                  <span className="text-sm font-semibold text-foreground">{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn("h-full", config.color)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-lg font-semibold text-foreground">
            {Math.round((completedTasks.length / tasks.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-6">
        {(["foundation", "integration", "optimization"] as const).map((phase) => {
          const phaseTasks = tasks.filter(t => t.phase === phase);
          const config = phaseConfig[phase];

          return (
            <div key={phase} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", config.color)} />
                <h4 className="text-xl font-display font-semibold text-foreground">
                  {config.label}
                </h4>
              </div>

              <div className="space-y-3">
                {phaseTasks.map((task) => {
                  const isCompleted = completedTasks.includes(task.id);

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className={cn(
                        "bg-card rounded-xl p-4 border-2 transition-all cursor-pointer",
                        isCompleted ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-border"
                      )}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                            isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}
                        >
                          {isCompleted && <Check className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h5 className="font-semibold text-foreground">
                              {task.title}
                            </h5>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Days {task.day}
                              </span>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {task.timeEstimate}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={() => {
          setCompletedTasks([]);
          setCurrentDay(1);
        }}
        className="w-full"
      >
        Reset Progress
      </Button>
    </div>
  );
};
