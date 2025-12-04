import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        style={{ y: y1, background: 'linear-gradient(to bottom right, rgba(59,130,246,0.05), transparent)' }}
        className="absolute top-0 left-0 w-full h-[300%] opacity-30"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[20%] right-0 w-[80%] h-[250%] bg-gradient-to-bl from-blazeOrange/5 to-transparent opacity-25"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[40%] left-0 w-[70%] h-[200%] bg-gradient-to-tr from-deepSea/5 to-transparent opacity-20"
      />
    </div>
  );
};
