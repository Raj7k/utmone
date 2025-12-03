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
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Before Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-destructive/90 text-white px-2 py-1 md:px-3 rounded-md text-[10px] md:text-xs font-semibold uppercase tracking-wide z-10">
            {beforeTitle}
          </div>
          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4 pt-12 md:p-6 md:pt-16">
            {beforeContent}
          </div>
        </motion.div>

        {/* After Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary/90 text-white px-2 py-1 md:px-3 rounded-md text-[10px] md:text-xs font-semibold uppercase tracking-wide z-10">
            {afterTitle}
          </div>
          <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 pt-12 md:p-6 md:pt-16">
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
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-center text-white/60 lowercase tracking-wide px-2"
      >
        {caption}
      </motion.p>
    </div>
  );
};