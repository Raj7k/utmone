import { Check, X } from "lucide-react";
import { useIntersectionAnimation } from "@/components/landing/motion";

interface ComparisonItem {
  feature: string;
  before: string;
  after: string;
}

interface FeatureBeforeAfterProps {
  headline: string;
  subheadline?: string;
  items: ComparisonItem[];
}

export const FeatureBeforeAfter = ({
  headline,
  subheadline,
  items,
}: FeatureBeforeAfterProps) => {
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation(0.3);
  const { ref: tableRef, isVisible: tableVisible } = useIntersectionAnimation(0.2);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-600 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold hero-gradient mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-muted-foreground">{subheadline}</p>
          )}
        </div>

        <div
          ref={tableRef}
          className={`bg-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden transition-all duration-600 ${
            tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ 
            transitionDelay: "100ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Header */}
          <div className="grid grid-cols-3 text-center p-4 border-b border-border bg-muted/50">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-sm font-medium text-destructive/80 flex items-center justify-center gap-2">
              <X className="w-4 h-4" /> Before
            </div>
            <div className="text-sm font-medium text-primary flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> After
            </div>
          </div>

          {/* Rows */}
          {items.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 text-center p-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-all duration-500 ${
                tableVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`}
              style={{ 
                transitionDelay: `${(index + 1) * 80}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <div className="text-sm font-medium text-foreground">{item.feature}</div>
              <div className="text-sm text-muted-foreground">{item.before}</div>
              <div className="text-sm text-foreground font-medium">{item.after}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
