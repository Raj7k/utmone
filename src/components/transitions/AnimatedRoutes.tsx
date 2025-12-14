import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";

interface AnimatedRoutesProps {
  children: ReactNode;
}

/**
 * Wraps Routes with AnimatePresence to enable page transitions
 * Exit animations complete before enter animations begin (mode="wait")
 */
export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync" initial={false}>
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
