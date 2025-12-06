import { motion } from "framer-motion";

export const OrganicShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left platinum curve */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-white/8 via-white/5 to-transparent rounded-full blur-3xl"
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
      
      {/* Top-right silver curve */}
      <motion.div
        className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] bg-gradient-to-bl from-white/10 via-white/5 to-transparent rounded-full blur-3xl"
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

      {/* Bottom-left platinum accent */}
      <motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-white/6 via-white/4 to-transparent rounded-full blur-3xl"
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
