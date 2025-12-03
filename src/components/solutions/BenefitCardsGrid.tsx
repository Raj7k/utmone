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
            className="group bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all hover:bg-zinc-900/60"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-white/10 text-white shrink-0 group-hover:bg-white/20 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white lowercase mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
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
