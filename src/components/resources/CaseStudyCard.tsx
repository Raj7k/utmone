import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  title: string;
  before: {
    title: string;
    items: string[];
    metrics?: string;
  };
  after: {
    title: string;
    items: string[];
    metrics?: string;
  };
  highlightMetric?: string;
}

export const CaseStudyCard = ({ title, before, after, highlightMetric }: CaseStudyCardProps) => {
  return (
    <div className="my-8 p-8 bg-card rounded-2xl border border-border/50">
      <h3 className="text-2xl font-display font-semibold text-foreground mb-8">
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
        {/* Before State */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100/50 dark:bg-red-950/30 rounded-full">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              {before.title}
            </span>
          </div>
          
          <ul className="space-y-2">
            {before.items.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          {before.metrics && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-semibold text-foreground">{before.metrics}</p>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* After State */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100/50 dark:bg-green-950/30 rounded-full">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {after.title}
            </span>
          </div>
          
          <ul className="space-y-2">
            {after.items.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          {after.metrics && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-semibold text-foreground">{after.metrics}</p>
            </div>
          )}
        </div>
      </div>

      {/* Highlight Metric */}
      {highlightMetric && (
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="text-center">
            <p className="text-3xl font-display font-bold mb-2 text-primary">
              {highlightMetric}
            </p>
            <p className="text-sm text-muted-foreground">
              reduction in reporting errors
            </p>
          </div>
        </div>
      )}
    </div>
  );
};