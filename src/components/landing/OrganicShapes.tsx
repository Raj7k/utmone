import { motion } from "framer-motion";

export const OrganicShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left yellow curve */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-accent-yellow/20 via-accent-orange/15 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Top-right orange curve */}
      <motion.div
        className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] bg-gradient-to-bl from-accent-orange/25 via-accent-teal/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Bottom-left teal accent */}
      <motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent-teal/15 via-accent-mint/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
