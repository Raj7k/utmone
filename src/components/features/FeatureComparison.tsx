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
      <h3 className="font-display text-2xl font-semibold mb-8 text-center">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 font-display text-sm font-medium text-muted-foreground">
                Feature
              </th>
              <th className="text-center py-4 px-6 font-display text-sm font-medium text-muted-foreground">
                Competitors
              </th>
              <th className="text-center py-4 px-6 font-display text-sm font-medium text-primary">
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
                className="border-b border-border/50 hover:bg-muted/10 transition-colors"
              >
                <td className="py-4 px-6 text-sm text-foreground">{item.feature}</td>
                <td className="py-4 px-6 text-center">
                  {item.competitors ? (
                    <Check className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/20 mx-auto" />
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {item.utmOne ? (
                    <Check className="w-5 h-5 text-primary mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/20 mx-auto" />
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
