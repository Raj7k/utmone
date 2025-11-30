import { useState, useEffect } from "react";
import { getTextMode } from "@/utils/textFormatter";

export const useTextMode = () => {
  const [mode, setMode] = useState<'minimal' | 'grammar'>('minimal');
  
  useEffect(() => {
    // Set initial mode
    setMode(getTextMode());
    
    // Listen for mode changes
    const handler = () => setMode(getTextMode());
    window.addEventListener('text-mode-change', handler);
    window.addEventListener('storage', handler);
    
    return () => {
      window.removeEventListener('text-mode-change', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);
  
  return mode;
};
