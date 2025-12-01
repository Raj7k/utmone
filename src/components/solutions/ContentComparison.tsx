import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentComparisonProps {
  beforeTitle: string;
  afterTitle: string;
  beforeContent: ReactNode;
  afterContent: ReactNode;
  caption: string;
}

export const ContentComparison = ({
  beforeTitle,
  afterTitle,
  beforeContent,
  afterContent,
  caption
}: ContentComparisonProps) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Before Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide z-10">
            {beforeTitle}
          </div>
          <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-6 pt-16">
            {beforeContent}
          </div>
        </motion.div>

        {/* After Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide z-10">
            {afterTitle}
          </div>
          <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-6 pt-16">
            {afterContent}
          </div>
        </motion.div>
      </div>

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xl md:text-2xl text-center text-muted-foreground lowercase tracking-wide"
      >
        {caption}
      </motion.p>
    </div>
  );
};
