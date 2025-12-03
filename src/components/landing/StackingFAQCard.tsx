import { motion, useTransform, MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQQuestion {
  q: string;
  a: string;
}

interface FAQCard {
  title: string;
  bgColor: string;
  questions?: FAQQuestion[];
  isCTA?: boolean;
}

interface StackingFAQCardProps {
  card: FAQCard;
  index: number;
  totalCards: number;
  scrollProgress: MotionValue<number>;
}

export const StackingFAQCard = ({ card, index, totalCards, scrollProgress }: StackingFAQCardProps) => {
  // Calculate when this card should be active (each card gets 1/totalCards of scroll)
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  
  // Scale: starts at 0.85 for stacked cards, becomes 1.0 when active
  const scale = useTransform(
    scrollProgress,
    [Math.max(0, cardStart - 0.1), cardStart, cardEnd],
    [0.85 + (index * 0.03), 1, 1]
  );
  
  // Opacity: fades in as it becomes active
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, cardStart - 0.05), cardStart],
    [0.4, 1]
  );
  
  // Y position: cards stack with offset
  const y = useTransform(
    scrollProgress,
    [0, cardStart, cardEnd],
    [index * 40, 0, -40]
  );

  if (card.isCTA) {
    return (
      <motion.div
        style={{
          scale,
          opacity,
          y,
          zIndex: totalCards - index,
        }}
        className={`absolute inset-0 ${card.bgColor} rounded-3xl shadow-2xl border border-border overflow-hidden`}
      >
        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-display font-extrabold text-label lowercase">
            ready to get started?
          </h2>
          <p className="text-xl text-secondary-label max-w-2xl">
            Join teams building cleaner, safer, smarter links.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="marketing" className="text-lg px-8 py-6">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-tertiary-label">
            Free plan includes 100 links • 10K clicks/month • No credit card required
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        zIndex: totalCards - index,
      }}
      className={`absolute inset-0 ${card.bgColor} rounded-3xl shadow-2xl border border-border overflow-hidden`}
    >
      <div className="h-full overflow-y-auto p-8 md:p-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-label mb-8 lowercase">
          {card.title}
        </h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {card.questions?.map((faq, faqIndex) => (
            <AccordionItem 
              key={faqIndex} 
              value={`item-${index}-${faqIndex}`}
              className="rounded-xl px-6"
              style={{ background: 'rgba(24,24,27,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-label hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-secondary-label pb-5 pt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};
