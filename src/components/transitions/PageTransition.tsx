import { motion } from "framer-motion";
import { ReactNode } from "react";
import { transitions, springTransition, reducedMotionTransition, TransitionPreset } from "./presets";
import { usePageTransition } from "@/hooks/usePageTransition";

interface PageTransitionProps {
  children: ReactNode;
  preset?: TransitionPreset;
}

/**
 * Wrapper component that provides animated enter/exit transitions for pages
 * Respects prefers-reduced-motion preference
 */
export function PageTransition({ children, preset = "slideUp" }: PageTransitionProps) {
  const { prefersReducedMotion } = usePageTransition();
  
  // Get animation variants based on preset
  const variants = transitions[preset];
  
  // Use fade-only for reduced motion preference
  const motionVariants = prefersReducedMotion 
    ? transitions.fade 
    : variants;
  
  // Use faster transition for reduced motion
  const transition = prefersReducedMotion 
    ? reducedMotionTransition 
    : springTransition;

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={motionVariants}
      transition={transition}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
