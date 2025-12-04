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
            className="group rounded-xl p-6 transition-all"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="p-3 rounded-lg shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Icon className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
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
