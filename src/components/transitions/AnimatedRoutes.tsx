import { ReactNode } from "react";

interface AnimatedRoutesProps {
  children: ReactNode;
}

/**
 * Simplified wrapper - removed AnimatePresence to eliminate render-blocking transitions
 * Page transitions now use CSS animations via .page-enter class for better performance
 */
export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  return <>{children}</>;
}
