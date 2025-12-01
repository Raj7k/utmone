import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface BenefitCard {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

interface BenefitCardsGridProps {
  benefits: BenefitCard[];
}

export const BenefitCardsGrid = ({ benefits }: BenefitCardsGridProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-card border-2 border-border hover:border-primary/40 rounded-xl p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground lowercase mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
