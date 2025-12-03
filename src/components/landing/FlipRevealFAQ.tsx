import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatText } from "@/utils/textFormatter";

interface FlipRevealFAQProps {
  question: string;
  answer: string;
  visualExample: React.ReactNode;
  index: number;
}

export const FlipRevealFAQ = ({ question, answer, visualExample, index }: FlipRevealFAQProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex gap-6">
      {/* Blaze Orange Bullet + Vertical Line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-blazeOrange" />
        <div className="w-0.5 flex-1 bg-blazeOrange/40 mt-2" />
      </div>

      {/* Flippable Card */}
      <motion.div
        className="pb-4 flex-1 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="relative preserve-3d transition-transform duration-700" style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)"
        }}>
          {/* Front: Question + Answer */}
          <div className="backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <h3 className="text-xl font-display font-semibold mb-3 lowercase text-foreground">
              {formatText(question)}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>{answer}</p>
            <p className="text-sm text-primary mt-3 lowercase">tap to see example →</p>
          </div>

          {/* Back: Visual Example */}
          <div 
            className="absolute inset-0 backface-hidden bg-secondary-grouped-background border border-separator rounded-xl p-6"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)"
            }}
          >
            {visualExample}
            <p className="text-sm text-primary mt-4 lowercase">tap to go back ←</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
