import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export const PlaybookHero = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-16"
    >
      <Badge variant="outline" className="mb-4">
        Case Study
      </Badge>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
        The HR Katalyst Referral Playbook
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
        How we went from <span className="text-foreground font-semibold">10K</span> to{" "}
        <span className="text-foreground font-semibold">25K</span> registrations in 5 seasons
      </p>

      {/* Key metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-foreground text-lg">982</span>
          <span>Referrers</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-foreground text-lg">6,903</span>
          <span>Conversions</span>
        </div>
        <div className="h-6 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-foreground text-lg">28%</span>
          <span>Conversion Rate</span>
        </div>
        <div className="h-6 w-px bg-border hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-foreground text-lg">96.6%</span>
          <span>Data Integrity</span>
        </div>
      </motion.div>
    </motion.section>
  );
};
