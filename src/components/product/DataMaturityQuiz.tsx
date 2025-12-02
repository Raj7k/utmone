import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Zap, TrendingUp, Award } from "lucide-react";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";

const questions = [
  {
    id: 1,
    question: "how do you access campaign click data today?",
    options: [
      { text: "manual csv exports", score: 1 },
      { text: "scheduled email reports", score: 2 },
      { text: "direct sql queries", score: 3 },
      { text: "real-time data warehouse", score: 4 }
    ]
  },
  {
    id: 2,
    question: "how fresh is your analytics data?",
    options: [
      { text: "days old", score: 1 },
      { text: "24 hours", score: 2 },
      { text: "hourly updates", score: 3 },
      { text: "sub-second streaming", score: 4 }
    ]
  },
  {
    id: 3,
    question: "can your data team build custom models?",
    options: [
      { text: "no, stuck with dashboard views", score: 1 },
      { text: "limited api access", score: 2 },
      { text: "yes, via api", score: 3 },
      { text: "yes, full warehouse access", score: 4 }
    ]
  },
  {
    id: 4,
    question: "how often do fields go missing in exports?",
    options: [
      { text: "frequently", score: 1 },
      { text: "sometimes", score: 2 },
      { text: "rarely", score: 3 },
      { text: "never, guaranteed schema", score: 4 }
    ]
  }
];

export const DataMaturityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  const maxScore = questions.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getScoreMessage = () => {
    if (percentage >= 75) {
      return {
        title: "data infrastructure pro",
        subtitle: "your team is ready for ml/ai models",
        color: "text-primary"
      };
    } else if (percentage >= 50) {
      return {
        title: "solid foundation",
        subtitle: "close to real-time insights",
        color: "text-primary"
      };
    } else if (percentage >= 25) {
      return {
        title: "getting started",
        subtitle: "ready to modernize your stack",
        color: "text-yellow-600"
      };
    } else {
      return {
        title: "early stage",
        subtitle: "major gains waiting with data pipeline",
        color: "text-destructive"
      };
    }
  };

  const handleShare = () => {
    const { title } = getScoreMessage();
    const message = `I scored ${percentage}% on the Data Maturity Quiz - ${title}! How data-mature is your marketing stack? Take the quiz: https://utm.one/products/data-pipeline`;
    shareOnLinkedIn(message);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const { title, subtitle, color } = getScoreMessage();
    
    return (
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-3xl mx-auto px-6">
          <Card className="p-12 text-center space-y-8">
            <Award className={`w-20 h-20 mx-auto ${color}`} />
            
            <div>
              <h3 className={`text-4xl font-display font-bold ${color} brand-lowercase mb-2`}>
                {title}
              </h3>
              <p className="text-xl text-muted-foreground">{subtitle}</p>
            </div>

            <div className="bg-primary/10 rounded-xl p-8">
              <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
              <div className="text-sm text-muted-foreground">data maturity score</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="marketing" onClick={handleShare}>
                share on linkedin
              </Button>
              <Button variant="outline" onClick={handleRetake}>
                retake quiz
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground brand-lowercase mb-4">
            how data-mature is your stack?
          </h2>
          <p className="text-lg text-muted-foreground">
            4 questions to assess your data infrastructure readiness
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-sm text-muted-foreground text-center mt-2">
            question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 space-y-6">
              <h3 className="text-2xl font-display font-semibold text-foreground brand-lowercase">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => handleAnswer(option.score)}
                  >
                    <span className="text-base">{option.text}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
