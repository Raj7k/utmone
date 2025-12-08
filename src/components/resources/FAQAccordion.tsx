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
          className="border border-border rounded-xl overflow-hidden obsidian-glass"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/10 transition-colors"
          >
            <span className="text-lg font-semibold text-foreground pr-4 font-sans">
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
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
            <div className="p-6 pt-0 text-muted-foreground font-sans">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
