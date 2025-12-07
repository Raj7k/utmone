import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIAnalyzingOverlayProps {
  isAnalyzing: boolean;
  label?: string;
}

export function AIAnalyzingOverlay({ isAnalyzing, label = "analyzing..." }: AIAnalyzingOverlayProps) {
  if (!isAnalyzing) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
        <span>{label}</span>
      </div>
    </motion.div>
  );
}
