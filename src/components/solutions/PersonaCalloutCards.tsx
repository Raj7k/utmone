import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PersonaCallout {
  icon: LucideIcon;
  title: string;
  benefit: string;
}

interface PersonaCalloutCardsProps {
  callouts: PersonaCallout[];
}

export const PersonaCalloutCards = ({ callouts }: PersonaCalloutCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {callouts.map((callout, index) => {
        const Icon = callout.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="obsidian-glass rounded-xl p-6 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg shrink-0 bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide mb-2 text-foreground/80">
                  {callout.title}
                </h4>
                <p className="text-muted-foreground font-sans">
                  {callout.benefit}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
