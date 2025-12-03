import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "gradient" | "subtle" | "dots";
}

export const SectionDivider = ({ variant = "gradient" }: SectionDividerProps) => {
  if (variant === "dots") {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/30"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="h-px bg-border" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};
