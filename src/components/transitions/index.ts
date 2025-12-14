export { PageTransition } from "./PageTransition";
export { AnimatedRoutes } from "./AnimatedRoutes";

// Simplified transitions - CSS-based instead of framer-motion
export const transitions = {
  fade: "page-enter",
  slideUp: "page-enter",
  slideLeft: "page-enter",
  slideRight: "page-enter",
};

export type TransitionPreset = keyof typeof transitions;

// Keep for backward compatibility but these are now no-ops
export const springTransition = { duration: 0.2 };
export const reducedMotionTransition = { duration: 0.15 };
