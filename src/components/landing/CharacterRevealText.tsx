import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface CharacterRevealTextProps {
  text: string;
  className?: string;
}

export const CharacterRevealText = ({ text, className = "" }: CharacterRevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const characters = text.split("");

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap justify-center">
        {characters.map((char, index) => {
          const start = index / characters.length;
          const end = Math.min((index + 10) / characters.length, 1);
          
          return (
            <Character
              key={index}
              char={char}
              scrollYProgress={scrollYProgress}
              start={start}
              end={end}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CharacterProps {
  char: string;
  scrollYProgress: any;
  start: number;
  end: number;
}

const Character = ({ char, scrollYProgress, start, end }: CharacterProps) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
  const blur = useTransform(scrollYProgress, [start, end], [4, 0]);

  return (
    <motion.span
      style={{ 
        opacity,
        filter: blur.get() > 0 ? `blur(${blur.get()}px)` : "none"
      }}
      className={char === " " ? "w-3 md:w-4" : ""}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};
