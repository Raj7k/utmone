import { motion } from "framer-motion";

interface GlowingFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: "teal" | "yellow-green" | "mint";
}

export const GlowingFeatureCard = ({ 
  icon, 
  title, 
  description, 
  glowColor
}: GlowingFeatureCardProps) => {
  const glowClasses = {
    teal: "shadow-[0_0_60px_rgba(7,102,83,0.3)] group-hover:shadow-[0_0_80px_rgba(7,102,83,0.5)]",
    "yellow-green": "shadow-[0_0_60px_rgba(227,239,38,0.3)] group-hover:shadow-[0_0_80px_rgba(227,239,38,0.5)]",
    mint: "shadow-[0_0_60px_rgba(226,251,206,0.3)] group-hover:shadow-[0_0_80px_rgba(226,251,206,0.5)]"
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-[#0C342C] rounded-2xl p-12 relative overflow-hidden group"
    >
      {/* Radial glow behind icon */}
      <motion.div 
        className={`absolute top-8 left-8 w-32 h-32 rounded-full blur-3xl ${glowClasses[glowColor]} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <motion.div 
          className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-h3 text-white font-semibold">{title}</h3>
        <p className="text-body text-white/70">{description}</p>
      </div>
    </motion.div>
  );
};
