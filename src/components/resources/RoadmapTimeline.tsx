import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, Target, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";
// @ts-ignore - canvas-confetti types

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Month {
  month: number;
  title: string;
  subtitle: string;
  milestones: Milestone[];
  icon: typeof Calendar;
  color: string;
}

const STORAGE_KEY = "roadmap-progress";

export const RoadmapTimeline = () => {
  const [months, setMonths] = useState<Month[]>([
    {
      month: 1,
      title: "Month 1: Foundation",
      subtitle: "Definitions, scoring, routing live",
      icon: Target,
      color: "from-blue-500/10 to-blue-500/5",
      milestones: [
        { id: "m1-1", title: "Define MQL & SQL criteria", description: "1-hour meeting with sales & marketing leaders", completed: false },
        { id: "m1-2", title: "Set up lead scoring model", description: "Configure fit + engagement scoring (35 + 65 points)", completed: false },
        { id: "m1-3", title: "Implement CRM automation", description: "Auto-routing, alerts, and field updates", completed: false },
        { id: "m1-4", title: "Launch weekly sync meeting", description: "Every Tuesday at 10am, 15 minutes", completed: false },
      ]
    },
    {
      month: 2,
      title: "Month 2: Optimization",
      subtitle: "Response time < 1 hour, MQL-to-SQL up 15-20%",
      icon: TrendingUp,
      color: "from-purple-500/10 to-purple-500/5",
      milestones: [
        { id: "m2-1", title: "Hit <1 hour response time", description: "Enable Slack alerts and mobile notifications", completed: false },
        { id: "m2-2", title: "Improve MQL-to-SQL rate by 15%", description: "Refine scoring weights based on feedback", completed: false },
        { id: "m2-3", title: "Document first 5 wins", description: "Track closed deals from aligned process", completed: false },
        { id: "m2-4", title: "Adjust scoring thresholds", description: "Fine-tune based on conversion data", completed: false },
      ]
    },
    {
      month: 3,
      title: "Month 3: Scale",
      subtitle: "Lead volume +20-30%, win rate improving, process is BAU",
      icon: CheckCircle2,
      color: "from-green-500/10 to-green-500/5",
      milestones: [
        { id: "m3-1", title: "Increase lead volume by 25%", description: "Scale campaigns with proven MQL quality", completed: false },
        { id: "m3-2", title: "Improve win rate by 10%+", description: "Better qualified leads = higher close rates", completed: false },
        { id: "m3-3", title: "Process becomes routine", description: "Team follows workflow without prompting", completed: false },
        { id: "m3-4", title: "Celebrate 160% revenue growth", description: "Measure full 90-day impact", completed: false },
      ]
    },
  ]);

  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedMonths = JSON.parse(saved);
        setMonths(savedMonths);
      } catch (e) {
        console.error("Failed to load saved progress", e);
      }
    }
  }, []);

  const toggleMilestone = (monthIndex: number, milestoneId: string) => {
    const newMonths = [...months];
    const milestone = newMonths[monthIndex].milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.completed = !milestone.completed;
      setMonths(newMonths);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMonths));

      if (milestone.completed) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const totalMilestones = months.reduce((acc, m) => acc + m.milestones.length, 0);
  const completedMilestones = months.reduce((acc, m) => acc + m.milestones.filter(ms => ms.completed).length, 0);
  const progressPercentage = (completedMilestones / totalMilestones) * 100;
  const dayProgress = (currentDay / 90) * 100;

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">90-Day Roadmap Timeline</CardTitle>
        <CardDescription>track your progress from setup to scale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Progress Overview */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
              <p className="text-4xl font-bold text-foreground">
                {completedMilestones}<span className="text-xl text-muted-foreground">/{totalMilestones}</span>
              </p>
            </div>
            <Badge variant="default" className="text-base px-4 py-2">
              Day {currentDay} of 90
            </Badge>
          </div>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground">Milestones: {progressPercentage.toFixed(0)}% complete</p>
          </div>
          <div className="space-y-2">
            <Progress value={dayProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">Timeline: {dayProgress.toFixed(0)}% complete</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {months.map((month, monthIndex) => {
            const Icon = month.icon;
            const monthCompleted = month.milestones.every(m => m.completed);
            const monthProgress = (month.milestones.filter(m => m.completed).length / month.milestones.length) * 100;

            return (
              <motion.div
                key={month.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: monthIndex * 0.1 }}
                className="space-y-4"
              >
                <div className={`p-6 rounded-xl bg-gradient-to-br ${month.color} border-2 ${monthCompleted ? "border-green-500/50" : "border-border"}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${monthCompleted ? "bg-green-500/20" : "bg-primary/10"} flex items-center justify-center flex-shrink-0`}>
                      {monthCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Icon className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{month.title}</h3>
                        {monthCompleted && (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            Complete
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{month.subtitle}</p>
                      <Progress value={monthProgress} className="h-2 mb-4" />
                      
                      <div className="space-y-3">
                        {month.milestones.map((milestone) => (
                          <motion.div
                            key={milestone.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <Checkbox
                              checked={milestone.completed}
                              onCheckedChange={() => toggleMilestone(monthIndex, milestone.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {milestone.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{milestone.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {completedMilestones === totalMilestones && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/50 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations! 🎉</h3>
              <p className="text-muted-foreground">
                You've completed your 90-day sales & marketing alignment roadmap. Time to measure that 160% revenue growth!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
