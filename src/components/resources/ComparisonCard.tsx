import { Check, X } from "lucide-react";

interface ComparisonCardProps {
  goodExample: {
    title: string;
    items: string[];
    explanation?: string;
  };
  badExample: {
    title: string;
    items: string[];
    explanation?: string;
  };
}

export const ComparisonCard = ({ goodExample, badExample }: ComparisonCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Good Example */}
      <div className="p-6 bg-green-50/50 dark:bg-green-950/20 border-2 border-green-500/20 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-foreground">{goodExample.title}</h4>
        </div>
        
        <ul className="space-y-2 mb-4">
          {goodExample.items.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        {goodExample.explanation && (
          <p className="text-sm text-muted-foreground italic">
            {goodExample.explanation}
          </p>
        )}
      </div>

      {/* Bad Example */}
      <div className="p-6 bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500/20 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h4 className="font-semibold text-foreground">{badExample.title}</h4>
        </div>
        
        <ul className="space-y-2 mb-4">
          {badExample.items.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <X className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        {badExample.explanation && (
          <p className="text-sm text-muted-foreground italic">
            {badExample.explanation}
          </p>
        )}
      </div>
    </div>
  );
};