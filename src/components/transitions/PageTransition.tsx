import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { transitions, springTransition, fastTransition, reducedMotionTransition, TransitionPreset } from "./presets";
import { usePageTransition } from "@/hooks/usePageTransition";

interface PageTransitionProps {
  children: ReactNode;
  preset?: TransitionPreset;
}

// Marketing routes that should use fast transitions
const MARKETING_ROUTES = ['/features', '/solutions', '/resources', '/compare', '/use-cases', '/help', '/products', '/tools', '/legal', '/pricing', '/product', '/about', '/intelligence'];

/**
 * Wrapper component that provides animated enter/exit transitions for pages
 * Respects prefers-reduced-motion preference
 * Uses faster transitions for marketing pages
 */
export function PageTransition({ children, preset = "fade" }: PageTransitionProps) {
  const { prefersReducedMotion } = usePageTransition();
  const location = useLocation();
  
  // Check if this is a marketing page (use fast transitions)
  const isMarketingPage = MARKETING_ROUTES.some(route => location.pathname.startsWith(route));
  
  // Get animation variants - use simple fade for marketing for speed
  const variants = isMarketingPage ? transitions.fade : transitions[preset];
  
  // Use fade-only for reduced motion preference
  const motionVariants = prefersReducedMotion 
    ? transitions.fade 
    : variants;
  
  // Use faster transition for marketing pages and reduced motion
  const transition = prefersReducedMotion || isMarketingPage
    ? fastTransition 
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
