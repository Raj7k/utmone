import { motion } from "framer-motion";
import { Trophy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrowthLoopBadgeProps {
  score: number;
  title: string;
  subtitle: string;
  onShare?: () => void;
}

export const GrowthLoopBadge = ({ score, title, subtitle, onShare }: GrowthLoopBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative glass-card p-8 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent)] pointer-events-none rounded-2xl" />
      
      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <div className="text-5xl font-display font-bold text-foreground">
            {score}/100
          </div>
          <h3 className="text-2xl font-display font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            download badge
          </Button>
          <Button 
            size="sm"
            onClick={onShare}
          >
            share on linkedin
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
