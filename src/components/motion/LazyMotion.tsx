import { lazy, Suspense, ReactNode } from "react";
import { LazyMotion as FramerLazyMotion, domAnimation, m } from "framer-motion";

// Re-export m for use with LazyMotion (tree-shakeable version of motion)
export { m };

// LazyMotion provider wrapper - uses domAnimation for smaller bundle
export const LazyMotionProvider = ({ children }: { children: ReactNode }) => (
  <FramerLazyMotion features={domAnimation} strict>
    {children}
  </FramerLazyMotion>
);

// Common animation variants for reuse
export const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Default transition settings
export const defaultTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};
