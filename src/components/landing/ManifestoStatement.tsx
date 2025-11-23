import { motion } from "framer-motion";
import { TypewriterText } from "./TypewriterText";

interface ManifestoStatementProps {
  lines: string[];
  highlightLast?: boolean;
  gradient?: boolean;
  className?: string;
}

export const ManifestoStatement = ({ 
  lines, 
  highlightLast = true, 
  gradient = true,
  className = "" 
}: ManifestoStatementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`space-y-4 md:space-y-6 ${className}`}
    >
      {lines.map((line, index) => {
        const isLast = index === lines.length - 1;
        const shouldHighlight = highlightLast && isLast;

        return (
          <div
            key={index}
            className={`text-3xl md:text-5xl lg:text-6xl font-display font-bold text-center ${
              shouldHighlight && gradient ? "hero-gradient" : "text-foreground"
            }`}
          >
            <TypewriterText delay={index * 0.2}>
              {line}
            </TypewriterText>
          </div>
        );
      })}
    </motion.div>
  );
};
