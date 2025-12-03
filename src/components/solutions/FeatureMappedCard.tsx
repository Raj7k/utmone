import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { formatText } from "@/utils/textFormatter";
import { Link } from "react-router-dom";

interface FeatureMappedCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blazeOrange" | "deepSea" | "primary";
  delay?: number;
  href?: string;
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

export const FeatureMappedCard = ({ icon: Icon, title, description, color, delay = 0, href }: FeatureMappedCardProps) => {
  const colors = colorClasses[color];

  const content = (
    <>
      <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
        <Icon className={`w-6 h-6 ${colors.text}`} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-display font-semibold text-white mb-2 lowercase flex items-center gap-2">
        {formatText(title)}
        {href && (
          <ArrowRight className={`w-5 h-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1`} />
        )}
      </h3>
      <p className="text-base text-white/60">{description}</p>
    </>
  );

  const className = `group relative p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 border-l-4 ${colors.border} hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-xl ${colors.glow} block`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {href ? (
        <Link to={href} className={`${className} cursor-pointer`}>
          {content}
        </Link>
      ) : (
        <div className={className}>
          {content}
        </div>
      )}
    </motion.div>
  );
};
