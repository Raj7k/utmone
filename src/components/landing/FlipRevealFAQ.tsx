import { useState, useRef, useEffect } from "react";
import { formatText } from "@/utils/textFormatter";

interface FlipRevealFAQProps {
  question: string;
  answer: string;
  visualExample: React.ReactNode;
  index: number;
}

export const FlipRevealFAQ = ({ question, answer, visualExample, index }: FlipRevealFAQProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex gap-6">
      {/* Platinum Bullet + Vertical Line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-foreground" />
        <div className="w-0.5 flex-1 bg-foreground/40 mt-2" />
      </div>

      {/* Flippable Card */}
      <div
        ref={ref}
        className={`pb-4 flex-1 cursor-pointer transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ 
          perspective: "1000px",
          transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className="relative transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)"
          }}
        >
          {/* Front: Question + Answer */}
          <div style={{ backfaceVisibility: "hidden" }}>
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
              {formatText(question)}
            </h3>
            <p className="text-white-50">{answer}</p>
            <p className="text-sm mt-3 text-foreground">tap to see example →</p>
          </div>

          {/* Back: Visual Example */}
          <div 
            className="absolute inset-0 bg-secondary-grouped-background border border-separator rounded-xl p-6"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)"
            }}
          >
            {visualExample}
            <p className="text-sm mt-4 text-foreground">tap to go back ←</p>
          </div>
        </div>
      </div>
    </div>
  );
};
