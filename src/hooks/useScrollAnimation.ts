import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollAnimationOptions {
  offset?: ["start end" | "center center" | "end start", "start end" | "center center" | "end start"];
  opacity?: [number, number] | [number, number, number];
  y?: [number, number] | [number, number, number];
  x?: [number, number] | [number, number, number];
  scale?: [number, number] | [number, number, number];
  rotate?: [number, number] | [number, number, number];
}

interface ScrollAnimationReturn {
  ref: React.RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  opacity?: MotionValue<number>;
  y?: MotionValue<number>;
  x?: MotionValue<number>;
  scale?: MotionValue<number>;
  rotate?: MotionValue<number>;
  style: {
    opacity?: MotionValue<number>;
    y?: MotionValue<number>;
    x?: MotionValue<number>;
    scale?: MotionValue<number>;
    rotate?: MotionValue<number>;
  };
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}): ScrollAnimationReturn => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options.offset || ["start end", "center center"]
  });

  const inputRange = options.opacity?.length === 3 ? [0, 0.5, 1] : [0, 1];

  const opacity = options.opacity 
    ? useTransform(scrollYProgress, inputRange, options.opacity)
    : undefined;

  const y = options.y 
    ? useTransform(scrollYProgress, inputRange, options.y)
    : undefined;

  const x = options.x 
    ? useTransform(scrollYProgress, inputRange, options.x)
    : undefined;

  const scale = options.scale 
    ? useTransform(scrollYProgress, inputRange, options.scale)
    : undefined;

  const rotate = options.rotate 
    ? useTransform(scrollYProgress, inputRange, options.rotate)
    : undefined;

  return {
    ref,
    scrollYProgress,
    opacity,
    y,
    x,
    scale,
    rotate,
    style: {
      opacity,
      y,
      x,
      scale,
      rotate,
    }
  };
};

// Parallax hook for background elements
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return { ref, y };
};

// Depth reveal hook
export const useDepthReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return { ref, scale, opacity, y };
};
