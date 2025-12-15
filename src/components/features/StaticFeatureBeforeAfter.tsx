import { Check, X } from "lucide-react";
import { useElementReveal } from "@/hooks/useScrollReveal";

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

export const StaticFeatureBeforeAfter = ({
  headline,
  subheadline,
  items,
}: FeatureBeforeAfterProps) => {
  const headerRef = useElementReveal();

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        <div
          ref={headerRef}
          className="text-center mb-12 opacity-0 translate-y-8 data-[revealed]:opacity-100 data-[revealed]:translate-y-0 transition-all duration-700 ease-out"
          data-reveal
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold hero-gradient mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-muted-foreground">{subheadline}</p>
          )}
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden opacity-0 translate-y-5 animate-slide-up-fade" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
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
              className="grid grid-cols-3 text-center p-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors opacity-0 animate-slide-left-fade"
              style={{ animationDelay: `${(index + 1) * 80}ms`, animationFillMode: 'forwards' }}
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

// Re-export with original name for drop-in replacement
export { StaticFeatureBeforeAfter as FeatureBeforeAfter };
