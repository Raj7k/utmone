import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to let exit animation complete before scrolling
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};
