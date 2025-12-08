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

const colorStyles = {
  blazeOrange: {
    bg: 'hsl(243 70% 24% / 0.15)',
    text: 'hsl(243 70% 50% / 0.9)',
    border: 'hsl(243 70% 24%)',
    glow: 'hsl(243 70% 24% / 0.2)',
  },
  deepSea: {
    bg: 'hsl(217 91% 50% / 0.15)',
    text: 'hsl(217 91% 60% / 0.9)',
    border: 'hsl(217 91% 50%)',
    glow: 'hsl(217 91% 50% / 0.2)',
  },
  primary: {
    bg: 'hsl(243 70% 24% / 0.15)',
    text: 'hsl(243 70% 50% / 0.9)',
    border: 'hsl(243 70% 24%)',
    glow: 'hsl(243 70% 24% / 0.2)',
  },
};

export const FeatureMappedCard = ({ icon: Icon, title, description, color, delay = 0, href }: FeatureMappedCardProps) => {
  const styles = colorStyles[color];

  const content = (
    <>
      <div 
        className="inline-flex p-3 rounded-xl mb-4"
        style={{ background: styles.bg }}
      >
        <Icon className="w-6 h-6" style={{ color: styles.text }} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-display font-semibold text-white mb-2 lowercase flex items-center gap-2">
        {formatText(title)}
        {href && (
          <ArrowRight 
            className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" 
            style={{ color: styles.text }}
          />
        )}
      </h3>
      <p className="text-base text-white/60">{description}</p>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {href ? (
        <Link 
          to={href} 
          className="group relative p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-xl block cursor-pointer border border-white/10"
          style={{
            borderLeft: `4px solid ${styles.border}`,
          }}
        >
          {content}
        </Link>
      ) : (
        <div 
          className="group relative p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-xl border border-white/10"
          style={{
            borderLeft: `4px solid ${styles.border}`,
          }}
        >
          {content}
        </div>
      )}
    </motion.div>
  );
};
