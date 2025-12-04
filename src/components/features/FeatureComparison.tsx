import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonItem {
  feature: string;
  competitors: boolean;
  utmOne: boolean;
}

interface FeatureComparisonProps {
  title: string;
  items: ComparisonItem[];
}

export const FeatureComparison = ({ title, items }: FeatureComparisonProps) => {
  return (
    <div className="w-full">
      <h3 className="font-display text-title-2 font-semibold mb-8 text-center text-white">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 font-display text-subheadline font-medium text-white/40">
                Feature
              </th>
              <th className="text-center py-4 px-6 font-display text-subheadline font-medium text-white/40">
                Competitors
              </th>
              <th className="text-center py-4 px-6 font-display text-subheadline font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                utm.one
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 px-6 text-body-apple text-white">{item.feature}</td>
                <td className="py-4 px-6 text-center">
                  {item.competitors ? (
                    <Check className="w-5 h-5 text-white/30 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-white/10 mx-auto" />
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {item.utmOne ? (
                    <Check className="w-5 h-5 mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }} />
                  ) : (
                    <X className="w-5 h-5 text-white/10 mx-auto" />
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};