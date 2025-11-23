import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const OrganicShapes = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.25, 0.15]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.15, 0.1]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.1, 0.2]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left yellow curve */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-accent-yellow via-accent-orange to-transparent rounded-full blur-3xl"
        style={{ opacity: opacity1 }}
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
        className="absolute -top-1/3 -right-1/4 w-[900px] h-[900px] bg-gradient-to-bl from-accent-orange via-accent-teal to-transparent rounded-full blur-3xl"
        style={{ opacity: opacity2 }}
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
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent-teal via-accent-mint to-transparent rounded-full blur-3xl"
        style={{ opacity: opacity3 }}
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
