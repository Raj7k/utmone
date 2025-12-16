import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type FAQCategory = "strategy" | "metrics" | "execution" | "trust" | "results";

interface FAQItem {
  question: string;
  answer: ReactNode;
  category?: FAQCategory;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  showCategories?: boolean;
}

const categoryConfig: Record<FAQCategory, { label: string; emoji: string; borderColor: string }> = {
  strategy: { label: "Strategy", emoji: "🎯", borderColor: "border-l-blue-500" },
  metrics: { label: "Metrics", emoji: "📊", borderColor: "border-l-emerald-500" },
  execution: { label: "Execution", emoji: "🔧", borderColor: "border-l-amber-500" },
  trust: { label: "Trust", emoji: "🛡️", borderColor: "border-l-violet-500" },
  results: { label: "Results", emoji: "🏆", borderColor: "border-l-primary" },
};

export const FAQAccordion = ({ items, className, showCategories = false }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const category = item.category ? categoryConfig[item.category] : null;
        
        return (
          <div
            key={index}
            className={cn(
              "border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm",
              "border-l-4",
              category ? category.borderColor : "border-l-primary/50"
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-start gap-3 pr-4 flex-1">
                {showCategories && category && (
                  <Badge variant="secondary" className="shrink-0 text-xs mt-0.5">
                    {category.emoji} {category.label}
                  </Badge>
                )}
                <span className="text-lg font-semibold text-foreground font-sans">
                  {item.question}
                </span>
              </div>
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
              <div className="p-6 pt-0 text-muted-foreground font-sans leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
