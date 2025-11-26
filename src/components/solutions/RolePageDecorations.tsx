import { motion } from "framer-motion";

export { GradientHeroBackground } from "./GradientHeroBackground";
export { VectorShapes } from "./VectorShapes";

export const HeroFloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blazeOrange/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-deepSea/5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export const DiagonalAccent = ({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <div className={`absolute ${positions[position]} w-32 h-32 opacity-10 pointer-events-none`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
        <line x1="20" y1="0" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-deepSea" />
        <line x1="0" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-blazeOrange" />
      </svg>
    </div>
  );
};

export const SectionDivider = () => {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  );
};

export const DotPattern = () => {
  return (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
    </div>
  );
};

export const HeroGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
    </div>
  );
};
