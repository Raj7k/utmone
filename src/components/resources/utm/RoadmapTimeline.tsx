import { useState } from "react";
import { Check, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const phases = [
  {
    phase: "Phase 1: Foundation (Days 1-30)",
    tasks: [
      { id: "f1", day: "Days 1-3", task: "Define UTM naming conventions", description: "Document lowercase, hyphen-separated standards" },
      { id: "f2", day: "Days 4-7", task: "Create UTM templates", description: "Build templates for 10+ campaign types" },
      { id: "f3", day: "Days 8-14", task: "Audit existing UTMs", description: "Identify inconsistencies in current campaigns" },
      { id: "f4", day: "Days 15-21", task: "Set up governance workflow", description: "Define who creates links and approval process" },
      { id: "f5", day: "Days 22-30", task: "Train team on standards", description: "Conduct training sessions for all marketers" }
    ]
  },
  {
    phase: "Phase 2: Optimization (Days 31-60)",
    tasks: [
      { id: "o1", day: "Days 31-37", task: "Implement Schema markup", description: "Add Article, FAQ, HowTo schemas to landing pages" },
      { id: "o2", day: "Days 38-44", task: "Optimize content structure", description: "Improve heading hierarchy and Q&A formatting" },
      { id: "o3", day: "Days 45-51", task: "Build authority signals", description: "Add author bios, citations, E-A-T markers" },
      { id: "o4", day: "Days 52-60", task: "Launch LLM-ready content", description: "Publish optimized campaign pages" }
    ]
  },
  {
    phase: "Phase 3: Scale & Monitor (Days 61-90)",
    tasks: [
      { id: "s1", day: "Days 61-67", task: "Set up AI traffic tracking", description: "Implement referrer tracking for ChatGPT, Claude, etc." },
      { id: "s2", day: "Days 68-74", task: "Create performance dashboard", description: "Build reporting views for UTM + AI traffic" },
      { id: "s3", day: "Days 75-82", task: "Establish review cadence", description: "Weekly UTM audits and monthly governance reviews" },
      { id: "s4", day: "Days 83-90", task: "Document wins & learnings", description: "Share case studies and iterate on process" }
    ]
  }
];

export const RoadmapTimeline = () => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string) => {
    setCompleted(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const calculateProgress = () => {
    const total = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    const done = Object.values(completed).filter(Boolean).length;
    return Math.round((done / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground mb-2">90-Day Implementation Roadmap</h4>
          <p className="text-sm text-muted-foreground">
            Track your progress through UTM + LLM optimization implementation
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{progress}%</p>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="space-y-4">
            <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              {phase.phase}
            </h5>
            <div className="space-y-3 pl-4 border-l-2 border-border/50">
              {phase.tasks.map((task, taskIndex) => {
                const isCompleted = completed[task.id];
                return (
                  <div
                    key={task.id}
                    className={`relative p-4 bg-background rounded-lg border transition-all ${
                      isCompleted
                        ? "border-green-500/30 bg-green-50/30 dark:bg-green-950/10"
                        : "border-border/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={task.id}
                        checked={isCompleted}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Label
                            htmlFor={task.id}
                            className={`text-sm font-medium cursor-pointer ${
                              isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {task.task}
                          </Label>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {task.day}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                      {isCompleted && (
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
