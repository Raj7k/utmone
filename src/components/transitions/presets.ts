/**
 * Animation presets for page transitions
 * All animations respect prefers-reduced-motion
 */

export const transitions = {
  // Simple fade in/out
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Fade + slide up (default for landing pages)
  slideUp: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  
  // Slide from left
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  
  // Slide from right
  slideRight: {
    initial: { opacity: 0, x: -50 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
} as const;

export type TransitionPreset = keyof typeof transitions;

// Spring physics for smooth feel
export const springTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 300,
};

// Faster spring for reduced motion
export const reducedMotionTransition = {
  type: "tween" as const,
  duration: 0.2,
};
