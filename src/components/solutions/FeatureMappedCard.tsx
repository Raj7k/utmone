import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { formatText } from "@/utils/textFormatter";

interface FeatureMappedCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blazeOrange" | "deepSea" | "primary";
  delay?: number;
}

const colorClasses = {
  blazeOrange: {
    bg: "bg-blazeOrange/10",
    text: "text-blazeOrange",
    border: "border-l-blazeOrange",
    glow: "group-hover:shadow-blazeOrange/20",
  },
  deepSea: {
    bg: "bg-deepSea/10",
    text: "text-deepSea",
    border: "border-l-deepSea",
    glow: "group-hover:shadow-deepSea/20",
  },
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-l-primary",
    glow: "group-hover:shadow-primary/20",
  },
};

export const FeatureMappedCard = ({ icon: Icon, title, description, color, delay = 0 }: FeatureMappedCardProps) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={`group relative p-8 rounded-2xl bg-white border-l-4 ${colors.border} hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-xl ${colors.glow}`}
    >
      <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
        <Icon className={`w-6 h-6 ${colors.text}`} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-display font-semibold mb-2 lowercase">{formatText(title)}</h3>
      <p className="text-base text-muted-foreground">{description}</p>
    </motion.div>
  );
};
