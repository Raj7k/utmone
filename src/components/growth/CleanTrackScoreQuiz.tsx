import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GrowthLoopBadge } from "@/components/landing/GrowthLoopBadge";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";
import { CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    id: "utm_consistency",
    question: "how consistent are your utm parameters across campaigns?",
    options: [
      { text: "always lowercase, always complete", score: 20 },
      { text: "mostly consistent, some variation", score: 12 },
      { text: "mixed case, sometimes incomplete", score: 6 },
      { text: "no rules, everyone does their own thing", score: 0 }
    ]
  },
  {
    id: "naming_convention",
    question: "do you have a team-wide utm naming convention?",
    options: [
      { text: "yes, documented and enforced", score: 20 },
      { text: "yes, but not always followed", score: 12 },
      { text: "informal, no documentation", score: 6 },
      { text: "no convention exists", score: 0 }
    ]
  },
  {
    id: "broken_reports",
    question: "how often do your analytics reports break because of bad UTMs?",
    options: [
      { text: "never", score: 20 },
      { text: "occasionally", score: 12 },
      { text: "frequently", score: 6 },
      { text: "constantly", score: 0 }
    ]
  },
  {
    id: "manual_cleanup",
    question: "how much time do you spend manually cleaning utm data?",
    options: [
      { text: "0 hours — it's clean by default", score: 20 },
      { text: "1-2 hours per week", score: 12 },
      { text: "3-5 hours per week", score: 6 },
      { text: "6+ hours per week", score: 0 }
    ]
  },
  {
    id: "attribution_confidence",
    question: "how confident are you in your campaign attribution?",
    options: [
      { text: "100% confident — data is reliable", score: 20 },
      { text: "mostly confident, some gaps", score: 12 },
      { text: "not very confident, lots of unknowns", score: 6 },
      { text: "no confidence — attribution is a mess", score: 0 }
    ]
  }
];

export const CleanTrackScoreQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: score };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  
  const getScoreMessage = (score: number) => {
    if (score >= 90) return { title: "Clean-Track Champion", subtitle: "Your data quality is world-class", color: "text-system-green" };
    if (score >= 70) return { title: "Clean-Track Pro", subtitle: "You're on the right path", color: "text-foreground" };
    if (score >= 50) return { title: "Clean-Track Learner", subtitle: "Room for improvement", color: "text-system-orange" };
    return { title: "Clean-Track Beginner", subtitle: "Let's fix your data together", color: "text-system-red" };
  };

  const handleShare = () => {
    const message = `I scored ${totalScore}/100 on the utm.one Clean-Track Quality Assessment! ${getScoreMessage(totalScore).title}. Take the quiz: https://utm.one/growth/quiz`;
    shareOnLinkedIn(message);
  };

  if (showResult) {
    const scoreMessage = getScoreMessage(totalScore);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <GrowthLoopBadge
          score={totalScore}
          title={scoreMessage.title}
          subtitle={scoreMessage.subtitle}
          onShare={handleShare}
        />
        
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="lowercase"
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResult(false);
            }}
          >
            retake quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2 lowercase">
          <span>question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Card className="p-8 glass-card">
          <h3 className="text-2xl font-display font-bold text-foreground mb-8 lowercase">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 px-6 transition-all lowercase"
                onClick={() => handleAnswer(option.score)}
              >
                <span className="text-base">{option.text}</span>
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Previously Answered */}
      {currentQuestion > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground lowercase">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>{currentQuestion} {currentQuestion === 1 ? 'answer' : 'answers'} recorded</span>
        </div>
      )}
    </div>
  );
};
