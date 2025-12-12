import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: appleEase }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold hero-gradient mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-muted-foreground">{subheadline}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: appleEase }}
          className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden"
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
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: appleEase }}
              className="grid grid-cols-3 text-center p-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
            >
              <div className="text-sm font-medium text-foreground">{item.feature}</div>
              <div className="text-sm text-muted-foreground">{item.before}</div>
              <div className="text-sm text-foreground font-medium">{item.after}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
