import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  preset?: string;
}

/**
 * Simplified page transition wrapper using CSS animations
 * Removed framer-motion to eliminate render-blocking JS
 * CSS animations are defined in index.css (.page-enter)
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="w-full page-enter">
      {children}
    </div>
  );
}
