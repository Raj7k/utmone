import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export const FAQAccordion = ({ items, className }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/40 backdrop-blur-xl"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-lg font-semibold text-white pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-[2000px]" : "max-h-0"
            )}
          >
            <div className="p-6 pt-0 text-white/60">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
