import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AgendaSection {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

export const WeeklySyncTimer = () => {
  const [sections] = useState<AgendaSection[]>([
    { id: "wins", title: "Celebrate Wins", duration: 60, completed: false },
    { id: "metrics", title: "Check 7 Metrics", duration: 180, completed: false },
    { id: "problem", title: "Diagnose One Problem", duration: 300, completed: false },
    { id: "actions", title: "Decide Action Items", duration: 300, completed: false },
    { id: "confirm", title: "Confirm Next Tuesday", duration: 60, completed: false },
  ]);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(sections[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = sections.reduce((acc, s) => acc + s.duration, 0);
  const elapsedTime = sections.slice(0, currentSectionIndex).reduce((acc, s) => acc + s.duration, 0) + (sections[currentSectionIndex].duration - timeLeft);
  const progressPercentage = (elapsedTime / totalDuration) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSectionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, currentSectionIndex]);

  const handleSectionComplete = () => {
    setCompletedSections(prev => new Set([...prev, sections[currentSectionIndex].id]));
    
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setTimeLeft(sections[currentSectionIndex + 1].duration);
    } else {
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSectionIndex(0);
    setTimeLeft(sections[0].duration);
    setCompletedSections(new Set());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isComplete = completedSections.size === sections.length;

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Weekly 15-Minute Sync</CardTitle>
            <CardDescription>every tuesday at 10am — stay aligned in just 15 minutes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="p-8 rounded-xl border text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-7xl font-bold text-foreground mb-2">{formatTime(timeLeft)}</p>
          </motion.div>
          <p className="text-lg text-muted-foreground mb-4">
            {sections[currentSectionIndex].title}
          </p>
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="flex items-center justify-center gap-3">
            <Button onClick={toggleTimer} variant="default" size="lg">
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {completedSections.size === 0 ? "Start" : "Resume"}
                </>
              )}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Agenda Sections */}
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isCurrent = index === currentSectionIndex;
            const isCompleted = completedSections.has(section.id);
            const isPending = index > currentSectionIndex;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCurrent ? "border-primary bg-primary/5" :
                  isCompleted ? "border-green-500/50 bg-green-500/5" :
                  "border-border bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? "bg-green-500/20" :
                    isCurrent ? "bg-primary/20" :
                    "bg-muted"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className={`text-sm font-bold ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {section.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(section.duration)} allocated
                    </p>
                  </div>
                  {isCurrent && (
                    <Badge variant="default">Current</Badge>
                  )}
                  {isCompleted && (
                    <Badge variant="outline" className="border-green-500/50 text-green-600">
                      Complete
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/50 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-2">Meeting Complete! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Great sync! See you next Tuesday at 10am.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 rounded-xl bg-muted/20 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Pro tip:</strong> Keep this meeting to 15 minutes, not 60. Speed creates momentum. Use the timer to stay on track.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};